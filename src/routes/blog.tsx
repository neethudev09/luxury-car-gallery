import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { posts, blogCategories } from "@/data/blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Luxury Car News, Blog & Buying Guides | Car Gallery Dubai" },
      { name: "description", content: "The latest luxury car news, supercar features, buying guides and Dubai automotive market updates from Car Gallery Dubai." },
      { property: "og:title", content: "Journal | Car Gallery Dubai" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

function Blog() {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <span className="text-xs uppercase tracking-luxury text-gold">Journal</span>
        <h1 className="mt-3 text-4xl md:text-5xl">News, Guides & Market Insight</h1>
      </div>
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap gap-2">
          {["All", ...blogCategories].map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest transition-colors ${cat === c ? "bg-gold text-primary-foreground" : "border border-border text-muted-foreground hover:border-gold"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.07}>
              <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-luxury hover-lift">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-[0.6rem] uppercase tracking-widest text-gold">{p.category}</span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground">{p.date} · {p.readTime}</p>
                  <h2 className="mt-2 text-xl leading-snug transition-colors group-hover:text-gold">{p.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
