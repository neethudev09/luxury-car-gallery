import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Hand, Gauge, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { featuredCars } from "@/data/cars";

const aed = (n: number) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }).format(n);

/**
 * Premium real-inventory vehicle showcase.
 *
 * Replaces the CGI configurator with a luxury showroom presentation built from
 * actual stock photography. Users drag / swipe left and right to move between
 * real vehicles. Each car sits on a dark stage with soft spotlight lighting and
 * a mirrored reflection — a premium dealership viewing experience rather than a
 * rendered configurator.
 */
export function VehicleShowcase() {
  const cars = featuredCars.length ? featuredCars : [];
  const [index, setIndex] = useState(0);
  const drag = useRef<{ startX: number; moved: boolean } | null>(null);

  if (!cars.length) return null;
  const car = cars[index];

  const go = (dir: number) => setIndex((i) => (i + dir + cars.length) % cars.length);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, moved: false };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.moved) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 60) {
      go(dx < 0 ? 1 : -1);
      d.moved = true;
    }
  };
  const onPointerUp = () => {
    drag.current = null;
  };

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-luxury sm:p-8">
      <div className="absolute right-5 top-5 z-20 flex items-center gap-1.5 rounded-full glass-strong px-3 py-1 text-[0.6rem] uppercase tracking-widest text-gold">
        Live Inventory
      </div>

      {/* Stage */}
      <div
        className="relative mx-auto flex h-64 cursor-grab touch-none select-none items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-background/40 to-background active:cursor-grabbing sm:h-80"
        style={{ perspective: "1400px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Soft spotlight */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[80%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_color-mix(in_oklab,_var(--gold)_18%,_transparent),_transparent_60%)]" />

        {/* Vehicle */}
        <img
          key={car.slug}
          src={car.image}
          alt={`${car.title} — real stock vehicle`}
          draggable={false}
          className="relative z-10 max-h-[78%] w-[86%] object-contain drop-shadow-2xl"
        />

        {/* Reflection */}
        <img
          src={car.image}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute bottom-2 left-1/2 z-0 w-[86%] -translate-x-1/2 scale-y-[-0.4] object-contain opacity-25 blur-[2px]"
          style={{
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
          }}
        />

        {/* Floor line */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 h-1 w-[64%] -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* Arrows */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous vehicle"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full glass-strong text-gold transition-colors hover:bg-gold/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next vehicle"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full glass-strong text-gold transition-colors hover:bg-gold/10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Caption */}
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-widest text-gold">{car.brand}</p>
          <h3 className="mt-1 text-lg font-medium leading-tight sm:text-xl">{car.title}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-gold" /> {car.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-gold" /> {car.mileage.toLocaleString()} km
            </span>
            <span className="text-foreground">{aed(car.price)}</span>
          </div>
        </div>
        <Link
          to="/cars/$slug"
          params={{ slug: car.slug }}
          className="shrink-0 rounded-full border border-gold/40 px-4 py-2 text-xs uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
        >
          View
        </Link>
      </div>

      {/* Dots */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {cars.map((c, i) => (
            <button
              key={c.slug}
              onClick={() => setIndex(i)}
              aria-label={`Show ${c.title}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-7 bg-gold" : "w-3 bg-border hover:bg-gold/40"
              }`}
            />
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          <Hand className="h-3.5 w-3.5" /> Drag to browse stock
        </span>
      </div>
    </div>
  );
}
