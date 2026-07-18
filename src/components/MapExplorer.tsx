"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import { DESTINATIONS, destName, POIS, type Listing } from "@/lib/data";
import { asset } from "@/lib/assets";
import { fmtMapPrice, fmtUSD } from "@/lib/format";

const W = 720;
const H = 830;
const COAST =
  "M600,-10 C560,60 590,120 540,170 C500,210 470,240 450,300 C430,360 420,410 400,470 C380,530 340,570 310,640 C285,695 280,740 250,800 C235,830 230,840 225,860";

const POI_ICONS: Record<string, string> = {
  airport: "M-4,2 L0,-4 L4,2 L0,0.6 Z",
  marina: "M0,-4 L0,4 M-3,1 C-3,3.4 3,3.4 3,1",
  beach: "M-4,3 C-1,0 1,0 4,3 M0,3 L0,-3 M0,-3 C2,-4.6 3.4,-4 4,-2.4",
  wellness: "M0,-4 C2.6,-1.6 2.6,1.6 0,4 C-2.6,1.6 -2.6,-1.6 0,-4"
};

const FONT_DISPLAY = "Bodoni Moda Variable,Bodoni Moda,serif";
const FONT_UI = "Inter Tight Variable,Inter Tight,sans-serif";

const px = (xy: [number, number]) => (xy[0] / 100) * W;
const py = (xy: [number, number]) => (xy[1] / 100) * H;

interface CardState {
  slug: string;
  x: number;
  y: number;
}

interface MapExplorerProps {
  listings: Listing[];
  locale: Locale;
  d: Dict;
  showPois?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

export default function MapExplorer({
  listings,
  locale,
  d,
  showPois = true,
  id,
  className,
  style
}: MapExplorerProps) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [card, setCard] = useState<CardState | null>(null);
  const pois = showPois ? POIS : [];

  const goto = (slug: string) => router.push(`/${locale}/properties/${slug}/`);

  const showCard = (slug: string, el: SVGGElement) => {
    const root = wrapRef.current;
    if (!root) return;
    const r = el.getBoundingClientRect();
    const rr = root.getBoundingClientRect();
    let cx = r.left - rr.left + 18;
    let cy = r.top - rr.top - 10;
    cx = Math.min(cx, rr.width - 260);
    cy = Math.max(10, Math.min(cy, rr.height - 240));
    setCard({ slug, x: cx, y: cy });
  };

  const cardListing = card ? listings.find((l) => l.slug === card.slug) : undefined;

  return (
    <div className={`mapwrap ${className || ""}`} id={id} ref={wrapRef} style={style}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Riviera Maya map" style={{ maxHeight: "100%" }}>
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D7E4E0" />
            <stop offset="1" stopColor="#C4D8D3" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sea)" />
        {/* land mass west of coast */}
        <path d={`${COAST} L-10,860 L-10,-10 Z`} fill="#EAE5DC" />
        <path d={COAST} fill="none" stroke="#9DB3AC" strokeWidth="1.4" />
        {/* offshore contours */}
        <path
          d="M640,-10 C600,80 630,140 575,200 C520,265 500,320 470,420 C440,520 380,590 340,690 C310,760 300,800 285,860"
          fill="none"
          stroke="#AFC6BF"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <path
          d="M690,-10 C650,100 670,170 615,240 C560,315 540,380 505,480 C470,580 420,650 380,740 C355,795 350,830 340,860"
          fill="none"
          stroke="#AFC6BF"
          strokeWidth="0.7"
          opacity="0.45"
        />
        {/* cozumel */}
        <ellipse
          cx="640"
          cy="470"
          rx="34"
          ry="60"
          fill="#E4DFD2"
          stroke="#9DB3AC"
          strokeWidth="1"
          transform="rotate(24 640 470)"
        />
        <text
          x="616"
          y="474"
          fontFamily={FONT_DISPLAY}
          fontStyle="italic"
          fontSize="13"
          fill="#6C7A75"
          transform="rotate(24 640 470)"
        >
          Cozumel
        </text>
        {/* lagoon at cancun */}
        <path
          d="M545,95 C560,105 562,130 552,145 C542,160 528,158 524,140 C520,122 530,88 545,95 Z"
          fill="#D7E4E0"
          stroke="#9DB3AC"
          strokeWidth="0.8"
        />
        {/* destination labels */}
        {DESTINATIONS.map((dst) => (
          <text
            key={dst.slug}
            x={px(dst.mapXY) - 14}
            y={py(dst.mapXY) - 16}
            textAnchor="end"
            fontFamily={FONT_DISPLAY}
            fontSize="19"
            fontWeight="600"
            letterSpacing="1"
            fill="#171A1C"
          >
            {dst[locale].name}
          </text>
        ))}
        {/* pois */}
        {pois.map((p) => (
          <g key={p.id} className="mappoi" transform={`translate(${px(p.mapXY)},${py(p.mapXY)})`}>
            <circle r="9" fill="#F6F3ED" stroke="#9DB3AC" strokeWidth="0.8" />
            <path
              d={POI_ICONS[p.type]}
              fill="none"
              stroke="#2E7774"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="13" y="4" fontFamily={FONT_UI} fontSize="10.5" letterSpacing="0.4" fill="#5E6A66">
              {p[locale]}
            </text>
          </g>
        ))}
        {/* listing markers */}
        {listings.map((l) => {
          const price = fmtMapPrice(l.priceUSD);
          const w = price.length * 7.4 + 18;
          const onKey = (e: KeyboardEvent<SVGGElement>) => {
            if (e.key === "Enter") goto(l.slug);
          };
          return (
            <g
              key={l.slug}
              className="mappt"
              data-slug={l.slug}
              transform={`translate(${px(l.mapXY)},${py(l.mapXY)})`}
              tabIndex={0}
              role="button"
              aria-label={l[locale].name}
              onMouseEnter={(e) => showCard(l.slug, e.currentTarget)}
              onFocus={(e) => showCard(l.slug, e.currentTarget)}
              onMouseLeave={() => setCard(null)}
              onBlur={() => setCard(null)}
              onClick={() => goto(l.slug)}
              onKeyDown={onKey}
            >
              <circle className="mappt__pulse" r="7" fill="#0D605D" />
              <circle className="mappt__dot" r="3.4" fill="#0D605D" stroke="#F6F3ED" strokeWidth="1.2" />
              <g className="mappt__tag" transform={`translate(${l.mapXY[0] > 68 ? -w - 9 : 9},-22)`}>
                <rect width={w} height="21" fill="#171A1C" />
                <text
                  x={w / 2}
                  y="14.5"
                  textAnchor="middle"
                  fontFamily={FONT_UI}
                  fontSize="11.5"
                  fontWeight="600"
                  letterSpacing="0.5"
                  fill="#F6F3ED"
                >
                  {price}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      <div
        className={`mapcard ${card && cardListing ? "is-on" : ""}`}
        style={card ? { left: card.x, top: card.y } : undefined}
      >
        {cardListing && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(cardListing.image)} alt="" />
            <h4>{cardListing[locale].name}</h4>
            <p>
              {cardListing.neighborhood} · {destName(cardListing.destination, locale)}
            </p>
            <b>{fmtUSD(cardListing.priceUSD)}</b>
          </>
        )}
      </div>
    </div>
  );
}
