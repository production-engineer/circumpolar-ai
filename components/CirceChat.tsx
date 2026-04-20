"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, X, Minimize2, ChevronUp, Wind, Thermometer, Snowflake } from "lucide-react";
import type { PinnedLocation } from "./MapPicker";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type PlanStep =
  | "idle"
  | "askSiteName"
  | "askDates"
  | "analyzing"
  | "showResults"
  | "askContact"
  | "submitted";

type Rating = "go" | "caution" | "risky";

interface DayForecast {
  date: string;
  windMph: number;
  tempMinF: number;
  tempMaxF: number;
  snowIn: number;
  description: string;
  windRating: Rating;
  tempRating: Rating;
  snowRating: Rating;
  overall: Rating;
}

interface PlanState {
  step: PlanStep;
  siteName: string;
  startDate: string;
  endDate: string;
  techName: string;
  techEmail: string;
  days: DayForecast[];
  summary: string;
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

const RATING_COLORS: Record<Rating, { bg: string; border: string; text: string; label: string }> = {
  go: { bg: "rgba(0,196,113,0.12)", border: "rgba(0,196,113,0.3)", text: "#00c471", label: "Go" },
  caution: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)", text: "#fbbf24", label: "Caution" },
  risky: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#ef4444", label: "Risky" },
};
const RATING_ICONS: Record<Rating, string> = { go: "✅", caution: "⚠️", risky: "🛑" };

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      <span className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: "#d3e8f7" }} />
      <span className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: "#d3e8f7" }} />
      <span className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: "#d3e8f7" }} />
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
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
}

const emptyPlan = (): PlanState => ({
  step: "idle",
  siteName: "",
  startDate: "",
  endDate: "",
  techName: "",
  techEmail: "",
  days: [],
  summary: "",
  siteUrl: "",
});

export default function CirceChat({ location }: CirceChatProps) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanState>(emptyPlan());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location) {
      setOpen(true);
      setMinimized(false);
      setMessages([]);
      setPlan(emptyPlan());
    }
  }, [location?.lat, location?.lng]);

  useEffect(() => {
    if (open && location && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hi! I'm Circe 🐻‍❄️ I've got data for **${
            location.name ?? `${location.lat.toFixed(2)}°N, ${location.lng.toFixed(2)}°E`
          }**.\n\nAsk me anything about this location — permafrost, sea ice, weather, cellular coverage, terrain, or infrastructure risk.`,
        },
      ]);
    }
  }, [open, location, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, plan.step]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  const addAssistantMessage = useCallback((content: string) => {
    setMessages((prev) => [...prev, { role: "assistant", content }]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
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
      let assistantText = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              assistantText += parsed.delta?.text ?? "";
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantText };
                return updated;
              });
            } catch {}
          }
        }
      }
    } catch {
      addAssistantMessage("Sorry, I couldn't fetch data right now. Please check your API keys and try again.");
    } finally {
      setLoading(false);
    }
  }, [loading, messages, location, addAssistantMessage]);

  const startPlanning = useCallback(() => {
    setPlan({ ...emptyPlan(), step: "askSiteName" });
    addAssistantMessage("Sure! Let's find the best window for your field install.\n\nWhat's the **site name**? (optional — just press Enter to skip)");
  }, [addAssistantMessage]);

  const handleSiteNameSubmit = useCallback((value: string) => {
    const siteName = value.trim();
    setMessages((prev) => [...prev, { role: "user", content: siteName || "(no site name)" }]);
    setPlan((p) => ({ ...p, siteName, step: "askDates" }));
    addAssistantMessage("Got it. What's your **target install window**? Pick your start and end dates below.");
  }, [addAssistantMessage]);

  const handleDatesSubmit = useCallback(async (startDate: string, endDate: string) => {
    if (!startDate || !endDate || !location) return;
    setMessages((prev) => [...prev, {
      role: "user",
      content: `${new Date(startDate + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(endDate + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
    }]);
    setPlan((p) => ({ ...p, startDate, endDate, step: "analyzing" }));
    addAssistantMessage("Checking the forecast…");
    setLoading(true);

    try {
      const res = await fetch("/api/field-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          startDate,
          endDate,
          siteName: plan.siteName || null,
        }),
      });
      if (!res.ok) throw new Error("Forecast failed");
      const data = await res.json();

      setPlan((p) => ({
        ...p,
        days: data.days,
        summary: data.summary,
        siteUrl: data.siteUrl,
        step: "showResults",
      }));

      const goDays = data.days.filter((d: DayForecast) => d.overall === "go").length;
      const riskyDays = data.days.filter((d: DayForecast) => d.overall === "risky").length;

      let intro = "";
      if (data.days.length === 0) {
        intro = "No forecast data found for that window yet — the forecast may not reach that far out. Check back closer to your install date.";
      } else if (goDays > 0) {
        intro = `Found ${goDays} go-day${goDays > 1 ? "s" : ""} in your window${riskyDays > 0 ? ` and ${riskyDays} risky day${riskyDays > 1 ? "s" : ""}` : ""}. See the full breakdown below.`;
      } else {
        intro = "No clear go-days in this window. Consider adjusting your dates.";
      }

      addAssistantMessage(intro);
    } catch {
      addAssistantMessage("Couldn't load the forecast. Check your connection and try again.");
      setPlan((p) => ({ ...p, step: "idle" }));
    } finally {
      setLoading(false);
    }
  }, [location, plan.siteName, addAssistantMessage]);

  const handleContactSubmit = useCallback(async (techName: string, techEmail: string) => {
    if (!techName.trim() || !techEmail.trim() || !location) return;
    setMessages((prev) => [...prev, { role: "user", content: `${techName} · ${techEmail}` }]);
    setPlan((p) => ({ ...p, techName, techEmail, step: "submitted" }));
    setLoading(true);

    try {
      await fetch("/api/field-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          startDate: plan.startDate,
          endDate: plan.endDate,
          siteName: plan.siteName || null,
          techName,
          techEmail,
        }),
      });
      addAssistantMessage("Done ✅ Your manager has been notified. Your site forecast page is ready to bookmark and share.");
    } catch {
      addAssistantMessage("Couldn't send the notification — but your site forecast page is still available above.");
    } finally {
      setLoading(false);
    }
  }, [location, plan.startDate, plan.endDate, plan.siteName, addAssistantMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plan.step === "askSiteName") {
      handleSiteNameSubmit(input);
      setInput("");
    } else {
      sendMessage(input);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 group"
        aria-label="Open Circe AI assistant"
      >
        <div className="text-4xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 drop-shadow-2xl">
          🐻‍❄️
        </div>
        {location && (
          <div className="text-xs font-semibold rounded-full px-2.5 py-1 shadow-lg" style={{ background: "#d3e8f7", color: "#0a121f" }}>
            Ask Circe
          </div>
        )}
        {!location && (
          <div className="opacity-0 group-hover:opacity-100 text-xs rounded-xl px-2.5 py-1.5 shadow-lg transition-opacity whitespace-nowrap" style={{ background: "#2e3b50", border: "1px solid rgba(255,255,255,0.1)", color: "#faf8f5" }}>
            Ask me anything Arctic
          </div>
        )}
      </button>
    );
  }

  const windowClass = minimized
    ? "fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 flex flex-col rounded-none sm:rounded-2xl w-full sm:w-80 h-14"
    : "fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col rounded-none sm:rounded-2xl w-full sm:w-[480px] h-full sm:h-[640px]";

  return (
    <div className={`${windowClass} shadow-2xl transition-all duration-300`} style={{ background: "#162235", border: "1px solid rgba(255,255,255,0.08)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🐻‍❄️</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>Circe</p>
            {location && !minimized && (
              <p className="text-xs truncate max-w-[220px]" style={{ color: "rgba(250,248,245,0.4)" }}>
                {location.name ?? `${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°`}
              </p>
            )}
          </div>
          <span className="w-2 h-2 rounded-full ml-1 animate-pulse" style={{ background: "#00c471" }} />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(250,248,245,0.4)" }}
          >
            {minimized ? <ChevronUp size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={() => { setOpen(false); setPlan(emptyPlan()); }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "rgba(250,248,245,0.4)" }}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto chat-scroll px-4 py-3 flex flex-col gap-3">
            {!location && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-6">
                <span className="text-4xl animate-float">📍</span>
                <p className="text-sm" style={{ color: "rgba(250,248,245,0.5)" }}>
                  Pin a location on the map first, then ask me anything about it.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && <span className="text-lg mr-2 flex-shrink-0 mt-0.5">🐻‍❄️</span>}
                <div
                  className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={msg.role === "user"
                    ? { background: "#d3e8f7", color: "#0a121f", fontWeight: 500, borderRadius: "1rem 1rem 0.25rem 1rem" }
                    : { background: "rgba(255,255,255,0.06)", color: "#faf8f5", borderRadius: "1rem 1rem 1rem 0.25rem", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  <MessageContent content={msg.content} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <span className="text-lg mr-2">🐻‍❄️</span>
                <div className="rounded-2xl rounded-tl-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <TypingIndicator />
                </div>
              </div>
            )}

            {/* Suggested questions — only when no planning in progress */}
            {location && messages.length === 1 && !loading && plan.step === "idle" && (
              <div className="flex flex-col gap-1.5 mt-1">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (s === "When should I plan my field install here?") {
                        setMessages((prev) => [...prev, { role: "user", content: s }]);
                        startPlanning();
                      } else {
                        sendMessage(s);
                      }
                    }}
                    className="text-left text-xs rounded-xl px-3 py-2 transition-all"
                    style={{ color: "rgba(250,248,245,0.6)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Date picker — shown when step is askDates */}
            {plan.step === "askDates" && (
              <DateRangePicker onSubmit={handleDatesSubmit} />
            )}

            {/* Forecast results */}
            {plan.step === "showResults" && plan.days.length > 0 && (
              <ForecastResults
                days={plan.days}
                siteUrl={plan.siteUrl}
                onNotifyManager={() => {
                  setPlan((p) => ({ ...p, step: "askContact" }));
                  addAssistantMessage("Sure — what's your **name** and **email**? I'll send your manager the details.");
                }}
              />
            )}

            {/* Contact form */}
            {plan.step === "askContact" && (
              <ContactForm onSubmit={handleContactSubmit} />
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!location || loading || plan.step === "askDates" || plan.step === "analyzing" || plan.step === "showResults" || plan.step === "askContact" || plan.step === "submitted"}
              placeholder={
                !location ? "Pin a location first…"
                  : plan.step === "askSiteName" ? "Site name (or press Enter to skip)…"
                  : plan.step === "askDates" ? "Use the date picker above…"
                  : plan.step === "analyzing" ? "Checking forecast…"
                  : "Ask about this location…"
              }
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors disabled:opacity-50"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#faf8f5" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading || !location || plan.step === "askDates" || plan.step === "analyzing" || plan.step === "showResults" || plan.step === "askContact" || plan.step === "submitted"}
              className="flex-shrink-0 rounded-xl p-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "#d3e8f7", color: "#0a121f" }}
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function DateRangePicker({ onSubmit }: { onSubmit: (start: string, end: string) => void }) {
  const today = new Date().toISOString().split("T")[0];
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#faf8f5",
    colorScheme: "dark" as const,
  };

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: "rgba(250,248,245,0.5)" }}>Start date</label>
          <input
            type="date"
            min={today}
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: "rgba(250,248,245,0.5)" }}>End date</label>
          <input
            type="date"
            min={start || today}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="rounded-xl px-3 py-2 text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>
      <button
        onClick={() => onSubmit(start, end)}
        disabled={!start || !end || end < start}
        className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "#00c471", color: "#0a121f" }}
      >
        Check forecast →
      </button>
    </div>
  );
}

function ForecastResults({
  days,
  siteUrl,
  onNotifyManager,
}: {
  days: DayForecast[];
  siteUrl: string;
  onNotifyManager: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {days.map((day) => {
        const colors = RATING_COLORS[day.overall];
        return (
          <div key={day.date} className="rounded-xl px-3 py-2.5" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: "#faf8f5" }}>
                {RATING_ICONS[day.overall]} {day.date}
              </span>
              <span className="text-xs font-semibold" style={{ color: colors.text }}>{colors.label}</span>
            </div>
            <div className="flex gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs" style={{ color: day.windRating === "go" ? "rgba(250,248,245,0.6)" : RATING_COLORS[day.windRating].text }}>
                <Wind size={11} /> {day.windMph} mph
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: day.tempRating === "go" ? "rgba(250,248,245,0.6)" : RATING_COLORS[day.tempRating].text }}>
                <Thermometer size={11} /> {day.tempMinF}–{day.tempMaxF}°F
              </span>
              {day.snowIn > 0 && (
                <span className="flex items-center gap-1 text-xs" style={{ color: day.snowRating === "go" ? "rgba(250,248,245,0.6)" : RATING_COLORS[day.snowRating].text }}>
                  <Snowflake size={11} /> {day.snowIn}"
                </span>
              )}
            </div>
          </div>
        );
      })}
      <div className="flex gap-2 mt-1">
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center rounded-xl py-2.5 text-sm font-semibold transition-all"
          style={{ background: "#00c471", color: "#0a121f" }}
        >
          View site forecast →
        </a>
        <button
          onClick={onNotifyManager}
          className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#faf8f5" }}
        >
          Notify manager
        </button>
      </div>
    </div>
  );
}

function ContactForm({ onSubmit }: { onSubmit: (name: string, email: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    color: "#faf8f5",
  };

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-xl px-3 py-2 text-sm outline-none"
        style={inputStyle}
      />
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded-xl px-3 py-2 text-sm outline-none"
        style={inputStyle}
      />
      <button
        onClick={() => onSubmit(name, email)}
        disabled={!name.trim() || !email.trim()}
        className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "#00c471", color: "#0a121f" }}
      >
        Send to manager →
      </button>
    </div>
  );
}
