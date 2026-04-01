"use client";

import { useForm, ValidationError } from "@formspree/react";
import { ArrowRight } from "lucide-react";

const inputStyle = { background: "#fff", border: "1px solid #e3ddd3", color: "#0a121f" };

export default function AccessForm() {
  const [state, handleSubmit] = useForm("mreolobk");

  if (state.succeeded) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ background: "rgba(0,196,113,0.08)", border: "1px solid rgba(0,196,113,0.2)" }}
      >
        <span className="text-4xl mb-4 block">🐻‍❄️</span>
        <h3 className="font-display text-2xl mb-2" style={{ color: "#0a121f" }}>
          You're on the list
        </h3>
        <p className="text-sm" style={{ color: "rgba(10,18,31,0.6)" }}>
          We'll follow up within 48 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
      <p className="text-xs" style={{ color: "rgba(10,18,31,0.4)" }}>
        * Email is the only required field
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={inputStyle}
        />
        <div className="flex flex-col gap-1">
          <input
            type="email"
            name="email"
            placeholder="Work email *"
            required
            className="rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            style={inputStyle}
          />
          <ValidationError field="email" errors={state.errors} className="text-xs text-red-500" />
        </div>
      </div>

      <input
        type="text"
        name="company"
        placeholder="Company"
        className="rounded-xl px-4 py-3 text-sm outline-none transition-colors"
        style={inputStyle}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <select
          name="role"
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={{ ...inputStyle, color: "rgba(10,18,31,0.6)" }}
        >
          <option value="">Role</option>
          <option>Engineer</option>
          <option>Project Manager</option>
          <option>Executive / C-Suite</option>
          <option>Underwriter / Risk Analyst</option>
          <option>Researcher / Academic</option>
          <option>Consultant</option>
          <option>Other</option>
        </select>

        <select
          name="industry"
          className="rounded-xl px-4 py-3 text-sm outline-none transition-colors"
          style={{ ...inputStyle, color: "rgba(10,18,31,0.6)" }}
        >
          <option value="">Industry</option>
          <option>Infrastructure / Construction</option>
          <option>Mining</option>
          <option>Oil & Gas</option>
          <option>Insurance / Finance</option>
          <option>Shipping / Maritime</option>
          <option>Government / Defense</option>
          <option>Telecom</option>
          <option>Research / Academia</option>
          <option>Other</option>
        </select>
      </div>

      <textarea
        name="use_case"
        placeholder="What are you working on? (optional)"
        rows={3}
        className="rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
        style={inputStyle}
      />

      <ValidationError errors={state.errors} className="text-xs text-red-500" />

      <button
        type="submit"
        disabled={state.submitting}
        className="btn-primary justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state.submitting ? "Sending…" : "Request early access"}
        {!state.submitting && <ArrowRight size={16} />}
      </button>

      <p className="text-xs text-center" style={{ color: "rgba(10,18,31,0.4)" }}>
        No spam. We'll respond within 48 hours.
      </p>
    </form>
  );
}
