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
    <div className="min-h-screen">
      <Nav />

      <section className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <a
            href="/"
            className="inline-flex items-center gap-1 text-sm text-arctic-400 hover:text-ice transition-colors mb-8"
          >
            <ArrowLeft size={14} /> Back to home
          </a>

          <div className="mb-12">
            <p className="section-label mb-3">Blog</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-ice">
              Arctic Intelligence, Explained
            </h1>
            <p className="text-arctic-300 mt-3 max-w-xl">
              Deep dives into permafrost, sea ice, Arctic connectivity, and the
              data that drives decisions above 60°N.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card flex flex-col sm:flex-row gap-5 group hover:no-underline"
              >
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-aurora-blue bg-arctic-700 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-arctic-500">
                      {post.readTime} min read
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-ice group-hover:text-aurora-blue transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-arctic-300 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-arctic-500">{formatDate(post.date)}</p>
                    <span className="text-xs text-aurora-blue flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-arctic-800 py-10 px-4 mt-12">
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
