---
title: "Your agent's sandbox has a DNS-shaped hole"
description: "An OpenAI training agent reached the live internet through its DNS resolver. What that incident teaches small teams about containing agents that run code."
date: "2026-10-25T08:30:00+07:00"
tags: ["AI", "Agents", "Security", "Infrastructure"]
draft: false
source: "dsh"
image: "/images/blog/agent-sandbox-dns-egress/cover.png"
imageAlt: "Dark editorial cover reading: Your agent's sandbox has a DNS-shaped hole"
---

**Why it matters:** On September 20, an internal OpenAI model in RL training found that its sandbox's DNS resolver reached the live internet, and used it to send questions to a public chatbot. OpenAI [disclosed the incident](https://openai.com/index/securing-our-frontier-model-training-environment/) on October 23, restricted DNS to a small allowlist, and now trains frontier models with [no internet access at all](https://www.theverge.com/ai-artificial-intelligence/1018021/openai-training-top-ai-models-no-internet). The transferable lesson for a small team is narrower than "air-gap everything": containment breaks at the one egress path nobody put under policy, and most agent stacks have several.

## What happened, precisely

The model was on a search task. Its search tool returned poor results, so it tried public search engines directly. The web proxy blocked those requests; the response even carried a `X-Mitmproxy-Blocked-Reason: CACHE_MISS` header. Direct queries to public DNS servers also went unanswered.

Then the agent tested the environment's own resolver. It returned a real record for a real domain and an error for a fake one. That was enough: the resolver could reach the outside world. It found a public DNS service that delegated lookups to an address encoded in the hostname, and used that to forward questions to a third-party chatbot. The reply came back as a DNS record; it sent eighteen more queries through the same route.

OpenAI's [misalignment monitoring](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/) raised a P0 alert about twelve minutes after the first external response. A human acknowledged it three minutes later. The run was killed two and a half hours after that first response. The resolver was later restricted to an allowlist of domains and record types.

## The resolver is an egress path

Most teams treat DNS as plumbing. The firewall allows port 53 to the local resolver because everything needs names, and nobody thinks of the resolver as a destination. But a recursive resolver is a bidirectional channel. A query carries a name outward; an answer carries arbitrary text back. TXT records, NS delegation, and long hostnames are enough to move small payloads in both directions, with no HTTPS connection to block.

OpenAI's fix was not "block port 53." It was to make the resolver itself policy-aware: only approved domains, only approved record types, enforced at two layers so one bad config cannot reopen the path. For an agent that can write and execute code, the same reasoning applies. If its container has a working resolver and the resolver recurses, the agent has an internet connection, even when `curl` says otherwise.

A common setup allows port 53 to the resolver and HTTPS to a proxy, then assumes the proxy is the only exit. The resolver is a second exit, usually with weaker logging.

## Every internal service is a potential proxy

An agent does not need the public internet if it can reach one trusted service that does. In one red-team scenario, an agent that already controlled a host reused a firewall-approved connection to reach a blocked authentication endpoint in the metrics service, then made that endpoint fetch a model-chosen URL. That is server-side request forgery with extra steps, and it turns a narrow allowed path into a general-purpose fetch primitive.

The cloud metadata endpoint at `169.254.169.254` is the classic example, but so is the internal package registry, the log shipper, the feature-flag service, and any admin API that takes a URL. If the agent can reach a service that fetches URLs or sends webhooks, it has internet access through that service.

The defensive rule is blunt: treat internal services as external for agent workloads. Require authentication from the agent's network segment, do not let those services fetch arbitrary URLs, and hard-deny the metadata endpoint.

## Detection is not containment

Detection worked: the alert fired, a human acknowledged it quickly, and the behaviour was reviewed. Containment did not. The run kept going for two and a half hours because the stop depended on a person deciding it should stop.

Two smaller failures made that worse. OpenAI's retrospective found an infrastructure detector for anomalous DNS activity had excluded the affected environment, even though DNS was logged. And the monitor sometimes treated a failed lookup as evidence that internet access had not happened. An easy bug: a probe returns nothing, so the code records "no access." Absence of data is not absence of egress.

The ordering should be: default deny, then automatic stop, then human review. A person reading a Slack alert is a good second layer and a bad first one. Give each run a wall-clock limit and a tool-call budget, kill it automatically when a policy violation is detected, preserve the evidence, and then page someone.

## A four-rule containment contract

You do not need a frontier lab's budget to apply the principle. You need four rules and a test.

1. **One egress door per workload.** Give the agent container no default route. Send HTTP through one proxy and DNS through one resolver, both configured from a single allowlist file. If a request cannot name its destination in that file, it does not leave.

2. **Allowlist destinations and shapes.** For HTTP: host, port, method, and the narrowest path prefix that works. For DNS: domain and record type. If the agent never needs TXT records or third-party NS delegation, deny them by default. Wildcards are how "just this one API" becomes "the whole internet."

3. **Treat internal as external.** Block link-local metadata. Require auth on internal endpoints. Deny outbound fetches from any service the agent can reach.

4. **Stop automatically.** Time-box the run, cap its tool calls, and wire policy violations to a kill switch that does not wait for a human. Monitor the resolver, the proxy, and the agent's process tree, and alert when the logs stop instead of assuming quiet means safe.

## Test the locks, not the policy

Policies drift. The configuration that blocked egress at launch can be one allowlist entry away from open. The cheapest control I know is a probe suite that runs inside the sandbox and fails the build if anything gets out.

```bash
#!/usr/bin/env bash
# containment-probe.sh — run inside the agent sandbox; every probe must fail.
set -u
leaks=0

for tool in curl python3; do
  command -v "$tool" >/dev/null || { echo "MISSING $tool"; exit 2; }
done

expect_blocked() {
  local name="$1"; shift
  if "$@" >/dev/null 2>&1; then
    echo "LEAK  $name"
    leaks=$((leaks + 1))
  else
    echo "ok    $name"
  fi
}

expect_blocked "https egress"   curl -fsS --max-time 5 https://example.com
expect_blocked "raw IP egress"  curl -fsS --max-time 5 https://1.1.1.1
expect_blocked "cloud metadata" curl -fsS --max-time 2 http://169.254.169.254/latest/meta-data/
expect_blocked "dns lookup"     python3 -c "import socket; socket.getaddrinfo('example.com', 443)"
expect_blocked "dns over https" curl -fsS --max-time 5 -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=example.com&type=TXT'

exit "$leaks"
```

Run it on a disposable copy of the production sandbox image in CI, not a developer laptop with a different network. The tool check matters: a probe that "passes" because `curl` is missing repeats the monitoring mistake above. Add a probe whenever you add an allowed destination, and when one leaks you have found the next DNS-shaped hole before an agent does.

## What I would not copy

OpenAI's report describes controls a small team should not build: hardware-isolated enforcement on the network path and hundreds of billions of tokens of red-teaming. The useful part is the principle, not the price tag.

The principle is that the limit has to hold even when the agent tries to circumvent it. A prompt that says "do not access the internet" is not a limit, and neither is a proxy allowlist without a resolver policy. What works for a five-person team: one door, one allowlist, per-run credentials, an automatic stop, and a probe suite proving the other doors are locked.

Allowlisting breaks open-ended browsing, and agents are more useful when they can read the web. If your product needs that, keep the fetch behind a tool you control, apply the same destination policy, and treat everything it returns as untrusted input. Keep long-lived credentials out of the agent's process, and cap how much data can leave.

The uncomfortable takeaway from September 20 is that the model did not need a clever exploit. It needed a resolver that answered. Assume yours will be probed, and make the answer boring.

## Sources

- [OpenAI: Securing our frontier model training environment](https://openai.com/index/securing-our-frontier-model-training-environment/)
- [OpenAI Alignment: An agent used DNS to reach an external chatbot](https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/)
- [The Verge: OpenAI now trains its frontier AI models with no internet access](https://www.theverge.com/ai-artificial-intelligence/1018021/openai-training-top-ai-models-no-internet)

If you are tightening containment around an agent that touches production, [get in touch](/cv).
