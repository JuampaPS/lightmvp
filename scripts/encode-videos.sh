#!/usr/bin/env bash
#
# Video encoding pipeline: generates mobile (720p) and desktop (1080p) variants
# for each MP4 in public/videos-hero. Skips *-mobile.mp4 and *-desktop.mp4.
# Output: *-mobile.mp4 and *-desktop.mp4 alongside source. No audio, faststart.
# Paths match /videos-hero/* strategy.
#

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VIDEOS_DIR="$ROOT/public/videos-hero"

# --- Checks ---
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is required. Install it (e.g. brew install ffmpeg, apt install ffmpeg) and retry."
  exit 1
fi

if [[ ! -d "$VIDEOS_DIR" ]]; then
  echo "Error: $VIDEOS_DIR not found. Create it and add source MP4s."
  exit 1
fi

echo "Video encoding (public/videos-hero -> *-mobile.mp4, *-desktop.mp4)"
echo ""

# --- Encode ---
count=0
shopt -s nullglob 2>/dev/null || true
for f in "$VIDEOS_DIR"/*.mp4; do
  [[ -f "$f" ]] || continue
  base=$(basename "$f" .mp4)
  case "$base" in
    *-mobile|*-desktop) echo "  skip (variant): $base"; continue ;;
  esac

  mobile="${f%.mp4}-mobile.mp4"
  desktop="${f%.mp4}-desktop.mp4"

  echo "  $base"
  # Mobile: 720p, no audio, CRF 23, faststart
  ffmpeg -y -i "$f" -an -vf "scale=-2:720" -c:v libx264 -preset medium -crf 23 -movflags +faststart "$mobile" -loglevel warning -stats
  # Desktop: 1080p, no audio, CRF 23, faststart
  ffmpeg -y -i "$f" -an -vf "scale=-2:1080" -c:v libx264 -preset medium -crf 23 -movflags +faststart "$desktop" -loglevel warning -stats
  (( count++ )) || true
done

echo ""
echo "Done. Encoded $count source(s). Output: *-mobile.mp4, *-desktop.mp4 in public/videos-hero."
