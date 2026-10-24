# Blog content

Each published post is a single Markdown file in this directory:

```
content/blog/<slug>.md
```

Posts are written by the DSH blog-writer plugin (and can also be added by hand).
`README.md` in this directory is documentation only and is **not** loaded as a
post; the same applies to hidden files (names starting with `.`) and anything
that is not a `.md` file.

## File format

```md
---
title: "Building a small system that survives real operations"
description: "A short summary that shows up on cards, search results, and link previews."
date: 2026-10-24T10:30:00+07:00
tags: ["AI", "Systems", "Operations"]
draft: false
source: "dsh"
sessionId: "optional-session-id"
---

Markdown body starts here.

## A heading

Paragraphs, **bold**, *italic*, `inline code`, [links](https://example.com),
lists, blockquotes, fenced code blocks, and horizontal rules are supported.
```

### Frontmatter contract

| Field         | Required | Type                 | Notes                                                        |
| ------------- | -------- | -------------------- | ------------------------------------------------------------ |
| `title`       | yes      | string               | Quoted or unquoted. Must not be empty.                       |
| `description` | no       | string               | Used as the card summary, meta description, and social text. |
| `date`        | yes      | ISO 8601 string      | e.g. `2026-10-24`, `2026-10-24T10:30:00+07:00`, or `...Z`.   |
| `tags`        | no       | inline JSON array    | e.g. `["AI","Systems"]`. Duplicates and empty values dropped. |
| `draft`       | no       | boolean              | `true` keeps the post out of the index, sitemap, and routes. |
| `source`      | no       | string               | `"dsh"` marks an AI-assisted post and shows a small note.    |
| `sessionId`   | no       | string               | Optional DSH conversation identifier.                        |

The frontmatter block must start on the first line with `---` and end with a
line containing only `---`. Files that are missing a required field, have an
invalid slug, or have an invalid/unparseable date are skipped silently so one
bad post never breaks the whole blog.

### Slugs

The filename (without `.md`) is the URL slug and must match:

```
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

Examples: `building-practical-ai-systems`, `2026-year-in-review`. Uppercase
letters, underscores, spaces, slashes, and leading/trailing/consecutive dashes
are rejected. A post is served at `/blog/<slug>`.

### Markdown support

The renderer is intentionally small and safe: it emits React elements only and
never injects raw HTML. Supported syntax:

- ATX headings (`#` through `######`)
- paragraphs (wrapped lines are joined)
- ordered and unordered lists
- blockquotes (`>`)
- fenced code blocks with an optional language label
- inline code, bold, italic, links, horizontal rules

Raw HTML in a post is displayed as text, and unsafe link targets (for example
`javascript:` URLs) are rendered as plain text. Nested lists, tables, images,
and setext headings are not supported.

## When do new posts appear?

- `next dev`: new or edited files under `content/blog/` are read on every
  request, so a post written while the dev server is running appears without a
  restart.
- A production build only contains the files present at build time, and
  `sitemap.xml` is generated then. Publish a new post with a rebuild/redeploy.

## Reading time

Reading time is derived from the body at load time (about 200 words per minute,
with Thai characters counted approximately). It is intentionally not stored in
frontmatter so it can never fall out of sync with the body.
