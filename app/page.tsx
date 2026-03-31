import { ArrowRight, Satellite, Building2, Ship, Shield, Wifi, FlaskConical, BarChart3, Globe, MapPin, MessageSquare, Zap } from "lucide-react";
import Nav from "@/components/Nav";
import HeroMap from "@/components/HeroMap";
import { posts } from "@/lib/blog-posts";

const industries = [
  {
    icon: <Building2 size={24} />,
    name: "Infrastructure & Mining",
    description:
      "Ground stability, permafrost risk, frost heave potential, and active layer depth for any project site.",
    color: "text-aurora-blue",
    bg: "bg-arctic-800",
  },
  {
    icon: <Ship size={24} />,
    name: "Maritime & Shipping",
    description:
      "Sea ice forecasts, navigation windows, port accessibility, and route risk for Arctic voyages.",
    color: "text-aurora-green",
    bg: "bg-arctic-800",
  },
  {
    icon: <Shield size={24} />,
    name: "Insurance & Risk",
    description:
      "Site-specific risk profiles for underwriters, asset managers, and ESG frameworks covering climate exposure.",
    color: "text-aurora-purple",
    bg: "bg-arctic-800",
  },
  {
    icon: <Wifi size={24} />,
    name: "Telecom & Connectivity",
    description:
      "Cellular coverage gaps, tower placement analysis, satellite fallback options, and signal modeling.",
    color: "text-aurora-pink",
    bg: "bg-arctic-800",
  },
  {
    icon: <FlaskConical size={24} />,
    name: "Research & Academia",
    description:
      "Fast access to multi-source Arctic datasets with no API juggling — perfect for field planning and analysis.",
    color: "text-aurora-blue",
    bg: "bg-arctic-800",
  },
  {
    icon: <Satellite size={24} />,
    name: "Government & Defense",
    description:
      "Sovereignty monitoring, SAR mission planning, environmental baselines, and Arctic situational awareness.",
    color: "text-aurora-green",
    bg: "bg-arctic-800",
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
    desc: "Tap anywhere on the Arctic map — on desktop or phone. Coastal, inland, offshore, it doesn't matter.",
  },
  {
    icon: <MessageSquare size={20} />,
    num: "02",
    title: "Ask anything",
    desc: "Ask Circe plain questions. \"Is this suitable for a pipeline?\" \"When does sea ice clear here?\" No GIS skills needed.",
  },
  {
    icon: <Zap size={20} />,
    num: "03",
    title: "Get data-backed answers",
    desc: "Circe pulls from 8+ Arctic data sources and gives you specific, cite-able answers in seconds.",
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

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-arctic-800/80 border border-arctic-600 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-aurora-green animate-pulse" />
              <span className="text-xs text-arctic-200 font-medium">
                Early Access Open — Arctic Intelligence Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ice leading-tight mb-5">
              Arctic intelligence{" "}
              <span className="gradient-text">at your fingertips</span>
            </h1>

            <p className="text-lg sm:text-xl text-arctic-200 max-w-2xl mx-auto leading-relaxed mb-8">
              Pin any location above 60°N. Ask our AI assistant anything — permafrost risk, sea ice, weather, cellular coverage, terrain. Get answers backed by 8+ public datasets in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#map-tool" className="btn-primary">
                Try the map now
                <ArrowRight size={16} />
              </a>
              <a href="#request-access" className="btn-outline">
                Request early access
              </a>
            </div>
          </div>

          {/* Map Tool */}
          <div id="map-tool" className="relative">
            <HeroMap />
          </div>

          <p className="text-center text-xs text-arctic-500 mt-3">
            🐻‍❄️ Tap the map · Click Circe in the corner to start asking questions
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-8 px-4 border-y border-arctic-800">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs text-arctic-500 uppercase tracking-widest mb-6">
            Data from trusted public sources
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {dataSources.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-2 text-arctic-300 hover:text-ice transition-colors"
              >
                <span className="text-lg">{s.logo}</span>
                <div>
                  <p className="text-sm font-semibold leading-none">{s.name}</p>
                  <p className="text-xs text-arctic-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ice">
              From question to answer in 30 seconds
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="card flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-arctic-700 flex items-center justify-center text-aurora-blue">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-arctic-700 font-mono">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-ice">{step.title}</h3>
                <p className="text-arctic-300 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-20 px-4 bg-arctic-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Industries</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-ice">
              Built for everyone who works in the Arctic
            </h2>
            <p className="text-arctic-300 mt-4 max-w-xl mx-auto text-sm sm:text-base">
              Whether you're building pipelines, routing ships, underwriting
              risk, or planning research — Circumpolar has the data you need.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((ind) => (
              <div key={ind.name} className="card group flex gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${ind.bg} border border-arctic-600 flex-shrink-0 flex items-center justify-center ${ind.color} group-hover:border-arctic-500 transition-colors`}
                >
                  {ind.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-ice mb-1">{ind.name}</h3>
                  <p className="text-arctic-300 text-sm leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources Deep Dive */}
      <section id="data-sources" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-3">Data depth</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-ice mb-5">
                Not a dashboard. A toolbox.
              </h2>
              <p className="text-arctic-300 leading-relaxed mb-6">
                We aggregate and cross-reference 8+ trusted Arctic data sources
                so you don't have to. No GIS expertise, no API keys, no stitching
                CSVs together at 2am.
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
                  <li key={item} className="flex items-start gap-2 text-sm text-arctic-200">
                    <span className="text-aurora-green mt-0.5 flex-shrink-0">✓</span>
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
                <div
                  key={stat.label}
                  className="bg-arctic-900 border border-arctic-700 rounded-2xl p-5 flex flex-col gap-2"
                >
                  <div className="text-aurora-blue">{stat.icon}</div>
                  <p className="text-3xl font-black text-ice">{stat.value}</p>
                  <p className="text-xs text-arctic-400 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="py-20 px-4 bg-arctic-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Blog</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-ice">
                Arctic intelligence, explained
              </h2>
            </div>
            <a
              href="/blog"
              className="hidden sm:flex items-center gap-1 text-sm text-aurora-blue hover:text-ice transition-colors"
            >
              All posts <ArrowRight size={14} />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.slice(0, 3).map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card flex flex-col gap-3 group hover:no-underline"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-aurora-blue bg-arctic-700 px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-arctic-500">{post.readTime} min read</span>
                </div>
                <h3 className="font-semibold text-ice leading-snug group-hover:text-aurora-blue transition-colors">
                  {post.title}
                </h3>
                <p className="text-arctic-300 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <p className="text-xs text-arctic-500 mt-auto pt-2">
                  {formatDate(post.date)}
                </p>
              </a>
            ))}
          </div>

          <div className="sm:hidden text-center mt-6">
            <a href="/blog" className="btn-outline text-sm py-2">
              All posts <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA / Early Access */}
      <section id="request-access" className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-4xl mb-4 block animate-float">🐻‍❄️</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ice mb-4">
            Get early access to Circumpolar
          </h2>
          <p className="text-arctic-300 mb-8 leading-relaxed">
            We're onboarding a limited cohort of infrastructure developers,
            underwriters, and researchers. Tell us what you're working on and
            we'll follow up within 48 hours.
          </p>

          <form
            action="https://formspree.io/f/circumpolar"
            method="POST"
            className="flex flex-col gap-3 text-left"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                required
                className="bg-arctic-900 border border-arctic-700 rounded-xl px-4 py-3 text-sm text-ice placeholder:text-arctic-500 outline-none focus:border-aurora-blue transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="Work email"
                required
                className="bg-arctic-900 border border-arctic-700 rounded-xl px-4 py-3 text-sm text-ice placeholder:text-arctic-500 outline-none focus:border-aurora-blue transition-colors"
              />
            </div>
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="bg-arctic-900 border border-arctic-700 rounded-xl px-4 py-3 text-sm text-ice placeholder:text-arctic-500 outline-none focus:border-aurora-blue transition-colors"
            />
            <select
              name="role"
              className="bg-arctic-900 border border-arctic-700 rounded-xl px-4 py-3 text-sm text-arctic-300 outline-none focus:border-aurora-blue transition-colors"
            >
              <option value="">What best describes you?</option>
              <option>Infrastructure developer</option>
              <option>Insurance / Underwriter</option>
              <option>Shipping / Maritime</option>
              <option>Researcher / Academia</option>
              <option>Government / Defense</option>
              <option>Telecom</option>
              <option>Other</option>
            </select>
            <textarea
              name="use_case"
              placeholder="What are you working on? (optional)"
              rows={3}
              className="bg-arctic-900 border border-arctic-700 rounded-xl px-4 py-3 text-sm text-ice placeholder:text-arctic-500 outline-none focus:border-aurora-blue transition-colors resize-none"
            />
            <button type="submit" className="btn-primary justify-center py-3.5">
              Request early access
              <ArrowRight size={16} />
            </button>
            <p className="text-xs text-arctic-500 text-center">
              No spam. We'll respond within 48 hours.
            </p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-arctic-800 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <span className="font-bold text-ice">
              Circumpolar<span className="text-aurora-blue">.ai</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-arctic-400">
            <a href="/blog" className="hover:text-ice transition-colors">Blog</a>
            <a href="#industries" className="hover:text-ice transition-colors">Industries</a>
            <a href="#data-sources" className="hover:text-ice transition-colors">Data</a>
            <a href="#request-access" className="hover:text-ice transition-colors">Contact</a>
          </div>
          <p className="text-xs text-arctic-600">
            © 2026 Circumpolar.ai · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
