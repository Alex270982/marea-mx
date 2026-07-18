import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/inter-tight/wght-italic.css";
import "@fontsource-variable/bodoni-moda/opsz.css";
import "@fontsource-variable/bodoni-moda/opsz-italic.css";
import "../globals.css";
import { LOCALES, dict, isLocale, type Locale } from "@/lib/i18n";
import { SavedProvider } from "@/components/SavedProvider";
import ClientShell from "@/components/ClientShell";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23171A1C'/%3E%3Cpath d='M10 44 L10 22 L22 36 L32 22 L42 36 L54 22 L54 44' fill='none' stroke='%23EAE5DC' stroke-width='3.4'/%3E%3C/svg%3E";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const en = loc === "en";
  const title = en
    ? "MAREA · Exceptional properties in the Mexican Caribbean"
    : "MAREA · Propiedades excepcionales en el Caribe Mexicano";
  const description = en
    ? "Curated homes, residences and investment opportunities in Cancún, Playa del Carmen and Tulum. Propiedades excepcionales en el Caribe Mexicano."
    : "Una selección de casas, residencias y oportunidades de inversión en Cancún, Playa del Carmen y Tulum. Exceptional properties in the Mexican Caribbean.";
  return {
    metadataBase: new URL("https://marea.mx"),
    title,
    description,
    icons: { icon: FAVICON },
    alternates: {
      languages: { en: "/en/", es: "/es/" }
    },
    openGraph: {
      title: en
        ? "MAREA · Exceptional properties. Extraordinary places."
        : "MAREA · Propiedades excepcionales. Lugares extraordinarios.",
      description: en
        ? "Curated homes, residences and investment opportunities in Cancún, Playa del Carmen and Tulum."
        : "Una selección de casas, residencias y oportunidades de inversión en Cancún, Playa del Carmen y Tulum.",
      type: "website"
    }
  };
}

const AGENT_LD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "MAREA",
  slogan: "Exceptional properties. Extraordinary places.",
  areaServed: ["Cancún", "Playa del Carmen", "Tulum"],
  knowsLanguage: ["en", "es"]
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : "en";
  const d = dict(loc);
  return (
    <html lang={loc}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(AGENT_LD) }}
        />
        <SavedProvider locale={loc}>
          <ClientShell />
          <Nav locale={loc} d={d} />
          {children}
          <Footer locale={loc} d={d} />
        </SavedProvider>
      </body>
    </html>
  );
}
