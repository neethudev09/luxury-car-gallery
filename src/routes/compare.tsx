import { createFileRoute, Link } from "@tanstack/react-router";
import { GitCompare, Plus, X } from "lucide-react";
import { useCompare } from "@/lib/compare";
import { cars, formatPrice, whatsappLink } from "@/data/cars";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Compare Luxury Cars | Car Gallery Dubai" },
      {
        name: "description",
        content:
          "Compare power, torque, engine, performance, price and features across luxury cars and supercars for sale in Dubai.",
      },
    ],
    links: [{ rel: "canonical", href: "/compare" }],
  }),
  component: ComparePage,
});

const rows: { label: string; get: (c: (typeof cars)[number]) => string }[] = [
  { label: "Price", get: (c) => formatPrice(c.price) },
  { label: "Year", get: (c) => String(c.year) },
  { label: "Engine", get: (c) => c.engine },
  { label: "Power", get: (c) => `${c.horsepower} bhp` },
  { label: "Torque", get: (c) => `${c.torque} Nm` },
  { label: "0–100 km/h", get: (c) => `${c.accel}s` },
  { label: "Top Speed", get: (c) => `${c.topSpeed} km/h` },
  { label: "Transmission", get: (c) => c.transmission },
  { label: "Fuel", get: (c) => c.fuel },
  { label: "Body Type", get: (c) => c.bodyType },
  { label: "Mileage", get: (c) => `${c.mileage.toLocaleString()} km` },
  { label: "Exterior", get: (c) => c.exteriorColour },
  { label: "Interior", get: (c) => c.interiorColour },
];

function ComparePage() {
  const { compare, toggleCompare } = useCompare();
  const items = compare
    .map((slug) => cars.find((c) => c.slug === slug))
    .filter((c): c is (typeof cars)[number] => Boolean(c));

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <span className="text-xs uppercase tracking-luxury text-gold">Side By Side</span>
        <h1 className="mt-3 flex items-center gap-3 text-4xl md:text-5xl">
          <GitCompare className="h-8 w-8 text-gold" /> Compare Vehicles
        </h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-16 text-center">
            <p className="text-muted-foreground">No vehicles selected to compare yet.</p>
            <Link to="/inventory" className="mt-4 inline-block text-gold underline">
              Browse inventory
            </Link>
          </div>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr>
                  <th className="w-40 p-3 text-left align-bottom" />
                  {items.map((c) => (
                    <th key={c.slug} className="p-3 align-bottom">
                      <div className="overflow-hidden rounded-xl border border-border bg-card">
                        <div className="relative aspect-[16/10]">
                          <img src={c.image} alt={c.title} className="h-full w-full object-cover" />
                          <button
                            onClick={() => toggleCompare(c.slug)}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full glass-strong text-gold"
                            aria-label="Remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="p-3 text-left">
                          <div className="flex items-center gap-2">
                            <BrandLogo slug={c.brandSlug} className="h-4 w-4 text-gold" />
                            <span className="text-xs uppercase tracking-widest text-gold">{c.brand}</span>
                          </div>
                          <Link to="/cars/$slug" params={{ slug: c.slug }} className="mt-1 block font-display text-lg hover:text-gold">
                            {c.model}
                          </Link>
                        </div>
                      </div>
                    </th>
                  ))}
                  {items.length < 4 && (
                    <th className="p-3 align-bottom">
                      <Link
                        to="/inventory"
                        className="flex aspect-[16/10] min-w-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                      >
                        <Plus className="h-6 w-6" />
                        <span className="mt-2 text-xs uppercase tracking-widest">Add Vehicle</span>
                      </Link>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.label} className={i % 2 ? "bg-card/40" : ""}>
                    <td className="p-3 text-xs uppercase tracking-widest text-muted-foreground">{r.label}</td>
                    {items.map((c) => (
                      <td key={c.slug} className="p-3 text-sm">{r.get(c)}</td>
                    ))}
                    {items.length < 4 && <td />}
                  </tr>
                ))}
                <tr>
                  <td className="p-3" />
                  {items.map((c) => (
                    <td key={c.slug} className="p-3">
                      <a
                        href={whatsappLink(`I'm interested in the ${c.year} ${c.title}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full bg-gold px-4 py-2 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105"
                      >
                        Enquire
                      </a>
                    </td>
                  ))}
                  {items.length < 4 && <td />}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
