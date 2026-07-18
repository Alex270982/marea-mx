"use client";

/* Per-property cinematic scroll-scrub hero for detail pages: a pinned
   section (300vh desktop / 260vh phones) that scrubs a camera flight
   through the property as the visitor scrolls, poster-first, with a real
   download progress hairline and a skip control. Any failure (missing
   encode, fetch error, ~9s timeout), reduced motion, or save-data
   preference collapses to the familiar static pd__hero. */

import { useEffect, useRef, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { destName, type Listing } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/motion";
import { useFilmScrub } from "@/lib/useFilmScrub";
import AssetImg from "@/components/AssetImg";

interface PropertyScrubProps {
  l: Listing;
  locale: Locale;
  d: Dict;
  film: { desktop: string; mobile: string | null };
  galleryCount: number;
  onGallery: () => void;
  onTour: () => void;
}

type Phase = "boot" | "scrub" | "static";

export default function PropertyScrub({
  l,
  locale,
  d,
  film,
  galleryCount,
  onGallery,
  onTour
}: PropertyScrubProps) {
  const li = d.listing;
  const loc = l[locale];
  const [phase, setPhase] = useState<Phase>("boot");
  const [isMobile, setIsMobile] = useState(false);
  /* true when the scrub attempt failed and we collapsed to the static look */
  const [collapsed, setCollapsed] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const posterRef = useRef<HTMLImageElement | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);
  const loaderBarRef = useRef<HTMLElement | null>(null);
  const loaderPctRef = useRef<HTMLDivElement | null>(null);

  /* decide after mount: browser APIs only */
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const saveData = Boolean(nav.connection && nav.connection.saveData);
    const mobile = window.innerWidth < 900;
    setIsMobile(mobile);
    if (prefersReducedMotion() || saveData || (mobile && !film.mobile)) {
      setPhase("static");
    } else {
      setPhase("scrub");
    }
  }, [film.mobile]);

  const src = isMobile && film.mobile ? film.mobile : film.desktop;
  const scrubRef = useFilmScrub(phase === "scrub", {
    src,
    container: () => mediaRef.current,
    onProgress: (p) => {
      if (loaderBarRef.current) loaderBarRef.current.style.transform = "scaleX(" + p + ")";
      if (loaderPctRef.current)
        loaderPctRef.current.textContent =
          d.hero.loading + " · " + Math.round(p * 100) + "%";
    },
    onReady: () => setLoaderDone(true),
    onFail: () => {
      /* collapse to the static hero: no dead scroll space, no loader */
      setLoaderDone(true);
      setCollapsed(true);
      setPhase("static");
    }
  });

  /* scroll choreography over the pinned section */
  useEffect(() => {
    if (phase !== "scrub") return;
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;
      const total = sec.offsetHeight - window.innerHeight;
      const y = Math.min(Math.max(-sec.getBoundingClientRect().top, 0), total);
      const p = total > 0 ? y / total : 1;
      const scrub = scrubRef.current;
      if (scrub && scrub.ready()) {
        const journey = Math.min(p / 0.9, 1);
        scrub.setTargetTime(journey * Math.max(scrub.duration() - 0.05, 0));
        const poster = posterRef.current;
        const video = scrub.video();
        if (poster && poster.style.opacity !== "0" && video && video.readyState >= 2)
          poster.style.opacity = "0";
      }
      if (skipRef.current) {
        skipRef.current.style.opacity = p > 0.8 ? "0" : "";
        skipRef.current.style.pointerEvents = p > 0.8 ? "none" : "";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [phase, scrubRef]);

  const onSkip = () => {
    const sec = sectionRef.current;
    if (!sec) return;
    const top =
      window.scrollY + sec.getBoundingClientRect().top + sec.offsetHeight - window.innerHeight;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  const heroMain = (
    <div className="pd__heromain">
      <div>
        <span className="label">
          {l.neighborhood} · {destName(l.destination, locale)} · {d.types[l.type] || l.type}
        </span>
        <h1 className="d1" style={{ fontSize: "clamp(2.4rem,5.4vw,4.6rem)" }}>
          {loc.name}
        </h1>
      </div>
      <div className="pd__gallerybtns">
        <button className="btn-ghost" onClick={onGallery}>
          {li.gallery} · {galleryCount}
        </button>
        <button className="btn-ghost" onClick={onTour}>
          {li.video} / {li.tour}
        </button>
      </div>
    </div>
  );

  if (phase !== "scrub") {
    /* static hero — the collapse target keeps a full viewport (100dvh) so a
       failed film never leaves dead scroll space or a layout jump mid-read */
    return (
      <section className="pd__hero" style={collapsed ? { height: "100dvh" } : undefined}>
        <AssetImg k={l.image} kind="raw" alt={loc.name} />
        {heroMain}
      </section>
    );
  }

  return (
    <section
      className={"pdfilm" + (isMobile ? " pdfilm--mobile" : "")}
      ref={sectionRef}
      aria-label={loc.name}
    >
      <div className="pdfilm__stage">
        <div className="pdfilm__media" ref={mediaRef}>
          <AssetImg k={l.image} kind="raw" alt={loc.name} ref={posterRef} />
        </div>
        <div className="pdfilm__veil"></div>
        {heroMain}
        <button className="opener__skip" ref={skipRef} onClick={onSkip}>
          {li.skip_film}
        </button>
        <div className={"pdfilm__loader" + (loaderDone ? " is-done" : "")} aria-hidden="true">
          <div className="loader__bar">
            <i
              ref={(el) => {
                loaderBarRef.current = el;
              }}
            ></i>
          </div>
          <div className="loader__pct" ref={loaderPctRef}>
            {d.hero.loading}
          </div>
        </div>
      </div>
    </section>
  );
}
