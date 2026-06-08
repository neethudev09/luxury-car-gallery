import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getSetting, saveSetting } from "@/lib/cms.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface SettingField {
  key: string;
  label: string;
  multiline?: boolean;
  help?: string;
}

interface Props {
  settingKey: string;
  title: string;
  description?: string;
  fields: SettingField[];
}

export function SettingsEditor({ settingKey, title, description, fields }: Props) {
  const get = useServerFn(getSetting);
  const save = useServerFn(saveSetting);
  const { data, isLoading } = useQuery({
    queryKey: ["setting", settingKey],
    queryFn: () => get({ data: { key: settingKey } }),
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const value = (data?.value ?? {}) as Record<string, unknown>;
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      next[f.key] = value[f.key] != null ? String(value[f.key]) : "";
    });
    setForm(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const submit = async () => {
    setSaving(true);
    try {
      await save({ data: { key: settingKey, value: form } });
      toast.success("Saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl">{title}</h1>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {isLoading ? (
        <Loader2 className="mt-6 h-5 w-5 animate-spin" />
      ) : (
        <div className="mt-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label>{f.label}</Label>
              {f.multiline ? (
                <Textarea
                  rows={3}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                />
              ) : (
                <Input
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                />
              )}
              {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
            </div>
          ))}
          <Button onClick={submit} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </Button>
        </div>
      )}
    </div>
  );
}
