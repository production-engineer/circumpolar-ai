"use client";

import { useForm, ValidationError } from "@formspree/react";

export default function ProposalContact({ proposalNumber }: { proposalNumber: string }) {
  const [state, handleSubmit] = useForm("mreolobk");

  if (state.succeeded) {
    return (
      <div style={{ marginTop: "12px", background: "rgba(0,196,113,0.08)", border: "1px solid rgba(0,196,113,0.2)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
        <p style={{ fontSize: "14px", color: "#0a121f", fontWeight: 500 }}>Message sent</p>
        <p style={{ fontSize: "13px", color: "#5a6a7a", marginTop: "4px" }}>We'll follow up shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "12px" }}>
      <input type="hidden" name="proposal" value={proposalNumber} />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          style={{ background: "white", border: "1px solid #d8c8b8", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", color: "#0a121f", outline: "none", width: "100%" }}
        />
        <ValidationError field="email" errors={state.errors} style={{ fontSize: "12px", color: "#ef4444" }} />
        <textarea
          name="question"
          placeholder="Any questions?"
          rows={3}
          style={{ background: "white", border: "1px solid #d8c8b8", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", color: "#0a121f", outline: "none", resize: "none", width: "100%" }}
        />
        <ValidationError errors={state.errors} style={{ fontSize: "12px", color: "#ef4444" }} />
        <button
          type="submit"
          disabled={state.submitting}
          style={{ background: "#f2eee7", border: "1px solid #d8c8b8", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 500, color: "#0a121f", cursor: "pointer", opacity: state.submitting ? 0.6 : 1 }}
        >
          {state.submitting ? "Sending…" : "Send a question"}
        </button>
      </div>
    </form>
  );
}
