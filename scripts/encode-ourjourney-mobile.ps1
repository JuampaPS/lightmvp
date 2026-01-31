# Encode ourjourney-mobile.mp4 for mobile (720p, low bitrate).
# Run from project root. Requires ffmpeg in PATH.
$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root = Split-Path -Parent $ScriptDir
$VideosDir = Join-Path $Root "public\images\gallery\videos-hero"
$InputFile = Join-Path $VideosDir "ourjourney.mp4"
$OutputFile = Join-Path $VideosDir "ourjourney-mobile.mp4"

if (-not (Test-Path -LiteralPath $InputFile -PathType Leaf)) {
    Write-Error "ourjourney.mp4 not found at $InputFile"
}

Write-Host "Encoding ourjourney-mobile.mp4 (720p, 1.25Mbps)..."
& ffmpeg -y -i $InputFile -an -vf "scale=-2:720" -c:v libx264 -preset medium -b:v 1.25M -maxrate 1.5M -bufsize 2M -movflags +faststart $OutputFile -loglevel warning -stats
Write-Host "Done: $OutputFile"
