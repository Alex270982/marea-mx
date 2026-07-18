/* SSR-safe GSAP loader: gsap + ScrollTrigger are only imported inside
   client-side effects, never at module scope of a rendered tree. */

/** Scroll-linked choreography only runs on desktop-ish viewports that
    haven't asked for reduced motion. Phones get zero scroll tweens:
    elements simply render in their final, untransformed state. */
export const DESKTOP_MOTION_MEDIA =
  "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

export type GsapMatchMedia = ReturnType<typeof import("gsap").gsap.matchMedia>;

export async function loadGsap() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger")
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function finePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
}
