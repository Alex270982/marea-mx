#!/usr/bin/env bash
# Creates 720p faststart mobile encodes for the opener and all property films.
set -e
targets=()
if [ -f public/assets/openerVideo.mp4 ] && [ ! -f public/assets/openerVideo-mobile.mp4 ]; then
  targets+=("public/assets/openerVideo.mp4")
fi
for f in public/assets/films/*.mp4; do
  [ -e "$f" ] || continue
  case "$f" in *-mobile.mp4) continue ;; esac
  [ -f "${f%.mp4}-mobile.mp4" ] || targets+=("$f")
done
if [ ${#targets[@]} -eq 0 ]; then echo "no encodes needed"; exit 0; fi
command -v ffmpeg >/dev/null 2>&1 || { sudo apt-get update -qq && sudo apt-get install -y -qq ffmpeg; }
for f in "${targets[@]}"; do
  echo "encoding ${f%.mp4}-mobile.mp4"
  ffmpeg -y -loglevel error -i "$f" -vf scale=720:-2 -c:v libx264 -preset medium -crf 27 -an -movflags +faststart "${f%.mp4}-mobile.mp4"
done
git config user.name marea-bot
git config user.email bot@users.noreply.github.com
git add public/assets
git diff --cached --quiet || { git commit -m "mobile video encodes [skip ci]"; git push; }
