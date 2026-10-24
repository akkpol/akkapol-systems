---
title: "The Brotli RCE your lockfile can't see"
description: "CVE-2026-111497 hides inside Node, Python, and curl's Brotli copies. A small-team playbook for finding and patching native decoder dependencies."
date: "2026-10-25T03:30:00+07:00"
tags: ["Security", "Node.js", "Dependencies", "Engineering"]
draft: false
source: "dsh"
image: "/images/blog/brotli-rce-your-lockfile-cant-see/cover.png"
imageAlt: "Dark editorial cover reading: The Brotli RCE your lockfile can't see"
---

**Why it matters:** CVE-2026-111497 is a CVSS 9.2 memory-corruption bug in the Brotli decoder that sits inside Node.js, Python's Brotli packages, curl's system library, and other HTTP plumbing. Fixed releases have been available since October 21. The hard part is not applying the patch; it is finding every copy of a native decoder that your lockfile never mentions.

## What broke in the Brotli decoder

Brotli is the compression format behind the `br` content encoding that most modern HTTP stacks support. The vulnerability lives in Google's C decoder, in the code that decides whether a block switch in the compressed stream is valid. That function returned a boolean, and `false` meant two different things: "this stream is malformed" and "I need more input."

On the fast decode path, the caller ignored the return value. A crafted stream could force a block switch that could not succeed, and the decoder would keep going with stale state, writing past the end of its internal buffer. The CVE record rates the result 9.2 and describes impact as memory corruption, memory disclosure, denial of service, or potential remote code execution.

The trigger is not exotic. Anywhere untrusted Brotli data is decompressed, the bug is reachable: `node:zlib` in Node.js, Python's `Brotli` package, `brotlicffi`, HTTP clients that automatically decode `Content-Encoding: br`, and gateways that terminate compressed traffic. Google shipped fixes in Brotli 1.0.10, 1.1.1, and 1.2.1. Node.js shipped patched runtimes on October 21.

Be precise about exposure, though. You need a path where attacker-controlled Brotli reaches a vulnerable decoder. A service that accepts compressed request bodies, a scraper that fetches arbitrary URLs, or an API that proxies untrusted responses all qualify. A batch job that only decompresses files your own team produced does not, unless those files can be influenced from outside.

## The lockfile is not the runtime

Here is the uncomfortable part. You probably never installed Brotli. It arrived inside something else.

- Node.js compiles a Brotli decoder into the runtime. Updating a package in `package.json` does nothing for it.
- The Python `Brotli` package compiles Google's C decoder. `brotlicffi` reaches the same decoder through a different binding. Either can be pulled in by an HTTP library rather than by your own code.
- `curl` links the system `libbrotli` on many Linux images. Patching the application container does not patch the host or the CI runner.
- Proxies, service meshes, and API gateways bundle their own decoders. Your service can be fixed while the thing in front of it is not.

That is why the first question is not "is the CVE in my lockfile?" It is "which processes on this box can decode Brotli, and who built them?"

Version strings make this harder, not easier. A patched Node 24.22.1 can still print `1.2.0` from `process.versions.brotli`, because the fix was cherry-picked into the runtime without bumping the bundled library's version string. Linux distributions also backport security fixes without changing upstream version numbers. The version is a proxy for the code, and this week it fails in both directions: a scanner can miss a vulnerable copy, and it can keep flagging a patched one.

There was an advisory lag as well. Node's release landed on October 21. The PyPI advisory for `Brotli` was published on October 23. For roughly two days, a Python team could run a fresh-looking scanner and get a green check on a critical RCE. That window has closed, but the lesson has not: "the scanner says clean" means "the scanner's database said clean at its last sync."

## A small-team response plan

You do not need a security program to handle this well. You need a short, repeatable sequence.

1. Patch the runtime, then rebuild the artifact. For Node.js, move to 22.23.4, 24.22.1, or 26.12.1, or newer. For Python, move `Brotli` to 1.2.1 and `brotlicffi` to 1.2.1.0. Update the system `libbrotli` to your distribution's fixed package. Restarting an old container does not patch it; rebuild the image so the new runtime is actually inside.

2. Inventory decoder copies, not package names. Run this on the app host and in CI:

```bash
node -p "process.versions.brotli"
python -c "import brotli; print(brotli.__version__)"
ldd "$(command -v curl)" | grep -i brotli
```

Treat the output as a map, not a verdict. Cross-check the base image, the runtime, and any gateway or sidecar that terminates HTTP. If you use distribution packages, read the distribution's advisory rather than trusting the version string.

3. Put the inventory in the release record. Add the runtime version, base image digest, and a one-line "Brotli decoder present? patched?" note to the deploy log. This is the artifact you will want during the next incident, when nobody remembers which image was rebuilt.

4. Add a decode smoke test. A tiny post-deploy check that decompresses a known Brotli fixture proves the decoder path still works after the upgrade. It does not prove the absence of bugs, but it catches the embarrassing case where a base-image change removed or broke the library. Keep the fixture small and checked in.

5. If you cannot patch today, reduce the reachable surface. On Python services, uninstalling `Brotli` and `brotlicffi` removes those decode paths; gzip and deflate keep working. At the edge, reject `Content-Encoding: br` in both directions until the runtime is fixed. Removing `br` from your `Accept-Encoding` request header is not enough, because a malicious server can send a Brotli response to a client that never asked for one. Treat both measures as temporary, with an owner and a date.

## How to decide urgency

Use exposure, not the CVSS number alone.

- Internet-facing and decodes untrusted data: patch and redeploy now. If the deploy cannot happen today, block `br` at the edge and remove the Python decoder packages.
- Internal service that decodes data from trusted sources: schedule the rebuild for the next deploy, but do not let it drift past the week.
- No Brotli decode path: record the evidence and move on. Check again when the base image changes.
- Unknown: assume exposed if a Node.js runtime or a Python Brotli package is present and the process parses network input. Spend thirty minutes proving otherwise.

The failure mode to avoid is treating "no alert" as "no exposure." A scanner is a tripwire, not an inventory. The inventory is the runtime, the base image, and the proxy in front of it.

## What I would do differently

Two changes are worth making after this week. First, generate an SBOM from the built image, not from the repository. The image is the thing that runs, and it includes the OS packages and bundled runtimes that a lockfile never sees. Second, give native dependencies an owner. Most small teams have a clear owner for application dependencies and nobody for the C libraries inside the runtime. One name and one recurring check is enough to close that gap.

None of this makes the next CVE less annoying. It does make the response shorter: patch the runtime, rebuild the image, prove the decoder path, and write down what you found.

## Sources

- [Node.js October 2026 security releases](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)
- [CVE-2026-111497 record](https://www.cve.org/CVERecord?id=CVE-2026-111497)
- [Google Brotli v1.2.1 release](https://github.com/google/brotli/releases/tag/v1.2.1)
- [PYSEC-2026-4322 advisory](https://vulnerability.circl.lu/vuln/PYSEC-2026-4322)
- [Public audit of the scanner gap and Node version string](https://dev.to/frankchu/i-scanned-my-machine-for-the-brotli-rce-three-stacks-were-exposed-and-the-patched-one-still-47j5)

If your team is working through a dependency fire drill and wants a second set of eyes, [get in touch](/cv).
