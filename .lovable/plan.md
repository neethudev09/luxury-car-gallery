# Car Gallery Dubai — CMS & Backend Plan

This converts the site from hardcoded content (`src/data/*.ts`) to a fully database-driven, client-manageable CMS. It is a big build, so it ships in phases. Each phase is usable on its own and the public site keeps working throughout.

## Foundation (required first)

Enable **Lovable Cloud** — provides the PostgreSQL database, authentication, and the media storage bucket. Without it none of the CMS can persist data. This is non-negotiable for the feature.

Core pieces:
- Auth (email/password) with a `user_roles` table (`admin`, `manager`, `editor`) — roles in a separate table, never on profiles.
- A protected `/admin` area (route group) gated by login + role.
- Storage bucket `media` for the central media library.

## Phase 1 — Vehicle Inventory CMS (highest value)
- `vehicles` table with every field you listed (title, brand, model, year, price, mileage, transmission, fuel, body, colours, engine, hp, drive, availability, featured/new-arrival/sold toggles, description, specs JSON, features JSON, video URL, 360 sequence, SEO title/desc/slug, FAQs JSON).
- Admin list + add/edit form with image pickers and drag-drop galleries.
- Public pages (home featured, inventory, brand pages, sold, related, mega-menu counts) read from DB instead of `cars.ts`.

## Phase 2 — Media Library
- `media` table (title, filename, alt, caption, description, width/height, mime, usage refs) backed by the `media` storage bucket.
- Drag-drop + bulk upload, search/filter, automatic WebP generation + compression on upload, alt/caption/title editing, "where used" tracking, delete-unused.
- Reusable media picker component used by every other CMS section.

## Phase 3 — Vehicle Galleries
- Featured / main / interior / exterior / detail / wheels / 360 sequences per vehicle.
- Drag-drop ordering, bulk upload, alt editing, featured selection (built on the Phase 2 picker).

## Phase 4 — Pages, Homepage & Showroom CMS
- `pages` + `page_sections` (or structured JSON per page) for Home, Cars For Sale, Sell, Sold, Media, About, Showroom, Blog index, FAQ, Contact.
- Dedicated homepage editor for each section (hero images/video, CTAs, featured inventory, brand section, 360 showcase, showroom, sell, social, SEO content, blog feed, contact CTA).
- Editable H1/H2/text/buttons/images/galleries + SEO per page.

## Phase 5 — Blog CMS
- `blog_posts` (title, featured image, category, author, date, slug, SEO title/desc, rich content, FAQs).
- WordPress-style rich editor with image/gallery/link/button insertion.

## Phase 6 — Brands & FAQs
- `brands` (name, logo, hero, SEO content, meta, slug, FAQs); brand pages auto-pull matching vehicles.
- `faqs` table assignable to: site-wide, brand, vehicle, blog post, sell page.

## Phase 7 — Enquiries
- `enquiries` table (name, phone, email, vehicle, source page, date, status, type). Capture from all site forms + WhatsApp click logging.
- Dashboard list with status workflow (New → Contacted → In Progress → Sold → Closed).

## Phase 8 — SEO controls + Dashboard + Roles polish
- Editable SEO fields everywhere (meta title/desc, slug, H1, canonical, index/noindex, OG image, schema) wired into each route's `head()`.
- Admin dashboard: total/sold vehicles, latest enquiries, recent posts, featured vehicles, missing SEO/images, drafts, quick-add vehicle/blog.
- Finalise role permissions (Admin full; Manager = vehicles/blogs/enquiries/media; Editor = content/blog only).

## Technical notes
- Stack: TanStack Start + Lovable Cloud (Supabase). Data access via `createServerFn`; admin writes via authenticated server fns with RLS scoped by role; public reads via server fns.
- Every new public table gets explicit GRANTs + RLS in the same migration.
- Images: upload to `media` bucket, generate WebP + compressed variants, store metadata in `media` table.
- Migration of existing `cars.ts` / `blog.ts` / brand data into the DB as seed data so nothing is lost.
- Public routes keep SSR + per-route `head()` SEO; admin routes are client-gated under `_authenticated`.

## How I'll proceed
I'll start by enabling Cloud and building the Foundation + Phase 1 (auth, roles, vehicles CMS, and wiring the public car pages to the DB), since inventory is the core of the dealership. Then I'll continue phase by phase, checking in after each so you can review.

## Question before I start
Do you want me to **build it all phase-by-phase automatically** (I proceed through every phase, checking in between each), or **stop after Phase 1** (inventory CMS) so you can review the approach before I invest in the rest?