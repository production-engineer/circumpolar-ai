import { Suspense } from "react";
import SitePageClient from "./SitePageClient";

export default function SitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-arctic-950 flex items-center justify-center text-ice">Loading forecast…</div>}>
      <SitePageClient />
    </Suspense>
  );
}
