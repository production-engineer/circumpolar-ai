import { notFound } from "next/navigation";
import { getProposal, listProposals } from "@/lib/proposals";

export function generateStaticParams() {
  return listProposals().map((p) => ({ id: p.id }));
}
import AcceptProposal from "@/components/AcceptProposal";
import SessionProvider from "@/components/SessionProvider";
import ProposalContact from "@/components/ProposalContact";

type Props = { params: { id: string } };

export function generateMetadata({ params }: Props) {
  const proposal = getProposal(params.id);
  if (!proposal) return {};
  return { title: `${proposal.title} — ${proposal.to.name} · Circumpolar.ai` };
}

export default function ProposalPage({ params }: Props) {
  const p = getProposal(params.id);
  if (!p) notFound();

  return (
    <SessionProvider>
      <style>{`
        body { background: #f2eee7 !important; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#f2eee7", color: "#1a1a2e", fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "16px" }}>
        <div className="max-w-[900px] mx-auto px-6 py-10">

          {/* Dual branding header */}
          <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "24px", borderBottom: "2px solid #0a121f", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "22px", color: "#0a121f" }}>
                circumpolar<span style={{ color: "#00c471" }}>.ai</span>
              </span>
              <span style={{ color: "#c8bfb0", fontSize: "18px" }}>×</span>
              <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "22px", color: "#07559B" }}>
                beadedstream
              </span>
            </div>
            <span style={{ fontSize: "12px", color: "#5a6a7a", background: "white", border: "1px solid #d8e4ee", borderRadius: "999px", padding: "4px 14px" }}>
              Proposal #{p.number}
            </span>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "40px", alignItems: "start" }}>

            {/* Left: proposal content */}
            <div>
              {/* Parties */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "32px" }}>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#00c471", marginBottom: "6px" }}>From</div>
                  <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "20px", color: "#0a121f", marginBottom: "4px" }}>{p.from.name}</div>
                  <div style={{ fontSize: "14px", color: "#5a6a7a", lineHeight: 1.7 }}>
                    {p.from.contact}<br />{p.from.location}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#07559B", marginBottom: "6px" }}>Prepared for</div>
                  <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "20px", color: "#0a121f", marginBottom: "4px" }}>{p.to.name}</div>
                  <div style={{ fontSize: "14px", color: "#5a6a7a", lineHeight: 1.7 }}>{p.to.description}</div>
                </div>
              </div>

              {/* Title block */}
              <div style={{ background: "#0a121f", color: "white", borderRadius: "12px", padding: "28px 32px", marginBottom: "36px" }}>
                <h1 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "30px", fontWeight: 400, marginBottom: "10px" }}>{p.title}</h1>
                <p style={{ fontSize: "15px", color: "#94b3c4", maxWidth: "520px", lineHeight: 1.65 }}>{p.tagline}</p>
                <div style={{ display: "inline-flex", alignItems: "baseline", gap: "4px", marginTop: "18px", background: "#00c471", color: "#0a121f", borderRadius: "8px", padding: "8px 16px" }}>
                  <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "26px" }}>{p.priceLabel}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{p.pricePeriod}</span>
                </div>
              </div>

              {/* Opportunity */}
              <section style={{ marginBottom: "36px" }}>
                <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "19px", fontWeight: 400, color: "#0a121f", borderBottom: "1px solid #d8c8b8", paddingBottom: "8px", marginBottom: "16px" }}>The opportunity</h2>
                {p.summary.map((para, i) => (
                  <p key={i} style={{ fontSize: "15px", color: "#2e3a48", marginBottom: "12px", lineHeight: 1.7 }}>{para}</p>
                ))}
              </section>

              {/* Work areas */}
              <section style={{ marginBottom: "36px" }}>
                <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "19px", fontWeight: 400, color: "#0a121f", borderBottom: "1px solid #d8c8b8", paddingBottom: "8px", marginBottom: "8px" }}>Work areas</h2>
                {p.deliverables.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", padding: "18px 0", borderBottom: "1px solid #d8c8b8" }}>
                    <div style={{ flexShrink: 0, width: "30px", height: "30px", background: "white", border: "1px solid #d8c8b8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "#5a6a7a", marginTop: "2px" }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#0a121f", marginBottom: "5px" }}>{d.title}</h3>
                      <p style={{ fontSize: "14px", color: "#5a6a7a", lineHeight: 1.65, marginBottom: "6px" }}>{d.description}</p>
                      <span style={{ fontSize: "13px", color: "#07559B", fontWeight: 500 }}>{d.outcome}</span>
                    </div>
                  </div>
                ))}
              </section>

              {/* Out of scope */}
              <section style={{ marginBottom: "36px" }}>
                <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "19px", fontWeight: 400, color: "#0a121f", borderBottom: "1px solid #d8c8b8", paddingBottom: "8px", marginBottom: "16px" }}>Out of scope</h2>
                <div style={{ background: "white", border: "1px solid #d8c8b8", borderRadius: "10px", padding: "20px 24px" }}>
                  <ul style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", listStyle: "none", padding: 0, margin: 0 }}>
                    {p.outOfScope.map((item, i) => (
                      <li key={i} style={{ fontSize: "14px", color: "#5a6a7a", paddingLeft: "14px", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0 }}>–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Terms link */}
              <section style={{ marginBottom: "36px" }}>
                <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "19px", fontWeight: 400, color: "#0a121f", borderBottom: "1px solid #d8c8b8", paddingBottom: "8px", marginBottom: "16px" }}>Terms & conditions</h2>
                <p style={{ fontSize: "15px", color: "#2e3a48", lineHeight: 1.7 }}>
                  The full terms and conditions for this engagement are available here:{" "}
                  <a href={p.termsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#07559B", textDecoration: "underline" }}>
                    Terms & Conditions →
                  </a>
                </p>
              </section>

              <p style={{ fontSize: "13px", color: "#8a8a8a" }}>
                Issued {p.issuedAt} · Valid until {p.validUntil}
              </p>
            </div>

            {/* Right: sticky sidebar */}
            <div style={{ position: "sticky", top: "32px" }}>
              <div style={{ background: "#0a121f", borderRadius: "12px", padding: "20px", marginBottom: "12px" }}>
                <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: "16px", color: "white", marginBottom: "4px" }}>{p.title}</p>
                <p style={{ fontSize: "13px", color: "#94b3c4", marginBottom: "12px" }}>{p.to.name}</p>
                <div style={{ fontSize: "26px", fontFamily: "'Instrument Serif', Georgia, serif", color: "#00c471" }}>
                  {p.priceLabel} <span style={{ fontSize: "14px", color: "#94b3c4" }}>{p.pricePeriod}</span>
                </div>
              </div>

              <AcceptProposal proposalId={p.id} proposalTitle={p.title} />

              <ProposalContact proposalNumber={p.number} />
            </div>

          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
