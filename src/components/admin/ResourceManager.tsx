import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "switch"
  | "image"
  | "tags"
  | "select";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  help?: string;
  full?: boolean;
}

export interface ColumnDef<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface ResourceManagerProps<T extends { id?: string }> {
  title: string;
  description?: string;
  queryKey: string;
  fetchList: () => Promise<{ [k: string]: unknown }>;
  listKey: string; // property on the fetch result containing the array
  save: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  remove: (args: { data: { id: string } }) => Promise<unknown>;
  columns: ColumnDef<T>[];
  fields: FieldDef[];
  emptyRecord: Record<string, unknown>;
  toForm?: (row: T) => Record<string, unknown>;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ResourceManager<T extends { id?: string }>({
  title,
  description,
  queryKey,
  fetchList,
  listKey,
  save,
  remove,
  columns,
  fields,
  emptyRecord,
  toForm,
}: ResourceManagerProps<T>) {
  const qc = useQueryClient();
  const list = useServerFn(fetchList as never);
  const saveFn = useServerFn(save as never);
  const removeFn = useServerFn(remove as never);

  const { data, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: () => list() as Promise<Record<string, unknown>>,
  });
  const rows = ((data?.[listKey] as T[]) ?? []) as T[];

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>(emptyRecord);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openNew = () => {
    setForm({ ...emptyRecord });
    setOpen(true);
  };
  const openEdit = (row: T) => {
    setForm(toForm ? toForm(row) : (row as unknown as Record<string, unknown>));
    setOpen(true);
  };

  const set = (name: string, value: unknown) => setForm((f) => ({ ...f, [name]: value }));

  const submit = async () => {
    setSaving(true);
    try {
      await saveFn({ data: form });
      toast.success("Saved");
      setOpen(false);
      qc.invalidateQueries({ queryKey: [queryKey] });
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
      qc.invalidateQueries({ queryKey: [queryKey] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> Add new
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.header} className="px-4 py-3 font-medium">
                  {c.header}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">
                  Nothing here yet. Click “Add new” to create your first entry.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border/70 hover:bg-muted/20">
                {columns.map((c) => (
                  <td key={c.header} className="px-4 py-3 align-middle">
                    {c.render(row)}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteId(row.id ?? null)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form.id ? `Edit ${title}` : `New ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f) => {
              const value = form[f.name];
              const wrap = f.full || f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : "";
              return (
                <div key={f.name} className={`space-y-1.5 ${wrap}`}>
                  {f.type !== "switch" && <Label>{f.label}</Label>}
                  {f.type === "text" && (
                    <Input
                      value={(value as string) ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) => {
                        set(f.name, e.target.value);
                        if (f.name === "name" || f.name === "title") {
                          if (!form.id && fields.some((x) => x.name === "slug")) {
                            set("slug", slugify(e.target.value));
                          }
                        }
                      }}
                    />
                  )}
                  {f.type === "number" && (
                    <Input
                      type="number"
                      value={value === null || value === undefined ? "" : (value as number)}
                      placeholder={f.placeholder}
                      onChange={(e) =>
                        set(f.name, e.target.value === "" ? null : Number(e.target.value))
                      }
                    />
                  )}
                  {f.type === "textarea" && (
                    <Textarea
                      rows={5}
                      value={(value as string) ?? ""}
                      placeholder={f.placeholder}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  )}
                  {f.type === "image" && (
                    <div className="space-y-2">
                      <Input
                        value={(value as string) ?? ""}
                        placeholder="https://image-url.jpg"
                        onChange={(e) => set(f.name, e.target.value)}
                      />
                      {value ? (
                        <img
                          src={value as string}
                          alt="preview"
                          className="h-28 w-full rounded-md border border-border object-cover"
                        />
                      ) : null}
                    </div>
                  )}
                  {f.type === "tags" && (
                    <Input
                      value={Array.isArray(value) ? (value as string[]).join(", ") : ""}
                      placeholder="luxury, supercar"
                      onChange={(e) =>
                        set(
                          f.name,
                          e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  )}
                  {f.type === "select" && (
                    <Select value={(value as string) ?? ""} onValueChange={(v) => set(f.name, v)}>
                      <SelectTrigger>
                        <SelectValue placeholder={f.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {f.options?.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {f.type === "switch" && (
                    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                      <span className="text-sm">{f.label}</span>
                      <Switch
                        checked={Boolean(value)}
                        onCheckedChange={(c) => set(f.name, c)}
                      />
                    </div>
                  )}
                  {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
                </div>
              );
            })}
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
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
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
