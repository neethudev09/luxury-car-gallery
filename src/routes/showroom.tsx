import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Play } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import showroom from "@/assets/showroom-interior.jpg";
import hero from "@/assets/hero-showroom.jpg";
import { cars } from "@/data/cars";

export const Route = createFileRoute("/showroom")({
  head: () => ({
    meta: [
      { title: "Visit Our Luxury Car Showroom in Dubai | Luxury Car Gallery Dubai" },
      { name: "description", content: "Explore the Luxury Car Gallery Dubai showroom with an interactive 360° virtual tour, video showcase and luxury imagery." },
      { property: "og:title", content: "Our Dubai Showroom" },
      { property: "og:image", content: showroom },
    ],
    links: [{ rel: "canonical", href: "/showroom" }],
  }),
  component: Showroom,
});

function Showroom() {
  const hotspots = [
    { top: "40%", left: "30%", label: "Supercar Bay" },
    { top: "55%", left: "62%", label: "Lounge" },
    { top: "65%", left: "45%", label: "Delivery Area" },
  ];
  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <span className="text-xs uppercase tracking-luxury text-gold">Showroom</span>
        <h1 className="mt-3 text-4xl md:text-5xl">The Luxury Car Gallery Experience</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">A 12,000 sq ft temple to automotive excellence in Al Quoz Industrial Third, Dubai.</p>
      </div>

      <div className="mx-auto max-w-7xl px-5">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-luxury">
            <img src={hero} alt="360 showroom tour" width={1920} height={1080} className="aspect-video w-full object-cover" />
            <div className="absolute inset-0 bg-background/30" />
            {hotspots.map((h) => (
              <button key={h.label} style={{ top: h.top, left: h.left }} className="group absolute -translate-x-1/2 -translate-y-1/2">
                <span className="block h-5 w-5 animate-ping rounded-full bg-gold/60" />
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full glass-strong px-3 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">{h.label}</span>
              </button>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold">
                <Compass className="h-4 w-4" /> Start 360° Tour
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16">
        <SectionHeading eyebrow="Gallery" title="Inside The Showroom" />
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {[showroom, hero, ...cars.slice(0, 4).map((c) => c.image)].map((img, i) => (
            <Reveal key={i} delay={(i % 3) * 0.06}>
              <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
                <img src={img} alt="Showroom" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {i === 1 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-background/40">
                    <Play className="h-10 w-10 text-gold" />
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/inventory" className="inline-flex rounded-full bg-gold px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105">
            View Our Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
