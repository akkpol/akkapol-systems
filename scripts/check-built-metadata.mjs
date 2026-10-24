import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const siteUrl = "https://akkapol-systems.vercel.app";

const pages = [
  {
    file: ".next/server/app/index.html",
    title: "Akkapol Kumpapug | Creative AI Systems Builder",
    canonical: siteUrl,
  },
  {
    file: ".next/server/app/th.html",
    title: "Akkapol Kumpapug | นักสร้างระบบ AI เชิงปฏิบัติ",
    canonical: `${siteUrl}/th`,
  },
  {
    file: ".next/server/app/cv.html",
    title: "Akkapol Kumpapug CV",
    canonical: `${siteUrl}/cv`,
  },
  {
    file: ".next/server/app/blog.html",
    title: "Writing | Akkapol Kumpapug",
    canonical: `${siteUrl}/blog`,
  },
  {
    file: ".next/server/app/privacy.html",
    title: "Privacy Policy | Akkapol Kumpapug",
    canonical: `${siteUrl}/privacy`,
  },
  {
    file: ".next/server/app/th/privacy.html",
    title: "นโยบายความเป็นส่วนตัว | Akkapol Kumpapug",
    canonical: `${siteUrl}/th/privacy`,
  },
];

const sitemapUrls = [
  siteUrl,
  `${siteUrl}/th`,
  `${siteUrl}/cv`,
  `${siteUrl}/blog`,
  `${siteUrl}/privacy`,
  `${siteUrl}/th/privacy`,
];

const failures = [];

function readBuiltFile(file) {
  try {
    return readFileSync(join(process.cwd(), file), "utf8");
  } catch {
    return null;
  }
}

function readTitle(html) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
}

function readCanonical(html) {
  const canonicalTag = html.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0] ?? "";
  return canonicalTag.match(/href="([^"]+)"/i)?.[1] ?? "";
}

for (const page of pages) {
  const html = readBuiltFile(page.file);
  if (html === null) {
    failures.push(`Missing built HTML: ${page.file}`);
    continue;
  }

  const title = readTitle(html);
  const canonical = readCanonical(html);

  if (title !== page.title) {
    failures.push(`${page.file}: title ${JSON.stringify(title)} !== ${JSON.stringify(page.title)}`);
  }

  if (canonical !== page.canonical) {
    failures.push(`${page.file}: canonical ${JSON.stringify(canonical)} !== ${JSON.stringify(page.canonical)}`);
  }

  const brandSuffixCount = title.split("| Akkapol Kumpapug").length - 1;
  if (brandSuffixCount > 1) {
    failures.push(`${page.file}: title repeats the brand suffix`);
  }
}

// Published Markdown posts are prerendered from generateStaticParams(). Each
// built post page must carry its own canonical URL, a branded title, exactly
// one <h1> (the post title), and an entry in the sitemap.
let builtPostSlugs = [];
try {
  builtPostSlugs = readdirSync(join(process.cwd(), ".next/server/app/blog"), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name.slice(0, -".html".length));
} catch {
  failures.push("Missing built blog directory: .next/server/app/blog");
}

const sitemapFile = ".next/server/app/sitemap.xml.body";
const sitemap = readBuiltFile(sitemapFile);
const sitemapLocations = new Set();
if (sitemap === null) {
  failures.push(`Missing built sitemap: ${sitemapFile}`);
} else {
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    sitemapLocations.add(match[1]);
  }
  for (const url of sitemapUrls) {
    if (!sitemapLocations.has(url)) {
      failures.push(`Sitemap is missing ${url}`);
    }
  }
}

for (const slug of builtPostSlugs) {
  const file = `.next/server/app/blog/${slug}.html`;
  const html = readBuiltFile(file);
  if (html === null) {
    failures.push(`Missing built HTML: ${file}`);
    continue;
  }

  const title = readTitle(html);
  if (!title.endsWith(" | Akkapol Kumpapug") || title === " | Akkapol Kumpapug") {
    failures.push(`${file}: title ${JSON.stringify(title)} is missing the brand suffix or post title`);
  }

  const expectedCanonical = `${siteUrl}/blog/${slug}`;
  const canonical = readCanonical(html);
  if (canonical !== expectedCanonical) {
    failures.push(
      `${file}: canonical ${JSON.stringify(canonical)} !== ${JSON.stringify(expectedCanonical)}`,
    );
  }

  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1Count !== 1) {
    failures.push(`${file}: expected exactly one <h1>, found ${h1Count}`);
  }

  if (!sitemapLocations.has(expectedCanonical)) {
    failures.push(`Sitemap is missing ${expectedCanonical}`);
  }
}

if (failures.length > 0) {
  console.error("Built metadata check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Built metadata check passed for ${pages.length} pages, ${builtPostSlugs.length} blog posts, and ${sitemapUrls.length} core sitemap URLs.`,
  );
}
