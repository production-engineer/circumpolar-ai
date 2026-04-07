"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { CheckCircle, ExternalLink, Loader } from "lucide-react";

type Phase = "idle" | "form" | "done";

type Props = {
  proposalId: string;
  proposalTitle: string;
};

export default function AcceptProposal({ proposalId, proposalTitle }: Props) {
  const { data: session, status } = useSession();
  const [phase, setPhase] = useState<Phase>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [stripeLink, setStripeLink] = useState<string | undefined>();
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (phase === "done") {
    return (
      <div className="rounded-xl border border-aurora/30 bg-aurora/5 p-6 text-center">
        <CheckCircle size={32} className="text-aurora mx-auto mb-3" />
        <p className="font-display text-lg text-warm-white mb-1">Proposal accepted</p>
        <p className="text-sm text-ice-light/60 mb-4">
          A confirmation has been sent to {session?.user?.email}. Erik will be in touch within 1
          business day to set up payment and agree on a start date.
        </p>
        {stripeLink && (
          <a
            href={stripeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-aurora text-midnight px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-aurora/90 transition-colors"
          >
            Set up payment <ExternalLink size={14} />
          </a>
        )}
      </div>
    );
  }

  if (phase === "form") {
    const handleSubmit = async () => {
      if (!signerName.trim() || !agreed) return;
      setError(null);
      setSubmitting(true);
      try {
        const res = await fetch(`/api/proposals/${proposalId}/accept`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ signerName, signerTitle }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        setStripeLink(data.stripePaymentLink);
        setPhase("done");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="rounded-xl border border-navy-light bg-navy p-6">
        <p className="text-sm font-semibold text-warm-white mb-4">Sign as</p>
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs text-ice-light/60 mb-1">Full name *</label>
            <input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-midnight border border-navy-light rounded-lg px-3 py-2 text-sm text-warm-white placeholder-ice-light/30 focus:outline-none focus:border-aurora"
            />
          </div>
          <div>
            <label className="block text-xs text-ice-light/60 mb-1">Title / role</label>
            <input
              type="text"
              value={signerTitle}
              onChange={(e) => setSignerTitle(e.target.value)}
              placeholder="e.g. CEO, CTO"
              className="w-full bg-midnight border border-navy-light rounded-lg px-3 py-2 text-sm text-warm-white placeholder-ice-light/30 focus:outline-none focus:border-aurora"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 accent-aurora"
          />
          <span className="text-xs text-ice-light/70">
            I have read and agree to the scope, terms, and conditions in this proposal. I am
            authorized to enter into this agreement on behalf of my organization.
          </span>
        </label>

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => setPhase("idle")}
            className="flex-1 border border-navy-light text-ice-light/60 rounded-lg px-4 py-2.5 text-sm hover:border-aurora/30 transition-colors"
          >
            Back
          </button>
          <button
            disabled={!signerName.trim() || !agreed || submitting}
            onClick={handleSubmit}
            className="flex-1 bg-aurora text-midnight rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-aurora/90 transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader size={14} className="animate-spin" /> Signing…
              </>
            ) : (
              "Sign & accept"
            )}
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="rounded-xl border border-navy-light bg-navy/50 p-6 text-center">
        <Loader size={20} className="text-aurora/60 animate-spin mx-auto" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-xl border border-navy-light bg-navy p-6 text-center">
        <p className="text-sm text-ice-light/70 mb-4">
          Sign in to accept <span className="text-warm-white">{proposalTitle}</span>
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => signIn("github")}
            className="flex items-center gap-2 bg-[#24292e] hover:bg-[#2f363d] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            GitHub
          </button>
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 rounded-lg px-4 py-2 text-sm font-medium transition-colors border border-gray-200"
          >
            Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-navy-light bg-navy p-6">
      <div className="flex items-center gap-3 mb-4">
        {session.user?.image && (
          <img
            src={session.user.image}
            alt=""
            className="w-8 h-8 rounded-full border border-navy-light"
          />
        )}
        <div>
          <p className="text-sm text-warm-white">{session.user?.name}</p>
          <p className="text-xs text-ice-light/50">{session.user?.email}</p>
        </div>
      </div>
      <button
        onClick={() => setPhase("form")}
        className="w-full bg-aurora text-midnight rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-aurora/90 transition-colors"
      >
        Review & accept this proposal
      </button>
    </div>
  );
}
