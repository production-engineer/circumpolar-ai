import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import { posts } from "@/lib/blog-posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen" style={{ background: "#0a121f" }}>
      <Nav />

      <section className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm mb-8 transition-colors"
            style={{ color: "rgba(250,248,245,0.4)" }}
          >
            <ArrowLeft size={14} /> Back to home
          </Link>

          <div className="mb-12">
            <p className="eyebrow mb-3">Blog</p>
            <h1 className="font-display text-3xl sm:text-4xl" style={{ color: "#faf8f5" }}>
              Arctic Intelligence, Explained
            </h1>
            <p className="mt-3 max-w-xl text-sm sm:text-base" style={{ color: "rgba(250,248,245,0.5)" }}>
              Deep dives into permafrost, sea ice, Arctic connectivity, and the data that drives decisions above 60°N.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card-dark flex flex-col sm:flex-row gap-5 group hover:no-underline"
              >
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold rounded-full px-2.5 py-1"
                      style={{ background: "rgba(0,196,113,0.1)", color: "#00c471" }}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(250,248,245,0.3)" }}>
                      {post.readTime} min read
                    </span>
                  </div>
                  <h2 className="font-display text-xl leading-snug transition-colors" style={{ color: "#faf8f5" }}>
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(250,248,245,0.5)" }}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs" style={{ color: "rgba(250,248,245,0.3)" }}>{formatDate(post.date)}</p>
                    <span className="text-xs flex items-center gap-1" style={{ color: "#00c471" }}>
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 px-4 mt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🧭</span>
            <span className="font-display text-base" style={{ color: "#faf8f5" }}>
              Circumpolar<span style={{ color: "#00c471" }}>.ai</span>
            </span>
          </Link>
          <p className="text-xs" style={{ color: "rgba(250,248,245,0.2)" }}>© 2026 Circumpolar.ai</p>
        </div>
      </footer>
    </div>
  );
}
