import carPlaceholder from "@/assets/car-placeholder.jpg";
import bentleyGt1 from "@/assets/cars/bentley-gt-speed/1.webp";
import bentleyGt2 from "@/assets/cars/bentley-gt-speed/2.webp";
import bentleyGt3 from "@/assets/cars/bentley-gt-speed/3.webp";
import bentleyGt4 from "@/assets/cars/bentley-gt-speed/4.webp";
import bentleyGt5 from "@/assets/cars/bentley-gt-speed/5.webp";
import bentleyGt6 from "@/assets/cars/bentley-gt-speed/6.webp";
import bentleyGt7 from "@/assets/cars/bentley-gt-speed/7.webp";
import bentleyGt8 from "@/assets/cars/bentley-gt-speed/8.webp";
import bentleyGt9 from "@/assets/cars/bentley-gt-speed/9.webp";
import bentleyGt10 from "@/assets/cars/bentley-gt-speed/10.webp";

const bentleyGtSpeedImages = [
  bentleyGt1, bentleyGt2, bentleyGt3, bentleyGt4, bentleyGt5,
  bentleyGt6, bentleyGt7, bentleyGt8, bentleyGt9, bentleyGt10,
];

import ferrari812Gts1 from "@/assets/cars/ferrari-812-gts/1.webp";
import ferrari812Gts2 from "@/assets/cars/ferrari-812-gts/2.webp";
import ferrari812Gts3 from "@/assets/cars/ferrari-812-gts/3.webp";
import ferrari812Gts4 from "@/assets/cars/ferrari-812-gts/4.webp";
import ferrari812Gts5 from "@/assets/cars/ferrari-812-gts/5.webp";
import ferrari812Gts6 from "@/assets/cars/ferrari-812-gts/6.webp";
import ferrari812Gts7 from "@/assets/cars/ferrari-812-gts/7.webp";
import ferrari812Gts8 from "@/assets/cars/ferrari-812-gts/8.webp";
import ferrari812Gts9 from "@/assets/cars/ferrari-812-gts/9.webp";
import ferrari812Gts10 from "@/assets/cars/ferrari-812-gts/10.webp";

const ferrari812GtsImages = [
  ferrari812Gts1, ferrari812Gts2, ferrari812Gts3, ferrari812Gts4, ferrari812Gts5,
  ferrari812Gts6, ferrari812Gts7, ferrari812Gts8, ferrari812Gts9, ferrari812Gts10,
];

import bmwX7_1 from "@/assets/cars/bmw-x7/1.webp";
import bmwX7_2 from "@/assets/cars/bmw-x7/2.webp";
import bmwX7_3 from "@/assets/cars/bmw-x7/3.webp";
import bmwX7_4 from "@/assets/cars/bmw-x7/4.webp";
import bmwX7_5 from "@/assets/cars/bmw-x7/5.webp";
import bmwX7_6 from "@/assets/cars/bmw-x7/6.webp";
import bmwX7_7 from "@/assets/cars/bmw-x7/7.webp";
import bmwX7_8 from "@/assets/cars/bmw-x7/8.webp";
import bmwX7_9 from "@/assets/cars/bmw-x7/9.webp";
import bmwX7_10 from "@/assets/cars/bmw-x7/10.webp";


const bmwX7Images = [
  bmwX7_1, bmwX7_2, bmwX7_3, bmwX7_4, bmwX7_5,
  bmwX7_6, bmwX7_7, bmwX7_8, bmwX7_9, bmwX7_10,
];

import bmw5_1 from "@/assets/cars/bmw-5-series/1.webp";
import bmw5_2 from "@/assets/cars/bmw-5-series/2.webp";
import bmw5_3 from "@/assets/cars/bmw-5-series/3.webp";
import bmw5_4 from "@/assets/cars/bmw-5-series/4.webp";
import bmw5_5 from "@/assets/cars/bmw-5-series/5.webp";
import bmw5_6 from "@/assets/cars/bmw-5-series/6.webp";
import bmw5_7 from "@/assets/cars/bmw-5-series/7.webp";
import bmw5_8 from "@/assets/cars/bmw-5-series/8.webp";
import bmw5_9 from "@/assets/cars/bmw-5-series/9.webp";
import bmw5_10 from "@/assets/cars/bmw-5-series/10.webp";

const bmw5SeriesImages = [
  bmw5_1, bmw5_2, bmw5_3, bmw5_4, bmw5_5,
  bmw5_6, bmw5_7, bmw5_8, bmw5_9, bmw5_10,
];

import sf90_1 from "@/assets/cars/ferrari-sf90/1.webp";
import sf90_2 from "@/assets/cars/ferrari-sf90/2.webp";
import sf90_3 from "@/assets/cars/ferrari-sf90/3.webp";
import sf90_4 from "@/assets/cars/ferrari-sf90/4.webp";
import sf90_5 from "@/assets/cars/ferrari-sf90/5.webp";
import sf90_6 from "@/assets/cars/ferrari-sf90/6.webp";
import sf90_7 from "@/assets/cars/ferrari-sf90/7.webp";
import sf90_8 from "@/assets/cars/ferrari-sf90/8.webp";
import sf90_9 from "@/assets/cars/ferrari-sf90/9.webp";
import sf90_10 from "@/assets/cars/ferrari-sf90/10.webp";

const ferrariSf90Images = [
  sf90_1, sf90_2, sf90_3, sf90_4, sf90_5,
  sf90_6, sf90_7, sf90_8, sf90_9, sf90_10,
];



export interface Brand {
  name: string;
  slug: string;
  available: number;
  sold: number;
}

export const brands: Brand[] = [
  { name: "Aston Martin", slug: "aston-martin", available: 1, sold: 0 },
  { name: "Bentley", slug: "bentley", available: 1, sold: 0 },
  { name: "BMW", slug: "bmw", available: 2, sold: 0 },
  { name: "Ferrari", slug: "ferrari", available: 3, sold: 0 },
  { name: "Lamborghini", slug: "lamborghini", available: 3, sold: 0 },
  { name: "Mercedes-Benz", slug: "mercedes-benz", available: 2, sold: 0 },
  { name: "Porsche", slug: "porsche", available: 5, sold: 0 },
  { name: "Range Rover", slug: "range-rover", available: 1, sold: 0 },
  { name: "Rolls-Royce", slug: "rolls-royce", available: 2, sold: 0 },
  { name: "Tesla", slug: "tesla", available: 1, sold: 0 },
];

export const brandImage: Record<string, string> = {
  ferrari: carPlaceholder,
  lamborghini: carPlaceholder,
  porsche: carPlaceholder,
  "rolls-royce": carPlaceholder,
  bentley: carPlaceholder,
  "mercedes-benz": carPlaceholder,
  mclaren: carPlaceholder,
  "aston-martin": carPlaceholder,
  bmw: carPlaceholder,
  audi: carPlaceholder,
  "range-rover": carPlaceholder,
  tesla: carPlaceholder,
};

export interface Car {
  slug: string;
  title: string;
  brand: string;
  brandSlug: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  bodyType: string;
  exteriorColour: string;
  interiorColour: string;
  engine: string;
  horsepower: number;
  torque: number;
  topSpeed: number;
  accel: number;
  image: string;
  images?: string[];
  featured: boolean;
  newArrival: boolean;
  sold: boolean;
  description: string;
  features: string[];
  specs: Record<string, string>;
}

const perf: Record<string, { engine: string; hp: number; tq: number; top: number; accel: number }> = {
  ferrari: { engine: "Twin-Turbo V8", hp: 661, tq: 760, top: 330, accel: 3.0 },
  lamborghini: { engine: "V12", hp: 730, tq: 720, top: 350, accel: 2.9 },
  porsche: { engine: "Twin-Turbo Flat-6", hp: 641, tq: 800, top: 330, accel: 2.7 },
  "rolls-royce": { engine: "Twin-Turbo V12", hp: 563, tq: 850, top: 250, accel: 4.8 },
  bentley: { engine: "Twin-Turbo W12", hp: 626, tq: 900, top: 333, accel: 3.6 },
  "mercedes-benz": { engine: "Twin-Turbo V8", hp: 577, tq: 700, top: 318, accel: 3.5 },
  mclaren: { engine: "Twin-Turbo V8", hp: 710, tq: 770, top: 341, accel: 2.8 },
  "aston-martin": { engine: "Twin-Turbo V8", hp: 630, tq: 700, top: 322, accel: 3.7 },
  bmw: { engine: "Twin-Turbo", hp: 523, tq: 750, top: 290, accel: 3.8 },
  "range-rover": { engine: "Twin-Turbo V8", hp: 523, tq: 750, top: 250, accel: 4.4 },
  tesla: { engine: "Tri-Motor Electric", hp: 845, tq: 1000, top: 210, accel: 2.6 },
};

const fmtFeatures = [
  "Full Service History",
  "Premium Sound System",
  "Adaptive Suspension",
  "Heated & Ventilated Seats",
  "360 Camera System",
  "Carbon / Premium Interior Pack",
];

// Auto-loaded car galleries. Any folder under src/assets/cars/<car-slug>/ whose
// name matches a car slug is picked up here (files named 1.webp, 2.webp, ...).
const galleryModules = import.meta.glob("../assets/cars/*/*.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const carGalleries: Record<string, string[]> = {};
{
  const buckets: Record<string, { n: number; url: string }[]> = {};
  for (const [path, url] of Object.entries(galleryModules)) {
    const m = path.match(/cars\/([^/]+)\/(\d+)\.webp$/);
    if (!m) continue;
    (buckets[m[1]] ??= []).push({ n: parseInt(m[2], 10), url });
  }
  for (const [slug, arr] of Object.entries(buckets)) {
    carGalleries[slug] = arr.sort((a, b) => a.n - b.n).map((x) => x.url);
  }
}

// Optional flipped/curated hero override per folder (src/assets/cars/<slug>/hero.webp).
// Used when the best available front three-quarter shot faces the wrong way and
// has to be mirrored so it faces right like the Ferrari 812 GTS.
const heroModules = import.meta.glob("../assets/cars/*/hero.webp", {
  eager: true,
  import: "default",
}) as Record<string, string>;
const heroOverrides: Record<string, string> = {};
for (const [path, url] of Object.entries(heroModules)) {
  const m = path.match(/cars\/([^/]+)\/hero\.webp$/);
  if (m) heroOverrides[m[1]] = url;
}

type CarBase = Omit<Car, "specs" | "engine" | "horsepower" | "torque" | "topSpeed" | "accel" | "newArrival">;

// Which gallery photo (1-based) to use as the thumbnail/hero for each car.
// Chosen so every car is shown in the same front three-quarter angle as the
// Ferrari 812 GTS (car facing to the right).
const heroImageIndex: Record<string, number> = {
  "aston-martin-db12-coupe-2024": 6,
  "porsche-911-gt3rs-2016": 8,
  "porsche-992-911-gt3-rs-weissach-2025": 12,
  "range-rover-autobiography-long-wheel-base-2024": 12,
  "rolls-royce-phantom-2019": 6,
  "tesla-cybertruck-2024": 3,
  "porsche-911-carrera-gts-2023": 13,
  "lamborghini-urus-se-2025": 17,
  "lamborghini-urus-mansory-kit-2019": 17,
  "lamborghini-aventador-2012": 8,
};

const base: CarBase[] = [
  {
    slug: "bentley-continental-gt-2024",
    title: "Bentley GT Speed",
    brand: "Bentley",
    brandSlug: "bentley",
    model: "GT Speed",
    year: 2024,
    price: 930000,
    mileage: 11964,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "White",
    interiorColour: "Beige",
    image: bentleyGtSpeedImages[2],
    images: [
      bentleyGtSpeedImages[3],
      bentleyGtSpeedImages[2],
      bentleyGtSpeedImages[0],
      bentleyGtSpeedImages[1],
      bentleyGtSpeedImages[3],
      bentleyGtSpeedImages[4],
      bentleyGtSpeedImages[5],
      bentleyGtSpeedImages[6],
      bentleyGtSpeedImages[7],
      bentleyGtSpeedImages[8],
      bentleyGtSpeedImages[9],
    ],
    featured: false,
    sold: false,
    description:
      "Bentley GT Speed (2024). GCC spec, finished in White over Beige. 11,964 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "bmw-x7-2019",
    title: "BMW X7",
    brand: "BMW",
    brandSlug: "bmw",
    model: "X7",
    year: 2019,
    price: 159000,
    mileage: 61300,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Black",
    interiorColour: "Cream white/ Blue",
    image: bmwX7Images[0],
    images: bmwX7Images,
    featured: false,
    sold: false,
    description:
      "BMW X7 (2019). European spec, finished in black over Cream white/ Blue. 61,300 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "bmw-520i-2021",
    title: "BMW 520I",
    brand: "BMW",
    brandSlug: "bmw",
    model: "520I",
    year: 2021,
    price: 95000,
    mileage: 39500,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColour: "White",
    interiorColour: "BEIGE Alcantara",
    image: bmw5SeriesImages[0],
    images: bmw5SeriesImages,
    featured: false,
    sold: false,
    description:
      "BMW 520I (2021). Chinese spec, finished in White over BEIGE Alcantara. 39,500 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "ferrari-sf90-stradale-assetto-fiorano-2021",
    title: "Ferrari SF90 Stradale Assetto Fiorano",
    brand: "Ferrari",
    brandSlug: "ferrari",
    model: "SF90 Stradale Assetto Fiorano",
    year: 2021,
    price: 1250000,
    mileage: 3222,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Rosso Corsa",
    interiorColour: "Black / Alcantara",
    image: ferrariSf90Images[0],
    images: ferrariSf90Images,
    featured: true,
    sold: false,
    description:
      "Ferrari SF90 Stradale Assetto Fiorano (2021). Euro spec, finished in Rosso Corsa over Black / Alcantara. 3,222 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "ferrari-812-gts-2024",
    title: "Ferrari 812 GTS",
    brand: "Ferrari",
    brandSlug: "ferrari",
    model: "812 GTS",
    year: 2024,
    price: 2000000,
    mileage: 690,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Verde",
    interiorColour: "Cuoio / Alcantara",
    image: ferrari812GtsImages[1],
    images: [
      ferrari812GtsImages[1],
      ferrari812GtsImages[0],
      ferrari812GtsImages[2],
      ferrari812GtsImages[3],
      ferrari812GtsImages[4],
      ferrari812GtsImages[5],
      ferrari812GtsImages[6],
      ferrari812GtsImages[7],
      ferrari812GtsImages[8],
      ferrari812GtsImages[9],
    ],
    featured: true,
    sold: false,
    description:
      "Ferrari 812 GTS (2024). European spec, finished in Verde over Cuoio / Alcantara. 690 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "porsche-911-carrera-gts-2023",
    title: "Porsche 911 Carrera GTS",
    brand: "Porsche",
    brandSlug: "porsche",
    model: "911 Carrera GTS",
    year: 2023,
    price: 750000,
    mileage: 16310,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Convertible",
    exteriorColour: "Black",
    interiorColour: "Red",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Porsche 911 Carrera GTS (2023). European spec, finished in Black over Red. 16,310 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "lamborghini-aventador-2012",
    title: "Lamborghini Aventador",
    brand: "Lamborghini",
    brandSlug: "lamborghini",
    model: "Aventador",
    year: 2012,
    price: 700000,
    mileage: 31000,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Black",
    interiorColour: "orange/black",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Lamborghini Aventador (2012). Gcc spec, finished in black over orange/black. 31,000 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "lamborghini-urus-se-2025",
    title: "Lamborghini urus se",
    brand: "Lamborghini",
    brandSlug: "lamborghini",
    model: "urus se",
    year: 2025,
    price: 1420000,
    mileage: 76,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Black",
    interiorColour: "Black / Yellow stitching",
    image: carPlaceholder,
    featured: true,
    sold: false,
    description:
      "Lamborghini urus se (2025). European spec, finished in Black over Black / Yellow stitching. 76 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "lamborghini-urus-mansory-kit-2019",
    title: "Lamborghini Urus MANSORY KIT",
    brand: "Lamborghini",
    brandSlug: "lamborghini",
    model: "Urus MANSORY KIT",
    year: 2019,
    price: 730000,
    mileage: 54500,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Yellow with Black Carbon",
    interiorColour: "Black / Yellow",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Lamborghini Urus MANSORY KIT (2019). GCC spec, finished in Yellow with Black Carbon over Black / Yellow. 54,500 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "mercedes-benz-g63-2022",
    title: "Mercedes-Benz G63",
    brand: "Mercedes-Benz",
    brandSlug: "mercedes-benz",
    model: "G63",
    year: 2022,
    price: 480000,
    mileage: 91000,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Grey",
    interiorColour: "black",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Mercedes-Benz G63 (2022). European spec, finished in grey over black. 91,000 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "porsche-992-911-gt3-rs-weissach-2025",
    title: "Porsche 992 911 GT3 RS Weissach",
    brand: "Porsche",
    brandSlug: "porsche",
    model: "992 911 GT3 RS Weissach",
    year: 2025,
    price: 1325000,
    mileage: 5900,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Chalk Grey",
    interiorColour: "Red Leather",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Porsche 992 911 GT3 RS Weissach (2025). European spec, finished in Chalk Grey over Red Leather. 5,900 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "porsche-cayenne-turbo-gt-2025",
    title: "Porsche Cayenne Turbo GT",
    brand: "Porsche",
    brandSlug: "porsche",
    model: "Cayenne Turbo GT",
    year: 2025,
    price: 775000,
    mileage: 28000,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Nardo Grey",
    interiorColour: "Black",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Porsche Cayenne Turbo GT (2025). GCC spec, finished in Nardo Grey over Black. 28,000 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "range-rover-autobiography-long-wheel-base-2024",
    title: "Range Rover autobiography long wheel base",
    brand: "Range Rover",
    brandSlug: "range-rover",
    model: "autobiography long wheel base",
    year: 2024,
    price: 615000,
    mileage: 22000,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "White",
    interiorColour: "Maroon",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Range Rover autobiography long wheel base (2024). Korean spec, finished in white over Maroon. 22,000 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "rolls-royce-phantom-2019",
    title: "Rolls-Royce Phantom",
    brand: "Rolls-Royce",
    brandSlug: "rolls-royce",
    model: "Phantom",
    year: 2019,
    price: 1350000,
    mileage: 15400,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColour: "Black Metallic",
    interiorColour: "Black",
    image: carPlaceholder,
    featured: true,
    sold: false,
    description:
      "Rolls-Royce Phantom (2019). European spec, finished in Black Metallic over Black. 15,400 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "rolls-royce-cullinan-black-badge-2021",
    title: "Rolls-Royce CULLINAN Black Badge",
    brand: "Rolls-Royce",
    brandSlug: "rolls-royce",
    model: "CULLINAN Black Badge",
    year: 2021,
    price: 1350000,
    mileage: 19000,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Black",
    interiorColour: "Blue",
    image: carPlaceholder,
    featured: true,
    sold: false,
    description:
      "Rolls-Royce CULLINAN Black Badge (2021). GCC spec, finished in black over Blue. 19,000 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "tesla-cybertruck-2024",
    title: "Tesla Cybertruck",
    brand: "Tesla",
    brandSlug: "tesla",
    model: "Cybertruck",
    year: 2024,
    price: 375000,
    mileage: 21099,
    fuel: "Electric",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Silver",
    interiorColour: "black",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Tesla Cybertruck (2024). American spec, finished in silver over black. 21,099 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "porsche-911-turbo-s-techart-2020",
    title: "Porsche 911 Turbo S Techart",
    brand: "Porsche",
    brandSlug: "porsche",
    model: "911 Turbo S Techart",
    year: 2020,
    price: 1650000,
    mileage: 26000,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Black",
    interiorColour: "Black / Yellow Accents",
    image: carPlaceholder,
    featured: true,
    sold: false,
    description:
      "Porsche 911 Turbo S Techart (2020). European spec, finished in Black over Black / Yellow Accents. 26,000 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "aston-martin-db12-coupe-2024",
    title: "Aston Martin DB12 Coupe",
    brand: "Aston Martin",
    brandSlug: "aston-martin",
    model: "DB12 Coupe",
    year: 2024,
    price: 109900,
    mileage: 1500,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Green",
    interiorColour: "Beige",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Aston Martin DB12 Coupe (2024). GCC spec, finished in Green over Beige. 1,500 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "mercedes-benz-g63-4x4-amg-2022",
    title: "Mercedes-Benz G63 4x4 AMG",
    brand: "Mercedes-Benz",
    brandSlug: "mercedes-benz",
    model: "G63 4x4 AMG",
    year: 2022,
    price: 930000,
    mileage: 17700,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Grey",
    interiorColour: "Black",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Mercedes-Benz G63 4x4 AMG (2022). European spec, finished in Grey over Black. 17,700 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "porsche-911-carrera-classic-coupe-1973",
    title: "Porsche 911 Carrera Classic Coupe",
    brand: "Porsche",
    brandSlug: "porsche",
    model: "911 Carrera Classic Coupe",
    year: 1973,
    price: 730000,
    mileage: 81000,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Brown",
    interiorColour: "Beige",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Porsche 911 Carrera Classic Coupe (1973). European spec, finished in Brown over Beige. 81,000 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
  {
    slug: "porsche-911-gt3rs-2016",
    title: "Porsche 911 GT3RS",
    brand: "Porsche",
    brandSlug: "porsche",
    model: "911 GT3RS",
    year: 2016,
    price: 580000,
    mileage: 46600,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Orange",
    interiorColour: "Black Alcantara with Orange Stitching",
    image: carPlaceholder,
    featured: false,
    sold: false,
    description:
      "Porsche 911 GT3RS (2016). GCC spec, finished in Orange  over Black Alcantara with Orange Stitching. 46,600 km. Presented by Luxury Car Gallery, Dubai.",
    features: fmtFeatures,
  },
];

export const cars: Car[] = base.map((c) => {
  const p = perf[c.brandSlug] ?? { engine: "V8", hp: 600, tq: 700, top: 320, accel: 3.4 };
  const gallery = carGalleries[c.slug];
  const heroIdx = (heroImageIndex[c.slug] ?? 1) - 1;
  const hero =
    heroOverrides[c.slug] ??
    (gallery && gallery[heroIdx] ? gallery[heroIdx] : gallery?.[0]);
  const orderedGallery =
    gallery && gallery.length && hero
      ? [hero, ...gallery.filter((g) => g !== hero)]
      : gallery;
  const withGallery: CarBase =
    gallery && gallery.length ? { ...c, image: hero as string, images: orderedGallery } : c;
  const enriched: Omit<Car, "specs"> = {
    ...withGallery,
    engine: p.engine,
    horsepower: p.hp,
    torque: p.tq,
    topSpeed: p.top,
    accel: p.accel,
    newArrival: c.year >= 2024 && !c.sold,
  };
  return {
    ...enriched,
    specs: {
      Engine: p.engine,
      Power: `${p.hp} bhp`,
      Torque: `${p.tq} Nm`,
      "0-100 km/h": `${p.accel}s`,
      "Top Speed": `${p.top} km/h`,
      Drivetrain: "All-Wheel Drive",
      Transmission: c.transmission,
      "Body Type": c.bodyType,
    },
  };
});

export interface Testimonial {
  name: string;
  location: string;
  car: string;
  rating: number;
  quote: string;
}

export const testimonials: Testimonial[] = [
  { name: "Khalid Al Maktoum", location: "Dubai, UAE", car: "Ferrari", rating: 5, quote: "An impeccable experience from start to finish. The car was exactly as presented and the handover was flawless." },
  { name: "James Whitmore", location: "London, UK", car: "Rolls-Royce", rating: 5, quote: "They sourced and exported my car to the UK seamlessly. White-glove service throughout, truly world-class." },
  { name: "Sofia Rossi", location: "Milan, Italy", car: "Lamborghini Urus", rating: 5, quote: "The most discreet and professional dealership I have dealt with. Buying remotely was effortless." },
  { name: "Ahmed Hassan", location: "Abu Dhabi, UAE", car: "Porsche", rating: 5, quote: "Outstanding inventory and honest pricing. Delivered to my door in pristine condition." },
];

export const recentSales = cars.filter((c) => c.sold);

export const configurator = {
  exterior: [
    { name: "Rosso Corsa", hex: "#c8102e" },
    { name: "Nero Stealth", hex: "#0d0d0d" },
    { name: "Bianco Avus", hex: "#f2f2f2" },
    { name: "GT Silver", hex: "#c7ccce" },
    { name: "Verde British", hex: "#1f4f3a" },
    { name: "Blu Pozzi", hex: "#1b3a6b" },
  ],
  wheels: [
    { name: "Forged Diamond", hex: "#1a1a1a" },
    { name: "Polished Silver", hex: "#d6d6d6" },
    { name: "Satin Bronze", hex: "#8a6a3b" },
  ],
  calipers: [
    { name: "Gold", hex: "#c9a84c" },
    { name: "Red", hex: "#c8102e" },
    { name: "Yellow", hex: "#f4c20d" },
    { name: "Black", hex: "#111111" },
  ],
};

export const featuredCars = cars
  .filter((c) => c.featured && !c.sold)
  .sort((a, b) => {
    const aReal = a.image !== carPlaceholder;
    const bReal = b.image !== carPlaceholder;
    if (aReal !== bReal) return aReal ? -1 : 1;
    return b.year - a.year;
  });

export function getCar(slug: string) {
  return cars.find((c) => c.slug === slug);
}

export const interiorConfig = [
  { name: "Nero", hex: "#161616" },
  { name: "Cuoio Tan", hex: "#a9794a" },
  { name: "Rosso", hex: "#6f1d22" },
  { name: "Bianco Pearl", hex: "#e7e2d8" },
  { name: "Cobalt", hex: "#1c2f52" },
];

/** Best featured (or any) car for a given brand slug, used by the mega menu. */
export function carForBrand(slug: string): Car | undefined {
  return (
    cars.find((c) => c.brandSlug === slug && c.featured && !c.sold) ??
    cars.find((c) => c.brandSlug === slug && !c.sold) ??
    cars.find((c) => c.brandSlug === slug)
  );
}

export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function formatPrice(aed: number) {
  return "AED " + aed.toLocaleString("en-US");
}

export const fuelTypes = ["Petrol", "Hybrid", "Electric"];
export const transmissions = ["Automatic", "Manual"];
export const bodyTypes = ["Coupe", "Sedan", "SUV", "Convertible", "Van"];
export const years = Array.from(new Set(cars.map((c) => c.year))).sort((a, b) => b - a);
export const exteriorColours = Array.from(new Set(cars.map((c) => c.exteriorColour))).sort();
export const interiorColours = Array.from(new Set(cars.map((c) => c.interiorColour))).sort();
export const models = Array.from(new Set(cars.map((c) => c.model))).sort();

export const WHATSAPP = "971542570181";
export const PHONE = "+971 54 257 0181";
export const EMAIL = "info@cargallerydubai.com";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}
