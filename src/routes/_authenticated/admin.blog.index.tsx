import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, type FieldDef, type ColumnDef } from "@/components/admin/ResourceManager";
import { listPosts, savePost, deletePost } from "@/lib/cms.functions";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/blog/")({
  component: BlogPage,
});

type Post = {
  id: string;
  title: string;
  slug: string;
  author: string | null;
  category: string | null;
  status: string;
  seo_title: string | null;
  meta_description: string | null;
};

const fields: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true, full: true },
  { name: "slug", label: "Slug", type: "text", required: true },
  { name: "author", label: "Author", type: "text" },
  { name: "category", label: "Category", type: "text" },
  { name: "status", label: "Status", type: "select", options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
  ] },
  { name: "tags", label: "Tags", type: "tags" },
  { name: "cover_image", label: "Cover image", type: "image" },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "content", label: "Content", type: "textarea", full: true, help: "Supports HTML / Markdown" },
  { name: "seo_title", label: "SEO title", type: "text", full: true },
  { name: "meta_description", label: "Meta description", type: "textarea" },
  { name: "og_image", label: "Social share image", type: "image" },
];

const columns: ColumnDef<Post>[] = [
  { header: "Title", render: (r) => <span className="font-medium">{r.title}</span> },
  { header: "Category", render: (r) => r.category ?? "—" },
  { header: "Status", render: (r) => (
    <Badge variant={r.status === "published" ? "default" : "outline"}>{r.status}</Badge>
  ) },
  { header: "SEO", render: (r) => (
    r.seo_title && r.meta_description ? (
      <Badge variant="secondary">Complete</Badge>
    ) : (
      <span className="text-xs text-destructive">Incomplete</span>
    )
  ) },
];

function BlogPage() {
  return (
    <ResourceManager<Post>
      title="Blog Posts"
      description="Write and publish news and articles."
      queryKey="posts"
      fetchList={listPosts}
      listKey="posts"
      save={savePost}
      remove={deletePost}
      columns={columns}
      fields={fields}
      emptyRecord={{
        title: "",
        slug: "",
        author: "",
        category: "",
        status: "draft",
        tags: [],
        cover_image: "",
        excerpt: "",
        content: "",
        seo_title: "",
        meta_description: "",
        og_image: "",
      }}
    />
  );
}
