import type { Dict, Locale } from "@/lib/i18n";
import { destName, type Listing } from "@/lib/data";
import { fmtMXNShort, fmtUSD } from "@/lib/format";

/** Inline spec row shared by featured rows, search rows and quick view. */
export function SpecsInline({ l, d }: { l: Listing; d: Dict }) {
  const s = d.listing;
  return (
    <>
      <span>
        <b>{l.beds}</b> {s.beds.toLowerCase()}
      </span>
      <span>
        <b>{l.baths}</b> {s.baths.toLowerCase()}
      </span>
      <span>
        <b>{l.areaM2}</b> m²
      </span>
      <span>{d.types[l.type] || l.type}</span>
      <span>{d.status[l.status] || l.status}</span>
      {l.yield ? (
        <span style={{ color: "var(--teal)" }}>
          <b>{l.yield}%</b> {d.featured.yield_est}*
        </span>
      ) : null}
    </>
  );
}

/** Price block: optional "From" prefix, USD figure, short MXN conversion. */
export function PriceBlock({ l, d }: { l: Listing; d: Dict }) {
  return (
    <>
      {l.status === "preconstruction" ? (
        <>
          <span
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-40)"
            }}
          >
            {d.featured.from}
          </span>{" "}
        </>
      ) : null}
      <span className="usd num">{fmtUSD(l.priceUSD)}</span>
      <span className="mxn num">{fmtMXNShort(l.priceUSD)}</span>
    </>
  );
}

export function locLine(l: Listing, locale: Locale): string {
  return `${l.neighborhood} · ${destName(l.destination, locale)}`;
}
