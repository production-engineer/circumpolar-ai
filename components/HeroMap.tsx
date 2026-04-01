"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { PinnedLocation } from "./MapPicker";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });
const LocationSheet = dynamic(() => import("./LocationSheet"), { ssr: false });

export default function HeroMap() {
  const [location, setLocation] = useState<PinnedLocation | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handlePin = (loc: PinnedLocation) => {
    setLocation(loc);
    setSheetOpen(true);
  };

  return (
    <>
      <div className="relative w-full h-[420px] sm:h-[520px]">
        <MapPicker onPin={handlePin} />

        {!location && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-3" style={{ animation: "pulse 3s ease-in-out infinite" }}>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ border: "2px solid rgba(0,196,113,0.5)", background: "rgba(10,18,31,0.6)" }}
              >
                <span className="text-xl">📍</span>
              </div>
              <p
                className="text-sm backdrop-blur-sm px-4 py-2 rounded-full"
                style={{
                  color: "rgba(250,248,245,0.8)",
                  background: "rgba(10,18,31,0.75)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Click anywhere in the Arctic to start
              </p>
            </div>
          </div>
        )}
      </div>

      {sheetOpen && (
        <LocationSheet location={location} onClose={() => setSheetOpen(false)} />
      )}
    </>
  );
}
