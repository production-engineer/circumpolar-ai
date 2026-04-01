import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Circumpolar.ai — Arctic Intelligence at Your Fingertips",
  description:
    "Get instant AI-powered insights for any Arctic location. Permafrost risk, sea ice, weather, connectivity, and more. Built for infrastructure developers, insurers, and researchers.",
  openGraph: {
    title: "Circumpolar.ai — Arctic Intelligence",
    description:
      "Pin any Arctic location. Ask anything. Get instant data-backed answers.",
    type: "website",
    url: "https://circumpolar.ai",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
