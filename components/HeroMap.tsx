"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { PinnedLocation } from "./MapPicker";

const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });
const CirceChat = dynamic(() => import("./CirceChat"), { ssr: false });

export default function HeroMap() {
  const [location, setLocation] = useState<PinnedLocation | null>(null);

  return (
    <>
      <div className="relative w-full h-[420px] sm:h-[500px]">
        <MapPicker onPin={setLocation} />

        {!location && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-3 animate-pulse-slow">
              <div className="w-12 h-12 rounded-full border-2 border-aurora-blue/60 flex items-center justify-center bg-arctic-900/60 backdrop-blur-sm">
                <span className="text-xl">📍</span>
              </div>
              <p className="text-sm text-ice/80 bg-arctic-950/70 backdrop-blur-sm px-4 py-2 rounded-full border border-arctic-700">
                Tap anywhere in the Arctic to start
              </p>
            </div>
          </div>
        )}
      </div>

      <CirceChat location={location} />
    </>
  );
}
