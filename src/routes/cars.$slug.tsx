import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Phone, RotateCcw } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CarCard } from "@/components/CarCard";
import { Car360Viewer } from "@/components/Car360Viewer";
import { FinanceCalculator } from "@/components/FinanceCalculator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getCar, cars, formatPrice, whatsappLink, PHONE } from "@/data/cars";

export const Route = createFileRoute("/cars/$slug")({
  loader: ({ params }) => {
    const car = getCar(params.slug);
    if (!car) throw notFound();
    return car;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.year} ${loaderData?.title} For Sale in Dubai | Luxury Car Gallery Dubai` },
      {
        name: "description",
        content: loaderData
          ? `${loaderData.title} for sale in Dubai. ${loaderData.mileage.toLocaleString()} km, ${loaderData.transmission}, ${loaderData.exteriorColour}. ${formatPrice(loaderData.price)}.`
          : "Luxury car for sale in Dubai.",
      },
      { property: "og:title", content: `${loaderData?.year} ${loaderData?.title}` },
      { property: "og:image", content: loaderData?.image },
      { property: "og:type", content: "product" },
    ],
    links: [{ rel: "canonical", href: `/cars/${loaderData?.slug}` }],
    scripts: loaderData
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Car",
              name: loaderData.title,
              brand: loaderData.brand,
              modelDate: loaderData.year,
              mileageFromOdometer: loaderData.mileage,
              vehicleTransmission: loaderData.transmission,
              fuelType: loaderData.fuel,
              color: loaderData.exteriorColour,
              offers: {
                "@type": "Offer",
                price: loaderData.price,
                priceCurrency: "AED",
                availability: loaderData.sold ? "SoldOut" : "InStock",
              },
            }),
          },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 pt-28 text-center">
      <h1 className="text-4xl">Vehicle not found</h1>
      <Link to="/inventory" className="text-gold underline">
        Back to inventory
      </Link>
    </div>
  ),
  component: VehiclePage,
});

const faqs = [
  { q: "Is finance available for this vehicle?", a: "Yes, we offer flexible finance options for residents and selected international buyers. Speak to our team for a tailored quote." },
  { q: "Can I arrange international shipping?", a: "Absolutely. We regularly export vehicles worldwide and handle all logistics and documentation." },
  { q: "Is a full service history available?", a: "All our vehicles are presented with verified service history and a comprehensive inspection report." },
];

function VehiclePage() {
  const car = Route.useLoaderData() as import("@/data/cars").Car;
  
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const related = cars.filter((c) => c.brandSlug === car.brandSlug && c.slug !== car.slug).slice(0, 3);
  const gallery = car.images && car.images.length > 0 ? car.images : [car.image, car.image, car.image, car.image];
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [show360, setShow360] = useState(false);

  const scrollThumbs = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * w * 0.8, behavior: "smooth" });
  };

  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-5">
        <Link to="/inventory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </Link>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.3fr_1fr]">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-2xl border border-border shadow-luxury">
            <img src={gallery[active]} alt={car.title} width={1024} height={768} className="aspect-[4/3] w-full object-cover" />
            <div className="absolute left-4 top-4 flex gap-2">
              {car.featured && <span className="rounded-full bg-gold px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-primary-foreground">Featured</span>}
              {car.sold && <span className="rounded-full bg-destructive px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-destructive-foreground">Sold</span>}
            </div>
            <button
              onClick={() => setShow360(true)}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-black/80"
            >
              <RotateCcw className="h-3.5 w-3.5" /> 360°
            </button>
          </div>

          <div className="relative mt-3">
            <button
              onClick={() => scrollThumbs(-1)}
              className="absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Scroll thumbnails left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 px-10">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`shrink-0 overflow-hidden rounded-xl border ${active === i ? "border-gold" : "border-border"}`}
                  style={{ width: "calc(25% - 0.75rem)" }}
                >
                  <img src={g} alt={`${car.title} view ${i + 1}`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
            <button
              onClick={() => scrollThumbs(1)}
              className="absolute right-0 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label="Scroll thumbnails right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Dialog open={show360} onOpenChange={setShow360}>
            <DialogContent className="max-w-3xl">
              <DialogTitle className="sr-only">{car.title} 360° Viewer</DialogTitle>
              <Car360Viewer image={car.image} title={car.title} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Details */}
        <div>
          <span className="text-xs uppercase tracking-luxury text-gold">{car.brand}</span>
          <h1 className="mt-2 text-3xl md:text-4xl">{car.year} {car.title}</h1>
          <p className="mt-4 font-display text-3xl text-gold">{formatPrice(car.price)}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Year", car.year], ["Mileage", `${car.mileage.toLocaleString()} km`],
              ["Fuel", car.fuel], ["Transmission", car.transmission],
              ["Exterior", car.exteriorColour], ["Interior", car.interiorColour],
            ].map(([k, v]) => (
              <div key={k as string} className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{k}</p>
                <p className="mt-1">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <a href={whatsappLink(`I'm interested in the ${car.year} ${car.title} (${formatPrice(car.price)}).`)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gold py-3.5 text-center text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105">
              WhatsApp Enquiry
            </a>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/sell" className="rounded-full border border-gold/50 py-3.5 text-center text-sm uppercase tracking-widest transition-colors hover:bg-gold/10">Finance Enquiry</Link>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center justify-center gap-2 rounded-full border border-border py-3.5 text-center text-sm uppercase tracking-widest transition-colors hover:border-gold"><Phone className="h-4 w-4" /> Call</a>
            </div>
          </div>

          <div className="mt-8">
            <FinanceCalculator price={car.price} />
          </div>
        </div>
      </div>

      {/* Specs + description */}
      <div className="mx-auto mt-16 grid max-w-7xl gap-10 px-5 lg:grid-cols-2">
        <Reveal>
          <h2 className="text-2xl">Specifications</h2>
          <table className="mt-5 w-full text-sm">
            <tbody>
              {Object.entries(car.specs).map(([k, v]) => (
                <tr key={k} className="border-b border-border/60">
                  <td className="py-3 text-muted-foreground">{k}</td>
                  <td className="py-3 text-right">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-2xl">Overview</h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">{car.description}</p>
          <h3 className="mt-6 text-lg">Features</h3>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {car.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 shrink-0 text-gold" /> {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-16 max-w-3xl px-5">
        <h2 className="text-2xl">Frequently Asked Questions</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <span className="font-medium">{f.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-gold transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mx-auto mt-20 max-w-7xl px-5">
          <h2 className="text-2xl">Related Vehicles</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => <CarCard key={c.slug} car={c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
