---
title: "How Cloudflare cut AI review cost 68%: cache first, then models"
description: "Cloudflare's AI code review fell from $2.43 to $0.77 per run. The biggest win was cache ordering and fewer calls, not a cheaper model."
date: "2026-10-25T08:30:00+07:00"
tags: ["AI", "Agents", "Engineering", "Cost"]
draft: false
source: "dsh"
image: "/images/blog/ai-review-cost-cache-ordering/cover.png"
imageAlt: "Dark editorial cover with the title about cutting AI review cost through cache ordering"
---

## Why it matters

Cloudflare cut its AI code reviewer from $2.43 to $0.77 per run, 68% cheaper, while making reviews faster. The headline is the least interesting part. The post shows the money went to context the model had already seen, paid for again because the prompt was ordered badly. That is an accounting problem most teams running agents will eventually have.

## What actually happened

Cloudflare's reviewer is a coordinator that dispatches specialist reviewers at different risk tiers. When the company first wrote about it in April 2026, a review cost $1.19. By late August it cost about $2.46, with no major architectural change.

Between mid-September and mid-October the team rebuilt how sessions were constructed and tested model and effort combinations. A review now costs $0.77, down 68% from the $2.43 averaged over its two most expensive weeks. Median review time fell from 4 minutes 9 seconds to 1 minute 32 seconds.

About 40% of the savings came from code and configuration changes; the rest from model and effort choices. The team says the split is not a controlled experiment, so treat it as a map, not proof.

## The bill was mostly repeated context

Before the work, spend was roughly 23% output tokens, 43% cache writes, and 34% cache reads. Most of the money went to context the model had already processed or was about to see again.

A single code quality review made 16.6 model calls. Across them it wrote 72,000 tokens into the cache and read back 1.08 million, because each call resends the whole conversation. The hit rate was already high, 85.7% in April and 97% by September, but tokens per review more than tripled, from 0.91 million to 2.99 million.

The mechanics matter. Prompt caching stores prefixes, the start of a conversation. A later request reuses an earlier prefix up to where content changes. Writes cost more than normal input, reads cost a fraction, and entries expire after minutes. Caching worked; the stable part of the prompt was never stored on its own.

## The bug was ordering, not caching

Every session begins with nearly identical tool definitions and agent instructions: 11,000 to 21,000 tokens shared across repositories. Yet the first request found a cached prefix only 14% to 26% of the time.

The system prompt was one block: shared instructions, then repository details such as working directory and date, with the only breakpoint at the end. Repository-specific text sat in front of the breakpoint, so the shared prefix was never written alone. A review in one repository could not reuse what another had cached.

The fix: split the block at a marker at the end of the shared instructions, move repository-specific content after it, and keep bytes identical by disabling the skills list and freezing tool descriptions. With a reference index moved into the prompt instead of read on first turns, cost per review fell from $2.47 to $2.02. The standards reviewer's calls per run dropped from 15.9 to 9.6 and cost from $1.12 to $0.72.

Cache behavior is prompt architecture, not a feature you switch on.

## The boring wins: fewer calls

The next round saved about $0.20 per review:

- Sub-reviewers could see a tool they were not allowed to use. In 57% to 76% of sessions they tried it, were rejected, and spent a call recovering. Removing it removed the dead end.
- In 64% of code quality turns the model made one tool call, usually reading one file. Parallel reads cut round trips.
- Two-thirds of jobs were re-reviews where several reviewers had nothing new. Skipping them removed work.
- The review was passed back for a final turn that wrote a summary nobody read; stopping saved about $0.07.
- A timeout was treated as a provider failure and restarted. Separating them took security timeouts from 1.8% of runs to almost none.
- Cancelled jobs kept running: 358 of 446 ran to completion. A 15-second status check fixed it.
- Three reviewers share one first request; the others wait up to 20 seconds to read its cache entry, saving about nine cents each.

None of this needed a better model. It needed reading traces and deleting work that did not help.

## Model choice and effort came second

Model switching produced more savings, mostly by reducing tokens rather than price. Sonnet 5.5 and Sonnet 5 cost the same per token; 5.5 was 62% cheaper per run for code quality, 58% for performance, and 47% for security. Findings were broadly comparable, so all Sonnet reviewers moved to 5.5.

Effort was a separate dial. Opus 5.5 at medium showed no measurable outcome change versus Opus 5, and high effort on the coordinator cost more without a meaningful increase in findings. For code quality, high effort cost 61% more but posted 58% more critical and warning findings, about two cents per review, which was worth paying.

## Quality did not stay free

Critical and warning findings dropped 40% for code quality, 56% for security, and 71% for performance. A cheaper reviewer that finds less is not a win.

Cloudflare checked two ways. Serious findings that led to a commit change rose from 34% to 59%; acted-on findings per 1,000 reviews stayed roughly flat at 132 versus 145, and across all four reviewers rose from 229 to 321. Separately, models blindly judged 657 findings: important findings per review went from 0.28 to 0.30, while inflated severities fell from 0.46 to 0.14.

The honest version: code quality at high effort found real problems while cutting noise. Performance lost real findings at medium effort, roughly one important issue every 24 full-tier reviews, and security may have lost about a quarter, though not significantly. This is fewer, better findings, a different trade.

## What this means for a small team

Three principles transfer:

1. Measure cost per completed task, not per token or tool call. GitHub reported in September that shortening tool output made its agent reopen the original or rerun the command, so the task used more tokens. Local savings became global costs.
2. Treat prompt order as architecture. Volatile content before a breakpoint, including dates, repository names, user identifiers, or a changing tool list, poisons the prefix. Stable instructions first; volatile context after.
3. Test effort against outcomes. Higher effort is sometimes cheaper per useful finding, sometimes just more expensive.

## A playbook for this week

Start with instrumentation:

```text
For every agent run, log:
  task_id, outcome, duration_ms, model_calls
  input_tokens, output_tokens
  cache_read_tokens, cache_write_tokens
  first_call_cache_hit (boolean)
Then compute:
  cost_per_completed_task = total_cost / successful_tasks
  cache_read_ratio = cache_read / (cache_read + cache_write + input)
```

Then:

- Hash each session's first system block. If hashes differ for the same workflow, you have found free money.
- Move volatile values behind the stable prefix and re-measure the first-call hit rate.
- Remove tools the agent cannot use and files it reads every run; count calls per task.
- Respect cache lifetime. Batch or pre-warm bursty runs instead of assuming hits.
- Test two effort levels on real tasks, tracking acted-on findings, not raw finding counts.

## Trade-offs and what I would not copy

The 20-second wait for a shared prefix is a latency tax that only pays at volume. Disabling dynamic skills and freezing tool descriptions reduces flexibility; changing those bytes invalidates the cache. Cloudflare's quality evaluation used blinded judges and commit-level analysis. A small team can use a cheaper proxy: did a human act on the output?

I would not copy the instinct to chase the newest model. Price per token barely moved; savings came from fewer tokens on better-shaped sessions.

## What to do this week

Pick one high-volume agent workflow. Add cost-per-task logging for three days. Fix the prompt prefix before changing models. If the first-call hit rate does not move, you have found your next project.

If you run agents against production, pair this with containment: the [DNS egress note](/blog/agent-sandbox-dns-egress) covers the other half. I write about practical AI systems for small teams; see the [CV](/cv) or [get in touch](/#contact).

## Sources

- [Cloudflare: Cutting our inference bill by 68% by being obsessive about optimization](https://blog.cloudflare.com/obsessive-inference-optimization/) — October 19, 2026
- [Cloudflare: Orchestrating AI code review at scale](https://blog.cloudflare.com/ai-code-review/) — April 2026
- [GitHub: How we make AI coding more cost efficient without sacrificing task quality](https://github.blog/engineering/how-we-make-ai-coding-more-cost-efficient-without-sacrificing-task-quality/) — September 2026
