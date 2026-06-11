import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Play, RotateCcw, Compass } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { cars } from "@/data/cars";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media Gallery — Images, Videos & 360° Views | Luxury Car Gallery Dubai" },
      { name: "description", content: "Explore our luxury car media gallery: high-resolution image galleries, video showcases and immersive 360° car views." },
      { property: "og:title", content: "Media Gallery | Luxury Car Gallery Dubai" },
    ],
    links: [{ rel: "canonical", href: "/media" }],
  }),
  component: Media,
});

const tabs = ["Image Gallery", "Video Gallery", "360° Car Views"] as const;

function Media() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Image Gallery");
  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <span className="text-xs uppercase tracking-luxury text-gold">Media</span>
        <h1 className="mt-3 text-4xl md:text-5xl">The Gallery</h1>
      </div>

      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-5 py-2.5 text-xs uppercase tracking-widest transition-colors ${tab === t ? "bg-gold text-primary-foreground" : "border border-border text-muted-foreground hover:border-gold"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {cars.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.05}>
              <div className="group relative aspect-square overflow-hidden rounded-2xl border border-border">
                <img src={c.image} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <span className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
                  {tab === "Video Gallery" ? <Play className="h-9 w-9 text-gold" /> : tab === "360° Car Views" ? <RotateCcw className="h-9 w-9 text-gold" /> : <Compass className="h-9 w-9 text-gold" />}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
