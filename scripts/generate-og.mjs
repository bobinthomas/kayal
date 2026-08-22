/**
 * Generates branded OG images (1200×630) and the apple touch icon from SVG
 * templates using sharp. Run via `npm run assets` (also part of `npm run build`).
 */
import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("public/og");
await mkdir(OUT, { recursive: true });

function ogSvg(title, subtitle) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1E4D2B"/>
      <stop offset="1" stop-color="#14331E"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g opacity="0.45" fill="none" stroke="#E9B44C" stroke-width="3">
    <path d="M0 470c100-18 200-18 300 0s200 18 300 0 200-18 300 0 200 18 300 0"/>
    <path d="M0 520c100-14 200-14 300 0s200 14 300 0 200-14 300 0 200 14 300 0" opacity="0.6"/>
  </g>
  <ellipse cx="1000" cy="160" rx="120" ry="52" fill="#B5532A"/>
  <ellipse cx="1000" cy="146" rx="96" ry="36" fill="#FAF5EC"/>
  <circle cx="975" cy="142" r="16" fill="#E9B44C"/>
  <circle cx="1020" cy="150" r="13" fill="#D7263D"/>
  <text x="80" y="180" font-family="Georgia, serif" font-size="44" fill="#E9B44C" letter-spacing="6">KAYAL FOODS</text>
  <text x="80" y="300" font-family="Georgia, serif" font-size="76" font-weight="600" fill="#FAF5EC">${title}</text>
  <text x="80" y="370" font-family="Georgia, serif" font-size="34" fill="#FAF5EC" opacity="0.85">${subtitle}</text>
  <text x="80" y="560" font-family="Georgia, serif" font-size="28" fill="#E9B44C">128 Nuwarra Road, Moorebank · (02) 9734 9634</text>
</svg>`);
}

const pages = [
  ["home", "Kerala's village table, in Sydney.", "Authentic naadan cooking · Moorebank"],
  ["menu", "The Menu", "Chatti choru · Kizhi porotta · Naadan curries"],
  ["specials", "Naadan Specials", "From the village, when we can get it."],
  ["catering", "Catering &amp; Events", "The village table, brought to yours."],
  ["about", "Our Story", "Kayal — the backwater that raised our kitchen."],
  ["contact", "Find Us &amp; Book", "Look for the white house — that's us."],
];

for (const [slug, title, subtitle] of pages) {
  await sharp(ogSvg(title, subtitle)).png({ quality: 90 }).toFile(path.join(OUT, `${slug}.png`));
  console.log(`og/${slug}.png`);
}

// Apple touch icon: the real logo mark (app/icon.svg), composited onto a
// solid brand-green square — iOS renders transparent icon backgrounds as
// solid black, and the logo artwork itself has no background of its own.
const logoSvg = await readFile(path.resolve("app/icon.svg"));
const logoPng = await sharp(logoSvg).resize(148, 140, { fit: "inside" }).png().toBuffer();
await sharp({
  create: { width: 180, height: 180, channels: 4, background: "#046937" },
})
  .composite([{ input: logoPng, gravity: "center" }])
  .png()
  .toFile(path.resolve("app/apple-icon.png"));
console.log("app/apple-icon.png");
