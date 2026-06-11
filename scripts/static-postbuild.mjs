// Normalizes the static build output into ./dist for shared hosting
// (Hostinger Web Hosting). TanStack Start + Nitro's `static` preset emit the
// prerendered SPA shell (index.html) plus client assets; depending on the
// Nitro version these land in `.output/public`. This script ensures the final
// files live in `./dist` with index.html at the root and assets alongside.
//
// It is intentionally defensive: inside the Lovable sandbox the build targets
// Cloudflare (a Worker, no static public dir), so if no static output is found
// this script simply does nothing and exits successfully.
import { existsSync, mkdirSync, rmSync, cpSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");

// Candidate locations Nitro/TanStack may write the static site to.
const candidates = [
  ".output/public",
  "dist/public",
  ".tanstack/start/build/client-dist",
  "dist/client",
];

function hasIndex(dir) {
  return existsSync(join(dir, "index.html"));
}

// If dist already has index.html at its root, we're done.
if (hasIndex(dist)) {
  console.log("[static-postbuild] dist/index.html already present — nothing to do.");
  process.exit(0);
}

const source = candidates
  .map((c) => resolve(root, c))
  .find((p) => p !== dist && hasIndex(p));

if (!source) {
  console.log(
    "[static-postbuild] No static index.html found (non-static build, e.g. sandbox/Cloudflare). Skipping.",
  );
  process.exit(0);
}

console.log(`[static-postbuild] Publishing static site from ${source} -> ${dist}`);
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const entry of readdirSync(source)) {
  cpSync(join(source, entry), join(dist, entry), { recursive: true });
}
console.log("[static-postbuild] Done. dist/ now contains index.html + assets.");
