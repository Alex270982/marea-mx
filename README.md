# MAREA

Luxury real-estate prototype for the Mexican Caribbean (Cancún, Playa del Carmen, Tulum), ported from a single-page prototype into a production-quality Next.js 15 App Router codebase with full static export. Bilingual (EN/ES), GSAP + Lenis motion, scroll-scrubbed cinematic opener.

## Setup

```bash
npm i
npm run dev        # http://localhost:3000 (redirects to /en/)
npm run build      # static export into out/
```

The exported `out/` folder is a plain static site: open it with any static file server.

## Routes

| Route | Page |
| --- | --- |
| `/` | client-side redirect to `/en/` |
| `/{en,es}/` | home: cinematic opener, concierge search band, featured rows, destination chapters, SVG map explorer, investment, concierge CTA |
| `/{en,es}/properties/` | search: filters/sort/view synced to URL query params, list/split/map views, compare, quick view |
| `/{en,es}/properties/{slug}/` | detail: gallery + lightbox, specs, amenities, projection table, location map, similar residences, sticky inquiry aside, mobile action bar |
| `/{en,es}/saved/` | saved residences (localStorage-backed) |

All locale and listing routes are pre-rendered via `generateStaticParams` (2 locales x 12 listings).

## Architecture

- `src/lib/data.ts` is the whole data layer: typed `Listing` / `Destination` / `Advisor` / `Poi` interfaces plus the sample data. Swapping in a CMS or Supabase later means replacing this one file (or making its exports async and fetching in the server pages); nothing else needs to change.
- `src/lib/i18n.ts` holds the complete EN/ES dictionary (`Dict` type) and `FX_MXN`.
- `src/lib/assets.ts` maps asset keys to CDN URLs. `ASSETS_BASE` is the single switch between remote CDN and local mirror.
- `src/lib/format.ts` price/number formatting helpers, WhatsApp deep links.
- `src/components/` presentational + interactive components. Interactive ones are `"use client"`; GSAP, ScrollTrigger and Lenis are imported only inside `useEffect` (SSR-safe), with reduced-motion guards throughout.
- `src/components/SavedProvider.tsx` React context for saved / compare / recently-viewed, persisted to `localStorage`.
- `src/components/Opener.tsx` the scroll-driven opener: XHR blob fetch with loader progress, rAF-lerped video scrub over a 460vh section, chapter captions, word-reveal statement, skip button, and a `sessionStorage` flag (`marea-intro-seen`) that collapses the opener on return visits. Video only loads on desktop widths without reduced-motion/save-data.
- `src/app/globals.css` Tailwind v4 (`@import "tailwindcss";`) followed by the ported MAREA design system, which is the styling source of truth.
- Fonts are self-hosted via `@fontsource-variable/bodoni-moda` and `@fontsource-variable/inter-tight` (no Google Fonts CDN).

## SEO

Per-page `generateMetadata` with EN/ES titles/descriptions and `alternates.languages` hreflang between `/en` and `/es`. The locale layout embeds a `RealEstateAgent` JSON-LD block; every detail page embeds a `RealEstateListing` block (prices as `offers`) built from the listing data.

## Mirroring assets locally

Images and the opener video are served from a CDN. To self-host them:

```bash
npm run assets:download   # network required; downloads into public/assets/
```

Then flip `ASSETS_BASE` in `src/lib/assets.ts` to `"/assets/"` and rebuild.

## Deployment

`output: "export"` produces a fully static `out/` with trailing slashes, so it works on any static host:

- **Vercel / Netlify**: point at the repo, build command `npm run build`, output `out/`.
- **GitHub Pages**: publish `out/` (add a `basePath` in `next.config.mjs` if serving from a subpath).
- Any S3/CDN/nginx bucket: upload `out/` as-is.

## Notes

- The inquiry and concierge forms are prototype-only stubs: they validate and show the success state locally. Wire their submit handlers to an API route or Supabase table when a backend exists (see `ConciergeCta.tsx` and `InquiryPanel.tsx`, marked with comments).
- All listing data, prices, yields and projections are illustrative sample data, not real inventory.
