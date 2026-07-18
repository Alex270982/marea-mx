"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import type { Locale } from "@/lib/i18n";

interface SavedContextValue {
  saved: string[];
  compare: string[];
  recent: string[];
  toggleSave: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  clearCompare: () => void;
  pushRecent: (slug: string) => void;
  toast: (msg: string) => void;
}

const SavedContext = createContext<SavedContextValue | null>(null);

const KEYS = {
  saved: "marea-saved",
  compare: "marea-compare",
  recent: "marea-recent"
} as const;

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key: string, value: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: state stays in memory */
  }
}

export function SavedProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState("");
  const [toastOn, setToastOn] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hydrated, setHydrated] = useState(false);

  /* hydrate from localStorage after mount (SSR-safe). Read eagerly, then
     merge with any in-memory state: child effects (e.g. a detail page
     pushing itself into "recently viewed") run before this parent effect.
     Persistence is gated on hydrated *state* so the mount-pass persist
     effects never write the initial empty arrays over stored values. */
  useEffect(() => {
    const storedSaved = readList(KEYS.saved);
    const storedCompare = readList(KEYS.compare);
    const storedRecent = readList(KEYS.recent);
    const merge = (prev: string[], stored: string[]) => [
      ...prev,
      ...stored.filter((s) => !prev.includes(s))
    ];
    setSaved((prev) => merge(prev, storedSaved));
    setCompare((prev) => merge(prev, storedCompare).slice(0, 3));
    setRecent((prev) => merge(prev, storedRecent).slice(0, 6));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) writeList(KEYS.saved, saved);
  }, [saved, hydrated]);
  useEffect(() => {
    if (hydrated) writeList(KEYS.compare, compare);
  }, [compare, hydrated]);
  useEffect(() => {
    if (hydrated) writeList(KEYS.recent, recent);
  }, [recent, hydrated]);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastOn(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastOn(false), 2600);
  }, []);

  const toggleSave = useCallback(
    (slug: string) => {
      setSaved((prev) => {
        if (prev.includes(slug)) return prev.filter((s) => s !== slug);
        toast(locale === "es" ? "Guardada en tu selección" : "Saved to your collection");
        return [...prev, slug];
      });
    },
    [locale, toast]
  );

  const toggleCompare = useCallback(
    (slug: string) => {
      setCompare((prev) => {
        if (prev.includes(slug)) return prev.filter((s) => s !== slug);
        if (prev.length >= 3) {
          toast(
            locale === "es"
              ? "Máximo tres residencias a la vez."
              : "Up to three residences at a time."
          );
          return prev;
        }
        return [...prev, slug];
      });
    },
    [locale, toast]
  );

  const clearCompare = useCallback(() => setCompare([]), []);

  const pushRecent = useCallback((slug: string) => {
    setRecent((prev) => [slug, ...prev.filter((s) => s !== slug)].slice(0, 6));
  }, []);

  return (
    <SavedContext.Provider
      value={{ saved, compare, recent, toggleSave, toggleCompare, clearCompare, pushRecent, toast }}
    >
      {children}
      <div className={`toast ${toastOn ? "is-on" : ""}`} role="status" aria-live="polite">
        {toastMsg}
      </div>
    </SavedContext.Provider>
  );
}

export function useSaved(): SavedContextValue {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within SavedProvider");
  return ctx;
}
