"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Industries", href: "/#industries" },
  { label: "Instrumentation", href: "/#instrumentation" },
  { label: "Blog", href: "/blog" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div
        className="max-w-6xl mx-auto flex items-center justify-between rounded-full px-5 py-3 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,18,31,0.9)" : "rgba(10,18,31,0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <a href="/" className="flex items-center gap-2">
          <span className="text-xl">🧭</span>
          <span className="font-display text-lg font-normal" style={{ color: "#faf8f5" }}>
            Circumpolar<span style={{ color: "#00c471" }}>.ai</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm transition-colors"
              style={{ color: "rgba(250,248,245,0.65)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#faf8f5")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(250,248,245,0.65)")}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="/#request-access" className="btn-primary text-sm py-2 px-5">
            Get Early Access
          </a>
        </div>

        <button
          className="md:hidden p-1 transition-colors"
          style={{ color: "#faf8f5" }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          className="md:hidden mt-2 rounded-2xl p-4 flex flex-col gap-3"
          style={{
            background: "rgba(10,18,31,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm py-2 px-3 rounded-xl transition-colors"
              style={{ color: "rgba(250,248,245,0.7)" }}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#request-access"
            className="btn-primary text-sm py-2.5 justify-center mt-1"
            onClick={() => setOpen(false)}
          >
            Get Early Access
          </a>
        </div>
      )}
    </nav>
  );
}
