"use client";

/* Live Mapbox GL version of the coast map. Mirrors MapExplorer's API
   exactly and falls back to the hand-drawn SVG map (MapExplorer) when
   the token is missing, WebGL is unavailable, the style fails to load,
   or the map does not become ready within 8 seconds. */

import "mapbox-gl/dist/mapbox-gl.css";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Map as MapboxMap, Marker, Popup, GeoJSONSource } from "mapbox-gl";
import type { FeatureCollection, Point } from "geojson";
import type { Dict, Locale } from "@/lib/i18n";
import { POIS, destName, type Listing, type Poi } from "@/lib/data";
import { asset } from "@/lib/assets";
import { fmtMapPrice, fmtUSD } from "@/lib/format";
import { MAPBOX_TOKEN, mapboxEnabled } from "@/lib/mapbox";
import MapExplorer from "@/components/MapExplorer";

type MapboxGL = typeof import("mapbox-gl").default;

/* same stroke icons as the SVG map */
const POI_ICONS: Record<Poi["type"], string> = {
  airport: "M-4,2 L0,-4 L4,2 L0,0.6 Z",
  marina: "M0,-4 L0,4 M-3,1 C-3,3.4 3,3.4 3,1",
  beach: "M-4,3 C-1,0 1,0 4,3 M0,3 L0,-3 M0,-3 C2,-4.6 3.4,-4 4,-2.4",
  wellness: "M0,-4 C2.6,-1.6 2.6,1.6 0,4 C-2.6,1.6 -2.6,-1.6 0,-4"
};

const SOURCE_ID = "listings";
const LOAD_TIMEOUT_MS = 8000;
/* Riviera Maya default center, used before the first fit */
const DEFAULT_CENTER: [number, number] = [-87.05, 20.65];

interface MapboxExplorerProps {
  listings: Listing[];
  locale: Locale;
  d: Dict;
  showPois?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

function webglOk(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

function toGeoJSON(listings: Listing[]): FeatureCollection<Point> {
  return {
    type: "FeatureCollection",
    features: listings.map((l) => ({
      type: "Feature",
      properties: { slug: l.slug },
      geometry: { type: "Point", coordinates: [l.coords.lng, l.coords.lat] }
    }))
  };
}

export default function MapboxExplorer({
  listings,
  locale,
  d,
  showPois = true,
  id,
  className,
  style
}: MapboxExplorerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"boot" | "live" | "fallback">(
    mapboxEnabled() ? "boot" : "fallback"
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mbRef = useRef<MapboxGL | null>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const loadedRef = useRef(false);
  const listingsRef = useRef(listings);
  const lastFitRef = useRef<Listing[] | null>(null);
  const pendingFitRef = useRef<boolean | null>(null);
  const listingMarkersRef = useRef<globalThis.Map<string, Marker>>(new globalThis.Map());
  const clusterMarkersRef = useRef<globalThis.Map<number, Marker>>(new globalThis.Map());
  const poiMarkersRef = useRef<Marker[]>([]);
  const popupRef = useRef<Popup | null>(null);
  listingsRef.current = listings;

  const goto = (slug: string) => router.push(`/${locale}/properties/${slug}/`);

  /* ---- camera ---- */
  const fitToListings = (animate: boolean) => {
    const mb = mbRef.current;
    const map = mapRef.current;
    const el = containerRef.current;
    const ls = listingsRef.current;
    if (!mb || !map || !el || !ls.length) return;
    /* hidden (list view) or tiny container: defer until it has real size */
    if (el.clientWidth < 150 || el.clientHeight < 150) {
      pendingFitRef.current = pendingFitRef.current || animate;
      return;
    }
    pendingFitRef.current = null;
    lastFitRef.current = ls;
    try {
      if (ls.length === 1) {
        map.easeTo({
          center: [ls[0].coords.lng, ls[0].coords.lat],
          zoom: 12,
          duration: animate ? 900 : 0
        });
      } else {
        const bounds = new mb.LngLatBounds();
        ls.forEach((l) => bounds.extend([l.coords.lng, l.coords.lat]));
        map.fitBounds(bounds, { padding: 60, maxZoom: 13, duration: animate ? 900 : 0 });
      }
    } catch {
      /* degenerate container geometry — a later resize retries */
      pendingFitRef.current = animate;
    }
  };

  /* ---- popups ---- */
  const openListingPopup = (l: Listing) => {
    const mb = mbRef.current;
    const map = mapRef.current;
    if (!mb || !map) return;
    popupRef.current?.remove();
    const card = document.createElement("div");
    card.className = "marea-popcard";
    card.setAttribute("role", "link");
    const img = document.createElement("img");
    img.src = asset(l.image);
    img.alt = "";
    const h4 = document.createElement("h4");
    h4.textContent = l[locale].name;
    const p = document.createElement("p");
    p.textContent = `${l.neighborhood} · ${destName(l.destination, locale)}`;
    const b = document.createElement("b");
    b.textContent = fmtUSD(l.priceUSD);
    card.append(img, h4, p, b);
    card.addEventListener("click", () => goto(l.slug));
    popupRef.current = new mb.Popup({
      closeButton: false,
      offset: 14,
      className: "marea-popup",
      maxWidth: "260px"
    })
      .setLngLat([l.coords.lng, l.coords.lat])
      .setDOMContent(card)
      .addTo(map);
  };

  const openPoiPopup = (poi: Poi) => {
    const mb = mbRef.current;
    const map = mapRef.current;
    if (!mb || !map) return;
    popupRef.current?.remove();
    const el = document.createElement("div");
    el.className = "marea-popname";
    el.textContent = poi[locale];
    popupRef.current = new mb.Popup({
      closeButton: false,
      offset: 14,
      className: "marea-popup marea-popup--poi",
      maxWidth: "240px"
    })
      .setLngLat([poi.coords.lng, poi.coords.lat])
      .setDOMContent(el)
      .addTo(map);
  };

  /* ---- HTML markers (price tags + clusters), synced to cluster state ---- */
  const makeListingMarker = (mb: MapboxGL, l: Listing): Marker => {
    const root = document.createElement("div");
    root.className = "marea-mk";
    const tag = document.createElement("div");
    tag.className = "marea-tag";
    tag.tabIndex = 0;
    tag.setAttribute("role", "button");
    tag.setAttribute("aria-label", l[locale].name);
    const label = document.createElement("span");
    label.className = "marea-tag__label num";
    label.textContent = fmtMapPrice(l.priceUSD);
    const dot = document.createElement("span");
    dot.className = "marea-tag__dot";
    tag.append(label, dot);
    root.appendChild(tag);
    tag.addEventListener("click", (ev) => {
      ev.stopPropagation();
      openListingPopup(l);
    });
    tag.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") goto(l.slug);
    });
    return new mb.Marker({ element: root, anchor: "bottom", offset: [0, 4] }).setLngLat([
      l.coords.lng,
      l.coords.lat
    ]);
  };

  const updateMarkers = () => {
    const mb = mbRef.current;
    const map = mapRef.current;
    if (!mb || !map) return;
    const src = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (!src) return;
    const features = map.querySourceFeatures(SOURCE_ID);
    const seenSlugs = new Set<string>();
    const seenClusters = new Set<number>();

    for (const f of features) {
      const coords = (f.geometry as Point).coordinates as [number, number];
      const props = (f.properties || {}) as {
        cluster?: boolean;
        cluster_id?: number;
        point_count_abbreviated?: string | number;
        point_count?: number;
        slug?: string;
      };
      if (props.cluster && props.cluster_id != null) {
        const cid = props.cluster_id;
        if (seenClusters.has(cid)) continue;
        seenClusters.add(cid);
        let marker = clusterMarkersRef.current.get(cid);
        if (!marker) {
          const root = document.createElement("div");
          root.className = "marea-mk";
          const disc = document.createElement("div");
          disc.className = "marea-cluster num";
          disc.textContent = String(props.point_count_abbreviated ?? props.point_count ?? "");
          root.appendChild(disc);
          disc.addEventListener("click", (ev) => {
            ev.stopPropagation();
            src.getClusterExpansionZoom(cid, (err, zoom) => {
              if (err || zoom == null || !mapRef.current) return;
              mapRef.current.easeTo({ center: coords, zoom: zoom + 0.3, duration: 700 });
            });
          });
          marker = new mb.Marker({ element: root }).setLngLat(coords);
          clusterMarkersRef.current.set(cid, marker);
        }
        marker.addTo(map);
      } else if (props.slug) {
        if (seenSlugs.has(props.slug)) continue;
        seenSlugs.add(props.slug);
        let marker = listingMarkersRef.current.get(props.slug);
        if (!marker) {
          const listing = listingsRef.current.find((l) => l.slug === props.slug);
          if (!listing) continue;
          marker = makeListingMarker(mb, listing);
          listingMarkersRef.current.set(props.slug, marker);
        }
        marker.addTo(map);
      }
    }

    for (const [slug, marker] of listingMarkersRef.current) {
      if (!seenSlugs.has(slug)) marker.remove();
    }
    for (const [cid, marker] of clusterMarkersRef.current) {
      if (!seenClusters.has(cid)) {
        marker.remove();
        clusterMarkersRef.current.delete(cid);
      }
    }
  };

  /* ---- boot the map ---- */
  /* eslint-disable-next-line react-hooks/exhaustive-deps -- mount-once */
  useEffect(() => {
    if (!mapboxEnabled()) return;
    let disposed = false;
    let map: MapboxMap | null = null;
    let timer: number | undefined;
    let ro: ResizeObserver | null = null;

    const destroy = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      ro?.disconnect();
      ro = null;
      popupRef.current?.remove();
      popupRef.current = null;
      listingMarkersRef.current.forEach((m) => m.remove());
      listingMarkersRef.current.clear();
      clusterMarkersRef.current.forEach((m) => m.remove());
      clusterMarkersRef.current.clear();
      poiMarkersRef.current.forEach((m) => m.remove());
      poiMarkersRef.current = [];
      try {
        map?.remove();
      } catch {
        /* already gone */
      }
      map = null;
      mapRef.current = null;
    };

    const fail = () => {
      if (disposed) return;
      disposed = true;
      destroy();
      setStatus("fallback");
    };

    (async () => {
      let mb: MapboxGL;
      try {
        mb = (await import("mapbox-gl")).default;
      } catch {
        fail();
        return;
      }
      if (disposed || !containerRef.current) return;
      mbRef.current = mb;

      const supported =
        typeof (mb as unknown as { supported?: () => boolean }).supported === "function"
          ? (mb as unknown as { supported: () => boolean }).supported()
          : webglOk();
      if (!supported) {
        fail();
        return;
      }

      mb.accessToken = MAPBOX_TOKEN;
      const initial = listingsRef.current;
      try {
        map = new mb.Map({
          container: containerRef.current,
          style: "mapbox://styles/mapbox/light-v11",
          center:
            initial.length === 1
              ? [initial[0].coords.lng, initial[0].coords.lat]
              : DEFAULT_CENTER,
          zoom: initial.length === 1 ? 12 : 8,
          cooperativeGestures: true,
          attributionControl: false
        });
      } catch {
        fail();
        return;
      }
      mapRef.current = map;

      map.addControl(new mb.NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new mb.AttributionControl({ compact: true }));

      timer = window.setTimeout(() => {
        if (!loadedRef.current) fail();
      }, LOAD_TIMEOUT_MS);

      map.on("error", (e) => {
        if (disposed || loadedRef.current) return;
        const err = (e as { error?: Error & { status?: number } }).error;
        const httpStatus = err?.status;
        const msg = String(err?.message || "");
        if (
          httpStatus === 401 ||
          httpStatus === 403 ||
          /style|token|unauthorized|forbidden|fetch|network|load/i.test(msg)
        ) {
          fail();
        }
      });

      map.on("load", () => {
        if (disposed || !map) return;
        loadedRef.current = true;
        if (timer !== undefined) window.clearTimeout(timer);

        /* gentle brand retune; skip silently if the style differs */
        try {
          if (map.getLayer("water")) map.setPaintProperty("water", "fill-color", "#C7DAD5");
        } catch {
          /* noop */
        }
        try {
          if (map.getLayer("land")) map.setPaintProperty("land", "background-color", "#EFEBE2");
        } catch {
          /* noop */
        }

        const single = listingsRef.current.length === 1;
        map.addSource(SOURCE_ID, {
          type: "geojson",
          data: toGeoJSON(listingsRef.current),
          cluster: !single,
          clusterRadius: 48,
          clusterMaxZoom: 13
        });
        /* invisible layer so the source is tiled and queryable */
        map.addLayer({
          id: "listing-anchors",
          type: "circle",
          source: SOURCE_ID,
          paint: { "circle-radius": 0, "circle-opacity": 0 }
        });
        map.on("render", () => {
          if (!map || !map.getSource(SOURCE_ID) || !map.isSourceLoaded(SOURCE_ID)) return;
          updateMarkers();
        });

        /* POIs as small ivory circle markers */
        if (showPois) {
          for (const poi of POIS) {
            const root = document.createElement("div");
            root.className = "marea-mk";
            const disc = document.createElement("div");
            disc.className = "marea-poi";
            disc.title = poi[locale];
            disc.setAttribute("aria-label", poi[locale]);
            disc.innerHTML = `<svg viewBox="-6 -6 12 12" width="13" height="13" aria-hidden="true"><path d="${POI_ICONS[poi.type]}" fill="none" stroke="#2E7774" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            disc.addEventListener("click", (ev) => {
              ev.stopPropagation();
              openPoiPopup(poi);
            });
            root.appendChild(disc);
            poiMarkersRef.current.push(
              new mb.Marker({ element: root }).setLngLat([poi.coords.lng, poi.coords.lat]).addTo(map)
            );
          }
        }

        fitToListings(false);
        setStatus("live");
      });

      /* keep canvas sized to the box; view toggles (list/split/map) resize it */
      ro = new ResizeObserver(() => {
        try {
          map?.resize();
        } catch {
          /* noop */
        }
        if (loadedRef.current && pendingFitRef.current !== null) {
          fitToListings(pendingFitRef.current);
        }
      });
      ro.observe(containerRef.current);
    })();

    return () => {
      disposed = true;
      destroy();
    };
  }, []);

  /* ---- sync listing set (search filters) ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (status !== "live" || !map || !loadedRef.current) return;
    if (lastFitRef.current === listings) return; /* initial fit already done on load */
    const src = map.getSource(SOURCE_ID) as GeoJSONSource | undefined;
    if (!src) return;
    popupRef.current?.remove();
    popupRef.current = null;
    for (const [slug, marker] of listingMarkersRef.current) {
      if (!listings.some((l) => l.slug === slug)) {
        marker.remove();
        listingMarkersRef.current.delete(slug);
      }
    }
    try {
      src.setData(toGeoJSON(listings));
    } catch {
      return;
    }
    fitToListings(true);
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- fit/setData helpers are stable */
  }, [listings, status]);

  if (status === "fallback") {
    return (
      <MapExplorer
        listings={listings}
        locale={locale}
        d={d}
        showPois={showPois}
        id={id}
        className={className}
        style={style}
      />
    );
  }

  return (
    <div className={`mapwrap mapwrap--live ${className || ""}`} id={id} style={style}>
      <div ref={containerRef} className="mapgl" aria-label="Riviera Maya map" role="region" />
    </div>
  );
}
