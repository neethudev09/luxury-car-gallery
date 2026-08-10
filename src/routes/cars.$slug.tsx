import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, GitCompare, Heart, Phone, RotateCcw } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CarCard } from "@/components/CarCard";
import { Car360Viewer } from "@/components/Car360Viewer";
import { FinanceCalculator } from "@/components/FinanceCalculator";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatPrice, whatsappLink, PHONE } from "@/data/cars";
import { useCompare } from "@/lib/compare";
import { getPublicFeatureFlags, getPublicVehicle } from "@/lib/public.functions";
import { mapDbVehicle, type DbVehicle } from "@/lib/vehicle-map";

export const Route = createFileRoute("/cars/$slug")({
  loader: async ({ params }) => {
    const res = await getPublicVehicle({ data: { slug: params.slug } });
    if (!res.vehicle) throw notFound();
    const car = mapDbVehicle(res.vehicle as unknown as DbVehicle);
    const related = (res.related as unknown as DbVehicle[]).map(mapDbVehicle);
    const dbFaqs = Array.isArray((res.vehicle as { faqs?: unknown }).faqs)
      ? ((res.vehicle as { faqs: { q?: string; a?: string; question?: string; answer?: string }[] }).faqs)
      : [];
    const flags = await getPublicFeatureFlags();
    return { car, related, dbFaqs, viewer360Enabled: flags.viewer_360_enabled };
  },
  head: ({ loaderData }) => {
    const car = loaderData?.car;
    return {
      meta: [
        { title: `${car?.year} ${car?.title} For Sale in Dubai | Luxury Car Gallery Dubai` },
        {
          name: "description",
          content: car
            ? `${car.title} for sale in Dubai. ${car.mileage.toLocaleString()} km, ${car.transmission}, ${car.exteriorColour}. ${formatPrice(car.price)}.`
            : "Luxury car for sale in Dubai.",
        },
        { property: "og:title", content: `${car?.year} ${car?.title}` },
        { property: "og:image", content: car?.image },
        { property: "twitter:image", content: car?.image },
        { property: "og:url", content: `/cars/${car?.slug}` },
        { property: "og:type", content: "product" },
      ],
      links: [
        { rel: "canonical", href: `/cars/${car?.slug}` },
        ...(car?.image
          ? [{ rel: "preload", as: "image" as const, href: car.image, fetchpriority: "high" }]
          : []),
      ],
      scripts: car
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Car",
                name: car.title,
                brand: car.brand,
                modelDate: car.year,
                mileageFromOdometer: car.mileage,
                vehicleTransmission: car.transmission,
                fuelType: car.fuel,
                color: car.exteriorColour,
                offers: {
                  "@type": "Offer",
                  price: car.price,
                  priceCurrency: "AED",
                  availability: car.sold ? "SoldOut" : "InStock",
                },
              }),
            },
          ]
        : [],
    };
  },
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

function buildFaqs(car: import("@/data/cars").Car) {
  return [
    {
      q: `Is finance available for the ${car.year} ${car.title}?`,
      a: `Yes, we offer flexible finance options for the ${car.title} (${formatPrice(car.price)}) for residents and selected international buyers. Use the calculator opposite or speak to our team for a tailored quote.`,
    },
    {
      q: `What is the mileage and condition of this ${car.brand}?`,
      a: `This ${car.year} ${car.title} has ${car.mileage.toLocaleString()} km on the odometer, finished in ${car.exteriorColour} with ${car.interiorColour} interior, and is presented with verified service history and a full inspection report.`,
    },
    {
      q: `Can I arrange international shipping for the ${car.title}?`,
      a: `Absolutely. We regularly export vehicles like this ${car.brand} worldwide and handle all logistics, documentation and customs clearance.`,
    },
    {
      q: `Is the ${car.title} still available?`,
      a: car.sold
        ? `This particular ${car.title} has been sold, but we frequently source similar ${car.brand} models — contact us and we'll find one for you.`
        : `Yes, this ${car.year} ${car.title} is currently available. Contact us on WhatsApp to arrange a viewing or reserve it.`,
    },
  ];
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.83 9.83 0 001.999 5.928l-.999 3.648 3.49-.875zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

function VehiclePage() {
  const { car, related, dbFaqs, viewer360Enabled } = Route.useLoaderData() as {
    car: import("@/data/cars").Car;
    related: import("@/data/cars").Car[];
    dbFaqs: { q?: string; a?: string; question?: string; answer?: string }[];
    viewer360Enabled: boolean;
  };
  const { toggleCompare, toggleSaved, isCompared, isSaved } = useCompare();
  const compared = isCompared(car.slug);
  const saved = isSaved(car.slug);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const gallery = car.images && car.images.length > 0 ? car.images : [car.image, car.image, car.image, car.image];
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [show360, setShow360] = useState(false);
  const [paused, setPaused] = useState(false);

  const scrollThumbs = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * w * 0.8, behavior: "smooth" });
  };

  // Auto-advance the gallery every 2 seconds
  useEffect(() => {
    if (paused || gallery.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % gallery.length), 2000);
    return () => clearInterval(id);
  }, [paused, gallery.length]);

  // Keep the active thumbnail in view
  useEffect(() => {
    const el = scrollRef.current;
    const thumb = el?.children[active] as HTMLElement | undefined;
    if (!el || !thumb) return;
    const left = thumb.offsetLeft - el.clientWidth / 2 + thumb.clientWidth / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, [active]);


  const faqs =
    dbFaqs && dbFaqs.length > 0
      ? dbFaqs.map((f) => ({ q: f.q ?? f.question ?? "", a: f.a ?? f.answer ?? "" })).filter((f) => f.q && f.a)
      : buildFaqs(car);


  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-5">
        <Link to="/inventory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back to Inventory
        </Link>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.3fr_1fr]">
        {/* Gallery */}
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>

          <div className="relative overflow-hidden rounded-2xl border border-border shadow-luxury">
            <img src={gallery[active]} alt={car.title} width={1024} height={768} loading="eager" fetchPriority="high" decoding="async" className="aspect-[4/3] w-full object-cover" />
            <div className="absolute left-4 top-4 flex gap-2">
              {car.featured && <span className="rounded-full bg-gold px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-primary-foreground">Featured</span>}
              {car.sold && <span className="rounded-full bg-destructive px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-widest text-destructive-foreground">Sold</span>}
            </div>
            {viewer360Enabled && (
              <button
                onClick={() => setShow360(true)}
                className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-black/80"
              >
                <RotateCcw className="h-3.5 w-3.5" /> 360°
              </button>
            )}
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

          {viewer360Enabled && (
            <Dialog open={show360} onOpenChange={setShow360}>
              <DialogContent className="max-w-3xl">
                <DialogTitle className="sr-only">{car.title} 360° Viewer</DialogTitle>
                <Car360Viewer image={car.image} title={car.title} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs uppercase tracking-luxury text-gold">{car.brand}</span>
          <h1 className="mt-2 text-3xl md:text-4xl">{car.year} {car.title}</h1>
          <div className="mt-4 flex items-center justify-between">
            <p className="font-display text-3xl text-gold">{formatPrice(car.price)}</p>
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
                      href={whatsappLink(`I'm interested in the ${car.year} ${car.title} (${formatPrice(car.price)}).`)}
                      target="_blank"
                      rel="noopener noreferrer"
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

        </div>
      </div>

      {/* Overview + Specifications */}
      <div className="mx-auto mt-16 grid max-w-7xl gap-10 px-5 lg:grid-cols-2">
        <Reveal>
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
        <Reveal delay={0.1}>
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
      </div>

      {/* Finance Calculator + FAQ */}
      <div className="mx-auto mt-16 grid max-w-7xl items-start gap-10 px-5 lg:grid-cols-2">
        <FinanceCalculator price={car.price} />

        <div>
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
