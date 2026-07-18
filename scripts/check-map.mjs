/* Headless check: serve out/ and verify map rendering + console cleanliness.
   Usage: node scripts/check-map.mjs [--expect-fallback-swap] */
import http from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { chromium } from "playwright";

const OUT = join(process.cwd(), "out");
const PORT = 4173;
const expectSwap = process.argv.includes("--expect-fallback-swap");

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "text/xml", ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = join(OUT, p);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) file = join(OUT, p.replace(/\/$/, "") + ".html");
  if (!existsSync(file)) { res.writeHead(404); res.end("404"); return; }
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-webgl"]
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 950 } });

let failures = 0;
async function check(path) {
  const page = await ctx.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(`${m.text()} @${m.location().url || ""}`);
  });
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "load", timeout: 30000 });
  let earlyLive = 0;
  if (expectSwap) {
    await page.waitForTimeout(700);
    earlyLive = await page.locator(".mapwrap--live").count();
    await page.waitForTimeout(10300);
  } else {
    await page.waitForTimeout(2500);
  }
  const svgMap = await page.locator('svg[aria-label="Riviera Maya map"]').count();
  const liveMap = await page.locator(".mapwrap--live").count();
  /* image CDN is unreachable in this sandbox on every page — pre-existing, not map-related */
  const cdnErr = consoleErrors.filter((t) => /cloudfront\.net/.test(t));
  const mapboxNetErr = consoleErrors.filter((t) => /mapbox\.com|ERR_TUNNEL|ERR_NAME|Failed to fetch/i.test(t) && !/cloudfront\.net/.test(t));
  const realErr = consoleErrors.filter((t) => !cdnErr.includes(t) && !mapboxNetErr.includes(t));
  const ok = expectSwap
    ? svgMap > 0 && pageErrors.length === 0 && realErr.length === 0
    : svgMap > 0 && liveMap === 0 && pageErrors.length === 0 && realErr.length === 0 && mapboxNetErr.length === 0;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"} ${path}  svgMap=${svgMap} liveMapBox=${liveMap}${expectSwap ? ` earlyLiveMapBox=${earlyLive}` : ""} pageErrors=${pageErrors.length} imageCdnErrors=${cdnErr.length} mapboxNetErrors=${mapboxNetErr.length} otherErrors=${realErr.length}`);
  if (pageErrors.length) console.log("   pageErrors:", pageErrors.slice(0, 3));
  if (realErr.length) console.log("   other console errors:", realErr.slice(0, 3));
  if (expectSwap && mapboxNetErr.length) console.log("   (expected offline mapbox network errors present)");
  await page.close();
}

for (const p of ["/en/", "/en/properties/?view=split", "/en/properties/?view=map", "/en/properties/casa-almar/"]) {
  await check(p);
}

await browser.close();
server.close();
process.exit(failures ? 1 : 0);
