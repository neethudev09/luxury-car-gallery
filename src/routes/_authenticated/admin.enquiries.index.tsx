import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@/lib/server-compat";
import { toast } from "sonner";
import { listEnquiries, updateEnquiryStatus, deleteEnquiry } from "@/lib/cms.functions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/enquiries/")({
  component: EnquiriesPage,
});

type Enquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  vehicle_title: string | null;
  status: string;
  created_at: string;
};

function EnquiriesPage() {
  const qc = useQueryClient();
  const list = useServerFn(listEnquiries);
  const setStatus = useServerFn(updateEnquiryStatus);
  const remove = useServerFn(deleteEnquiry);
  const { data, isLoading } = useQuery({ queryKey: ["enquiries"], queryFn: () => list() });
  const rows = (data?.enquiries ?? []) as Enquiry[];

  const cycle = async (e: Enquiry) => {
    const next = e.status === "new" ? "read" : e.status === "read" ? "archived" : "new";
    await setStatus({ data: { id: e.id, status: next } });
    qc.invalidateQueries({ queryKey: ["enquiries"] });
  };
  const del = async (id: string) => {
    try {
      await remove({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["enquiries"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete");
    }
  };

  return (
    <div>
      <h1 className="text-3xl">Enquiries</h1>
      <p className="mt-1 text-sm text-muted-foreground">Contact form submissions from the website.</p>
      <div className="mt-6 space-y-3">
        {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
        {!isLoading && rows.length === 0 && (
          <p className="text-sm text-muted-foreground">No enquiries yet.</p>
        )}
        {rows.map((e) => (
          <div key={e.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium">{e.name}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => cycle(e)}>
                  <Badge variant={e.status === "new" ? "default" : e.status === "read" ? "secondary" : "outline"}>
                    {e.status}
                  </Badge>
                </button>
                <span className="text-xs text-muted-foreground">
                  {new Date(e.created_at).toLocaleDateString()}
                </span>
                <Button size="icon" variant="ghost" onClick={() => del(e.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {e.email} {e.phone && `· ${e.phone}`} {e.vehicle_title && `· ${e.vehicle_title}`}
            </div>
            {e.message && <p className="mt-2 text-sm">{e.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
