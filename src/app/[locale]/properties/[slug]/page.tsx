import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, isLocale, type Locale } from "@/lib/i18n";
import { LISTINGS, destName, getListing } from "@/lib/data";
import { asset } from "@/lib/assets";
import PropertyDetail from "@/components/PropertyDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const l = getListing(slug);
  if (!l) return { title: "MAREA" };
  const t = l[loc];
  return {
    title: `${t.name} · MAREA`,
    description: t.summary,
    alternates: {
      languages: {
        en: `/en/properties/${slug}/`,
        es: `/es/properties/${slug}/`
      }
    },
    openGraph: {
      title: `${t.name} · MAREA`,
      description: t.summary,
      images: [asset(l.image, "raw")]
    }
  };
}

export default async function PropertyPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const d = dict(loc);
  const l = getListing(slug);
  if (!l) notFound();
  const t = l[loc];

  const listingLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: t.name,
    description: t.summary,
    url: `https://marea.mx/${loc}/properties/${l.slug}/`,
    image: asset(l.image, "raw"),
    inLanguage: loc,
    address: {
      "@type": "PostalAddress",
      addressLocality: destName(l.destination, loc),
      addressRegion: "Quintana Roo",
      addressCountry: "MX"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: l.coords.lat,
      longitude: l.coords.lng
    },
    numberOfRooms: l.beds,
    numberOfBathroomsTotal: l.baths,
    floorSize: { "@type": "QuantitativeValue", value: l.areaM2, unitCode: "MTK" },
    offers: {
      "@type": "Offer",
      price: l.priceUSD,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: { "@type": "RealEstateAgent", name: "MAREA" }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingLd) }}
      />
      <PropertyDetail l={l} locale={loc} d={d} />
    </>
  );
}
