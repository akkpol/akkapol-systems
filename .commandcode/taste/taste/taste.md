# Taste
- Writes requests in Thai and expects responses in Thai. Confidence: 0.85
- Frames work as short, outcome-focused instructions (what to change + the constraints it must satisfy) rather than step-by-step implementation directions. Confidence: 0.75
- Prefers shared, reusable components that every page consumes instead of duplicated per-page markup (e.g., one nav component used by the homepage and all interior pages). Confidence: 0.9
- Expects all UI copy to be bilingual Thai + English: locale-aware labels and language switching, with no hardcoded single-language text. Confidence: 0.9
- Expects responsive behavior on both desktop and mobile for shared UI (e.g., inline nav pills on desktop, collapsible hamburger panel on mobile). Confidence: 0.9
- Values consistency across locales and breakpoints — the same component should behave identically wherever it is used. Confidence: 0.85
- Prefers the GitHub CLI (`gh`) for GitHub workflows such as authenticating, listing, and reviewing pull requests. Confidence: 0.6
