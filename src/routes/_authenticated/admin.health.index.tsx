import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@/lib/server-compat";
import { getHealthCheck } from "@/lib/cms.functions";
import { getMyAccess } from "@/lib/vehicles.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Database,
  HardDrive,
  Package,
  ShieldCheck,
  Car,
  Tag,
  Images,
  Rocket,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/health/")({
  component: HealthPage,
});

function StatusRow({
  icon: Icon,
  label,
  ok,
  detail,
}: {
  icon: React.ElementType;
  label: string;
  ok: boolean;
  detail?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border/70 p-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {detail !== undefined && <span className="text-sm text-muted-foreground">{detail}</span>}
        {ok ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <XCircle className="h-5 w-5 text-destructive" />
        )}
      </div>
    </div>
  );
}

function HealthPage() {
  const fetchHealth = useServerFn(getHealthCheck);
  const fetchAccess = useServerFn(getMyAccess);
  const { data, isFetching, refetch } = useQuery({
    queryKey: ["health-check"],
    queryFn: () => fetchHealth(),
  });
  const { data: access } = useQuery({ queryKey: ["my-access"], queryFn: () => fetchAccess() });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Health Check</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            System diagnostics for the database, storage and content.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <StatusRow icon={Database} label="Database connected" ok={!!data?.database.ok} />
            <StatusRow icon={HardDrive} label="Storage connected" ok={!!data?.storage.ok} />
            <StatusRow
              icon={Package}
              label="Media bucket status"
              ok={!!data?.mediaBucket.ok}
              detail={
                data?.mediaBucket.ok ? (
                  <Badge variant={data.mediaBucket.public ? "default" : "outline"}>
                    {data.mediaBucket.public ? "public" : "private"}
                  </Badge>
                ) : undefined
              }
            />
            <StatusRow
              icon={ShieldCheck}
              label="Authentication"
              ok={!!data?.auth.ok}
              detail={access?.email ?? undefined}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <StatusRow
              icon={Car}
              label="Vehicles"
              ok={data?.counts.vehicles != null}
              detail={data?.counts.vehicles ?? "—"}
            />
            <StatusRow
              icon={Tag}
              label="Brands"
              ok={data?.counts.brands != null}
              detail={data?.counts.brands ?? "—"}
            />
            <StatusRow
              icon={Images}
              label="Images"
              ok={data?.counts.images != null}
              detail={data?.counts.images ?? "—"}
            />
            <StatusRow
              icon={Rocket}
              label="Last successful deployment"
              ok={true}
              detail={
                data?.deployment.builtAt
                  ? new Date(data.deployment.builtAt).toLocaleString()
                  : `${data?.deployment.env ?? "—"} build`
              }
            />
          </CardContent>
        </Card>
      </div>

      {data?.checkedAt && (
        <p className="mt-4 text-xs text-muted-foreground">
          Last checked {new Date(data.checkedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
