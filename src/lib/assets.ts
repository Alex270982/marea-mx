/* Generated visual assets (Higgsfield CDN). At deploy time, run
   `npm run assets:download` to mirror these into /public/assets and
   flip ASSETS_BASE to "/assets/". */

export const ASSETS_BASE =
  process.env.NEXT_PUBLIC_ASSETS_BASE ||
  "https://d8j0ntlcm91z4.cloudfront.net/user_3EVUjfFb2k95w4JeS0MbCVF86jY/";

const FILES: Record<string, string> = {
  "hero-entry": "hf_20260718_053401_6f17dd62-65ee-4359-b96e-a8ba8007db26",
  "dest-cancun": "hf_20260718_053402_d188c58c-57ec-4520-9986-25bc7df95dc1",
  "dest-playa": "hf_20260718_054924_188dd046-ad4a-4085-a22f-cb4cd5375f21",
  "dest-tulum": "hf_20260718_053404_52777d80-b45b-4a0f-901d-ac0c0664dc7c",
  "l-horizonte": "hf_20260718_053600_e1ba8d32-4362-4659-bb69-491a99a31e77",
  "l-bahia": "hf_20260718_053603_e0d32c5c-1323-428b-bf22-f5c118f95c55",
  "l-sotavento": "hf_20260718_053605_44e5d475-fc54-4694-aa5b-cb2773b7e35b",
  "l-laguna": "hf_20260718_053607_f8ae3756-b988-45a5-aa97-89fddbe5146d",
  "l-quinta": "hf_20260718_053610_b807a0f2-6584-45bc-b551-442cc4673f1c",
  "l-litoral": "hf_20260718_053612_3bb78145-afad-4347-8d81-7a127d4ffb0c",
  "l-umbral": "hf_20260718_053615_07a3a1e5-c611-4a56-b05f-077daa7afc39",
  "l-almar": "hf_20260718_053617_4770fa54-b545-49e7-8f06-cbe14983e45b",
  "l-patio": "hf_20260718_053631_4cea5b82-035f-44a7-aa03-3aad5b084a66",
  "l-jardin": "hf_20260718_053633_16e9b0fd-240b-4918-8cb1-01322c442148",
  "l-alba": "hf_20260718_053635_1ebdac7f-2cbe-4bc8-8de0-9d83f19815ea",
  "l-raiz": "hf_20260718_053637_4f74a8a4-bbdc-4558-86cc-6d58c8d4c3a0",
  "g-living": "hf_20260718_053640_6084d07f-69a2-4af6-ad31-2fa212778a40",
  "g-bedroom": "hf_20260718_053642_c7384ba3-6af4-4a28-a435-534282d23836",
  "g-bath": "hf_20260718_053645_577db5b5-c58e-4370-b4ef-b208fd8aa741",
  "g-pool": "hf_20260718_053655_7f861abf-27f0-4b1d-b874-d51f6eb92277",
  "g-kitchen": "hf_20260718_053656_b50fb06e-5f4c-4ef4-8a89-4e76c606d1f8",
  "advisor-mariana": "hf_20260718_053659_c32b206a-6d41-45dc-a33f-66ba554cdc79",
  "advisor-diego": "hf_20260718_053700_ea9c316a-a749-4652-90c6-db55898adab8",
  concierge: "hf_20260718_053701_072a7b7d-84d5-48b4-8c2e-033c18815b45"
};

export interface AssetEntry {
  raw: string;
  min: string;
}

function buildAssets(): Record<string, AssetEntry> {
  const out: Record<string, AssetEntry> = {};
  const local = ASSETS_BASE.startsWith("/");
  for (const key of Object.keys(FILES)) {
    out[key] = local
      ? { raw: `${ASSETS_BASE}${key}.png`, min: `${ASSETS_BASE}${key}_min.webp` }
      : {
          raw: `${ASSETS_BASE}${FILES[key]}.png`,
          min: `${ASSETS_BASE}${FILES[key]}_min.webp`
        };
  }
  return out;
}

export const ASSETS: Record<string, AssetEntry> = buildAssets();

export const OPENER_VIDEO = ASSETS_BASE.startsWith("/")
  ? `${ASSETS_BASE}openerVideo.mp4`
  : `${ASSETS_BASE}hf_20260718_054943_49351765-f1fa-48ad-b2da-c55cdba478c0.mp4`;

/** Lightweight ~720p encode for the phone scroll-scrub opener. Produced by CI
    (ffmpeg) next to the mirrored assets; it has no CDN counterpart, so when we
    are still pointing at the remote CDN (dev fallback) it is null and phones
    get the settled static hero instead. */
export const OPENER_VIDEO_MOBILE: string | null = ASSETS_BASE.startsWith("/")
  ? `${ASSETS_BASE}openerVideo-mobile.mp4`
  : null;

/* ------------------------------------------------------------------ *
 *  Per-property cinematic scroll-scrub films (detail pages).
 *  Values are remote CDN URLs; the literal FILM_URL_* strings are
 *  placeholders swapped for real https URLs once the encodes land.
 *  CI mirrors each into public/assets/films/<slug>.mp4 (plus a
 *  <slug>-mobile.mp4 encode) via scripts/download-assets.mjs.
 * ------------------------------------------------------------------ */
export const FILM_SOURCES: Record<string, string> = {
  "casa-almar": "https://d8j0ntlcm91z4.cloudfront.net/user_3EVUjfFb2k95w4JeS0MbCVF86jY/hf_20260718_180846_9a580759-4d5a-444f-88a9-9a0ce80555d2.mp4",
  "casa-umbral": "https://d8j0ntlcm91z4.cloudfront.net/user_3EVUjfFb2k95w4JeS0MbCVF86jY/hf_20260718_180913_63999323-bcc9-4ef6-911e-94f38592994f.mp4",
  "penthouse-horizonte": "https://d8j0ntlcm91z4.cloudfront.net/user_3EVUjfFb2k95w4JeS0MbCVF86jY/hf_20260718_180916_d5ab6d33-a214-422b-b248-505dd466b51a.mp4"
};

/** Film sources for a property detail page, or null when the slug has no
    film (or only an unpublished placeholder while on the remote CDN base). */
export function propertyFilm(
  slug: string
): { desktop: string; mobile: string | null } | null {
  const src = FILM_SOURCES[slug];
  if (!src) return null;
  if (ASSETS_BASE.startsWith("/")) {
    /* mirrored build: CI places the encodes next to the other assets,
       regardless of the placeholder state of FILM_SOURCES */
    return {
      desktop: `${ASSETS_BASE}films/${slug}.mp4`,
      mobile: `${ASSETS_BASE}films/${slug}-mobile.mp4`
    };
  }
  /* CDN dev fallback: only a real https URL counts; no mobile encode */
  return src.startsWith("http") ? { desktop: src, mobile: null } : null;
}

/** Remote source files, used by scripts/download-assets.mjs to mirror locally. */
export const ASSET_SOURCE_FILES: Record<string, string> = FILES;
export const OPENER_VIDEO_SOURCE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_3EVUjfFb2k95w4JeS0MbCVF86jY/hf_20260718_054943_49351765-f1fa-48ad-b2da-c55cdba478c0.mp4";

export type AssetKind = "raw" | "min";

export function asset(key: string, kind: AssetKind = "min"): string {
  const a = ASSETS[key];
  return a ? (kind === "raw" ? a.raw : a.min) : "";
}
