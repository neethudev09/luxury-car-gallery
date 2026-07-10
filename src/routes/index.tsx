import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@/lib/server-compat";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

import {
  ArrowRight,
  ZoomIn,
  Compass,
  Move3d,
  Hand,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Quote,
} from "lucide-react";
import { Reveal, SectionHeading, CountUp } from "@/components/Reveal";
import { CarCard } from "@/components/CarCard";
import { VehicleShowcase } from "@/components/VehicleShowcase";
import { FinanceCalculator } from "@/components/FinanceCalculator";

import { BrandLogo } from "@/components/BrandLogo";
import { getBrandsWithCounts, getPublicVehicles } from "@/lib/public.functions";
import { mapDbVehicle, type DbVehicle } from "@/lib/vehicle-map";
import { whatsappLink, EMAIL, PHONE, type Car } from "@/data/cars";
import { posts } from "@/data/blog";
import heroShowroom from "@/assets/hero-showroom.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import showroomInterior from "@/assets/showroom-interior.jpg";
import sellImg from "@/assets/sell-your-car.jpg";

export const Route = createFileRoute("/")({
  loader: async () => {
    const res = await getPublicVehicles();
    const all = (res.vehicles as unknown as DbVehicle[]).map(mapDbVehicle);
    const featured = all
      .filter((c) => c.featured && !c.sold)
      .sort((a, b) => b.year - a.year);
    const feed = all.slice(0, 6);
    return { featured, feed };
  },
  head: () => ({
    meta: [
      { title: "Luxury Car Sales Dubai | Luxury Car Gallery" },
      {
        name: "description",
        content:
          "Luxury car sales in Dubai from Luxury Car Gallery. Browse luxury cars, supercars and premium cars for sale, including Ferrari, Lamborghini, Porsche and Rolls-Royce.",
      },
      { property: "og:title", content: "Luxury Car Sales Dubai | Luxury Car Gallery" },
      { property: "og:image", content: heroShowroom },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const stats = [
  { label: "Cars Available", value: 86, suffix: "+" },
  { label: "Brands Available", value: 11, suffix: "" },
  { label: "Years In Business", value: 15, suffix: "" },
  { label: "Cars Sold", value: 2400, suffix: "+" },
];

function Home() {
  return (
    <>
      <Hero />
      <BrandsSection />
      <FeaturedSection />
      <BrowseByBrandSection />
      <ThreeSixtySection />
      <TrustSection />
      <ShowroomSection />
      <SellSection />
      <FinanceSection />
      <SocialSection />
      <SeoSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}

/* SECTION 1 — HERO */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden">
      <motion.video
        style={{ y }}
        autoPlay
        loop
        muted
        playsInline
        poster={heroShowroom}
        className="absolute inset-0 h-[120%] w-full object-cover"
      >
        <source src={heroVideo.url} type="video/mp4" />
      </motion.video>
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <motion.div style={{ opacity }} className="relative mx-auto w-full max-w-7xl px-5 pt-24">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-luxury text-gold"
        >
          Luxury Car Gallery Dubai
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-5 max-w-3xl text-4xl leading-[1.05] sm:text-6xl lg:text-7xl"
        >
          Luxury Car <span className="gold-gradient-text">Sales</span> Dubai
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-6 max-w-xl text-lg text-foreground/80"
        >
          Luxury Car Gallery is Dubai's trusted home for luxury cars for sale, bringing together a
          handpicked collection of supercars, premium saloons and grand tourers. Browse our current
          inventory and enjoy a discreet, personalised luxury car buying experience from start to
          finish.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Link
            to="/inventory"
            className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105"
          >
            View Inventory
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/sell"
            className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:bg-gold/10"
          >
            Sell Your Car
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl glass sm:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="p-5 text-center">
              <p className="font-display text-3xl text-gold lg:text-4xl">
                <CountUp end={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground md:flex">
        <span className="text-[0.6rem] uppercase tracking-luxury">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}

/* SECTION 2 — BRANDS (driven live by the inventory database) */
function BrandsSection() {
  const fetchBrands = useServerFn(getBrandsWithCounts);
  const { data } = useQuery({
    queryKey: ["brands-with-counts"],
    queryFn: () => fetchBrands(),
  });
  const list = data?.brands ?? [];

  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading
        eyebrow="Marques We Curate"
        title="Shop by Brand"
        subtitle="Explore the world's leading luxury automotive brands, from Maranello to Goodwood."
        align="center"
      />
      <Reveal className="mx-auto mt-6 max-w-3xl text-center text-muted-foreground leading-relaxed">
        <p>
          Luxury Car Gallery brings together luxury cars for sale from the world's leading
          manufacturers under one roof. Browse dedicated pages for{" "}
          <Link to="/brands/$brand" params={{ brand: "ferrari" }} className="text-gold hover:underline">Ferrari</Link>,{" "}
          <Link to="/brands/$brand" params={{ brand: "lamborghini" }} className="text-gold hover:underline">Lamborghini</Link>,{" "}
          <Link to="/brands/$brand" params={{ brand: "porsche" }} className="text-gold hover:underline">Porsche</Link>{" "}
          and{" "}
          <Link to="/brands/$brand" params={{ brand: "rolls-royce" }} className="text-gold hover:underline">Rolls-Royce</Link>,
          all backed by a carefully curated inventory and a specialist sourcing service for the cars
          you cannot find elsewhere.
        </p>
      </Reveal>
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((b, i) => (
          <Reveal key={b.slug} delay={i * 0.04} className="h-full">
            <Link
              to="/brands/$brand"
              params={{ brand: b.slug }}
              className="group relative flex h-full cursor-pointer flex-col items-center rounded-2xl border border-border/60 bg-card px-6 pb-7 pt-8 text-center transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_10px_40px_-12px_color-mix(in_oklab,var(--gold)_35%,transparent)]"
            >
              {/* soft gold glow on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklab,var(--gold)_16%,transparent),transparent_70%)]" />
              <div className="relative flex h-20 w-full items-center justify-center">
                <BrandLogo
                  slug={b.slug}
                  src={b.logo}
                  name={b.name}
                  className="h-full max-w-[150px] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="relative mt-5 text-sm uppercase tracking-[0.2em] text-foreground">
                {b.name}
              </span>
              {b.available > 0 ? (
                <span className="relative mt-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-gold/90 transition-colors group-hover:text-gold">
                  {b.available} Available
                </span>
              ) : (
                <span className="relative mt-1.5 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-gold">
                  View Brand
                </span>
              )}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}



/* SECTION 3 — FEATURED INVENTORY */
function FeaturedSection() {
  const { featured } = Route.useLoaderData() as { featured: Car[]; feed: Car[] };
  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Latest Arrivals" title="Featured Inventory" />
        <Reveal>
          <Link
            to="/inventory"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gold"
          >
            View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      <Reveal className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
        <p>
          Discover our current collection of luxury cars for sale in Dubai, spanning performance
          cars, supercars, premium SUVs and rare collector vehicles. Every car is hand selected and
          fully inspected, with new arrivals added regularly. See the full range on our{" "}
          <Link to="/inventory" className="text-gold hover:underline">cars for sale</Link> page.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredCars.slice(0, 6).map((car, i) => (
          <Reveal key={car.slug} delay={(i % 3) * 0.08}>
            <CarCard car={car} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* SECTION — BROWSE LUXURY CARS BY BRAND (SEO internal linking) */
function BrowseByBrandSection() {
  const fetchBrands = useServerFn(getBrandsWithCounts);
  const { data } = useQuery({
    queryKey: ["brands-with-counts"],
    queryFn: () => fetchBrands(),
  });
  const list = data?.brands ?? [];

  return (
    <section className="relative overflow-hidden py-16">
      <div className="absolute inset-0 bg-grain" />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeading
          eyebrow="Explore By Marque"
          title="Browse Luxury Cars by Brand"
          subtitle="Discover our full collection of luxury cars for sale in Dubai, organised by marque. Select a brand to view current stock, pricing and availability."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((b, i) => (
            <Reveal key={b.slug} delay={(i % 4) * 0.05}>
              <Link
                to="/brands/$brand"
                params={{ brand: b.slug }}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-card/60 px-5 py-5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:bg-card hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)]"
              >
                <span className="flex flex-col">
                  <span className="text-base font-medium text-foreground transition-colors group-hover:text-gold">
                    {b.name} for Sale in Dubai
                  </span>
                  {b.available > 0 && (
                    <span className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                      {b.available} available
                    </span>
                  )}
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-gold" />
              </Link>
            </Reveal>
          ))}
          <Reveal delay={(list.length % 4) * 0.05}>
            <Link
              to="/inventory"
              className="group flex h-full items-center justify-between gap-4 rounded-xl border border-gold/40 bg-gold/10 px-5 py-5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/15 hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)]"
            >
              <span className="text-base font-medium text-gold">All Luxury Cars for Sale</span>
              <ArrowRight className="h-5 w-5 shrink-0 text-gold transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ThreeSixtySection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-grain" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs uppercase tracking-luxury text-gold">Showroom Experience</span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl">
            Inspect Real Stock in a <span className="gold-gradient-text">Private Showroom</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Browse genuine vehicles from our current inventory, presented on a dark stage with soft
            spotlight lighting and a mirrored reflection. Real photography only, no rendered models.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { Icon: Move3d, t: "Real Inventory", d: "Every car shown is genuine stock from our showroom" },
              { Icon: Hand, t: "Drag to Browse", d: "Swipe left and right to move through vehicles" },
              { Icon: ZoomIn, t: "Premium Presentation", d: "Spotlight, reflection and high-resolution imagery" },
            ].map(({ Icon, t, d }) => (
              <li key={t} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-medium">{t}</p>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <VehicleShowcase />
        </Reveal>
      </div>

    </section>
  );
}


/* SECTION 5 — SHOWROOM */
function ShowroomSection() {
  return (
    <section className="relative">
      <div className="relative h-[60vh] min-h-[460px] overflow-hidden">
        <img
          src={showroomInterior}
          alt="Luxury Car Gallery Dubai virtual showroom tour"
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/30" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-5">
            <Reveal>
              <span className="text-xs uppercase tracking-luxury text-gold">Virtual Walkthrough</span>
              <h2 className="mt-3 max-w-xl text-3xl md:text-4xl lg:text-5xl">
                Step Inside Our Dubai Showroom
              </h2>
              <p className="mt-4 max-w-lg text-foreground/80">
                Explore each vehicle in detail with an interactive 360° tour and hotspot navigation.
                View our collection exactly as it sits on the showroom floor and get to know a car
                fully before you visit us in person.
              </p>
              <Link
                to="/showroom"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105"
              >
                <Compass className="h-4 w-4" /> Start 360° Tour
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* SECTION 6 — SELL YOUR CAR */
function SellSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="relative overflow-hidden rounded-3xl border border-border shadow-luxury">
        <img
          src={sellImg}
          alt="Sell your luxury car in Dubai"
          loading="lazy"
          width={1600}
          height={1024}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        <div className="relative max-w-xl p-10 md:p-16">
          <Reveal>
            <span className="text-xs uppercase tracking-luxury text-gold">Sell Your Car</span>
            <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl">
              The Effortless Way to Sell Your Luxury Car
            </h2>
            <p className="mt-4 text-foreground/80">
              Receive a competitive valuation within hours. We handle everything, from paperwork to
              transfer and payment, with absolute discretion.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105"
              >
                Get a Valuation <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* SECTION — FINANCE CALCULATOR */
function FinanceSection() {
  const [price, setPrice] = useState(750000);
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Finance"
              title="Finance Your Dream Car"
              subtitle="Estimate your monthly payments instantly. Adjust the vehicle price, deposit, rate and term to see what works for you, then speak to our team for a tailored quote."
            />
            <div className="mt-8 max-w-sm">
              <label className="text-sm text-muted-foreground">Vehicle price (AED)</label>
              <input
                type="number"
                min={50000}
                step={10000}
                value={price}
                onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                className="mt-2 w-full rounded-lg border border-border bg-card px-4 py-3 text-lg outline-none focus:border-gold"
              />
              <input
                type="range"
                min={100000}
                max={5000000}
                step={10000}
                value={Math.min(price, 5000000)}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-4 w-full accent-gold"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <FinanceCalculator price={price} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SocialSection() {
  const feed = [cars[0], cars[2], cars[5], cars[10], cars[1], cars[6]];
  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <SectionHeading
        eyebrow="@cargallerydubai"
        title="From Our Instagram"
        subtitle="Follow Luxury Car Gallery for the latest arrivals and life around the showroom."
        align="center"
      />
      <Reveal className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground leading-relaxed">
        <p>
          Stay close to the collection with our latest arrivals, customer deliveries, showroom
          updates and behind the scenes moments from the Luxury Car Gallery team.
        </p>
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {feed.map((c, i) => (
          <Reveal key={i} delay={(i % 6) * 0.05}>
            <a
              href="#"
              className="group relative block aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={c.image}
                alt="Instagram post"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-gold" />
              </div>
            </a>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10 text-center">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-gold/50 px-7 py-3 text-sm uppercase tracking-widest text-foreground transition-colors hover:bg-gold/10"
        >
          <Instagram className="h-4 w-4 text-gold" /> Follow Us
        </a>
      </Reveal>
    </section>
  );
}

/* SECTION — TRUST / WHY CHOOSE US */
function TrustSection() {
  const points = [
    { t: "Industry Expertise", d: "More than fifteen years buying, selling and advising on the world's finest cars, with a team that lives and breathes the marques we represent." },
    { t: "Vehicle Sourcing", d: "Cannot find the right car? Our specialists source rare and bespoke vehicles to your exact specification, drawing on a trusted global network." },
    { t: "Quality Standards", d: "Every car is hand selected and undergoes a thorough inspection, with verified history and an honest, accurate description before it reaches you." },
    { t: "Customer Experience", d: "A discreet, personalised service from first enquiry to handover, including tailored finance and secure worldwide delivery." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading
        eyebrow="Why Choose Luxury Car Gallery"
        title="A Luxury Car Dealership Built on Trust"
        align="center"
      />
      <Reveal className="mx-auto mt-6 max-w-3xl text-center text-muted-foreground leading-relaxed">
        <p>
          Buyers return to Luxury Car Gallery because we pair genuine expertise with a calm,
          transparent way of doing business. From sourcing and inspection to finance and delivery,
          every part of the experience is handled with care, so acquiring your next luxury car feels
          effortless from start to finish.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.06}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7">
              <h3 className="text-lg font-medium text-foreground">{p.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* SECTION 8 — SEO CONTENT */
function SeoSection() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-24">
      <Reveal>
        <span className="text-xs uppercase tracking-luxury text-gold">A Word From the Showroom</span>
        <h2 className="mt-3 text-3xl md:text-4xl">Luxury Car Sales in Dubai, Done Properly</h2>
        <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
          <p>
            Buying a luxury car should be a pleasure in itself. At Luxury Car Gallery we take the time
            to understand what you are looking for, whether that is a first supercar, a refined daily
            grand tourer or a future classic to add to a collection. Our team is happy to talk through
            specification, history and ownership so you can make a confident, informed decision.
          </p>
          <p>
            Browse the full{" "}
            <Link to="/inventory" className="text-gold hover:underline">collection of cars for sale</Link>,
            explore individual marques such as{" "}
            <Link to="/brands/$brand" params={{ brand: "ferrari" }} className="text-gold hover:underline">Ferrari</Link>{" "}
            and{" "}
            <Link to="/brands/$brand" params={{ brand: "rolls-royce" }} className="text-gold hover:underline">Rolls-Royce</Link>,
            or read more{" "}
            <Link to="/about" className="text-gold hover:underline">about us</Link>. When you are ready,{" "}
            <Link to="/contact" className="text-gold hover:underline">contact us</Link> to arrange a
            viewing, or{" "}
            <Link to="/sell" className="text-gold hover:underline">sell your car</Link> through our team
            with a straightforward, discreet valuation.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

/* SECTION 9 — BLOGS */
function BlogSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow="Editorial" title="From The Journal" />
        <Reveal>
          <Link to="/blog" className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gold">
            All Articles <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-luxury hover-lift">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute left-4 top-4 rounded-full glass px-3 py-1 text-[0.6rem] uppercase tracking-widest text-gold">
                  {p.category}
                </span>
              </div>
              <div className="p-6">
                <p className="text-xs text-muted-foreground">{p.date} · {p.readTime}</p>
                <h3 className="mt-2 text-xl leading-snug transition-colors group-hover:text-gold">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{p.excerpt}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* SECTION 10 — CONTACT CTA */
function ContactSection() {
  const items = [
    { Icon: Phone, t: "Call Us", d: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
    { Icon: Mail, t: "Email", d: EMAIL, href: `mailto:${EMAIL}` },
    {
      Icon: Quote,
      t: "WhatsApp",
      d: "Chat with a specialist",
      href: whatsappLink("Hello Luxury Car Gallery Dubai"),
    },
{ Icon: MapPin, t: "Visit Showroom", d: "Al Quoz, Dubai", href: "/contact" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="glass relative overflow-hidden rounded-3xl p-10 text-center md:p-16">
        <div className="gold-line absolute inset-x-16 top-0 h-px" />
        <SectionHeading
          eyebrow="Get In Touch"
          title="Begin Your Journey"
          subtitle="Our specialists are available to assist with acquisitions, valuations and bespoke requests."
          align="center"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ Icon, t, d, href }, i) => (
            <Reveal key={t} delay={i * 0.06}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-card p-7 transition-all duration-500 hover:border-gold hover:shadow-gold"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="font-medium">{t}</p>
                <p className="text-sm text-muted-foreground">{d}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
