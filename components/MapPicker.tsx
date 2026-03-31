"use client";

import { useCallback, useRef, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import { MapPin, Loader2 } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

export type PinnedLocation = {
  lat: number;
  lng: number;
  name?: string;
};

interface MapPickerProps {
  onPin: (location: PinnedLocation) => void;
}

export default function MapPicker({ onPin }: MapPickerProps) {
  const [pin, setPin] = useState<PinnedLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 15,
    latitude: 74,
    zoom: 2.5,
    pitch: 20,
    bearing: 0,
  });

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const handleClick = useCallback(
    async (e: { lngLat: { lat: number; lng: number } }) => {
      const { lat, lng } = e.lngLat;
      setLoading(true);

      let name: string | undefined;
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}&types=place,region,country&limit=1`
        );
        const data = await res.json();
        name = data.features?.[0]?.place_name;
      } catch {
        // geocoding optional
      }

      const location = { lat, lng, name };
      setPin(location);
      setLoading(false);
      onPin(location);
    },
    [token, onPin]
  );

  if (!token) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-arctic-900 rounded-2xl border border-arctic-700">
        <p className="text-arctic-300 text-sm text-center px-6">
          Add{" "}
          <code className="text-aurora-blue">NEXT_PUBLIC_MAPBOX_TOKEN</code> to
          your environment to enable the map.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-arctic-700 shadow-2xl shadow-arctic-950">
      <Map
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapboxAccessToken={token}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        projection={{ name: "globe" }}
        onClick={handleClick}
        cursor="crosshair"
        fog={{
          range: [0.8, 8],
          color: "#0a1628",
          "horizon-blend": 0.08,
          "high-color": "#38bdf8",
          "space-color": "#050d1a",
          "star-intensity": 0.6,
        }}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {pin && (
          <Marker latitude={pin.lat} longitude={pin.lng} anchor="bottom">
            <div className="flex flex-col items-center animate-slide-up">
              <div className="bg-aurora-blue text-arctic-950 rounded-full p-1.5 shadow-lg shadow-aurora-blue/40">
                <MapPin size={18} fill="currentColor" />
              </div>
              <div className="w-0.5 h-3 bg-aurora-blue/60" />
            </div>
          </Marker>
        )}
      </Map>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-arctic-950/80 backdrop-blur-sm border border-arctic-700 rounded-xl px-3 py-2">
          <p className="text-xs text-arctic-300">
            {pin ? (
              <span className="text-ice">
                📍 {pin.name ?? `${pin.lat.toFixed(4)}°, ${pin.lng.toFixed(4)}°`}
              </span>
            ) : (
              "Tap anywhere on the map to pin a location"
            )}
          </p>
        </div>
        {loading && (
          <div className="bg-arctic-950/80 backdrop-blur-sm border border-arctic-700 rounded-xl p-2">
            <Loader2 size={14} className="text-aurora-blue animate-spin" />
          </div>
        )}
      </div>

      {pin && (
        <div className="absolute bottom-14 left-4 bg-arctic-950/80 backdrop-blur-sm border border-arctic-700 rounded-xl px-3 py-1.5">
          <p className="text-xs font-mono text-arctic-300">
            {pin.lat.toFixed(4)}°N &nbsp; {pin.lng.toFixed(4)}°E
          </p>
        </div>
      )}
    </div>
  );
}
