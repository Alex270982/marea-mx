"use client";

import { useEffect } from "react";
import { finePointer, prefersReducedMotion } from "@/lib/motion";
import type Lenis from "lenis";

/** Initializes Lenis smooth scroll with the GSAP ticker bridge.
    Fine-pointer (desktop) devices only — touch phones keep native
    scrolling — and disabled entirely under prefers-reduced-motion. */
export default function ClientShell() {
  useEffect(() => {
    if (prefersReducedMotion() || !finePointer()) return;
    let cancelled = false;
    let lenis: Lenis | null = null;
    let gsapRef: typeof import("gsap").gsap | null = null;
    let tickerFn: ((time: number) => void) | null = null;
    let scrollFn: (() => void) | null = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: LenisCtor }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis")
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      gsapRef = gsap;
      lenis = new LenisCtor();
      scrollFn = () => ScrollTrigger.update();
      lenis.on("scroll", scrollFn);
      tickerFn = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      cancelled = true;
      if (lenis && scrollFn) lenis.off("scroll", scrollFn);
      if (gsapRef && tickerFn) gsapRef.ticker.remove(tickerFn);
      lenis?.destroy();
    };
  }, []);

  return null;
}
