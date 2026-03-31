"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Industries", href: "#industries" },
  { label: "Data Sources", href: "#data-sources" },
  { label: "Blog", href: "/blog" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between bg-arctic-900/80 backdrop-blur-xl border border-arctic-700 rounded-full px-5 py-3">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">🧭</span>
          <span className="font-bold text-ice text-lg tracking-tight">
            Circumpolar<span className="text-aurora-blue">.ai</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-arctic-200 hover:text-ice transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="#request-access" className="btn-primary text-sm py-2 px-5">
            Get Early Access
          </a>
        </div>

        <button
          className="md:hidden text-ice p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-2 mx-0 bg-arctic-900/95 backdrop-blur-xl border border-arctic-700 rounded-2xl p-4 flex flex-col gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-arctic-200 hover:text-ice py-2 px-3 rounded-xl hover:bg-arctic-800 transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#request-access"
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
