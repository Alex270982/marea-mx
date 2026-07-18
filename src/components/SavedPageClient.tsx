"use client";

import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { getListing, type Listing } from "@/lib/data";
import { useSaved } from "@/components/SavedProvider";
import SimCard from "@/components/SimCard";

export default function SavedPageClient({ locale, d }: { locale: Locale; d: Dict }) {
  const sp = d.searchpage;
  const { saved } = useSaved();
  const items = saved.map((slug) => getListing(slug)).filter((l): l is Listing => Boolean(l));

  return (
    <main className="page shell section--tight" style={{ minHeight: "70dvh" }}>
      <span className="label label--teal">MAREA</span>
      <h1 className="d2" style={{ margin: "14px 0 30px" }}>
        {sp.saved_title}
      </h1>
      {items.length ? (
        <div className="simgrid">
          {items.map((l) => (
            <SimCard key={l.slug} l={l} locale={locale} />
          ))}
        </div>
      ) : (
        <>
          <p className="body-m">{sp.saved_empty}</p>
          <p style={{ marginTop: 24 }}>
            <Link className="linkline" href={`/${locale}/properties/`}>
              {d.nav.properties} <span className="arrow">→</span>
            </Link>
          </p>
        </>
      )}
    </main>
  );
}
