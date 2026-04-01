import {
  ArrowRight,
  Satellite,
  Building2,
  Ship,
  Shield,
  Wifi,
  FlaskConical,
  BarChart3,
  Globe,
  MapPin,
  MessageSquare,
  Zap,
  Thermometer,
  Activity,
  Radio,
  Layers,
  AlertCircle,
  TrendingDown,
  Vibrate,
  Wind,
  Anchor,
  Droplets,
} from "lucide-react";
import Link from "next/link";
import Nav from "@/components/Nav";
import HeroMap from "@/components/HeroMap";
import AccessForm from "@/components/AccessForm";
import { posts } from "@/lib/blog-posts";

const industries = [
  {
    icon: <Building2 size={22} />,
    name: "Infrastructure & Mining",
    description:
      "Ground stability, permafrost risk, frost heave potential, and active layer depth for any project site.",
  },
  {
    icon: <Ship size={22} />,
    name: "Maritime & Shipping",
    description:
      "Sea ice forecasts, navigation windows, port accessibility, and route risk for Arctic voyages.",
  },
  {
    icon: <Shield size={22} />,
    name: "Insurance & Risk",
    description:
      "Site-specific risk profiles for underwriters, asset managers, and ESG frameworks covering climate exposure.",
  },
  {
    icon: <Wifi size={22} />,
    name: "Telecom & Connectivity",
    description:
      "Cellular coverage gaps, tower placement analysis, satellite fallback options, and signal modeling.",
  },
  {
    icon: <FlaskConical size={22} />,
    name: "Research & Academia",
    description:
      "Fast access to multi-source Arctic datasets with no API juggling — perfect for field planning and analysis.",
  },
  {
    icon: <Satellite size={22} />,
    name: "Government & Defense",
    description:
      "Sovereignty monitoring, SAR mission planning, environmental baselines, and Arctic situational awareness.",
  },
];

const dataSources = [
  { name: "NSIDC", desc: "Sea ice & permafrost", logo: "🛰️" },
  { name: "Copernicus", desc: "Sentinel SAR & optical", logo: "🇪🇺" },
  { name: "ArcticDEM", desc: "2m elevation", logo: "⛰️" },
  { name: "MET Norway", desc: "Arctic weather", logo: "🌤️" },
  { name: "OpenCelliD", desc: "Cell tower data", logo: "📡" },
  { name: "EMODnet", desc: "Bathymetry", logo: "🌊" },
  { name: "USGS", desc: "Alaska terrain", logo: "🗺️" },
  { name: "GTN-P", desc: "Permafrost boreholes", logo: "🌡️" },
];

const steps = [
  {
    icon: <MapPin size={20} />,
    num: "01",
    title: "Pin your location",
    desc: "Click anywhere on the Arctic map — coastal, inland, or offshore. No GIS skills required.",
  },
  {
    icon: <MessageSquare size={20} />,
    num: "02",
    title: "Ask anything",
    desc: "Ask Circe plain questions. \"Is this suitable for a pipeline?\" \"When does sea ice clear here?\"",
  },
  {
    icon: <Zap size={20} />,
    num: "03",
    title: "Get data-backed answers",
    desc: "Circe pulls from 8+ Arctic data sources and gives specific, cite-able answers in seconds.",
  },
];

const sensors = [
  {
    icon: <Thermometer size={22} />,
    name: "Permafrost temperature strings",
    description:
      "Thermistor chains installed at 2–20m depth give continuous ground temperature profiles — the earliest warning of active layer deepening before surface deformation begins.",
    detail: "GTN-P protocol · 15-min intervals",
  },
  {
    icon: <Activity size={22} />,
    name: "Tiltmeters & inclinometers",
    description:
      "Detect slope creep, frost heave, and structural tilt on foundations and embankments to sub-milliradian precision. Ideal for pipeline supports, bridge abutments, and retaining structures.",
    detail: "±0.001° resolution · solar-powered",
  },
  {
    icon: <Layers size={22} />,
    name: "InSAR satellite monitoring",
    description:
      "Sentinel-1 repeat-pass SAR interferometry measures millimeter-scale ground deformation across entire sites from orbit. No ground access needed — critical for remote or inaccessible terrain.",
    detail: "12-day revisit · 20m pixel · free archive",
  },
  {
    icon: <Radio size={22} />,
    name: "IoT soil moisture & frost depth",
    description:
      "Low-cost capacitive sensors in a wireless mesh track active layer thickness and soil moisture seasonally. Informs drainage design and freeze-thaw cycle modeling at centimeter resolution.",
    detail: "LoRaWAN · 5km range · 2-year battery",
  },
  {
    icon: <AlertCircle size={22} />,
    name: "Crack & displacement gauges",
    description:
      "Linear potentiometers and digital crack sensors across structural joints catch differential settlement early. Trigger alerts before damage becomes costly to repair.",
    detail: "0.1mm resolution · real-time alert",
  },
  {
    icon: <TrendingDown size={22} />,
    name: "Drone thermal imaging",
    description:
      "Annual FLIR surveys reveal near-surface ice distribution, subsurface voids, and anomalous thaw patches invisible to satellite. Fast, cost-effective ground truth for pre-construction planning.",
    detail: "FLIR Zenmuse · 5cm GSD · repeatable transects",
  },
  {
    icon: <Vibrate size={22} />,
    name: "Vibration monitoring",
    description:
      "Geophone arrays and MEMS accelerometers detect micro-seismic events, blasting impacts, and equipment vibration at sensitive infrastructure. Essential for pipelines, bridges, and buildings near active operations.",
    detail: "1Hz–1kHz · continuous logging · alert threshold",
  },
  {
    icon: <Wind size={22} />,
    name: "Weather stations",
    description:
      "On-site automatic weather stations measure air temperature, wind speed and direction, precipitation, humidity, and solar radiation. Ground-truth data that corrects model biases in complex Arctic terrain.",
    detail: "WMO-compliant · solar + battery · LTE/Iridium backhaul",
  },
  {
    icon: <Anchor size={22} />,
    name: "Water quality buoys",
    description:
      "Moored instruments track temperature profiles, dissolved oxygen, turbidity, conductivity, and pH in Arctic lakes, rivers, and coastal waters. Critical for permafrost thaw lake monitoring and baseline assessments.",
    detail: "Multi-parameter sonde · seasonal deployment",
  },
  {
    icon: <Droplets size={22} />,
    name: "Radar stream gauging",
    description:
      "Non-contact surface velocity radar measures stream flow without in-channel sensors — no ice jamming, no maintenance windows. Provides continuous discharge data through breakup and freeze-up.",
    detail: "24GHz Doppler · ±1% velocity accuracy · remote access",
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />

      {/* Hero — dark */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden" style={{ background: "#0a121f" }}>
        {/* Subtle aurora gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,196,113,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 30%, rgba(211,232,247,0.06) 0%, transparent 50%)",
          }}
        />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <span className="w-2 h-2 rounded-full bg-aurora animate-pulse" />
              <span className="text-xs font-medium" style={{ color: "rgba(250,248,245,0.7)" }}>
                Early Access Open — Arctic Intelligence Platform
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5" style={{ color: "#faf8f5" }}>
              Arctic intelligence{" "}
              <em className="not-italic" style={{ color: "#00c471" }}>at your fingertips</em>
            </h1>

            <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8" style={{ color: "rgba(250,248,245,0.65)" }}>
              Pin any location above 60°N. Ask our AI assistant anything — permafrost risk, sea ice, weather, cellular coverage, terrain. Get answers backed by 8+ public datasets in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#map-tool" className="btn-primary">
                Try the map <ArrowRight size={16} />
              </a>
              <a href="#request-access" className="btn-ghost">
                Request early access
              </a>
            </div>
          </div>

          <div id="map-tool">
            <HeroMap />
          </div>

          <p className="text-center text-xs mt-3" style={{ color: "rgba(250,248,245,0.3)" }}>
            🐻 Click the map · Circe opens automatically with Arctic data for your pinned location
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 px-4" style={{ background: "#162235", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest mb-6" style={{ color: "rgba(250,248,245,0.3)" }}>
            Data from trusted public sources
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {dataSources.map((s) => (
              <div key={s.name} className="flex items-center gap-2 transition-colors" style={{ color: "rgba(250,248,245,0.5)" }}>
                <span className="text-lg">{s.logo}</span>
                <div>
                  <p className="text-sm font-semibold leading-none" style={{ color: "rgba(250,248,245,0.8)" }}>{s.name}</p>
                  <p className="text-xs" style={{ color: "rgba(250,248,245,0.4)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — light */}
      <section id="how-it-works" className="py-24 px-4" style={{ background: "#faf8f5" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="font-display text-3xl sm:text-4xl" style={{ color: "#0a121f" }}>
              From question to answer in 30 seconds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="card-light flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(0,196,113,0.12)", color: "#00c471" }}
                  >
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black font-mono" style={{ color: "#e3ddd3" }}>
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display text-xl" style={{ color: "#0a121f" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(10,18,31,0.6)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries — dark */}
      <section id="industries" className="py-24 px-4" style={{ background: "#0a121f" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Industries</p>
            <h2 className="font-display text-3xl sm:text-4xl" style={{ color: "#faf8f5" }}>
              Built for everyone who works in the Arctic
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base" style={{ color: "rgba(250,248,245,0.55)" }}>
              Whether you're building pipelines, routing ships, underwriting risk, or planning research.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind) => (
              <div key={ind.name} className="card-dark flex gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(0,196,113,0.1)", color: "#00c471" }}
                >
                  {ind.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5" style={{ color: "#faf8f5" }}>{ind.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(250,248,245,0.5)" }}>
                    {ind.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data sources — light */}
      <section id="data-sources" className="py-24 px-4" style={{ background: "#f2eee7" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="eyebrow mb-3">Data depth</p>
              <h2 className="font-display text-3xl sm:text-4xl mb-5" style={{ color: "#0a121f" }}>
                Not a dashboard. A toolbox.
              </h2>
              <p className="leading-relaxed mb-6 text-sm sm:text-base" style={{ color: "rgba(10,18,31,0.6)" }}>
                We aggregate 8+ trusted Arctic data sources so you don't have to. No GIS expertise, no API keys, no stitching CSVs together at 2am.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "NSIDC permafrost + sea ice extent (daily updates)",
                  "Copernicus Sentinel-1 SAR for ground deformation",
                  "ArcticDEM 2m terrain — full Arctic coverage",
                  "MET Norway Arome Arctic weather model",
                  "OpenCelliD cell tower locations + signal data",
                  "EMODnet + IBCAO bathymetry for Arctic seas",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "rgba(10,18,31,0.7)" }}>
                    <span className="flex-shrink-0 mt-0.5 font-bold" style={{ color: "#00c471" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Data sources", value: "8+", icon: <Globe size={18} /> },
                { label: "Arctic coverage", value: "100%", icon: <Satellite size={18} /> },
                { label: "Update cadence", value: "Daily", icon: <Zap size={18} /> },
                { label: "Questions answered", value: "∞", icon: <BarChart3 size={18} /> },
              ].map((stat) => (
                <div key={stat.label} className="card-light flex flex-col gap-2">
                  <div style={{ color: "#00c471" }}>{stat.icon}</div>
                  <p className="font-display text-3xl" style={{ color: "#0a121f" }}>{stat.value}</p>
                  <p className="text-xs font-medium" style={{ color: "rgba(10,18,31,0.5)" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instrumentation — dark */}
      <section id="instrumentation" className="py-24 px-4" style={{ background: "#162235" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Ground truth</p>
            <h2 className="font-display text-3xl sm:text-4xl" style={{ color: "#faf8f5" }}>
              Better data starts on the ground
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base" style={{ color: "rgba(250,248,245,0.55)" }}>
              Satellite and model data gives you the picture. Site instrumentation gives you certainty. These sensor types deliver the best localized ground truth for Arctic assets.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {sensors.map((s) => (
              <div key={s.name} className="card-dark flex flex-col gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,196,113,0.1)", color: "#00c471" }}
                >
                  {s.icon}
                </div>
                <h3 className="font-semibold text-sm" style={{ color: "#faf8f5" }}>{s.name}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(250,248,245,0.5)" }}>
                  {s.description}
                </p>
                <p
                  className="text-xs font-mono rounded-full px-2.5 py-1 w-fit"
                  style={{ background: "rgba(0,196,113,0.08)", color: "rgba(0,196,113,0.8)", border: "1px solid rgba(0,196,113,0.15)" }}
                >
                  {s.detail}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between"
            style={{ background: "rgba(0,196,113,0.07)", border: "1px solid rgba(0,196,113,0.18)" }}
          >
            <div className="max-w-lg">
              <h3 className="font-display text-xl sm:text-2xl mb-2" style={{ color: "#faf8f5" }}>
                Ready to monitor your site continuously?
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(250,248,245,0.55)" }}>
                Circumpolar.ai connects to beadedcloud — a site monitoring platform built for Arctic infrastructure. Track temperature, deformation, and sensor alerts from any browser.
              </p>
            </div>
            <a
              href="#request-access"
              className="flex-shrink-0 btn-primary"
            >
              Get early access <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Beadedcloud CTA — light */}
      <section className="py-24 px-4" style={{ background: "#faf8f5" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="eyebrow mb-4">Site monitoring</p>
          <h2 className="font-display text-3xl sm:text-5xl mb-5" style={{ color: "#0a121f" }}>
            From intelligence to action
          </h2>
          <p className="text-lg leading-relaxed mb-10 max-w-2xl mx-auto" style={{ color: "rgba(10,18,31,0.6)" }}>
            Circumpolar gives you satellite and model data. When you're ready to monitor a specific building, pipeline, or embankment in real time, beadedcloud connects your site sensors and triggers alerts before damage occurs.
          </p>

          <div className="grid sm:grid-cols-3 gap-5 mb-10">
            {[
              { icon: "📡", title: "Any sensor", body: "Temperature probes, tiltmeters, crack gauges — beadedcloud ingests them all over LoRaWAN, Iridium, or LTE." },
              { icon: "⚡", title: "Real-time alerts", body: "Threshold-based alerts go to your team via email or SMS the moment anomalous readings are detected." },
              { icon: "📊", title: "Audit-ready logs", body: "Every reading is timestamped and stored. Regulators, insurers, and engineers all get the same data." },
            ].map((f) => (
              <div key={f.title} className="card-light text-left">
                <span className="text-2xl mb-3 block">{f.icon}</span>
                <h3 className="font-semibold mb-2" style={{ color: "#0a121f" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(10,18,31,0.6)" }}>{f.body}</p>
              </div>
            ))}
          </div>

          <a
            href="https://beadedcloud.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark"
          >
            Visit beadedcloud.com <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Blog — dark */}
      <section id="blog" className="py-24 px-4" style={{ background: "#0a121f" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="eyebrow mb-3">Blog</p>
              <h2 className="font-display text-3xl sm:text-4xl" style={{ color: "#faf8f5" }}>
                Arctic intelligence, explained
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1 text-sm transition-colors"
              style={{ color: "#00c471" }}
            >
              All posts <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-dark flex flex-col gap-3 group hover:no-underline"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold rounded-full px-2.5 py-1"
                    style={{ background: "rgba(0,196,113,0.1)", color: "#00c471" }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs" style={{ color: "rgba(250,248,245,0.3)" }}>{post.readTime} min read</span>
                </div>
                <h3 className="font-semibold leading-snug transition-colors" style={{ color: "#faf8f5" }}>
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "rgba(250,248,245,0.5)" }}>
                  {post.excerpt}
                </p>
                <p className="text-xs mt-auto pt-2" style={{ color: "rgba(250,248,245,0.3)" }}>
                  {formatDate(post.date)}
                </p>
              </Link>
            ))}
          </div>

          <div className="sm:hidden text-center mt-6">
            <Link href="/blog" className="btn-ghost text-sm py-2">
              All posts <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Early Access CTA — light */}
      <section id="request-access" className="py-24 px-4" style={{ background: "#f2eee7" }}>
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-4xl mb-4 block">🐻</span>
          <h2 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: "#0a121f" }}>
            Get early access to Circumpolar
          </h2>
          <p className="mb-8 leading-relaxed text-sm sm:text-base" style={{ color: "rgba(10,18,31,0.6)" }}>
            We're onboarding a limited cohort of infrastructure developers, underwriters, and researchers. Tell us what you're working on.
          </p>

          <AccessForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4" style={{ background: "#0a121f", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧭</span>
            <span className="font-display text-base" style={{ color: "#faf8f5" }}>
              Circumpolar<span style={{ color: "#00c471" }}>.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm" style={{ color: "rgba(250,248,245,0.35)" }}>
            <Link href="/blog" className="hover:text-warm-white transition-colors">Blog</Link>
            <Link href="/#industries" className="hover:text-warm-white transition-colors">Industries</Link>
            <Link href="/#data-sources" className="hover:text-warm-white transition-colors">Data</Link>
            <a href="https://beadedcloud.com" target="_blank" rel="noopener noreferrer" className="hover:text-warm-white transition-colors">beadedcloud</a>
            <Link href="/#request-access" className="hover:text-warm-white transition-colors">Contact</Link>
          </div>
          <p className="text-xs" style={{ color: "rgba(250,248,245,0.2)" }}>
            © 2026 Circumpolar.ai
          </p>
        </div>
      </footer>
    </div>
  );
}
