# dsh-blog-writer

A DSH (DeepSeek Harness) bundle with two halves:

- **Host** (`index.js`, ESM, `inject: ['webServer']`) registers two exact HTTP
  routes on the Harness web server — one writes a Markdown post with blog
  frontmatter, one reports the plugin's configuration.
- **Client** (`client.js`, plain browser bundle, `require('react')` only)
  contributes a compact **Save answer to blog** entry below the conversation
  composer. It pre-fills an inline editor from the last settled assistant
  answer, then POSTs the post to the Host route.

Written for DSH `0.2.1-rc.3` and the Akkapol Systems blog
(`content/blog/<slug>.md`). No dependencies, no build step.

## Files

| File | Purpose |
| --- | --- |
| `package.json` | bundle manifest: `dsh.bundle.patch`, `dsh.client` (`platform: "web"`), exports (including `./package.json`), display resources |
| `cordis.patch.yml` | inserts the `dsh-blog-writer` row with `contentDir` / `siteUrl` |
| `index.js` | Host half: `POST /api/plugins/blog-writer/posts`, `GET /api/plugins/blog-writer/health` |
| `client.js` | Client half: `conversation.composer.dock` entry, editor, locale dictionaries |
| `locale/en.json`, `locale/th.json` | Plugin Manager `meta.title` / `meta.description` for English and Thai |
| `icon.svg` | original pen + open-notebook icon (valid SVG, no external references) |
| `README.md` | this file |

The runtime UI dictionaries live in `client.js` (the browser bundle cannot read
the package's JSON files); the `locale/*.json` files are display metadata read
by the Plugin Manager without activating the plugin.

## Install

Install it like any DSH bundle — **do not** hand-edit a profile's
`package.json` or `cordis.patch.yml`.

Desktop app (recommended): open **Plugins**, choose to install a bundle from a
local directory, and select this directory
(`D:\Projects\akkapol-systems\dsh-plugins\dsh-blog-writer`). The app installs
the package and selects the bundle in the `desktop` profile.

CLI profile:

```powershell
$dsh = 'C:\Users\akkap\AppData\Local\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd'
& $dsh plugin --profile <profile> add 'D:\Projects\akkapol-systems\dsh-plugins\dsh-blog-writer'
& $dsh --profile <profile> --dump-config | Select-String dsh-blog-writer
```

`dsh plugin ... add` installs the package as a profile dependency and adds a
newly installed bundle to the profile's `dsh.profile.bundles` list. For a web
UI the profile must also carry the `@deepseek-ai/dsh-web-app` bundle (shipped
`web` profile, or any profile initialized from that template).

After installing into the `desktop` profile with
`dsh plugin --profile desktop add <absolute plugin dir>` (or through the Plugin
Manager), restart DSH Desktop or reload the GUI so the new bundle manifest and
client bundle load; client HMR only covers artifact changes, not a newly added
bundle.

Disable without uninstalling: set the row `disabled: true` in the profile's
`cordis.patch.yml` (or toggle it in the Plugin Manager).

## Configuration

The row config belongs to the Host half:

```yaml
- id: dsh-blog-writer
  config:
    contentDir: 'D:/Projects/akkapol-systems/content/blog' # required, absolute
    siteUrl: 'http://localhost:3000'                      # optional, http(s) origin
```

A patch replaces the row's whole `config`, so restate every key you keep. An
invalid `contentDir`/`siteUrl` never crashes the Host: activation logs a
warning, the health route reports the problems, and every write answers
`500 {"ok":false,"error":{"code":"CONFIG_INVALID",…}}` with a readable message.

- `contentDir` — absolute directory for `<slug>.md` files; created on first
  save. The resolved file path is proven to stay inside this directory.
- `siteUrl` — public blog origin used for the `url` field in responses. Empty
  returns a relative `/blog/<slug>` URL.

## HTTP API

All responses are `Cache-Control: no-store` and JSON. The routes are exact
entries under `/api/...`, so they answer before the generic `/api` gateway
prefix.

### `GET /api/plugins/blog-writer/health`

```json
{
  "ok": true,
  "name": "dsh-blog-writer",
  "version": "0.1.0",
  "configuration": { "contentDir": "D:\\Projects\\akkapol-systems\\content\\blog", "siteUrl": "http://localhost:3000", "problems": [] }
}
```

### `POST /api/plugins/blog-writer/posts`

Request body (`application/json`, max 256 KiB):

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | required, ≤ 200 chars |
| `slug` | string | required, `^[a-z0-9]+(?:-[a-z0-9]+)*$`, ≤ 100 chars |
| `body` | string | required Markdown; `\r\n` normalized to `\n` |
| `description` | string | optional, ≤ 500 chars |
| `tags` | string[] | optional, ≤ 12 tags, ≤ 40 chars each |
| `draft` | boolean | optional, default `false` |
| `date` | string | optional ISO 8601 with offset; defaults to now |
| `sessionId` | string | optional `[A-Za-z0-9._:-]{1,200}` |
| `overwrite` | boolean | optional, default `false` |

Success (`200`):

```json
{ "ok": true, "slug": "my-post", "path": "D:\\...\\content\\blog\\my-post.md", "url": "http://localhost:3000/blog/my-post", "created": true, "draft": false }
```

The success card shows the post link for published posts; when `draft` is
`true` it says **Draft — not listed on /blog** instead of linking a URL that the
index does not show.

Failure envelope: `{ "ok": false, "error": { "code": "…", "message": "…" } }`
with `400` validation, `403` cross-origin, `404` n/a (exact route), `405`
wrong method, `409` existing file (`EXISTS`, retry with `overwrite: true`),
`413` oversized body, `415` wrong `Content-Type`, `500` config/internal.

Same-origin: when the request carries `Origin`, its host must equal the
request's `Host` header. Requests without `Origin` (local curl/tooling) are
accepted, so keep the Harness web server bound to loopback and do not publish
it through a public proxy.

Writes are atomic: a unique temp file in `contentDir` is renamed over the
target. Concurrent requests for one slug are serialized in-process, so the
`overwrite: false` existence check cannot race another request from the same
Host.

## Frontmatter written

Exactly the shape the blog parser consumes, LF endings, one trailing newline:

```markdown
---
title: "Shipping a DSH plugin"
description: "Notes from building the blog writer."
date: "2026-10-24T23:40:00+07:00"
tags: ["AI", "Systems"]
draft: false
source: "dsh"
sessionId: "4b4c1a2e-…"
---

## Body starts here
```

Optional fields (`description`, `tags`, `sessionId`) are omitted when empty.
Values are JSON-escaped inside YAML double quotes, so quotes, newlines and
non-ASCII text are preserved.

## Using it

1. Ask the assistant a question and let the answer finish.
2. Below the composer, click **Save answer to blog**.
3. Edit title / slug / description / tags / body (Markdown), optionally tick
   **Save as draft**, then **Save**.
4. On success the editor shows the post URL (when `siteUrl` is configured and
   the post is not a draft) and the absolute file path; drafts show a
   "not listed" note; `409` offers **Overwrite existing file**.
5. Press `Escape` or **Close** to dismiss. The trigger is disabled while there
   is no settled assistant answer.

The blog side reads `content/blog/*.md` at build/request time; a new post shows
up according to that site's rendering strategy (e.g. `next build` / deploy, or
a dev server with dynamic reads).

## Locales

- Plugin Manager metadata: `locale/en.json`, `locale/th.json` (`meta.title`,
  `meta.description`).
- Runtime UI copy: English + Thai dictionaries registered through
  `ctx.locale.register(ns, locale, dict)` in `client.js`. The active locale
  falls back to English for missing keys. Thai is selectable only when a Thai
  language pack registers the `th` locale; the dictionary is already in place
  for it.

## Verification (scratch profile, no desktop profile touched)

```powershell
$dsh = 'C:\Users\akkap\AppData\Local\Programs\DeepSeek Harness\resources\runtime\cli\bin\dsh.cmd'
$env:DSH_HOME = Join-Path $env:TEMP 'dsh-blog-writer-qa\home'

# 1. compose a web scratch profile, install the bundle
& $dsh --profile scratch --from-default-profile web --dump-config | Out-Null
& $dsh plugin --profile scratch add 'D:\Projects\akkapol-systems\dsh-plugins\dsh-blog-writer'
& $dsh --profile scratch --dump-config | Select-String 'dsh-blog-writer|contentDir'

# 2. boot it on a free loopback port (--patch overrides contentDir for the test)
& $dsh --profile scratch --patch .\qa-override.yml --no-open --port 3199

# 3. check bundle delivery + routes
Invoke-WebRequest http://127.0.0.1:3199/                                            # page embeds window.__DSH_BOOT__
Invoke-WebRequest http://127.0.0.1:3199/api/plugins/blog-writer/health
Invoke-RestMethod -Method Post -ContentType 'application/json' `
  -Headers @{ Origin = 'http://127.0.0.1:3199' } `
  -Body '{"title":"Hello","slug":"hello","body":"# Hi\n\nBody."}' `
  http://127.0.0.1:3199/api/plugins/blog-writer/posts
```

The client bundle is served through the composed `/plugins/??<id>/client.js&rev=…`
route named in `window.__DSH_BOOT__` (0.2.x does not serve a bare
`/plugins/<id>/client.js` path). Client unit behavior can be exercised by
loading `client.js` in a VM with a fake `window.__ModuleLoader__`, calling the
factory and `apply()` with a fake context, and server-rendering the component
with `react-dom/server`.

## Notes and limits

- Targets DSH `0.2.1-rc.3` client contracts (`conversation.composer.dock`,
  `ctx.uiConversation` chat target, `assistant-step` chat node payload,
  `ctx.locale` 3-arg registration, `ctx.webServer` exact routes). A DSH upgrade
  that renames these needs the matching plugin update.
- The client UI is not covered by the repository's test scripts; verification
  is bundle delivery + `node --check` + a scratch-profile render/fixture harness.
- The route is intentionally unauthenticated but same-origin fenced and meant
  for a loopback Harness. Do not publish the Harness web server to untrusted
  networks with this bundle enabled.
- The blog side (`app/blog`, `lib/blog.ts`) is a separate change; this bundle
  only writes files matching the agreed frontmatter contract.
