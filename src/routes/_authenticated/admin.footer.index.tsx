import { createFileRoute } from "@tanstack/react-router";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export const Route = createFileRoute("/_authenticated/admin/footer/")({
  component: () => (
    <SettingsEditor
      settingKey="footer"
      title="Footer Editor"
      description="Edit the website footer content."
      fields={[
        { key: "about", label: "About text", multiline: true },
        { key: "address", label: "Address" },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "whatsapp", label: "WhatsApp number" },
        { key: "instagram", label: "Instagram URL" },
        { key: "facebook", label: "Facebook URL" },
        { key: "youtube", label: "YouTube URL" },
        { key: "seo_blurb", label: "SEO blurb", multiline: true },
      ]}
    />
  ),
});
