import { Link } from "@tanstack/react-router";
import { Gauge, Fuel, Settings2, Calendar, Eye, GitCompare, Heart, Zap, Cog } from "lucide-react";
import type { Car } from "@/data/cars";
import { formatPrice, whatsappLink } from "@/data/cars";
import { BrandLogo } from "@/components/BrandLogo";
import { useCompare } from "@/lib/compare";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.83 9.83 0 001.999 5.928l-.999 3.648 3.49-.875zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export function CarCard({ car }: { car: Car }) {
  const { toggleCompare, toggleSaved, isCompared, isSaved } = useCompare();
  const compared = isCompared(car.slug);
  const saved = isSaved(car.slug);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-luxury hover-lift">
      <Link to="/cars/$slug" params={{ slug: car.slug }} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={car.image}
            alt={`${car.year} ${car.title} for sale in Dubai`}
            loading="lazy"
            width={1024}
            height={768}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {car.featured && !car.sold && (
              <span className="rounded-full bg-gold px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-primary-foreground">
                Featured
              </span>
            )}
            {car.newArrival && (
              <span className="rounded-full bg-emerald-500 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-white">
                New Arrival
              </span>
            )}
            {car.sold && (
              <span className="rounded-full bg-destructive px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-destructive-foreground">
                Sold
              </span>
            )}
          </div>

          {/* Brand logo */}
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full glass text-gold">
            <BrandLogo slug={car.brandSlug} className="h-5 w-5" />
          </span>

          {/* Hover reveal: extra spec strip */}
          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-around gap-2 glass px-3 py-2.5 text-[0.65rem] text-foreground/90 transition-transform duration-500 group-hover:translate-y-0">
            <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-gold" /> {car.horsepower} bhp</span>
            <span className="flex items-center gap-1"><Cog className="h-3.5 w-3.5 text-gold" /> {car.engine.split(" ").slice(-1)}</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-gold" /> Quick View</span>
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-widest text-gold">{car.brand}</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {car.year}
          </span>
        </div>
        <Link to="/cars/$slug" params={{ slug: car.slug }}>
          <h3 className="mt-1 text-xl transition-colors group-hover:text-gold">{car.model}</h3>
        </Link>

        <div className="mt-4 grid grid-cols-3 gap-2 border-y border-border/60 py-3 text-center text-xs text-muted-foreground">
          <span className="flex flex-col items-center gap-1">
            <Gauge className="h-4 w-4 text-gold" /> {car.mileage.toLocaleString()} km
          </span>
          <span className="flex flex-col items-center gap-1">
            <Fuel className="h-4 w-4 text-gold" /> {car.fuel}
          </span>
          <span className="flex flex-col items-center gap-1">
            <Settings2 className="h-4 w-4 text-gold" /> {car.transmission}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">Price</p>
            <p className="font-display text-lg text-gold">{formatPrice(car.price)}</p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => toggleSaved(car.slug)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                      saved ? "border-gold bg-gold/10 text-gold" : "border-border text-foreground/70 hover:border-gold hover:text-gold"
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${saved ? "fill-gold" : ""}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="border border-border/60 bg-card text-xs text-foreground shadow-luxury">
                  {saved ? "Remove from saved" : "Save this vehicle"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => toggleCompare(car.slug)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                      compared ? "border-gold bg-gold/10 text-gold" : "border-border text-foreground/70 hover:border-gold hover:text-gold"
                    }`}
                  >
                    <GitCompare className="h-4.5 w-4.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="border border-border/60 bg-card text-xs text-foreground shadow-luxury">
                  {compared ? "Remove from comparison" : "Compare this vehicle"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={whatsappLink(`I'm interested in the ${car.year} ${car.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/40 text-emerald-400 transition-colors hover:bg-emerald-500 hover:text-white"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="top" className="border border-border/60 bg-card text-xs text-foreground shadow-luxury">
                  WhatsApp enquiry
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </article>
  );
}
