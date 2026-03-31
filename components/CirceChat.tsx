"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X, Minimize2, ChevronUp } from "lucide-react";
import type { PinnedLocation } from "./MapPicker";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface CirceChatProps {
  location: PinnedLocation | null;
}

const SUGGESTED = [
  "What's the permafrost risk here?",
  "Is there cellular coverage?",
  "What are current weather conditions?",
  "Show me sea ice data",
  "Is this suitable for construction?",
];

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-aurora-blue" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-aurora-blue" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-aurora-blue" />
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
  }, [messages, loading]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          location,
        }),
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
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.delta?.text ?? "";
              assistantText += delta;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return updated;
              });
            } catch {}
          }
        }
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't fetch data right now. Please check your API keys and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!open) {
    return (
      <button
        onClick={() => {
          setOpen(true);
          setMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 group"
        aria-label="Open Circe AI assistant"
      >
        <div
          className={`text-4xl transition-transform duration-300 ${
            circeState === "wave"
              ? "animate-bounce"
              : "group-hover:-translate-y-1 group-hover:scale-110"
          } drop-shadow-2xl`}
        >
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

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col bg-arctic-900 border border-arctic-700 rounded-2xl shadow-2xl shadow-arctic-950 transition-all duration-300 ${
        minimized ? "w-72 h-14" : "w-[340px] sm:w-[400px] h-[560px]"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-arctic-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐻‍❄️</span>
          <div>
            <p className="text-sm font-semibold text-ice">Circe</p>
            {location && !minimized && (
              <p className="text-xs text-arctic-400 truncate max-w-[200px]">
                {location.name ?? `${location.lat.toFixed(2)}°, ${location.lng.toFixed(2)}°`}
              </p>
            )}
          </div>
          <span className="w-2 h-2 rounded-full bg-aurora-green ml-1 animate-pulse-slow" />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1.5 text-arctic-400 hover:text-ice rounded-lg hover:bg-arctic-800 transition-colors"
          >
            {minimized ? <ChevronUp size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 text-arctic-400 hover:text-ice rounded-lg hover:bg-arctic-800 transition-colors"
          >
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
                <p className="text-arctic-300 text-sm">
                  Pin a location on the map first, then ask me anything about it.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <span className="text-lg mr-2 flex-shrink-0 mt-0.5">🐻‍❄️</span>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-aurora-blue text-arctic-950 font-medium rounded-tr-sm"
                      : "bg-arctic-800 text-ice rounded-tl-sm border border-arctic-700"
                  }`}
                >
                  <MessageContent content={msg.content} />
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <span className="text-lg mr-2">🐻‍❄️</span>
                <div className="bg-arctic-800 border border-arctic-700 rounded-2xl rounded-tl-sm">
                  <TypingIndicator />
                </div>
              </div>
            )}

            {location && messages.length === 1 && !loading && (
              <div className="flex flex-col gap-1.5 mt-1">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-xs text-arctic-300 hover:text-aurora-blue bg-arctic-800/50 hover:bg-arctic-800 border border-arctic-700 hover:border-arctic-500 rounded-xl px-3 py-2 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-3 py-3 border-t border-arctic-700 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!location || loading}
              placeholder={
                !location ? "Pin a location first..." : "Ask about this location..."
              }
              className="flex-1 bg-arctic-800 border border-arctic-600 rounded-xl px-3.5 py-2.5 text-sm text-ice placeholder:text-arctic-500 outline-none focus:border-aurora-blue transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading || !location}
              className="flex-shrink-0 bg-aurora-blue disabled:opacity-40 text-arctic-950 rounded-xl p-2.5 transition-all hover:bg-white disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
        </>
      )}
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
            {part.split("\n").map((line, j) => (
              <span key={j}>
                {line}
                {j < part.split("\n").length - 1 && <br />}
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
}
