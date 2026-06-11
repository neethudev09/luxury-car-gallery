import { createFileRoute } from "@tanstack/react-router";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { IndexingToggle } from "@/components/admin/IndexingToggle";

export const Route = createFileRoute("/_authenticated/admin/seo/")({
  component: () => (
    <div>
      <IndexingToggle />
      <SettingsEditor
        settingKey="seo"
        title="SEO Settings"
        description="Default SEO metadata for the website."
        fields={[
          { key: "site_title", label: "Default site title" },
          { key: "title_template", label: "Title template", help: "Use %s for the page title, e.g. %s | Luxury Car Gallery Dubai" },
          { key: "meta_description", label: "Default meta description", multiline: true },
          { key: "og_image", label: "Default social share image URL" },
          { key: "twitter_handle", label: "Twitter handle" },
        ]}
      />
    </div>
  ),
});
