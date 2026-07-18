"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import AssetImg from "@/components/AssetImg";
import { useSaved } from "@/components/SavedProvider";

type FieldKey = "name" | "email" | "msg";

export default function ConciergeCta({ locale, d }: { locale: Locale; d: Dict }) {
  const c = d.concierge;
  const { toast } = useSaved();
  const [errors, setErrors] = useState<Record<FieldKey, boolean>>({
    name: false,
    email: false,
    msg: false
  });
  const [sent, setSent] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const onConsult = () => {
    nameRef.current?.focus();
    toast(
      locale === "es"
        ? "Cuéntanos y agendamos tu consulta."
        : "Tell us a little and we will schedule your consultation."
    );
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const msg = String(fd.get("msg") || "");
    const next: Record<FieldKey, boolean> = {
      name: !(name.trim().length > 1),
      email: !/.+@.+\..+/.test(email),
      msg: !(msg.trim().length > 5)
    };
    setErrors(next);
    if (next.name || next.email || next.msg) return;
    /* prototype-only stub: wire to an API route or Supabase in production */
    setSent(true);
  };

  return (
    <section className="concierge" id="concierge">
      <div className="concierge__bg">
        <AssetImg k="concierge" kind="raw" alt="" loading="lazy" />
      </div>
      <div className="concierge__inner">
        <div className="concierge__copy">
          <h2 className="d2">
            <em>{c.title}</em>
          </h2>
          <p className="body-l">{c.sub}</p>
          <div className="concierge__ctas">
            <button className="cta-frame" onClick={onConsult}>
              {c.cta_consult}
            </button>
            <div className="concierge__alt">
              <a className="cta-bare" href="https://wa.me/529840000001" target="_blank" rel="noopener noreferrer">
                {c.cta_whatsapp} ↗
              </a>
              <a className="cta-bare" href="mailto:advisors@marea.mx">
                {c.cta_email} ↗
              </a>
              <button className="cta-bare" onClick={onConsult}>
                {c.cta_shortlist}
              </button>
            </div>
          </div>
        </div>
        <form className="concierge__form" noValidate onSubmit={onSubmit}>
          <span className="label">MAREA Concierge</span>
          <div className={`field ${errors.name ? "has-err" : ""}`}>
            <label htmlFor="cf-name">{c.form_name}</label>
            <input id="cf-name" name="name" type="text" autoComplete="name" ref={nameRef} disabled={sent} />
            <span className="err">{c.form_err_name}</span>
          </div>
          <div className={`field ${errors.email ? "has-err" : ""}`}>
            <label htmlFor="cf-email">{c.form_email}</label>
            <input id="cf-email" name="email" type="email" autoComplete="email" disabled={sent} />
            <span className="err">{c.form_err_email}</span>
          </div>
          <div className={`field ${errors.msg ? "has-err" : ""}`}>
            <label htmlFor="cf-msg">{c.form_msg}</label>
            <textarea id="cf-msg" name="msg" disabled={sent} />
            <span className="err">{c.form_err_msg}</span>
          </div>
          <button className="cta-frame" type="submit" disabled={sent}>
            {c.form_send}
          </button>
          <p className="ok" style={sent ? { display: "block" } : undefined}>
            {c.form_ok}
          </p>
        </form>
      </div>
    </section>
  );
}
