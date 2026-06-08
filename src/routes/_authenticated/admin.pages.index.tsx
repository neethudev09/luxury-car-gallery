import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, type FieldDef, type ColumnDef } from "@/components/admin/ResourceManager";
import { listPages, savePage, deletePage } from "@/lib/cms.functions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/pages/")({
  component: PagesPage,
});

type Page = {
  id: string;
  title: string;
  slug: string;
  status: string;
  seo_title: string | null;
  meta_description: string | null;
};

const fields: FieldDef[] = [
  { name: "title", label: "Page title", type: "text", required: true, full: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "status", label: "Status", type: "select", options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
  ] },
  { name: "content", label: "Content", type: "textarea", full: true, help: "Supports HTML / Markdown" },
  { name: "seo_title", label: "SEO title", type: "text", full: true },
  { name: "meta_description", label: "Meta description", type: "textarea" },
  { name: "og_image", label: "Social share image", type: "image" },
];

const columns: ColumnDef<Page>[] = [
  { header: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
  { header: "Slug", render: (r) => <code className="text-xs">/{r.slug}</code> },
  { header: "Status", render: (r) => (
    <Badge variant={r.status === "published" ? "default" : "outline"}>{r.status}</Badge>
  ) },
  { header: "SEO", render: (r) => (
    r.seo_title && r.meta_description ? <Badge variant="secondary">Complete</Badge> : <span className="text-xs text-destructive">Incomplete</span>
  ) },
];

function PagesPage() {
  return (
    <ResourceManager<Page>
      title="Pages"
      description="Edit standalone website pages and their content."
      queryKey="pages"
      fetchList={listPages}
      listKey="pages"
      save={savePage}
      remove={deletePage}
      columns={columns}
      fields={fields}
      emptyRecord={{
        title: "",
        slug: "",
        status: "published",
        content: "",
        seo_title: "",
        meta_description: "",
        og_image: "",
      }}
    />
  );
}
