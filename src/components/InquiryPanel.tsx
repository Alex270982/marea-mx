"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { advisorFor, type Listing } from "@/lib/data";
import { asset } from "@/lib/assets";
import { fmtUSDBare, mxnMillions, whatsappHref } from "@/lib/format";
import { useSaved } from "@/components/SavedProvider";

export default function InquiryPanel({ l, locale, d }: { l: Listing; locale: Locale; d: Dict }) {
  const li = d.listing;
  const adv = advisorFor(l);
  const { toast, toggleSave } = useSaved();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [err, setErr] = useState(false);
  const [sent, setSent] = useState(false);

  const focusEmail = () => {
    emailRef.current?.focus();
    emailRef.current?.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  };

  const onShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "MAREA · " + l[locale].name, url });
      } catch {
        /* user dismissed */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast(locale === "es" ? "Enlace copiado" : "Link copied");
      } catch {
        toast(url);
      }
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const good = /.+@.+\..+/.test(emailRef.current?.value || "");
    setErr(!good);
    if (!good) return;
    /* prototype-only stub: wire to an API route or Supabase in production */
    setSent(true);
  };

  return (
    <aside className="pd__side">
      <div className="pd__side__head">
        <div className="pd__side__price num">
          {fmtUSDBare(l.priceUSD)}
          <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-ui)", color: "var(--ink-40)" }}> USD</span>
        </div>
        <div className="pd__side__mxn num">
          {li.price_mxn} ${mxnMillions(l.priceUSD)} M
        </div>
      </div>
      <div className="pd__side__body">
        <button className="cta-solid" onClick={focusEmail}>
          {li.viewing}
        </button>
        <button className="cta-outline" onClick={focusEmail}>
          {li.inquire}
        </button>
        <a className="cta-wa" href={whatsappHref(l, locale, d)} target="_blank" rel="noopener noreferrer">
          WhatsApp ↗
        </a>
        <div style={{ display: "flex", gap: 18, justifyContent: "center", paddingTop: 6 }}>
          <button className="quickbtn" onClick={() => toggleSave(l.slug)}>
            {d.featured.save}
          </button>
          <button className="quickbtn" onClick={onShare}>
            {li.share}
          </button>
          <button
            className="quickbtn"
            onClick={() =>
              toast(
                locale === "es"
                  ? "En producción: PDF generado con los datos de la propiedad."
                  : "In production: a PDF generated from this listing data."
              )
            }
          >
            {li.brochure}
          </button>
        </div>
      </div>
      <div className="pd__advisor">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(adv.image)} alt={adv.name} />
        <div>
          <span className="label label--teal" style={{ fontSize: "0.56rem" }}>
            {li.advisor}
          </span>
          <h4>{adv.name}</h4>
          <p>{adv[locale].role}</p>
        </div>
      </div>
      <form style={{ padding: "4px 26px 24px" }} noValidate onSubmit={onSubmit}>
        <div className={`field ${err ? "has-err" : ""}`} style={{ marginBottom: 12 }}>
          <label htmlFor="pf-email" style={{ color: "var(--ink-60)" }}>
            {d.concierge.form_email}
          </label>
          <input
            id="pf-email"
            type="email"
            ref={emailRef}
            disabled={sent}
            style={{ color: "var(--charcoal)", borderColor: "var(--hairline)" }}
          />
          <span className="err" style={{ color: "#B4543A" }}>
            {d.concierge.form_err_email}
          </span>
        </div>
        <button className="cta-outline" style={{ width: "100%" }} type="submit" disabled={sent}>
          {d.concierge.form_send}
        </button>
        <p
          className="ok"
          style={{
            display: sent ? "block" : "none",
            color: "var(--teal)",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            marginTop: 10
          }}
        >
          {d.concierge.form_ok}
        </p>
      </form>
    </aside>
  );
}
