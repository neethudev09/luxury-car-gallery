import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, type FieldDef, type ColumnDef } from "@/components/admin/ResourceManager";
import { listMedia, saveMedia, deleteMedia } from "@/lib/cms.functions";

export const Route = createFileRoute("/_authenticated/admin/media/")({
  component: MediaPage,
});

type Media = {
  id: string;
  url: string;
  alt: string | null;
  title: string | null;
  folder: string | null;
};

const fields: FieldDef[] = [
  { name: "url", label: "Image URL", type: "image", required: true, full: true },
  { name: "title", label: "Title", type: "text" },
  { name: "folder", label: "Folder", type: "text", placeholder: "general" },
  { name: "alt", label: "Alt text", type: "text", full: true, help: "Describe the image for SEO & accessibility" },
  { name: "caption", label: "Caption", type: "textarea" },
];

const columns: ColumnDef<Media>[] = [
  {
    header: "Preview",
    render: (r) => (
      <img src={r.url} alt={r.alt ?? ""} className="h-12 w-16 rounded object-cover" />
    ),
  },
  { header: "Title", render: (r) => r.title ?? "—" },
  {
    header: "Alt text",
    render: (r) =>
      r.alt ? (
        <span className="text-sm">{r.alt}</span>
      ) : (
        <span className="text-xs text-destructive">Missing</span>
      ),
  },
  { header: "Folder", render: (r) => r.folder ?? "general" },
];

function MediaPage() {
  return (
    <ResourceManager<Media>
      title="Media Library"
      description="Central library of images. Add by URL, then reuse anywhere and edit alt text."
      queryKey="media"
      fetchList={listMedia}
      listKey="media"
      save={saveMedia}
      remove={deleteMedia}
      columns={columns}
      fields={fields}
      emptyRecord={{ url: "", title: "", folder: "general", alt: "", caption: "" }}
    />
  );
}
