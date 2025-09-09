import "./globals.css";
import type { Metadata } from "next";

function getMetadataBase(): URL | undefined {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,                      // e.g., https://stitchpf.vercel.app
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    "http://localhost:3000",
  ];
  for (const c of candidates) {
    if (!c) continue;
    try { return new URL(c); } catch { /* try next */ }
  }
  return undefined;
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "LinkGlyph — shareable profile cards",
  description: "Generate a beautiful, shareable profile like LinkedIn (but faster).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
