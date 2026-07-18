#!/usr/bin/env node
/* Mirrors the remote CDN assets into /public/assets so the site can be
   served fully self-contained. Requires a network-enabled environment.

   Usage: npm run assets:download
   After a successful run, flip ASSETS_BASE in src/lib/assets.ts to "/assets/". */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetsTs = join(root, "src", "lib", "assets.ts");
const outDir = join(root, "public", "assets");

function fail(msg) {
  console.error(`\n[download-assets] ${msg}`);
  process.exit(1);
}

let source;
try {
  source = await readFile(assetsTs, "utf8");
} catch (e) {
  fail(`Could not read ${assetsTs}: ${e.message}`);
}

/* Parse the remote base, file map and video URL out of assets.ts. */
const baseMatch = source.match(/const FILES[^=]*=\s*\{([\s\S]*?)\};/);
const remoteBaseMatch = source.match(/"(https:\/\/[^"]+\/)"/);
const videoMatch = source.match(/OPENER_VIDEO_SOURCE\s*=\s*\n?\s*"(https:\/\/[^"]+\.mp4)"/);

if (!baseMatch || !remoteBaseMatch) fail("Could not parse the asset map from src/lib/assets.ts");

const REMOTE_BASE = remoteBaseMatch[1];
const files = {};
for (const m of baseMatch[1].matchAll(/"?([\w-]+)"?\s*:\s*"([^"]+)"/g)) {
  files[m[1]] = m[2];
}
if (!Object.keys(files).length) fail("Asset map parsed empty.");

await mkdir(outDir, { recursive: true });

import { stat } from "node:fs/promises";

async function download(url, dest) {
  try { const st = await stat(dest); if (st.size > 0) return 0; } catch {}
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  return buf.length;
}

let ok = 0;
let failed = 0;

for (const [key, file] of Object.entries(files)) {
  const targets = [
    [`${REMOTE_BASE}${file}.png`, join(outDir, `${key}.png`)],
    [`${REMOTE_BASE}${file}_min.webp`, join(outDir, `${key}_min.webp`)]
  ];
  for (const [url, dest] of targets) {
    try {
      const bytes = await download(url, dest);
      ok += 1;
      console.log(`  ok  ${dest.replace(root + "/", "")} (${(bytes / 1024).toFixed(0)} KB)`);
    } catch (e) {
      failed += 1;
      console.warn(`  FAIL ${url}: ${e.message}`);
    }
  }
}

if (videoMatch) {
  try {
    const bytes = await download(videoMatch[1], join(outDir, "openerVideo.mp4"));
    ok += 1;
    console.log(`  ok  public/assets/openerVideo.mp4 (${(bytes / 1048576).toFixed(1)} MB)`);
  } catch (e) {
    failed += 1;
    console.warn(`  FAIL opener video: ${e.message}`);
  }
}

console.log(`\n[download-assets] done: ${ok} downloaded, ${failed} failed.`);
if (failed) {
  console.log(
    "Some downloads failed. This script only works in a network-enabled environment; re-run when online."
  );
} else {
  console.log(`
All assets mirrored. To serve them locally:
  1. Open src/lib/assets.ts
  2. Change ASSETS_BASE to "/assets/"
  3. Rebuild: npm run build
`);
}
