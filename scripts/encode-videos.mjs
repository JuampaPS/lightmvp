#!/usr/bin/env node
/**
 * Video encoding pipeline: generates mobile (720p) and desktop (1080p) variants
 * for each MP4 in public/videos-hero. Skips *-mobile.mp4 and *-desktop.mp4.
 * Output: *-mobile.mp4 and *-desktop.mp4 alongside source. No audio, faststart.
 * Paths match /videos-hero/* strategy. Cross-platform (Node + ffmpeg).
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const VIDEOS_DIR = path.join(ROOT, "public", "videos-hero");

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit", cwd: ROOT });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

function checkFfmpeg() {
  const r = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (r.status !== 0) {
    console.error("Error: ffmpeg is required. Install it (e.g. winget install ffmpeg, brew install ffmpeg) and retry.");
    process.exit(1);
  }
}

function main() {
  checkFfmpeg();

  if (!fs.existsSync(VIDEOS_DIR)) {
    console.error("Error: public/videos-hero not found. Create it and add source MP4s.");
    process.exit(1);
  }

  const files = fs.readdirSync(VIDEOS_DIR)
    .filter((f) => f.endsWith(".mp4"))
    .map((f) => path.join(VIDEOS_DIR, f));

  let count = 0;
  console.log("Video encoding (public/videos-hero -> *-mobile.mp4, *-desktop.mp4)\n");

  for (const f of files) {
    const base = path.basename(f, ".mp4");
    if (base.endsWith("-mobile") || base.endsWith("-desktop")) {
      console.log("  skip (variant):", base);
      continue;
    }

    const mobile = f.replace(/\.mp4$/, "-mobile.mp4");
    const desktop = f.replace(/\.mp4$/, "-desktop.mp4");

    console.log("  " + base);
    run("ffmpeg", ["-y", "-i", f, "-an", "-vf", "scale=-2:720", "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-movflags", "+faststart", mobile, "-loglevel", "warning", "-stats"]);
    run("ffmpeg", ["-y", "-i", f, "-an", "-vf", "scale=-2:1080", "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-movflags", "+faststart", desktop, "-loglevel", "warning", "-stats"]);
    count++;
  }

  console.log("\nDone. Encoded " + count + " source(s). Output: *-mobile.mp4, *-desktop.mp4 in public/videos-hero.");
}

main();
