"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { useSaved } from "@/components/SavedProvider";
import MobileMenu from "@/components/MobileMenu";
import { prefersReducedMotion } from "@/lib/motion";

export default function Nav({ locale, d }: { locale: Locale; d: Dict }) {
  const n = d.nav;
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { saved } = useSaved();
  const savedCount = saved.length;
  const other: Locale = locale === "en" ? "es" : "en";

  useEffect(() => {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const opener = document.getElementById("opener");
      const heroH = isHome
        ? opener
          ? opener.offsetHeight
          : window.innerHeight * 3.2
        : 10;
      setSolid(y > heroH - window.innerHeight * 0.4);
      if (!isHome || y > heroH) setHidden(y > lastY + 4 && y > 300);
      else setHidden(false);
      if (Math.abs(y - lastY) > 4) lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const anchorClick = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (!isHome) return;
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth"
    });
  };

  const switchLang = (target: Locale) => {
    if (target === locale) return;
    const { pathname: p, search, hash } = window.location;
    const next = p.replace(/\/(en|es)(?=\/|$)/, `/${target}`);
    window.location.href = next + search + hash;
  };

  return (
    <>
      <header className={`nav ${solid ? "is-solid" : ""} ${hidden ? "is-hidden" : ""}`} id="nav">
        <Link className="nav__mark" href={`/${locale}/`} aria-label="MAREA home">
          <span className="nav__wordmark">MAREA</span>
        </Link>
        <nav className="nav__links" aria-label="Primary">
          <Link className="nav__link" href={`/${locale}/properties/`}>
            {n.properties}
          </Link>
          <a className="nav__link" href={`/${locale}/#destinos`} onClick={anchorClick("destinos")}>
            {n.destinations}
          </a>
          <Link className="nav__link" href={`/${locale}/properties/?status=preconstruction`}>
            {n.developments}
          </Link>
          <a className="nav__link" href={`/${locale}/#invest`} onClick={anchorClick("invest")}>
            {n.investment}
          </a>
          <Link className="nav__link" href={`/${locale}/saved/`}>
            {n.saved}
            {savedCount ? ` (${savedCount})` : ""}
          </Link>
          <span className="lang" role="group" aria-label={d.footer.lang}>
            <button
              className={locale === "en" ? "is-on" : ""}
              aria-pressed={locale === "en"}
              onClick={() => switchLang("en")}
            >
              EN
            </button>
            <span>/</span>
            <button
              className={locale === "es" ? "is-on" : ""}
              aria-pressed={locale === "es"}
              onClick={() => switchLang("es")}
            >
              ES
            </button>
          </span>
          <a className="nav__consult" href={`/${locale}/#concierge`} onClick={anchorClick("concierge")}>
            {n.consult}
          </a>
        </nav>
        <button
          className={`nav__burger ${menuOpen ? "is-open" : ""}`}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <i></i>
          <i></i>
          <i></i>
        </button>
      </header>
      <MobileMenu
        open={menuOpen}
        locale={locale}
        d={d}
        onClose={() => setMenuOpen(false)}
        onSwitchLang={(target) => {
          setMenuOpen(false);
          if (target === locale) return;
          const { pathname: p, search, hash } = window.location;
          window.location.href = p.replace(/\/(en|es)(?=\/|$)/, `/${target}`) + search + hash;
        }}
      />
    </>
  );
}
