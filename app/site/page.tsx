"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import { Share2, Check, Wind, Thermometer, Snowflake, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { DayForecast } from "@/lib/field-plan";
import { RATING_COLORS as COLORS, RATING_ICONS as ICONS } from "@/lib/field-plan";

function SiteForecast() {
  const params = useSearchParams();
  const lat = params.get("lat");
  const lng = params.get("lng");
  const name = params.get("name");
  const start = params.get("start");
  const end = params.get("end");

  const [days, setDays] = useState<DayForecast[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const siteName = name ?? `${Number(lat).toFixed(4)}°N, ${Math.abs(Number(lng)).toFixed(4)}°W`;

  const dateLabel =
    start && end
      ? `${new Date(start + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric" })}` +
        ` – ${new Date(end + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Forecast unavailable");
      }
      const data = await res.json();
      setDays(data.days);
      setSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load forecast.");
    } finally {
      setLoading(false);
    }
  }, [lat, lng, start, end, name]);

  useEffect(() => { fetchForecast(); }, [fetchForecast]);

  const share = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const windyUrl =
    lat && lng
      ? `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lng}&detailLat=${lat}&detailLon=${lng}&zoom=9&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=mph&metricTemp=%C2%B0F&radarRange=-1`
      : null;

  return (
    <div className="min-h-screen" style={{ background: "#0a121f", color: "#faf8f5", fontFamily: "DM Sans, system-ui, sans-serif" }}>
      <header style={{ background: "#162235", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex-shrink-0 p-1.5 rounded-lg transition-colors" style={{ color: "rgba(250,248,245,0.4)" }} aria-label="Back to map">
              <ArrowLeft size={16} />
            </Link>
            <span className="text-xl flex-shrink-0">📍</span>
            <div className="min-w-0">
              <h1 className="font-semibold text-base leading-tight truncate" style={{ color: "#faf8f5" }}>
                {siteName}
              </h1>
              {dateLabel && (
                <p className="text-xs truncate" style={{ color: "rgba(250,248,245,0.45)" }}>
                  {dateLabel}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={share}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium flex-shrink-0 transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#faf8f5" }}
          >
            {copied ? <Check size={13} /> : <Share2 size={13} />}
            {copied ? "Copied" : "Share"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-10">
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(250,248,245,0.35)" }}>
            Install Window Forecast
          </p>

          {loading && (
            <div className="rounded-2xl p-5 flex items-center gap-3" style={{ background: "#162235", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-4 h-4 rounded-full border-2 animate-spin flex-shrink-0" style={{ borderColor: "rgba(0,196,113,0.4)", borderTopColor: "#00c471" }} />
              <span style={{ color: "rgba(250,248,245,0.5)" }}>Loading forecast…</span>
            </div>
          )}

          {error && (
            <div className="rounded-2xl p-5" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}>
              {error}
            </div>
          )}

          {!loading && !error && days.length === 0 && (
            <div className="rounded-2xl p-5" style={{ background: "#162235", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(250,248,245,0.5)" }}>
              No forecast data for this window yet. Check back closer to your install date.
            </div>
          )}

          {!loading && days.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {summary && (
                <div className="rounded-2xl p-4 mb-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "rgba(250,248,245,0.8)" }}>{summary}</p>
                </div>
              )}
              {days.map((day) => {
                const c = COLORS[day.overall];
                return (
                  <div key={day.date} className="rounded-xl px-4 py-3" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: "#faf8f5" }}>
                        {ICONS[day.overall]} {day.date}
                        {day.description && (
                          <span className="font-normal ml-2 text-xs capitalize" style={{ color: "rgba(250,248,245,0.45)" }}>{day.description}</span>
                        )}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: c.text }}>{c.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-1.5">
                      <span className="flex items-center gap-1 text-xs" style={{ color: day.windRating === "go" ? "rgba(250,248,245,0.6)" : COLORS[day.windRating].text }}>
                        <Wind size={11} /> {day.windMph} mph
                      </span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: day.tempRating === "go" ? "rgba(250,248,245,0.6)" : COLORS[day.tempRating].text }}>
                        <Thermometer size={11} /> {day.tempMinF}–{day.tempMaxF}°F
                      </span>
                      {day.snowIn > 0 && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: day.snowRating === "go" ? "rgba(250,248,245,0.6)" : COLORS[day.snowRating].text }}>
                          <Snowflake size={11} /> {day.snowIn}&quot;
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {windyUrl && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(250,248,245,0.35)" }}>
              Live Wind Forecast
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <iframe src={windyUrl} width="100%" height="450" frameBorder="0" title="Windy live wind forecast" style={{ display: "block" }} />
            </div>
          </section>
        )}

        <footer className="text-center pb-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}>
          <Link href="/" className="text-xs transition-colors hover:underline" style={{ color: "rgba(250,248,245,0.25)" }}>
            🐻‍❄️ Circumpolar.ai
          </Link>
        </footer>
      </main>
    </div>
  );
}

export default function SitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a121f", color: "rgba(250,248,245,0.4)", fontFamily: "DM Sans, system-ui" }}>
        Loading…
      </div>
    }>
      <SiteForecast />
    </Suspense>
  );
}
