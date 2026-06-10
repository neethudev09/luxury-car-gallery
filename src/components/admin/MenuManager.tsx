import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getSetting, saveSetting, getContentIndex } from "@/lib/cms.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RefList } from "@/components/admin/ContentPicker";
import type { ContentRef, IndexItem } from "@/lib/refs";

interface MenuValue {
  header: ContentRef[];
  footer_explore: ContentRef[];
}

const MENUS: { key: keyof MenuValue; label: string; help: string }[] = [
  { key: "header", label: "Header menu", help: "Main navigation links shown in the site header." },
  {
    key: "footer_explore",
    label: "Footer \u201cExplore\u201d menu",
    help: "Links shown under Explore in the website footer.",
  },
];

export function MenuManager() {
  const get = useServerFn(getSetting);
  const save = useServerFn(saveSetting);
  const indexFn = useServerFn(getContentIndex);

  const { data, isLoading } = useQuery({
    queryKey: ["setting", "menu"],
    queryFn: () => get({ data: { key: "menu" } }),
  });
  const { data: indexData } = useQuery({
    queryKey: ["content-index"],
    queryFn: () => indexFn(),
  });

  const [menus, setMenus] = useState<MenuValue>({ header: [], footer_explore: [] });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const value = (data?.value ?? {}) as Partial<MenuValue>;
    setMenus({
      header: Array.isArray(value.header) ? value.header : [],
      footer_explore: Array.isArray(value.footer_explore) ? value.footer_explore : [],
    });
  }, [data]);

  const index = (indexData?.items ?? []) as IndexItem[];

  const submit = async () => {
    setSaving(true);
    try {
      await save({ data: { key: "menu", value: menus } });
      toast.success("Menus saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl">Menu Manager</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Build navigation by selecting existing CMS content. Links and labels are generated
        automatically and stay in sync when you rename or re-slug content.
      </p>

      {isLoading ? (
        <Loader2 className="mt-6 h-5 w-5 animate-spin" />
      ) : (
        <div className="mt-6 space-y-8">
          {MENUS.map((m) => (
            <div key={m.key} className="space-y-2">
              <Label className="text-base">{m.label}</Label>
              <p className="text-xs text-muted-foreground">{m.help}</p>
              <RefList
                value={menus[m.key]}
                onChange={(next) => setMenus((s) => ({ ...s, [m.key]: next }))}
                index={index}
              />
            </div>
          ))}
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save menus
          </Button>
        </div>
      )}
    </div>
  );
}
