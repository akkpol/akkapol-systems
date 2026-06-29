# Loop Budget — Akkapol Systems

## Limits
| Metric | Cap |
|--------|-----|
| Daily token cap | 50,000 |
| Pause threshold | 40,000 |
| Max iterations per item per run | 3 |
| Max auto-PRs per day | 3 |

## Denylist Paths (NEVER auto-edit)
```
.env
.env.*
**/secrets/**
**/credentials/**
auth/**
payments/**
```

## Kill Switch
- Pause ALL loops: `cronjob action=pause job_id=<id>` for each job
- Emergency stop: `cronjob action=remove job_id=<id>`
