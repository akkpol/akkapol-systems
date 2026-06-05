# Theme System Foundation Audit

Date: 2026-06-05
Direction: Premium Systems Studio portfolio/template

Related contract: `docs/theme-system-contract.md`

## Executive Verdict

The site is visually strong enough to become a theme system, but it is not yet structured enough to sell or reuse as a v0-ready template.

The right next move is not a full redesign. The right move is to turn the current visual language into a small, strict theme contract: typography, color roles, surface roles, motion roles, and reusable page primitives.

## Current Strengths

- The visual identity is clear: dark studio, amber/cyan signal accents, geometric system-map language.
- Typography has started moving toward reusable semantic utilities through `ak-type-*`.
- Hero motion is now more distinctive and protected by critical inline fallback styles.
- The profile image, pipeline, labels, and CTA area are becoming a recognizable signature for the template.
- `/cv` is correctly treated as a separate print-oriented route instead of being forced into the homepage system.

## Main Risks

- Color values are still scattered across `app/globals.css`, `app/page.tsx`, `app/cv/page.tsx`, and hero components.
- Light mode now has a working hero toggle and passed smoke QA, but it still needs a final marketplace polish pass across all sections and `/cv`.
- Surface styles are repeated as raw Tailwind class clusters like border, background alpha, shadow, and backdrop blur.
- Motion timing, easing, blur, and hover behavior are not yet named as reusable design rules.
- The hero is polished, but many sections below it still use local styling rather than shared primitives.
- `app/globals.css` currently mixes tokens, typography, component effects, animation keyframes, responsive overrides, and print rules in one place.
- Template readiness is limited because content, components, and visual rules are not fully separated yet.

## Readiness Score

Typography: 6.5 / 10

There is a useful `ak-type-*` foundation. The next step is to remove remaining raw text sizing from reusable homepage components and document when each level should be used.

Color System: 7 / 10

The palette is now tokenized for dark production and light-mode preview, including foreground, surface, border, accent, signal, and control text roles. The hero supports a visible toggle and passed first-pass visual QA.

Spacing / Layout System: 6 / 10

The homepage primitives now use shared spacing, layout, and control-size tokens. More local hero and CV spacing still needs a future pass before the system is fully portable.

Surface System: 4 / 10

Cards and panels look related, but each section still defines its own border, alpha background, shadow, and blur. This should become 3-5 named surface classes.

Motion System: 5 / 10

The hero interaction is promising. The system still needs shared duration/easing tokens and consistent reduced-motion behavior across all motion components.

Component System: 5 / 10

There are useful components, but not enough primitives. The project needs reusable `Button`, `SectionHeading`, `SurfaceCard`, `SignalLabel`, and `PremiumPanel` primitives before it can become a clean theme system.

v0 / Template Readiness: 4 / 10

The site can inspire a template now, but it is not yet packaged like one. It needs documented rules, component APIs, and clear content slots.

## Recommended Roadmap

Phase 1: Theme Tokens

- Add semantic CSS variables for color, border, surface, shadow, layout, and motion.
- Keep the current look; this phase should not visually redesign the site.
- Reduce direct hex/rgba usage in TSX.

Phase 2: Reusable Primitives

- Create small components for buttons, section headings, cards, labels, and panels.
- Move repeated Tailwind clusters into these primitives.
- Keep component APIs simple and content-driven.

Phase 3: Homepage Refactor

- Rebuild homepage sections from the primitives.
- Keep `StudioHero` as the premium signature component.
- Keep `/cv` as a separate print route with its own constraints.

Phase 4: Template Documentation

- Add usage guidance for typography, surfaces, motion, and content slots.
- Add a v0 prompt/spec for generating pages in the same style.
- Add acceptance screenshots for desktop, mobile, and CV.

## Acceptance Checklist Before Selling As A Theme

- No raw color values in reusable TSX components except intentional SVG artwork.
- CTA, card, panel, and section heading styles come from shared primitives.
- Motion durations/easings use named variables or shared constants.
- Reduced-motion behavior is covered for every animated component.
- Desktop and mobile screenshots match the intended premium direction.
- Production deployment visually matches local development.
- `/cv` print layout remains stable.

## Recommendation

Start laying the theme-system structure now, but do it in a foundation pass first.

Do not jump straight to a full design system, Figma library, or marketplace package. The smallest valuable next step is token extraction plus 4-5 reusable primitives. After that, the site will be much easier to polish, sell, and regenerate through v0 without losing the premium identity.

## Foundation Pass 1 Progress

Implemented after this audit:

- Added semantic theme tokens in `app/globals.css` for brand colors, surfaces, borders, shadows, radius, and motion timing.
- Added `data-theme` color-mode tokens for dark production and light-mode preview, plus a visible hero `ThemeModeToggle`.
- Added spacing and layout scale tokens for reusable section rhythm, surface padding, icon sizing, and CTA control height.
- Added reusable theme classes for shell layout, section frames, surfaces, contact rows, signal icons, and hero CTAs.
- Tightened the new primitive classes so their hover surfaces, secondary borders, CTA shadows, ink, and white values are also token-backed.
- Added `app/_components/system-primitives.tsx` with `SectionHeading`, `Surface`, and `ContactRow`.
- Refactored homepage sections to use the new primitives instead of repeated Tailwind surface clusters.
- Refactored hero CTA buttons to use shared `ak-cta` classes while preserving the existing premium hero behavior.
- Added `docs/theme-system-contract.md` to define visual rules, token families, primitive usage, motion rules, v0 prompt seed, and acceptance checks.
- Documented hero composition rules so the nav safe area, theme toggle, status label, portrait, and visual polish layers have clear ownership.
- Removed duplicate hero position rules from `globals.css`; the current status-label and portrait offsets now live in `StudioHero.tsx` as the visible source of truth.

Validation:

- `npm run lint` passed.
- `npm run build` passed.
- `http://localhost:3000/` returned HTTP 200.
- Edge headless desktop screenshot at `1280x720` passed visual smoke QA for hero scale, CTA layout, and dark premium direction.
- Edge headless mobile screenshot at `390x844` passed visual smoke QA for hero title fit, CTA stacking, no obvious horizontal overflow, and next-section hint.
- In-app browser QA passed for dark desktop and light desktop hero states after the profile transition settled.
- In-app browser QA passed at mobile `390x844`: no horizontal overflow, profile/status hidden at mobile breakpoint, mode toggle visible.
- Theme toggle click changed `data-theme` from `light` to `dark` with no Next overlay or console-blocking issue observed.
- Hero nav clearance pass moved the `SYSTEMS THINKER` label and desktop portrait down while keeping the mode toggle available in the top safe area.

Open QA:

- Light mode still needs a final full-page polish pass before marketplace/template packaging, especially below-the-fold sections and `/cv`.
- A final human pass in the in-app browser is still recommended before deploy because smoke screenshots do not prove all hover, scroll, and animation states.
