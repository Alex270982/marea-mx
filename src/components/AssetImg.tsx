import type { ComponentProps } from "react";
import { asset, type AssetKind } from "@/lib/assets";

type AssetImgProps = Omit<ComponentProps<"img">, "src" | "srcSet"> & {
  /** Asset key from lib/assets FILES map. */
  k: string;
  /** Variant used on desktop; phones (≤900px) always get the "min" variant. */
  kind?: AssetKind;
};

/** Server-safe responsive asset image: phones get the lightweight `min`
    variant via <picture>, larger screens get the requested `kind`.
    The wrapping <picture> is `display: contents` (see globals.css) so
    existing `.x img` selectors and layout are unaffected. */
export default function AssetImg({ k, kind = "min", alt = "", ...rest }: AssetImgProps) {
  return (
    <picture>
      <source media="(max-width: 900px)" srcSet={asset(k, "min")} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(k, kind)} alt={alt} {...rest} />
    </picture>
  );
}
