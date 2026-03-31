import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Circumpolar.ai — Arctic Intelligence at Your Fingertips",
  description:
    "Get instant, AI-powered insights for any Arctic location. Permafrost risk, sea ice, weather, connectivity, and more. Built for infrastructure developers, insurers, and researchers.",
  keywords: [
    "Arctic data",
    "permafrost",
    "sea ice",
    "Arctic intelligence",
    "polar risk",
    "Arctic infrastructure",
    "climate data",
  ],
  openGraph: {
    title: "Circumpolar.ai — Arctic Intelligence",
    description:
      "Pin any Arctic location. Ask anything. Get instant data-backed answers.",
    type: "website",
    url: "https://circumpolar.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Circumpolar.ai — Arctic Intelligence",
    description: "AI-powered Arctic insights for any location.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="aurora-bg min-h-screen">{children}</body>
    </html>
  );
}
