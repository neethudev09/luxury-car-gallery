## Goal

Move from "editable text fields" to a true relational CMS where content is created once, linked by reference, and reused everywhere. Links and labels are generated from the referenced content, so renaming a brand, changing a page slug, or marking a vehicle sold updates everywhere automatically.

The key architectural idea: **stop storing copied strings (labels, URLs, image URLs). Store references (content type + id). Resolve them to live data at read time.** That single change is what makes everything "update automatically".

## Phase 1 — Foundation: a shared content-reference layer

1. **`getContentIndex` server function** (`src/lib/cms.functions.ts`): one call returning lightweight lists of every linkable content type — pages, vehicles, brands, blog posts, galleries, FAQ groups — each as `{ id, label, slug, type, status }`. This powers every picker.
2. **`resolveRef` helper** (server + a small client mirror): given `{ type, id }`, produce the canonical URL and current label (e.g. vehicle → `/cars/$slug`, brand → `/brands/$slug`, page → `/$slug`, post → `/blog/$slug`). Because URLs are derived, slug/name changes propagate automatically.
3. **`ContentPicker` component** (`src/components/admin/ContentPicker.tsx`): a searchable combobox (using existing `command`/`popover` UI) that lets the user pick a content type then an item. Returns a `{ type, id }` reference, not a typed string. A `RefList` variant manages an ordered list of references (for menus, related items, galleries).

## Phase 2 — Menu Manager becomes relational (the concrete example)

- Replace the free-text "Label | /link" textarea with a `RefList` of content references plus optional custom links for external URLs.
- Stored menu value becomes an array of `{ type, id }` (or `{ type: "custom", label, url }`).
- The public site (`Header`, `Footer`) resolves references at render time via `resolveRef`, so labels/URLs always reflect current content. Rename a brand or change a page slug → menu updates with no manual edit.

## Phase 3 — Media Library: upload once, reuse everywhere

- Make the `media` storage bucket usable: a drag-and-drop uploader in the Media Library that uploads files to storage and creates `media_assets` rows (with alt text). (Bucket privacy/public will be confirmed with you — public is needed for images to show on the live site.)
- Introduce a `MediaPicker` (built on `ContentPicker`) used everywhere an image is chosen: vehicles, brands, pages, blog covers, gallery items, homepage sections, SEO/OG images. Image fields store a `media_asset` id, not a pasted URL.

## Phase 4 — Relational fields across content types

Add reference-based fields, resolved at read time:
- **Vehicles** → brand (ref), image gallery (refs), FAQ group (ref), SEO fields, related vehicles.
- **Brands** → derived vehicle list, brand page (ref), hero image (media ref).
- **Pages** → galleries (refs), FAQ groups (refs), CTA buttons (each a content ref), SEO/OG (media ref).
- **Blog posts** → cover/inline images (media refs), related vehicles/brands/posts (refs), FAQ group (ref).

## Phase 5 — Automatic propagation guarantees

- All "current" data (sold status, brand name, page slug) is read live through resolvers — never duplicated — so changes propagate with zero manual relinking.
- Add safe-delete checks: warn when deleting content that is referenced elsewhere, and skip/flag dangling references on render instead of breaking the page.

## Technical notes

- References are stored as JSON (`{type, id}` / arrays) in existing JSON/text columns and `site_settings`; no destructive schema changes required for Phase 1–2. A later migration can add typed columns/junction tables if you want stricter integrity.
- Public reads continue to go through `src/lib/public.functions.ts` using the admin client, extended with resolver logic so the frontend gets fully-resolved labels/URLs/images.
- Everything builds on existing shadcn primitives (`command`, `popover`, `dialog`) and the current server-function patterns.

## Suggested sequencing

Start with **Phase 1 + Phase 2** (foundation + Menu Manager) so you can see the relational pattern working end-to-end, then roll the same `ContentPicker`/`MediaPicker` pattern through the remaining content types in Phases 3–5.

Want me to proceed with Phase 1 and Phase 2 first?