import { createFileRoute } from "@tanstack/react-router";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export const Route = createFileRoute("/_authenticated/admin/menus/")({
  component: () => (
    <SettingsEditor
      settingKey="menu"
      title="Menu Manager"
      description="Configure the main navigation menu. Use one item per line in the format: Label | /link"
      fields={[
        { key: "header", label: "Header menu", multiline: true, help: "One per line: Label | /link" },
        { key: "footer_explore", label: "Footer 'Explore' menu", multiline: true, help: "One per line: Label | /link" },
      ]}
    />
  ),
});
