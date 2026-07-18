#!/usr/bin/env bash
# Produces scrub-optimized encodes (dense keyframes, -g 8) for the opener and
# all property films so scroll-scrubbing is smooth in BOTH directions:
#   <base>-scrub.mp4          1080p-ish desktop encode
#   <base>-scrub-mobile.mp4   720p mobile encode
set -e
sources=()
[ -f public/assets/openerVideo.mp4 ] && sources+=("public/assets/openerVideo.mp4")
for f in public/assets/films/*.mp4; do
  [ -e "$f" ] || continue
  case "$f" in *-mobile.mp4|*-scrub.mp4|*-scrub-mobile.mp4) continue ;; esac
  sources+=("$f")
done
todo=()
for f in "${sources[@]}"; do
  base="${f%.mp4}"
  [ -f "${base}-scrub.mp4" ] || todo+=("D:$f")
  [ -f "${base}-scrub-mobile.mp4" ] || todo+=("M:$f")
done
if [ ${#todo[@]} -eq 0 ]; then echo "no encodes needed"; exit 0; fi
command -v ffmpeg >/dev/null 2>&1 || { sudo apt-get update -qq && sudo apt-get install -y -qq ffmpeg; }
for item in "${todo[@]}"; do
  kind="${item%%:*}"; f="${item#*:}"; base="${f%.mp4}"
  if [ "$kind" = "D" ]; then
    echo "encoding ${base}-scrub.mp4"
    ffmpeg -y -loglevel error -i "$f" -c:v libx264 -preset medium -crf 25 -g 8 -an -movflags +faststart "${base}-scrub.mp4"
  else
    echo "encoding ${base}-scrub-mobile.mp4"
    ffmpeg -y -loglevel error -i "$f" -vf scale=720:-2 -c:v libx264 -preset medium -crf 27 -g 8 -an -movflags +faststart "${base}-scrub-mobile.mp4"
  fi
done
git config user.name marea-bot
git config user.email bot@users.noreply.github.com
git add public/assets
git diff --cached --quiet || { git commit -m "scrub-optimized video encodes [skip ci]"; git push; }
