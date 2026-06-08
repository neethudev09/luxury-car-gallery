import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listSellSubmissions, updateSellStatus, deleteSellSubmission } from "@/lib/cms.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/sell/")({
  component: SellPage,
});

type Sub = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  brand: string | null;
  model: string | null;
  year: number | null;
  mileage: number | null;
  price_expectation: number | null;
  message: string | null;
  status: string;
  created_at: string;
};

function SellPage() {
  const qc = useQueryClient();
  const list = useServerFn(listSellSubmissions);
  const setStatus = useServerFn(updateSellStatus);
  const remove = useServerFn(deleteSellSubmission);
  const { data, isLoading } = useQuery({ queryKey: ["sell"], queryFn: () => list() });
  const rows = (data?.submissions ?? []) as Sub[];

  const cycle = async (s: Sub) => {
    const order = ["new", "contacted", "closed", "archived"];
    const next = order[(order.indexOf(s.status) + 1) % order.length];
    await setStatus({ data: { id: s.id, status: next } });
    qc.invalidateQueries({ queryKey: ["sell"] });
  };
  const del = async (id: string) => {
    try {
      await remove({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["sell"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete");
    }
  };

  return (
    <div>
      <h1 className="text-3xl">Sell Your Car Submissions</h1>
      <p className="mt-1 text-sm text-muted-foreground">People wanting to sell their vehicle.</p>
      <div className="mt-6 space-y-3">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        )}
        {rows.map((s) => (
          <div key={s.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">
                {s.name} — {[s.brand, s.model, s.year].filter(Boolean).join(" ")}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => cycle(s)}>
                  <Badge variant={s.status === "new" ? "default" : "secondary"}>{s.status}</Badge>
                </button>
                <span className="text-xs text-muted-foreground">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
                <Button size="icon" variant="ghost" onClick={() => del(s.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {s.email} {s.phone && `· ${s.phone}`}
              {s.mileage != null && ` · ${s.mileage.toLocaleString()} km`}
              {s.price_expectation != null && ` · asking ${s.price_expectation.toLocaleString()}`}
            </div>
            {s.message && <p className="mt-2 text-sm">{s.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
