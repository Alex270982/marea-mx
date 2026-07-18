/* Per-property film scrub checks against the exported site (out/):
   - casa-almar desktop: tall pinned scrub section, poster + loader visible
     while the film downloads, graceful collapse to the static hero when the
     film 404s locally, Gallery button still opens the lightbox.
   - residencia-bahia (no film): unchanged static hero.
   - casa-almar mobile: tall (260vh) then graceful collapse.
   - zero unexpected console/page errors everywhere. */
import { chromium } from "playwright";
import http from "node:http";
import { createReadStream, statSync } from "node:fs";
import { join, normalize } from "node:path";

const OUT = new URL("../out", import.meta.url).pathname;
const PORT = 4175;
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".mp4": "video/mp4", ".png": "image/png", ".webp": "image/webp" };

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

let failures = 0;
const check = (label, ok, extra = "") => {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${extra ? " " + extra : ""}`);
  if (!ok) failures += 1;
};

async function newPage(viewport, { stallFilms = false } = {}) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    /* the film mp4 is intentionally absent locally; its 404 is the scenario */
    if (/Failed to load resource/.test(text) && /404/.test(text)) return;
    errs.push("console: " + text);
  });
  let releaseFilm = null;
  if (stallFilms) {
    await page.route("**/assets/films/**", (route) => {
      /* hold the request so the tall scrub state is observable, release on demand */
      releaseFilm = () => route.fulfill({ status: 404, body: "" });
    });
  }
  return { ctx, page, errs, getRelease: () => releaseFilm };
}

/* ---------- 1. desktop casa-almar: tall scrub, then graceful collapse ---------- */
{
  const { ctx, page, errs, getRelease } = await newPage({ width: 1440, height: 900 }, { stallFilms: true });
  await page.goto(`http://localhost:${PORT}/en/properties/casa-almar/`, { waitUntil: "load" });
  await page.waitForSelector(".pdfilm", { timeout: 5000 }).catch(() => {});
  const tall = await page.evaluate(() => {
    const s = document.querySelector(".pdfilm");
    if (!s) return null;
    const poster = document.querySelector(".pdfilm__media img");
    const loader = document.querySelector(".pdfilm__loader");
    const hm = document.querySelector(".pdfilm .pd__heromain h1");
    return {
      h: s.offsetHeight,
      posterVisible: poster && getComputedStyle(poster).opacity !== "0" && poster.naturalWidth > 0,
      loaderShown: loader && !loader.classList.contains("is-done") && getComputedStyle(loader).visibility === "visible",
      name: hm ? hm.textContent : "",
      skip: document.querySelector(".pdfilm .opener__skip")?.textContent || ""
    };
  });
  check("desktop scrub section present", !!tall);
  if (tall) {
    check("desktop scrub 300vh tall", tall.h === 2700, `(h=${tall.h}, 300vh=2700)`);
    check("desktop poster visible", !!tall.posterVisible);
    check("desktop loader shown", !!tall.loaderShown);
    check("desktop name overlay", tall.name === "Casa Almar", `("${tall.name}")`);
    check("desktop skip label", tall.skip === "Skip flight", `("${tall.skip}")`);
  }
  /* let the film request 404 -> collapse */
  await page.waitForFunction(() => true); // flush
  getRelease()?.();
  await page.waitForSelector(".pd__hero", { timeout: 6000 }).catch(() => {});
  const after = await page.evaluate(() => {
    const hero = document.querySelector(".pd__hero");
    return {
      collapsed: !!hero && !document.querySelector(".pdfilm"),
      heroH: hero ? hero.offsetHeight : 0,
      heromain: !!document.querySelector(".pd__hero .pd__heromain h1")
    };
  });
  check("desktop collapse to static hero", after.collapsed);
  check("desktop collapsed hero 100dvh", after.heroH === 900, `(h=${after.heroH})`);
  check("desktop heromain kept", after.heromain);
  /* gallery button still opens the lightbox */
  await page.click(".pd__hero .pd__gallerybtns button:first-child");
  const lb = await page.evaluate(() => document.querySelector(".lightbox")?.classList.contains("is-open"));
  check("desktop gallery button opens lightbox", lb === true);
  check("desktop zero unexpected errors", errs.length === 0, errs.join(" | "));
  await ctx.close();
}

/* ---------- 2. desktop residencia-bahia: unchanged static hero ---------- */
{
  const { ctx, page, errs } = await newPage({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${PORT}/en/properties/residencia-bahia/`, { waitUntil: "load" });
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => ({
    film: !!document.querySelector(".pdfilm"),
    hero: !!document.querySelector(".pd__hero"),
    heroH: document.querySelector(".pd__hero")?.offsetHeight || 0,
    name: document.querySelector(".pd__heromain h1")?.textContent || ""
  }));
  check("bahia no scrub section", !r.film);
  check("bahia static hero present", r.hero, `(h=${r.heroH}, 86dvh=${Math.round(0.86 * 900)})`);
  check("bahia hero 86dvh", r.heroH === Math.round(0.86 * 900));
  check("bahia name", r.name === "Residencia Bahía", `("${r.name}")`);
  check("bahia zero unexpected errors", errs.length === 0, errs.join(" | "));
  await ctx.close();
}

/* ---------- 3. mobile casa-almar: tall (260vh) then graceful collapse ---------- */
{
  const { ctx, page, errs, getRelease } = await newPage({ width: 390, height: 844 }, { stallFilms: true });
  await page.goto(`http://localhost:${PORT}/en/properties/casa-almar/`, { waitUntil: "load" });
  await page.waitForSelector(".pdfilm--mobile", { timeout: 5000 }).catch(() => {});
  const tall = await page.evaluate(() => {
    const s = document.querySelector(".pdfilm--mobile");
    return s ? { h: s.offsetHeight, poster: !!document.querySelector(".pdfilm__media img") } : null;
  });
  check("mobile scrub section present", !!tall);
  if (tall) check("mobile scrub 260vh tall", Math.abs(tall.h - 2.6 * 844) <= 1, `(h=${tall.h}, 260vh=${2.6 * 844})`);
  getRelease()?.();
  await page.waitForSelector(".pd__hero", { timeout: 6000 }).catch(() => {});
  const after = await page.evaluate(() => ({
    collapsed: !!document.querySelector(".pd__hero") && !document.querySelector(".pdfilm"),
    heroH: document.querySelector(".pd__hero")?.offsetHeight || 0
  }));
  check("mobile collapse to static hero", after.collapsed);
  check("mobile collapsed hero 100dvh", after.heroH === 844, `(h=${after.heroH})`);
  check("mobile zero unexpected errors", errs.length === 0, errs.join(" | "));
  await ctx.close();
}

await browser.close();
server.close();
console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exitCode = failures === 0 ? 0 : 1;
