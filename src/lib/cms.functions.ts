import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ============================================================
// Helpers
// ============================================================
const slug = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens");
const optText = (max = 2000) => z.string().max(max).nullable().optional();

// ============================================================
// BRANDS
// ============================================================
export const listBrands = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("brands")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return { brands: data ?? [] };
  });

const brandSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(120),
  slug,
  logo: optText(),
  hero_image: optText(),
  description: optText(20000),
  country: optText(120),
  sort_order: z.number().int().min(0).max(100000).default(0),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  seo_title: optText(200),
  meta_description: optText(400),
});

export const saveBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => brandSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { id, ...fields } = data;
    const q = id
      ? context.supabase.from("brands").update(fields).eq("id", id).select("id").single()
      : context.supabase.from("brands").insert(fields).select("id").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("brands").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// MEDIA LIBRARY
// ============================================================
export const listMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { media: data ?? [] };
  });

const mediaSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1).max(2000),
  alt: optText(300),
  title: optText(200),
  caption: optText(500),
  folder: z.string().max(80).default("general"),
});

export const saveMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => mediaSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { id, ...fields } = data;
    const payload = { ...fields, uploaded_by: context.userId };
    const q = id
      ? context.supabase.from("media_assets").update(fields).eq("id", id).select("id").single()
      : context.supabase.from("media_assets").insert(payload).select("id").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("media_assets").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// GALLERIES
// ============================================================
export const listGalleries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("galleries")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { galleries: data ?? [] };
  });

const galleryItem = z.object({
  url: z.string().max(2000),
  alt: z.string().max(300).optional().default(""),
});
const gallerySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(120),
  slug,
  description: optText(2000),
  published: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(100000).default(0),
  items: z.array(galleryItem).max(500).default([]),
});

export const saveGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => gallerySchema.parse(d))
  .handler(async ({ context, data }) => {
    const { id, ...fields } = data;
    const q = id
      ? context.supabase.from("galleries").update(fields).eq("id", id).select("id").single()
      : context.supabase.from("galleries").insert(fields).select("id").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteGallery = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("galleries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// BLOG POSTS
// ============================================================
export const listPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { posts: data ?? [] };
  });

const postSchema = z.object({
  id: z.string().optional(),
  slug,
  title: z.string().min(1).max(200),
  excerpt: optText(600),
  content: optText(100000),
  cover_image: optText(),
  author: optText(120),
  category: optText(120),
  tags: z.array(z.string().max(60)).max(30).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  seo_title: optText(200),
  meta_description: optText(400),
  og_image: optText(),
});

export const savePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => postSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { id, ...fields } = data;
    const payload = {
      ...fields,
      published_at: fields.status === "published" ? new Date().toISOString() : null,
    };
    const q = id
      ? context.supabase.from("blog_posts").update(payload).eq("id", id).select("id").single()
      : context.supabase.from("blog_posts").insert(payload).select("id").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// FAQS
// ============================================================
export const listFaqs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return { faqs: data ?? [] };
  });

const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(5000),
  category: optText(120),
  sort_order: z.number().int().min(0).max(100000).default(0),
  published: z.boolean().default(true),
});

export const saveFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => faqSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { id, ...fields } = data;
    const q = id
      ? context.supabase.from("faqs").update(fields).eq("id", id).select("id").single()
      : context.supabase.from("faqs").insert(fields).select("id").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("faqs").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// PAGES
// ============================================================
export const listPages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("pages")
      .select("*")
      .order("title", { ascending: true });
    if (error) throw new Error(error.message);
    return { pages: data ?? [] };
  });

const pageSchema = z.object({
  id: z.string().optional(),
  slug,
  title: z.string().min(1).max(200),
  content: optText(200000),
  status: z.enum(["draft", "published"]).default("published"),
  seo_title: optText(200),
  meta_description: optText(400),
  og_image: optText(),
});

export const savePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => pageSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { id, ...fields } = data;
    const q = id
      ? context.supabase.from("pages").update(fields).eq("id", id).select("id").single()
      : context.supabase.from("pages").insert(fields).select("id").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deletePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("pages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// ENQUIRIES
// ============================================================
export const listEnquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { enquiries: data ?? [] };
  });

export const updateEnquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: string }) =>
    z.object({ id: z.string().min(1), status: z.enum(["new", "read", "archived"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("enquiries")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteEnquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("enquiries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// SELL SUBMISSIONS
// ============================================================
export const listSellSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("sell_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { submissions: data ?? [] };
  });

export const updateSellStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: string }) =>
    z
      .object({ id: z.string().min(1), status: z.enum(["new", "contacted", "closed", "archived"]) })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("sell_submissions")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSellSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("sell_submissions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// SITE SETTINGS (homepage, footer, menus, seo defaults)
// ============================================================
export const getSetting = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { key: string }) => z.object({ key: z.string().min(1).max(80) }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("site_settings")
      .select("value")
      .eq("key", data.key)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { value: row?.value ?? null };
  });

export const saveSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { key: string; value: unknown }) =>
    z.object({ key: z.string().min(1).max(80), value: z.any() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("site_settings")
      .upsert({ key: data.key, value: data.value }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// USERS & ROLES (admin only)
// ============================================================
export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("user_id, role")
      .eq("user_id", context.userId)
      .eq("role", "admin");
    const isAdmin = (roles ?? []).length > 0;
    if (!isAdmin) throw new Error("Only administrators can manage users");

    const { data: profiles, error } = await context.supabase
      .from("profiles")
      .select("id, email, display_name, created_at");
    if (error) throw new Error(error.message);
    const { data: allRoles } = await context.supabase.from("user_roles").select("user_id, role");
    const roleMap = new Map<string, string[]>();
    (allRoles ?? []).forEach((r) => {
      const list = roleMap.get(r.user_id) ?? [];
      list.push(r.role as string);
      roleMap.set(r.user_id, list);
    });
    return {
      users: (profiles ?? []).map((p) => ({ ...p, roles: roleMap.get(p.id) ?? [] })),
    };
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; role: string }) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["admin", "manager", "editor", "user"]),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin");
    if ((roles ?? []).length === 0) throw new Error("Only administrators can manage users");

    const { error: delErr } = await context.supabase
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId);
    if (delErr) throw new Error(delErr.message);
    const { error } = await context.supabase
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role as never });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ============================================================
// DASHBOARD STATS
// ============================================================
export const getDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [{ data: vehicles }, { data: enquiries }, { data: posts }] = await Promise.all([
      supabase
        .from("vehicles")
        .select("id, title, brand, sold, featured, new_arrival, availability, seo_title, meta_description, image"),
      supabase
        .from("enquiries")
        .select("id, name, email, message, status, created_at, vehicle_title")
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("blog_posts")
        .select("id, title, slug, status, updated_at")
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);

    const v = vehicles ?? [];
    return {
      vehicles: {
        total: v.length,
        available: v.filter((x) => !x.sold && x.availability === "available").length,
        sold: v.filter((x) => x.sold).length,
        featured: v.filter((x) => x.featured).length,
        newArrivals: v.filter((x) => x.new_arrival).length,
        missingSeoTitle: v.filter((x) => !x.seo_title).length,
        missingMetaDescription: v.filter((x) => !x.meta_description).length,
        missingImage: v.filter((x) => !x.image).length,
      },
      latestEnquiries: enquiries ?? [],
      recentPosts: posts ?? [],
    };
  });
