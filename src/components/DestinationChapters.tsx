import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { DESTINATIONS, LISTINGS } from "@/lib/data";
import { asset } from "@/lib/assets";

const NUMS = ["01", "02", "03"];

export default function DestinationChapters({ locale, d }: { locale: Locale; d: Dict }) {
  const dd = d.destinations;
  return (
    <>
      {DESTINATIONS.map((dst, i) => {
        const loc = dst[locale];
        const count = LISTINGS.filter((l) => l.destination === dst.slug).length;
        return (
          <article className="dest__chapter" key={dst.slug}>
            <div className="dest__media" data-plx>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(dst.image, "raw")} alt={loc.name} loading="lazy" />
              <span className="dest__num">{NUMS[i]}</span>
            </div>
            <div className="dest__body">
              <span className="label">
                {dst.coords.lat.toFixed(4)}° N · {Math.abs(dst.coords.lng).toFixed(4)}° W
              </span>
              <h3 className="dest__name d2">{loc.name}</h3>
              <p className="dest__tagline">{loc.tagline}</p>
              <p className="dest__story">{loc.story}</p>
              <ul className="dest__facts">
                {loc.highlights.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="dest__count">
                <b className="num">{count}</b>
                <span>{dd.available}</span>
              </div>
              <Link className="linkline linkline--light" href={`/${locale}/properties/?dest=${dst.slug}`}>
                {dd.explore} {loc.name} <span className="arrow">→</span>
              </Link>
            </div>
          </article>
        );
      })}
    </>
  );
}
