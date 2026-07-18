"use client";

import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { getListing } from "@/lib/data";
import AssetImg from "@/components/AssetImg";
import Modal from "@/components/Modal";
import SaveButton from "@/components/SaveButton";
import { SpecsInline, PriceBlock, locLine } from "@/components/ListingBits";

interface QuickViewProps {
  slug: string | null;
  locale: Locale;
  d: Dict;
  onClose: () => void;
}

export default function QuickView({ slug, locale, d, onClose }: QuickViewProps) {
  const l = slug ? getListing(slug) : undefined;
  const f = d.featured;
  return (
    <Modal open={Boolean(l)} onClose={onClose} closeLabel={d.misc.close}>
      {l && (
        <div className="qv">
          <div className="qv__media">
            <AssetImg k={l.image} kind="raw" alt={l[locale].name} />
          </div>
          <div className="qv__body">
            <span className="feat__loc">{locLine(l, locale)}</span>
            <h3 className="d3">{l[locale].name}</h3>
            <p className="body-m">{l[locale].summary}</p>
            <div className="feat__specs">
              <SpecsInline l={l} d={d} />
            </div>
            <div className="feat__price">
              <PriceBlock l={l} d={d} />
            </div>
            <div className="feat__acts">
              <Link className="linkline" href={`/${locale}/properties/${l.slug}/`} onClick={onClose}>
                {f.view} <span className="arrow">→</span>
              </Link>
              <SaveButton slug={l.slug} label={f.save} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
