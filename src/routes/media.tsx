import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getPublicVehicles } from "@/lib/public.functions";
import { mapDbVehicle, type DbVehicle } from "@/lib/vehicle-map";
import type { Car } from "@/data/cars";

export const Route = createFileRoute("/media")({
  loader: async () => {
    const res = await getPublicVehicles();
    const cars = (res.vehicles as unknown as DbVehicle[]).map(mapDbVehicle);
    return { cars };
  },
  head: () => ({
    meta: [
      { title: "Luxury Car Image Gallery in Dubai | Luxury Car Gallery Dubai" },
      {
        name: "description",
        content:
          "Browse high-resolution photography of our luxury cars and supercars in Dubai. Filter the image gallery by brand to see every angle of each vehicle.",
      },
      { property: "og:title", content: "Luxury Car Image Gallery | Luxury Car Gallery Dubai" },
      {
        property: "og:description",
        content: "High-resolution image gallery of luxury cars and supercars in Dubai, filterable by brand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/media" }],
  }),
  component: Media,
});

interface GalleryImage {
  src: string;
  alt: string;
  slug: string;
  title: string;
  brand: string;
  brandSlug: string;
}

function Media() {
  const { cars } = Route.useLoaderData() as { cars: Car[] };
  const [brand, setBrand] = useState("all");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const brands = useMemo(() => {
    const seen = new Map<string, string>();
    cars.forEach((c) => seen.set(c.brandSlug, c.brand));
    return Array.from(seen, ([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [cars]);

  const images = useMemo(() => {
    const out: GalleryImage[] = [];
    cars.forEach((c) => {
      const gallery = c.images?.length ? c.images : c.image ? [c.image] : [];
      gallery.forEach((src: string, i: number) => {

        out.push({
          src,
          alt: `${c.title} — photo ${i + 1}`,
          slug: c.slug,
          title: c.title,
          brand: c.brand,
          brandSlug: c.brandSlug,
        });
      });
    });
    return out;
  }, [cars]);

  const filtered = useMemo(
    () => (brand === "all" ? images : images.filter((i) => i.brandSlug === brand)),
    [images, brand],
  );

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <span className="text-xs uppercase tracking-luxury text-gold">Gallery</span>
        <h1 className="mt-3 text-4xl md:text-5xl">Image Gallery</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          High-resolution photography of every vehicle in our Dubai showroom. Filter by brand to explore a specific marque.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setBrand("all")}
            className={`rounded-full px-5 py-2.5 text-xs uppercase tracking-widest transition-colors ${brand === "all" ? "bg-gold text-primary-foreground" : "border border-border text-muted-foreground hover:border-gold"}`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b.slug}
              onClick={() => setBrand(b.slug)}
              className={`rounded-full px-5 py-2.5 text-xs uppercase tracking-widest transition-colors ${brand === b.slug ? "bg-gold text-primary-foreground" : "border border-border text-muted-foreground hover:border-gold"}`}
            >
              {b.name}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "image" : "images"}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 pb-20 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((img, i) => (
            <Reveal key={`${img.slug}-${i}`} delay={(i % 4) * 0.05}>
              <button
                onClick={() => setLightbox(img)}
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-border"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3 text-left text-[11px] uppercase tracking-widest text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {img.title}
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">No images for this brand yet.</p>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-5"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close image"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 rounded-full border border-border p-2 text-muted-foreground hover:border-gold hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} className="max-h-[75vh] w-full rounded-2xl object-contain" />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{lightbox.title}</p>
              <Link
                to="/cars/$slug"
                params={{ slug: lightbox.slug }}
                className="text-xs uppercase tracking-widest text-gold hover:underline"
              >
                View vehicle
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
