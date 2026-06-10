import { createFileRoute } from "@tanstack/react-router";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export const Route = createFileRoute("/_authenticated/admin/integrations/")({
  component: () => (
    <SettingsEditor
      settingKey="integrations"
      title="Google Tools & Tracking"
      description="Connect Google Analytics, Tag Manager and Search Console. These tags are injected into the site header automatically on every public page."
      fields={[
        {
          key: "ga4_id",
          label: "Google Analytics 4 Measurement ID",
          help: "e.g. G-XXXXXXXXXX. Loads gtag.js sitewide.",
        },
        {
          key: "gtm_id",
          label: "Google Tag Manager ID",
          help: "e.g. GTM-XXXXXXX. Loads the GTM container in the header.",
        },
        {
          key: "google_site_verification",
          label: "Search Console verification code",
          help: "The content value of the google-site-verification meta tag.",
        },
        {
          key: "custom_head_js",
          label: "Additional header script (JavaScript)",
          multiline: true,
          help: "Optional raw JavaScript injected into <head>. Do not include <script> tags.",
        },
      ]}
    />
  ),
});
