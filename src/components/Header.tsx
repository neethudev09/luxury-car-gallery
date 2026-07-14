import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@/lib/server-compat";
import {
  Search,
  Phone,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  Tag,
  Banknote,
  GitCompare,
  Compass,
  Sparkles,
  Images,
  Play,
  RotateCcw,
  Newspaper,
  BookOpen,
  TrendingUp,
  Building2,
  Briefcase,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  brands as fallbackBrands,
  featuredCars,
  carForBrand,
  formatPrice,
  whatsappLink,
  PHONE,
} from "@/data/cars";
import { getBrandsWithCounts } from "@/lib/public.functions";
import { posts } from "@/data/blog";
import { BrandLogo } from "@/components/BrandLogo";
import showroom from "@/assets/showroom-interior.jpg";
import lcgLogo from "@/assets/lcg-logo.png.asset.json";


const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.83 9.83 0 001.999 5.928l-.999 3.648 3.49-.875zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const navItems = [
  { label: "Cars", key: "cars" },
  { label: "Media", key: "media" },
  { label: "News", key: "news" },
  { label: "About", key: "about" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const enter = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "glass-strong py-3 shadow-luxury" : "bg-transparent py-5"
      }`}
      onMouseLeave={leave}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5">
        <Link to="/" className="group flex items-center gap-3" onMouseEnter={() => setOpen(null)}>
          <img
            src={lcgLogo.url}
            alt="Luxury Car Gallery Dubai"
            width={180}
            height={135}
            className={`w-auto transition-all duration-500 group-hover:scale-105 ${
              scrolled ? "h-14" : "h-20"
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.key}
              onMouseEnter={() => enter(item.key)}
              className={`flex items-center gap-1 px-4 py-2 text-sm uppercase tracking-widest transition-colors ${
                open === item.key ? "text-gold" : "text-foreground/80 hover:text-gold"
              }`}
            >
              {item.label}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${open === item.key ? "rotate-180" : ""}`}
              />
            </button>
          ))}
          <Link
            to="/sell"
            onMouseEnter={() => setOpen(null)}
            className="px-4 py-2 text-sm uppercase tracking-widest text-foreground/80 transition-colors hover:text-gold"
          >
            Sell Your Car
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            to="/inventory"
            aria-label="Search inventory"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-gold sm:flex"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>
          <a
            href={whatsappLink("Hello Luxury Car Gallery Dubai, I would like to enquire about your inventory.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-gold sm:flex"
          >
            <WhatsAppIcon className="h-4.5 w-4.5" />
          </a>
          <a
            href={`tel:${PHONE.replace(/\s/g, "")}`}
            aria-label="Call"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-gold md:flex"
          >
            <Phone className="h-4.5 w-4.5" />
          </a>
          <Link
            to="/account"
            aria-label="Account"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-gold md:flex"
          >
            <User className="h-4.5 w-4.5" />
          </Link>
          <Link
            to="/inventory"
            className="ml-1 hidden rounded-full bg-gold px-5 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105 lg:block"
          >
            View Inventory
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-foreground lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mega menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full hidden lg:block"
            onMouseEnter={() => enter(open)}
          >
            <div className="glass-strong relative overflow-hidden border-y border-gold/15 bg-background/85 shadow-luxury backdrop-blur-2xl">
              <img
                src={showroom}
                alt=""
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.04] grayscale"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background/90" />
              <div className="gold-line absolute inset-x-0 top-0 h-px" />

              <div className="relative mx-auto max-w-7xl px-6 py-9">
                {open === "cars" && <CarsMega onNavigate={() => setOpen(null)} />}
                {open === "media" && <MediaMega />}
                {open === "news" && <NewsMega />}
                {open === "about" && <AboutMega />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-strong mx-4 mt-3 overflow-hidden rounded-2xl lg:hidden"
          >
            <nav className="flex flex-col p-5 text-sm uppercase tracking-widest">
              <MobileLink to="/inventory" setOpen={setMobileOpen}>Cars For Sale</MobileLink>
              <MobileLink to="/showroom" setOpen={setMobileOpen}>Showroom</MobileLink>
              <MobileLink to="/media" setOpen={setMobileOpen}>Media</MobileLink>
              <MobileLink to="/blog" setOpen={setMobileOpen}>News & Blog</MobileLink>
              <MobileLink to="/sell" setOpen={setMobileOpen}>Sell Your Car</MobileLink>
              <MobileLink to="/about" setOpen={setMobileOpen}>About Us</MobileLink>
              <MobileLink to="/contact" setOpen={setMobileOpen}>Contact</MobileLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileLink({
  to,
  children,
  setOpen,
}: {
  to: string;
  children: React.ReactNode;
  setOpen: (v: boolean) => void;
}) {
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="border-b border-border/50 py-3 text-foreground/80 transition-colors hover:text-gold"
    >
      {children}
    </Link>
  );
}

/* ---------------- CARS MEGA (dynamic featured panel) ---------------- */
function CarsMega({ onNavigate }: { onNavigate: () => void }) {
  const fetchBrands = useServerFn(getBrandsWithCounts);
  const { data } = useQuery({
    queryKey: ["brands-with-counts"],
    queryFn: () => fetchBrands(),
  });
  const brands = (data?.brands && data.brands.length > 0)
    ? data.brands.map((b) => ({
        name: b.name,
        slug: b.slug,
        available: b.available ?? 0,
        sold: b.sold ?? 0,
      }))
    : fallbackBrands;
  const [active, setActive] = useState<string>(brands[0]?.slug ?? fallbackBrands[0].slug);
  const brand = brands.find((b) => b.slug === active) ?? brands[0];
  const feature = carForBrand(active) ?? featuredCars[0];


  const quickLinks = [
    { label: "All Cars For Sale", to: "/inventory", Icon: Tag },
    { label: "New Arrivals", to: "/inventory", Icon: Sparkles },
    { label: "Compare Models", to: "/compare", Icon: GitCompare },
    { label: "360° Showroom", to: "/showroom", Icon: Compass },
    { label: "Sell Your Car", to: "/sell", Icon: Banknote },
  ] as const;

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Brand list */}
      <div className="col-span-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs uppercase tracking-luxury text-gold">Shop By Brand</p>
          <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">
            Available / Sold
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {brands.map((b) => (
            <Link
              key={b.slug}
              to="/inventory"
              search={{ brand: b.slug }}
              onClick={onNavigate}
              onMouseEnter={() => setActive(b.slug)}
              className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${
                active === b.slug ? "bg-secondary" : "hover:bg-secondary/60"
              }`}
            >
              <BrandLogo
                slug={b.slug}
                className={`h-5 w-5 shrink-0 transition-colors ${
                  active === b.slug ? "text-gold" : "text-foreground/55 group-hover:text-gold"
                }`}
              />
              <span className="flex-1 truncate text-sm text-foreground/85 group-hover:text-gold">
                {b.name}
              </span>
              <span className="text-xs text-gold/90">{b.available}</span>
              <span className="text-[0.7rem] text-muted-foreground">/ {b.sold}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="col-span-3 border-l border-border/60 pl-6">
        <p className="mb-4 text-xs uppercase tracking-luxury text-gold">Quick Links</p>
        <ul className="space-y-1">
          {quickLinks.map(({ label, to, Icon }) => (
            <li key={label}>
              <Link
                to={to}
                onClick={onNavigate}
                className="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-foreground/85 transition-colors hover:bg-secondary hover:text-gold"
              >
                <Icon className="h-4 w-4 text-gold" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Dynamic brand feature panel */}
      <div className="col-span-4 border-l border-border/60 pl-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30">
                <BrandLogo slug={brand.slug} className="h-6 w-6 text-gold" />
              </span>
              <div>
                <p className="font-display text-lg leading-none">{brand.name}</p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-widest text-muted-foreground">
                  <span className="text-emerald-400">{brand.available} available</span> ·{" "}
                  {brand.sold} sold
                </p>
              </div>
            </div>

            {feature && (
              <Link
                to="/cars/$slug"
                params={{ slug: feature.slug }}
                onClick={onNavigate}
                className="group block overflow-hidden rounded-xl border border-border bg-card/60 transition-all hover:border-gold"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-[0.55rem] font-semibold uppercase tracking-widest text-primary-foreground">
                    Featured
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium group-hover:text-gold">
                    {feature.year} {feature.title}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-display text-gold">{formatPrice(feature.price)}</span>
                    <ArrowRight className="h-4 w-4 -translate-x-1 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            )}

            <Link
              to="/inventory"
              search={{ brand: brand.slug }}
              onClick={onNavigate}
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-gold/50 py-2.5 text-xs font-medium uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
            >
              View All {brand.name} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------- GENERIC PREMIUM MEGA ---------------- */
interface MegaLink {
  label: string;
  desc: string;
  to: string;
  Icon: React.ComponentType<{ className?: string }>;
}

function LinkMega({
  eyebrow,
  links,
  feature,
}: {
  eyebrow: string;
  links: MegaLink[];
  feature: { eyebrow: string; title: string; desc: string; image: string; to: string; cta: string };
}) {
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-7">
        <p className="mb-4 text-xs uppercase tracking-luxury text-gold">{eyebrow}</p>
        <div className="grid grid-cols-2 gap-2">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-gold/30 hover:bg-secondary"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold transition-colors group-hover:bg-gold group-hover:text-primary-foreground">
                <l.Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="flex items-center gap-1 font-display text-base group-hover:text-gold">
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{l.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="col-span-5 border-l border-border/60 pl-6">
        <p className="mb-4 text-xs uppercase tracking-luxury text-gold">{feature.eyebrow}</p>
        <Link
          to={feature.to}
          className="group block overflow-hidden rounded-xl border border-border bg-card/60 transition-all hover:border-gold"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={feature.image}
              alt={feature.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="p-4">
            <p className="font-display text-lg group-hover:text-gold">{feature.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{feature.desc}</p>
            <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
              {feature.cta} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

function MediaMega() {
  return (
    <LinkMega
      eyebrow="Media & Experiences"
      links={[
        { label: "Image Gallery", desc: "High-resolution photography", to: "/media", Icon: Images },
        { label: "Video Gallery", desc: "Cinematic vehicle films", to: "/media", Icon: Play },
        { label: "360° Car Views", desc: "Spin & inspect every angle", to: "/media", Icon: RotateCcw },
        { label: "360° Showroom Tour", desc: "Walk our Dubai floor", to: "/showroom", Icon: Compass },
      ]}
      feature={{
        eyebrow: "Latest Showroom",
        title: "Step Inside The Gallery",
        desc: "Immersive 360° walkthrough of our latest arrivals.",
        image: showroom,
        to: "/showroom",
        cta: "Start Tour",
      }}
    />
  );
}

function NewsMega() {
  const latest = posts[0];
  return (
    <LinkMega
      eyebrow="Editorial"
      links={[
        { label: "News", desc: "Dubai automotive headlines", to: "/blog", Icon: Newspaper },
        { label: "Blog", desc: "Stories from the showroom", to: "/blog", Icon: BookOpen },
        { label: "Buying Guides", desc: "Buy smarter in the UAE", to: "/blog", Icon: ShieldCheck },
        { label: "Market Updates", desc: "Values & trends", to: "/blog", Icon: TrendingUp },
      ]}
      feature={{
        eyebrow: "Latest Article",
        title: latest.title,
        desc: latest.excerpt,
        image: latest.image,
        to: "/blog",
        cta: "Read Article",
      }}
    />
  );
}

function AboutMega() {
  return (
    <LinkMega
      eyebrow="The Gallery"
      links={[
        { label: "About Luxury Car Gallery Dubai", desc: "Our story & ethos", to: "/about", Icon: Building2 },
        { label: "Why Choose Us", desc: "Trust, discretion, expertise", to: "/about", Icon: ShieldCheck },
        { label: "Showroom", desc: "Visit us in Dubai", to: "/showroom", Icon: Compass },
        { label: "Careers", desc: "Join the team", to: "/about", Icon: Briefcase },
        { label: "Contact", desc: "Speak to a specialist", to: "/contact", Icon: Mail },
      ]}
      feature={{
        eyebrow: "Our Showroom",
        title: "A Benchmark In Luxury Retail",
        desc: "15 years sourcing the world's finest cars with white-glove service.",
        image: showroom,
        to: "/about",
        cta: "Discover More",
      }}
    />
  );
}
