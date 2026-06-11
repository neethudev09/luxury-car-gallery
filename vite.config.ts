// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Static SPA: no SSR, no Node/server runtime. TanStack Start prerenders a
  // single client shell (index.html) and the app hydrates + routes entirely
  // in the browser. Suitable for plain shared hosting (e.g. Hostinger Web
  // Hosting). All data is read straight from the database in the browser
  // using the publishable key + Row Level Security.
  tanstackStart: {
    spa: { enabled: true },
  },
  // Disable the Nitro server/deploy build entirely. Outside the Lovable
  // sandbox this yields a Vite-only static build: the TanStack Start plugin
  // still prerenders the SPA shell to index.html. Inside the sandbox, Nitro
  // is force-enabled (Cloudflare) automatically so preview/publish keep
  // working regardless of this flag.
  nitro: false,
});
