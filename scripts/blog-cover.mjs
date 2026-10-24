import { mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readArg(name) {
  const index = process.argv.indexOf("--" + name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function wrapTitle(title, maxChars) {
  const limit = maxChars || 28;
  const words = title.trim().split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? current + " " + word : word;
    if (next.length > limit && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 4);
}

const slug = readArg("slug");
const title = readArg("title") || "Akkapol Systems";
const tag = readArg("tag") || "AI / SYSTEMS / BUILDING";
if (!slug || !SLUG_PATTERN.test(slug)) {
  console.error("Usage: npm run blog:cover -- --slug <slug> --title <post title> [--tag <label>]");
  process.exit(1);
}

const lines = wrapTitle(title);
const titleFontSize = lines.length > 3 ? 48 : lines.length > 2 ? 54 : 64;
const titleY = 252;
const outputDirectory = path.join(process.cwd(), "public", "images", "blog", slug);
const outputPath = path.join(outputDirectory, "cover.png");
mkdirSync(outputDirectory, { recursive: true });

const titleLines = lines
  .map((line, index) => {
    const y = titleY + index * (titleFontSize + 18);
    return '<text x="86" y="' + y + '" font-family="Arial, Helvetica, sans-serif" font-size="' + titleFontSize + '" font-weight="700" fill="#f7f4ee" letter-spacing="-1.2">' + escapeXml(line) + "</text>";
  })
  .join("");

const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
  '<defs>',
  '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">',
  '<stop offset="0" stop-color="#0b0f14"/>',
  '<stop offset="0.55" stop-color="#111b22"/>',
  '<stop offset="1" stop-color="#0d141a"/>',
  '</linearGradient>',
  '<linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">',
  '<stop offset="0" stop-color="#ff7a4d"/>',
  '<stop offset="1" stop-color="#f4c15d"/>',
  '</linearGradient>',
  '<pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">',
  '<path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/>',
  '</pattern>',
  '</defs>',
  '<rect width="1200" height="630" fill="url(#bg)"/>',
  '<rect width="1200" height="630" fill="url(#grid)"/>',
  '<circle cx="1080" cy="70" r="260" fill="#ff7a4d" fill-opacity="0.10"/>',
  '<circle cx="1110" cy="610" r="220" fill="#5eead4" fill-opacity="0.07"/>',
  '<path d="M780 410 C 910 330, 1050 360, 1200 250" fill="none" stroke="url(#accent)" stroke-opacity="0.55" stroke-width="2"/>',
  '<path d="M820 470 C 960 390, 1090 420, 1200 330" fill="none" stroke="#5eead4" stroke-opacity="0.28" stroke-width="1.5"/>',
  '<rect x="86" y="70" width="10" height="10" fill="#ff7a4d"/>',
  '<text x="110" y="81" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="700" fill="#f7f4ee" letter-spacing="4">AKKAPOL SYSTEMS</text>',
  '<text x="86" y="143" font-family="Arial, Helvetica, sans-serif" font-size="17" font-weight="700" fill="#ff9b72" letter-spacing="3">' + escapeXml(tag) + '</text>',
  '<line x1="86" y1="172" x2="1114" y2="172" stroke="#ffffff" stroke-opacity="0.14" stroke-width="1"/>',
  titleLines,
  '<text x="86" y="560" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#b7c2c9" letter-spacing="1.5">WRITING / NOTES ON PRACTICAL AI SYSTEMS</text>',
  '<text x="1114" y="560" text-anchor="end" font-family="Arial, Helvetica, sans-serif" font-size="17" fill="#ff9b72" letter-spacing="1.5">akkapol-systems.vercel.app</text>',
  '</svg>',
].join("");

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outputPath);
console.log(JSON.stringify({ ok: true, slug: slug, path: outputPath, url: "/images/blog/" + slug + "/cover.png", width: 1200, height: 630 }));
