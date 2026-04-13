"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, X, Minimize2, ChevronUp, Wind, Thermometer, Snowflake } from "lucide-react";
import type { PinnedLocation } from "./MapPicker";
import type { DayForecast } from "@/lib/field-plan";
import { RATING_COLORS, RATING_ICONS, MAX_FORECAST_WINDOW_DAYS } from "@/lib/field-plan";

type Message = { role: "user" | "assistant"; content: string };
type PlanStep = "idle" | "askSiteName" | "askDates" | "fetching" | "done";

interface PlanState {
  step: PlanStep;
  siteName: string;
  startDate: string;
  endDate: string;
  days: DayForecast[];
  siteUrl: string;
}

interface CirceChatProps {
  location: PinnedLocation | null;
}

const SUGGESTED = [
  "When should I plan my field install here?",
  "What's the permafrost risk here?",
  "Is there cellular coverage?",
  "What are current weather conditions?",
  "Is this suitable for construction?",
];

const emptyPlan = (): PlanState => ({
  step: "idle", siteName: "", startDate: "", endDate: "", days: [], siteUrl: "",
});

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-aurora-blue" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-aurora-blue" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-aurora-blue" />
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return (
          <span key={i}>
            {part.split("\n").map((line, j, arr) => (
              <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
            ))}
          </span>
        );
      })}
    </>
  );
}

function DatePicker({ onSubmit }: { onSubmit: (start: string, end: string) => void }) {
  const today = new Date().toISOString().split("T")[0];
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const inputStyle = {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
    color: "#faf8f5", colorScheme: "dark" as const,
  };
  const tooLong = start && end && (new Date(end).getTime() - new Date(start).getTime()) / 86400000 > MAX_FORECAST_WINDOW_DAYS;

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: "rgba(250,248,245,0.45)" }}>Start</label>
          <input type="date" min={today} value={start} onChange={e => setStart(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none" style={inputStyle} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: "rgba(250,248,245,0.45)" }}>End</label>
          <input type="date" min={start || today} value={end} onChange={e => setEnd(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none" style={inputStyle} />
        </div>
      </div>
      {tooLong && (
        <p className="text-xs" style={{ color: "#fbbf24" }}>Window exceeds 8-day forecast limit — shorten the range.</p>
      )}
      <button onClick={() => onSubmit(start, end)} disabled={!start || !end || end < start || !!tooLong}
        className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "#00c471", color: "#0a121f" }}>
        Check forecast →
      </button>
    </div>
  );
}

function ForecastCard({ days, siteUrl }: { days: DayForecast[]; siteUrl: string }) {
  return (
    <div className="flex flex-col gap-2">
      {days.map(day => {
        const c = RATING_COLORS[day.overall];
        return (
          <div key={day.date} className="rounded-xl px-3 py-2.5" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
            <div className="flex items-center justify-between gap-1">
              <span className="text-sm font-semibold" style={{ color: "#faf8f5" }}>
                {RATING_ICONS[day.overall]} {day.date}
              </span>
              <span className="text-xs font-semibold" style={{ color: c.text }}>{c.label}</span>
            </div>
            <div className="flex gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs" style={{ color: day.windRating === "go" ? "rgba(250,248,245,0.55)" : RATING_COLORS[day.windRating].text }}>
                <Wind size={11} /> {day.windMph} mph
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: day.tempRating === "go" ? "rgba(250,248,245,0.55)" : RATING_COLORS[day.tempRating].text }}>
                <Thermometer size={11} /> {day.tempMinF}–{day.tempMaxF}°F
              </span>
              {day.snowIn > 0 && (
                <span className="flex items-center gap-1 text-xs" style={{ color: day.snowRating === "go" ? "rgba(250,248,245,0.55)" : RATING_COLORS[day.snowRating].text }}>
                  <Snowflake size={11} /> {day.snowIn}&quot;
                </span>
              )}
            </div>
          </div>
        );
      })}
      <a href={siteUrl} target="_blank" rel="noopener noreferrer"
        className="mt-1 w-full text-center rounded-xl py-2.5 text-sm font-semibold transition-all block"
        style={{ background: "#00c471", color: "#0a121f" }}>
        Open site forecast →
      </a>
    </div>
  );
}

export default function CirceChat({ location }: CirceChatProps) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [circeState, setCirceState] = useState<"idle" | "wave">("idle");
  const [plan, setPlan] = useState<PlanState>(emptyPlan());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location && !open) {
      setCirceState("wave");
      const t = setTimeout(() => setCirceState("idle"), 2000);
      return () => clearTimeout(t);
    }
  }, [location, open]);

  useEffect(() => {
    if (open && location && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Hi! I'm Circe 🐻‍❄️ I've got data for **${location.name ?? `${location.lat.toFixed(2)}°N, ${location.lng.toFixed(2)}°E`}**.\n\nAsk me anything about this location — permafrost, sea ice, weather, cellular coverage, terrain, or infrastructure risk.`,
      }]);
    }
  }, [open, location, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, plan.step]);

  useEffect(() => {
    if (open && !minimized) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, minimized]);

  useEffect(() => {
    setPlan(emptyPlan());
    setMessages([]);
  }, [location?.lat, location?.lng]);

  const addAssistant = useCallback((content: string) => {
    setMessages(prev => [...prev, { role: "assistant", content }]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], location }),
      });
      if (!res.ok || !res.body) throw new Error("API error");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            streamedText += JSON.parse(data).delta?.text ?? "";
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: streamedText };
              return updated;
            });
          } catch {}
        }
      }
    } catch {
      addAssistant("Sorry, I couldn't fetch data right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, messages, location, addAssistant]);

  const startPlanning = useCallback(() => {
    setPlan({ ...emptyPlan(), step: "askSiteName" });
    addAssistant("Sure! What's the **site name**? (optional — press Enter to skip)");
  }, [addAssistant]);

  const handleSiteNameSubmit = useCallback((value: string) => {
    const siteName = value.trim();
    setMessages(prev => [...prev, { role: "user", content: siteName || "(no site name)" }]);
    setPlan(p => ({ ...p, siteName, step: "askDates" }));
    addAssistant("Got it. What's your **target install window**?");
  }, [addAssistant]);

  const handleDatesSubmit = useCallback(async (startDate: string, endDate: string) => {
    if (!location) return;
    const dateLabel = `${new Date(startDate + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(endDate + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    setMessages(prev => [
      ...prev,
      { role: "user", content: dateLabel },
      { role: "assistant", content: "Checking the forecast…" },
    ]);
    setPlan(p => ({ ...p, startDate, endDate, step: "fetching" }));
    setLoading(true);

    try {
      const res = await fetch("/api/field-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: location.lat, lng: location.lng, startDate, endDate, siteName: plan.siteName || null }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Forecast failed");
      }
      const data = await res.json();
      setPlan(p => ({ ...p, days: data.days, siteUrl: data.siteUrl, step: "done" }));

      const goDays = data.days.filter((d: DayForecast) => d.overall === "go").length;
      const riskyDays = data.days.filter((d: DayForecast) => d.overall === "risky").length;

      if (data.days.length === 0) {
        addAssistant("No forecast data yet for that window — check back closer to your install date.");
      } else if (goDays > 0) {
        addAssistant(`Found **${goDays} go-day${goDays > 1 ? "s" : ""}**${riskyDays > 0 ? ` and ${riskyDays} risky day${riskyDays > 1 ? "s" : ""}` : ""} in your window. Open the site page to share the forecast with your team.`);
      } else {
        addAssistant("No clear go-days in this window. Consider adjusting your dates.");
      }
    } catch (e) {
      addAssistant(e instanceof Error ? e.message : "Couldn't load the forecast. Try again.");
      setPlan(p => ({ ...p, step: "idle" }));
    } finally {
      setLoading(false);
    }
  }, [location, plan.siteName, addAssistant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plan.step === "askSiteName") {
      handleSiteNameSubmit(input);
      setInput("");
    } else {
      sendMessage(input);
    }
  };

  const isPlanningActive = plan.step !== "idle" && plan.step !== "done";
  const isInputBlocked = plan.step === "askDates" || plan.step === "fetching";

  if (!open) {
    return (
      <button onClick={() => { setOpen(true); setMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 group"
        aria-label="Open Circe AI assistant">
        <div className={`text-4xl transition-transform duration-300 ${circeState === "wave" ? "animate-bounce" : "group-hover:-translate-y-1 group-hover:scale-110"} drop-shadow-2xl`}>
          🐻‍❄️
        </div>
        {location && (
          <div className="bg-aurora-blue text-arctic-950 text-xs font-semibold rounded-full px-2.5 py-1 shadow-lg shadow-aurora-blue/30 animate-fade-in">
            Ask Circe
          </div>
        )}
        {!location && (
          <div className="opacity-0 group-hover:opacity-100 bg-arctic-800 border border-arctic-600 text-ice text-xs rounded-xl px-2.5 py-1.5 shadow-lg transition-opacity whitespace-nowrap">
            Ask me anything Arctic
          </div>
        )}
      </button>
    );
  }

  const windowCls = minimized
    ? "fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 flex flex-col w-full sm:w-80 h-14 rounded-none sm:rounded-2xl"
    : "fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-full h-full sm:w-[420px] sm:h-[600px] rounded-none sm:rounded-2xl";

  return (
    <div className={`${windowCls} shadow-2xl transition-all duration-300 bg-arctic-900 border border-arctic-700`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-arctic-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐻‍❄️</span>
          <div>
            <p className="text-sm font-semibold text-ice">Circe</p>
            {location && !minimized && (
              <p className="text-xs text-arctic-400 truncate max-w-[220px]">
                {location.name ?? `${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°`}
              </p>
            )}
          </div>
          <span className="w-2 h-2 rounded-full bg-aurora-green ml-1 animate-pulse-slow" />
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMinimized(!minimized)} className="p-1.5 text-arctic-400 hover:text-ice rounded-lg hover:bg-arctic-800 transition-colors">
            {minimized ? <ChevronUp size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={() => { setOpen(false); setPlan(emptyPlan()); }} className="p-1.5 text-arctic-400 hover:text-ice rounded-lg hover:bg-arctic-800 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="flex-1 overflow-y-auto chat-scroll px-4 py-3 flex flex-col gap-3">
            {!location && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-6">
                <span className="text-4xl animate-float">📍</span>
                <p className="text-arctic-300 text-sm">Pin a location on the map first, then ask me anything about it.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && <span className="text-lg mr-2 flex-shrink-0 mt-0.5">🐻‍❄️</span>}
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-aurora-blue text-arctic-950 font-medium rounded-tr-sm"
                    : "bg-arctic-800 text-ice rounded-tl-sm border border-arctic-700"
                }`}>
                  <MessageContent content={msg.content} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <span className="text-lg mr-2">🐻‍❄️</span>
                <div className="bg-arctic-800 border border-arctic-700 rounded-2xl rounded-tl-sm"><TypingIndicator /></div>
              </div>
            )}

            {location && messages.length === 1 && !loading && plan.step === "idle" && (
              <div className="flex flex-col gap-1.5 mt-1">
                {SUGGESTED.map(s => (
                  <button key={s}
                    onClick={() => {
                      if (s === "When should I plan my field install here?") {
                        setMessages(prev => [...prev, { role: "user", content: s }]);
                        startPlanning();
                      } else {
                        sendMessage(s);
                      }
                    }}
                    className="text-left text-xs text-arctic-300 hover:text-aurora-blue bg-arctic-800/50 hover:bg-arctic-800 border border-arctic-700 hover:border-arctic-500 rounded-xl px-3 py-2 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            )}

            {plan.step === "askDates" && <DatePicker onSubmit={handleDatesSubmit} />}
            {plan.step === "done" && plan.days.length > 0 && (
              <ForecastCard days={plan.days} siteUrl={plan.siteUrl} />
            )}

            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 border-t border-arctic-700 flex-shrink-0">
            <input ref={inputRef} type="text" value={input}
              onChange={e => setInput(e.target.value)}
              disabled={!location || loading || isInputBlocked}
              placeholder={
                !location ? "Pin a location first…"
                  : plan.step === "askSiteName" ? "Site name (or press Enter to skip)…"
                  : isPlanningActive ? "Use the picker above…"
                  : "Ask about this location…"
              }
              className="flex-1 bg-arctic-800 border border-arctic-600 rounded-xl px-3.5 py-2.5 text-sm text-ice placeholder:text-arctic-500 outline-none focus:border-aurora-blue transition-colors disabled:opacity-50" />
            <button type="submit"
              disabled={!input.trim() || loading || !location || isInputBlocked}
              className="flex-shrink-0 bg-aurora-blue disabled:opacity-40 text-arctic-950 rounded-xl p-2.5 transition-all hover:bg-white disabled:cursor-not-allowed">
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
