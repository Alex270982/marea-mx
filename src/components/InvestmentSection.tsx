import type { Dict } from "@/lib/i18n";
import AssetImg from "@/components/AssetImg";

export default function InvestmentSection({ d }: { d: Dict }) {
  const iv = d.invest;
  return (
    <section className="invest section" id="invest">
      <div className="shell invest__grid">
        <div className="invest__intro">
          <span className="label label--teal">{iv.eyebrow}</span>
          <h2 className="d2">{iv.title}</h2>
          <AssetImg k="g-pool" kind="raw" alt="" loading="lazy" />
        </div>
        <div>
          <div className="invest__list">
            {iv.blocks.map((b, i) => (
              <div className="invest__item" data-rv key={b.t}>
                <i>{String(i + 1).padStart(2, "0")}</i>
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
          <p className="invest__disc">* {iv.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
