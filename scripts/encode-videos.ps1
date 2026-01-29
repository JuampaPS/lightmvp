# Video encoding pipeline (Windows 11 ARM, ffmpeg ARM64).
# Converts all .mp4 in public/videos-hero into *-mobile.mp4 and *-desktop.mp4.
# Skips *-mobile and *-desktop. Outputs alongside source. Paths match /videos-hero/*.

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Split-Path -Parent $ScriptDir
$VideosDir = Join-Path (Join-Path $Root "public") "videos-hero"

if (-not (Test-Path -LiteralPath $VideosDir -PathType Container)) {
    Write-Error "public/videos-hero not found. Create it and add source MP4s."
}

$mp4s = Get-ChildItem -Path $VideosDir -Filter "*.mp4" -File -ErrorAction SilentlyContinue
$count = 0

Write-Host "Video encoding (public/videos-hero -> *-mobile.mp4, *-desktop.mp4)`n"

foreach ($f in $mp4s) {
    $base = [System.IO.Path]::GetFileNameWithoutExtension($f.Name)
    if ($base -match "-(?:mobile|desktop)$") {
        Write-Host "  skip (variant): $base"
        continue
    }

    $mobile = Join-Path $VideosDir ($base + "-mobile.mp4")
    $desktop = Join-Path $VideosDir ($base + "-desktop.mp4")

    Write-Host "  $base"

    # Mobile: 720p, no audio, faststart, low bitrate
    & ffmpeg -y -i $f.FullName -an -vf "scale=-2:720" -c:v libx264 -preset medium -b:v 1.25M -maxrate 1.5M -bufsize 2M -movflags +faststart $mobile -loglevel warning -stats

    # Desktop: 1080p, no audio, faststart
    & ffmpeg -y -i $f.FullName -an -vf "scale=-2:1080" -c:v libx264 -preset medium -crf 23 -movflags +faststart $desktop -loglevel warning -stats

    $count++
}

Write-Host "`nDone. Encoded $count source(s). Output: *-mobile.mp4, *-desktop.mp4 in public/videos-hero."
