# Premium Systems Studio Theme Contract

Status: Foundation v1
Audience: future maintainers, v0 prompts, and design-system extraction

## Positioning

This theme is a premium dark systems-studio portfolio for operators, builders, consultants, and AI systems creators.

It should feel precise, quiet, technical, and expensive. It should not feel like a generic AI landing page, SaaS dashboard, neon cyberpunk page, or decorative portfolio template.

## Visual Rules

- Use dark structural space as the default canvas.
- Use amber as the primary signal color.
- Use cyan only as a supporting system-flow accent.
- Keep geometry thin, restrained, and purposeful.
- Prefer low-alpha panels over heavy cards.
- Keep rounded corners tight.
- Use motion to imply system flow, focus, or response. Do not add motion just to decorate.
- Preserve readability before spectacle.

## Token Families

Core tokens live in `app/globals.css`.

- `--ak-color-*`: semantic brand, foreground, and background roles.
- `--ak-border-*`: panel and secondary border roles.
- `--ak-surface-*`: panel, contact, and secondary surface roles.
- `--ak-shadow-*`: premium elevation and CTA glow roles.
- `--ak-radius-*`: shared radius rules.
- `--ak-space-*`: spacing scale for primitive padding, gaps, and compact layout rhythm.
- `--ak-layout-*`: page container and section spacing roles.
- `--ak-control-*`: reusable control sizing roles.
- `--ak-ease-*` and `--ak-duration-*`: shared motion timing.
- `--ak-type-*`: typography scale roles.

Avoid introducing new raw color, shadow, spacing, sizing, easing, or duration values in reusable TSX components. If a value is reused or brand-defining, promote it to a token first.

## Color Modes

Dark mode is the production default.

The token layer supports both:

- `html[data-theme="dark"]`: current production-grade visual direction.
- `html[data-theme="light"]`: light studio direction for browser QA and theme extraction.

The homepage exposes a small `ThemeModeToggle` in the hero header. Keep dark mode as the premium default, and treat light mode as a supported preview state that still needs final marketplace polish before template packaging.

## Spacing And Layout

Use the spacing scale before inventing new section rhythm.

- `--ak-space-*`: component-level spacing from tight to roomy.
- `--ak-layout-container`: standard homepage max width.
- `--ak-layout-section-x`: section horizontal padding.
- `--ak-layout-section-y`: section vertical padding.
- `--ak-control-height` and `--ak-control-height-lg`: CTA/control heights.

Homepage primitives should use these tokens through classes like `ak-section-frame`, `ak-surface-*`, `ak-contact-row`, `ak-signal-icon`, and `ak-cta`.

Raw Tailwind spacing is acceptable for one-off local composition, but repeated spacing patterns should move into tokens or primitives.

## Typography

Use semantic type classes instead of raw Tailwind text sizes on the homepage.

- `ak-type-display-hero`: hero name.
- `ak-type-title-hero`: hero role or key descriptor.
- `ak-type-body-hero`: hero support copy.
- `ak-type-title-panel`: the hero bottom panel title.
- `ak-type-title-section`: short section headings.
- `ak-type-title-section-long`: long explanatory section headings.
- `ak-type-title-card`: card and item titles.
- `ak-type-body-lg`: summary and high-emphasis body text.
- `ak-type-body`: standard body text.
- `ak-type-body-sm`: dense cards and metadata.
- `ak-type-label`: mono uppercase labels.

The `/cv` route may keep its own print-oriented typography until a dedicated CV theme pass is planned.

## Layout Primitives

Use the shared primitives in `app/_components/system-primitives.tsx` before creating new local section markup.

- `SectionHeading`: section eyebrow and title hierarchy.
- `Surface`: compact, roomy, and card panels.
- `ContactRow`: contact/action rows with consistent hover behavior.

Use CSS classes for repeated visual rules:

- `ak-theme-shell`: page-level background and foreground.
- `ak-section-frame`: standard homepage section width and spacing.
- `ak-surface`: shared panel base.
- `ak-surface-strong`: stronger panel variant.
- `ak-surface-card`: repeated card items with premium hover lift.
- `ak-contact-row`: contact rows and secondary action rows.
- `ak-signal-icon`: accent icon container.
- `ak-cta`, `ak-cta-primary`, `ak-cta-secondary`: hero CTA contract.

## Hero Composition Rules

`StudioHero` is both a product hero and the brand's signature visual system. Treat it like a layered composition, not a normal content section.

- Keep the top row as a navigation safe area. The theme toggle may stay there, but status labels, portrait edges, and decorative map details should not crowd it.
- Keep exact text, CTA labels, profile image placement, and navigation controls deterministic in TSX/CSS.
- Keep visual atmosphere, pipeline energy, system map motion, and hover sheen as polish layers that cannot rewrite or move critical content.
- When moving the desktop portrait or status label, use one visible source of truth in `StudioHero.tsx`. Do not leave duplicate position rules in `globals.css`.
- Mobile may hide the portrait and status label, but the hero name, CTA stack, and theme toggle must remain visible and free from horizontal overflow.

## Motion Rules

Motion should have one of three jobs:

- Signal flow: pipeline pulses, scroll progress, system-map energy.
- Focus response: CTA hover, hero name sheen, card lift.
- Entrance rhythm: smooth reveal, portrait entry, content scroll reveal.

Use shared easing and duration tokens where CSS owns the motion. Framer Motion components should match the premium easing feel already used in hero motion.

Every new animated component must consider reduced motion. Decorative motion should degrade to a still premium composition.

## Component Boundaries

`StudioHero` is the signature composition. It may keep some local SVG and hero-specific geometry because it functions as brand artwork.

Homepage content sections should move toward primitives and token-backed classes.

`/cv` is a separate print subsystem. Do not force it into homepage primitives unless the print layout is explicitly tested.

## v0 Prompt Seed

Use this when generating new pages or sections in the same direction:

```text
Create a premium dark systems-studio portfolio section using the existing Premium Systems Studio theme. Use semantic typography, amber primary signal accents, cyan secondary flow accents, low-alpha dark panels, tight radius, restrained geometric details, and purposeful micro-interactions. Avoid generic AI gradients, oversized marketing cards, decorative blobs, and loud neon styling. Reuse SectionHeading, Surface, ContactRow, ak-section-frame, ak-surface, ak-signal-icon, and ak-cta classes where possible.
```

## Acceptance Checklist

Before merging a theme-system change:

- `npm run lint` passes.
- `npm run build` passes.
- Homepage renders without horizontal overflow on mobile.
- Hero name keeps the critical display scale.
- CTA layout does not overlap the portrait or system map.
- Repeated panels use `Surface` or `ak-surface` classes.
- New homepage headings use semantic type classes.
- New reusable styles use tokens instead of raw colors or shadows.
- `/cv` print readability is not regressed.

## Current Non-Goals

- Do not replace the font yet.
- Do not create a full marketplace package yet.
- Do not extract a Figma library until visual QA is signed off.
- Do not redesign the hero composition in this foundation pass.
