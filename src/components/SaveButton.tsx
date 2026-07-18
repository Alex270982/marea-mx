"use client";

import type { MouseEvent } from "react";
import { useSaved } from "@/components/SavedProvider";

export function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3h12v18l-6-4.5L6 21z" />
    </svg>
  );
}

export default function SaveButton({ slug, label }: { slug: string; label: string }) {
  const { saved, toggleSave } = useSaved();
  const on = saved.includes(slug);
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    toggleSave(slug);
  };
  return (
    <button className={`savebtn ${on ? "is-on" : ""}`} data-slug={slug} aria-label={label} onClick={onClick}>
      <SaveIcon />
    </button>
  );
}
