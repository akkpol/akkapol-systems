import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const slugIndex = process.argv.indexOf("--slug");
const slug = slugIndex === -1 ? undefined : process.argv[slugIndex + 1];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!slug || !slugPattern.test(slug)) {
  fail("Usage: node scripts/blog-publish.mjs --slug <slug>");
}

const repo = process.cwd();
const home = os.homedir();
const extraPaths = [
  path.join(home, ".local", "git", "ucrt64", "bin"),
  path.join(home, ".local", "git", "cmd"),
  path.join(home, ".local", "node"),
  path.join(home, ".local", "npm-global"),
];
process.env.PATH = extraPaths.join(path.delimiter) + path.delimiter + (process.env.PATH || "");
process.env.GIT_TERMINAL_PROMPT = "0";
process.env.GCM_INTERACTIVE = "never";

function git(args) {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
}

function frontmatterValue(text, key) {
  const match = text.match(new RegExp("^" + key + ":\\s*(.+)$", "m"));
  if (!match) return undefined;
  return match[1].trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}

const postPath = path.join(repo, "content", "blog", slug + ".md");
if (!fs.existsSync(postPath)) fail("Post not found: " + postPath);

const post = fs.readFileSync(postPath, "utf8");
const title = frontmatterValue(post, "title");
const description = frontmatterValue(post, "description") || "";
const image = frontmatterValue(post, "image");
if (!title) fail("Post has no title frontmatter.");
if (!image || !image.startsWith("/images/blog/" + slug + "/")) {
  fail("Post image must point into /images/blog/" + slug + "/.");
}
const imagePath = path.join(repo, "public", image.replace(/^\//, ""));
if (!fs.existsSync(imagePath)) fail("Cover image not found: " + imagePath);

const status = git(["status", "--porcelain"]).trim().split(/\r?\n/).filter(Boolean);
const postSuffix = "content/blog/" + slug + ".md";
const imageSuffix = "public/images/blog/" + slug + "/";
const unexpected = status.filter((line) => !line.includes(postSuffix) && !line.includes(imageSuffix));
if (unexpected.length > 0) {
  fail("Unexpected working tree changes:\n" + unexpected.join("\n"));
}
if (!status.some((line) => line.includes(postSuffix))) fail("Post is not a new/changed git file.");

const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).trim();
if (branch !== "main") fail("Publish must start from main; current branch is " + branch);

const now = new Date();
const date = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
const branchName = "blog/daily-" + date + "-" + slug;

try {
  git(["switch", "-c", branchName]);
  git(["add", postSuffix, imageSuffix]);
  git(["commit", "-m", "content: " + title]);
  git(["push", "-u", "origin", branchName]);

  const credential = execFileSync("git", ["credential", "fill"], {
    cwd: repo,
    input: "protocol=https\nhost=github.com\nusername=akkpol\n\n",
    encoding: "utf8",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  const passwordLine = credential.split(/\r?\n/).find((line) => line.startsWith("password="));
  const token = passwordLine ? passwordLine.slice("password=".length) : "";
  if (!token) fail("GitHub credential token was not available.");

  const prResponse = await fetch("https://api.github.com/repos/akkpol/akkapol-systems/pulls", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "akkapol-systems-blog-automation",
    },
    body: JSON.stringify({
      title: "content: " + title,
      head: branchName,
      base: "main",
      body: [
        "Automated daily blog draft.",
        "",
        description,
        "",
        "Checks: test:security, lint, build, test:metadata.",
        "Cover: " + image,
        "This PR is not auto-merged; review before publishing.",
      ].join("\n"),
    }),
  });
  const pr = await prResponse.json();
  if (!prResponse.ok) fail("GitHub PR creation failed: " + JSON.stringify(pr));

  try { git(["switch", "main"]); } catch (error) { console.error("Warning: could not switch back to main: " + error.message); }
  console.log(JSON.stringify({ ok: true, slug: slug, title: title, branch: branchName, image: image, prUrl: pr.html_url }));
} catch (error) {
  console.error("Publish failed: " + (error && error.message ? error.message : String(error)));
  process.exit(1);
}
