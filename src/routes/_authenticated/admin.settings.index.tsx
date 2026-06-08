import { createFileRoute } from "@tanstack/react-router";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export const Route = createFileRoute("/_authenticated/admin/settings/")({
  component: () => (
    <SettingsEditor
      settingKey="general"
      title="Settings"
      description="General website and business settings."
      fields={[
        { key: "business_name", label: "Business name" },
        { key: "tagline", label: "Tagline" },
        { key: "contact_email", label: "Contact email" },
        { key: "contact_phone", label: "Contact phone" },
        { key: "address", label: "Address", multiline: true },
        { key: "opening_hours", label: "Opening hours", multiline: true },
      ]}
    />
  ),
});
