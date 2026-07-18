"use client";

/** Native scrolling everywhere.

    Lenis smooth scroll was removed deliberately: on some macOS
    trackpad/mouse setups its rAF-driven scroll could stall mid-page,
    locking wheel input. The scroll-scrubbed films and all GSAP
    ScrollTriggers listen to native scroll and need no bridge. */
export default function ClientShell() {
  return null;
}
