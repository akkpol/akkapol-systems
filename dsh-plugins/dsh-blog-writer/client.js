/**
 * dsh-blog-writer — Client half (plain browser bundle for DSH 0.2.x).
 *
 * Loaded through `window.__ModuleLoader__.load()` by the Harness Web shell.
 * The factory body only registers the plugin; every side effect (locale
 * dictionaries, styles, slot registration) happens inside `apply()` so the
 * bundle stays inert until the client Loader materializes it.
 *
 * The plugin contributes one ambient entry below the composer:
 *
 *   conversation.composer.dock -> "Save answer to blog" trigger + inline editor
 *
 * It reads the conversation's Chat target through
 * `ctx.uiConversation.binding(sessionId).target('chat')` (an
 * ObservableSnapshot) and subscribes with `React.useSyncExternalStore`; the
 * last settled `assistant-step` node supplies the prefill text. Saving posts
 * to the Host route `/api/plugins/blog-writer/posts` with the same-origin
 * relative path (no CORS handling needed).
 *
 * Only `react` is required from the browser module table.
 */
window.__ModuleLoader__.load({
  id: 'dsh-blog-writer',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    /** Locale namespace of this plugin (matches the registration's `locale`). */
    const NS = 'dsh-blog-writer'
    /** Ambient list slot below the composer card. */
    const SLOT_NAME = 'conversation.composer.dock'
    /** Stable list-entry id. */
    const SLOT_ID = 'dsh-blog-writer.save'
    /** Same-origin Host route served by index.js. */
    const POSTS_ENDPOINT = '/api/plugins/blog-writer/posts'
    const REQUEST_TIMEOUT_MS = 15000
    const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    const MAX_TITLE_LENGTH = 200
    const MAX_DESCRIPTION_LENGTH = 500
    const MAX_TAG_LENGTH = 40
    const MAX_TAGS = 12

    const NOOP = () => {}
    const EMPTY_UNSUBSCRIBE = () => NOOP
    const NOOP_SUBSCRIBE = () => EMPTY_UNSUBSCRIBE
    const NULL_SNAPSHOT = () => null
    const EMPTY_FORM = {
      title: '',
      slug: '',
      description: '',
      tags: '',
      body: '',
      draft: false,
    }

    /* ------------------------------------------------------------------ */
    /* Flat runtime dictionaries (the package's locale/*.json files hold    */
    /* only the Plugin Manager `meta` fields; the browser bundle cannot    */
    /* read them, so the runtime copy lives here). Keep en/th key sets in  */
    /* sync.                                                               */
    /* ------------------------------------------------------------------ */
    const EN = {
      'trigger.label': 'Save answer to blog',
      'trigger.title': 'Copy the last settled assistant answer into a Markdown post',
      'trigger.disabled': 'No settled assistant answer yet',
      'editor.title': 'Save answer to blog',
      'editor.hint': 'Uses the last settled assistant answer as the body. Saved to content/blog as Markdown.',
      'editor.file': 'content/blog/{slug}.md',
      'editor.close': 'Close',
      'field.title': 'Title',
      'field.slug': 'Slug (file name)',
      'field.description': 'Description',
      'field.tags': 'Tags',
      'field.tagsHint': 'Comma separated, e.g. AI, Systems',
      'field.body': 'Body (Markdown)',
      'field.draft': 'Save as draft',
      'field.optional': 'optional',
      'action.save': 'Save',
      'action.saving': 'Saving…',
      'action.cancel': 'Cancel',
      'action.overwrite': 'Overwrite existing file',
      'action.retry': 'Try again',
      'success.message': 'Saved',
      'success.created': 'Created',
      'success.updated': 'Updated',
      'success.draft': 'Draft — not listed on /blog',
      'success.open': 'Open post',
      'success.path': 'File',
      'error.titleRequired': 'A title is required.',
      'error.bodyRequired': 'A body is required.',
      'error.invalidSlug': 'Slug must be lowercase letters, digits and single hyphens.',
      'error.timeout': 'The Host did not answer in time. Try again.',
      'error.network': 'Could not reach the Host. Check that DSH is running and try again.',
      'error.unknown': 'Saving the post failed.',
    }

    const TH = {
      'trigger.label': 'บันทึกคำตอบลงบล็อก',
      'trigger.title': 'คัดลอกคำตอบล่าสุดของผู้ช่วยเป็นโพสต์ Markdown',
      'trigger.disabled': 'ยังไม่มีคำตอบของผู้ช่วยที่เขียนเสร็จ',
      'editor.title': 'บันทึกคำตอบลงบล็อก',
      'editor.hint': 'ใช้คำตอบล่าสุดของผู้ช่วยเป็นเนื้อหา และบันทึกเป็น Markdown ใน content/blog',
      'editor.file': 'content/blog/{slug}.md',
      'editor.close': 'ปิด',
      'field.title': 'หัวเรื่อง',
      'field.slug': 'Slug (ชื่อไฟล์)',
      'field.description': 'คำอธิบาย',
      'field.tags': 'แท็ก',
      'field.tagsHint': 'คั่นด้วยเครื่องหมายจุลภาค เช่น AI, Systems',
      'field.body': 'เนื้อหา (Markdown)',
      'field.draft': 'บันทึกเป็นฉบับร่าง',
      'field.optional': 'ไม่บังคับ',
      'action.save': 'บันทึก',
      'action.saving': 'กำลังบันทึก…',
      'action.cancel': 'ยกเลิก',
      'action.overwrite': 'เขียนทับไฟล์เดิม',
      'action.retry': 'ลองอีกครั้ง',
      'success.message': 'บันทึกแล้ว',
      'success.created': 'สร้างใหม่',
      'success.updated': 'อัปเดต',
      'success.draft': 'ฉบับร่าง — ยังไม่แสดงบน /blog',
      'success.open': 'เปิดโพสต์',
      'success.path': 'ไฟล์',
      'error.titleRequired': 'กรุณากรอกหัวเรื่อง',
      'error.bodyRequired': 'กรุณากรอกเนื้อหา',
      'error.invalidSlug': 'slug ต้องเป็นตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และขีดกลาง',
      'error.timeout': 'เซิร์ฟเวอร์ไม่ตอบสนองทันเวลา กรุณาลองอีกครั้ง',
      'error.network': 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบว่า DSH กำลังทำงาน',
      'error.unknown': 'บันทึกโพสต์ไม่สำเร็จ',
    }

    const CSS = `
.dbw{box-sizing:border-box;font-size:13px;line-height:1.45;color:var(--dsw-alias-label-primary,#1f2328);}
.dbw *,.dbw *::before,.dbw *::after{box-sizing:border-box;}
.dbw--dock{padding:2px 0 0;}
.dbw-trigger{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:1px solid var(--dsw-alias-border-l2,#d0d7de);border-radius:8px;background:var(--dsw-alias-bg-layer-2,transparent);color:var(--dsw-alias-label-secondary,#57606a);font:inherit;font-size:12px;cursor:pointer;transition:background .12s ease,color .12s ease,border-color .12s ease;}
.dbw-trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06));color:var(--dsw-alias-label-primary,#1f2328);}
.dbw-trigger:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#0969da);outline-offset:2px;}
.dbw-trigger:disabled{cursor:not-allowed;opacity:.55;}
.dbw-glyph{display:block;flex:none;}
.dbw--editor{margin:6px 0 0;padding:12px 14px 14px;border:1px solid var(--dsw-alias-border-l2,#d0d7de);border-radius:12px;background:var(--dsw-alias-bg-layer-2,var(--dsw-alias-bg-l2,#fff));box-shadow:0 8px 24px rgba(0,0,0,.08);}
.dbw-head{display:flex;align-items:center;justify-content:space-between;gap:12px;}
.dbw-title{margin:0;font-size:13px;font-weight:600;color:var(--dsw-alias-label-primary,#1f2328);}
.dbw-close{width:24px;height:24px;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-tertiary,#6e7781);font-size:16px;line-height:1;cursor:pointer;}
.dbw-close:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06));color:var(--dsw-alias-label-primary,#1f2328);}
.dbw-close:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#0969da);outline-offset:1px;}
.dbw-hint{margin:4px 0 0;font-size:11.5px;color:var(--dsw-alias-label-tertiary,#6e7781);}
.dbw-field{display:flex;flex-direction:column;gap:4px;margin-top:10px;}
.dbw-label{font-size:12px;font-weight:500;color:var(--dsw-alias-label-secondary,#57606a);}
.dbw-optional{margin-left:6px;font-weight:400;color:var(--dsw-alias-label-tertiary,#6e7781);}
.dbw-input,.dbw-textarea{width:100%;padding:6px 8px;border:1px solid var(--dsw-alias-border-l2,#d0d7de);border-radius:8px;background:var(--dsw-alias-bg-base,var(--dsw-alias-bg-l1,#fff));color:var(--dsw-alias-label-primary,#1f2328);font:inherit;font-size:13px;}
.dbw-input::placeholder,.dbw-textarea::placeholder{color:var(--dsw-alias-label-tertiary,#6e7781);opacity:1;}
.dbw-input:focus,.dbw-textarea:focus{outline:none;border-color:var(--dsw-alias-brand-primary,#0969da);box-shadow:0 0 0 3px var(--dsw-alias-fill-tsp-secondary,rgba(9,105,218,.18));}
.dbw-input[aria-invalid='true']{border-color:var(--dsw-alias-state-error-primary,#cf222e);}
.dbw-textarea{min-height:64px;resize:vertical;}
.dbw-textarea--body{min-height:150px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.5;}
.dbw-check{display:flex;align-items:center;gap:7px;margin-top:12px;font-size:12.5px;color:var(--dsw-alias-label-secondary,#57606a);cursor:pointer;}
.dbw-check input[type='checkbox']{margin:0;}
.dbw-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:12px;}
.dbw-btn{height:28px;padding:0 12px;border-radius:8px;border:1px solid transparent;font:inherit;font-size:12px;font-weight:500;cursor:pointer;}
.dbw-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary,#0969da);outline-offset:2px;}
.dbw-btn--ghost{border-color:var(--dsw-alias-border-l2,#d0d7de);background:transparent;color:var(--dsw-alias-label-secondary,#57606a);}
.dbw-btn--ghost:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(0,0,0,.06));color:var(--dsw-alias-label-primary,#1f2328);}
.dbw-btn--primary{background:var(--dsw-alias-button-primary-fill,#0969da);color:var(--dsw-alias-label-primary-inverted,#fff);}
.dbw-btn--primary:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover,#0860c4);}
.dbw-btn:disabled{cursor:not-allowed;opacity:.55;}
.dbw-link{border:0;padding:0;background:none;color:var(--dsw-alias-link,#0969da);font:inherit;font-size:inherit;cursor:pointer;text-decoration:underline;}
.dbw-link:hover{text-decoration:none;}
.dbw-status{margin:10px 0 0;font-size:12px;}
.dbw-status--error{color:var(--dsw-alias-state-error-primary,#cf222e);}
.dbw-status--ok{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;color:var(--dsw-alias-state-success-primary,#1a7f37);}
.dbw-path{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:1px 5px;border-radius:5px;background:var(--dsw-alias-markdown-inline-code,rgba(175,184,193,.2));color:var(--dsw-alias-label-secondary,#57606a);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;}
`

    /* ------------------------------------------------------------------ */
    /* Pure helpers (also exposed through `__test` for verification).       */
    /* ------------------------------------------------------------------ */

    /**
     * Translate with a fallback to the English key text.
     * @param {Function|undefined} t - framework-injected translate seat.
     * @param {string} key
     * @param {string} [fallback]
     * @returns {string}
     */
    function translate(t, key, fallback) {
      if (typeof t === 'function') {
        try {
          const value = t(key)
          if (typeof value === 'string' && value !== '' && value !== key) return value
        } catch {
          /* fall through to the bundled English text */
        }
      }
      return fallback !== undefined ? fallback : EN[key] !== undefined ? EN[key] : key
    }

    /**
     * Fill `{name}` placeholders in a translated template.
     * @param {string} template
     * @param {Record<string, string>} values
     * @returns {string}
     */
    function formatTemplate(template, values) {
      return String(template).replace(/\{(\w+)\}/g, (match, name) =>
        Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match,
      )
    }

    /**
     * Join the finalized text blocks of one assistant step (blank line between
     * blocks), mirroring how the Chat renders them.
     * @param {unknown} blocks - AssistantBlock[].
     * @returns {string}
     */
    function blocksToText(blocks) {
      if (!Array.isArray(blocks)) return ''
      const parts = []
      for (const block of blocks) {
        if (!block || block.kind !== 'text' || typeof block.text !== 'string') continue
        const text = block.text.trim()
        if (text !== '') parts.push(text)
      }
      return parts.join('\n\n')
    }

    /**
     * Find the last settled assistant-step with non-empty answer text.
     * @param {unknown} snapshot - ChatSnapshot (order + nodes store), or null.
     * @returns {{key: string, text: string, turn: unknown, step: unknown, time: unknown}|null}
     */
    function findLatestSettledAnswer(snapshot) {
      if (!snapshot || !Array.isArray(snapshot.order) || !snapshot.nodes) return null
      if (typeof snapshot.nodes.get !== 'function') return null
      for (let index = snapshot.order.length - 1; index >= 0; index -= 1) {
        const key = snapshot.order[index]
        if (typeof key !== 'string') continue
        let node
        try {
          node = snapshot.nodes.get(key)
        } catch {
          continue
        }
        if (!node || node.kind !== 'assistant-step') continue
        const data = node.data
        if (!data || data.status !== 'settled') continue
        const text = blocksToText(data.blocks)
        if (text === '') continue
        return { key, text, turn: data.turn, step: data.step, time: data.time }
      }
      return null
    }

    /**
     * Strip the lightest Markdown decoration so a preview line reads as prose.
     * @param {string} line
     * @returns {string}
     */
    function plainLine(line) {
      return String(line)
        .trim()
        .replace(/^#{1,6}\s+/, '')
        .replace(/^>\s*/, '')
        .replace(/^[-*+]\s+/, '')
        .replace(/^\d+[.)]\s+/, '')
        .replace(/[*_`~]/g, '')
        .trim()
    }

    /**
     * Split the answer into its first meaningful line and the remaining text.
     * @param {string} text
     * @returns {{first: string, rest: string}}
     */
    function splitFirstLine(text) {
      const lines = String(text).split('\n')
      let first = ''
      let restStart = 0
      for (let index = 0; index < lines.length; index += 1) {
        const line = plainLine(lines[index])
        if (line === '') continue
        first = line
        restStart = index + 1
        break
      }
      return { first, rest: lines.slice(restStart).join('\n') }
    }

    /**
     * Shorten text on a word boundary where possible.
     * @param {string} text
     * @param {number} limit
     * @returns {string}
     */
    function truncate(text, limit) {
      const value = String(text).trim()
      if (value.length <= limit) return value
      const slice = value.slice(0, limit - 1)
      const lastSpace = slice.lastIndexOf(' ')
      const head = lastSpace > Math.floor(limit * 0.6) ? slice.slice(0, lastSpace) : slice
      return `${head.trimEnd()}…`
    }

    /**
     * Derive a title from the answer's first meaningful line.
     * @param {string} text
     * @returns {string}
     */
    function deriveTitle(text) {
      return truncate(splitFirstLine(text).first, 90)
    }

    /**
     * Derive a short description from the answer text after the title line.
     * @param {string} text
     * @returns {string}
     */
    function deriveDescription(text) {
      const { rest } = splitFirstLine(text)
      const prose = rest
        .split('\n')
        .map((line) => plainLine(line))
        .filter((line) => line !== '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
      return truncate(prose, 160)
    }

    /**
     * Build a URL-safe ASCII slug. Non-ASCII titles yield an empty string and
     * the caller falls back to a date-based slug.
     * @param {string} text
     * @returns {string}
     */
    function slugify(text) {
      const ascii = String(text)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '')
      return truncate(ascii, 80).replace(/-+$/g, '')
    }

    /**
     * Resolve the default slug for a title, with a date fallback for titles
     * that contain no ASCII letters or digits (e.g. Thai).
     * @param {string} title
     * @param {Date} [now] - reference day; defaults to the current time.
     * @returns {string}
     */
    function buildDefaultSlug(title, now) {
      const slug = slugify(title)
      if (slug !== '') return slug
      const pad = (value) => String(value).padStart(2, '0')
      // Duck-typed instead of `instanceof Date` so a Date created by another
      // realm (iframe/test harness) still supplies the intended day.
      const date =
        now !== null && typeof now === 'object' && typeof now.getFullYear === 'function' && typeof now.getMonth === 'function'
          ? now
          : new Date()
      return `post-${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
    }

    /**
     * Split the comma-separated tags input into the request's tag array.
     * @param {string} value
     * @returns {string[]}
     */
    function splitTags(value) {
      const tags = []
      for (const part of String(value).split(',')) {
        const tag = part.trim()
        if (tag === '' || tags.includes(tag)) continue
        if (tag.length > MAX_TAG_LENGTH) continue
        if (tags.length >= MAX_TAGS) break
        tags.push(tag)
      }
      return tags
    }

    /**
     * Build the POST body from the editor form.
     * @param {object} form
     * @param {string|undefined} sessionId
     * @param {boolean} overwrite
     * @returns {object}
     */
    function buildRequestPayload(form, sessionId, overwrite) {
      const payload = {
        title: String(form.title).trim(),
        slug: String(form.slug).trim(),
        description: String(form.description).trim(),
        tags: splitTags(form.tags),
        body: String(form.body),
        draft: form.draft === true,
      }
      if (typeof sessionId === 'string' && sessionId !== '') payload.sessionId = sessionId
      if (overwrite === true) payload.overwrite = true
      return payload
    }

    /**
     * Compute the next editor form for one field edit. A title edit derives a
     * new slug only while the user has not edited the slug by hand, so a
     * manual slug is never silently overwritten by a later title change.
     * @param {object} current - current form state.
     * @param {string} field - edited field name.
     * @param {unknown} value - new field value.
     * @param {boolean} slugEdited - whether the user has edited the slug.
     * @returns {object} the next form state.
     */
    function nextFormAfterEdit(current, field, value, slugEdited) {
      const next = { ...current, [field]: value }
      if (field === 'title' && slugEdited !== true) {
        next.slug = buildDefaultSlug(value, new Date())
      }
      return next
    }

    /**
     * Client-side pre-validation; mirrors the Host rules for fast feedback.
     * @param {object} form
     * @returns {string|null} dictionary key of the first failure, or null.
     */
    function validateForm(form) {
      if (String(form.title).trim() === '') return 'error.titleRequired'
      if (!SLUG_PATTERN.test(String(form.slug).trim())) return 'error.invalidSlug'
      if (String(form.body).trim() === '') return 'error.bodyRequired'
      if (String(form.title).trim().length > MAX_TITLE_LENGTH) return 'error.unknown'
      if (String(form.description).trim().length > MAX_DESCRIPTION_LENGTH) return 'error.unknown'
      return null
    }

    /**
     * URL the success card should link: drafts are not listed on /blog, so a
     * draft post deliberately exposes no link.
     * @param {object|null} result - Host success payload.
     * @returns {string|null}
     */
    function resultLink(result) {
      if (!result || result.draft === true) return null
      return typeof result.url === 'string' && result.url !== '' ? result.url : null
    }

    /* ------------------------------------------------------------------ */
    /* Component                                                           */
    /* ------------------------------------------------------------------ */

    /**
     * Small pen glyph (matches the plugin icon's motif; inherits currentColor).
     * @returns {import('react').ReactElement}
     */
    function WriterGlyph() {
      return h(
        'svg',
        {
          viewBox: '0 0 24 24',
          width: 14,
          height: 14,
          'aria-hidden': true,
          focusable: 'false',
          className: 'dbw-glyph',
        },
        h('path', {
          d: 'M4.5 19.5h15M6.2 16.3 16.6 5.9a1.9 1.9 0 0 1 2.7 2.7L9 18.9l-3.6.9z',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.7,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      )
    }

    /**
     * The composer-dock entry: compact trigger plus expanding inline editor.
     * Receives the session standard props plus this plugin's injected seat.
     * @param {object} props
     * @returns {import('react').ReactElement}
     */
    function BlogWriterDock(props) {
      const t = props.t
      const sessionId = props.sessionId
      const blogChat = props.blogChat
      const subscribe = blogChat && typeof blogChat.subscribe === 'function' ? blogChat.subscribe : NOOP_SUBSCRIBE
      const getSnapshot =
        blogChat && typeof blogChat.getSnapshot === 'function' ? blogChat.getSnapshot : NULL_SNAPSHOT
      const snapshot = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
      const answer = React.useMemo(() => findLatestSettledAnswer(snapshot), [snapshot])

      const [open, setOpen] = React.useState(false)
      const [form, setForm] = React.useState(EMPTY_FORM)
      const [slugEdited, setSlugEdited] = React.useState(false)
      /** 'idle' | 'saving' | 'saved' */
      const [phase, setPhase] = React.useState('idle')
      const [error, setError] = React.useState(null)
      const [result, setResult] = React.useState(null)

      const titleRef = React.useRef(null)
      const abortRef = React.useRef(null)
      /** Published posts link to /blog; drafts intentionally do not. */
      const successUrl = resultLink(result)

      // Abort an in-flight save when the entry unmounts.
      React.useEffect(
        () => () => {
          if (abortRef.current !== null) {
            abortRef.current.abort()
            abortRef.current = null
          }
        },
        [],
      )

      // Escape closes the editor (capture phase so the composer does not also
      // treat it as its own shortcut while the editor is open).
      React.useEffect(() => {
        if (!open) return undefined
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return
          event.preventDefault()
          event.stopPropagation()
          setOpen(false)
          setPhase('idle')
        }
        document.addEventListener('keydown', onKeyDown, true)
        return () => document.removeEventListener('keydown', onKeyDown, true)
      }, [open])

      // Focus the title on open.
      React.useEffect(() => {
        if (!open) return
        const node = titleRef.current
        if (node && typeof node.focus === 'function') node.focus()
      }, [open])

      const openEditor = () => {
        const latest = answer
        if (!latest) return
        const title = deriveTitle(latest.text)
        setForm({
          title,
          slug: buildDefaultSlug(title, new Date()),
          description: deriveDescription(latest.text),
          tags: '',
          body: latest.text,
          draft: false,
        })
        setSlugEdited(false)
        setPhase('idle')
        setError(null)
        setResult(null)
        setOpen(true)
      }

      const updateField = (field) => (event) => {
        const value = field === 'draft' ? event.target.checked === true : event.target.value
        setForm((current) => nextFormAfterEdit(current, field, value, slugEdited))
      }

      const updateSlug = (event) => {
        setSlugEdited(true)
        const value = event.target.value
        setForm((current) => nextFormAfterEdit(current, 'slug', value, true))
      }

      const closeEditor = () => {
        if (abortRef.current !== null) {
          abortRef.current.abort()
          abortRef.current = null
        }
        setOpen(false)
        setPhase('idle')
        setError(null)
        setResult(null)
      }

      const save = async (overwrite) => {
        const validation = validateForm(form)
        if (validation !== null) {
          setError({ message: translate(t, validation), canOverwrite: false })
          return
        }
        setPhase('saving')
        setError(null)
        setResult(null)
        const controller = new AbortController()
        abortRef.current = controller
        const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
        try {
          const response = await fetch(POSTS_ENDPOINT, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(buildRequestPayload(form, sessionId, overwrite)),
            signal: controller.signal,
          })
          let data = null
          try {
            data = await response.json()
          } catch {
            data = null
          }
          if (!response.ok || !data || data.ok !== true) {
            const code = data && data.error ? data.error.code : undefined
            const hostMessage =
              data && data.error && typeof data.error.message === 'string' ? data.error.message : ''
            setError({
              message: hostMessage !== '' ? hostMessage : translate(t, 'error.unknown'),
              canOverwrite: response.status === 409 && code === 'EXISTS',
            })
            return
          }
          setResult({
            ...data,
            // A draft is not listed on /blog, so remember the intent locally
            // even if an older Host response omits the field.
            draft: data.draft === true || form.draft === true,
          })
          setPhase('saved')
        } catch (caught) {
          const aborted = caught && caught.name === 'AbortError'
          setError({ message: translate(t, aborted ? 'error.timeout' : 'error.network') })
        } finally {
          window.clearTimeout(timer)
          if (abortRef.current === controller) abortRef.current = null
          setPhase((current) => (current === 'saving' ? 'idle' : current))
        }
      }

      if (!open) {
        const disabled = answer === null
        return h(
          'div',
          { className: 'dbw dbw--dock' },
          h(
            'button',
            {
              type: 'button',
              className: 'dbw-trigger',
              onClick: openEditor,
              disabled,
              title: disabled ? translate(t, 'trigger.disabled') : translate(t, 'trigger.title'),
              'aria-label': translate(t, 'trigger.label'),
            },
            h(WriterGlyph),
            h('span', null, translate(t, 'trigger.label')),
          ),
        )
      }

      const fieldId = (name) => `dbw-field-${name}`
      const label = (name, key, optional) =>
        h(
          'label',
          { className: 'dbw-label', htmlFor: fieldId(name) },
          translate(t, key),
          optional ? h('span', { className: 'dbw-optional' }, translate(t, 'field.optional')) : null,
        )
      const textField = (name, key, extra) =>
        h(
          'div',
          { className: 'dbw-field' },
          label(name, key, false),
          h('input', {
            id: fieldId(name),
            className: 'dbw-input',
            type: 'text',
            value: form[name],
            onChange: updateField(name),
            autoComplete: 'off',
            ...(extra || {}),
          }),
        )

      const slugInvalid = !SLUG_PATTERN.test(String(form.slug).trim())
      const fileName = formatTemplate(translate(t, 'editor.file'), {
        slug: form.slug.trim() === '' ? '…' : form.slug.trim(),
      })

      return h(
        'section',
        { className: 'dbw dbw--editor', 'aria-label': translate(t, 'editor.title') },
        h(
          'header',
          { className: 'dbw-head' },
          h('h3', { className: 'dbw-title' }, translate(t, 'editor.title')),
          h(
            'button',
            {
              type: 'button',
              className: 'dbw-close',
              onClick: closeEditor,
              'aria-label': translate(t, 'editor.close'),
            },
            '×',
          ),
        ),
        h('p', { className: 'dbw-hint' }, translate(t, 'editor.hint')),
        textField('title', 'field.title', {
          ref: titleRef,
          required: true,
          maxLength: MAX_TITLE_LENGTH,
          placeholder: translate(t, 'field.title'),
        }),
        textField('slug', 'field.slug', {
          onChange: updateSlug,
          spellCheck: false,
          maxLength: 100,
          'aria-invalid': slugInvalid ? 'true' : 'false',
          placeholder: 'my-first-post',
        }),
        h('p', { className: 'dbw-hint dbw-file' }, fileName),
        h(
          'div',
          { className: 'dbw-field' },
          label('description', 'field.description', true),
          h('textarea', {
            id: fieldId('description'),
            className: 'dbw-textarea',
            rows: 2,
            value: form.description,
            onChange: updateField('description'),
            maxLength: MAX_DESCRIPTION_LENGTH,
            placeholder: translate(t, 'field.description'),
          }),
        ),
        h(
          'div',
          { className: 'dbw-field' },
          label('tags', 'field.tags', true),
          h('input', {
            id: fieldId('tags'),
            className: 'dbw-input',
            type: 'text',
            value: form.tags,
            onChange: updateField('tags'),
            autoComplete: 'off',
            placeholder: translate(t, 'field.tagsHint'),
          }),
          h('p', { className: 'dbw-hint' }, translate(t, 'field.tagsHint')),
        ),
        h(
          'div',
          { className: 'dbw-field' },
          label('body', 'field.body', false),
          h('textarea', {
            id: fieldId('body'),
            className: 'dbw-textarea dbw-textarea--body',
            rows: 8,
            value: form.body,
            onChange: updateField('body'),
            placeholder: translate(t, 'field.body'),
          }),
        ),
        h(
          'label',
          { className: 'dbw-check' },
          h('input', { type: 'checkbox', checked: form.draft, onChange: updateField('draft') }),
          h('span', null, translate(t, 'field.draft')),
        ),
        error !== null
          ? h(
              'p',
              { className: 'dbw-status dbw-status--error', role: 'alert' },
              error.message,
              error.canOverwrite
                ? h(
                    'button',
                    {
                      type: 'button',
                      className: 'dbw-link',
                      onClick: () => {
                        void save(true)
                      },
                    },
                    ` ${translate(t, 'action.overwrite')}`,
                  )
                : null,
            )
          : null,
        result !== null
          ? h(
              'p',
              { className: 'dbw-status dbw-status--ok', role: 'status' },
              h('span', null, translate(t, 'success.message')),
              h(
                'span',
                { className: 'dbw-hint' },
                result.created === false ? translate(t, 'success.updated') : translate(t, 'success.created'),
              ),
              result.draft === true
                ? h('span', { className: 'dbw-hint' }, translate(t, 'success.draft'))
                : successUrl !== null
                  ? h(
                      'a',
                      {
                        className: 'dbw-link',
                        href: successUrl,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                      },
                      translate(t, 'success.open'),
                    )
                  : null,
              h('code', { className: 'dbw-path', title: result.path }, String(result.path)),
            )
          : null,
        h(
          'div',
          { className: 'dbw-actions' },
          h(
            'button',
            { type: 'button', className: 'dbw-btn dbw-btn--ghost', onClick: closeEditor },
            translate(t, phase === 'saved' ? 'editor.close' : 'action.cancel'),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dbw-btn dbw-btn--primary',
              onClick: () => {
                void save(false)
              },
              disabled: phase === 'saving',
              'aria-busy': phase === 'saving' ? 'true' : undefined,
            },
            translate(t, phase === 'saving' ? 'action.saving' : 'action.save'),
          ),
        ),
      )
    }

    return {
      inject: ['slots', 'locale', 'uiConversation'],
      apply(ctx) {
        // Runtime dictionaries: the untyped 3-argument form works for any BCP
        // 47 tag, so the Thai dictionary is ready if a Thai language pack is
        // registered later.
        ctx.effect(() => ctx.locale.register(NS, 'en', EN), 'dsh-blog-writer: locale en')
        ctx.effect(() => ctx.locale.register(NS, 'th', TH), 'dsh-blog-writer: locale th')

        // One stylesheet for every instance of the entry.
        ctx.effect(
          () => {
            if (typeof document === 'undefined' || !document.head) return NOOP
            const style = document.createElement('style')
            style.setAttribute('data-plugin', NS)
            style.textContent = CSS
            document.head.appendChild(style)
            return () => {
              style.remove()
            }
          },
          'dsh-blog-writer: styles',
        )

        ctx.slots.inject(SLOT_NAME, () =>
          ctx.slots.register(
            {
              name: SLOT_NAME,
              id: SLOT_ID,
              order: 20,
              locale: NS,
              inject: (sessionId) => {
                // Resolve the Chat target eagerly (per binding) so the
                // component only has to subscribe to one stable source.
                let blogChat = null
                try {
                  const target = ctx.uiConversation.binding(sessionId).target('chat')
                  blogChat = {
                    getSnapshot: () => {
                      const value = target.getSnapshot()
                      return value === undefined ? null : value
                    },
                    subscribe: (listener) => target.subscribe(listener),
                  }
                } catch {
                  blogChat = null
                }
                return { blogChat }
              },
            },
            BlogWriterDock,
          ),
        )
      },
      /** Pure helpers exercised by the scratch-profile verification harness. */
      __test: {
        blocksToText,
        findLatestSettledAnswer,
        deriveTitle,
        deriveDescription,
        slugify,
        buildDefaultSlug,
        splitTags,
        buildRequestPayload,
        nextFormAfterEdit,
        validateForm,
        resultLink,
        dictionaries: { en: EN, th: TH },
      },
    }
  },
})
