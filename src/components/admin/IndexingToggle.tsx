import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@/lib/server-compat";
import { toast } from "sonner";
import { Loader2, Globe, EyeOff } from "lucide-react";
import { getSetting, saveSetting } from "@/lib/cms.functions";
import { Button } from "@/components/ui/button";

export function IndexingToggle() {
  const get = useServerFn(getSetting);
  const save = useServerFn(saveSetting);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["setting", "indexing"],
    queryFn: () => get({ data: { key: "indexing" } }),
  });

  const [allow, setAllow] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const value = (data?.value ?? {}) as Record<string, unknown>;
    setAllow(value.allow_indexing === true || value.allow_indexing === "true");
  }, [data]);

  const setIndexing = async (next: boolean) => {
    setSaving(true);
    try {
      await save({ data: { key: "indexing", value: { allow_indexing: next } } });
      setAllow(next);
      await refetch();
      toast.success(
        next
          ? "Search engine indexing turned ON. The site can now be indexed."
          : "Search engine indexing turned OFF. The site is now deindexed.",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update indexing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8 max-w-2xl rounded-lg border bg-card p-5">
      <div className="flex items-center gap-2">
        {allow ? (
          <Globe className="h-5 w-5 text-primary" />
        ) : (
          <EyeOff className="h-5 w-5 text-muted-foreground" />
        )}
        <h2 className="text-lg font-medium">Search engine indexing</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        When OFF, the whole website is hidden from Google and other search engines
        (every page sends a <code>noindex</code> signal). Turn it ON when you are
        ready to go live and be found in search results.
      </p>

      {isLoading ? (
        <Loader2 className="mt-4 h-5 w-5 animate-spin" />
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              allow
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Currently: {allow ? "Indexed (visible to search engines)" : "Deindexed (hidden)"}
          </span>
          <Button
            variant={allow ? "outline" : "default"}
            disabled={saving}
            onClick={() => setIndexing(true)}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Turn indexing ON
          </Button>
          <Button
            variant={allow ? "default" : "outline"}
            disabled={saving}
            onClick={() => setIndexing(false)}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Turn indexing OFF
          </Button>
        </div>
      )}
    </div>
  );
}
