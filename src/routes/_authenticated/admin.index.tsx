import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Car, Star, Tag, Plus, Sparkles } from "lucide-react";
import { listVehiclesAdmin } from "@/lib/vehicles.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const fetchList = useServerFn(listVehiclesAdmin);
  const { data } = useQuery({ queryKey: ["vehicles-admin"], queryFn: () => fetchList() });
  const vehicles = data?.vehicles ?? [];

  const stats = [
    { label: "Total vehicles", value: vehicles.length, icon: Car },
    { label: "Featured", value: vehicles.filter((v) => v.featured).length, icon: Star },
    { label: "New arrivals", value: vehicles.filter((v) => v.new_arrival).length, icon: Sparkles },
    { label: "Sold", value: vehicles.filter((v) => v.sold).length, icon: Tag },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Overview of your inventory.</p>
        </div>
        <Button asChild>
          <Link to="/admin/vehicles/$id" params={{ id: "new" }}>
            <Plus className="h-4 w-4" /> Add vehicle
          </Link>
        </Button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="mb-3 text-lg">Recently updated</h2>
        <div className="space-y-2">
          {vehicles.slice(0, 5).map((v) => (
            <Link
              key={v.id}
              to="/admin/vehicles/$id"
              params={{ id: v.id }}
              className="flex items-center justify-between rounded-lg border border-border p-3 text-sm hover:bg-muted"
            >
              <span>{v.title}</span>
              <span className="text-muted-foreground">{v.brand}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
