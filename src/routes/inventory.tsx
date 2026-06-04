import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { Reveal } from "@/components/Reveal";
import {
  cars,
  brands,
  fuelTypes,
  transmissions,
  bodyTypes,
  years,
  models,
  exteriorColours,
  interiorColours,
} from "@/data/cars";

interface InventorySearch {
  brand?: string;
  status?: Status;
}

export const Route = createFileRoute("/inventory")({
  validateSearch: (search: Record<string, unknown>): InventorySearch => {
    const validStatuses = ["available", "sold", "featured", "latest"];
    return {
      brand: typeof search.brand === "string" ? search.brand : undefined,
      status: validStatuses.includes(search.status as string)
        ? (search.status as Status)
        : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Luxury Car Inventory For Sale in Dubai | Car Gallery Dubai" },
      {
        name: "description",
        content:
          "Browse our full inventory of luxury cars and supercars for sale in Dubai. Filter by brand, model, price, year, mileage, fuel type, colour and more.",
      },
      { property: "og:title", content: "Luxury Car Inventory | Car Gallery Dubai" },
    ],
    links: [{ rel: "canonical", href: "/inventory" }],
  }),
  component: Inventory,
});

type Status = "all" | "available" | "sold" | "featured" | "latest";

function Inventory() {
  const search = Route.useSearch();
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("all");
  const [model, setModel] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [trans, setTrans] = useState("all");
  const [body, setBody] = useState("all");
  const [year, setYear] = useState("all");
  const [ext, setExt] = useState("all");
  const [int, setInt] = useState("all");
  const [status, setStatus] = useState<Status>("all");
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [maxMileage, setMaxMileage] = useState(20000);
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Apply incoming URL params (e.g. from the mega menu).
  useEffect(() => {
    if (search.brand) setBrand(search.brand);
    if (search.status) setStatus(search.status);
  }, [search.brand, search.status]);

  const filtered = useMemo(() => {
    let list = cars.filter((c) => {
      if (q && !`${c.title} ${c.brand} ${c.model}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      if (brand !== "all" && c.brandSlug !== brand) return false;
      if (model !== "all" && c.model !== model) return false;
      if (fuel !== "all" && c.fuel !== fuel) return false;
      if (trans !== "all" && c.transmission !== trans) return false;
      if (body !== "all" && c.bodyType !== body) return false;
      if (year !== "all" && String(c.year) !== year) return false;
      if (ext !== "all" && c.exteriorColour !== ext) return false;
      if (int !== "all" && c.interiorColour !== int) return false;
      if (status === "available" && c.sold) return false;
      if (status === "sold" && !c.sold) return false;
      if (status === "featured" && !c.featured) return false;
      if (status === "latest" && !c.newArrival) return false;
      if (c.price > maxPrice) return false;
      if (c.mileage > maxMileage) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "mileage") return a.mileage - b.mileage;
      return b.year - a.year;
    });
    return list;
  }, [q, brand, model, fuel, trans, body, year, ext, int, status, maxPrice, maxMileage, sort]);

  const reset = () => {
    setQ("");
    setBrand("all");
    setModel("all");
    setFuel("all");
    setTrans("all");
    setBody("all");
    setYear("all");
    setExt("all");
    setInt("all");
    setStatus("all");
    setMaxPrice(2000000);
    setMaxMileage(20000);
  };

  const FilterPanel = (
    <div className="space-y-1">
      <FilterGroup label="Status">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { v: "all", l: "All" },
              { v: "available", l: "Available" },
              { v: "sold", l: "Sold" },
              { v: "featured", l: "Featured" },
              { v: "latest", l: "Latest Arrivals" },
            ] as { v: Status; l: string }[]
          ).map((s) => (
            <button
              key={s.v}
              onClick={() => setStatus(s.v)}
              className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                status === s.v
                  ? "bg-gold text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-gold"
              }`}
            >
              {s.l}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Brand">
        <Select
          value={brand}
          onChange={setBrand}
          options={[{ v: "all", l: "All Brands" }, ...brands.map((b) => ({ v: b.slug, l: b.name }))]}
        />
      </FilterGroup>

      <FilterGroup label="Model">
        <Select
          value={model}
          onChange={setModel}
          options={[{ v: "all", l: "Any Model" }, ...models.map((m) => ({ v: m, l: m }))]}
        />
      </FilterGroup>

      <FilterGroup label={`Max Price: AED ${maxPrice.toLocaleString()}`}>
        <input
          type="range"
          min={500000}
          max={2000000}
          step={50000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-gold"
        />
      </FilterGroup>

      <FilterGroup label={`Max Mileage: ${maxMileage.toLocaleString()} km`}>
        <input
          type="range"
          min={2000}
          max={20000}
          step={500}
          value={maxMileage}
          onChange={(e) => setMaxMileage(Number(e.target.value))}
          className="w-full accent-gold"
        />
      </FilterGroup>

      <FilterGroup label="Year">
        <Select
          value={year}
          onChange={setYear}
          options={[{ v: "all", l: "Any Year" }, ...years.map((y) => ({ v: String(y), l: String(y) }))]}
        />
      </FilterGroup>

      <FilterGroup label="Body Type">
        <Select
          value={body}
          onChange={setBody}
          options={[{ v: "all", l: "Any" }, ...bodyTypes.map((t) => ({ v: t, l: t }))]}
        />
      </FilterGroup>

      <FilterGroup label="Transmission">
        <Select
          value={trans}
          onChange={setTrans}
          options={[{ v: "all", l: "Any" }, ...transmissions.map((t) => ({ v: t, l: t }))]}
        />
      </FilterGroup>

      <FilterGroup label="Fuel Type">
        <Select
          value={fuel}
          onChange={setFuel}
          options={[{ v: "all", l: "Any" }, ...fuelTypes.map((f) => ({ v: f, l: f }))]}
        />
      </FilterGroup>

      <FilterGroup label="Exterior Colour">
        <Select
          value={ext}
          onChange={setExt}
          options={[{ v: "all", l: "Any" }, ...exteriorColours.map((c) => ({ v: c, l: c }))]}
        />
      </FilterGroup>

      <FilterGroup label="Interior Colour">
        <Select
          value={int}
          onChange={setInt}
          options={[{ v: "all", l: "Any" }, ...interiorColours.map((c) => ({ v: c, l: c }))]}
        />
      </FilterGroup>
    </div>
  );

  return (
    <div className="pt-28">
      <div className="border-b border-border/60 bg-grain">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <span className="text-xs uppercase tracking-luxury text-gold">Inventory</span>
          <h1 className="mt-3 text-4xl md:text-5xl">Cars For Sale In Dubai</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {cars.length} curated vehicles. Use the filters to find your perfect match.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-8 px-5 py-10">
        {/* Desktop filters sidebar */}
        <aside className="hidden lg:block lg:w-72 lg:shrink-0">
          <div className="glass sticky top-28 rounded-2xl p-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg">Filters</h2>
              <button onClick={reset} className="text-xs uppercase tracking-widest text-gold">
                Reset
              </button>
            </div>
            {FilterPanel}
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by make or model..."
                className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-gold"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-gold"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="mileage">Lowest Mileage</option>
            </select>
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 text-gold" /> Filters
            </button>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">{filtered.length} vehicles found</p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-16 text-center">
              <p className="text-muted-foreground">No vehicles match your filters.</p>
              <button onClick={reset} className="mt-4 text-gold underline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((car, i) => (
                <Reveal key={car.slug} delay={(i % 3) * 0.06}>
                  <CarCard car={car} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile slide-out filter panel */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="glass-strong fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm overflow-y-auto p-6 shadow-luxury lg:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg">Filters</h2>
                <div className="flex items-center gap-3">
                  <button onClick={reset} className="text-xs uppercase tracking-widest text-gold">
                    Reset
                  </button>
                  <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {FilterPanel}
              <button
                onClick={() => setShowFilters(false)}
                className="mt-6 w-full rounded-full bg-gold py-3 text-xs font-medium uppercase tracking-widest text-primary-foreground"
              >
                Show {filtered.length} Vehicles
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border/60 py-5">
      <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-gold"
    >
      {options.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
  );
}
