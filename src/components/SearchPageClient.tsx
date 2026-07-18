"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { DESTINATIONS, LISTINGS, getListing, type Listing } from "@/lib/data";
import {
  DESKTOP_MOTION_MEDIA,
  loadGsap,
  prefersReducedMotion,
  type GsapMatchMedia
} from "@/lib/motion";
import { useSaved } from "@/components/SavedProvider";
import PropertyRow from "@/components/PropertyRow";
import QuickView from "@/components/QuickView";
import CompareBar from "@/components/CompareBar";
import MapPanel from "@/components/MapPanel";
import SimCard from "@/components/SimCard";

interface Query {
  dest?: string;
  type?: string;
  price?: string;
  beds?: string;
  status?: string;
  beach?: string;
  furn?: string;
  inv?: string;
  sort?: string;
  view?: string;
}

const QUERY_KEYS: Array<keyof Query> = [
  "dest",
  "type",
  "price",
  "beds",
  "status",
  "beach",
  "furn",
  "inv",
  "sort",
  "view"
];

function filterListings(q: Query): Listing[] {
  let out = LISTINGS.slice();
  if (q.dest) out = out.filter((l) => l.destination === q.dest);
  if (q.type) out = out.filter((l) => l.type === q.type);
  if (q.beds) out = out.filter((l) => l.beds >= Number(q.beds));
  if (q.status) out = out.filter((l) => l.status === q.status);
  if (q.beach) out = out.filter((l) => l.beachfront);
  if (q.furn) out = out.filter((l) => l.furnished);
  if (q.inv) out = out.filter((l) => l.label === "investment");
  if (q.price) {
    const [a, b] = q.price.split("-").map(Number);
    out = out.filter((l) => l.priceUSD >= a && l.priceUSD <= b);
  }
  const sort = q.sort || "rel";
  if (sort === "price_a") out.sort((a, b) => a.priceUSD - b.priceUSD);
  if (sort === "price_d") out.sort((a, b) => b.priceUSD - a.priceUSD);
  if (sort === "size") out.sort((a, b) => b.areaM2 - a.areaM2);
  if (sort === "new")
    out.sort(
      (a, b) => Number(b.status === "preconstruction") - Number(a.status === "preconstruction")
    );
  return out;
}

export default function SearchPageClient({ locale, d }: { locale: Locale; d: Dict }) {
  const sp = d.searchpage;
  const s = d.search;
  const m = d.map;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { recent, toast } = useSaved();
  const [qv, setQv] = useState<string | null>(null);

  const q = useMemo(() => {
    const out: Query = {};
    QUERY_KEYS.forEach((k) => {
      const v = searchParams.get(k);
      if (v) out[k] = v;
    });
    return out;
  }, [searchParams]);

  const results = useMemo(() => filterListings(q), [q]);
  const view = q.view || "list";

  const update = (patch: Partial<Record<keyof Query, string | null>>) => {
    const next = new URLSearchParams();
    QUERY_KEYS.forEach((k) => {
      const patched = k in patch ? patch[k] : q[k];
      if (patched) next.set(k, patched);
    });
    const qs = next.toString();
    router.replace(`/${locale}/properties/${qs ? "?" + qs : ""}`, { scroll: false });
  };

  /* row rise on results change: desktop only, phones render final state */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let mm: GsapMatchMedia | null = null;
    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION_MEDIA, () => {
        document.querySelectorAll<HTMLElement>(".srow").forEach((row) => {
          gsap.fromTo(
            row,
            { y: 30 },
            { y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 92%" } }
          );
        });
      });
    })();
    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, [results]);

  const filterSelect = (
    name: keyof Query,
    label: string,
    options: Array<[string, string]>,
    current: string | undefined
  ) => (
    <div className="sortsel">
      <label className="label" style={{ letterSpacing: "0.16em" }} htmlFor={`sf-${name}`}>
        {label}
      </label>
      <select
        id={`sf-${name}`}
        value={current || ""}
        onChange={(e) => update({ [name]: e.target.value || null })}
      >
        {options.map(([v, txt]) => (
          <option key={v || "any"} value={v}>
            {txt}
          </option>
        ))}
      </select>
    </div>
  );

  const recentItems = recent
    .slice(0, 3)
    .map((slug) => getListing(slug))
    .filter((l): l is Listing => Boolean(l));

  return (
    <>
      <main className="page">
        <div className="sp__bar">
          <div className="sp__count">
            <b className="num">{results.length}</b>
            <span>{sp.results}</span>
            <h1 className="label" style={{ marginLeft: 16, color: "var(--ink-40)" }}>
              {sp.title} · MAREA
            </h1>
          </div>
          <div className="sp__tools">
            <div className="viewtoggle" role="group">
              <button
                className={view === "list" ? "is-on" : ""}
                onClick={() => update({ view: null })}
              >
                {m.list}
              </button>
              <button
                className={view === "split" ? "is-on" : ""}
                onClick={() => update({ view: "split" })}
              >
                {m.split}
              </button>
              <button className={view === "map" ? "is-on" : ""} onClick={() => update({ view: "map" })}>
                {m.mapv}
              </button>
            </div>
            <div className="sortsel">
              <span>{sp.sort}</span>
              <select value={q.sort || "rel"} onChange={(e) => update({ sort: e.target.value })}>
                <option value="rel">{sp.sort_rel}</option>
                <option value="new">{sp.sort_new}</option>
                <option value="price_a">{sp.sort_price_a}</option>
                <option value="price_d">{sp.sort_price_d}</option>
                <option value="size">{sp.sort_size}</option>
              </select>
            </div>
            <button className="linkline" onClick={() => toast(sp.alerts_ok)}>
              {sp.alerts}
            </button>
          </div>
        </div>
        <div className="sp__filters">
          {filterSelect(
            "dest",
            s.destination,
            [["", s.any_destination] as [string, string]].concat(
              DESTINATIONS.map((dst) => [dst.slug, dst[locale].name] as [string, string])
            ),
            q.dest
          )}
          {filterSelect(
            "type",
            s.type,
            [["", s.any_type] as [string, string]].concat(
              Object.keys(d.types).map((k) => [k, d.types[k]] as [string, string])
            ),
            q.type
          )}
          {filterSelect(
            "price",
            s.price,
            [
              ["", s.any_price],
              ["0-500000", "< $500K"],
              ["500000-1000000", "$500K – $1M"],
              ["1000000-2500000", "$1M – $2.5M"],
              ["2500000-99000000", "> $2.5M"]
            ],
            q.price
          )}
          {filterSelect(
            "beds",
            s.beds,
            [
              ["", s.any_beds],
              ["1", "1+"],
              ["2", "2+"],
              ["3", "3+"],
              ["4", "4+"]
            ],
            q.beds
          )}
          {filterSelect(
            "status",
            s.status,
            [["", s.any_status] as [string, string]].concat(
              Object.keys(d.status).map((k) => [k, d.status[k]] as [string, string])
            ),
            q.status
          )}
          {(
            [
              ["beach", s.beachfront],
              ["furn", s.furnished],
              ["inv", s.investment]
            ] as Array<[keyof Query, string]>
          ).map(([k, label]) => (
            <button
              key={k}
              className={`chip ${q[k] ? "is-on" : ""}`}
              onClick={() => update({ [k]: q[k] ? null : "1" })}
            >
              {label}
            </button>
          ))}
          <button
            className="linkline"
            style={{ marginLeft: "auto" }}
            onClick={() => router.replace(`/${locale}/properties/`, { scroll: false })}
          >
            {sp.clear}
          </button>
        </div>
        <div className={`sp__layout ${view === "split" ? "is-split" : view === "map" ? "is-map" : ""}`}>
          <div className="sp__list">
            {results.length ? (
              results.map((l) => (
                <PropertyRow key={l.slug} l={l} locale={locale} d={d} onQuickView={setQv} />
              ))
            ) : (
              <div className="sp__empty">
                <h3>{sp.empty_t}</h3>
                <p>{sp.empty_d}</p>
                <button
                  className="cta-outline"
                  onClick={() => router.replace(`/${locale}/properties/`, { scroll: false })}
                >
                  {sp.clear}
                </button>
              </div>
            )}
            {recentItems.length > 0 && (
              <div style={{ paddingTop: 46 }}>
                <span className="label label--teal">{sp.recently}</span>
                <div className="simgrid" style={{ marginTop: 20 }}>
                  {recentItems.map((l) => (
                    <SimCard key={l.slug} l={l} locale={locale} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <aside className="sp__map">
            <MapPanel listings={results} locale={locale} d={d} />
          </aside>
        </div>
      </main>
      <CompareBar locale={locale} d={d} />
      <QuickView slug={qv} locale={locale} d={d} onClose={() => setQv(null)} />
    </>
  );
}
