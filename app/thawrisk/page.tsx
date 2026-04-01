import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata = {
  title: "ThawRisk — Permafrost Monitoring for Arctic Buildings",
  description:
    "Live subsurface temperature monitoring and thaw-risk forecasting for Arctic infrastructure. Early warning before foundations fail.",
};

const FAILURE_MODES = [
  {
    category: "Structural",
    items: [
      { name: "Differential settlement", desc: "Uneven thaw tilts and cracks structures; misaligns utility connections." },
      { name: "Bearing capacity loss", desc: "Thawed soil loses 37–92% of load strength. Siberian data: 17% average loss, 1990–2010." },
      { name: "Frost heave", desc: "Ice lens growth jacks piles upward progressively — ratchets over seasons." },
      { name: "Thermokarst", desc: "Sinkholes and ground collapse from ice-rich soil. Can appear in weeks." },
    ],
  },
  {
    category: "Hydrology",
    items: [
      { name: "Drainage failure", desc: "Subsurface drains designed for frozen conditions stop working; water ponds at foundations." },
      { name: "Positive feedback loop", desc: "Ponded water absorbs solar heat → accelerates thaw → more ponding." },
      { name: "Utility rupture", desc: "Water and sewer lines break from differential ground movement." },
    ],
  },
  {
    category: "Secondary",
    items: [
      { name: "Lateral talik formation", desc: "Thaw spreads sideways under foundations, not just downward." },
      { name: "Slope slumping", desc: "Mass wasting on any grade adjacent to the structure." },
      { name: "Endogenous thermal loading", desc: "Heated floors and dark roofing accelerate thaw — the building itself is part of the hazard." },
    ],
  },
];

const ROI_TABLE = [
  { asset: "Commercial building", value: "$1–2M", repair: "$200–500k", eal: "$16–30k", cost: "$10k", benefit: "+$6–20k/yr" },
  { asset: "Community facility", value: "$3–5M", repair: "$400k–1M", eal: "$24–60k", cost: "$10k", benefit: "+$14–50k/yr" },
  { asset: "Powerplant / critical infra", value: "$10–50M", repair: "$1–5M", eal: "$60–250k", cost: "$10k", benefit: "+$50–240k/yr" },
  { asset: "Portfolio (20 buildings)", value: "$20M+", repair: "$3M+ fleet", eal: "$200–400k", cost: "$200k", benefit: "+$0–200k/yr" },
];

export default function ThawRiskPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a121f", color: "#faf8f5" }}>
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-24 px-4" style={{ background: "#0a121f" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="eyebrow mb-4">ThawRisk</p>
          <h1 className="font-display text-5xl sm:text-6xl leading-tight mb-6" style={{ color: "#faf8f5" }}>
            Your buildings sit on thawing ground.
            <br />
            <span style={{ color: "#00c471" }}>You have no live data on what's below.</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-10" style={{ color: "rgba(250,248,245,0.65)" }}>
            ThawRisk fuses live subsurface temperature profiles, real-time weather, and climate projections into a continuous risk score per building. Early warning turns a $350k reactive repair into a $50k preventive fix.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#request-access" className="btn-primary py-3.5 px-8 text-base">
              Request access
            </Link>
            <a
              href="/roi-calculator.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost py-3.5 px-8 text-base"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#faf8f5" }}
            >
              Open ROI calculator
            </a>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-4" style={{ background: "#faf8f5" }}>
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-3" style={{ color: "#00c471" }}>The Problem</p>
          <h2 className="font-display text-4xl mb-6" style={{ color: "#0a121f" }}>
            Asset managers are flying blind
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              {
                stat: "0",
                unit: "live sensors",
                desc: "Typical Arctic building operation: no subsurface instrumentation. First indication of failure is a visible crack.",
              },
              {
                stat: "37–92%",
                unit: "bearing capacity loss",
                desc: "How much load strength thawed permafrost can lose. The range depends on soil type and ice content — both unknown without measurement.",
              },
              {
                stat: "$300k+",
                unit: "reactive repair",
                desc: "Median cost of an emergency foundation repair after failure. Doesn't include downtime, displacement, or liability.",
              },
            ].map((item) => (
              <div key={item.stat} className="card-light p-6 rounded-2xl" style={{ border: "1px solid #e3ddd3" }}>
                <p className="font-display text-5xl mb-1" style={{ color: "#00c471" }}>{item.stat}</p>
                <p className="text-sm font-semibold mb-3" style={{ color: "#0a121f" }}>{item.unit}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(10,18,31,0.6)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 px-4" style={{ background: "#162235" }}>
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-3">How It Works</p>
          <h2 className="font-display text-4xl mb-4" style={{ color: "#faf8f5" }}>
            Three data streams. One risk score.
          </h2>
          <p className="text-base mb-12 max-w-2xl" style={{ color: "rgba(250,248,245,0.6)" }}>
            ThawRisk combines live hardware data with weather and climate projections to produce a continuous per-building risk assessment — updated daily, delivered monthly.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌡️",
                title: "Beadedstream sensors",
                desc: "40 thermistors at 10cm spacing measure a full 4m vertical temperature profile. Updated every 15 minutes. This is the only data source that shows what's actually happening at foundation depth.",
              },
              {
                icon: "⛅",
                title: "Live weather",
                desc: "OpenWeather API feeds air temperature, precipitation, and solar radiation into active layer depth models. Short-term weather drives short-term risk — a warm, wet autumn changes the picture.",
              },
              {
                icon: "📈",
                title: "Climate projections",
                desc: "CMIP6 / ERA5 scenarios extend the forecast 10–30 years. Risk scores show not just where you are today, but where your building is headed under 2°C and 4°C warming paths.",
              },
            ].map((s) => (
              <div key={s.title} className="card-dark rounded-2xl p-6">
                <span className="text-3xl mb-4 block">{s.icon}</span>
                <h3 className="font-body font-semibold text-base mb-3" style={{ color: "#faf8f5" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(250,248,245,0.55)" }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl p-6" style={{ background: "rgba(0,196,113,0.06)", border: "1px solid rgba(0,196,113,0.2)" }}>
            <p className="text-sm font-semibold mb-2" style={{ color: "#00c471" }}>What ThawRisk detects</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(250,248,245,0.6)" }}>
              Active layer depth — thaw trajectory — differential settlement probability — drainage saturation index. Alerts fire when any metric breaches site-specific thresholds, before surface failure is visible.
            </p>
          </div>
        </div>
      </section>

      {/* Failure modes */}
      <section className="py-20 px-4" style={{ background: "#f2eee7" }}>
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-3" style={{ color: "#00c471" }}>What We Catch</p>
          <h2 className="font-display text-4xl mb-10" style={{ color: "#0a121f" }}>
            Failure modes in permafrost buildings
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {FAILURE_MODES.map((group) => (
              <div key={group.category}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "rgba(10,18,31,0.4)" }}>
                  {group.category}
                </p>
                <div className="flex flex-col gap-4">
                  {group.items.map((item) => (
                    <div key={item.name}>
                      <p className="text-sm font-semibold mb-1" style={{ color: "#0a121f" }}>{item.name}</p>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(10,18,31,0.6)" }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-20 px-4" style={{ background: "#0a121f" }}>
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-3">Return on Investment</p>
          <h2 className="font-display text-4xl mb-4" style={{ color: "#faf8f5" }}>
            The math is straightforward
          </h2>
          <p className="text-base mb-10 max-w-2xl" style={{ color: "rgba(250,248,245,0.6)" }}>
            The value of ThawRisk is asymmetric: a small annual cost eliminates the tail risk of a catastrophic event. For any building above $1M in replacement value, the numbers work.
          </p>

          <div className="rounded-2xl p-6 mb-10" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "rgba(250,248,245,0.5)" }}>Payback example — commercial building, $2M replacement value</p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(250,248,245,0.35)" }}>With ThawRisk</p>
                {[
                  { label: "Year 0: sensors + first year monitoring", value: "~$30k" },
                  { label: "Years 1–3: monitoring", value: "$30k" },
                  { label: "Year 3: alert fires → preventive repair", value: "$50k" },
                  { label: "Total spent", value: "$110k", highlight: true },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between py-2 border-b border-white/[0.05]">
                    <span className="text-sm" style={{ color: r.highlight ? "#faf8f5" : "rgba(250,248,245,0.55)" }}>{r.label}</span>
                    <span className="text-sm font-mono" style={{ color: r.highlight ? "#00c471" : "rgba(250,248,245,0.55)" }}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(250,248,245,0.35)" }}>Without ThawRisk</p>
                {[
                  { label: "Years 0–3: monitoring cost", value: "$0" },
                  { label: "Year 3: foundation failure event", value: "$350k" },
                  { label: "3 months downtime / displacement", value: "unquantified" },
                  { label: "Total spent", value: "$350k+", highlight: true },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between py-2 border-b border-white/[0.05]">
                    <span className="text-sm" style={{ color: r.highlight ? "#faf8f5" : "rgba(250,248,245,0.55)" }}>{r.label}</span>
                    <span className="text-sm font-mono" style={{ color: r.highlight ? "rgba(250,100,100,0.9)" : "rgba(250,248,245,0.55)" }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-sm font-semibold" style={{ color: "#faf8f5" }}>Net saved</span>
              <span className="font-display text-2xl" style={{ color: "#00c471" }}>~$240k &nbsp;·&nbsp; 220% ROI over 3 years</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  {["Asset Class", "Asset Value", "Reactive Repair", "Annual Expected Loss", "ThawRisk Cost", "Net Annual Benefit"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: "rgba(250,248,245,0.45)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROI_TABLE.map((row, i) => (
                  <tr key={row.asset} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: "#faf8f5" }}>{row.asset}</td>
                    <td className="px-4 py-3 font-mono" style={{ color: "rgba(250,248,245,0.6)" }}>{row.value}</td>
                    <td className="px-4 py-3 font-mono" style={{ color: "rgba(250,248,245,0.6)" }}>{row.repair}</td>
                    <td className="px-4 py-3 font-mono" style={{ color: "rgba(250,248,245,0.6)" }}>{row.eal}</td>
                    <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#faf8f5" }}>{row.cost}</td>
                    <td className="px-4 py-3 font-mono font-semibold" style={{ color: "#00c471" }}>{row.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/roi-calculator.html"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex py-3 px-8"
            >
              Run your own numbers →
            </a>
          </div>
        </div>
      </section>

      {/* Underwriters */}
      <section className="py-20 px-4" style={{ background: "#faf8f5" }}>
        <div className="max-w-5xl mx-auto">
          <p className="eyebrow mb-3" style={{ color: "#00c471" }}>For Underwriters</p>
          <h2 className="font-display text-4xl mb-6" style={{ color: "#0a121f" }}>
            Price Arctic risk accurately for the first time
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Adverse selection defense", desc: "Asset owners already know if their building is failing. Without subsurface data, you're pricing against their private knowledge." },
              { title: "Accurate premium calibration", desc: "ThawRisk scores give you the first objective, sensor-based risk signal per building — not just latitude and vintage." },
              { title: "Portfolio data licensing", desc: "Fleet-level permafrost risk data across multiple sites. Potentially higher margin than per-building monitoring. Pricing on request." },
            ].map((c) => (
              <div key={c.title} className="card-light rounded-2xl p-6" style={{ border: "1px solid #e3ddd3" }}>
                <h3 className="font-body font-semibold text-base mb-3" style={{ color: "#0a121f" }}>{c.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(10,18,31,0.6)" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4" style={{ background: "#162235" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-3">Pricing</p>
          <h2 className="font-display text-4xl mb-4" style={{ color: "#faf8f5" }}>Simple per-building pricing</h2>
          <div className="rounded-2xl p-10 mt-8" style={{ background: "rgba(0,196,113,0.06)", border: "1px solid rgba(0,196,113,0.2)" }}>
            <p className="font-display text-7xl mb-2" style={{ color: "#00c471" }}>$10k</p>
            <p className="text-lg mb-1" style={{ color: "#faf8f5" }}>per building / per year</p>
            <p className="text-sm mb-8" style={{ color: "rgba(250,248,245,0.5)" }}>Beadedstream sensor hardware sold separately</p>
            <ul className="text-sm text-left max-w-sm mx-auto flex flex-col gap-3 mb-8">
              {[
                "Continuous risk score dashboard",
                "Monthly status emails",
                "Annual ThawRisk Report (PDF)",
                "Alert notifications on threshold breach",
                "Portfolio discounts for 10+ buildings",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span style={{ color: "#00c471" }}>✓</span>
                  <span style={{ color: "rgba(250,248,245,0.7)" }}>{f}</span>
                </li>
              ))}
            </ul>
            <Link href="/#request-access" className="btn-primary py-3.5 px-10">
              Request early access
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 text-center" style={{ background: "#0a121f", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" className="text-sm" style={{ color: "rgba(250,248,245,0.35)" }}>
          ← Back to Circumpolar.ai
        </Link>
      </section>
    </div>
  );
}
