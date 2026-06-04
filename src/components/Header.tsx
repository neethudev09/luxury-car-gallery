import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Phone,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  Tag,
  Banknote,
  GitCompare,
  Compass,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { brands, featuredCars, formatPrice, whatsappLink, PHONE } from "@/data/cars";
import { BrandLogo } from "@/components/BrandLogo";
import showroom from "@/assets/showroom-interior.jpg";
import lcgLogo from "@/assets/lcg-logo.png.asset.json";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.83 9.83 0 001.999 5.928l-.999 3.648 3.49-.875zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

interface MenuColumn {
  heading: string;
  links: { label: string; to: string }[];
}

const mediaMenu: MenuColumn[] = [
  {
    heading: "Media",
    links: [
      { label: "Image Gallery", to: "/media" },
      { label: "Video Gallery", to: "/media" },
      { label: "360° Car Views", to: "/media" },
      { label: "360° Showroom Tour", to: "/showroom" },
    ],
  },
];

const newsMenu: MenuColumn[] = [
  {
    heading: "Editorial",
    links: [
      { label: "News", to: "/blog" },
      { label: "Blog", to: "/blog" },
      { label: "Buying Guides", to: "/blog" },
      { label: "Market Updates", to: "/blog" },
    ],
  },
];

const aboutMenu: MenuColumn[] = [
  {
    heading: "The Gallery",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Showroom", to: "/showroom" },
      { label: "Why Choose Us", to: "/about" },
      { label: "Careers", to: "/about" },
    ],
  },
];

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
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2" onMouseEnter={() => setOpen(null)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-primary-foreground">
            <Car className="h-5 w-5" />
          </span>
          <span className="font-display text-xl leading-none tracking-tight">
            Car Gallery
            <span className="block text-[0.6rem] font-sans uppercase tracking-luxury text-gold">
              Dubai
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
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

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link
            to="/inventory"
            aria-label="Search inventory"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-gold sm:flex"
          >
            <Search className="h-4.5 w-4.5" />
          </Link>
          <a
            href={whatsappLink("Hello Car Gallery Dubai, I would like to enquire about your inventory.")}
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
            <div className="mx-auto max-w-7xl px-5 pt-3">
              <div className="glass-strong relative overflow-hidden rounded-2xl p-8 shadow-luxury">
                <img
                  src={showroom}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute -right-10 bottom-0 h-64 w-auto opacity-[0.06] grayscale"
                />
                <div className="gold-line absolute inset-x-8 top-0 h-px" />
                {open === "cars" ? <CarsMega /> : <SimpleMega columns={menuFor(open)} />}
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

function menuFor(key: string): MenuColumn[] {
  if (key === "media") return mediaMenu;
  if (key === "news") return newsMenu;
  return aboutMenu;
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

function SimpleMega({ columns }: { columns: MenuColumn[] }) {
  return (
    <div className="grid grid-cols-2 gap-8">
      {columns.map((col) => (
        <div key={col.heading}>
          <p className="mb-4 text-xs uppercase tracking-luxury text-gold">{col.heading}</p>
          <ul className="space-y-1">
            {col.links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="group flex items-center justify-between rounded-lg px-3 py-2.5 font-display text-lg transition-colors hover:bg-secondary"
                >
                  {l.label}
                  <ArrowUpRight className="h-4 w-4 -translate-x-1 text-gold opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CarsMega() {
  const explore = [
    { label: "Cars For Sale", to: "/inventory" },
    { label: "Car Specifications", to: "/inventory" },
    { label: "Compare Models", to: "/inventory" },
    { label: "Sell Your Car", to: "/sell" },
  ];
  return (
    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-3 border-r border-border/60 pr-6">
        <p className="mb-4 text-xs uppercase tracking-luxury text-gold">Explore Inventory</p>
        <ul className="space-y-1">
          {explore.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="group flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-secondary"
              >
                {l.label}
                <ArrowUpRight className="h-4 w-4 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-5">
        <p className="mb-4 text-xs uppercase tracking-luxury text-gold">Available Cars by Brand</p>
        <div className="grid grid-cols-2 gap-1.5">
          {brands.map((b) => (
            <BrandRow key={b.slug} name={b.name} slug={b.slug} count={b.available} />
          ))}
        </div>
      </div>

      <div className="col-span-4 border-l border-border/60 pl-6">
        <p className="mb-4 text-xs uppercase tracking-luxury text-gold">Sold Cars by Brand</p>
        <div className="grid grid-cols-2 gap-1.5">
          {brands.slice(0, 8).map((b) => (
            <BrandRow key={b.slug} name={b.name} slug={b.slug} count={b.sold} sold />
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandRow({
  name,
  slug,
  count,
  sold,
}: {
  name: string;
  slug: string;
  count: number;
  sold?: boolean;
}) {
  return (
    <Link
      to="/brands/$brand"
      params={{ brand: slug }}
      className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/30 text-[0.6rem] font-semibold text-gold">
        {name.slice(0, 2).toUpperCase()}
      </span>
      <span className="flex-1 truncate text-sm text-foreground/85 group-hover:text-gold">{name}</span>
      <span className="text-xs text-muted-foreground">{count}{sold ? "" : ""}</span>
    </Link>
  );
}
