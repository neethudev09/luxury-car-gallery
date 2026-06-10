import { createFileRoute, useNavigate, useParams, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { getVehicleAdmin, saveVehicle } from "@/lib/vehicles.functions";
import { listBrands } from "@/lib/cms.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/vehicles/$id")({
  component: VehicleEditor,
});

type Form = {
  id?: string;
  slug: string;
  title: string;
  brand: string;
  brand_slug: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  transmission: string;
  fuel: string;
  body_type: string;
  exterior_colour: string;
  interior_colour: string;
  engine: string;
  horsepower: string;
  description: string;
  video_url: string;
  image: string;
  availability: string;
  featured: boolean;
  new_arrival: boolean;
  sold: boolean;
  published: boolean;
  sort_order: string;
  gallery: string[];
  interior_gallery: string[];
  exterior_gallery: string[];
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  og_image: string;
  noindex: boolean;
};

const empty: Form = {
  slug: "", title: "", brand: "", brand_slug: "", model: "", year: "", price: "",
  mileage: "", transmission: "", fuel: "", body_type: "", exterior_colour: "",
  interior_colour: "", engine: "", horsepower: "", description: "", video_url: "",
  image: "", availability: "available", featured: false, new_arrival: false,
  sold: false, published: true, sort_order: "0", gallery: [], interior_gallery: [],
  exterior_gallery: [], seo_title: "", meta_description: "", canonical_url: "",
  og_image: "", noindex: false,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function num(v: string): number | null {
  if (v.trim() === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function VehicleEditor() {
  const { id } = useParams({ from: "/_authenticated/admin/vehicles/$id" });
  const isNew = id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchOne = useServerFn(getVehicleAdmin);
  const saveFn = useServerFn(saveVehicle);
  const [form, setForm] = useState<Form>(empty);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: () => fetchOne({ data: { id } }),
    enabled: !isNew,
  });

  const fetchBrands = useServerFn(listBrands);
  const { data: brandsData } = useQuery({
    queryKey: ["brands-admin"],
    queryFn: () => fetchBrands(),
  });
  const brandOptions = brandsData?.brands ?? [];

  useEffect(() => {
    const v = data?.vehicle;
    if (!v) return;
    setForm({
      id: v.id,
      slug: v.slug ?? "", title: v.title ?? "", brand: v.brand ?? "",
      brand_slug: v.brand_slug ?? "", model: v.model ?? "",
      year: v.year?.toString() ?? "", price: v.price?.toString() ?? "",
      mileage: v.mileage?.toString() ?? "", transmission: v.transmission ?? "",
      fuel: v.fuel ?? "", body_type: v.body_type ?? "",
      exterior_colour: v.exterior_colour ?? "", interior_colour: v.interior_colour ?? "",
      engine: v.engine ?? "", horsepower: v.horsepower?.toString() ?? "",
      description: v.description ?? "", video_url: v.video_url ?? "", image: v.image ?? "",
      availability: v.availability ?? "available", featured: !!v.featured,
      new_arrival: !!v.new_arrival, sold: !!v.sold, published: !!v.published,
      sort_order: v.sort_order?.toString() ?? "0",
      gallery: (v.gallery as string[]) ?? [],
      interior_gallery: (v.interior_gallery as string[]) ?? [],
      exterior_gallery: (v.exterior_gallery as string[]) ?? [],
      seo_title: v.seo_title ?? "", meta_description: v.meta_description ?? "",
      canonical_url: v.canonical_url ?? "", og_image: v.og_image ?? "", noindex: !!v.noindex,
    });
  }, [data]);

  const save = useMutation({
    mutationFn: () =>
      saveFn({
        data: {
          id: form.id,
          slug: form.slug, title: form.title, brand: form.brand,
          brand_slug: form.brand_slug || slugify(form.brand),
          model: form.model || null, year: num(form.year), price: num(form.price),
          mileage: num(form.mileage), transmission: form.transmission || null,
          fuel: form.fuel || null, body_type: form.body_type || null,
          exterior_colour: form.exterior_colour || null, interior_colour: form.interior_colour || null,
          engine: form.engine || null, horsepower: num(form.horsepower),
          description: form.description || null, video_url: form.video_url || null,
          image: form.image || null, availability: form.availability,
          featured: form.featured, new_arrival: form.new_arrival, sold: form.sold,
          published: form.published, sort_order: num(form.sort_order) ?? 0,
          gallery: form.gallery, interior_gallery: form.interior_gallery,
          exterior_gallery: form.exterior_gallery,
          seo_title: form.seo_title || null, meta_description: form.meta_description || null,
          canonical_url: form.canonical_url || null, og_image: form.og_image || null,
          noindex: form.noindex,
        },
      }),
    onSuccess: () => {
      toast.success("Vehicle saved");
      qc.invalidateQueries({ queryKey: ["vehicles-admin"] });
      navigate({ to: "/admin/vehicles" });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  if (!isNew && isLoading) {
    return <div className="text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-4 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link to="/admin/vehicles"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-3xl">{isNew ? "Add vehicle" : "Edit vehicle"}</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title || !form.slug || !form.brand) {
            toast.error("Title, slug and brand are required");
            return;
          }
          save.mutate();
        }}
        className="space-y-6"
      >
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="galleries">Galleries</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Basic</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label="Title *">
                  <Input value={form.title} onChange={(e) => {
                    const t = e.target.value;
                    setForm((f) => ({ ...f, title: t, slug: f.slug || slugify(t) }));
                  }} />
                </Field>
                <Field label="Slug *">
                  <Input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
                </Field>
                <Field label="Brand *">
                  <Select
                    value={form.brand}
                    onValueChange={(b) => {
                      const match = brandOptions.find((br) => br.name === b);
                      setForm((f) => ({ ...f, brand: b, brand_slug: match?.slug ?? slugify(b) }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandOptions.map((br) => (
                        <SelectItem key={br.id} value={br.name}>
                          {br.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Model"><Input value={form.model} onChange={(e) => set("model", e.target.value)} /></Field>
                <Field label="Year"><Input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} /></Field>
                <Field label="Price (AED)"><Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} /></Field>
                <Field label="Mileage (km)"><Input type="number" value={form.mileage} onChange={(e) => set("mileage", e.target.value)} /></Field>
                <Field label="Sort order"><Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} /></Field>
                <Field label="Main image URL"><Input value={form.image} onChange={(e) => set("image", e.target.value)} /></Field>
                <Field label="Video URL"><Input value={form.video_url} onChange={(e) => set("video_url", e.target.value)} /></Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Specifications</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label="Transmission"><Input value={form.transmission} onChange={(e) => set("transmission", e.target.value)} /></Field>
                <Field label="Fuel"><Input value={form.fuel} onChange={(e) => set("fuel", e.target.value)} /></Field>
                <Field label="Body type"><Input value={form.body_type} onChange={(e) => set("body_type", e.target.value)} /></Field>
                <Field label="Engine"><Input value={form.engine} onChange={(e) => set("engine", e.target.value)} /></Field>
                <Field label="Horsepower"><Input type="number" value={form.horsepower} onChange={(e) => set("horsepower", e.target.value)} /></Field>
                <Field label="Exterior colour"><Input value={form.exterior_colour} onChange={(e) => set("exterior_colour", e.target.value)} /></Field>
                <Field label="Interior colour"><Input value={form.interior_colour} onChange={(e) => set("interior_colour", e.target.value)} /></Field>
                <Field label="Availability"><Input value={form.availability} onChange={(e) => set("availability", e.target.value)} /></Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Description & status</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Vehicle description…" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <Toggle label="Featured" checked={form.featured} onChange={(c) => set("featured", c)} />
                  <Toggle label="New arrival" checked={form.new_arrival} onChange={(c) => set("new_arrival", c)} />
                  <Toggle label="Sold" checked={form.sold} onChange={(c) => set("sold", c)} />
                  <Toggle label="Published" checked={form.published} onChange={(c) => set("published", c)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="galleries" className="space-y-4">
            <GalleryEditor title="Main gallery" items={form.gallery} onChange={(g) => set("gallery", g)} />
            <GalleryEditor title="Exterior gallery" items={form.exterior_gallery} onChange={(g) => set("exterior_gallery", g)} />
            <GalleryEditor title="Interior gallery" items={form.interior_gallery} onChange={(g) => set("interior_gallery", g)} />
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Search engine optimisation</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Field label="SEO title"><Input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} placeholder={form.title} /></Field>
                <Field label="Meta description">
                  <Textarea rows={3} value={form.meta_description} onChange={(e) => set("meta_description", e.target.value)} />
                </Field>
                <Field label="Canonical URL"><Input value={form.canonical_url} onChange={(e) => set("canonical_url", e.target.value)} /></Field>
                <Field label="OG image URL"><Input value={form.og_image} onChange={(e) => set("og_image", e.target.value)} placeholder={form.image} /></Field>
                <Toggle label="No-index (hide from search)" checked={form.noindex} onChange={(c) => set("noindex", c)} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button type="submit" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save vehicle"}</Button>
          <Button asChild type="button" variant="outline"><Link to="/admin/vehicles">Cancel</Link></Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Switch checked={checked} onCheckedChange={onChange} />
      {label}
    </label>
  );
}

function GalleryEditor({ title, items, onChange }: { title: string; items: string[]; onChange: (g: string[]) => void }) {
  const [url, setUrl] = useState("");
  const add = () => {
    if (!url.trim()) return;
    onChange([...items, url.trim()]);
    setUrl("");
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input value={url} placeholder="Image URL" onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
          <Button type="button" onClick={add}><Plus className="h-4 w-4" /> Add</Button>
        </div>
        {items.length === 0 && <p className="text-sm text-muted-foreground">No images yet.</p>}
        <div className="space-y-2">
          {items.map((src, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-border p-2">
              <img src={src} alt="" className="h-12 w-16 rounded object-cover" />
              <span className="flex-1 truncate text-xs text-muted-foreground">{src}</span>
              <Button type="button" variant="ghost" size="icon" onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
