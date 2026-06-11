import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { CarCard } from "@/components/CarCard";
import { Reveal } from "@/components/Reveal";
import { BrandLogo } from "@/components/BrandLogo";
import { getPublicBrandPage } from "@/lib/public.functions";
import { mapDbVehicle, type DbVehicle } from "@/lib/vehicle-map";

export const Route = createFileRoute("/brands/$brand")({
  loader: async ({ params }) => {
    const res = await getPublicBrandPage({ data: { slug: params.brand } });
    if (!res.brand) throw notFound();
    return res;
  },
  head: ({ loaderData }) => {
    const b = loaderData?.brand;
    return {
      meta: [
        { title: b?.seo_title || `${b?.name} For Sale in Dubai | Car Gallery Dubai` },
        {
          name: "description",
          content:
            b?.meta_description ||
            `Browse ${b?.name} cars for sale in Dubai. Explore our curated ${b?.name} inventory with finance and WhatsApp enquiry at Car Gallery Dubai.`,
        },
        { property: "og:title", content: `${b?.name} For Sale in Dubai` },
        { property: "og:image", content: b?.hero_image || b?.logo || undefined },
      ],
      links: [{ rel: "canonical", href: `/brands/${b?.slug}` }],
    };
  },
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-28 text-center">
      <h1 className="text-3xl">Something went wrong</h1>
      <p className="text-muted-foreground">{error.message}</p>
      <Link to="/inventory" className="text-gold underline">Back to inventory</Link>
    </div>
  ),
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-28 text-center">
      <h1 className="text-4xl">Brand not found</h1>
      <Link to="/inventory" className="text-gold underline">Back to inventory</Link>
    </div>
  ),
  component: BrandPage,
});

function BrandPage() {
  const initial = Route.useLoaderData();
  const { brand: paramBrand } = Route.useParams();
  const fetchBrand = useServerFn(getPublicBrandPage);
  const { data } = useQuery({
    queryKey: ["brand-page", paramBrand],
    queryFn: () => fetchBrand({ data: { slug: paramBrand } }),
    initialData: initial,
  });

  const brand = data?.brand;
  if (!brand) return null;
  const list = (data?.vehicles ?? []).map((v) => mapDbVehicle(v as DbVehicle));
  const available = data?.available ?? 0;
  const sold = list.filter((c) => c.sold).length;
  const img = brand.hero_image || brand.logo || "";

  return (
    <div className="pt-28">
      <div className="relative h-[42vh] min-h-[340px] overflow-hidden">
        {img ? (
          <img src={img} alt={`${brand.name} for sale in Dubai`} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-5 pb-10">
            <Link to="/inventory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold"><ArrowLeft className="h-4 w-4" /> All Inventory</Link>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-card/70 p-3 backdrop-blur">
                <BrandLogo slug={brand.slug} className="h-full w-full" />
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl">{brand.name} <span className="gold-gradient-text">For Sale In Dubai</span></h1>
            </div>
            <p className="mt-3 text-foreground/80">{available} available{sold ? ` · ${sold} sold` : ""}</p>
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
            {brand.description ||
              `Car Gallery Dubai is your trusted source for ${brand.name} cars for sale in Dubai. Each ${brand.name} in our collection is meticulously inspected and presented with full history. Our specialists offer finance, worldwide delivery and a discreet, white-glove experience.`}{" "}
            <Link to="/sell" className="text-gold hover:underline">Looking to sell your {brand.name}?</Link>
          </p>
        </Reveal>
      </div>
    </div>
  );
}
