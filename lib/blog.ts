import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Blog content loader and pure Markdown parser.
 *
 * Posts live in `content/blog/<slug>.md` with a small YAML-ish frontmatter
 * block. The DSH "blog writer" plugin writes these files, so the parser has to
 * be tolerant: one malformed file must never crash the listing or a build.
 *
 * Everything in this module is server-only (it touches the filesystem) and the
 * parsing helpers are pure so they can be unit tested without a build.
 */

export const BLOG_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const BLOG_README_FILENAME = "readme.md";
export const BLOG_WORDS_PER_MINUTE = 200;

const MAX_SLUG_LENGTH = 160;
const MAX_TAGS = 24;
const MAX_TAG_LENGTH = 48;

const THAI_CHARACTER_PATTERN = /[\u0e00-\u0e7f]/g;
const LATIN_WORD_PATTERN = /[A-Za-z0-9]+(?:['\u2019-][A-Za-z0-9]+)*/g;

const FRONTMATTER_KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_-]*$/;
const ISO_DATE_PATTERN =
  /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:[T ](?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,9})?)?(?:Z|[+-](?:[01]\d|2[0-3]):?[0-5]\d)?)?$/;

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export type FrontmatterValue = string | string[] | boolean;

export type BlogFrontmatter = {
  title: string;
  description: string;
  /** ISO 8601 date, kept in the form the author wrote it. */
  date: string;
  tags: string[];
  draft: boolean;
  source?: string;
  sessionId?: string;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  body: string;
  readingMinutes: number;
};

export type MarkdownInline =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "strong"; value: string }
  | { type: "em"; value: string }
  | { type: "link"; value: string; href: string };

export type MarkdownBlock =
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "code"; language: string; code: string }
  | { type: "hr" };

/* -------------------------------------------------------------------------- */
/* Slugs                                                                      */
/* -------------------------------------------------------------------------- */

export function isValidBlogSlug(value: string): boolean {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= MAX_SLUG_LENGTH &&
    BLOG_SLUG_PATTERN.test(value)
  );
}

/* -------------------------------------------------------------------------- */
/* Frontmatter                                                                */
/* -------------------------------------------------------------------------- */

const SIMPLE_ESCAPES: Record<string, string> = {
  "\\": "\\",
  '"': '"',
  "'": "'",
  n: "\n",
  r: "\r",
  t: "\t",
};

function unquote(raw: string): string {
  const quote = raw[0];
  if ((quote === '"' || quote === "'") && raw.length >= 2 && raw[raw.length - 1] === quote) {
    const inner = raw.slice(1, -1);
    if (quote === '"') {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed === "string") return parsed;
      } catch {
        // Fall through to the tolerant unescape below.
      }
    }
    let result = "";
    for (let index = 0; index < inner.length; index += 1) {
      const char = inner[index];
      if (char === "\\" && index + 1 < inner.length) {
        const escaped = inner[index + 1];
        if (escaped === "u" && index + 5 < inner.length) {
          const hex = inner.slice(index + 2, index + 6);
          if (/^[0-9a-fA-F]{4}$/.test(hex)) {
            result += String.fromCharCode(Number.parseInt(hex, 16));
            index += 5;
            continue;
          }
        }
        const mapped = SIMPLE_ESCAPES[escaped];
        if (mapped !== undefined) {
          result += mapped;
          index += 1;
          continue;
        }
        result += escaped;
        index += 1;
        continue;
      }
      result += char;
    }
    return result;
  }
  return raw;
}

function parseStringArray(raw: string): string[] {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("[")) return [];

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((entry): entry is string => typeof entry === "string")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
    }
  } catch {
    // Fall back to a comma split for hand-written arrays without valid JSON.
    const inner = trimmed.replace(/^\[/, "").replace(/\]$/, "");
    return inner
      .split(",")
      .map((entry) => unquote(entry.trim()).trim())
      .filter((entry) => entry.length > 0);
  }

  return [];
}

/**
 * Parse a single frontmatter value.
 *
 * Supports double/single quoted strings (with escapes), inline JSON arrays,
 * booleans, and unquoted strings. Always returns a value instead of throwing so
 * one bad attribute cannot break a page.
 */
export function parseFrontmatterValue(raw: string): FrontmatterValue {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return "";

  if (trimmed.startsWith("[")) {
    const values = parseStringArray(trimmed);
    return values.slice(0, MAX_TAGS).map((value) => value.slice(0, MAX_TAG_LENGTH));
  }

  if (/^true$/i.test(trimmed)) return true;
  if (/^false$/i.test(trimmed)) return false;

  if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
    return unquote(trimmed);
  }

  return trimmed;
}

export function parseFrontmatterAttributes(
  rawFrontmatter: string,
): Record<string, FrontmatterValue> {
  const attributes: Record<string, FrontmatterValue> = {};
  for (const line of rawFrontmatter.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!FRONTMATTER_KEY_PATTERN.test(key)) continue;
    attributes[key] = parseFrontmatterValue(rawValue);
  }
  return attributes;
}

export type SplitFrontmatterResult = {
  attributes: Record<string, FrontmatterValue>;
  body: string;
};

/**
 * Split a Markdown file into frontmatter attributes and body.
 *
 * Returns `null` when the file has no `---` delimited frontmatter so callers
 * can skip it. The body is trimmed of surrounding blank lines.
 */
export function splitFrontmatter(source: string): SplitFrontmatterResult | null {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const lines = normalized.split("\n");
  if (lines[0]?.trim() !== "---") return null;

  let closingIndex = -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].trim() === "---") {
      closingIndex = index;
      break;
    }
  }
  if (closingIndex === -1) return null;

  return {
    attributes: parseFrontmatterAttributes(lines.slice(1, closingIndex).join("\n")),
    body: lines
      .slice(closingIndex + 1)
      .join("\n")
      .trim(),
  };
}

/* -------------------------------------------------------------------------- */
/* Dates, tags, reading time                                                  */
/* -------------------------------------------------------------------------- */

export function isIso8601Date(value: string): boolean {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!ISO_DATE_PATTERN.test(trimmed)) return false;

  const datePart = trimmed.slice(0, 10);
  const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  if (day > daysInMonth[month - 1]) return false;

  return !Number.isNaN(Date.parse(trimmed));
}

/** Format an ISO date as e.g. "August 25, 2026" using its calendar date. */
export function formatBlogDate(date: string): string {
  const calendarDate = date.trim().slice(0, 10);
  const match = calendarDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return date;
  const [, year, month, day] = match;
  const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(parsed);
}

export function normalizeTags(value: FrontmatterValue | undefined): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const tag of value) {
    const trimmed = tag.trim().slice(0, MAX_TAG_LENGTH);
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(trimmed);
    if (tags.length >= MAX_TAGS) break;
  }
  return tags;
}

/**
 * Approximate reading time from Markdown text.
 *
 * Latin scripts are counted as words; Thai has no word spaces, so Thai
 * characters are converted to an approximate word count (average Thai word is
 * roughly five characters). Always returns at least one minute.
 */
export function estimateReadingMinutes(source: string): number {
  const latinWords = source.match(LATIN_WORD_PATTERN)?.length ?? 0;
  const thaiCharacters = source.match(THAI_CHARACTER_PATTERN)?.length ?? 0;
  const words = latinWords + Math.ceil(thaiCharacters / 5);
  return Math.max(1, Math.ceil(words / BLOG_WORDS_PER_MINUTE));
}

/* -------------------------------------------------------------------------- */
/* Markdown parsing (pure)                                                    */
/* -------------------------------------------------------------------------- */

const ESCAPABLE_CHARACTERS = "\\`*_{}[]()#+-.!>|~\"";

function isWordCharacter(value: string | undefined): boolean {
  return value !== undefined && /[A-Za-z0-9]/.test(value);
}

/**
 * Allow only inert link targets. Raw HTML is never rendered (React escapes all
 * text), and `javascript:`/`data:`/`vbscript:` URLs are rejected.
 */
export function sanitizeLinkHref(href: string): string | null {
  const value = href.trim();
  if (!value) return null;

  const compact = value.replace(/[\u0000-\u0020\u007f]+/g, "");
  if (/^(?:javascript|data|vbscript):/i.test(compact)) return null;
  // Protocol-relative URLs would silently navigate off-site.
  if (value.startsWith("//")) return null;

  if (/^(?:https?:\/\/|mailto:|\/|#)/i.test(value)) return value;
  if (/^\.{1,2}\//.test(value)) return value;
  if (!value.includes(":")) return value;
  return null;
}

export function parseInlineMarkdown(source: string): MarkdownInline[] {
  const tokens: MarkdownInline[] = [];
  let buffer = "";
  let index = 0;

  const flushText = () => {
    if (buffer.length > 0) {
      tokens.push({ type: "text", value: buffer });
      buffer = "";
    }
  };

  while (index < source.length) {
    const char = source[index];

    if (
      char === "\\" &&
      index + 1 < source.length &&
      ESCAPABLE_CHARACTERS.includes(source[index + 1])
    ) {
      buffer += source[index + 1];
      index += 2;
      continue;
    }

    if (char === "`") {
      const closing = source.indexOf("`", index + 1);
      if (closing !== -1 && closing > index + 1) {
        flushText();
        tokens.push({ type: "code", value: source.slice(index + 1, closing) });
        index = closing + 1;
        continue;
      }
      buffer += char;
      index += 1;
      continue;
    }

    if (char === "[") {
      const match = source
        .slice(index)
        .match(/^\[([^\]]*)\]\(\s*([^)\s]+)(?:\s+"[^"]*")?\s*\)/);
      if (match) {
        const [, label, rawHref] = match;
        const href = sanitizeLinkHref(rawHref);
        flushText();
        if (href) {
          tokens.push({ type: "link", value: label, href });
        } else {
          tokens.push({ type: "text", value: `[${label}](${rawHref})` });
        }
        index += match[0].length;
        continue;
      }
      buffer += char;
      index += 1;
      continue;
    }

    if (char === "*" || char === "_") {
      const marker = source[index + 1] === char ? char + char : char;
      const start = index + marker.length;
      const closing = source.indexOf(marker, start);
      const underscoreIsSafe =
        char !== "_" || (!isWordCharacter(source[index - 1]) && !isWordCharacter(source[closing + marker.length]));
      if (underscoreIsSafe && closing !== -1 && closing > start) {
        flushText();
        tokens.push({
          type: marker.length === 2 ? "strong" : "em",
          value: source.slice(start, closing),
        });
        index = closing + marker.length;
        continue;
      }
      buffer += char;
      index += 1;
      continue;
    }

    buffer += char;
    index += 1;
  }

  flushText();
  return tokens;
}

const FENCE_PATTERN = /^\s*(`{3,}|~{3,})\s*([A-Za-z0-9_+#.-]*)\s*$/;
const HEADING_PATTERN = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const HORIZONTAL_RULE_PATTERN = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/;
const BLOCKQUOTE_PATTERN = /^\s*>\s?(.*)$/;
const UNORDERED_LIST_PATTERN = /^\s*[-*+]\s+(.*)$/;
const ORDERED_LIST_PATTERN = /^\s*\d+[.)]\s+(.*)$/;

function matchListLine(line: string): { ordered: boolean; text: string } | null {
  const unordered = line.match(UNORDERED_LIST_PATTERN);
  if (unordered) return { ordered: false, text: unordered[1].trim() };
  const ordered = line.match(ORDERED_LIST_PATTERN);
  if (ordered) return { ordered: true, text: ordered[1].trim() };
  return null;
}

function isBlockStart(line: string): boolean {
  return (
    FENCE_PATTERN.test(line) ||
    HEADING_PATTERN.test(line) ||
    HORIZONTAL_RULE_PATTERN.test(line) ||
    BLOCKQUOTE_PATTERN.test(line) ||
    matchListLine(line) !== null
  );
}

/**
 * Parse a Markdown body into a small, explicit block list.
 *
 * Supported: fenced code blocks, ATX headings, horizontal rules, blockquotes,
 * ordered/unordered lists, and paragraphs. Nested lists, tables, raw HTML and
 * setext headings are intentionally not supported.
 */
export function parseMarkdown(source: string): MarkdownBlock[] {
  const lines = source.replace(/\r\n?/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim().length === 0) {
      index += 1;
      continue;
    }

    const fence = line.match(FENCE_PATTERN);
    if (fence) {
      const [, marker, language] = fence;
      const fenceCharacter = marker[0];
      const fenceLength = marker.length;
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length) {
        const candidate = lines[index].trim();
        const isClosingFence =
          candidate.length >= fenceLength &&
          candidate.split("").every((char) => char === fenceCharacter);
        if (isClosingFence) {
          index += 1;
          break;
        }
        codeLines.push(lines[index]);
        index += 1;
      }
      blocks.push({ type: "code", language, code: codeLines.join("\n") });
      continue;
    }

    const heading = line.match(HEADING_PATTERN);
    if (heading) {
      blocks.push({
        type: "heading",
        level: heading[1].length as 1 | 2 | 3 | 4 | 5 | 6,
        text: heading[2].trim(),
      });
      index += 1;
      continue;
    }

    if (HORIZONTAL_RULE_PATTERN.test(line)) {
      blocks.push({ type: "hr" });
      index += 1;
      continue;
    }

    if (BLOCKQUOTE_PATTERN.test(line)) {
      const quoteLines: string[] = [];
      while (index < lines.length) {
        const match = lines[index].match(BLOCKQUOTE_PATTERN);
        if (!match) break;
        if (match[1].trim().length > 0) quoteLines.push(match[1].trim());
        index += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    const listItem = matchListLine(line);
    if (listItem) {
      const items: string[] = [];
      const ordered = listItem.ordered;
      while (index < lines.length) {
        const current = lines[index];
        const item = matchListLine(current);
        if (item && item.ordered === ordered) {
          items.push(item.text);
          index += 1;
          continue;
        }
        const isContinuation =
          item === null &&
          current.trim().length > 0 &&
          !isBlockStart(current) &&
          !HORIZONTAL_RULE_PATTERN.test(current);
        if (isContinuation) {
          items[items.length - 1] = `${items[items.length - 1]} ${current.trim()}`;
          index += 1;
          continue;
        }
        break;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length) {
      const current = lines[index];
      if (current.trim().length === 0) break;
      if (paragraphLines.length > 0 && isBlockStart(current)) break;
      paragraphLines.push(current.trim());
      index += 1;
    }
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    }
  }

  return blocks;
}

/* -------------------------------------------------------------------------- */
/* Post parsing and loading                                                   */
/* -------------------------------------------------------------------------- */

export function parseBlogPost(slug: string, source: string): BlogPost | null {
  if (!isValidBlogSlug(slug)) return null;

  const split = splitFrontmatter(source);
  if (!split) return null;

  const { attributes, body } = split;
  const title = attributes.title;
  if (typeof title !== "string" || title.trim().length === 0) return null;

  const rawDate = attributes.date;
  if (typeof rawDate !== "string" || !isIso8601Date(rawDate)) return null;

  const rawDraft = attributes.draft;
  const draft =
    rawDraft === true ||
    (typeof rawDraft === "string" && rawDraft.trim().toLowerCase() === "true");

  const descriptionValue = attributes.description;
  const description = typeof descriptionValue === "string" ? descriptionValue.trim() : "";

  const sourceValue = attributes.source;
  const sessionIdValue = attributes.sessionId;

  return {
    slug,
    title: title.trim(),
    description,
    date: rawDate.trim(),
    tags: normalizeTags(attributes.tags),
    draft,
    ...(typeof sourceValue === "string" && sourceValue.trim().length > 0
      ? { source: sourceValue.trim() }
      : {}),
    ...(typeof sessionIdValue === "string" && sessionIdValue.trim().length > 0
      ? { sessionId: sessionIdValue.trim() }
      : {}),
    body,
    readingMinutes: estimateReadingMinutes(body),
  };
}

/** Absolute path to the checked-in blog content directory. */
export function getBlogContentDirectory(): string {
  return path.join(process.cwd(), "content", "blog");
}

function isPostFilename(filename: string): boolean {
  if (filename.startsWith(".")) return false;
  if (!filename.toLowerCase().endsWith(".md")) return false;
  if (filename.toLowerCase() === BLOG_README_FILENAME) return false;
  return true;
}

/**
 * Load every published post from a directory. Malformed files and unreadable
 * entries are skipped instead of throwing. Drafts are excluded and the result
 * is sorted by date descending (then slug) for stable output.
 */
export function loadPostsFromDirectory(directory: string): BlogPost[] {
  let filenames: string[];
  try {
    filenames = readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && isPostFilename(entry.name))
      .map((entry) => entry.name);
  } catch {
    return [];
  }

  const posts: BlogPost[] = [];
  for (const filename of filenames) {
    const slug = filename.slice(0, -".md".length);
    if (!isValidBlogSlug(slug)) continue;
    try {
      const source = readFileSync(path.join(directory, filename), "utf8");
      const post = parseBlogPost(slug, source);
      if (post && !post.draft) posts.push(post);
    } catch {
      // Skip unreadable or malformed files; the rest of the blog still renders.
    }
  }

  return posts.sort((left, right) => {
    const dateDelta = Date.parse(right.date) - Date.parse(left.date);
    if (dateDelta !== 0) return dateDelta;
    return left.slug.localeCompare(right.slug);
  });
}

/**
 * Load a single published post by slug. Returns `null` for invalid slugs,
 * unknown posts, drafts, and malformed frontmatter.
 */
export function loadPostFromDirectory(directory: string, slug: string): BlogPost | null {
  if (!isValidBlogSlug(slug)) return null;

  const resolvedDirectory = path.resolve(directory);
  const filePath = path.resolve(resolvedDirectory, `${slug}.md`);
  if (path.dirname(filePath) !== resolvedDirectory) return null;

  try {
    const source = readFileSync(filePath, "utf8");
    const post = parseBlogPost(slug, source);
    if (!post || post.draft) return null;
    return post;
  } catch {
    return null;
  }
}

/** Published posts, newest first. */
export function listPosts(): BlogPost[] {
  return loadPostsFromDirectory(getBlogContentDirectory());
}

/** A published post by slug, or `null`. */
export function getPostBySlug(slug: string): BlogPost | null {
  return loadPostFromDirectory(getBlogContentDirectory(), slug);
}
