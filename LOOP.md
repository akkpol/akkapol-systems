# Loop Engineering — Akkapol Systems

## Active Loops

| Loop | Cadence | Level | Status |
|------|---------|-------|--------|
| Daily Triage | 1d | L1 (report) | Ready — skills exist, STATE.md + budget + run-log in place |
| Post-Session Cleanup | on-demand | L1 (manual) | Ready — run `skill_view(name='post-session-cleanup')` |

## Project Knowledge (for loop context)
- **Stack**: Next.js 16, React 19, Tailwind v4, Framer Motion v12, npm
- **Vercel prod**: akkapol-systems.vercel.app
- **Type**: Portfolio / Business Landing
- **Font**: LINE Seed Sans TH

## Loop Files
- `STATE.md` — memory spine
- `LOOP.md` — this file
- `loop-budget.md` — token caps + denylist
- `loop-run-log.md` — append-only audit trail

## Kill Switches
- Pause: `cronjob action=pause job_id=<id>`
- Kill: `cronjob action=remove job_id=<id>`
- Budget: 50k tokens/day (see `loop-budget.md`)

## Hermes Skills Used
- `loop-triage` — `skill_view(name='loop-triage')`
- `post-session-cleanup` — `skill_view(name='post-session-cleanup')`
- `loop-engineering-universal` — full concept guide
