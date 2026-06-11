import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { brands as staticBrands, EMAIL, PHONE, whatsappLink } from "@/data/cars";
import { getPublicBrands, getPublicSettings, getPublicMenu } from "@/lib/public.functions";
import lcgLogo from "@/assets/lcg-logo.png.asset.json";

const STATIC_EXPLORE = [
  { label: "Cars For Sale", url: "/inventory" },
  { label: "Sell Your Car", url: "/sell" },
  { label: "Showroom Tour", url: "/showroom" },
  { label: "Media Gallery", url: "/media" },
  { label: "News & Blog", url: "/blog" },
  { label: "About Us", url: "/about" },
  { label: "Contact", url: "/contact" },
];

export function Footer() {
  const { data: brandData } = useQuery({
    queryKey: ["public-brands"],
    queryFn: () => getPublicBrands(),
    staleTime: 5 * 60_000,
  });
  const { data: settingsData } = useQuery({
    queryKey: ["public-settings"],
    queryFn: () => getPublicSettings(),
    staleTime: 5 * 60_000,
  });
  const { data: menuData } = useQuery({
    queryKey: ["public-menu"],
    queryFn: () => getPublicMenu(),
    staleTime: 5 * 60_000,
  });

  const brands =
    brandData?.brands && brandData.brands.length > 0 ? brandData.brands : staticBrands;
  const explore =
    menuData?.footer_explore && menuData.footer_explore.length > 0
      ? menuData.footer_explore
      : STATIC_EXPLORE;
  const footer = (settingsData?.settings?.footer ?? {}) as Record<string, string>;
  const phone = footer.phone || PHONE;
  const email = footer.email || EMAIL;
  const address = footer.address || "87 4th St - Al Qouz Ind.third - Al Quoz - Dubai, UAE";
  const whatsapp = footer.whatsapp;
  const waHref = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Luxury Car Gallery Dubai")}`
    : whatsappLink("Hello Luxury Car Gallery Dubai");

  return (
    <footer className="relative mt-24 border-t border-border/60 bg-charcoal">

      <div className="gold-line absolute inset-x-0 top-0 h-px" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img
              src={lcgLogo.url}
              alt="Luxury Car Gallery Dubai"
              className="h-14 w-auto object-contain"
              width={160}
              height={56}
            />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Dubai's premier destination for luxury cars and supercars. Curated inventory,
            white-glove service and a global clientele.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-gold hover:text-gold"
                aria-label="Social media"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-xs uppercase tracking-luxury text-gold">Explore</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {explore.map((x) => (
              <li key={`${x.label}-${x.url}`}>
                <Link
                  to={x.url as never}
                  className="transition-colors hover:text-gold"
                >
                  {x.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs uppercase tracking-luxury text-gold">Brands</h4>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground">
            {brands.slice(0, 10).map((b) => (
              <li key={b.slug}>
                <Link
                  to="/brands/$brand"
                  params={{ brand: b.slug }}
                  className="transition-colors hover:text-gold"
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-5 text-xs uppercase tracking-luxury text-gold">Visit Us</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-gold">
                {phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${email}`} className="hover:text-gold">
                {email}
              </a>
            </li>
          </ul>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-gold px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <p className="text-xs leading-relaxed text-muted-foreground/80">
            Luxury Car Gallery Dubai is a leading luxury and supercar dealership in Dubai, offering an
            exclusive selection of Ferrari, Lamborghini, Rolls-Royce, Bentley, Porsche, McLaren,
            Mercedes-Benz and more. Whether you are buying or selling a luxury car in Dubai, our
            specialists deliver a seamless, discreet and world-class experience.
          </p>
          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row">
            <span>© {new Date().getFullYear()} Luxury Car Gallery Dubai. All rights reserved.</span>
            <span className="flex gap-5">
              <a href="#" className="hover:text-gold">Privacy Policy</a>
              <a href="#" className="hover:text-gold">Terms</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
