import { createFileRoute, Link } from "@tanstack/react-router";
import { CountUp, Reveal, SectionHeading } from "@/components/Reveal";
import { Award, ShieldCheck, Globe2, Gem } from "lucide-react";
import showroom from "@/assets/showroom-interior.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Car Gallery Dubai | Luxury Car Dealership" },
      { name: "description", content: "Discover the story behind Car Gallery Dubai — a leading luxury and supercar dealership trusted by collectors across the globe." },
      { property: "og:title", content: "About Car Gallery Dubai" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs uppercase tracking-luxury text-gold">About Us</span>
          <h1 className="mt-3 text-4xl md:text-5xl">A Passion For The Extraordinary</h1>
          <p className="mt-5 leading-relaxed text-muted-foreground">For over 15 years, Car Gallery Dubai has been the trusted destination for discerning collectors seeking the world's most desirable automobiles. From rare supercars to handcrafted grand tourers, we deliver an uncompromising standard of curation and service.</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">Our reputation is built on trust, transparency and an obsessive attention to detail — every vehicle inspected, every client treated as family.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <img src={showroom} alt="Car Gallery Dubai showroom" width={1024} height={1024} className="rounded-3xl border border-border shadow-luxury" />
        </Reveal>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-10 lg:grid-cols-4">
        {[["Years In Business", 15, ""], ["Cars Sold", 2400, "+"], ["Brands", 11, ""], ["Happy Clients", 1800, "+"]].map(([l, v, s], i) => (
          <Reveal key={l as string} delay={i * 0.06}>
            <div className="glass rounded-2xl p-6 text-center">
              <p className="font-display text-4xl text-gold"><CountUp end={v as number} suffix={s as string} /></p>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-5 py-16">
        <SectionHeading eyebrow="Why Choose Us" title="The Car Gallery Standard" align="center" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Gem, t: "Curated Collection", d: "Only the finest, most desirable vehicles" },
            { Icon: ShieldCheck, t: "Certified & Inspected", d: "Every car verified to the highest standard" },
            { Icon: Globe2, t: "Global Delivery", d: "Worldwide shipping handled end to end" },
            { Icon: Award, t: "Trusted Expertise", d: "15+ years of luxury automotive heritage" },
          ].map(({ Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 0.06}>
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:border-gold hover:shadow-gold">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold"><Icon className="h-5 w-5" /></span>
                <p className="font-medium">{t}</p>
                <p className="text-sm text-muted-foreground">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/inventory" className="inline-flex rounded-full bg-gold px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105">View Inventory</Link>
        </div>
      </div>
    </div>
  );
}
