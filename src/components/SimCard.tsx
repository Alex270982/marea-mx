import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { destName, type Listing } from "@/lib/data";
import { asset } from "@/lib/assets";
import { fmtUSD } from "@/lib/format";

export default function SimCard({ l, locale }: { l: Listing; locale: Locale }) {
  return (
    <Link className="simcard" href={`/${locale}/properties/${l.slug}/`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(l.image)} alt={l[locale].name} loading="lazy" />
      <div>
        <span className="loc">
          {l.neighborhood} · {destName(l.destination, locale)}
        </span>
        <h4>{l[locale].name}</h4>
        <b className="num">{fmtUSD(l.priceUSD)}</b>
      </div>
    </Link>
  );
}
