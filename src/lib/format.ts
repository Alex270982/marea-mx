import { FX_MXN, type Dict, type Locale } from "@/lib/i18n";
import { advisorFor, type Listing } from "@/lib/data";

/** "$1,950,000 USD" */
export function fmtUSD(n: number): string {
  return "$" + n.toLocaleString("en-US") + " USD";
}

/** "$1,950,000" without the USD suffix (detail page price blocks). */
export function fmtUSDBare(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

/** "≈ MX$35.9 M" style short MXN conversion. */
export function fmtMXNShort(usd: number): string {
  return "≈ MX$" + ((usd * FX_MXN) / 1e6).toFixed(1) + " M";
}

/** MXN figure alone, e.g. "35.9" (millions). */
export function mxnMillions(usd: number): string {
  return ((usd * FX_MXN) / 1e6).toFixed(1);
}

/** Compact map-tag price: "$1.95M" / "$398K". */
export function fmtMapPrice(n: number): string {
  return n >= 1e6
    ? "$" + (n / 1e6).toFixed(2).replace(/0$/, "") + "M"
    : "$" + Math.round(n / 1000) + "K";
}

export function pricePerM2(l: Listing): string {
  return "$" + Math.round(l.priceUSD / l.areaM2).toLocaleString("en-US");
}

export function whatsappHref(l: Listing, locale: Locale, d: Dict): string {
  const adv = advisorFor(l);
  const msg = d.listing.whatsapp_msg + " " + l[locale].name;
  return (
    "https://wa.me/" + adv.whatsapp.replace(/\D/g, "") + "?text=" + encodeURIComponent(msg)
  );
}

export const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
