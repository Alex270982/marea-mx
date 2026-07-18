"use client";

import { useEffect } from "react";
import { finePointer, loadGsap, prefersReducedMotion } from "@/lib/motion";

/** Ports the home-page scroll choreography from the prototype:
    clip-path reveals on featured rows, parallax on destination media,
    investment items rise, headline drift, magnetic CTAs and
    cursor-aware image drift. Transform-only, reduced-motion guarded. */
export default function SectionMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    const listenerCleanups: Array<() => void> = [];

    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;

      ctx = gsap.context(() => {
        /* editorial rows: image mask-slide + body drift */
        document.querySelectorAll<HTMLElement>(".feat__row").forEach((row) => {
          const media = row.querySelector(".feat__media");
          if (media) {
            gsap.fromTo(
              media,
              { clipPath: "inset(0 0 12% 0)", y: 40 },
              {
                clipPath: "inset(0 0 0% 0)",
                y: 0,
                ease: "power3.out",
                duration: 1.2,
                scrollTrigger: { trigger: row, start: "top 82%" }
              }
            );
          }
          const body = row.querySelector(".feat__body");
          if (body) {
            gsap.fromTo(
              body,
              { y: 46 },
              { y: 0, ease: "power3.out", duration: 1.1, scrollTrigger: { trigger: row, start: "top 78%" } }
            );
          }
        });

        /* destination chapters: slow parallax inside media */
        document.querySelectorAll<HTMLElement>("[data-plx] img").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: img.closest("[data-plx]"),
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6
              }
            }
          );
        });

        /* investment items rise */
        document.querySelectorAll<HTMLElement>("[data-rv]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 34 },
            { y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }
          );
        });

        /* headline drift on big display type */
        document.querySelectorAll<HTMLElement>(".d2").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 28 },
            { y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } }
          );
        });
      });

      /* magnetic pull on primary CTAs (desktop pointer only) */
      if (finePointer()) {
        document
          .querySelectorAll<HTMLElement>(".searchband__go, .cta-frame, .cta-solid")
          .forEach((btn) => {
            const sx = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
            const sy = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
            const onMove = (e: MouseEvent) => {
              const r = btn.getBoundingClientRect();
              sx((e.clientX - r.left - r.width / 2) * 0.18);
              sy((e.clientY - r.top - r.height / 2) * 0.28);
            };
            const onLeave = () => {
              sx(0);
              sy(0);
            };
            btn.addEventListener("mousemove", onMove);
            btn.addEventListener("mouseleave", onLeave);
            listenerCleanups.push(() => {
              btn.removeEventListener("mousemove", onMove);
              btn.removeEventListener("mouseleave", onLeave);
            });
          });

        /* cursor-aware image drift on featured media */
        document.querySelectorAll<HTMLElement>("[data-cursor] img").forEach((img) => {
          const wrap = img.parentElement;
          if (!wrap) return;
          const qx = gsap.quickTo(img, "xPercent", { duration: 0.8, ease: "power3.out" });
          const onMove = (e: MouseEvent) => {
            const r = wrap.getBoundingClientRect();
            qx(((e.clientX - r.left) / r.width - 0.5) * 2.4);
          };
          const onLeave = () => qx(0);
          wrap.addEventListener("mousemove", onMove);
          wrap.addEventListener("mouseleave", onLeave);
          listenerCleanups.push(() => {
            wrap.removeEventListener("mousemove", onMove);
            wrap.removeEventListener("mouseleave", onLeave);
          });
        });
      }
    })();

    return () => {
      cancelled = true;
      listenerCleanups.forEach((fn) => fn());
      ctx?.revert();
    };
  }, []);

  return null;
}
