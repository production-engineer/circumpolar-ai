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
    <div className="min-h-screen">
      <Nav />

      <article className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <a
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-arctic-400 hover:text-ice transition-colors mb-8"
          >
            <ArrowLeft size={14} /> All posts
          </a>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-aurora-blue bg-arctic-700 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-arctic-500">{post.readTime} min read</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-ice leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-arctic-400 mb-10 pb-8 border-b border-arctic-800">
            <span>🐻‍❄️ {post.author}</span>
            <span>·</span>
            <span>{formatDate(post.date)}</span>
          </div>

          <div className="prose-arctic">
            <p className="text-arctic-200 text-lg leading-relaxed mb-6">
              {post.excerpt}
            </p>

            <p className="text-arctic-300 leading-relaxed mb-6">
              This article is part of the Circumpolar.ai research series. We're
              actively publishing deep-dive content on Arctic data, risk, and
              infrastructure. Sign up for early access to get new posts directly
              in your inbox.
            </p>

            <div className="bg-arctic-900 border border-arctic-700 rounded-2xl p-6 flex flex-col gap-4">
              <p className="text-sm font-semibold text-ice">
                Want to explore data for a specific location?
              </p>
              <p className="text-sm text-arctic-300">
                Try the Circumpolar map tool — pin any Arctic location and ask
                Circe your questions directly.
              </p>
              <a href="/#map-tool" className="btn-primary text-sm py-2.5 w-fit">
                Open the map tool
              </a>
            </div>
          </div>
        </div>
      </article>

      <footer className="border-t border-arctic-800 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <span className="font-bold text-ice">
              Circumpolar<span className="text-aurora-blue">.ai</span>
            </span>
          </a>
          <p className="text-xs text-arctic-600">© 2026 Circumpolar.ai</p>
        </div>
      </footer>
    </div>
  );
}
