/**
 * dsh-blog-writer — Host half.
 *
 * Registers two exact routes on the Harness web server:
 *
 *   POST /api/plugins/blog-writer/posts   write one Markdown post with frontmatter
 *   GET  /api/plugins/blog-writer/health  report the plugin's configuration state
 *
 * The routes own their full response lifecycle (the web server hands them the
 * raw node:http pair), always answer with `Cache-Control: no-store`, and never
 * touch the filesystem outside the configured absolute `contentDir`.
 *
 * The row config is passed to `apply()` by the Loader. There is no Config
 * schema, so configuration is validated in code: an invalid config never
 * crashes the Host process — it makes every write fail with a clear 500 JSON
 * error while the route stays registered.
 */

import { randomUUID } from 'node:crypto'
import { mkdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import { isAbsolute, join, relative, resolve } from 'node:path'

/** Services this plugin needs before `apply()` runs. */
export const inject = ['webServer']

const PLUGIN_NAME = 'dsh-blog-writer'
const PLUGIN_VERSION = '0.1.0'
const POSTS_PATH = '/api/plugins/blog-writer/posts'
const HEALTH_PATH = '/api/plugins/blog-writer/health'
const MAX_BODY_BYTES = 256 * 1024
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ISO_DATE_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/
const SESSION_ID_PATTERN = /^[A-Za-z0-9._:-]{1,200}$/
const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 500
const MAX_SLUG_LENGTH = 100
const MAX_TAGS = 12
const MAX_TAG_LENGTH = 40

/**
 * Validate and normalize the Loader row config.
 * @param {unknown} raw - the row's `config` value.
 * @returns {{contentDir: string|null, siteUrl: string, problems: string[]}}
 */
function normalizeConfig(raw) {
  const config = raw !== null && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const problems = []
  let contentDir = null
  const contentDirRaw = typeof config.contentDir === 'string' ? config.contentDir.trim() : ''
  if (contentDirRaw === '') {
    problems.push('contentDir is required and must be an absolute path')
  } else if (!isAbsolute(contentDirRaw)) {
    problems.push(`contentDir must be an absolute path, received ${JSON.stringify(contentDirRaw)}`)
  } else {
    contentDir = resolve(contentDirRaw)
  }
  let siteUrl = ''
  const siteUrlRaw = typeof config.siteUrl === 'string' ? config.siteUrl.trim() : ''
  if (siteUrlRaw !== '') {
    try {
      const parsed = new URL(siteUrlRaw)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        problems.push('siteUrl must use http: or https:')
      } else if (parsed.pathname !== '/' || parsed.search !== '' || parsed.hash !== '') {
        problems.push('siteUrl must be an origin only, e.g. http://localhost:3000')
      } else {
        siteUrl = parsed.origin
      }
    } catch {
      problems.push(`siteUrl is not a valid URL: ${JSON.stringify(siteUrlRaw)}`)
    }
  }
  return { contentDir, siteUrl, problems }
}

/**
 * Send one JSON response. Every response this plugin owns is no-store.
 * @param {import('node:http').ServerResponse} res
 * @param {number} status
 * @param {object} payload
 * @param {Record<string,string>} [extraHeaders]
 */
function sendJson(res, status, payload, extraHeaders) {
  const body = Buffer.from(`${JSON.stringify(payload)}\n`, 'utf8')
  if (!res.headersSent) {
    res.writeHead(status, {
      'content-type': 'application/json; charset=utf-8',
      'content-length': String(body.length),
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      ...extraHeaders,
    })
  }
  res.end(body)
}

/**
 * Build the error envelope used by every failure response.
 * @param {string} code - stable machine-readable error code.
 * @param {string} message - human-readable explanation shown in the UI.
 * @returns {{ok: false, error: {code: string, message: string}}}
 */
function errorBody(code, message) {
  return { ok: false, error: { code, message } }
}

/**
 * Whether the request may proceed. Requests without an Origin header (curl,
 * other local tooling) are allowed; a present Origin must match the request's
 * own Host so a random web page cannot drive the local route.
 * @param {import('node:http').IncomingMessage} req
 * @returns {boolean}
 */
function isSameOrigin(req) {
  const origin = req.headers.origin
  if (typeof origin !== 'string' || origin === '') return true
  const host = req.headers.host
  if (typeof host !== 'string' || host === '') return false
  try {
    const parsed = new URL(origin)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false
    return parsed.host.toLowerCase() === host.toLowerCase()
  } catch {
    return false
  }
}

/**
 * Read and parse a JSON request body with a hard byte cap. An oversized body
 * is drained (not buffered) so the 413 response can still be delivered.
 * @param {import('node:http').IncomingMessage} req
 * @returns {Promise<{ok: true, value: unknown} | {ok: false, status: number, code: string, message: string}>}
 */
function readJsonBody(req) {
  return new Promise((settle) => {
    const chunks = []
    let size = 0
    let tooLarge = false
    let settled = false
    const finish = (result) => {
      if (settled) return
      settled = true
      settle(result)
    }
    req.on('data', (chunk) => {
      if (settled || tooLarge) return
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        tooLarge = true
        chunks.length = 0
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (tooLarge) {
        finish({
          ok: false,
          status: 413,
          code: 'BODY_TOO_LARGE',
          message: `Request body exceeds the ${MAX_BODY_BYTES} byte limit.`,
        })
        return
      }
      let value
      try {
        value = JSON.parse(Buffer.concat(chunks).toString('utf8'))
      } catch {
        finish({
          ok: false,
          status: 400,
          code: 'INVALID_JSON',
          message: 'Request body is not valid JSON.',
        })
        return
      }
      finish({ ok: true, value })
    })
    req.on('error', () => {
      finish({
        ok: false,
        status: 400,
        code: 'REQUEST_ABORTED',
        message: 'The request stream failed before the body was read.',
      })
    })
  })
}

/**
 * Reject a payload with one validation failure.
 * @param {string} code
 * @param {string} message
 * @returns {{ok: false, code: string, message: string}}
 */
function invalid(code, message) {
  return { ok: false, code, message }
}

/**
 * Normalize a Markdown body: LF line endings, no BOM, no leading/trailing
 * blank lines. Interior whitespace (including Markdown hard breaks) is kept.
 * @param {string} value
 * @returns {string}
 */
function normalizeMarkdownBody(value) {
  return String(value)
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .replace(/^\n+/, '')
    .replace(/[ \t\n]+$/, '')
}

/**
 * Validate one create-post payload.
 * @param {unknown} input - parsed JSON body.
 * @returns {{ok: true, post: object} | {ok: false, code: string, message: string}}
 */
function validatePayload(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    return invalid('INVALID_PAYLOAD', 'Request body must be a JSON object.')
  }

  const title = typeof input.title === 'string' ? input.title.trim() : ''
  if (title === '') return invalid('TITLE_REQUIRED', 'title is required.')
  if (title.length > MAX_TITLE_LENGTH) {
    return invalid('TITLE_TOO_LONG', `title must be at most ${MAX_TITLE_LENGTH} characters.`)
  }

  const slug = typeof input.slug === 'string' ? input.slug.trim() : ''
  if (slug === '') return invalid('SLUG_REQUIRED', 'slug is required.')
  if (slug.length > MAX_SLUG_LENGTH || !SLUG_PATTERN.test(slug)) {
    return invalid(
      'SLUG_INVALID',
      'slug must be lowercase ASCII letters, digits and single hyphens, e.g. "my-first-post".',
    )
  }

  const body = normalizeMarkdownBody(typeof input.body === 'string' ? input.body : '')
  if (body === '') return invalid('BODY_REQUIRED', 'body is required.')

  let description = typeof input.description === 'string' ? input.description.trim() : ''
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return invalid(
      'DESCRIPTION_TOO_LONG',
      `description must be at most ${MAX_DESCRIPTION_LENGTH} characters.`,
    )
  }

  const tags = []
  if (input.tags !== undefined && input.tags !== null) {
    if (!Array.isArray(input.tags)) {
      return invalid('TAGS_INVALID', 'tags must be an array of strings.')
    }
    for (const candidate of input.tags) {
      if (typeof candidate !== 'string') {
        return invalid('TAGS_INVALID', 'tags must be an array of strings.')
      }
      const tag = candidate.trim()
      if (tag === '') continue
      if (tag.length > MAX_TAG_LENGTH) {
        return invalid('TAG_TOO_LONG', `each tag must be at most ${MAX_TAG_LENGTH} characters.`)
      }
      if (!tags.includes(tag)) tags.push(tag)
    }
    if (tags.length > MAX_TAGS) {
      return invalid('TOO_MANY_TAGS', `at most ${MAX_TAGS} tags are allowed.`)
    }
  }

  let draft = false
  if (input.draft !== undefined && input.draft !== null) {
    if (typeof input.draft !== 'boolean') {
      return invalid('DRAFT_INVALID', 'draft must be a boolean.')
    }
    draft = input.draft
  }

  let date
  if (input.date !== undefined && input.date !== null && input.date !== '') {
    const candidate = typeof input.date === 'string' ? input.date.trim() : ''
    if (!ISO_DATE_PATTERN.test(candidate) || Number.isNaN(Date.parse(candidate))) {
      return invalid(
        'DATE_INVALID',
        'date must be an ISO 8601 date-time with a timezone offset, e.g. 2026-10-24T23:40:00+07:00.',
      )
    }
    date = candidate
  } else {
    date = formatIsoWithOffset(new Date())
  }

  let sessionId = ''
  if (input.sessionId !== undefined && input.sessionId !== null && input.sessionId !== '') {
    const candidate = typeof input.sessionId === 'string' ? input.sessionId.trim() : ''
    if (!SESSION_ID_PATTERN.test(candidate)) {
      return invalid('SESSION_ID_INVALID', 'sessionId must be at most 200 path-safe characters.')
    }
    sessionId = candidate
  }

  let overwrite = false
  if (input.overwrite !== undefined && input.overwrite !== null) {
    if (typeof input.overwrite !== 'boolean') {
      return invalid('OVERWRITE_INVALID', 'overwrite must be a boolean.')
    }
    overwrite = input.overwrite
  }

  return {
    ok: true,
    post: { title, slug, description, date, tags, draft, sessionId, body },
    overwrite,
  }
}

/**
 * Format a Date as an ISO 8601 date-time with the process's local offset.
 * @param {Date} date
 * @returns {string}
 */
function formatIsoWithOffset(date) {
  const pad = (value) => String(value).padStart(2, '0')
  const offsetMinutes = -date.getTimezoneOffset()
  const sign = offsetMinutes >= 0 ? '+' : '-'
  const absolute = Math.abs(offsetMinutes)
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(absolute / 60))}:${pad(absolute % 60)}`
  )
}

/**
 * Quote one YAML scalar. JSON string escaping is valid inside a YAML
 * double-quoted scalar, which keeps this dependency-free and predictable for
 * every Unicode value.
 * @param {string} value
 * @returns {string}
 */
function yamlString(value) {
  return JSON.stringify(value)
}

/**
 * Render the complete Markdown file (frontmatter + body) the blog consumes.
 * @param {{title: string, description: string, date: string, tags: string[], draft: boolean, sessionId: string, body: string}} post
 * @returns {string}
 */
function renderPostFile(post) {
  const lines = ['---', `title: ${yamlString(post.title)}`]
  if (post.description !== '') lines.push(`description: ${yamlString(post.description)}`)
  lines.push(`date: ${yamlString(post.date)}`)
  if (post.tags.length > 0) {
    lines.push(`tags: [${post.tags.map((tag) => yamlString(tag)).join(', ')}]`)
  }
  lines.push(`draft: ${post.draft ? 'true' : 'false'}`)
  lines.push('source: "dsh"')
  if (post.sessionId !== '') lines.push(`sessionId: ${yamlString(post.sessionId)}`)
  lines.push('---', '', post.body)
  return `${lines.join('\n')}\n`
}

/**
 * Resolve the target file and prove it stays inside contentDir.
 * @param {string} contentDir - normalized absolute directory.
 * @param {string} slug - already validated slug.
 * @returns {string} absolute file path.
 */
function resolvePostPath(contentDir, slug) {
  const filePath = resolve(contentDir, `${slug}.md`)
  const pathWithinDir = relative(contentDir, filePath)
  if (pathWithinDir === '' || pathWithinDir.startsWith('..') || isAbsolute(pathWithinDir)) {
    throw new Error('resolved post path escaped contentDir')
  }
  return filePath
}

/**
 * Serialize writes per slug so two concurrent requests cannot both pass the
 * existence check, then write atomically: a unique temp file in the same
 * directory is renamed over the target (rename is atomic on one volume).
 * @template T
 * @param {Map<string, Promise<void>>} locks
 * @param {string} slug
 * @param {() => Promise<T>} operation
 * @returns {Promise<T>}
 */
function withSlugLock(locks, slug, operation) {
  const previous = locks.get(slug) ?? Promise.resolve()
  const run = previous.then(operation, operation)
  const tail = run.then(
    () => undefined,
    () => undefined,
  )
  locks.set(slug, tail)
  tail.then(() => {
    if (locks.get(slug) === tail) locks.delete(slug)
  })
  return run
}

/**
 * Write one post file.
 * @param {string} contentDir - normalized absolute directory.
 * @param {string} slug - validated slug.
 * @param {string} content - complete file contents.
 * @param {boolean} overwrite - whether an existing file may be replaced.
 * @param {Map<string, Promise<void>>} locks - per-slug write serialization.
 * @returns {Promise<{created: boolean, path: string} | {exists: true, path: string}>}
 */
function writePostFile(contentDir, slug, content, overwrite, locks) {
  const filePath = resolvePostPath(contentDir, slug)
  return withSlugLock(locks, slug, async () => {
    await mkdir(contentDir, { recursive: true })
    let created = true
    try {
      await stat(filePath)
      created = false
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    if (!created && !overwrite) return { exists: true, path: filePath }
    const tempPath = join(contentDir, `.${slug}.${randomUUID()}.md.tmp`)
    await writeFile(tempPath, content, { encoding: 'utf8', flag: 'wx' })
    try {
      await rename(tempPath, filePath)
    } catch (error) {
      await rm(tempPath, { force: true }).catch(() => {})
      throw error
    }
    return { created, path: filePath }
  })
}

/**
 * POST /api/plugins/blog-writer/posts handler.
 * @param {{logger?: {error?: Function, warn?: Function}}} ctx - plugin context (logging only).
 * @param {{contentDir: string|null, siteUrl: string, problems: string[]}} config
 * @param {Map<string, Promise<void>>} locks
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
async function handlePosts(ctx, config, locks, req, res) {
  try {
    if (req.method !== 'POST') {
      sendJson(res, 405, errorBody('METHOD_NOT_ALLOWED', 'Use POST for this route.'), {
        allow: 'POST',
      })
      return
    }
    if (!isSameOrigin(req)) {
      sendJson(res, 403, errorBody('ORIGIN_REJECTED', 'Cross-origin requests are not allowed.'))
      return
    }
    if (config.problems.length > 0) {
      sendJson(
        res,
        500,
        errorBody(
          'CONFIG_INVALID',
          `dsh-blog-writer is misconfigured: ${config.problems.join('; ')}`,
        ),
      )
      return
    }
    const contentType = String(req.headers['content-type'] ?? '')
      .split(';')[0]
      .trim()
      .toLowerCase()
    if (contentType !== 'application/json') {
      sendJson(
        res,
        415,
        errorBody('UNSUPPORTED_MEDIA_TYPE', 'Content-Type must be application/json.'),
      )
      return
    }
    const body = await readJsonBody(req)
    if (!body.ok) {
      sendJson(res, body.status, errorBody(body.code, body.message))
      return
    }
    const validated = validatePayload(body.value)
    if (!validated.ok) {
      sendJson(res, 400, errorBody(validated.code, validated.message))
      return
    }
    const { post, overwrite } = validated
    const written = await writePostFile(
      config.contentDir,
      post.slug,
      renderPostFile(post),
      overwrite,
      locks,
    )
    if ('exists' in written) {
      sendJson(
        res,
        409,
        errorBody(
          'EXISTS',
          `content/blog/${post.slug}.md already exists; retry with overwrite: true to replace it.`,
        ),
      )
      return
    }
    const url = config.siteUrl === '' ? `/blog/${post.slug}` : `${config.siteUrl}/blog/${post.slug}`
    sendJson(res, 200, {
      ok: true,
      slug: post.slug,
      path: written.path,
      url,
      created: written.created,
      draft: post.draft,
    })
  } catch (error) {
    ctx.logger?.error?.(`${PLUGIN_NAME}: failed to write post`, error)
    if (!res.headersSent) {
      sendJson(res, 500, errorBody('INTERNAL_ERROR', 'Failed to write the blog post.'))
    } else if (!res.writableEnded) {
      res.end()
    }
  }
}

/**
 * GET /api/plugins/blog-writer/health handler.
 * @param {{contentDir: string|null, siteUrl: string, problems: string[]}} config
 * @param {import('node:http').IncomingMessage} req
 * @param {import('node:http').ServerResponse} res
 */
function handleHealth(config, req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendJson(res, 405, errorBody('METHOD_NOT_ALLOWED', 'Use GET for this route.'), {
      allow: 'GET, HEAD',
    })
    return
  }
  if (!isSameOrigin(req)) {
    sendJson(res, 403, errorBody('ORIGIN_REJECTED', 'Cross-origin requests are not allowed.'))
    return
  }
  const payload = {
    ok: config.problems.length === 0,
    name: PLUGIN_NAME,
    version: PLUGIN_VERSION,
    configuration: {
      contentDir: config.contentDir,
      siteUrl: config.siteUrl === '' ? null : config.siteUrl,
      problems: config.problems,
    },
  }
  if (req.method === 'HEAD') {
    const body = Buffer.from('', 'utf8')
    res.writeHead(200, {
      'content-type': 'application/json; charset=utf-8',
      'content-length': String(body.length),
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    })
    res.end()
    return
  }
  sendJson(res, 200, payload)
}

/**
 * Mount the Host half.
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {unknown} rawConfig - Loader row `config`.
 */
export function apply(ctx, rawConfig) {
  const config = normalizeConfig(rawConfig)
  const locks = new Map()

  if (config.problems.length > 0) {
    ctx.logger?.warn?.(`${PLUGIN_NAME}: invalid configuration: ${config.problems.join('; ')}`)
  }

  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'exact',
        path: POSTS_PATH,
        handler: (req, res) => handlePosts(ctx, config, locks, req, res),
      }),
    `${PLUGIN_NAME}: ${POSTS_PATH}`,
  )
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'exact',
        path: HEALTH_PATH,
        handler: (req, res) => handleHealth(config, req, res),
      }),
    `${PLUGIN_NAME}: ${HEALTH_PATH}`,
  )
}
