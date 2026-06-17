import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@/lib/server-compat";
import { toast } from "sonner";
import { Loader2, RotateCcw, EyeOff } from "lucide-react";
import { getSetting, saveSetting } from "@/lib/cms.functions";
import { Button } from "@/components/ui/button";

export function Viewer360Toggle() {
  const get = useServerFn(getSetting);
  const save = useServerFn(saveSetting);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["setting", "features"],
    queryFn: () => get({ data: { key: "features" } }),
  });

  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const value = (data?.value ?? {}) as Record<string, unknown>;
    setEnabled(value.viewer_360_enabled === true || value.viewer_360_enabled === "true");
  }, [data]);

  const setViewer360 = async (next: boolean) => {
    setSaving(true);
    try {
      const currentValue = (data?.value ?? {}) as Record<string, unknown>;
      await save({ data: { key: "features", value: { ...currentValue, viewer_360_enabled: next } } });
      setEnabled(next);
      await refetch();
      toast.success(
        next
          ? "360° viewer is now visible on the live site."
          : "360° viewer is now hidden from the live site.",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update setting");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8 max-w-2xl rounded-lg border bg-card p-5">
      <div className="flex items-center gap-2">
        {enabled ? (
          <RotateCcw className="h-5 w-5 text-primary" />
        ) : (
          <EyeOff className="h-5 w-5 text-muted-foreground" />
        )}
        <h2 className="text-lg font-medium">360° Vehicle Viewer</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        When ON, the 360° viewer button appears on vehicle detail pages. When OFF, it is completely hidden from the live website.
      </p>

      {isLoading ? (
        <Loader2 className="mt-4 h-5 w-5 animate-spin" />
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              enabled
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Currently: {enabled ? "Visible on live site" : "Hidden"}
          </span>
          <Button
            variant={enabled ? "outline" : "default"}
            disabled={saving}
            onClick={() => setViewer360(true)}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Show 360° viewer
          </Button>
          <Button
            variant={enabled ? "default" : "outline"}
            disabled={saving}
            onClick={() => setViewer360(false)}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Hide 360° viewer
          </Button>
        </div>
      )}
    </div>
  );
}
