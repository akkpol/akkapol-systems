# Daily blog automation (DSH local)

This is the working contract for the daily AI/dev blog task. Windows Task
Scheduler launches `scripts/run-blog-daily.ps1` every day at 08:30 Asia/Bangkok.
That runner calls `dsh headless` with full local access, then the headless agent
reads and executes this file fully.

## Goal

Publish one useful, original English note about practical AI systems, developer
tools, automation, or software engineering. The target reader is a technical
founder or small team lead who wants to understand what the news means and what
to do about it.

Do not produce generic news summaries, rewritten press releases, or clickbait.

## Hard guardrails

- Work in `D:\Projects\akkapol-systems`.
- Start from a clean `main`. If `git status --short` is not empty, stop and report.
- Pick one story, not a roundup. Prefer stories from the last 24-48 hours.
- Open a PR. **Do not merge it automatically.**
- Do not invent benchmarks, quotes, dates, or product capabilities.
- Do not copy source paragraphs. Summarize and add original analysis.
- Disclose AI assistance through `source: "dsh"` in the frontmatter.
- If no story is worth publishing, publish nothing and report why.

## 1. Gather candidate news

Use `web_search` with a few focused queries, for example:

- `AI agents developer tooling news today`
- `LLM open source release this week`
- `AI coding tools engineering news`
- `Next.js developer tooling news`
- `AI automation small business news`

Also check at least three of these sources directly with `web_fetch`:

- Hacker News: https://news.ycombinator.com/
- TechCrunch AI: https://techcrunch.com/category/artificial-intelligence/
- The Verge AI: https://www.theverge.com/ai-artificial-intelligence
- Ars Technica: https://arstechnica.com/
- Dev.to: https://dev.to/
- GitHub Blog: https://github.blog/
- OpenAI, Anthropic, Google DeepMind, or Meta AI official blogs

Collect the source URL, title, publication date, and one or two concrete facts
for each candidate. Prefer primary sources over aggregators.

## 2. Choose the angle

Pick a story that passes all of these:

- relevant to AI systems, agents, developer tooling, automation, or practical
  software engineering;
- useful to a founder or small team, not just industry spectators;
- has at least one verifiable fact, release, benchmark, or design decision;
- leaves room for an original explanation, comparison, or working takeaway.

Reject funding-only news, stock moves, celebrity drama, rumors, and stories that
would only be a rewritten press release.

Check existing posts before writing:

```powershell
Get-ChildItem content/blog -Filter *.md | Select-Object Name
Select-String -Path content/blog/*.md -Pattern '^title:' | Select-Object -First 40
```

Do not repeat a topic that is already covered unless there is a genuinely new
development and the new post links to the older one.

## 3. Write the post

Create `content/blog/<slug>.md`. The slug must match
`^[a-z0-9]+(?:-[a-z0-9]+)*$` and should be descriptive, not dated.

Frontmatter:

```md
---
title: "Specific, useful title"
description: "A 120-160 character summary for cards and search."
date: "2026-10-25T08:30:00+07:00"
tags: ["AI", "Agents", "Engineering"]
draft: false
source: "dsh"
image: "/images/blog/<slug>/cover.png"
imageAlt: "Short description of the cover"
---
```

Body requirements:

- 900-1400 English words.
- Open with a 2-3 sentence "Why it matters" summary, not a history lesson.
- Use `##` sections with clear, specific headings.
- Include at least one concrete takeaway, checklist, code snippet, or decision
  framework that the reader can use.
- Explain the trade-offs and what you would do differently in a small team.
- Cite 2-4 primary sources inline as Markdown links.
- End with a short sources list and a soft link to `/cv` or the contact section.
- No raw HTML. The renderer supports headings, paragraphs, lists, blockquotes,
  fenced code, inline code, bold, italic, links, and horizontal rules.

If the story needs a diagram, describe it in prose or use a small code block.
Do not paste copyrighted images or screenshots.

## 4. Generate the cover

Run:

```powershell
npm run blog:cover -- --slug <slug> --title "<post title>" --tag "AI / ENGINEERING"
```

This writes `public/images/blog/<slug>/cover.png` at 1200x630 and prints the
JSON path. The frontmatter must point at that exact path. Keep the cover text
short and readable.

## 5. Verify before opening a PR

Run all of these from the repo root:

```powershell
npm run test:security
npm run lint
npm run build
npm run test:metadata
```

Also confirm:

- `content/blog/<slug>.md` exists and parses as a post;
- `public/images/blog/<slug>/cover.png` exists;
- the title, description, slug, date, tags, and image path are consistent;
- no secret, API key, private URL, or personal data appears in the post.

If any check fails, fix it. If it still fails, stop without opening a PR.

## 6. Open a review PR

Use a branch named `blog/daily-YYYY-MM-DD-<slug>`.

1. Create the branch from `main`.
2. Commit the post and cover.
3. Push the branch. If git credential helper fails, add
   `C:\Users\akkap\.local\git\ucrt64\bin` to `PATH` first.
4. Open a pull request against `main` with:
   - title: `content: <post title>`
   - body: a short summary, source links, the checks you ran, and a note that
     the cover was generated locally.
5. Do **not** merge the PR. Report the PR URL and a one-paragraph summary.

If GitHub authentication is unavailable, commit locally and report the branch
and file path; do not leave the repo in a detached or dirty state.

## Output

At the end, report:

- chosen story and why it matters;
- post slug, title, and cover path;
- checks run and their result;
- PR URL, or the reason no PR was opened.
