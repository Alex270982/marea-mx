import Link from "next/link";
import type { Metadata } from "next";
import { dict, isLocale, type Locale } from "@/lib/i18n";
import { LISTINGS } from "@/lib/data";
import Opener from "@/components/Opener";
import SearchBand from "@/components/SearchBand";
import FeaturedRows from "@/components/FeaturedRows";
import DestinationChapters from "@/components/DestinationChapters";
import MapExplorer from "@/components/MapExplorer";
import InvestmentSection from "@/components/InvestmentSection";
import ConciergeCta from "@/components/ConciergeCta";
import SectionMotion from "@/components/SectionMotion";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const en = !isLocale(locale) || locale === "en";
  return {
    title: en
      ? "MAREA · Exceptional properties in the Mexican Caribbean"
      : "MAREA · Propiedades excepcionales en el Caribe Mexicano",
    alternates: { languages: { en: "/en/", es: "/es/" } }
  };
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const d = dict(loc);
  const f = d.featured;
  const dd = d.destinations;
  const m = d.map;

  return (
    <>
      <Opener locale={loc} d={d} />
      <SearchBand locale={loc} d={d} />

      <section className="section shell" id="featured">
        <div className="feat__head">
          <span className="label label--teal">{f.eyebrow}</span>
          <h2 className="d2">{f.title}</h2>
          <p className="body-m">{f.sub}</p>
        </div>
        <FeaturedRows locale={loc} d={d} />
      </section>

      <section className="dest" id="destinos">
        <div className="dest__head">
          <span className="label">{dd.title}</span>
          <h2 className="d2">{dd.sub.split(".")[0]}.</h2>
        </div>
        <DestinationChapters locale={loc} d={d} />
      </section>

      <section className="section shell" id="mapa">
        <div className="mapsec__head">
          <span className="label label--teal">{m.title}</span>
          <h2 className="d2">{m.sub.split(".")[0]}.</h2>
          <p className="body-m">{m.sub.split(".").slice(1).join(".").trim()}</p>
        </div>
        <MapExplorer listings={LISTINGS} locale={loc} d={d} id="homemap" />
        <div className="maplegend">
          <span>
            <i style={{ background: "var(--teal)" }}></i>
            {m.legend_property}
          </span>
          <span>
            <i style={{ background: "#fff", border: "1px solid #9DB3AC" }}></i>
            {m.legend_poi}
          </span>
          <Link className="linkline" style={{ marginLeft: "auto" }} href={`/${loc}/properties/?view=map`}>
            {m.open} <span className="arrow">→</span>
          </Link>
        </div>
      </section>

      <InvestmentSection d={d} />
      <ConciergeCta locale={loc} d={d} />
      <SectionMotion />
    </>
  );
}
