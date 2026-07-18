import type { Metadata } from "next";
import { dict, isLocale, type Locale } from "@/lib/i18n";
import SavedPageClient from "@/components/SavedPageClient";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const d = dict(loc);
  return {
    title: `${d.searchpage.saved_title} · MAREA`,
    alternates: {
      languages: { en: "/en/saved/", es: "/es/saved/" }
    }
  };
}

export default async function SavedPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const d = dict(loc);
  return <SavedPageClient locale={loc} d={d} />;
}
