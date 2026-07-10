import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@/lib/server-compat";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import {
  listVehiclesAdmin,
  toggleVehicleFlag,
  deleteVehicle,
} from "@/lib/vehicles.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin/vehicles/")({
  component: VehiclesList,
});

const fmtPrice = (p: number | null) =>
  p == null ? "—" : new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }).format(p);

function VehiclesList() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listVehiclesAdmin);
  const toggleFn = useServerFn(toggleVehicleFlag);
  const deleteFn = useServerFn(deleteVehicle);
  const { data, isLoading } = useQuery({ queryKey: ["vehicles-admin"], queryFn: () => fetchList() });

  const toggle = useMutation({
    mutationFn: (v: { id: string; field: "sold" | "featured" | "new_arrival" | "published"; value: boolean }) =>
      toggleFn({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vehicles-admin"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Vehicle deleted");
      qc.invalidateQueries({ queryKey: ["vehicles-admin"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const vehicles = data?.vehicles ?? [];

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("all");
  const [status, setStatus] = useState("all");

  const brands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand).filter(Boolean))).sort(),
    [vehicles],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (brand !== "all" && v.brand !== brand) return false;
      if (status === "featured" && !v.featured) return false;
      if (status === "sold" && !v.sold) return false;
      if (status === "available" && v.sold) return false;
      if (status === "published" && !v.published) return false;
      if (status === "draft" && v.published) return false;
      if (status === "new_arrival" && !v.new_arrival) return false;
      if (!q) return true;
      return (
        (v.title ?? "").toLowerCase().includes(q) ||
        (v.brand ?? "").toLowerCase().includes(q) ||
        (v.model ?? "").toLowerCase().includes(q) ||
        String(v.year ?? "").includes(q)
      );
    });
  }, [vehicles, search, brand, status]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Vehicles</h1>
        <Button asChild>
          <Link to="/admin/vehicles/$id" params={{ id: "new" }}>
            <Plus className="h-4 w-4" /> Add vehicle
          </Link>
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by title, brand, model or year…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All brands</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="new_arrival">New arrival</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">Featured</TableHead>
              <TableHead className="text-center">Sold</TableHead>
              <TableHead className="text-center">Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No vehicles found.</TableCell></TableRow>
            )}
            {filtered.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.title}</TableCell>
                <TableCell>{v.brand}</TableCell>
                <TableCell>{fmtPrice(v.price as number | null)}</TableCell>
                <TableCell className="text-center">
                  <Switch checked={v.featured} onCheckedChange={(c) => toggle.mutate({ id: v.id, field: "featured", value: c })} />
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={v.sold} onCheckedChange={(c) => toggle.mutate({ id: v.id, field: "sold", value: c })} />
                </TableCell>
                <TableCell className="text-center">
                  <Switch checked={v.published} onCheckedChange={(c) => toggle.mutate({ id: v.id, field: "published", value: c })} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon">
                      <Link to="/admin/vehicles/$id" params={{ id: v.id }}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Delete "${v.title}"? This cannot be undone.`)) remove.mutate(v.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
