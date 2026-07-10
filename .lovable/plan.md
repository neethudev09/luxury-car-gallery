# Make the CMS the single source of truth

## Current state (verified)

- **Tables exist and admin editors work**: vehicles, brands, media_assets, blog_posts, galleries, faqs, pages, site_settings.
- **Partial data already seeded**: 24 vehicles (metadata only — every `image` empty, 0 gallery images), 11 brands (logos as CDN URLs), 22 media assets (mostly brand logos; only 8 "vehicles" rows).
- **The public site is still hardcoded**: `index.tsx` (feed + featured), `inventory.tsx`, and `cars.$slug.tsx` all import `@/data/cars.ts`. Only brand pages (`brands.$brand.tsx`) and the homepage brand strip read the CMS today.
- **324 car images (104 MB)** live only as bundled assets in `src/assets/cars/`. The `media` storage bucket is private.

The gap is therefore: (1) get every image into the Media Library with alt text, (2) attach images/galleries/specs/SEO to the seeded vehicles, (3) reconcile the 24 DB rows against the ~24 cars in code, (4) rewire the public pages to read the CMS, (5) make the Media Library a real upload point for the client going forward.

## Decision to confirm

**Image hosting.** Two options for the client's future uploads:
1. Make the `media` storage bucket **public** and add a drag-and-drop uploader in the Media Library that writes there. (Needed for "client uploads once via the CMS". Requires public-bucket policy — may need you to enable public buckets in workspace settings.)
2. Keep uploads on the existing Lovable CDN pattern (what the brand logos already use).

Existing images will be migrated to stable public URLs either way. I recommend **option 1** so the client truly owns uploads. I'll proceed with option 1 unless you say otherwise.

## Phase 1 — Media Library becomes real

- Make `media` bucket public (or surface the workspace setting if blocked).
- Add a drag-and-drop uploader to `MediaLibrary.tsx`: uploads to storage, creates `media_assets` rows (url, alt, caption, title, folder, filename).
- Migrate all 324 existing car images + showroom + gallery images into the Media Library with generated alt text (e.g. "Rolls-Royce Cullinan Black Badge 2021 — front three-quarter"), deduplicated so each file exists once.

## Phase 2 — Vehicles fully in the CMS

- Reconcile the 24 seeded vehicle rows against `src/data/cars.ts`; add any missing, correct titles/brands.
- Populate every vehicle from code: full specs, description, price, mileage, fuel, transmission, colours, engine, horsepower, `image` (hero) + `gallery` (ordered, correct first image), `video_url`, featured / new_arrival / sold / availability, SEO fields.
- Gallery values reference the Media Library URLs from Phase 1 (upload once, reuse).

## Phase 3 — Brands relational

- Ensure all brands imported with logos (from media), country, description, SEO, hero image.
- Brand → vehicles already joins by `brand_slug`; verify counts are live. Brand SEO + brand page content pulled from CMS.

## Phase 4 — Rewire the public site to the CMS

- `inventory.tsx`: fetch `getPublicVehicles`; build filters (brand, body type, fuel, price) from CMS data; counts computed live. Remove `@/data/cars` import.
- `cars.$slug.tsx`: fetch a new `getPublicVehicle(slug)` returning specs, gallery, video, SEO, FAQs, and related vehicles (same brand / body type). Loader-driven `head()` for per-vehicle SEO + OG image.
- `index.tsx`: featured inventory, new arrivals, featured vehicle, and the feed all pull from `getPublicVehicles`; brand section already CMS-driven.
- Keep `mapDbVehicle` as the single DB→Car adapter so `CarCard` stays unchanged.

## Phase 5 — SEO, FAQs, media relationships, cleanup

- Per-vehicle SEO (meta title/description, slug, H1, OG image) surfaced in `head()`; FAQs attached per vehicle group and rendered on detail pages.
- Confirm "update alt text / image in Media Library updates everywhere": public reads resolve image URLs live, so replacing a media asset's URL/alt propagates.
- Once every public page reads the CMS and parity is verified against the current live site, delete `src/data/cars.ts` and its bundled `src/assets/cars/*` imports so nothing client-managed remains hardcoded.

## Sequencing

Phase 1 → 2 first (images + vehicles are the foundation and the biggest chunk), then Phase 4 rewiring so you can see the live site running off the CMS, then 3 and 5. I'll verify each phase against the current site (screenshots) before moving on, and won't delete `cars.ts` until parity is confirmed.

## Technical notes

- New public fetcher `getPublicVehicle(slug)` in `public.functions.ts` (specs, gallery, related, FAQs, SEO).
- Bulk image upload + row seeding done from the sandbox (script), not by hand.
- `related vehicles` and FAQ grouping stored as references per the existing relational plan (`.lovable/plan.md`).
- No destructive schema changes needed for image/gallery/SEO (existing columns cover them); a small migration only if we add a vehicle↔FAQ or related-vehicles link table.
