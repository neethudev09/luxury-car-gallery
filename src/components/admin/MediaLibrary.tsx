import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@/lib/server-compat";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, ImageOff, Search, UploadCloud, FlipHorizontal2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listMedia, saveMedia, deleteMedia } from "@/lib/cms.functions";

type Media = {
  id?: string;
  url: string;
  alt: string | null;
  title: string | null;
  folder: string | null;
  caption?: string | null;
};

const emptyRecord: Media = { url: "", title: "", folder: "general", alt: "", caption: "" };

function Thumb({ url, alt }: { url: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setBroken(false);
    setRetry(0);
  }, [url]);

  if (broken || !url) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-muted text-muted-foreground">
        <ImageOff className="h-6 w-6" />
        <span className="text-[10px]">No image</span>
      </div>
    );
  }
  const src = retry === 0 ? url : `${url}${url.includes("?") ? "&" : "?"}retry=${retry}`;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (retry < 2) setRetry((value) => value + 1);
        else setBroken(true);
      }}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export function MediaLibrary() {
  const qc = useQueryClient();
  const list = useServerFn(listMedia as never) as unknown as () => Promise<Record<string, unknown>>;
  const saveFn = useServerFn(saveMedia as never) as unknown as (a: {
    data: Record<string, unknown>;
  }) => Promise<unknown>;
  const removeFn = useServerFn(deleteMedia as never) as unknown as (a: {
    data: { id: string };
  }) => Promise<unknown>;

  const { data, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: () => list() as Promise<Record<string, unknown>>,
  });
  const rows = ((data?.media as Media[]) ?? []) as Media[];

  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("all");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Media>(emptyRecord);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [flipping, setFlipping] = useState(false);

  const flipCurrent = async () => {
    if (!form.url) return;
    setFlipping(true);
    try {
      const { flipImageHorizontally } = await import("@/lib/flip-image");
      const newUrl = await flipImageHorizontally(form.url);
      setForm((f) => ({ ...f, url: newUrl }));
      toast.success("Image flipped — Save to keep the change");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not flip image");
    } finally {
      setFlipping(false);
    }
  };
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);

  const uploadFiles = async (files: FileList | File[]) => {
    const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) {
      toast.error("Only image files are supported");
      return;
    }
    setUploading(true);
    let ok = 0;
    for (const file of images) {
      try {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `uploads/${Date.now()}-${slugify(file.name)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("media")
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("media").getPublicUrl(path);
        const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        await saveFn({
          data: {
            url: pub.publicUrl,
            title,
            alt: title,
            folder: folder !== "all" ? folder : "uploads",
            caption: "",
          } as Record<string, unknown>,
        });
        ok += 1;
      } catch (e) {
        toast.error(`${file.name}: ${e instanceof Error ? e.message : "upload failed"}`);
      }
    }
    if (ok > 0) {
      toast.success(`${ok} image${ok > 1 ? "s" : ""} uploaded`);
      qc.invalidateQueries({ queryKey: ["media"] });
    }
    setUploading(false);
  };

  const folders = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => set.add(r.folder ?? "general"));
    return Array.from(set).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (folder !== "all" && (r.folder ?? "general") !== folder) return false;
      if (!q) return true;
      return (
        (r.title ?? "").toLowerCase().includes(q) ||
        (r.alt ?? "").toLowerCase().includes(q) ||
        (r.url ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, query, folder]);

  const set = (name: keyof Media, value: unknown) =>
    setForm((f) => ({ ...f, [name]: value }));

  const openNew = () => {
    setForm({ ...emptyRecord });
    setOpen(true);
  };
  const openEdit = (row: Media) => {
    setForm({ ...emptyRecord, ...row });
    setOpen(true);
  };

  const submit = async () => {
    setSaving(true);
    try {
      await saveFn({ data: form as Record<string, unknown> });
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["media"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await removeFn({ data: { id: deleteId } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["media"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Media Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse every image in a visual grid. Click a tile to edit its title and alt text.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> Add new
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploading) fileInputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
        }}
        className={`mt-6 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-gold bg-gold/5" : "border-border hover:border-gold/60"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
        ) : (
          <UploadCloud className="h-7 w-7 text-muted-foreground" />
        )}
        <p className="text-sm font-medium">
          {uploading ? "Uploading…" : "Drag & drop images here, or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground">
          Uploaded images are added to the library and available across the site.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, alt or URL"
            className="pl-9"
          />
        </div>
        <Select value={folder} onValueChange={setFolder}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All folders</SelectItem>
            {folders.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="mt-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 text-center text-muted-foreground">
          Nothing here yet. Click “Add new” to upload your first image.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((row) => (
            <div
              key={row.id ?? row.url}
              className="group relative overflow-hidden rounded-lg border border-border bg-card"
            >
              <button
                type="button"
                onClick={() => openEdit(row)}
                className="block aspect-square w-full"
                title="Edit"
              >
                <Thumb url={row.url} alt={row.alt ?? row.title ?? "media"} />
              </button>
              <div className="flex items-start justify-between gap-1 p-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{row.title ?? "Untitled"}</p>
                  {row.alt ? (
                    <p className="truncate text-[10px] text-muted-foreground">{row.alt}</p>
                  ) : (
                    <p className="text-[10px] text-destructive">Alt missing</p>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0"
                  onClick={() => setDeleteId(row.id ?? null)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? "Edit image" : "New image"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Image URL</Label>
              <Input
                value={form.url ?? ""}
                placeholder="https://image-url.jpg"
                onChange={(e) => set("url", e.target.value)}
              />
              {form.url ? (
                <>
                  <div className="aspect-video w-full overflow-hidden rounded-md border border-border">
                    <Thumb url={form.url} alt="preview" />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={flipCurrent} disabled={flipping}>
                    {flipping ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlipHorizontal2 className="h-4 w-4" />}
                    Flip horizontally
                  </Button>
                </>
              ) : null}
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Folder</Label>
              <Input
                value={form.folder ?? ""}
                placeholder="general"
                onChange={(e) => set("folder", e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Alt text</Label>
              <Input value={form.alt ?? ""} onChange={(e) => set("alt", e.target.value)} />
              <p className="text-xs text-muted-foreground">
                Describe the image for SEO &amp; accessibility
              </p>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Caption</Label>
              <Textarea
                rows={3}
                value={form.caption ?? ""}
                onChange={(e) => set("caption", e.target.value)}
              />
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

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
