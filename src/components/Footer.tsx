import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { brands, EMAIL, PHONE, whatsappLink } from "@/data/cars";
import lcgLogo from "@/assets/lcg-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border/60 bg-charcoal">
      <div className="gold-line absolute inset-x-0 top-0 h-px" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img
              src={lcgLogo.url}
              alt="Car Gallery Dubai"
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
            {[
              { l: "Cars For Sale", to: "/inventory" },
              { l: "Sell Your Car", to: "/sell" },
              { l: "Showroom Tour", to: "/showroom" },
              { l: "Media Gallery", to: "/media" },
              { l: "News & Blog", to: "/blog" },
              { l: "About Us", to: "/about" },
              { l: "Contact", to: "/contact" },
            ].map((x) => (
              <li key={x.l}>
                <Link to={x.to} className="transition-colors hover:text-gold">
                  {x.l}
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
              <span>87 4th St - Al Qouz Ind.third - Al Quoz - Dubai, UAE</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="hover:text-gold">
                {PHONE}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${EMAIL}`} className="hover:text-gold">
                {EMAIL}
              </a>
            </li>
          </ul>
          <a
            href={whatsappLink("Hello Car Gallery Dubai")}
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
            Car Gallery Dubai is a leading luxury and supercar dealership in Dubai, offering an
            exclusive selection of Ferrari, Lamborghini, Rolls-Royce, Bentley, Porsche, McLaren,
            Mercedes-Benz and more. Whether you are buying or selling a luxury car in Dubai, our
            specialists deliver a seamless, discreet and world-class experience.
          </p>
          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border/50 pt-6 text-xs text-muted-foreground sm:flex-row">
            <span>© {new Date().getFullYear()} Car Gallery Dubai. All rights reserved.</span>
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
