"use client";

import { useState, type ReactNode } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { destName, getListing, type Listing } from "@/lib/data";
import { asset } from "@/lib/assets";
import { fmtUSD, pricePerM2 } from "@/lib/format";
import { useSaved } from "@/components/SavedProvider";
import Modal from "@/components/Modal";

export default function CompareBar({ locale, d }: { locale: Locale; d: Dict }) {
  const sp = d.searchpage;
  const li = d.listing;
  const { compare, clearCompare } = useSaved();
  const [open, setOpen] = useState(false);
  const items = compare
    .map((s) => getListing(s))
    .filter((l): l is Listing => Boolean(l));
  const n = items.length;

  const rows: Array<[string, (l: Listing) => ReactNode]> = [
    [
      "",
      (l) => (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(l.image)} alt="" />
          <h4>{l[locale].name}</h4>
          <p
            style={{
              fontSize: "0.7rem",
              color: "var(--ink-40)",
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}
          >
            {l.neighborhood} · {destName(l.destination, locale)}
          </p>
        </>
      )
    ],
    [li.price_usd, (l) => <b className="num">{fmtUSD(l.priceUSD)}</b>],
    [li.beds, (l) => l.beds],
    [li.baths, (l) => l.baths],
    [li.interior, (l) => `${l.areaM2} m²`],
    [`${li.price_usd} / m²`, (l) => pricePerM2(l)],
    [d.search.status, (l) => d.status[l.status] || l.status],
    [d.search.beachfront, (l) => (l.beachfront ? "✓" : "·")],
    [d.search.furnished, (l) => (l.furnished ? "✓" : "·")],
    [`${d.featured.yield_est}*`, (l) => (l.yield ? `${l.yield}%` : "·")],
    [li.fees, (l) => `$${l.feesUSDmo}/mo`]
  ];

  return (
    <>
      <div className={`comparebar ${n > 0 ? "is-on" : ""}`}>
        {n > 0 && (
          <>
            <span>
              {sp.comparing}: {n}
            </span>
            <button onClick={() => setOpen(true)}>{sp.compare} →</button>
            <button onClick={clearCompare}>✕</button>
          </>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} closeLabel={d.misc.close}>
        <div style={{ padding: "26px 26px 8px" }}>
          <span className="label label--teal">{sp.compare}</span>
        </div>
        <table className="cmp-table">
          <tbody>
            {rows.map(([label, fn], ri) => (
              <tr key={ri}>
                <th>{label}</th>
                {items.map((l) => (
                  <td key={l.slug}>{fn(l)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ padding: "14px 26px 22px", fontSize: "0.7rem", color: "var(--ink-40)" }}>
          {d.invest.disclaimer}
        </p>
      </Modal>
    </>
  );
}
