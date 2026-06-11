import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public, read-only CMS data for the live website.
// Uses the service-role client (server-only) but only ever returns published,
// non-sensitive content with explicit column selection.

export const getPublicBrands = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("brands")
    .select("name,slug,logo,hero_image,country,available,sold,featured,seo_title,meta_description")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  return { brands: data ?? [] };
});

export const getPublicVehicles = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("vehicles")
    .select(
      "slug,title,brand,brand_slug,model,year,price,mileage,fuel,transmission,body_type,exterior_colour,interior_colour,image,gallery,featured,new_arrival,sold,availability,seo_title,meta_description",
    )
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return { vehicles: data ?? [] };
});

// Brands with live "available" counts computed directly from the inventory.
// A vehicle counts as available when published, not sold and not reserved.
export const getBrandsWithCounts = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const [{ data: brands }, { data: vehicles }] = await Promise.all([
    supabaseAdmin
      .from("brands")
      .select("name,slug,logo,logo_section,logo_light,country,featured,sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabaseAdmin
      .from("vehicles")
      .select("brand_slug,sold,availability,published")
      .eq("published", true),
  ]);

  const counts = new Map<string, number>();
  for (const v of vehicles ?? []) {
    const slug = (v.brand_slug ?? "").toLowerCase();
    if (!slug) continue;
    const avail = (v.availability ?? "available").toLowerCase();
    if (!v.sold && avail === "available") {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  return {
    brands: (brands ?? []).map((b) => ({
      name: b.name,
      slug: b.slug,
      // Prefer the dedicated brand-section logo, then a light logo, then standard.
      logo: b.logo_section || b.logo_light || b.logo || null,
      country: b.country,
      featured: b.featured,
      available: counts.get((b.slug ?? "").toLowerCase()) ?? 0,
    })),
  };
});

// A single brand plus its published inventory, filtered straight from the CMS.
export const getPublicBrandPage = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: brand } = await supabaseAdmin
      .from("brands")
      .select("name,slug,logo,hero_image,country,description,seo_title,meta_description")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (!brand) return { brand: null, vehicles: [], available: 0 };

    const { data: vehicles } = await supabaseAdmin
      .from("vehicles")
      .select(
        "slug,title,brand,brand_slug,model,year,price,mileage,fuel,transmission,body_type,exterior_colour,interior_colour,engine,horsepower,image,gallery,featured,new_arrival,sold,availability",
      )
      .eq("brand_slug", data.slug)
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    const available = (vehicles ?? []).filter(
      (v) => !v.sold && (v.availability ?? "available").toLowerCase() === "available",
    ).length;

    return { brand, vehicles: vehicles ?? [], available };
  });


export const getPublicPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("slug,title,excerpt,category,cover_image,author,published_at,seo_title,meta_description")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return { posts: data ?? [] };
});

export const getPublicPost = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: post } = await supabaseAdmin
      .from("blog_posts")
      .select(
        "slug,title,excerpt,content,category,tags,cover_image,author,published_at,seo_title,meta_description,og_image",
      )
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    // Lightweight related list for the footer of the article.
    const { data: related } = await supabaseAdmin
      .from("blog_posts")
      .select("slug,title,excerpt,category,cover_image,author,published_at")
      .eq("status", "published")
      .neq("slug", data.slug)
      .order("published_at", { ascending: false })
      .limit(3);
    return { post: post ?? null, related: related ?? [] };
  });


export const getPublicFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("faqs")
    .select("question,answer,category,sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return { faqs: data ?? [] };
});

export const getPublicGalleries = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("galleries")
    .select("name,slug,description,items")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return { galleries: data ?? [] };
});

export const getPublicPage = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: page } = await supabaseAdmin
      .from("pages")
      .select("slug,title,content,seo_title,meta_description,og_image")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return { page: page ?? null };
  });

export const getPublicSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("site_settings").select("key,value");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map: Record<string, any> = {};
  (data ?? []).forEach((r) => {
    map[r.key as string] = r.value ?? {};
  });
  return { settings: map };
});

// Google / marketing tool tags stored in site_settings (key "integrations").
// Injected into the site <head> so they load on every public page.
export const getPublicIntegrations = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "integrations")
    .maybeSingle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = (data?.value ?? {}) as Record<string, any>;
  const str = (x: unknown) => (typeof x === "string" ? x.trim() : "");
  return {
    ga4_id: str(v.ga4_id),
    gtm_id: str(v.gtm_id),
    google_site_verification: str(v.google_site_verification),
    custom_head_js: str(v.custom_head_js),
  };
});

// Public enquiry submission from the live website (contact forms, pullout, etc.)
const enquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Valid email required").max(200),
  phone: z.string().min(5, "Phone is required").max(40),
  interest: z.string().max(60).optional().or(z.literal("")),
  make: z.string().max(120).optional().or(z.literal("")),
  model: z.string().max(120).optional().or(z.literal("")),
  message: z.string().max(4000).optional().or(z.literal("")),
  source: z.string().max(40).default("website"),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => enquirySchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const vehicle_title = [data.make, data.model].filter(Boolean).join(" ").trim();
    const parts: string[] = [];
    if (data.interest) parts.push(`Interest: ${data.interest}`);
    if (vehicle_title) parts.push(`Vehicle: ${vehicle_title}`);
    if (data.message) parts.push(data.message);
    const { error } = await supabaseAdmin.from("enquiries").insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      message: parts.join("\n") || null,
      source: data.source || "website",
      vehicle_title: vehicle_title || null,
      status: "new",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });



// Resolve the relational menu stored in site_settings (key "menu") into
// concrete { label, url } links using live content. Renaming a brand or
// changing a page slug updates these links automatically.
export const getPublicMenu = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { refUrl } = await import("@/lib/refs");

  const [{ data: settingRow }, pages, vehicles, brands, posts, galleries, faqs] =
    await Promise.all([
      supabaseAdmin.from("site_settings").select("value").eq("key", "menu").maybeSingle(),
      supabaseAdmin.from("pages").select("id,title,slug").eq("status", "published"),
      supabaseAdmin.from("vehicles").select("id,title,slug").eq("published", true),
      supabaseAdmin.from("brands").select("id,name,slug").eq("published", true),
      supabaseAdmin.from("blog_posts").select("id,title,slug").eq("status", "published"),
      supabaseAdmin.from("galleries").select("id,name,slug").eq("published", true),
      supabaseAdmin.from("faqs").select("id,question").eq("published", true),
    ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lookup = new Map<string, { label: string; slug: string; type: string }>();
  const add = (type: string, rows: any[] | null, labelKey: string) =>
    (rows ?? []).forEach((r) =>
      lookup.set(`${type}:${r.id}`, { label: r[labelKey], slug: r.slug ?? r.id, type }),
    );
  add("page", pages.data, "title");
  add("vehicle", vehicles.data, "title");
  add("brand", brands.data, "name");
  add("post", posts.data, "title");
  add("gallery", galleries.data, "name");
  add("faq", faqs.data, "question");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolveList = (list: any): { label: string; url: string }[] => {
    if (!Array.isArray(list)) return [];
    const out: { label: string; url: string }[] = [];
    for (const ref of list) {
      if (!ref || typeof ref !== "object") continue;
      if (ref.type === "custom") {
        if (ref.url && ref.label) out.push({ label: ref.label, url: ref.url });
        continue;
      }
      const item = lookup.get(`${ref.type}:${ref.id}`);
      if (item) out.push({ label: item.label, url: refUrl(item.type as never, item.slug) });
    }
    return out;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = (settingRow?.value ?? {}) as Record<string, any>;
  return {
    header: resolveList(value.header),
    footer_explore: resolveList(value.footer_explore),
  };
});
