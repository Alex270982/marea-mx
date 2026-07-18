"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dict, Locale } from "@/lib/i18n";
import { destName, type Listing } from "@/lib/data";
import { fmtUSD } from "@/lib/format";
import AssetImg from "@/components/AssetImg";
import SaveButton from "@/components/SaveButton";
import { SpecsInline } from "@/components/ListingBits";
import { useSaved } from "@/components/SavedProvider";

interface PropertyRowProps {
  l: Listing;
  locale: Locale;
  d: Dict;
  onQuickView: (slug: string) => void;
}

export default function PropertyRow({ l, locale, d, onQuickView }: PropertyRowProps) {
  const sp = d.searchpage;
  const f = d.featured;
  const router = useRouter();
  const { compare, toggleCompare } = useSaved();
  return (
    <article className="srow" data-slug={l.slug}>
      <div className="srow__media" onClick={() => router.push(`/${locale}/properties/${l.slug}/`)}>
        <AssetImg k={l.image} alt={l[locale].name} loading="lazy" />
      </div>
      <div className="srow__body">
        <span className="loc">
          {l.neighborhood} · {destName(l.destination, locale)} · {d.types[l.type] || l.type}
        </span>
        <h3>
          <Link href={`/${locale}/properties/${l.slug}/`}>{l[locale].name}</Link>
        </h3>
        <p className="sum">{l[locale].summary}</p>
        <div className="srow__specs">
          <SpecsInline l={l} d={d} />
        </div>
      </div>
      <div className="srow__side">
        <div className="srow__price num">
          {l.status === "preconstruction" && (
            <small
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink-40)",
                display: "block"
              }}
            >
              {f.from}
            </small>
          )}
          {fmtUSD(l.priceUSD)}
        </div>
        {l.delivery && (
          <span className="tag">
            {d.listing.delivery} {l.delivery}
          </span>
        )}
        <div className="srow__acts">
          <button
            className={`cmp ${compare.includes(l.slug) ? "is-on" : ""}`}
            onClick={() => toggleCompare(l.slug)}
          >
            {sp.compare}
          </button>
          <SaveButton slug={l.slug} label={f.save} />
          <button className="quickbtn" onClick={() => onQuickView(l.slug)}>
            {f.quick}
          </button>
        </div>
      </div>
    </article>
  );
}
