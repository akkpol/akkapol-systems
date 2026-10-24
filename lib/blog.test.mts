import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  assignHeadingIds,
  BLOG_SLUG_PATTERN,
  collectBlogOutline,
  collectPostTags,
  estimateReadingMinutes,
  formatBlogDate,
  getAdjacentPosts,
  getRelatedPosts,
  isIso8601Date,
  isValidBlogSlug,
  loadPostFromDirectory,
  loadPostsFromDirectory,
  normalizeTags,
  parseBlogPost,
  parseFrontmatterAttributes,
  parseFrontmatterValue,
  parseInlineMarkdown,
  parseMarkdown,
  sanitizeLinkHref,
  slugifyHeading,
  splitFrontmatter,
  toBlogCardData,
} from "./blog.ts";
import type { BlogPost } from "./blog.ts";

function createTempBlogDirectory(files: Record<string, string>): string {
  const directory = mkdtempSync(path.join(os.tmpdir(), "akkapol-blog-"));
  for (const [filename, content] of Object.entries(files)) {
    writeFileSync(path.join(directory, filename), content, "utf8");
  }
  return directory;
}

function postSource(attributes: Record<string, string>, body = "Body text."): string {
  const lines = ["---"];
  for (const [key, value] of Object.entries(attributes)) lines.push(`${key}: ${value}`);
  lines.push("---", "", body);
  return lines.join("\n");
}

const validAttributes = {
  title: '"Hello World"',
  description: "A short note",
  date: "2026-10-24T10:30:00+07:00",
};

/* -------------------------------------------------------------------------- */
/* Frontmatter parsing                                                        */
/* -------------------------------------------------------------------------- */

test("splitFrontmatter returns attributes and body", () => {
  const result = splitFrontmatter(
    [
      "---",
      'title: "Hello World"',
      "description: A short note",
      "date: 2026-10-24T10:30:00+07:00",
      'tags: ["AI", "Systems"]',
      "draft: false",
      'source: "dsh"',
      "sessionId: session-42",
      "---",
      "",
      "# Heading",
      "",
      "Body text.",
      "",
    ].join("\n"),
  );

  assert.ok(result);
  assert.deepEqual(result.attributes, {
    title: "Hello World",
    description: "A short note",
    date: "2026-10-24T10:30:00+07:00",
    tags: ["AI", "Systems"],
    draft: false,
    source: "dsh",
    sessionId: "session-42",
  });
  assert.equal(result.body, "# Heading\n\nBody text.");
});

test("splitFrontmatter handles BOM and CRLF input", () => {
  const result = splitFrontmatter("\uFEFF---\r\ntitle: Test\r\n---\r\n\r\nHello\r\n");
  assert.ok(result);
  assert.equal(result.attributes.title, "Test");
  assert.equal(result.body, "Hello");
});

test("splitFrontmatter returns null without a closing delimiter", () => {
  assert.equal(splitFrontmatter("---\ntitle: Test\n\nBody."), null);
  assert.equal(splitFrontmatter(""), null);
  assert.equal(splitFrontmatter("# Just markdown\n\nNo frontmatter."), null);
});

test("quoted frontmatter strings support escapes", () => {
  assert.equal(parseFrontmatterValue('"A \\"quoted\\" \\\\ path"'), 'A "quoted" \\ path');
  assert.equal(
    parseFrontmatterValue('"\\u0e2a\\u0e27\\u0e31\\u0e2a\\u0e14\\u0e35"'),
    "สวัสดี",
  );
  assert.equal(parseFrontmatterValue("'A single-quoted title'"), "A single-quoted title");
});

test("frontmatter values support inline arrays and booleans", () => {
  assert.deepEqual(parseFrontmatterValue('["AI","Systems"," Ops "]'), ["AI", "Systems", "Ops"]);
  assert.deepEqual(parseFrontmatterValue("[AI, Systems]"), ["AI", "Systems"]);
  assert.deepEqual(parseFrontmatterValue("[]"), []);
  assert.equal(parseFrontmatterValue("true"), true);
  assert.equal(parseFrontmatterValue("TRUE"), true);
  assert.equal(parseFrontmatterValue("false"), false);
  assert.equal(parseFrontmatterValue("dsh"), "dsh");
});

test("unquoted values keep inner colons and trim whitespace", () => {
  assert.equal(
    parseFrontmatterValue("  A guide: part one  "),
    "A guide: part one",
  );
  assert.equal(parseFrontmatterValue(""), "");
});

test("parseFrontmatterAttributes ignores comments, blank lines, and invalid keys", () => {
  const attributes = parseFrontmatterAttributes(
    ["# comment", "", "title: Hello", "bad key: nope", "date: 2026-10-24"].join("\n"),
  );
  assert.deepEqual(attributes, { title: "Hello", date: "2026-10-24" });
});

/* -------------------------------------------------------------------------- */
/* Post parsing                                                               */
/* -------------------------------------------------------------------------- */

test("parseBlogPost builds a typed post with defaults", () => {
  const post = parseBlogPost("hello-world", postSource(validAttributes));
  assert.ok(post);
  assert.equal(post.slug, "hello-world");
  assert.equal(post.title, "Hello World");
  assert.equal(post.description, "A short note");
  assert.equal(post.date, "2026-10-24T10:30:00+07:00");
  assert.deepEqual(post.tags, []);
  assert.equal(post.draft, false);
  assert.equal(post.body, "Body text.");
  assert.ok(post.readingMinutes >= 1);
  assert.equal("source" in post, false);
  assert.equal("sessionId" in post, false);
});

test("parseBlogPost keeps draft, tags, source, and sessionId", () => {
  const post = parseBlogPost(
    "draft-post",
    postSource({
      ...validAttributes,
      tags: '["AI","Systems"]',
      draft: "true",
      source: "dsh",
      sessionId: "abc123",
    }),
  );
  assert.ok(post);
  assert.equal(post.draft, true);
  assert.deepEqual(post.tags, ["AI", "Systems"]);
  assert.equal(post.source, "dsh");
  assert.equal(post.sessionId, "abc123");
});

test("parseBlogPost keeps safe cover image metadata", () => {
  const post = parseBlogPost(
    "cover-post",
    postSource({
      ...validAttributes,
      image: '"/images/blog/cover-post/cover.png"',
      imageAlt: '"A branded cover for the note"',
    }),
  );
  assert.ok(post);
  assert.equal(post.image, "/images/blog/cover-post/cover.png");
  assert.equal(post.imageAlt, "A branded cover for the note");
});

test("parseBlogPost drops unsafe or external cover images", () => {
  const traversal = parseBlogPost(
    "bad-image",
    postSource({ ...validAttributes, image: '"/images/blog/../secret.png"' }),
  );
  const external = parseBlogPost(
    "external-image",
    postSource({ ...validAttributes, image: '"https://example.com/cover.png"' }),
  );
  assert.ok(traversal);
  assert.ok(external);
  assert.equal("image" in traversal, false);
  assert.equal("image" in external, false);
});

test("parseBlogPost tolerates a quoted boolean draft value", () => {
  const quotedDraft = parseBlogPost(
    "quoted-draft",
    postSource({ ...validAttributes, draft: '"true"' }),
  );
  assert.ok(quotedDraft);
  assert.equal(quotedDraft.draft, true);

  const quotedPublished = parseBlogPost(
    "quoted-published",
    postSource({ ...validAttributes, draft: '"false"' }),
  );
  assert.ok(quotedPublished);
  assert.equal(quotedPublished.draft, false);
});

test("parseBlogPost rejects malformed posts", () => {
  assert.equal(parseBlogPost("missing-title", postSource({ date: "2026-10-24" })), null);
  assert.equal(parseBlogPost("empty-title", postSource({ title: '""', date: "2026-10-24" })), null);
  assert.equal(parseBlogPost("missing-date", postSource({ title: '"Hello"' })), null);
  assert.equal(parseBlogPost("bad-date", postSource({ ...validAttributes, date: "August 2026" })), null);
  assert.equal(parseBlogPost("out-of-range-date", postSource({ ...validAttributes, date: "2026-13-01" })), null);
  assert.equal(parseBlogPost("impossible-date", postSource({ ...validAttributes, date: "2026-02-30" })), null);
  assert.equal(parseBlogPost("no-frontmatter", "# Hello"), null);
  assert.equal(parseBlogPost("Bad Slug", postSource(validAttributes)), null);
  assert.equal(parseBlogPost("../escape", postSource(validAttributes)), null);
});

test("normalizeTags trims, de-duplicates, and drops empty entries", () => {
  assert.deepEqual(normalizeTags(["AI", " ai ", "", "Systems", "SYSTEMS"]), ["AI", "Systems"]);
  assert.deepEqual(normalizeTags(undefined), []);
  assert.deepEqual(normalizeTags("AI"), []);
});

/* -------------------------------------------------------------------------- */
/* Slugs and dates                                                            */
/* -------------------------------------------------------------------------- */

test("validates blog slugs", () => {
  const valid = ["hello", "hello-world", "a1-b2-c3", "2026-10-24"];
  for (const slug of valid) {
    assert.equal(isValidBlogSlug(slug), true, slug);
    assert.equal(BLOG_SLUG_PATTERN.test(slug), true, slug);
  }

  const invalid = [
    "",
    "Hello",
    "hello_world",
    "hello world",
    "-hello",
    "hello-",
    "hello--world",
    "../escape",
    "a/b",
    "hello.md",
    "x".repeat(161),
  ];
  for (const slug of invalid) {
    assert.equal(isValidBlogSlug(slug), false, slug);
  }
});

test("isIso8601Date accepts ISO 8601 dates and rejects other formats", () => {
  const valid = [
    "2026-10-24",
    "2026-10-24T10:30:00Z",
    "2026-10-24T10:30:00.123Z",
    "2026-10-24T10:30:00+07:00",
    "2026-10-24 10:30:00+0700",
    "2024-02-29",
  ];
  for (const value of valid) assert.equal(isIso8601Date(value), true, value);

  const invalid = [
    "",
    "24/10/2026",
    "2026-10-24T25:00:00Z",
    "2026-13-01",
    "2026-02-30",
    "2024-02-30",
    "2026-02-29",
    "2026-04-31",
    "October 24, 2026",
  ];
  for (const value of invalid) assert.equal(isIso8601Date(value), false, value);
});

test("formatBlogDate uses the calendar date without timezone shifts", () => {
  assert.equal(formatBlogDate("2026-08-25"), "August 25, 2026");
  assert.equal(formatBlogDate("2026-10-24T23:30:00-05:00"), "October 24, 2026");
  assert.equal(formatBlogDate("not-a-date"), "not-a-date");
});

/* -------------------------------------------------------------------------- */
/* Reading time                                                               */
/* -------------------------------------------------------------------------- */

test("estimateReadingMinutes returns at least one minute", () => {
  assert.equal(estimateReadingMinutes(""), 1);
  assert.equal(estimateReadingMinutes("Short note."), 1);
});

test("estimateReadingMinutes counts latin words at 200 wpm", () => {
  assert.equal(estimateReadingMinutes(Array.from({ length: 400 }, () => "word").join(" ")), 2);
  assert.equal(estimateReadingMinutes(Array.from({ length: 200 }, () => "word").join(" ")), 1);
});

test("estimateReadingMinutes accounts for Thai text without spaces", () => {
  const thai = "ระบบ".repeat(2000);
  assert.ok(estimateReadingMinutes(thai) >= 2);
});

/* -------------------------------------------------------------------------- */
/* Markdown parsing                                                           */
/* -------------------------------------------------------------------------- */

test("parseMarkdown parses headings, paragraphs, lists, quotes, code, and rules", () => {
  const blocks = parseMarkdown(
    [
      "# Title",
      "",
      "First line",
      "continues here.",
      "",
      "- one",
      "- two",
      "",
      "1. first",
      "2. second",
      "",
      "> quoted line",
      "> second line",
      "",
      "```ts",
      "const value = 1;",
      "",
      "  indented();",
      "```",
      "",
      "---",
      "",
      "## Sub title",
      "###### Tiny",
    ].join("\n"),
  );

  assert.deepEqual(blocks, [
    { type: "heading", level: 1, text: "Title" },
    { type: "paragraph", text: "First line continues here." },
    { type: "list", ordered: false, items: ["one", "two"] },
    { type: "list", ordered: true, items: ["first", "second"] },
    { type: "blockquote", text: "quoted line second line" },
    { type: "code", language: "ts", code: "const value = 1;\n\n  indented();" },
    { type: "hr" },
    { type: "heading", level: 2, text: "Sub title" },
    { type: "heading", level: 6, text: "Tiny" },
  ]);
});

test("parseMarkdown folds list continuation lines into the previous item", () => {
  const blocks = parseMarkdown("- first item\n  continued\n- second item");
  assert.deepEqual(blocks, [
    { type: "list", ordered: false, items: ["first item continued", "second item"] },
  ]);
});

test("parseMarkdown keeps an unterminated fenced block as code", () => {
  const blocks = parseMarkdown("```\nconst value = 1;");
  assert.deepEqual(blocks, [{ type: "code", language: "", code: "const value = 1;" }]);
});

test("parseInlineMarkdown parses emphasis, code, and links", () => {
  const tokens = parseInlineMarkdown(
    'Plain **bold** and *italic* and `code` plus [docs](https://example.com "Docs") end.',
  );
  assert.deepEqual(tokens, [
    { type: "text", value: "Plain " },
    { type: "strong", value: "bold" },
    { type: "text", value: " and " },
    { type: "em", value: "italic" },
    { type: "text", value: " and " },
    { type: "code", value: "code" },
    { type: "text", value: " plus " },
    { type: "link", value: "docs", href: "https://example.com" },
    { type: "text", value: " end." },
  ]);
});

test("parseInlineMarkdown does not italicize underscores inside words", () => {
  const tokens = parseInlineMarkdown("use snake_case_names carefully and _real italic_");
  assert.deepEqual(tokens, [
    { type: "text", value: "use snake_case_names carefully and " },
    { type: "em", value: "real italic" },
  ]);
});

test("parseInlineMarkdown honors backslash escapes", () => {
  const tokens = parseInlineMarkdown("\\*not italic\\* and \\`not code\\`");
  assert.deepEqual(tokens, [{ type: "text", value: "*not italic* and `not code`" }]);
});

test("parseInlineMarkdown leaves raw HTML as inert text", () => {
  const tokens = parseInlineMarkdown('<script>alert("x")</script> and <b>bold?</b>');
  assert.equal(tokens.every((token) => token.type === "text"), true);
  assert.equal(
    tokens.map((token) => (token.type === "text" ? token.value : "")).join(""),
    '<script>alert("x")</script> and <b>bold?</b>',
  );
});

test("parseInlineMarkdown rejects unsafe link targets", () => {
  const tokens = parseInlineMarkdown("[click](javascript:alert(1))");
  assert.equal(tokens.some((token) => token.type === "link"), false);
  assert.equal(
    tokens.map((token) => (token.type === "text" ? token.value : "")).join(""),
    "[click](javascript:alert(1))",
  );
});

test("sanitizeLinkHref allows only inert targets", () => {
  const allowed = [
    "https://example.com",
    "http://example.com",
    "mailto:akkapol.kumpapug@gmail.com",
    "/blog/hello",
    "#section",
    "hello-world",
    "./relative",
    "../relative",
  ];
  for (const href of allowed) assert.equal(sanitizeLinkHref(href), href, href);

  const blocked = [
    "",
    "javascript:alert(1)",
    " JavaScript:alert(1)",
    "java\tscript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD4=",
    "vbscript:msgbox(1)",
    "//evil.example.com",
  ];
  for (const href of blocked) assert.equal(sanitizeLinkHref(href), null, href);
});

/* -------------------------------------------------------------------------- */
/* Filesystem loader                                                          */
/* -------------------------------------------------------------------------- */

test("loadPostsFromDirectory excludes drafts, README, and malformed files", () => {
  const directory = createTempBlogDirectory({
    "newest.md": postSource({ title: '"Newest"', date: "2026-03-01T00:00:00Z" }),
    "older.md": postSource({ title: '"Older"', date: "2026-01-01T00:00:00Z" }),
    "draft-post.md": postSource({ title: '"Draft"', date: "2026-12-01", draft: "true" }),
    "README.md": postSource({ title: '"Readme"', date: "2026-12-02" }),
    "notes.txt": "not markdown",
    "broken.md": "---\ntitle: Broken\n---\n\nNo date.",
    "missing-date.md": "---\ntitle: No date\n---\n\nBody.",
    "Bad-Slug.md": postSource({ title: '"Bad slug"', date: "2026-02-01" }),
    ".hidden.md": postSource({ title: '"Hidden"', date: "2026-02-02" }),
  });

  try {
    const posts = loadPostsFromDirectory(directory);
    assert.deepEqual(
      posts.map((post) => post.slug),
      ["newest", "older"],
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("loadPostsFromDirectory sorts same-day posts by slug", () => {
  const directory = createTempBlogDirectory({
    "zulu.md": postSource({ title: '"Zulu"', date: "2026-05-01" }),
    "alpha.md": postSource({ title: '"Alpha"', date: "2026-05-01" }),
    "mike.md": postSource({ title: '"Mike"', date: "2026-05-01" }),
  });

  try {
    assert.deepEqual(
      loadPostsFromDirectory(directory).map((post) => post.slug),
      ["alpha", "mike", "zulu"],
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("loadPostsFromDirectory tolerates a missing directory", () => {
  assert.deepEqual(loadPostsFromDirectory(path.join(os.tmpdir(), "akkapol-blog-missing-dir")), []);
});

test("loadPostFromDirectory returns published posts only", () => {
  const directory = createTempBlogDirectory({
    "published.md": postSource({ title: '"Published"', date: "2026-03-01" }),
    "draft-post.md": postSource({ title: '"Draft"', date: "2026-03-02", draft: "true" }),
    "broken.md": "no frontmatter here",
  });

  try {
    assert.equal(loadPostFromDirectory(directory, "published")?.title, "Published");
    assert.equal(loadPostFromDirectory(directory, "draft-post"), null);
    assert.equal(loadPostFromDirectory(directory, "unknown"), null);
    assert.equal(loadPostFromDirectory(directory, "broken"), null);
    assert.equal(loadPostFromDirectory(directory, "../published"), null);
    assert.equal(loadPostFromDirectory(directory, "Published"), null);
    assert.equal(loadPostFromDirectory(directory, ""), null);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

/* -------------------------------------------------------------------------- */
/* Heading anchors, outline, tags, and post relationships                     */
/* -------------------------------------------------------------------------- */

type TestPostOptions = {
  slug: string;
  date: string;
  title?: string;
  description?: string;
  tags?: string[];
  source?: string;
  body?: string;
  readingMinutes?: number;
};

function makePost({
  slug,
  date,
  title = slug,
  description = "",
  tags = [],
  source,
  body = "Body.",
  readingMinutes = 1,
}: TestPostOptions): BlogPost {
  return {
    slug,
    title,
    description,
    date,
    tags,
    draft: false,
    body,
    readingMinutes,
    ...(source ? { source } : {}),
  };
}

test("slugifyHeading produces stable, unicode-safe anchors", () => {
  assert.equal(
    slugifyHeading("Building a DSH conversation view"),
    "building-a-dsh-conversation-view",
  );
  assert.equal(slugifyHeading("What's next?"), "whats-next");
  assert.equal(slugifyHeading("A/B testing"), "ab-testing");
  assert.equal(slugifyHeading("`code` and **bold**"), "code-and-bold");
  assert.equal(slugifyHeading("บันทึกภาษาไทย"), "บันทึกภาษาไทย");
  assert.equal(slugifyHeading("   "), "section");
  assert.equal(slugifyHeading("!!!"), "section");
  assert.equal(slugifyHeading("🎉"), "section");
});

test("assignHeadingIds de-duplicates repeated headings by block index", () => {
  const blocks = parseMarkdown("## Intro\n\nText\n\n## Intro\n\nMore\n\n### Deep\n");
  const ids = assignHeadingIds(blocks);

  assert.deepEqual([...ids.keys()], [0, 2, 4]);
  assert.deepEqual([...ids.values()], ["intro", "intro-2", "deep"]);
});

test("collectBlogOutline filters deep headings and keeps renderer ids", () => {
  const blocks = parseMarkdown(
    "# Lead\n\n## Setup\n\n### Details\n\n#### Too deep\n\n## Setup\n",
  );
  const ids = assignHeadingIds(blocks);
  const outline = collectBlogOutline(blocks);

  assert.deepEqual(outline, [
    { id: "lead", text: "Lead", level: 1 },
    { id: "setup", text: "Setup", level: 2 },
    { id: "details", text: "Details", level: 3 },
    { id: "setup-2", text: "Setup", level: 2 },
  ]);
  assert.equal(ids.get(4), "setup-2");
});

test("collectPostTags de-duplicates by case and sorts by count", () => {
  const posts = [
    makePost({ slug: "a", date: "2026-01-01", tags: ["AI", "Systems"] }),
    makePost({ slug: "b", date: "2026-01-02", tags: ["ai", "Blog"] }),
    makePost({ slug: "c", date: "2026-01-03", tags: ["AI"] }),
  ];

  assert.deepEqual(collectPostTags(posts), [
    { tag: "AI", count: 3 },
    { tag: "Blog", count: 1 },
    { tag: "Systems", count: 1 },
  ]);
});

test("getAdjacentPosts returns newer and older siblings with bounds", () => {
  const newest = makePost({ slug: "newest", date: "2026-03-01" });
  const middle = makePost({ slug: "middle", date: "2026-02-01" });
  const oldest = makePost({ slug: "oldest", date: "2026-01-01" });
  const posts = [middle, oldest, newest];

  assert.deepEqual(getAdjacentPosts(posts, "middle"), { newer: newest, older: oldest });
  assert.deepEqual(getAdjacentPosts(posts, "newest"), { newer: null, older: middle });
  assert.deepEqual(getAdjacentPosts(posts, "oldest"), { newer: middle, older: null });
  assert.deepEqual(getAdjacentPosts(posts, "missing"), { newer: null, older: null });
});

test("getRelatedPosts ranks by shared tags then recency", () => {
  const current = makePost({ slug: "current", date: "2026-04-01", tags: ["AI", "Workflow"] });
  const twoShared = makePost({ slug: "two-shared", date: "2026-01-01", tags: ["AI", "Workflow"] });
  const oneOld = makePost({ slug: "one-old", date: "2026-02-01", tags: ["AI"] });
  const oneNew = makePost({ slug: "one-new", date: "2026-03-01", tags: ["workflow"] });
  const unrelated = makePost({ slug: "unrelated", date: "2026-03-02", tags: ["Design"] });
  const posts = [current, oneOld, unrelated, oneNew, twoShared];

  assert.deepEqual(
    getRelatedPosts(posts, "current").map((post) => post.slug),
    ["two-shared", "one-new"],
  );
  assert.deepEqual(
    getRelatedPosts(posts, "current", 3).map((post) => post.slug),
    ["two-shared", "one-new", "one-old"],
  );
  assert.deepEqual(getRelatedPosts(posts, "current", 0), []);
  assert.deepEqual(getRelatedPosts(posts, "unrelated"), []);
  assert.deepEqual(getRelatedPosts(posts, "missing"), []);
});

test("toBlogCardData serializes card fields without the body", () => {
  const post = makePost({
    slug: "note",
    date: "2026-10-24T10:30:00+07:00",
    title: "Note",
    description: "A note.",
    tags: ["AI"],
    source: "dsh",
    readingMinutes: 3,
  });

  const card = toBlogCardData(post);
  assert.deepEqual(card, {
    slug: "note",
    title: "Note",
    description: "A note.",
    date: "2026-10-24T10:30:00+07:00",
    dateLabel: "October 24, 2026",
    readingMinutes: 3,
    tags: ["AI"],
    aiAssisted: true,
  });
  assert.equal("body" in card, false);
  assert.equal(toBlogCardData(makePost({ slug: "plain", date: "2026-10-24" })).aiAssisted, false);
});
