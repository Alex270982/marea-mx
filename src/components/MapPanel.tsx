"use client";

/* Thin chooser between the live Mapbox map and the hand-drawn SVG map.
   Call sites use this; MapboxExplorer itself also degrades to the SVG
   map at runtime if Mapbox cannot start. */

import type { CSSProperties } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import type { Listing } from "@/lib/data";
import { mapboxEnabled } from "@/lib/mapbox";
import MapExplorer from "@/components/MapExplorer";
import MapboxExplorer from "@/components/MapboxExplorer";

export interface MapPanelProps {
  listings: Listing[];
  locale: Locale;
  d: Dict;
  showPois?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

export default function MapPanel(props: MapPanelProps) {
  return mapboxEnabled() ? <MapboxExplorer {...props} /> : <MapExplorer {...props} />;
}
