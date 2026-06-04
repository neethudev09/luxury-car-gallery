import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  RotateCcw,
  ZoomIn,
  Compass,
  Move3d,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Quote,
} from "lucide-react";
import { Reveal, SectionHeading, CountUp } from "@/components/Reveal";
import { CarCard } from "@/components/CarCard";
import { CarConfigurator } from "@/components/CarConfigurator";
import { BrandLogo } from "@/components/BrandLogo";
import { brands, featuredCars, cars, whatsappLink, EMAIL, PHONE } from "@/data/cars";
import { posts } from "@/data/blog";
import heroShowroom from "@/assets/hero-showroom.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import showroomInterior from "@/assets/showroom-interior.jpg";
import sellImg from "@/assets/sell-your-car.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxury Cars & Supercars For Sale in Dubai | Car Gallery Dubai" },
      {
        name: "description",
        content:
          "Discover Dubai's finest collection of luxury cars and supercars for sale. Ferrari, Lamborghini, Rolls-Royce, Porsche & more. View inventory or sell your car today.",
      },
      { property: "og:title", content: "Luxury Cars & Supercars For Sale in Dubai" },
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
      <ThreeSixtySection />
      <ShowroomSection />
      <SellSection />
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
          Car Gallery Dubai
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-5 max-w-3xl text-4xl leading-[1.05] sm:text-6xl lg:text-7xl"
        >
          Luxury Cars <span className="gold-gradient-text">For Sale</span> In Dubai
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-6 max-w-xl text-lg text-foreground/80"
        >
          An exclusive collection of the world's most desirable supercars and luxury automobiles,
          curated for the most discerning collectors.
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

/* SECTION 2 — BRANDS */
function BrandsSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading
        eyebrow="Marques We Curate"
        title="The World's Finest Brands"
        subtitle="From Maranello to Goodwood — we source, certify and present the most coveted automobiles on earth."
        align="center"
      />
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {brands.map((b, i) => (
          <Reveal key={b.slug} delay={i * 0.04}>
            <Link
              to="/brands/$brand"
              params={{ brand: b.slug }}
              className="group flex aspect-[3/2] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-gold"
            >
              <BrandLogo
                slug={b.slug}
                className="h-10 w-10 text-foreground/55 transition-all duration-500 group-hover:scale-110 group-hover:text-gold"
              />
              <span className="text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
                {b.name}
              </span>
              <span className="text-[0.6rem] uppercase tracking-widest text-gold/70">{b.available} available</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* SECTION 3 — FEATURED INVENTORY */
function FeaturedSection() {
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

/* SECTION 4 — 360 EXPERIENCE */
function ThreeSixtySection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-grain" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs uppercase tracking-luxury text-gold">Interactive Configurator</span>
          <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl">
            Spin, Configure & Explore in <span className="gold-gradient-text">360°</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Place the car on the platform and spin it in real time. Change the exterior paint,
            wheels, brake calipers and interior — a true luxury configurator, not a slideshow.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              { Icon: RotateCcw, t: "Real Platform Spin", d: "Drag left and right to rotate the car" },
              { Icon: Move3d, t: "Live Colour Studio", d: "Exterior, wheel, caliper & interior options" },
              { Icon: ZoomIn, t: "High-Detail Presentation", d: "Reflections and lighting under the car" },
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
          <CarConfigurator />
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
          alt="Car Gallery Dubai virtual showroom tour"
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
                Take an interactive 360° tour with hotspot navigation and discover our collection
                exactly as it sits on our showroom floor.
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
              Receive a competitive valuation within hours. We handle everything — paperwork,
              transfer and payment — with absolute discretion.
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

/* SECTION 7 — SOCIAL FEED */
function SocialSection() {
  const feed = [cars[0], cars[2], cars[5], cars[10], cars[1], cars[6]];
  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <SectionHeading
        eyebrow="@cargallerydubai"
        title="From Our Instagram"
        subtitle="New arrivals, customer deliveries and behind-the-scenes from the showroom floor."
        align="center"
      />
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

/* SECTION 8 — SEO CONTENT */
function SeoSection() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-24">
      <Reveal>
        <span className="text-xs uppercase tracking-luxury text-gold">Why Car Gallery Dubai</span>
        <h2 className="mt-3 text-3xl md:text-4xl">Luxury Cars For Sale In Dubai</h2>
        <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
          <p>
            Car Gallery Dubai is the destination of choice for collectors and enthusiasts seeking
            the finest <Link to="/inventory" className="text-gold hover:underline">luxury cars for sale in Dubai</Link>.
            Our curated showroom brings together the most desirable marques in the world, from
            track-bred supercars to handcrafted grand tourers.
          </p>
          <h3 className="font-display text-2xl text-foreground">An Unrivalled Supercar Collection</h3>
          <p>
            Whether you are searching for a{" "}
            <Link to="/brands/$brand" params={{ brand: "ferrari" }} className="text-gold hover:underline">Ferrari for sale in Dubai</Link>,
            a{" "}
            <Link to="/brands/$brand" params={{ brand: "lamborghini" }} className="text-gold hover:underline">Lamborghini</Link>{" "}
            or the serene luxury of a{" "}
            <Link to="/brands/$brand" params={{ brand: "rolls-royce" }} className="text-gold hover:underline">Rolls-Royce</Link>,
            every vehicle in our inventory is meticulously inspected and presented to the highest
            standard.
          </p>
          <h3 className="font-display text-2xl text-foreground">Buy & Sell With Confidence</h3>
          <p>
            We make buying and selling luxury cars in Dubai effortless. Our specialists provide
            transparent valuations, finance options and a discreet, white-glove service trusted by
            a global clientele. Looking to sell?{" "}
            <Link to="/sell" className="text-gold hover:underline">Get a valuation today</Link>.
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
      href: whatsappLink("Hello Car Gallery Dubai"),
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
