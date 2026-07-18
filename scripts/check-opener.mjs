/* Headless verification of the opener behavior (mobile scrub restore). */
import { chromium } from "playwright";
import http from "node:http";
import { createReadStream, statSync } from "node:fs";
import { join, normalize } from "node:path";

const OUT = new URL("../out", import.meta.url).pathname;
const PORT = 4173;

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".txt": "text/plain",
  ".woff2": "font/woff2"
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p.endsWith("/")) p += "index.html";
  let file = normalize(join(OUT, p));
  if (!file.startsWith(OUT)) { res.writeHead(403); res.end(); return; }
  let st;
  try { st = statSync(file); } catch { st = null; }
  if (st && st.isDirectory()) { file = join(file, "index.html"); try { st = statSync(file); } catch { st = null; } }
  if (!st) {
    try { file = file + ".html"; st = statSync(file); } catch { res.writeHead(404); res.end("nf"); return; }
  }
  const ext = file.slice(file.lastIndexOf("."));
  res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  headless: true
});

const results = [];
const check = (name, ok, detail) => {
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
  if (!ok) process.exitCode = 1;
};

function collectErrors(page, sink) {
  page.on("pageerror", (e) => sink.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/404|Failed to load resource|ERR_/.test(t)) return; // expected asset 404s locally
    sink.push("console: " + t);
  });
}

/* ---------- Mobile 390x844: cinematic scrub attempt -> graceful fallback ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const errs = [];
  collectErrors(page, errs);
  // delay the (404ing) mobile video so the loader is observable
  await page.route("**/openerVideo-mobile.mp4", async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.fulfill({ status: 404, body: "nf" });
  });
  await page.goto(`http://localhost:${PORT}/en/`, { waitUntil: "load" });
  await page.waitForSelector("section.opener.opener--mobile", { timeout: 5000 }).catch(() => {});
  const tall = await page.evaluate(() => {
    const o = document.querySelector(".opener");
    return {
      h: o.offsetHeight,
      cls: o.className,
      vh: window.innerHeight,
      loader: !!document.querySelector(".opener__loader:not(.is-done)")
    };
  });
  check("mobile initial tall ~320vh", Math.abs(tall.h - 3.2 * tall.vh) < 8, `h=${tall.h} expected~${3.2 * tall.vh}`);
  check("mobile has opener--mobile class", /opener--mobile/.test(tall.cls), tall.cls);
  check("mobile loader visible during fetch", tall.loader);
  // after 404 settles: collapse to 100dvh static hero, statement revealed
  await page.waitForFunction(
    () => document.querySelector(".opener").offsetHeight <= window.innerHeight + 4,
    null,
    { timeout: 8000 }
  );
  const settled = await page.evaluate(() => {
    const o = document.querySelector(".opener");
    const w = document.querySelector(".opener__statement .word > i");
    return {
      h: o.offsetHeight,
      cls: o.className,
      vh: window.innerHeight,
      loaderGone: !document.querySelector(".opener__loader:not(.is-done)"),
      wordT: getComputedStyle(w).transform
    };
  });
  check("mobile collapsed to 100dvh after 404", Math.abs(settled.h - settled.vh) < 4, `h=${settled.h} vh=${settled.vh}`);
  check("mobile modifier class removed on collapse", !/opener--mobile/.test(settled.cls), settled.cls);
  check("mobile loader dismissed", settled.loaderGone);
  await page.waitForTimeout(1400); // word reveal transition
  const wordT = await page.evaluate(
    () => getComputedStyle(document.querySelector(".opener__statement .word > i")).transform
  );
  check("mobile statement revealed", wordT === "none" || /matrix\(1, 0, 0, 1, 0, 0\)/.test(wordT), wordT);
  check("mobile no console/page errors", errs.length === 0, errs.join(" | "));

  // sessionStorage short-circuit on reload
  await page.evaluate(() => sessionStorage.setItem("marea-intro-seen", "1"));
  await page.reload({ waitUntil: "load" });
  await page.waitForFunction(
    () => document.querySelector(".opener").offsetHeight <= window.innerHeight + 4,
    null,
    { timeout: 5000 }
  );
  const ret = await page.evaluate(() => {
    const o = document.querySelector(".opener");
    return { h: o.offsetHeight, vh: window.innerHeight, cls: o.className, loader: !!document.querySelector(".opener__loader") };
  });
  check("mobile return visit collapsed", Math.abs(ret.h - ret.vh) < 4 && !/opener--mobile/.test(ret.cls), `h=${ret.h}`);
  check("mobile return visit has no loader", !ret.loader);
  await ctx.close();
}

/* ---------- Desktop 1440x900: unchanged 460vh ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  collectErrors(page, errs);
  await page.goto(`http://localhost:${PORT}/en/`, { waitUntil: "load" });
  await page.waitForSelector(".opener__loader", { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(1200); // let the 404 settle
  const d = await page.evaluate(() => {
    const o = document.querySelector(".opener");
    return {
      h: o.offsetHeight,
      vh: window.innerHeight,
      cls: o.className,
      loaderGone: !document.querySelector(".opener__loader:not(.is-done)"),
      chapters: !!document.querySelector(".opener__progress")
    };
  });
  check("desktop tall 460vh", Math.abs(d.h - 4.6 * d.vh) < 8, `h=${d.h} expected~${4.6 * d.vh}`);
  check("desktop no opener--mobile class", !/opener--mobile/.test(d.cls), d.cls);
  check("desktop stays tall after video 404 (no collapse)", d.h > 3 * d.vh);
  check("desktop chapters/ticks present", d.chapters);
  check("desktop no console/page errors", errs.length === 0, errs.join(" | "));
  await ctx.close();
}

await browser.close();
server.close();
console.log(results.join("\n"));
