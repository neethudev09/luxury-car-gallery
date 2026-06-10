import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getPublicPost } from "@/lib/public.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { post, related } = await getPublicPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return { post, related };
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const title = post?.seo_title || post?.title || "Article";
    const description =
      post?.meta_description || post?.excerpt || "Luxury car news and insight from Car Gallery Dubai.";
    const image = post?.og_image || post?.cover_image || undefined;
    return {
      meta: [
        { title: `${title} | Car Gallery Dubai` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(image ? [{ property: "og:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: post
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: post.title,
                description: post.excerpt ?? undefined,
                image: image ?? undefined,
                datePublished: post.published_at ?? undefined,
                author: post.author ? { "@type": "Person", name: post.author } : undefined,
              }),
            },
          ]
        : [],
    };
  },
  errorComponent: ({ error }) => (
    <div className="pt-28 mx-auto max-w-3xl px-5 py-10" role="alert">
      Unable to load this article: {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-28 text-center">
      <h1 className="text-4xl">Article not found</h1>
      <Link to="/blog" className="text-gold underline">
        Back to the journal
      </Link>
    </div>
  ),
  component: BlogPost,
});

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

type RelatedPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  cover_image: string | null;
  author: string | null;
  published_at: string | null;
};

function isHtml(s: string) {
  return /<\/?[a-z][\s\S]*>/i.test(s);
}

function BlogPost() {
  const { post, related } = Route.useLoaderData();
  const r = related as RelatedPost[];

  return (
    <div className="pt-28">
      <article className="mx-auto max-w-3xl px-5 py-10">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" /> Back to journal
        </Link>

        {post.category && (
          <span className="mt-6 block text-xs uppercase tracking-luxury text-gold">{post.category}</span>
        )}
        <h1 className="mt-3 text-4xl md:text-5xl leading-tight">{post.title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {formatDate(post.published_at)}
          {post.author ? ` · ${post.author}` : ""}
        </p>

        {post.cover_image && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-luxury">
            <img
              src={post.cover_image}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        )}

        {post.excerpt && (
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}

        {post.content &&
          (isHtml(post.content) ? (
            <div
              className="prose prose-invert mt-8 max-w-none prose-headings:font-normal prose-a:text-gold"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="mt-8 space-y-4 leading-relaxed">
              {post.content
                .split(/\n{2,}/)
                .filter(Boolean)
                .map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          ))}
      </article>

      {r.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-12">
          <h2 className="text-2xl">More from the journal</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {r.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.07}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-luxury hover-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {p.cover_image && (
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-muted-foreground">{formatDate(p.published_at)}</p>
                    <h3 className="mt-2 text-lg leading-snug transition-colors group-hover:text-gold">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
