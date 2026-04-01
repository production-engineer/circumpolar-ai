"use client";

import { useCallback, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import { Loader2 } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

export type PinnedLocation = {
  lat: number;
  lng: number;
  name?: string;
};

const TERRAIN_STYLE = {
  version: 8 as const,
  sources: {
    "esri-topo": {
      type: "raster" as const,
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Esri, HERE, Garmin, FAO, NOAA, USGS",
    },
  },
  layers: [{ id: "esri-topo", type: "raster" as const, source: "esri-topo" }],
};

interface MapPickerProps {
  onPin: (location: PinnedLocation) => void;
}

export default function MapPicker({ onPin }: MapPickerProps) {
  const [pin, setPin] = useState<PinnedLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -153,
    latitude: 64,
    zoom: 4,
  });

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const handleClick = useCallback(
    async (e: { lngLat: { lat: number; lng: number } }) => {
      const { lat, lng } = e.lngLat;
      setLoading(true);

      let name: string | undefined;
      if (mapboxToken) {
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=place,region,country&limit=1`
          );
          const data = await res.json();
          name = data.features?.[0]?.place_name;
        } catch {
          // geocoding optional — coordinates always work
        }
      }

      const location = { lat, lng, name };
      setPin(location);
      setLoading(false);
      onPin(location);
    },
    [mapboxToken, onPin]
  );

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <Map
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapStyle={TERRAIN_STYLE}
        style={{ width: "100%", height: "100%" }}
        onClick={handleClick}
        cursor="crosshair"
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {pin && (
          <Marker latitude={pin.lat} longitude={pin.lng} anchor="bottom">
            <div className="flex flex-col items-center">
              <div
                className="rounded-full p-1.5 shadow-lg"
                style={{ background: "#00c471", color: "#0a121f" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="w-0.5 h-3" style={{ background: "rgba(0,196,113,0.6)" }} />
            </div>
          </Marker>
        )}
      </Map>

      <div className="absolute top-4 left-4 right-12 flex items-center gap-2 pointer-events-none">
        <div
          className="backdrop-blur-sm rounded-xl px-3 py-2"
          style={{ background: "rgba(10,18,31,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            {pin ? (
              <span style={{ color: "#faf8f5" }}>
                {pin.name ?? `${pin.lat.toFixed(4)}°N, ${pin.lng.toFixed(4)}°E`}
              </span>
            ) : (
              "Click anywhere on the Arctic to pin a location"
            )}
          </p>
        </div>
        {loading && (
          <div
            className="backdrop-blur-sm rounded-xl p-2"
            style={{ background: "rgba(10,18,31,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Loader2 size={14} className="animate-spin" style={{ color: "#00c471" }} />
          </div>
        )}
      </div>

      {pin && (
        <div
          className="absolute bottom-14 left-4 backdrop-blur-sm rounded-xl px-3 py-1.5"
          style={{ background: "rgba(10,18,31,0.85)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>
            {pin.lat.toFixed(4)}°N &nbsp; {pin.lng.toFixed(4)}°E
          </p>
        </div>
      )}
    </div>
  );
}
