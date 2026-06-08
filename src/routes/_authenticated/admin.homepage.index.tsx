import { createFileRoute } from "@tanstack/react-router";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export const Route = createFileRoute("/_authenticated/admin/homepage/")({
  component: () => (
    <SettingsEditor
      settingKey="homepage"
      title="Homepage Editor"
      description="Edit the main sections shown on the homepage."
      fields={[
        { key: "hero_title", label: "Hero title" },
        { key: "hero_subtitle", label: "Hero subtitle", multiline: true },
        { key: "hero_image", label: "Hero image URL" },
        { key: "hero_cta_label", label: "Hero button label" },
        { key: "hero_cta_link", label: "Hero button link" },
        { key: "featured_title", label: "Featured section title" },
        { key: "featured_subtitle", label: "Featured section subtitle", multiline: true },
        { key: "cta_title", label: "Bottom CTA title" },
        { key: "cta_text", label: "Bottom CTA text", multiline: true },
      ]}
    />
  ),
});
