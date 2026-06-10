import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical, Loader2, ArrowUp, ArrowDown, Play } from "lucide-react";
import { listGalleries, saveGallery, deleteGallery } from "@/lib/cms.functions";
import { detectKind, mediaThumb, type MediaKind } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/galleries/")({
  component: GalleriesPage,
});

type Item = { url: string; alt: string; type?: MediaKind };
type Gallery = {
  id?: string;
  name: string;
  slug: string;
  description: string | null;
  published: boolean;
  sort_order: number;
  items: Item[];
};

const empty: Gallery = {
  name: "",
  slug: "",
  description: "",
  published: true,
  sort_order: 0,
  items: [],
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function GalleriesPage() {
  const qc = useQueryClient();
  const list = useServerFn(listGalleries);
  const save = useServerFn(saveGallery);
  const remove = useServerFn(deleteGallery);

  const { data, isLoading } = useQuery({ queryKey: ["galleries"], queryFn: () => list() });
  const galleries = (data?.galleries ?? []) as unknown as Gallery[];

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Gallery>(empty);
  const [newUrl, setNewUrl] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const openNew = () => {
    setForm({ ...empty, items: [] });
    setOpen(true);
  };
  const openEdit = (g: Gallery) => {
    setForm({ ...g, items: Array.isArray(g.items) ? g.items : [] });
    setOpen(true);
  };

  const addItem = () => {
    const url = newUrl.trim();
    if (!url) return;
    setForm((f) => ({ ...f, items: [...f.items, { url, alt: "", type: detectKind(url) }] }));
    setNewUrl("");
  };
  const updateItem = (i: number, patch: Partial<Item>) =>
    setForm((f) => ({ ...f, items: f.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));
  const removeItem = (i: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const move = (i: number, dir: -1 | 1) =>
    setForm((f) => {
      const j = i + dir;
      if (j < 0 || j >= f.items.length) return f;
      const items = [...f.items];
      [items[i], items[j]] = [items[j], items[i]];
      return { ...f, items };
    });
  const onDrop = (target: number) =>
    setForm((f) => {
      if (dragIndex === null || dragIndex === target) return f;
      const items = [...f.items];
      const [moved] = items.splice(dragIndex, 1);
      items.splice(target, 0, moved);
      return { ...f, items };
    });

  const submit = async () => {
    setSaving(true);
    try {
      await save({ data: form as never });
      toast.success("Gallery saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["galleries"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id?: string) => {
    if (!id) return;
    try {
      await remove({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["galleries"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Galleries</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build image galleries. Drag images to reorder and edit alt text.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New gallery
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {!isLoading && galleries.length === 0 && (
          <p className="text-sm text-muted-foreground">No galleries yet.</p>
        )}
        {galleries.map((g) => (
          <div key={g.id} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{g.name}</h3>
              <Badge variant={g.published ? "default" : "outline"}>
                {g.published ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{g.items?.length ?? 0} items</p>
            <div className="mt-3 grid grid-cols-4 gap-1">
              {(g.items ?? []).slice(0, 4).map((it, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded">
                  <img src={mediaThumb(it.url)} alt={it.alt} className="h-full w-full object-cover" />
                  {it.type === "video" && (
                    <span className="absolute inset-0 flex items-center justify-center bg-background/40">
                      <Play className="h-4 w-4 text-gold" />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(g)}>
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => del(g.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit gallery" : "New gallery"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: f.id ? f.slug : slugify(name) }));
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={2}
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 sm:col-span-2">
              <span className="text-sm">Published</span>
              <Switch
                checked={form.published}
                onCheckedChange={(c) => setForm((f) => ({ ...f, published: c }))}
              />
            </div>
          </div>

          <div className="mt-2">
            <Label>Media items</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Paste an image URL or a YouTube link — videos are detected automatically.
            </p>
            <div className="mt-2 flex gap-2">
              <Input
                value={newUrl}
                placeholder="https://image-url.jpg or https://youtu.be/..."
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem())}
              />
              <Button type="button" onClick={addItem}>
                Add
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {form.items.map((it, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => setDragIndex(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(i)}
                  className="flex items-center gap-2 rounded-md border border-border bg-card/40 p-2"
                >
                  <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded">
                    <img src={mediaThumb(it.url)} alt={it.alt} className="h-full w-full object-cover" />
                    {it.type === "video" && (
                      <span className="absolute inset-0 flex items-center justify-center bg-background/40">
                        <Play className="h-4 w-4 text-gold" />
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <Input
                      value={it.alt}
                      placeholder={it.type === "video" ? "Video title" : "Alt text"}
                      onChange={(e) => updateItem(i, { alt: e.target.value })}
                    />
                    <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                      {it.type === "video" ? "YouTube video" : "Image"}
                    </span>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => move(i, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => move(i, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeItem(i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>


          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
