"use client";

import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";

interface MobileMenuProps {
  open: boolean;
  locale: Locale;
  d: Dict;
  onClose: () => void;
  onSwitchLang: (target: Locale) => void;
}

export default function MobileMenu({ open, locale, d, onClose, onSwitchLang }: MobileMenuProps) {
  const n = d.nav;
  const items: Array<[string, string]> = [
    [n.properties, `/${locale}/properties/`],
    [n.destinations, `/${locale}/#destinos`],
    [n.developments, `/${locale}/properties/?status=preconstruction`],
    [n.saved, `/${locale}/saved/`],
    [n.consult, `/${locale}/#concierge`]
  ];

  return (
    <div className={`mobile-menu ${open ? "is-open" : ""}`}>
      {items.map(([label, href], i) => (
        <Link key={href + label} href={href} onClick={onClose}>
          <span>{label}</span>
          <small>0{i + 1}</small>
        </Link>
      ))}
      <div style={{ marginTop: 28 }} className="lang">
        <button className={locale === "en" ? "is-on" : ""} onClick={() => onSwitchLang("en")}>
          EN
        </button>
        <span>/</span>
        <button className={locale === "es" ? "is-on" : ""} onClick={() => onSwitchLang("es")}>
          ES
        </button>
      </div>
    </div>
  );
}
