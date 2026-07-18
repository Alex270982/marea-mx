"use client";

import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, closeLabel, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div className={`modal ${open ? "is-open" : ""}`}>
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__panel" role="dialog" aria-modal="true">
        {children}
      </div>
      <button className="modal__close" onClick={onClose} aria-label={closeLabel}>
        ✕
      </button>
    </div>
  );
}
