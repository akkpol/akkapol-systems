---
title: "Building a DSH conversation view that writes to my blog"
description: "The first post published through dsh-blog-writer: from a DSH conversation to a Markdown post on the Akkapol Systems blog."
date: "2026-10-25T00:34:43+07:00"
tags: ["DSH", "AI", "Next.js", "Blog"]
draft: false
source: "dsh"
---

# From conversation to published post

This is the first post published through **dsh-blog-writer**, a small DSH plugin that turns the last settled assistant answer into a real Markdown blog post on this site.

## What the plugin does

- Adds a **Save answer to blog** action under the DSH composer.
- Prefills an editable draft with a title, slug, description, tags, and the answer as Markdown.
- Sends it to a loopback-only DSH host route, which writes `content/blog/<slug>.md`.
- Keeps `draft: true` posts out of `/blog`, the sitemap, and crawlable routes until they are ready.

## How this post was made

The exact payload below was written through the plugin's host API while DSH was running, then this Next.js page rendered the file:

```http
POST /api/plugins/blog-writer/posts
Content-Type: application/json

{"title":"…","slug":"building-dsh-blog-writer","body":"…","draft":false}
```

The frontmatter carries `source: "dsh"`, the conversation id, and the date, so every AI-assisted post stays identifiable.

## บันทึกภาษาไทย

โพสต์นี้ถูกสร้างผ่านปลั๊กอิน **dsh-blog-writer** จากบทสนทนาใน DeepSeek Harness โดยตรง เนื้อหาถูกบันทึกเป็นไฟล์ Markdown ใน `content/blog/` แล้วเว็บ Next.js อ่านไฟล์นั้นมาแสดงผลที่หน้านี้

ลองถามผู้ช่วยให้ตอบคำถามที่ต้องการ แล้วกด **บันทึกคำตอบลงบล็อก** ใต้ช่องพิมพ์ จากนั้นแก้หัวข้อและเนื้อหาก่อนกดบันทึกได้เลย
