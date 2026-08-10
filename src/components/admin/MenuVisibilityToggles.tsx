import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@/lib/server-compat";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ListTree } from "lucide-react";
import { getSetting, saveSetting } from "@/lib/cms.functions";
import { Switch } from "@/components/ui/switch";

const ITEMS = [
  { key: "nav_media_video_gallery", group: "Media", label: "Video Gallery" },
  { key: "nav_media_360_cars", group: "Media", label: "360° Car Views" },
  { key: "nav_media_showroom_tour", group: "Media", label: "360° Showroom Tour" },
  { key: "nav_news_news", group: "News", label: "News" },
  { key: "nav_news_buying_guides", group: "News", label: "Buying Guides" },
  { key: "nav_news_market_updates", group: "News", label: "Market Updates" },
] as const;

export function MenuVisibilityToggles() {
  const get = useServerFn(getSetting);
  const save = useServerFn(saveSetting);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["setting", "features"],
    queryFn: () => get({ data: { key: "features" } }),
  });

  const [value, setValue] = useState<Record<string, unknown>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    setValue((data?.value ?? {}) as Record<string, unknown>);
  }, [data]);

  const isOn = (key: string) => value[key] === true || value[key] === "true";

  const toggle = async (key: string, next: boolean) => {
    setSavingKey(key);
    try {
      const nextValue = { ...value, [key]: next };
      await save({ data: { key: "features", value: nextValue } });
      setValue(nextValue);
      await refetch();
      toast.success(next ? "Menu item is now visible on the live site." : "Menu item is now hidden.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update setting");
    } finally {
      setSavingKey(null);
    }
  };

  const groups = ["Media", "News"] as const;

  return (
    <div className="mb-8 max-w-2xl rounded-lg border bg-card p-5">
      <div className="flex items-center gap-2">
        <ListTree className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium">Menu visibility</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Image Gallery (Media) and Blog (News) are always shown. Switch any other menu item back on here
        when the content is ready — the change appears on the website immediately.
      </p>

      {isLoading ? (
        <Loader2 className="mt-4 h-5 w-5 animate-spin" />
      ) : (
        <div className="mt-5 space-y-6">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {group} menu
              </p>
              <div className="mt-2 divide-y rounded-md border">
                {ITEMS.filter((i) => i.group === group).map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="flex items-center gap-2 text-sm">
                      {isOn(item.key) ? (
                        <Eye className="h-4 w-4 text-primary" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {savingKey === item.key && <Loader2 className="h-4 w-4 animate-spin" />}
                      <Switch
                        checked={isOn(item.key)}
                        disabled={savingKey !== null}
                        onCheckedChange={(next) => toggle(item.key, next)}
                        aria-label={`Show ${item.label} in the menu`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
