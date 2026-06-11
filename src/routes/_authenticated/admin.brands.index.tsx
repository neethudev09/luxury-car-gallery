import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, type FieldDef, type ColumnDef } from "@/components/admin/ResourceManager";
import { listBrands, saveBrand, deleteBrand } from "@/lib/cms.functions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/brands/")({
  component: BrandsPage,
});

type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  logo_section: string | null;
  logo_light: string | null;
  logo_dark: string | null;
  logo_menu: string | null;
  country: string | null;
  featured: boolean;
  published: boolean;
};

const fields: FieldDef[] = [
  { name: "name", label: "Brand name", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true, help: "URL identifier" },
  { name: "country", label: "Country", type: "text" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "logo", label: "Standard logo", type: "image", help: "Default logo (colour)" },
  { name: "logo_section", label: "Brand section logo", type: "image", help: "Used in the homepage brand showcase" },
  { name: "logo_light", label: "Light logo", type: "image", help: "For dark backgrounds" },
  { name: "logo_dark", label: "Dark logo", type: "image", help: "For light backgrounds" },
  { name: "logo_menu", label: "Menu logo", type: "image", help: "Small logo for navigation menus" },
  { name: "hero_image", label: "Hero image", type: "image" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "seo_title", label: "SEO title", type: "text", full: true },
  { name: "meta_description", label: "Meta description", type: "textarea" },
  { name: "featured", label: "Featured", type: "switch" },
  { name: "published", label: "Published", type: "switch" },
];

const columns: ColumnDef<Brand>[] = [
  {
    header: "Brand",
    render: (r) => (
      <div className="flex items-center gap-3">
        {r.logo ? (
          <img src={r.logo} alt={r.name} className="h-8 w-8 rounded object-contain" />
        ) : (
          <div className="h-8 w-8 rounded bg-muted" />
        )}
        <span className="font-medium">{r.name}</span>
      </div>
    ),
  },
  { header: "Country", render: (r) => r.country ?? "—" },
  {
    header: "Status",
    render: (r) => (
      <div className="flex gap-1">
        {r.featured && <Badge variant="secondary">Featured</Badge>}
        <Badge variant={r.published ? "default" : "outline"}>
          {r.published ? "Published" : "Draft"}
        </Badge>
      </div>
    ),
  },
];

function BrandsPage() {
  return (
    <ResourceManager<Brand>
      title="Brands"
      description="Manage the car brands shown across the site."
      queryKey="brands"
      fetchList={listBrands}
      listKey="brands"
      save={saveBrand}
      remove={deleteBrand}
      columns={columns}
      fields={fields}
      emptyRecord={{
        name: "",
        slug: "",
        country: "",
        sort_order: 0,
        logo: "",
        hero_image: "",
        description: "",
        seo_title: "",
        meta_description: "",
        featured: false,
        published: true,
      }}
    />
  );
}
