/* Quick mobile headless check against the static export in out/.
   Remote CDN images 404 locally; network errors are ignored by design. */
import http from "node:http";
import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";
import { chromium } from "playwright";

const OUT = new URL("../out", import.meta.url).pathname;
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml"
};

const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    if (!/\.[a-z0-9]+$/i.test(p)) p += "/index.html";
    const file = normalize(join(OUT, p));
    const body = await readFile(file);
    const ext = file.slice(file.lastIndexOf("."));
    res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});
await new Promise((r) => server.listen(4173, r));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  headless: true
});
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
});

const failures = [];
const note = (m) => console.log(m);

async function checkPage(path, extra) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const t = msg.text();
    /* remote CDN images/video 404 locally — ignore resource-load errors */
    if (/Failed to load resource|net::ERR|404/i.test(t)) return;
    errors.push("console: " + t);
  });
  await page.goto("http://127.0.0.1:4173" + path, { waitUntil: "load" });
  await page.waitForTimeout(1200);
  if (errors.length) failures.push(`${path}: ${errors.join(" | ")}`);
  note(`${path}: ${errors.length === 0 ? "no console/page errors" : errors.join(" | ")}`);
  if (extra) await extra(page, path);
  await page.close();
}

await checkPage("/en/", async (page, path) => {
  const r = await page.evaluate(() => {
    const opener = document.querySelector(".opener");
    const oh = opener ? opener.getBoundingClientRect().height : -1;
    const media = document.querySelector(".feat__media");
    const body = document.querySelector(".feat__body");
    const gm = media ? getComputedStyle(media) : null;
    const gb = body ? getComputedStyle(body) : null;
    const mr = media ? media.getBoundingClientRect() : null;
    const words = Array.from(
      document.querySelectorAll(".opener__statement .word > i")
    ).map((w) => getComputedStyle(w).transform);
    return {
      viewportH: window.visualViewport ? window.visualViewport.height : window.innerHeight,
      innerHeight: window.innerHeight,
      docHeight: document.documentElement.scrollHeight,
      openerHeight: oh,
      chapters: Boolean(document.querySelector(".opener__chapter")),
      progress: Boolean(document.querySelector(".opener__progress")),
      video: Boolean(document.querySelector(".opener__media video")),
      featTransform: gm ? gm.transform : "missing",
      featClip: gm ? gm.clipPath : "missing",
      featVisible: mr ? mr.width > 0 && mr.height > 0 : false,
      bodyTransform: gb ? gb.transform : "missing",
      statementWords: words,
      posterCurrentSrc: document.querySelector(".opener__media img")?.currentSrc || ""
    };
  });
  /* 100dvh equals the CSS/visual viewport (844 here); emulated
     window.innerHeight reports the scaled layout viewport instead */
  const openerOk = Math.abs(r.openerHeight - 844) <= 2 || Math.abs(r.openerHeight - r.viewportH) <= 2;
  if (!openerOk) failures.push(`opener height ${r.openerHeight} vs viewport 844/${r.viewportH}`);
  note(`  opener height: ${r.openerHeight}px (viewport 844px, visualViewport ${r.viewportH}px) -> ${openerOk ? "OK (100dvh)" : "FAIL"}`);
  note(`  opener extras on mobile: chapters=${r.chapters} progress=${r.progress} video=${r.video} (all should be false)`);
  if (r.chapters || r.progress || r.video) failures.push("opener rendered desktop-only extras on mobile");
  const featOk =
    r.featVisible &&
    (r.featTransform === "none" || r.featTransform === "matrix(1, 0, 0, 1, 0, 0)") &&
    (r.featClip === "none" || /inset\(0(px)?( 0(px)?){3}\)/.test(r.featClip));
  note(`  featured media: visible=${r.featVisible} transform=${r.featTransform} clip=${r.featClip} bodyTransform=${r.bodyTransform} -> ${featOk ? "OK" : "FAIL"}`);
  if (!featOk) failures.push("featured media stuck transformed/hidden");
  if (!(r.bodyTransform === "none" || r.bodyTransform === "matrix(1, 0, 0, 1, 0, 0)"))
    failures.push("featured body stuck transformed");
  /* transitions stagger in over ~1.5s; sub-2px residual = revealed */
  const wordsOk = r.statementWords.every((t) => {
    if (t === "none") return true;
    const m = t.match(/matrix\(1, 0, 0, 1, 0, (-?[\d.]+)\)/);
    return m ? Math.abs(parseFloat(m[1])) < 2 : false;
  });
  note(`  opener statement words revealed: ${wordsOk ? "OK" : "FAIL " + r.statementWords.join(",")}`);
  if (!wordsOk) failures.push("statement words not revealed on mobile");
  note(`  poster currentSrc: ${r.posterCurrentSrc.split("/").pop()} (expect _min.webp)`);
  if (!/_min\.webp/.test(r.posterCurrentSrc)) failures.push("poster not using min variant on mobile");
});

await checkPage("/en/properties/", async (page) => {
  const r = await page.evaluate(() => {
    const rows = document.querySelectorAll(".srow");
    const first = rows[0];
    const g = first ? getComputedStyle(first) : null;
    const img = document.querySelector(".srow__media img");
    return {
      rows: rows.length,
      rowTransform: g ? g.transform : "missing",
      imgSrc: img ? img.currentSrc : ""
    };
  });
  note(`  result rows: ${r.rows}, first row transform: ${r.rowTransform}, img: ${r.imgSrc.split("/").pop()}`);
  if (!(r.rows > 0)) failures.push("no search rows rendered");
  if (!(r.rowTransform === "none" || r.rowTransform === "matrix(1, 0, 0, 1, 0, 0)"))
    failures.push("search row stuck transformed");
});

await checkPage("/en/properties/penthouse-horizonte/", async (page) => {
  const r = await page.evaluate(() => {
    const secs = Array.from(document.querySelectorAll(".pd__main > section"));
    const transforms = secs.map((s) => getComputedStyle(s).transform);
    const hero = document.querySelector(".pd__hero img");
    const gal = document.querySelector(".gallery img");
    return {
      sections: secs.length,
      allSettled: transforms.every((t) => t === "none" || t === "matrix(1, 0, 0, 1, 0, 0)"),
      heroSrc: hero ? hero.currentSrc : "",
      galSrc: gal ? gal.currentSrc : ""
    };
  });
  note(`  detail sections: ${r.sections}, all untransformed: ${r.allSettled}`);
  note(`  hero img: ${r.heroSrc.split("/").pop()}, gallery img: ${r.galSrc.split("/").pop()} (expect _min.webp)`);
  if (!(r.sections > 0)) failures.push("no detail sections rendered");
  if (!r.allSettled) failures.push("detail sections stuck transformed");
  if (!/_min\.webp/.test(r.heroSrc)) failures.push("detail hero not using min variant on mobile");
});

await browser.close();
server.close();

if (failures.length) {
  console.log("\nFAILURES:\n- " + failures.join("\n- "));
  process.exit(1);
}
console.log("\nALL MOBILE CHECKS PASSED");
