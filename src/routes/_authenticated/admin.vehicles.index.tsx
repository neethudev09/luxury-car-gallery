import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  listVehiclesAdmin,
  toggleVehicleFlag,
  deleteVehicle,
} from "@/lib/vehicles.functions";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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

      <div className="mt-6 rounded-xl border border-border">
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
            {!isLoading && vehicles.length === 0 && (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No vehicles yet.</TableCell></TableRow>
            )}
            {vehicles.map((v) => (
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
