#!/usr/bin/env bash
# Перекодирование ролика для скролл-синхронизации: чаще keyframes, faststart, без аудио.
# Требуется: ffmpeg (brew install ffmpeg)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IN="$ROOT/src/assets/Monster Energy Zero Ultra Spec Commercial.mp4"
OUT="${IN%.mp4}.new.mp4"
ffmpeg -y -i "$IN" -an -c:v libx264 -pix_fmt yuv420p -crf 23 -preset medium \
  -x264-params "keyint=30:min-keyint=30:scenecut=0" \
  -movflags +faststart \
  "$OUT"
mv "$OUT" "$IN"
echo "OK: $IN"
