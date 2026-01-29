#!/usr/bin/env node
/**
 * Image optimization pipeline: generates AVIF and WebP from public/images/**.
 * Uses sharp (ARM-compatible). Originals kept. Output: public/images/optimized/
 * (mirrors structure; -{width}w.webp / .avif at 640, 960, 1440).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch (e) {
  console.error("Could not load sharp. Ensure sharp is installed (npm install) and platform-compatible.");
  console.error(e.message);
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const IMAGE_ROOT = "public/images";
const OUT_DIR = "public/images/optimized";
const WIDTHS = [640, 960, 1440];
const EXTS = [".jpg", ".jpeg", ".png", ".webp", ".bmp"];
const SKIP = /\.(gitkeep|gif|mp4|md)$/i;

function* walk(dir, base = dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(base, full);
    if (e.isDirectory()) {
      if (e.name === "optimized" || e.name === "videos-hero") continue;
      yield* walk(full, base);
    } else if (e.isFile() && EXTS.some((x) => e.name.toLowerCase().endsWith(x)) && !SKIP.test(e.name)) {
      yield { full, rel };
    }
  }
}

async function optimizeOne(inputPath, rel, outRoot) {
  const base = path.basename(rel, path.extname(rel));
  const dir = path.dirname(rel);
  const outBase = dir ? path.join(outRoot, dir) : outRoot;
  fs.mkdirSync(outBase, { recursive: true });

  let meta;
  try {
    meta = await sharp(inputPath).metadata();
  } catch (e) {
    console.warn("  skip (sharp):", rel, e.message);
    return;
  }

  const maxW = meta.width || 0;
  const widths = WIDTHS.filter((w) => maxW >= w);
  if (widths.length === 0) widths.push(Math.min(WIDTHS[0], maxW) || WIDTHS[0]);

  for (const w of widths) {
    const stem = path.join(outBase, `${base}-${w}w`);
    const resize = { width: w, withoutEnlargement: true };
    try {
      await sharp(inputPath).resize(resize).webp({ quality: 82 }).toFile(`${stem}.webp`);
      await sharp(inputPath).resize(resize).avif({ quality: 62 }).toFile(`${stem}.avif`);
    } catch (e) {
      console.warn("  fail", stem, e.message);
    }
  }
}

async function main() {
  const outRoot = path.join(ROOT, OUT_DIR);
  fs.mkdirSync(outRoot, { recursive: true });

  console.log("Image optimization (AVIF + WebP @ 640, 960, 1440)...\n");

  const dir = path.join(ROOT, IMAGE_ROOT);
  if (!fs.existsSync(dir)) {
    console.warn("Skip (missing):", IMAGE_ROOT);
    return;
  }
  for (const { full, rel } of walk(dir, dir)) {
    process.stdout.write("  " + rel + " ... ");
    await optimizeOne(full, rel, outRoot);
    console.log("ok");
  }

  console.log("\nDone. Output:", OUT_DIR);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
