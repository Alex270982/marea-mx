"use client";

import { useEffect, useRef, useState } from "react";
import { asset, OPENER_VIDEO, OPENER_VIDEO_MOBILE } from "@/lib/assets";
import type { Dict, Locale } from "@/lib/i18n";
import { prefersReducedMotion } from "@/lib/motion";
import { startFilmScrub, type FilmScrub } from "@/lib/useFilmScrub";

const INTRO_KEY = "marea-intro-seen";
const CHAPTER_LABELS = ["01", "02", "03", "04"];

interface OpenerMode {
  short: boolean;
  video: boolean;
  mobile: boolean;
}

export default function Opener({ locale, d }: { locale: Locale; d: Dict }) {
  const h = d.hero;
  const [mode, setMode] = useState<OpenerMode | null>(null);
  const [chapter, setChapter] = useState(-1);
  const [loaderDone, setLoaderDone] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const posterRef = useRef<HTMLImageElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);
  const chapterTextRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);
  const loaderBarRef = useRef<HTMLElement | null>(null);
  const loaderPctRef = useRef<HTMLDivElement | null>(null);

  /* decide short/video after mount: browser APIs only */
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(INTRO_KEY) === "1";
    } catch {
      /* private mode */
    }
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const saveData = Boolean(nav.connection && nav.connection.saveData);
    const mobile = window.innerWidth < 900;
    if (mobile) {
      /* phones get the full scroll-scrub film (shorter 320vh pin) when a
         lightweight mobile encode exists and conditions allow; otherwise the
         settled 100dvh hero */
      const cinema = !seen && !reduce && !saveData && Boolean(OPENER_VIDEO_MOBILE);
      setMode({ short: !cinema, video: cinema, mobile });
    } else {
      const short = seen || reduce;
      const video = Boolean(OPENER_VIDEO) && !short && !saveData;
      setMode({ short, video, mobile });
    }
  }, []);

  /* chapter caption entrance */
  useEffect(() => {
    if (chapter < 0) return;
    chapterTextRef.current?.animate(
      [{ transform: "translateY(14px)" }, { transform: "translateY(0)" }],
      { duration: 600, easing: "cubic-bezier(0.19,1,0.22,1)" }
    );
  }, [chapter]);

  /* main choreography */
  useEffect(() => {
    if (!mode) return;
    const opener = sectionRef.current;
    const statement = statementRef.current;
    if (!opener || !statement) return;
    const words = Array.from(statement.querySelectorAll<HTMLElement>(".word > i"));

    if (mode.short) {
      /* settled hero: statement visible over entry frame */
      words.forEach((w, i) => {
        w.style.transition =
          "transform 1.1s cubic-bezier(0.19,1,0.22,1) " + (0.15 + i * 0.12) + "s";
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            w.style.transform = "translateY(0)";
          })
        );
      });
      return;
    }

    let scrub: FilmScrub | null = null;
    let statementShown = false;

    const dismissLoader = () => setLoaderDone(true);

    const showStatement = (show: boolean) => {
      if (show === statementShown) return;
      statementShown = show;
      words.forEach((w, i) => {
        w.style.transition =
          "transform 0.9s cubic-bezier(0.19,1,0.22,1) " + (show ? i * 0.1 : 0) + "s";
        w.style.transform = show ? "translateY(0)" : "translateY(110%)";
      });
    };

    /* video loading with real progress (shared film-scrub mechanics) */
    if (mode.video) {
      const src = mode.mobile && OPENER_VIDEO_MOBILE ? OPENER_VIDEO_MOBILE : OPENER_VIDEO;
      scrub = startFilmScrub({
        src,
        container: () => mediaRef.current,
        onProgress: (p) => {
          if (loaderBarRef.current) loaderBarRef.current.style.transform = "scaleX(" + p + ")";
          if (loaderPctRef.current)
            loaderPctRef.current.textContent = h.loading + " · " + Math.round(p * 100) + "%";
        },
        onReady: dismissLoader,
        /* mobile-only graceful degradation: if the film can't arrive (missing
           encode, fetch failure, timeout), settle into the static 100dvh hero
           instead of leaving a broken tall scroll. Desktop keeps the tall
           poster-backed scroll exactly as before. */
        onFail: () => {
          dismissLoader();
          if (mode.mobile) setMode({ short: true, video: false, mobile: true });
        }
      });
    } else {
      dismissLoader();
    }

    /* scroll choreography over the tall opener */
    const onScroll = () => {
      const total = opener.offsetHeight - window.innerHeight;
      const y = Math.min(Math.max(window.scrollY, 0), total);
      const p = total > 0 ? y / total : 1;
      if (scrub && scrub.ready()) {
        const journey = Math.min(p / 0.84, 1);
        scrub.setTargetTime(journey * Math.max(scrub.duration() - 0.05, 0));
        const poster = posterRef.current;
        const video = scrub.video();
        if (poster && poster.style.opacity !== "0" && video && video.readyState >= 2)
          poster.style.opacity = "0";
      }
      if (p < 0.03) setChapter(-1);
      else if (p < 0.24) setChapter(0);
      else if (p < 0.48) setChapter(1);
      else if (p < 0.72) setChapter(2);
      else setChapter(3);
      showStatement(p > 0.86);
      if (hintRef.current) hintRef.current.style.opacity = p > 0.04 ? "0" : "";
      if (skipRef.current) {
        skipRef.current.style.opacity = p > 0.8 ? "0" : "";
        skipRef.current.style.pointerEvents = p > 0.8 ? "none" : "";
      }
      if (p >= 0.99) {
        try {
          window.sessionStorage.setItem(INTRO_KEY, "1");
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      scrub?.destroy();
      scrub = null;
    };
  }, [mode, h.loading]);

  const onSkip = () => {
    const opener = sectionRef.current;
    if (!opener) return;
    try {
      window.sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* ignore */
    }
    const total = opener.offsetHeight - window.innerHeight;
    window.scrollTo({ top: total, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const short = mode?.short === true;
  const showLoader = mode?.video === true;
  const posterAlt =
    locale === "es"
      ? "Vista aérea de la costa del Caribe Mexicano"
      : "Aerial view of the Mexican Caribbean coast";

  return (
    <section
      className={"opener" + (mode?.mobile && !short ? " opener--mobile" : "")}
      id="opener"
      ref={sectionRef}
      style={short ? { height: "100dvh" } : undefined}
    >
      <div className="opener__stage" ref={stageRef}>
        <div className="opener__media" ref={mediaRef}>
          <picture>
            <source media="(max-width: 900px)" srcSet={asset("hero-entry", "min")} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("hero-entry", "raw")} alt={posterAlt} ref={posterRef} />
          </picture>
        </div>
        <div className="opener__veil"></div>
        <div className="opener__grain"></div>
        {!short && (
          <>
            <div className="opener__chapter" aria-hidden="true">
              <span className="label">{chapter >= 0 ? "MAREA · " + CHAPTER_LABELS[chapter] : ""}</span>
              <div className="d3" ref={chapterTextRef}>
                {chapter >= 0 ? h.chapters[chapter] : ""}
              </div>
            </div>
            <div className="opener__progress" aria-hidden="true">
              <span>MAREA</span>
              <div className="opener__ticks">
                {h.chapters.map((c, i) => (
                  <i key={c} className={i <= chapter ? "is-on" : ""}></i>
                ))}
              </div>
            </div>
            <button className="opener__skip" ref={skipRef} onClick={onSkip}>
              {h.skip}
            </button>
            <div className="opener__hint" ref={hintRef}>
              <span>{h.scroll}</span>
              <i></i>
            </div>
          </>
        )}
        <div className="opener__statement" ref={statementRef}>
          <h1 className="d1">
            <span className="word">
              <i>{h.statement_a}</i>
            </span>{" "}
            <span className="word">
              <i>
                <em>{h.statement_b}</em>
              </i>
            </span>
          </h1>
          <p className="support">
            <span className="word">
              <i>{h.support}</i>
            </span>
          </p>
        </div>
        {showLoader && (
          <div className={`opener__loader ${loaderDone ? "is-done" : ""}`}>
            <div className="loader__mark">MAREA</div>
            <div className="loader__bar">
              <i ref={(el) => {
                loaderBarRef.current = el;
              }}></i>
            </div>
            <div className="loader__pct" ref={loaderPctRef}>
              {h.loading}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
