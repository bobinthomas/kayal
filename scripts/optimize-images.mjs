#!/usr/bin/env node
/**
 * Recompresses the Figma-exported photo assets committed directly under
 * public/images/home-figma/ (top level only). Admin-uploaded images already
 * go through client-side resizing at upload time (components/admin/resizeImage.ts)
 * and don't need this — this script is for images added straight to the repo.
 *
 * Run after adding new full-size photo exports to that folder:
 *   node scripts/optimize-images.mjs
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const DIR = fileURLToPath(new URL("../public/images/home-figma/", import.meta.url));
const MAX_WIDTH = 2000;

async function run() {
  const entries = await readdir(DIR, { withFileTypes: true });
  let totalBefore = 0;
  let totalAfter = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") continue;

    const full = path.join(DIR, entry.name);
    const before = (await stat(full)).size;
    const img = sharp(full).resize({ width: MAX_WIDTH, withoutEnlargement: true });
    const buffer =
      ext === ".png"
        ? await img.png({ quality: 82, effort: 10 }).toBuffer()
        : await img.jpeg({ quality: 78, mozjpeg: true }).toBuffer();

    totalBefore += before;
    if (buffer.length < before) {
      await writeFile(full, buffer);
      totalAfter += buffer.length;
      console.log(`${entry.name}: ${(before / 1024).toFixed(0)}KB -> ${(buffer.length / 1024).toFixed(0)}KB`);
    } else {
      totalAfter += before;
      console.log(`${entry.name}: already optimal, skipped`);
    }
  }

  console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`);
}

run();
