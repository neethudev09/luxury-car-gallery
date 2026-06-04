import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { Reveal } from "@/components/Reveal";
import { brands, brandImage, cars } from "@/data/cars";

export const Route = createFileRoute("/brands/$brand")({
  loader: ({ params }) => {
    const brand = brands.find((b) => b.slug === params.brand);
    if (!brand) throw notFound();
    return brand;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name} For Sale in Dubai | Car Gallery Dubai` },
      {
        name: "description",
        content: `Browse ${loaderData?.name} cars for sale in Dubai. Explore our curated ${loaderData?.name} inventory with finance and WhatsApp enquiry at Car Gallery Dubai.`,
      },
      { property: "og:title", content: `${loaderData?.name} For Sale in Dubai` },
      { property: "og:image", content: loaderData ? brandImage[loaderData.slug] : undefined },
    ],
    links: [{ rel: "canonical", href: `/brands/${loaderData?.slug}` }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-28 text-center">
      <h1 className="text-4xl">Brand not found</h1>
      <Link to="/inventory" className="text-gold underline">Back to inventory</Link>
    </div>
  ),
  component: BrandPage,
});

function BrandPage() {
  const brand = Route.useLoaderData();
  const list = cars.filter((c) => c.brandSlug === brand.slug);
  const img = brandImage[brand.slug];
  return (
    <div className="pt-28">
      <div className="relative h-[42vh] min-h-[340px] overflow-hidden">
        <img src={img} alt={`${brand.name} for sale in Dubai`} width={1024} height={768} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-5 pb-10">
            <Link to="/inventory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"><ArrowLeft className="h-4 w-4" /> All Inventory</Link>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl">{brand.name} <span className="gold-gradient-text">For Sale In Dubai</span></h1>
            <p className="mt-3 text-foreground/80">{brand.available} available · {brand.sold} sold to date</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14">
        {list.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 0.06}><CarCard car={c} /></Reveal>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-16 text-center text-muted-foreground">
            No {brand.name} currently in stock. <Link to="/contact" className="text-gold underline">Contact us</Link> for sourcing.
          </div>
        )}

        <Reveal className="mt-16 max-w-3xl">
          <h2 className="text-2xl">Buy a {brand.name} in Dubai</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Car Gallery Dubai is your trusted source for {brand.name} cars for sale in Dubai. Each {brand.name} in our collection is meticulously inspected and presented with full history. Our specialists offer finance, worldwide delivery and a discreet, white-glove experience. <Link to="/sell" className="text-gold hover:underline">Looking to sell your {brand.name}?</Link>
          </p>
        </Reveal>
      </div>
    </div>
  );
}
