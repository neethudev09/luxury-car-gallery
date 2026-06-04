import carFerrari from "@/assets/car-ferrari.jpg";
import carLamborghini from "@/assets/car-lamborghini.jpg";
import carPorsche from "@/assets/car-porsche.jpg";
import carRollsRoyce from "@/assets/car-rollsroyce.jpg";
import carBentley from "@/assets/car-bentley.jpg";
import carMercedes from "@/assets/car-mercedes.jpg";
import carMcLaren from "@/assets/car-mclaren.jpg";
import carAstonMartin from "@/assets/car-astonmartin.jpg";

export interface Brand {
  name: string;
  slug: string;
  available: number;
  sold: number;
}

export const brands: Brand[] = [
  { name: "Ferrari", slug: "ferrari", available: 8, sold: 24 },
  { name: "Lamborghini", slug: "lamborghini", available: 6, sold: 19 },
  { name: "Porsche", slug: "porsche", available: 12, sold: 31 },
  { name: "Rolls-Royce", slug: "rolls-royce", available: 5, sold: 14 },
  { name: "Bentley", slug: "bentley", available: 7, sold: 17 },
  { name: "BMW", slug: "bmw", available: 9, sold: 22 },
  { name: "Mercedes-Benz", slug: "mercedes-benz", available: 11, sold: 28 },
  { name: "McLaren", slug: "mclaren", available: 4, sold: 11 },
  { name: "Aston Martin", slug: "aston-martin", available: 3, sold: 9 },
  { name: "Audi", slug: "audi", available: 6, sold: 15 },
  { name: "Range Rover", slug: "range-rover", available: 8, sold: 20 },
];

export const brandImage: Record<string, string> = {
  ferrari: carFerrari,
  lamborghini: carLamborghini,
  porsche: carPorsche,
  "rolls-royce": carRollsRoyce,
  bentley: carBentley,
  "mercedes-benz": carMercedes,
  mclaren: carMcLaren,
  "aston-martin": carAstonMartin,
  bmw: carMercedes,
  audi: carPorsche,
  "range-rover": carRollsRoyce,
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
  featured: boolean;
  newArrival: boolean;
  sold: boolean;
  description: string;
  features: string[];
  specs: Record<string, string>;
}

const perf: Record<string, { engine: string; hp: number; tq: number; top: number; accel: number }> = {
  ferrari: { engine: "3.9L Twin-Turbo V8", hp: 661, tq: 760, top: 330, accel: 3.0 },
  lamborghini: { engine: "6.5L V12", hp: 730, tq: 720, top: 350, accel: 2.9 },
  porsche: { engine: "3.8L Twin-Turbo Flat-6", hp: 641, tq: 800, top: 330, accel: 2.7 },
  "rolls-royce": { engine: "6.75L Twin-Turbo V12", hp: 563, tq: 850, top: 250, accel: 4.8 },
  bentley: { engine: "6.0L Twin-Turbo W12", hp: 626, tq: 900, top: 333, accel: 3.6 },
  "mercedes-benz": { engine: "4.0L Twin-Turbo V8", hp: 577, tq: 700, top: 318, accel: 3.5 },
  mclaren: { engine: "4.0L Twin-Turbo V8", hp: 710, tq: 770, top: 341, accel: 2.8 },
  "aston-martin": { engine: "5.2L Twin-Turbo V12", hp: 630, tq: 700, top: 322, accel: 3.7 },
};

const fmtFeatures = [
  "Carbon Ceramic Brakes",
  "Full Service History",
  "Panoramic Glass Roof",
  "Bang & Olufsen Sound",
  "Adaptive Suspension",
  "Heated & Ventilated Seats",
  "360° Camera System",
  "Carbon Fibre Interior Pack",
];

function makeSpecs(c: Partial<Car>): Record<string, string> {
  return {
    Engine: "Twin-Turbo V8",
    Power: "640 bhp",
    "0–100 km/h": "3.2s",
    "Top Speed": "330 km/h",
    Drivetrain: "All-Wheel Drive",
    Doors: "2",
    Seats: "2",
    "Body Type": c.bodyType || "Coupe",
  };
}

type CarBase = Omit<Car, "specs" | "engine" | "horsepower" | "torque" | "topSpeed" | "accel" | "newArrival">;

const base: CarBase[] = [
  {
    slug: "ferrari-488-gtb-2022",
    title: "Ferrari 488 GTB",
    brand: "Ferrari",
    brandSlug: "ferrari",
    model: "488 GTB",
    year: 2022,
    price: 1150000,
    mileage: 8200,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Rosso Corsa",
    interiorColour: "Nero",
    image: carFerrari,
    featured: true,
    sold: false,
    description:
      "An immaculate Ferrari 488 GTB finished in iconic Rosso Corsa over a Nero leather cabin. A flagship of Maranello engineering, presented in showroom condition with full service history.",
    features: fmtFeatures,
  },
  {
    slug: "lamborghini-aventador-2021",
    title: "Lamborghini Aventador S",
    brand: "Lamborghini",
    brandSlug: "lamborghini",
    model: "Aventador S",
    year: 2021,
    price: 1750000,
    mileage: 5400,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Nero Aldebaran",
    interiorColour: "Rosso Alala",
    image: carLamborghini,
    featured: true,
    sold: false,
    description:
      "A commanding Aventador S in stealth Nero Aldebaran. Naturally aspirated V12 theatre with active aerodynamics and four-wheel steering — a true Dubai statement.",
    features: fmtFeatures,
  },
  {
    slug: "porsche-911-turbo-s-2023",
    title: "Porsche 911 Turbo S",
    brand: "Porsche",
    brandSlug: "porsche",
    model: "911 Turbo S",
    year: 2023,
    price: 920000,
    mileage: 3100,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "GT Silver",
    interiorColour: "Bordeaux Red",
    image: carPorsche,
    featured: true,
    sold: false,
    description:
      "The definitive everyday supercar. This 911 Turbo S pairs relentless performance with effortless luxury, beautifully specified in GT Silver Metallic.",
    features: fmtFeatures,
  },
  {
    slug: "rolls-royce-ghost-2022",
    title: "Rolls-Royce Ghost",
    brand: "Rolls-Royce",
    brandSlug: "rolls-royce",
    model: "Ghost",
    year: 2022,
    price: 1480000,
    mileage: 9800,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Sedan",
    exteriorColour: "Arctic White",
    interiorColour: "Tan",
    image: carRollsRoyce,
    featured: true,
    sold: false,
    description:
      "The pinnacle of effortless luxury. A serene Rolls-Royce Ghost with Starlight headliner and bespoke commissioning throughout.",
    features: fmtFeatures,
  },
  {
    slug: "bentley-continental-gt-2021",
    title: "Bentley Continental GT",
    brand: "Bentley",
    brandSlug: "bentley",
    model: "Continental GT",
    year: 2021,
    price: 780000,
    mileage: 12400,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Sequin Blue",
    interiorColour: "Saddle",
    image: carBentley,
    featured: false,
    sold: false,
    description:
      "A grand tourer without compromise. The Continental GT blends handcrafted British luxury with W12 performance, finished in striking Sequin Blue.",
    features: fmtFeatures,
  },
  {
    slug: "mercedes-amg-gt-2022",
    title: "Mercedes-AMG GT",
    brand: "Mercedes-Benz",
    brandSlug: "mercedes-benz",
    model: "AMG GT",
    year: 2022,
    price: 690000,
    mileage: 7600,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Obsidian Black",
    interiorColour: "Silver Pearl",
    image: carMercedes,
    featured: true,
    sold: false,
    description:
      "Hand-built AMG performance wrapped in menacing Obsidian Black. A driver's GT with a soundtrack to match its presence.",
    features: fmtFeatures,
  },
  {
    slug: "mclaren-720s-2021",
    title: "McLaren 720S",
    brand: "McLaren",
    brandSlug: "mclaren",
    model: "720S",
    year: 2021,
    price: 1090000,
    mileage: 6900,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Papaya Spark",
    interiorColour: "Carbon Black",
    image: carMcLaren,
    featured: false,
    sold: false,
    description:
      "A masterclass in lightweight engineering. The 720S delivers breathtaking pace and visibility, finished in signature Papaya Spark.",
    features: fmtFeatures,
  },
  {
    slug: "aston-martin-db11-2020",
    title: "Aston Martin DB11",
    brand: "Aston Martin",
    brandSlug: "aston-martin",
    model: "DB11",
    year: 2020,
    price: 640000,
    mileage: 15200,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Apex Green",
    interiorColour: "Obsidian",
    image: carAstonMartin,
    featured: false,
    sold: true,
    description:
      "Quintessentially British grand touring. The DB11 marries elegant design with effortless V12 muscle, presented in bespoke Apex Green.",
    features: fmtFeatures,
  },
  {
    slug: "ferrari-roma-2023",
    title: "Ferrari Roma",
    brand: "Ferrari",
    brandSlug: "ferrari",
    model: "Roma",
    year: 2023,
    price: 980000,
    mileage: 2100,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "Coupe",
    exteriorColour: "Rosso Corsa",
    interiorColour: "Cuoio",
    image: carFerrari,
    featured: false,
    sold: true,
    description:
      "La Nuova Dolce Vita. The Ferrari Roma is a timeless front-engined GT combining elegance with 612 bhp of effortless performance.",
    features: fmtFeatures,
  },
  {
    slug: "porsche-cayenne-turbo-2022",
    title: "Porsche Cayenne Turbo GT",
    brand: "Porsche",
    brandSlug: "porsche",
    model: "Cayenne Turbo GT",
    year: 2022,
    price: 720000,
    mileage: 11200,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "GT Silver",
    interiorColour: "Black",
    image: carPorsche,
    featured: false,
    sold: false,
    description:
      "The performance SUV redefined. The Cayenne Turbo GT offers supercar pace with five-seat practicality and obsessive build quality.",
    features: fmtFeatures,
  },
  {
    slug: "lamborghini-urus-2023",
    title: "Lamborghini Urus S",
    brand: "Lamborghini",
    brandSlug: "lamborghini",
    model: "Urus S",
    year: 2023,
    price: 1280000,
    mileage: 1800,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Nero Noctis",
    interiorColour: "Rosso",
    image: carLamborghini,
    featured: true,
    sold: false,
    description:
      "The original super-SUV, evolved. The Urus S delivers 657 bhp and unmistakable Lamborghini drama in a usable everyday package.",
    features: fmtFeatures,
  },
  {
    slug: "bentley-bentayga-2021",
    title: "Bentley Bentayga",
    brand: "Bentley",
    brandSlug: "bentley",
    model: "Bentayga",
    year: 2021,
    price: 820000,
    mileage: 14600,
    fuel: "Petrol",
    transmission: "Automatic",
    bodyType: "SUV",
    exteriorColour: "Sequin Blue",
    interiorColour: "Linen",
    image: carBentley,
    featured: false,
    sold: true,
    description:
      "The most luxurious SUV in the world. The Bentayga combines handcrafted comfort with commanding presence and W12 refinement.",
    features: fmtFeatures,
  },
];

export const cars: Car[] = base.map((c) => {
  const p = perf[c.brandSlug] ?? { engine: "V8", hp: 600, tq: 700, top: 320, accel: 3.4 };
  const enriched: Omit<Car, "specs"> = {
    ...c,
    engine: p.engine,
    horsepower: p.hp,
    torque: p.tq,
    topSpeed: p.top,
    accel: p.accel,
    newArrival: c.year >= 2023 && !c.sold,
  };
  return {
    ...enriched,
    specs: {
      Engine: p.engine,
      Power: `${p.hp} bhp`,
      Torque: `${p.tq} Nm`,
      "0–100 km/h": `${p.accel}s`,
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
  { name: "Khalid Al Maktoum", location: "Dubai, UAE", car: "Ferrari 488 GTB", rating: 5, quote: "An impeccable experience from start to finish. The car was exactly as presented and the handover was flawless." },
  { name: "James Whitmore", location: "London, UK", car: "Rolls-Royce Ghost", rating: 5, quote: "They sourced and exported my Ghost to the UK seamlessly. White-glove service throughout — truly world-class." },
  { name: "Sofia Rossi", location: "Milan, Italy", car: "Lamborghini Urus S", rating: 5, quote: "The most discreet and professional dealership I've dealt with. The 360 viewer made buying remotely effortless." },
  { name: "Ahmed Hassan", location: "Abu Dhabi, UAE", car: "McLaren 720S", rating: 5, quote: "Outstanding inventory and honest pricing. My 720S was delivered to my door in pristine condition." },
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

export const featuredCars = cars.filter((c) => c.featured && !c.sold);

export function getCar(slug: string) {
  return cars.find((c) => c.slug === slug);
}

export function formatPrice(aed: number) {
  return "AED " + aed.toLocaleString("en-US");
}

export const fuelTypes = ["Petrol", "Hybrid", "Electric"];
export const transmissions = ["Automatic", "Manual"];
export const bodyTypes = ["Coupe", "Sedan", "SUV", "Convertible"];

export const WHATSAPP = "971500000000";
export const PHONE = "+971 4 000 0000";
export const EMAIL = "sales@cargallerydubai.com";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}
