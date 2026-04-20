"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Share2, Check, Wind, Thermometer, Snowflake, ExternalLink } from "lucide-react";
import Link from "next/link";

interface DayForecast {
  date: string;
  windMph: number;
  tempMinF: number;
  tempMaxF: number;
  snowIn: number;
  description: string;
  windRating: "go" | "caution" | "risky";
  tempRating: "go" | "caution" | "risky";
  snowRating: "go" | "caution" | "risky";
  overall: "go" | "caution" | "risky";
}

const RATING_COLORS = {
  go: { bg: "rgba(0,196,113,0.12)", border: "rgba(0,196,113,0.3)", text: "#00c471", label: "Go" },
  caution: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)", text: "#fbbf24", label: "Caution" },
  risky: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#ef4444", label: "Risky" },
};

const RATING_ICONS = { go: "✅", caution: "⚠️", risky: "🛑" };

export default function SitePageClient() {
  const params = useSearchParams();
  const lat = params.get("lat");
  const lng = params.get("lng");
  const name = params.get("name");
  const start = params.get("start");
  const end = params.get("end");

  const [days, setDays] = useState<DayForecast[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const siteName = name ?? `${Number(lat).toFixed(4)}°N, ${Math.abs(Number(lng)).toFixed(4)}°W`;
  const dateRange = start && end
    ? `${new Date(start + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(end + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : "";

  const fetchForecast = useCallback(async () => {
    if (!lat || !lng || !start || !end) {
      setError("Missing location or date parameters.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/field-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: Number(lat), lng: Number(lng), startDate: start, endDate: end, siteName: name }),
      });
      if (!res.ok) throw new Error("Forecast request failed");
      const data = await res.json();
      setDays(data.days);
      setSummary(data.summary);
    } catch {
      setError("Could not load forecast. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [lat, lng, start, end, name]);

  useEffect(() => { fetchForecast(); }, [fetchForecast]);

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const windyUrl = lat && lng
    ? `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lng}&detailLat=${lat}&detailLon=${lng}&width=650&height=450&zoom=9&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1`
    : null;

  return (
    <div className="min-h-screen" style={{ background: "#0a121f", color: "#faf8f5" }}>
      {/* Header */}
      <div style={{ background: "#162235", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">📍</span>
            <div className="min-w-0">
              <h1 className="font-semibold text-lg leading-tight truncate" style={{ color: "#faf8f5" }}>
                {siteName}
              </h1>
              {dateRange && (
                <p className="text-sm" style={{ color: "rgba(250,248,245,0.5)" }}>
                  Install window · {dateRange}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#faf8f5" }}
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? "Copied!" : "Share"}
            </button>
            <Link
              href="/"
              className="text-xs rounded-xl px-3 py-2 transition-colors"
              style={{ background: "rgba(0,196,113,0.12)", border: "1px solid rgba(0,196,113,0.2)", color: "#00c471" }}
            >
              Circumpolar.ai ↗
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Weather recommendation */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(250,248,245,0.4)" }}>
            Install Window Forecast
          </h2>

          {loading && (
            <div className="rounded-2xl p-6 flex items-center gap-3" style={{ background: "#162235", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#00c471", borderTopColor: "transparent" }} />
              <span style={{ color: "rgba(250,248,245,0.6)" }}>Loading forecast…</span>
            </div>
          )}

          {error && (
            <div className="rounded-2xl p-6" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
              {error}
            </div>
          )}

          {!loading && !error && days.length === 0 && (
            <div className="rounded-2xl p-6" style={{ background: "#162235", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(250,248,245,0.6)" }}>
              No forecast data found for this window. The forecast may not reach this far out yet — check back closer to your install date.
            </div>
          )}

          {!loading && days.length > 0 && (
            <div className="flex flex-col gap-3">
              {days.map((day) => {
                const colors = RATING_COLORS[day.overall];
                return (
                  <div
                    key={day.date}
                    className="rounded-2xl p-4"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span>{RATING_ICONS[day.overall]}</span>
                        <span className="font-semibold" style={{ color: "#faf8f5" }}>{day.date}</span>
                        <span className="text-sm capitalize" style={{ color: "rgba(250,248,245,0.5)" }}>{day.description}</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: colors.text }}>
                        {colors.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: day.windRating === "go" ? "rgba(250,248,245,0.7)" : RATING_COLORS[day.windRating].text }}>
                        <Wind size={13} />
                        {day.windMph} mph
                      </div>
                      <div className="flex items-center gap-1.5 text-sm" style={{ color: day.tempRating === "go" ? "rgba(250,248,245,0.7)" : RATING_COLORS[day.tempRating].text }}>
                        <Thermometer size={13} />
                        {day.tempMinF}–{day.tempMaxF}°F
                      </div>
                      {day.snowIn > 0 && (
                        <div className="flex items-center gap-1.5 text-sm" style={{ color: day.snowRating === "go" ? "rgba(250,248,245,0.7)" : RATING_COLORS[day.snowRating].text }}>
                          <Snowflake size={13} />
                          {day.snowIn}" snow
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Windy embed */}
        {windyUrl && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(250,248,245,0.4)" }}>
              Live Forecast Map
            </h2>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <iframe
                src={windyUrl}
                width="100%"
                height="450"
                frameBorder="0"
                title="Windy forecast"
                style={{ display: "block" }}
              />
            </div>
            <p className="text-xs mt-2 flex items-center gap-1" style={{ color: "rgba(250,248,245,0.3)" }}>
              <ExternalLink size={11} />
              <a href="https://windy.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Full forecast on Windy
              </a>
            </p>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center pt-4 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" className="text-sm hover:underline" style={{ color: "rgba(250,248,245,0.3)" }}>
            🐻‍❄️ Powered by Circumpolar.ai
          </Link>
        </footer>
      </div>
    </div>
  );
}
