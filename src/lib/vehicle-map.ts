import type { Car } from "@/data/cars";

/** A loosely-typed vehicle row coming from the CMS/database. */
export interface DbVehicle {
  slug: string;
  title: string;
  brand: string;
  brand_slug: string;
  model: string | null;
  year: number | null;
  price: number | null;
  mileage: number | null;
  fuel: string | null;
  transmission: string | null;
  body_type: string | null;
  exterior_colour: string | null;
  interior_colour: string | null;
  engine: string | null;
  horsepower: number | null;
  image: string | null;
  gallery: string[] | null;
  featured: boolean | null;
  new_arrival: boolean | null;
  sold: boolean | null;
  availability: string | null;
  torque?: number | null;
  top_speed?: number | null;
  accel?: number | null;
  description?: string | null;
  features?: string[] | null;
  specs?: Record<string, string> | null;
  video_url?: string | null;
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='768'><rect width='100%' height='100%' fill='#15161a'/></svg>`,
  );

/** Maps a database vehicle row onto the Car shape used by CarCard. */
export function mapDbVehicle(v: DbVehicle): Car {
  return {
    slug: v.slug,
    title: v.title,
    brand: v.brand,
    brandSlug: v.brand_slug,
    model: v.model ?? v.title,
    year: v.year ?? new Date().getFullYear(),
    price: v.price ?? 0,
    mileage: v.mileage ?? 0,
    fuel: v.fuel ?? "—",
    transmission: v.transmission ?? "—",
    bodyType: v.body_type ?? "—",
    exteriorColour: v.exterior_colour ?? "—",
    interiorColour: v.interior_colour ?? "—",
    engine: v.engine ?? "—",
    horsepower: v.horsepower ?? 0,
    torque: v.torque ?? 0,
    topSpeed: v.top_speed ?? 0,
    accel: v.accel ?? 0,
    image: v.image || v.gallery?.[0] || PLACEHOLDER,
    images: (v.gallery && v.gallery.length ? v.gallery : undefined),
    featured: !!v.featured,
    newArrival: !!v.new_arrival,
    sold: !!v.sold,
    description: v.description ?? "",
    features: v.features ?? [],
    specs: v.specs ?? {},
  };
}
