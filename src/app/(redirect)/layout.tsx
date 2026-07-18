import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "MAREA",
  robots: { index: false }
};

export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
