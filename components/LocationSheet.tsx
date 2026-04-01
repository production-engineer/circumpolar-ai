"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import type { PinnedLocation } from "./MapPicker";
import { getDemoResponse } from "@/lib/demo-responses";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "What's the permafrost risk here?",
  "Is there cellular coverage?",
  "Current weather conditions?",
  "Sea ice data for this area?",
  "Suitable for construction?",
];

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-1 py-2">
      <span className="typing-dot w-2 h-2 rounded-full bg-aurora" />
      <span className="typing-dot w-2 h-2 rounded-full bg-aurora" />
      <span className="typing-dot w-2 h-2 rounded-full bg-aurora" />
    </div>
  );
}

const URL_SPLIT = /(https?:\/\/[^\s]+)/;

function MessageContent({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((line, i, arr) => {
        const parts = line.split(URL_SPLIT);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? (
                <a
                  key={j}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#00c471", textDecoration: "underline", textUnderlineOffset: "2px" }}
                >
                  {part}
                </a>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
            {i < arr.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

interface LocationSheetProps {
  location: PinnedLocation | null;
  onClose: () => void;
}

export default function LocationSheet({ location, onClose }: LocationSheetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location) {
      setMessages([{
        role: "assistant",
        content: `Hi, I'm Circe. I've got data for ${location.name ?? `${location.lat.toFixed(3)}°N, ${location.lng.toFixed(3)}°E`}. What would you like to know?`,
      }]);
      setVisible(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setVisible(false);
    }
  }, [location]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const close = () => { setVisible(false); setTimeout(onClose, 300); };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || !location) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));

    const response = getDemoResponse(text, location);

    setLoading(false);
    let streamed = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    for (let i = 0; i < response.length; i++) {
      await new Promise((r) => setTimeout(r, 8));
      streamed += response[i];
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: streamed };
        return updated;
      });
    }
  };

  if (!location) return null;

  return (
    <>
      <div
        className={`hidden sm:block fixed inset-0 z-40 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={close}
      />
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 flex flex-col bg-midnight border-t border-white/10 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out
          sm:left-auto sm:right-6 sm:bottom-6 sm:w-[420px] sm:rounded-2xl sm:border sm:border-white/10 sm:max-h-[70vh]
          ${visible ? "translate-y-0" : "translate-y-full sm:translate-y-8 sm:opacity-0"}`}
        style={{ maxHeight: "75vh" }}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-start justify-between px-4 pt-3 pb-3 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐻</span>
            <div>
              <p className="font-body text-sm font-semibold text-white flex items-center gap-1.5">
                Circe
                <span className="w-1.5 h-1.5 rounded-full bg-aurora animate-pulse-slow" />
              </p>
              <p className="font-body text-xs text-white/40 mt-0.5 max-w-[260px] truncate">
                📍 {location.name ?? `${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E`}
              </p>
            </div>
          </div>
          <button onClick={close} className="p-1.5 text-white/30 hover:text-white rounded-lg hover:bg-white/[0.08] transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto chat-scroll px-4 py-3 flex flex-col gap-3 min-h-0">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && <span className="text-lg mr-2 flex-shrink-0 mt-0.5">🐻</span>}
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 font-body text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-aurora text-midnight font-medium rounded-tr-sm"
                  : "bg-white/[0.06] text-white/90 rounded-tl-sm border border-white/[0.08]"
              }`}>
                <MessageContent content={msg.content} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <span className="text-lg mr-2">🐻</span>
              <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl rounded-tl-sm px-3">
                <TypingIndicator />
              </div>
            </div>
          )}

          {messages.length === 1 && !loading && (
            <div className="flex flex-wrap gap-2 mt-1">
              {SUGGESTED.map((s) => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="font-body text-xs text-white/50 hover:text-aurora bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-aurora/30 rounded-full px-3 py-1.5 transition-all">
                  {s}
                </button>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex items-center gap-2 px-3 py-3 border-t border-white/[0.08] flex-shrink-0">
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
            disabled={loading} placeholder="Ask about this location..."
            className="font-body flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-aurora/40 transition-colors disabled:opacity-50" />
          <button type="submit" disabled={!input.trim() || loading}
            className="flex-shrink-0 bg-aurora disabled:opacity-40 text-midnight rounded-xl p-2.5 transition-all hover:bg-aurora-muted disabled:cursor-not-allowed">
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}
