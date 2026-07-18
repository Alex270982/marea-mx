"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { DESTINATIONS } from "@/lib/data";
import { useSaved } from "@/components/SavedProvider";

type ChipKey = "beach" | "furn" | "inv";

export default function SearchBand({ locale, d }: { locale: Locale; d: Dict }) {
  const s = d.search;
  const router = useRouter();
  const { toast } = useSaved();
  const [mode, setMode] = useState<"buy" | "rent">("buy");
  const [chips, setChips] = useState<Record<ChipKey, boolean>>({
    beach: false,
    furn: false,
    inv: false
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = new URLSearchParams();
    (["dest", "type", "price", "beds", "status"] as const).forEach((k) => {
      const v = fd.get(k);
      if (typeof v === "string" && v) q.set(k, v);
    });
    (Object.keys(chips) as ChipKey[]).forEach((k) => {
      if (chips[k]) q.set(k, "1");
    });
    const qs = q.toString();
    router.push(`/${locale}/properties/${qs ? "?" + qs : ""}`);
  };

  const onMode = (m: "buy" | "rent") => {
    setMode(m);
    if (m === "rent")
      toast(
        locale === "es"
          ? "Las rentas se integran en la siguiente fase del prototipo."
          : "Rentals arrive in the next phase of this prototype."
      );
  };

  return (
    <div className="searchband" id="searchband">
      <div className="searchband__inner">
        <div className="searchband__top">
          <div className="mode" role="tablist">
            <button
              className={mode === "buy" ? "is-on" : ""}
              role="tab"
              aria-selected={mode === "buy"}
              onClick={() => onMode("buy")}
            >
              {s.buy}
            </button>
            <button
              className={mode === "rent" ? "is-on" : ""}
              role="tab"
              aria-selected={mode === "rent"}
              onClick={() => onMode("rent")}
            >
              {s.rent}
            </button>
          </div>
          <div className="searchband__hint">{s.placeholder_hint}</div>
        </div>
        <form className="searchband__fields" onSubmit={onSubmit}>
          <div className="sfield">
            <label htmlFor="f-dest">{s.destination}</label>
            <select id="f-dest" name="dest" defaultValue="">
              <option value="">{s.any_destination}</option>
              {DESTINATIONS.map((dst) => (
                <option key={dst.slug} value={dst.slug}>
                  {dst[locale].name}
                </option>
              ))}
            </select>
          </div>
          <div className="sfield">
            <label htmlFor="f-type">{s.type}</label>
            <select id="f-type" name="type" defaultValue="">
              <option value="">{s.any_type}</option>
              {Object.keys(d.types).map((k) => (
                <option key={k} value={k}>
                  {d.types[k]}
                </option>
              ))}
            </select>
          </div>
          <div className="sfield">
            <label htmlFor="f-price">{s.price}</label>
            <select id="f-price" name="price" defaultValue="">
              <option value="">{s.any_price}</option>
              <option value="0-500000">&lt; $500K</option>
              <option value="500000-1000000">$500K – $1M</option>
              <option value="1000000-2500000">$1M – $2.5M</option>
              <option value="2500000-99000000">&gt; $2.5M</option>
            </select>
          </div>
          <div className="sfield">
            <label htmlFor="f-beds">{s.beds}</label>
            <select id="f-beds" name="beds" defaultValue="">
              <option value="">{s.any_beds}</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div className="sfield">
            <label htmlFor="f-status">{s.status}</label>
            <select id="f-status" name="status" defaultValue="">
              <option value="">{s.any_status}</option>
              {Object.keys(d.status).map((k) => (
                <option key={k} value={k}>
                  {d.status[k]}
                </option>
              ))}
            </select>
          </div>
          <button className="searchband__go" type="submit">
            {s.submit} <span className="arrow">→</span>
          </button>
        </form>
        <div className="searchband__refine">
          {(
            [
              ["beach", s.beachfront],
              ["furn", s.furnished],
              ["inv", s.investment]
            ] as Array<[ChipKey, string]>
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={`chip ${chips[k] ? "is-on" : ""}`}
              onClick={() => setChips((c) => ({ ...c, [k]: !c[k] }))}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="chip chip--map"
            onClick={() => router.push(`/${locale}/properties/?view=map`)}
          >
            {s.map}{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
