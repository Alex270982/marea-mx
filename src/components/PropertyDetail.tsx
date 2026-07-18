"use client";

import { useEffect, useRef, useState } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import {
  AMENITIES,
  destName,
  galleryKeys,
  similarListings,
  type Listing
} from "@/lib/data";
import { asset } from "@/lib/assets";
import { fmtUSDBare, pricePerM2, whatsappHref } from "@/lib/format";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";
import { useSaved } from "@/components/SavedProvider";
import MapExplorer from "@/components/MapExplorer";
import InquiryPanel from "@/components/InquiryPanel";
import Lightbox from "@/components/Lightbox";
import SimCard from "@/components/SimCard";

export default function PropertyDetail({
  l,
  locale,
  d
}: {
  l: Listing;
  locale: Locale;
  d: Dict;
}) {
  const li = d.listing;
  const loc = l[locale];
  const { pushRecent, toast } = useSaved();
  const gallery = galleryKeys(l);
  const lbImgs = gallery.map((g) => asset(g, "raw"));
  const similar = similarListings(l);
  const amenities = AMENITIES[l.slug] ? AMENITIES[l.slug][locale] : [];
  const grossY = l.yield ? Math.round((l.priceUSD * l.yield) / 100) : 0;
  const [lbIndex, setLbIndex] = useState<number | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const heroImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    pushRecent(l.slug);
  }, [l.slug, pushRecent]);

  /* hero settle + section rises */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cancelled = false;
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const { gsap } = await loadGsap();
      if (cancelled) return;
      ctx = gsap.context(() => {
        if (heroImgRef.current) {
          gsap.fromTo(heroImgRef.current, { scale: 1.08 }, { scale: 1, duration: 1.6, ease: "power3.out" });
        }
        document.querySelectorAll<HTMLElement>(".pd__main > section").forEach((sec) => {
          gsap.fromTo(
            sec,
            { y: 34 },
            { y: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: sec, start: "top 88%" } }
          );
        });
      }, mainRef.current || undefined);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [l.slug]);

  const tourToast = () =>
    toast(
      locale === "es"
        ? "El film y recorrido 3D se integran con el material del desarrollador."
        : "Film and 3D tour connect to developer material in production."
    );

  return (
    <>
      <main className="page" style={{ paddingTop: 0 }} ref={mainRef}>
        <section className="pd__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(l.image, "raw")} alt={loc.name} ref={heroImgRef} />
          <div className="pd__heromain">
            <div>
              <span className="label">
                {l.neighborhood} · {destName(l.destination, locale)} · {d.types[l.type] || l.type}
              </span>
              <h1 className="d1" style={{ fontSize: "clamp(2.4rem,5.4vw,4.6rem)" }}>
                {loc.name}
              </h1>
            </div>
            <div className="pd__gallerybtns">
              <button className="btn-ghost" onClick={() => setLbIndex(0)}>
                {li.gallery} · {gallery.length}
              </button>
              <button className="btn-ghost" onClick={tourToast}>
                {li.video} / {li.tour}
              </button>
            </div>
          </div>
        </section>

        <div className="pd__layout">
          <div className="pd__main">
            <section>
              <span className="label label--teal">{li.overview}</span>
              <h2>{loc.summary}</h2>
              <p className="pd__desc">{loc.description}</p>
            </section>

            <section>
              <span className="label label--teal">{li.specs}</span>
              <dl className="specgrid">
                <div>
                  <dt>{li.price_usd}</dt>
                  <dd className="num">{fmtUSDBare(l.priceUSD)}</dd>
                </div>
                <div>
                  <dt>{li.beds}</dt>
                  <dd>{l.beds}</dd>
                </div>
                <div>
                  <dt>{li.baths}</dt>
                  <dd>{l.baths}</dd>
                </div>
                <div>
                  <dt>{li.interior}</dt>
                  <dd>
                    {l.areaM2}
                    <small>m²</small>
                  </dd>
                </div>
                <div>
                  <dt>
                    {li.price_usd} {li.per_m2}
                  </dt>
                  <dd className="num">{pricePerM2(l)}</dd>
                </div>
                <div>
                  <dt>{li.fees}</dt>
                  <dd className="num">
                    ${l.feesUSDmo}
                    <small>/ mo*</small>
                  </dd>
                </div>
                <div>
                  <dt>{d.search.status}</dt>
                  <dd style={{ fontSize: "1rem" }}>{d.status[l.status] || l.status}</dd>
                </div>
                <div>
                  <dt>{li.delivery}</dt>
                  <dd style={{ fontSize: "1rem" }}>
                    {l.delivery || (locale === "es" ? "Inmediata" : "Immediate")}
                  </dd>
                </div>
                <div>
                  <dt>{d.featured.yield_est}</dt>
                  <dd style={{ color: "var(--teal)" }}>{l.yield ? `${l.yield}%*` : "–"}</dd>
                </div>
              </dl>
            </section>

            <section>
              <span className="label label--teal">{li.gallery}</span>
              <div className="gallery">
                {gallery.map((g, i) => (
                  <figure key={g} onClick={() => setLbIndex(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(g, "raw")} alt={`${loc.name} ${i + 1}`} loading={i > 1 ? "lazy" : "eager"} />
                  </figure>
                ))}
              </div>
            </section>

            <section>
              <span className="label label--teal">{li.amenities}</span>
              <ul className="amen">
                {amenities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </section>

            {loc.architecture && (
              <section>
                <span className="label label--teal">{li.architecture}</span>
                <p
                  className="pd__desc"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.25rem",
                    lineHeight: 1.6,
                    color: "var(--charcoal)",
                    maxWidth: "56ch"
                  }}
                >
                  {loc.architecture}
                </p>
              </section>
            )}

            {l.yield && (
              <section>
                <span className="label label--teal">{li.projection}</span>
                <div className="pd__projection">
                  <table>
                    <tbody>
                      <tr>
                        <td>{locale === "es" ? "Renta bruta anual proyectada" : "Projected gross annual rent"}</td>
                        <td className="num">${grossY.toLocaleString("en-US")}</td>
                      </tr>
                      <tr>
                        <td>{locale === "es" ? "Ocupación asumida" : "Assumed occupancy"}</td>
                        <td className="num">62%</td>
                      </tr>
                      <tr>
                        <td>
                          {locale === "es" ? "Costos operativos y administración" : "Operating costs and management"}
                        </td>
                        <td className="num">-35%</td>
                      </tr>
                      <tr>
                        <td>
                          <b>{locale === "es" ? "Rendimiento neto estimado" : "Estimated net yield"}</b>
                        </td>
                        <td className="num" style={{ color: "var(--teal)" }}>
                          <b>{(l.yield * 0.65).toFixed(1)}%</b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="note">* {li.proj_note}</p>
                </div>
              </section>
            )}

            <section>
              <span className="label label--teal">{li.location}</span>
              <MapExplorer
                listings={[l]}
                locale={locale}
                d={d}
                style={{ maxHeight: 460, overflow: "hidden" }}
              />
            </section>

            <section>
              <span className="label label--teal">{li.similar}</span>
              <div className="simgrid" style={{ marginTop: 20 }}>
                {similar.map((s) => (
                  <SimCard key={s.slug} l={s} locale={locale} />
                ))}
              </div>
            </section>
          </div>

          <InquiryPanel l={l} locale={locale} d={d} />
        </div>

        <div className="pd__mobilebar">
          <span className="price num">{fmtUSDBare(l.priceUSD)}</span>
          <a className="cta-wa" href={whatsappHref(l, locale, d)} target="_blank" rel="noopener noreferrer">
            WA ↗
          </a>
          <button
            className="cta-solid"
            onClick={() => {
              document.getElementById("pf-email")?.focus();
              document.getElementById("pf-email")?.scrollIntoView({
                block: "center",
                behavior: prefersReducedMotion() ? "auto" : "smooth"
              });
            }}
          >
            {li.inquire}
          </button>
        </div>
      </main>
      <Lightbox
        images={lbImgs}
        caption={loc.name}
        ariaLabel={li.gallery}
        closeLabel={d.misc.close}
        index={lbIndex}
        onIndex={setLbIndex}
        onClose={() => setLbIndex(null)}
      />
    </>
  );
}
