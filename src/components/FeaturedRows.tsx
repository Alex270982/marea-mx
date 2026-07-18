"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { LISTINGS, destName, type Listing } from "@/lib/data";
import { asset } from "@/lib/assets";
import { ROMAN } from "@/lib/format";
import SaveButton from "@/components/SaveButton";
import QuickView from "@/components/QuickView";
import { SpecsInline, PriceBlock } from "@/components/ListingBits";

const VARIANTS = ["a", "b", "c"] as const;

function FeatRow({
  l,
  i,
  locale,
  d,
  onQuickView
}: {
  l: Listing;
  i: number;
  locale: Locale;
  d: Dict;
  onQuickView: (slug: string) => void;
}) {
  const f = d.featured;
  const router = useRouter();
  const v = VARIANTS[i % 3];
  return (
    <article className={`feat__row feat__row--${v}`} data-slug={l.slug}>
      <span className="feat__idx">{ROMAN[i]}</span>
      <div
        className="feat__media"
        data-cursor
        onClick={() => router.push(`/${locale}/properties/${l.slug}/`)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(l.image, "raw")} alt={l[locale].name} loading={i > 0 ? "lazy" : "eager"} />
      </div>
      <div className="feat__body">
        <div className="feat__meta">
          <span className="feat__loc">
            {l.neighborhood} · {destName(l.destination, locale)}
          </span>
          <span className={`tag ${l.label === "investment" ? "tag--teal" : ""}`}>
            {d.labels[l.label]}
          </span>
          {l.beachfront && <span className="tag">{d.search.beachfront}</span>}
        </div>
        <h3 className="feat__name d3">
          <Link href={`/${locale}/properties/${l.slug}/`}>{l[locale].name}</Link>
        </h3>
        <p className="feat__sum body-m">{l[locale].summary}</p>
        <div className="feat__specs">
          <SpecsInline l={l} d={d} />
        </div>
        <div className="feat__price">
          <PriceBlock l={l} d={d} />
        </div>
        <div className="feat__acts">
          <Link className="linkline" href={`/${locale}/properties/${l.slug}/`}>
            {f.view} <span className="arrow">→</span>
          </Link>
          <SaveButton slug={l.slug} label={f.save} />
          <button className="quickbtn" onClick={() => onQuickView(l.slug)}>
            {f.quick}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedRows({ locale, d }: { locale: Locale; d: Dict }) {
  const featured = LISTINGS.filter((l) => l.featured);
  const [qv, setQv] = useState<string | null>(null);
  return (
    <>
      <div>
        {featured.map((l, i) => (
          <FeatRow key={l.slug} l={l} i={i} locale={locale} d={d} onQuickView={setQv} />
        ))}
      </div>
      <QuickView slug={qv} locale={locale} d={d} onClose={() => setQv(null)} />
    </>
  );
}
