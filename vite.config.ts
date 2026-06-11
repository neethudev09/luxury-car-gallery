// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Inside the Lovable sandbox (preview / publish) we keep the default SSR setup so
// the live preview and the hosted build keep working. Only when building OUTSIDE
// the sandbox (e.g. on a machine producing the static bundle for Hostinger Web
// Hosting) do we switch to a fully static SPA build.
const isSandbox = !!(process.env.LOVABLE_SANDBOX || process.env.DEV_SERVER__PROJECT_PATH);

export default defineConfig(
  isSandbox
    ? {}
    : {
        // Static SPA: no SSR, no Node/server runtime. TanStack Start prerenders a
        // single client shell (index.html) and the app hydrates + routes entirely
        // in the browser. Suitable for plain shared hosting (e.g. Hostinger Web
        // Hosting). All data is read straight from the database in the browser
        // using the publishable key + Row Level Security.
        tanstackStart: {
          spa: { enabled: true },
        },
        // Disable the Nitro server/deploy build entirely so we get a Vite-only
        // static build flattened into ./dist by scripts/static-postbuild.mjs.
        nitro: false,
      },
);
