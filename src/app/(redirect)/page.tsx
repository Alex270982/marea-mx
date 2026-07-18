"use client";

import { useEffect } from "react";

/** Static-export friendly root: client-side redirect into the default locale. */
export default function RootRedirect() {
  useEffect(() => {
    window.location.replace("en/");
  }, []);
  return (
    <main style={{ display: "grid", placeItems: "center", minHeight: "100dvh" }}>
      <a
        href="en/"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "0.34em", textIndent: "0.34em" }}
      >
        MAREA
      </a>
    </main>
  );
}
