import { Suspense } from "react";
import type { Metadata } from "next";
import { dict, isLocale, type Locale } from "@/lib/i18n";
import SearchPageClient from "@/components/SearchPageClient";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const d = dict(loc);
  return {
    title: `${d.searchpage.title} · MAREA`,
    description: d.map.sub,
    alternates: {
      languages: { en: "/en/properties/", es: "/es/properties/" }
    }
  };
}

export default async function PropertiesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const d = dict(loc);
  return (
    <Suspense fallback={null}>
      <SearchPageClient locale={loc} d={d} />
    </Suspense>
  );
}
