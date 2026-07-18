"use client";

import { useEffect } from "react";

interface LightboxProps {
  images: string[];
  caption: string;
  ariaLabel: string;
  closeLabel: string;
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}

export default function Lightbox({
  images,
  caption,
  ariaLabel,
  closeLabel,
  index,
  onIndex,
  onClose
}: LightboxProps) {
  const open = index !== null;
  const i = index ?? 0;
  const nav = (dir: number) => onIndex((i + dir + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndex((i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndex((i + 1) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, i, images.length, onClose, onIndex]);

  return (
    <div className={`lightbox ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <button className="lightbox__close" onClick={onClose} aria-label={closeLabel}>
        ✕
      </button>
      <button className="lightbox__nav lightbox__nav--prev" onClick={() => nav(-1)} aria-label="prev">
        ←
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={open ? images[i] : ""} alt="" />
      <button className="lightbox__nav lightbox__nav--next" onClick={() => nav(1)} aria-label="next">
        →
      </button>
      <div className="lightbox__cap">
        {open ? `${caption} · ${i + 1} / ${images.length}` : ""}
      </div>
    </div>
  );
}
