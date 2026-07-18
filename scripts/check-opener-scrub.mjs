/* Happy-path check: mobile video exists -> scroll-scrub runs, end sets intro flag. */
import { chromium } from "playwright";
import http from "node:http";
import { createReadStream, statSync } from "node:fs";
import { join, normalize } from "node:path";

const OUT = new URL("../out", import.meta.url).pathname;
const PORT = 4174;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".mp4": "video/mp4" };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  let file = normalize(join(OUT, p));
  let st; try { st = statSync(file); } catch { st = null; }
  if (st && st.isDirectory()) { file = join(file, "index.html"); try { st = statSync(file); } catch { st = null; } }
  if (!st) { try { file += ".html"; st = statSync(file); } catch { res.writeHead(404); res.end(); return; } }
  res.writeHead(200, { "content-type": MIME[file.slice(file.lastIndexOf("."))] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required"]
});
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
await page.goto(`http://localhost:${PORT}/en/`, { waitUntil: "load" });
await page.waitForSelector(".opener__media video", { timeout: 10000 });
const t0 = await page.evaluate(() => document.querySelector(".opener__media video").currentTime);
const h = await page.evaluate(() => document.querySelector(".opener").offsetHeight);
// scroll halfway through the pin
await page.evaluate(() => window.scrollTo(0, (document.querySelector(".opener").offsetHeight - innerHeight) * 0.5));
await page.waitForTimeout(1500);
const mid = await page.evaluate(() => ({
  t: document.querySelector(".opener__media video").currentTime,
  chapter: document.querySelector(".opener__chapter .d3")?.textContent,
  ticksOn: document.querySelectorAll(".opener__ticks i.is-on").length,
  ticksVisible: getComputedStyle(document.querySelector(".opener__progress")).display
}));
// scroll to the end
await page.evaluate(() => window.scrollTo(0, document.querySelector(".opener").offsetHeight - innerHeight));
await page.waitForTimeout(1800);
const end = await page.evaluate(() => ({
  t: document.querySelector(".opener__media video").currentTime,
  flag: sessionStorage.getItem("marea-intro-seen"),
  wordT: getComputedStyle(document.querySelector(".opener__statement .word > i")).transform
}));
console.log(`opener height=${h} (320vh=${3.2 * 844})`);
console.log(`video t0=${t0.toFixed(3)} mid=${mid.t.toFixed(3)} end=${end.t.toFixed(3)}`);
console.log(`mid chapter="${mid.chapter}" ticksOn=${mid.ticksOn} progressDisplay=${mid.ticksVisible}`);
console.log(`end flag=${end.flag} statement=${end.wordT}`);
const ok = mid.t > t0 + 0.5 && end.t > mid.t + 0.5 && end.flag === "1" && mid.ticksVisible === "flex" && errs.length === 0;
console.log(ok ? "PASS scrub happy path" : "FAIL scrub happy path " + errs.join("|"));
process.exitCode = ok ? 0 : 1;
await browser.close();
server.close();
