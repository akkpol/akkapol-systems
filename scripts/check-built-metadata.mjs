import { readFileSync } from "node:fs";
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
  `${siteUrl}/privacy`,
  `${siteUrl}/th/privacy`,
];

const failures = [];

for (const page of pages) {
  let html;
  try {
    html = readFileSync(join(process.cwd(), page.file), "utf8");
  } catch {
    failures.push(`Missing built HTML: ${page.file}`);
    continue;
  }

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const canonicalTag = html.match(/<link[^>]+rel="canonical"[^>]*>/i)?.[0] ?? "";
  const canonical = canonicalTag.match(/href="([^"]+)"/i)?.[1] ?? "";

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

try {
  const sitemap = readFileSync(
    join(process.cwd(), ".next/server/app/sitemap.xml.body"),
    "utf8",
  );
  for (const url of sitemapUrls) {
    if (!sitemap.includes(url)) {
      failures.push(`Sitemap is missing ${url}`);
    }
  }
} catch {
  failures.push("Missing built sitemap: .next/server/app/sitemap.xml.body");
}

if (failures.length > 0) {
  console.error("Built metadata check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(
    `Built metadata check passed for ${pages.length} pages and ${sitemapUrls.length} sitemap URLs.`,
  );
}
