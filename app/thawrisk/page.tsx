import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata = {
  title: "ThawRisk — Permafrost Monitoring for Arctic Buildings",
  description:
    "Live subsurface temperature monitoring and thaw-risk forecasting for Arctic infrastructure. Early warning before foundations fail.",
};

export default function ThawRiskPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Nav />

      {/* Hero — dark */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden" style={{ background: "#0a121f" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,196,113,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
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
            <Link href="/" className="btn-ghost py-3.5 px-8 text-base">
              Explore the map
            </Link>
          </div>
        </div>
      </section>

      {/* Problem stats — light */}
      <section className="py-20 px-4" style={{ background: "#faf8f5" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">The Problem</p>
            <h2 className="font-display text-4xl" style={{ color: "#0a121f" }}>
              Asset managers are flying blind
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                stat: "0",
                unit: "live sensors",
                desc: "Typical Arctic building operation: no subsurface instrumentation. First indication of failure is a visible crack.",
              },
              {
                stat: "37–92%",
                unit: "bearing capacity loss",
                desc: "How much load strength thawed permafrost can lose. Siberian data averaged 17% loss 1990–2010 — and warming is accelerating.",
              },
              {
                stat: "$300k+",
                unit: "reactive repair cost",
                desc: "Median cost of an emergency foundation repair after failure — before downtime, displacement, or liability are counted.",
              },
            ].map((item) => (
              <div key={item.stat} className="card-light text-center">
                <p className="font-display text-5xl mb-1" style={{ color: "#00c471" }}>{item.stat}</p>
                <p className="text-sm font-semibold mb-3" style={{ color: "#0a121f" }}>{item.unit}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(10,18,31,0.6)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — navy */}
      <section className="py-20 px-4 section-navy">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">How It Works</p>
            <h2 className="font-display text-4xl" style={{ color: "#faf8f5" }}>
              Three data streams. One risk score.
            </h2>
            <p className="text-base mt-4 max-w-2xl mx-auto" style={{ color: "rgba(250,248,245,0.6)" }}>
              Updated daily. Delivered monthly. Alerts fire the moment any metric breaches site-specific thresholds — before surface damage is visible.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌡️",
                title: "Beadedstream sensors",
                desc: "40 thermistors at 10cm spacing measure a full 4m vertical temperature profile, updated every 15 minutes. The only data that shows what's actually happening at foundation depth.",
              },
              {
                icon: "⛅",
                title: "Live weather",
                desc: "OpenWeather API feeds air temperature, precipitation, and solar radiation into active layer depth models. A warm, wet autumn changes the risk picture before the next inspection.",
              },
              {
                icon: "📈",
                title: "Climate projections",
                desc: "CMIP6 / ERA5 scenarios extend the forecast 10–30 years. Risk scores show not just where you are today, but where your building is headed under 2°C and 4°C warming paths.",
              },
            ].map((s) => (
              <div key={s.title} className="card-dark">
                <span className="text-3xl mb-4 block">{s.icon}</span>
                <h3 className="font-body font-semibold text-base mb-3" style={{ color: "#faf8f5" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(250,248,245,0.55)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Failure modes — stone */}
      <section className="py-20 px-4 section-stone">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">What We Catch</p>
            <h2 className="font-display text-4xl" style={{ color: "#0a121f" }}>
              Failure modes in permafrost buildings
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "↕️", name: "Differential settlement", desc: "Uneven thaw tilts and cracks structures; misaligns utility connections." },
              { icon: "⬇️", name: "Bearing capacity loss", desc: "Thawed soil loses 37–92% of load strength — silently, before any visible sign." },
              { icon: "⬆️", name: "Frost heave", desc: "Ice lens growth jacks piles upward progressively, ratcheting over seasons." },
              { icon: "🕳️", name: "Thermokarst", desc: "Sinkholes and ground collapse from ice-rich soil — can appear in weeks." },
              { icon: "💧", name: "Drainage failure", desc: "Subsurface drains designed for frozen conditions stop working as ground thaws." },
              { icon: "🔄", name: "Positive feedback", desc: "Ponded water absorbs solar heat → accelerates thaw → more ponding." },
              { icon: "🔧", name: "Utility rupture", desc: "Water, sewer, and fuel lines break from differential ground movement." },
              { icon: "🏗️", name: "Endogenous loading", desc: "Heated floors and dark roofing accelerate thaw — the building is part of the hazard." },
            ].map((item) => (
              <div key={item.name} className="bg-white rounded-2xl p-5 border border-stone-dark">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <p className="text-sm font-semibold mb-2" style={{ color: "#0a121f" }}>{item.name}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(10,18,31,0.6)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI — dark */}
      <section className="py-20 px-4 section-dark">
        <div className="max-w-4xl mx-auto text-center">
          <p className="eyebrow mb-3">Return on Investment</p>
          <h2 className="font-display text-4xl mb-4" style={{ color: "#faf8f5" }}>
            The math is straightforward
          </h2>
          <p className="text-base mb-12 max-w-2xl mx-auto" style={{ color: "rgba(250,248,245,0.6)" }}>
            A small annual cost eliminates the tail risk of a catastrophic event. For any building above $1M in replacement value, a single avoided failure pays back years of monitoring.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(250,248,245,0.35)" }}>With ThawRisk — $2M building</p>
              {[
                ["Year 0: sensors + monitoring", "~$30k"],
                ["Years 1–3: monitoring", "$30k"],
                ["Year 3: alert → preventive repair", "$50k"],
                ["Total", "$110k"],
              ].map(([label, value], i) => (
                <div key={label} className="flex justify-between py-2" style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span className="text-sm" style={{ color: i === 3 ? "#faf8f5" : "rgba(250,248,245,0.55)" }}>{label}</span>
                  <span className="text-sm font-mono font-semibold" style={{ color: i === 3 ? "#00c471" : "rgba(250,248,245,0.55)" }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(250,248,245,0.35)" }}>Without ThawRisk — $2M building</p>
              {[
                ["Years 0–3: monitoring cost", "$0"],
                ["Year 3: foundation failure", "$350k"],
                ["Downtime + displacement", "unquantified"],
                ["Total", "$350k+"],
              ].map(([label, value], i) => (
                <div key={label} className="flex justify-between py-2" style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <span className="text-sm" style={{ color: i === 3 ? "#faf8f5" : "rgba(250,248,245,0.55)" }}>{label}</span>
                  <span className="text-sm font-mono font-semibold" style={{ color: i === 3 ? "rgba(250,100,100,0.85)" : "rgba(250,248,245,0.55)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl py-5 px-6 inline-block" style={{ background: "rgba(0,196,113,0.08)", border: "1px solid rgba(0,196,113,0.2)" }}>
            <p className="font-display text-3xl" style={{ color: "#00c471" }}>~$240k saved &nbsp;·&nbsp; 220% ROI over 3 years</p>
          </div>
        </div>
      </section>

      {/* Pricing — navy */}
      <section className="py-20 px-4 section-navy">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-3">Pricing</p>
          <h2 className="font-display text-4xl mb-10" style={{ color: "#faf8f5" }}>Simple per-building pricing</h2>
          <div className="rounded-2xl p-10" style={{ background: "rgba(0,196,113,0.06)", border: "1px solid rgba(0,196,113,0.2)" }}>
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
      <section className="py-12 px-4 text-center section-dark" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/" className="text-sm" style={{ color: "rgba(250,248,245,0.35)" }}>
          ← Back to Circumpolar.ai
        </Link>
      </section>
    </div>
  );
}
