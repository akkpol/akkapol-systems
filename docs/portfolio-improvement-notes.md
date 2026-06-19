# Akkapol Systems — Portfolio Improvement Notes

Audit date: 2026-06-19
Target site: https://akkapol-systems.vercel.app/
Repository: akkpol/akkapol-systems

## Current read

The site already has a strong visual identity and clear personal positioning around AI systems, workflow design, and practical execution. The current homepage works well as a personal CV / systems-builder portfolio, but it is not yet optimized as a client-conversion page for Fastwork, SME consulting, website packages, or workflow-system sales.

The strongest current message is:

> Creative AI Systems Builder — systems, workflows, and intelligent tools for real business operations.

That positioning is useful, but the page should make the next commercial step more obvious: what services are sold, what outcomes clients get, what proof exists, and how to start a scoped conversation.

## Priority 1 — Convert from CV-first to client-offer-first

### Problem

The homepage currently gives visitors a CV-style journey: profile, summary, focus, skills, experience, education, then contact. That is good for recruiters, but business clients need a clearer buying path.

### Improvements

Add a high-priority `Services / Offers` section directly after the hero or after the first explanation panel.

Recommended offer cards:

1. Company Website / Landing Page
   - Outcome: professional business website, lead capture, responsive design, Vercel deployment.
   - Starting price reference: 9,900 THB.

2. Workflow & Backoffice System
   - Outcome: customer intake, quotation flow, job status, production visibility, dashboard.
   - Starting price reference: audit / prototype / MVP tiers.

3. AI Workflow Audit
   - Outcome: identify repetitive work, map automation opportunities, create 30-day action plan.
   - Starting price reference: consult / audit / blueprint tiers.

Suggested section title:

> Practical systems you can start with

Suggested short copy:

> Start small: website, workflow audit, or operational prototype. Each service is scoped to reduce uncertainty before building a full system.

## Priority 2 — Add project proof / case studies

### Problem

The site says the work is practical and operational, but it needs visible proof. Right now, Smart Signage and other system projects are not surfaced strongly enough as case studies.

### Improvements

Add a `Selected Work` or `Case Studies` section.

Recommended cards:

1. Smart Signage — Product Case Study
   - Working prototype for signage-business operations.
   - Scope: customer intake, quotation workflow, production status visibility, practical digital process design.
   - Position clearly as a case study / working prototype, not a SaaS product.

2. Company Website Packages
   - Show real packaging: Starter Page, Company Website, Product Catalog.
   - Mention clear deliverables and deployment.

3. AI-Integrated SME Workflow
   - Present as a systems-thinking case, not generic AI consulting.
   - Use `Clarify → Design → Build → Operate` as the process.

Suggested route:

- `/projects/smart-signage`
- `/services/websites`
- `/services/workflow-systems`
- `/services/ai-workflow-audit`

## Priority 3 — Align positioning across website, LinkedIn, and Fastwork

### Problem

The site currently mixes several role labels:

- Creative AI Systems Builder
- AI Systems Builder & Problem Solver
- AI-integrated systems builder
- Independent AI Systems Developer & Consultant

This is not wrong, but it can feel scattered. Commercial profiles should use one main positioning and then variants underneath.

### Recommended primary positioning

> Creative AI Systems Builder | AI-Integrated Operations, Robotics & Workflow Systems

### Website hero option

Headline:

> Creative AI Systems Builder

Subheadline:

> I design and build practical websites, workflow systems, and AI-assisted tools for real business operations.

CTA buttons:

- View services
- Start a scoped conversation
- View CV

Make `View CV` secondary, not primary, when the site is used for client acquisition.

## Priority 4 — Add Thai-language commercial copy

### Problem

The current site is English-first. That is good for international positioning, but Fastwork and Thai SME clients will convert better with Thai explanations.

### Improvements

Add either:

1. Thai / English toggle, or
2. Thai landing section under the English hero.

Suggested Thai block:

> รับออกแบบและพัฒนาเว็บไซต์บริษัท ระบบรับข้อมูลลูกค้า ระบบใบเสนอราคา ระบบติดตามสถานะงาน และ Workflow สำหรับธุรกิจ SME โดยเน้นใช้งานจริง เริ่มจากขอบเขตเล็ก ทดสอบเร็ว และต่อยอดเป็นระบบหลังบ้านได้

Suggested CTA:

> คุยขอบเขตงานเบื้องต้น

## Priority 5 — Add a lightweight intake form

### Problem

Current CTA uses email / mailto. That is usable, but a structured lead form will reduce friction and help scope work faster.

### Improvements

Add `/contact` or embedded lead form with fields:

- Name
- Business type
- What do you need? Website / Workflow / AI Audit / Other
- Current problem
- Budget range
- Timeline
- Contact method: Email / LINE / Phone

Implementation options:

- Simple form using Formspree / Google Forms / Tally for fastest launch.
- Supabase table for a more controlled version.
- Later: LINE notification or email notification.

## Priority 6 — Add pricing and scope transparency

### Problem

The site currently demonstrates capability but does not reduce buyer uncertainty enough. Clear starting packages will help visitors self-qualify.

### Improvements

Add a `Start with a defined scope` section.

Suggested packages:

### Website Starter

- Landing page or one-page company page
- Responsive design
- Lead/contact form
- Vercel deployment
- Starting from 9,900 THB

### Business Website

- 3–5 pages
- Lead capture
- Basic SEO
- Social / LINE links
- Starting from 19,900 THB

### Catalog / Workflow Prototype

- Product or service catalog
- Basic admin / structured data
- Quote request flow or workflow prototype
- Starting from 39,000 THB

Do not overpromise SaaS, enterprise ERP, or full automation at the entry price.

## Priority 7 — Improve SEO and sharing image

### Problem

The site has basic metadata, but it should be more aligned with commercial search and social sharing.

### Improvements

1. Add service keywords to metadata:
   - AI workflow systems
   - business website development
   - SME automation
   - Next.js developer Thailand
   - AI systems consultant Thailand

2. Add a proper Open Graph image sized closer to 1200x630.
   - Current portrait-style image may not crop well in link previews.
   - Create a branded OG card: name, role, services, dark systems visual.

3. Add route-specific metadata for:
   - `/cv`
   - `/services/*`
   - `/projects/*`

## Priority 8 — Improve trust signals

### Problem

Visitors need confidence before contacting.

### Improvements

Add:

- Delivery process: Clarify → Design → Build → Operate
- What clients receive
- What is not included
- Revision policy
- Typical timeline
- Stack used
- Maintenance / handoff options

Suggested trust block:

> I do not sell vague AI hype. I start by clarifying the workflow, defining the smallest useful version, then building a system that can be tested and improved.

## Priority 9 — Technical cleanup and maintainability

### Current technical notes

The project uses Next.js, React, Vercel Analytics, Framer Motion, Tailwind CSS, TypeScript, and Vercel tooling.

### Improvements

1. Add `npm run typecheck` script.
2. Add `npm run format` or Prettier.
3. Add a content checklist for CV / portfolio updates.
4. Move service offers and case studies into structured data files, similar to `app/_data/cv.ts`.
5. Add reduced-motion handling for heavy animations.
6. Audit mobile hero layout, especially portrait visibility and CTA stacking.
7. Add accessibility checks for focus states, color contrast, and motion.
8. Add simple route smoke checks for `/`, `/cv`, `/robots.txt`, `/sitemap.xml`.

## Priority 10 — README upgrade

### Problem

The README is still minimal and developer-only.

### Improvements

Add:

- Purpose of the site
- Main routes
- Local development
- Deployment notes
- Content update guide
- Roadmap
- Design principles

Suggested README tagline:

> Personal systems portfolio and commercial landing site for Akkapol Kumpapug, focused on AI-integrated operations, workflow systems, and production-ready web delivery.

## Suggested implementation order

### Phase 1 — Commercial clarity

1. Add Services / Offers section.
2. Add Selected Work / Case Studies section.
3. Adjust hero CTA priority: services first, CV second.
4. Add Thai commercial copy.

### Phase 2 — Conversion

1. Add contact / intake form.
2. Add pricing / scope section.
3. Add trust and delivery process block.
4. Add Smart Signage case-study page.

### Phase 3 — Technical polish

1. Add OG image.
2. Improve metadata.
3. Add typecheck / format scripts.
4. Add reduced-motion and accessibility audit.
5. Upgrade README.

## Final direction

The site should not become only a CV. It should become a client-facing systems studio page:

> Profile → Services → Proof → Process → Contact

Keep the personal identity, but make the buying path clearer.
