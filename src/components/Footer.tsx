import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";

export default function Footer({ locale, d }: { locale: Locale; d: Dict }) {
  const f = d.footer;
  const n = d.nav;
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <div className="footer__mark">MAREA</div>
          <p className="footer__tag">{f.tagline}</p>
        </div>
        <div>
          <h5>{f.col_explore}</h5>
          <ul>
            <li>
              <Link href={`/${locale}/properties/`}>{n.properties}</Link>
            </li>
            <li>
              <Link href={`/${locale}/properties/?dest=cancun`}>Cancún</Link>
            </li>
            <li>
              <Link href={`/${locale}/properties/?dest=playa-del-carmen`}>Playa del Carmen</Link>
            </li>
            <li>
              <Link href={`/${locale}/properties/?dest=tulum`}>Tulum</Link>
            </li>
          </ul>
        </div>
        <div>
          <h5>{f.col_company}</h5>
          <ul>
            <li>
              <a href="#">{f.about}</a>
            </li>
            <li>
              <a href="#">{f.journal}</a>
            </li>
            <li>
              <a href="#">{f.careers}</a>
            </li>
            <li>
              <a href="mailto:advisors@marea.mx">{f.contact}</a>
            </li>
          </ul>
        </div>
        <div>
          <h5>{f.col_legal}</h5>
          <ul>
            <li>
              <a href="#">{f.privacy}</a>
            </li>
            <li>
              <a href="#">{f.terms}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__base">
        <span>© 2026 MAREA · {locale === "es" ? "Caribe Mexicano" : "Mexican Caribbean"}</span>
        <span>{f.disclaimer}</span>
      </div>
    </footer>
  );
}
