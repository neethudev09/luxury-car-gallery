// Normalizes the static build output into ./dist for shared hosting
// (Hostinger Web Hosting, served from public_html).
//
// The Vite/TanStack Start static build emits:
//   dist/client/_shell.html   <- the prerendered SPA shell
//   dist/client/assets/...    <- hashed JS/CSS
//   dist/client/media/...     <- bundled images
//   dist/client/.htaccess, robots.txt, sitemap.xml (copied from public/)
//   dist/server/...           <- prerender-only bundle (NOT needed to deploy)
//
// This script turns that into a flat, self-contained static site:
//   dist/index.html, dist/assets/, dist/media/, dist/__l5e/, .htaccess, ...
//
// It also downloads Lovable-externalized assets (referenced as /__l5e/... via
// *.asset.json) into dist/__l5e so the deployed site has NO runtime dependency
// on Lovable infrastructure.
//
// Inside the Lovable sandbox the build targets Cloudflare and must keep its
// dist/client + dist/server layout, so this script no-ops there.
import {
  existsSync,
  mkdirSync,
  rmSync,
  cpSync,
  renameSync,
  readdirSync,
  writeFileSync,
  readFileSync,
} from "node:fs";
import { join, resolve, dirname } from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const dist = resolve(root, "dist");

if (process.env.LOVABLE_SANDBOX || process.env.DEV_SERVER__PROJECT_PATH) {
  console.log("[static-postbuild] Lovable sandbox detected — leaving build output untouched.");
  process.exit(0);
}

const clientDir = join(dist, "client");
if (!existsSync(clientDir)) {
  console.log("[static-postbuild] No dist/client directory — nothing to flatten.");
  process.exit(0);
}

// 1) Flatten dist/client/* up into dist/, then drop dist/server + dist/client.
console.log("[static-postbuild] Flattening dist/client -> dist");
for (const entry of readdirSync(clientDir)) {
  const from = join(clientDir, entry);
  const to = join(dist, entry);
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}
rmSync(clientDir, { recursive: true, force: true });
rmSync(join(dist, "server"), { recursive: true, force: true });

// 2) Ensure the SPA entry is index.html.
const shell = join(dist, "_shell.html");
const indexHtml = join(dist, "index.html");
if (!existsSync(indexHtml) && existsSync(shell)) {
  renameSync(shell, indexHtml);
  console.log("[static-postbuild] Renamed _shell.html -> index.html");
}

// 3) Vendor Lovable-externalized assets (/__l5e/...) into dist so the site is
//    fully self-contained on Hostinger.
function listAssetManifests(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...listAssetManifests(p));
    else if (e.name.endsWith(".asset.json")) out.push(p);
  }
  return out;
}

const manifests = existsSync(join(root, "src")) ? listAssetManifests(join(root, "src")) : [];
const projectId = "f0dbafff-cd4b-4762-aed7-86e00a3b9c6d";
const bases = [
  `https://id-preview--${projectId}.lovable.app`,
  `https://project--${projectId}.lovable.app`,
  `https://${projectId}.lovableproject.com`,
];

function download(url, dest) {
  for (const base of bases) {
    try {
      execSync(`curl -fsSL "${base}${url}" -o "${dest}"`, { stdio: "ignore" });
      if (existsSync(dest) && readFileSync(dest).length > 0) return true;
    } catch {
      /* try next base */
    }
  }
  return false;
}

let ok = 0;
const failed = [];
for (const m of manifests) {
  let info;
  try {
    info = JSON.parse(readFileSync(m, "utf8"));
  } catch {
    continue;
  }
  if (!info?.url) continue;
  const dest = join(dist, info.url.replace(/^\//, ""));
  mkdirSync(dirname(dest), { recursive: true });
  if (download(info.url, dest)) ok++;
  else failed.push(info.url);
}
console.log(`[static-postbuild] Vendored ${ok}/${manifests.length} externalized assets into dist/__l5e`);
if (failed.length) {
  console.warn("[static-postbuild] WARNING: could not download:\n  " + failed.join("\n  "));
}

// 4) Safety net: make sure deploy helpers exist at the dist root.
for (const f of [".htaccess", "robots.txt", "sitemap.xml"]) {
  const inDist = join(dist, f);
  const inPublic = join(root, "public", f);
  if (!existsSync(inDist) && existsSync(inPublic)) cpSync(inPublic, inDist);
}

if (!existsSync(indexHtml)) {
  console.error("[static-postbuild] ERROR: dist/index.html was not produced.");
  process.exit(1);
}
console.log("[static-postbuild] Done. Deployable static site is in ./dist");
