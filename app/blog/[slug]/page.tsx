import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import { posts } from "@/lib/blog-posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen" style={{ background: "#0a121f" }}>
      <Nav />

      <article className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm mb-8 transition-colors"
            style={{ color: "rgba(250,248,245,0.4)" }}
          >
            <ArrowLeft size={14} /> All posts
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-semibold rounded-full px-2.5 py-1"
              style={{ background: "rgba(0,196,113,0.1)", color: "#00c471" }}
            >
              {post.category}
            </span>
            <span className="text-xs" style={{ color: "rgba(250,248,245,0.3)" }}>{post.readTime} min read</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl leading-tight mb-4" style={{ color: "#faf8f5" }}>
            {post.title}
          </h1>

          <div
            className="flex items-center gap-2 text-sm mb-10 pb-8"
            style={{ color: "rgba(250,248,245,0.4)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span>🐻‍❄️ {post.author}</span>
            <span>·</span>
            <span>{formatDate(post.date)}</span>
          </div>

          <div>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "rgba(250,248,245,0.8)" }}>
              {post.excerpt}
            </p>

            {post.content.map((para, i) => (
              <p key={i} className="leading-relaxed mb-5 text-sm sm:text-base" style={{ color: "rgba(250,248,245,0.65)" }}>
                {para}
              </p>
            ))}

            <div
              className="rounded-2xl p-6 flex flex-col gap-4 mt-10"
              style={{ background: "#162235", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>
                Want to explore data for a specific location?
              </p>
              <p className="text-sm" style={{ color: "rgba(250,248,245,0.55)" }}>
                Try the Circumpolar map tool — pin any Arctic location and ask Circe your questions directly.
              </p>
              <Link href="/#map-tool" className="btn-primary text-sm py-2.5 w-fit">
                Open the map tool
              </Link>
            </div>
          </div>
        </div>
      </article>

      <footer className="py-10 px-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
