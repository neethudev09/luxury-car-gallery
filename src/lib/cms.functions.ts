import { createServerFn } from "@/lib/server-compat";
import { z } from "zod";
import { requireSupabaseAuth } from "@/lib/server-compat";

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
  logo_light: optText(),
  logo_dark: optText(),
  logo_menu: optText(),
  logo_section: optText(),
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
    const cleanMediaUrl = (value: string | null | undefined) => {
      const trimmed = (value ?? "").trim();
      if (!trimmed.includes("/storage/v1/object/public/media/")) return trimmed;
      return trimmed.split("?")[0];
    };
    const replaceString = (value: unknown, oldValues: Set<string>, next: string) =>
      typeof value === "string" && oldValues.has(cleanMediaUrl(value)) ? next : value;
    const replaceJson = (value: unknown, oldValues: Set<string>, next: string): unknown => {
      if (typeof value === "string") return replaceString(value, oldValues, next);
      if (Array.isArray(value)) return value.map((item) => replaceJson(item, oldValues, next));
      if (value && typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(([key, item]) => [
            key,
            replaceJson(item, oldValues, next),
          ]),
        );
      }
      return value;
    };
    const sameJson = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

    const { id, ...fields } = data;
    const normalizedFields = { ...fields, url: cleanMediaUrl(fields.url) };
    let previousUrl: string | null = null;
    if (id) {
      const { data: existing, error: existingError } = await context.supabase
        .from("media_assets")
        .select("url")
        .eq("id", id)
        .maybeSingle();
      if (existingError) throw new Error(existingError.message);
      previousUrl = existing?.url ?? null;
    }

    const payload = { ...fields, uploaded_by: context.userId };
    const q = id
      ? context.supabase.from("media_assets").update(normalizedFields).eq("id", id).select("id").single()
      : context.supabase.from("media_assets").insert({ ...payload, url: normalizedFields.url }).select("id").single();
    const { data: row, error } = await q;
    if (error) throw new Error(error.message);

    const oldClean = cleanMediaUrl(previousUrl);
    const nextUrl = normalizedFields.url;
    if (id && oldClean && nextUrl && oldClean !== nextUrl) {
      const oldValues = new Set([oldClean]);
      if (previousUrl) oldValues.add(previousUrl.trim());

      const { data: brands, error: brandsError } = await context.supabase
        .from("brands")
        .select("id,logo,logo_light,logo_dark,logo_menu,logo_section,hero_image");
      if (brandsError) throw new Error(brandsError.message);
      for (const brand of brands ?? []) {
        const update: Record<string, unknown> = {};
        for (const field of ["logo", "logo_light", "logo_dark", "logo_menu", "logo_section", "hero_image"] as const) {
          const replaced = replaceString(brand[field], oldValues, nextUrl);
          if (replaced !== brand[field]) update[field] = replaced;
        }
        if (Object.keys(update).length) {
          const { error: updateError } = await context.supabase.from("brands").update(update).eq("id", brand.id);
          if (updateError) throw new Error(updateError.message);
        }
      }

      const { data: vehicles, error: vehiclesError } = await context.supabase
        .from("vehicles")
        .select("id,image,gallery,interior_gallery,exterior_gallery,detail_gallery,wheel_gallery,og_image");
      if (vehiclesError) throw new Error(vehiclesError.message);
      for (const vehicle of vehicles ?? []) {
        const update: Record<string, unknown> = {};
        for (const field of ["image", "og_image"] as const) {
          const replaced = replaceString(vehicle[field], oldValues, nextUrl);
          if (replaced !== vehicle[field]) update[field] = replaced;
        }
        for (const field of ["gallery", "interior_gallery", "exterior_gallery", "detail_gallery", "wheel_gallery"] as const) {
          const replaced = replaceJson(vehicle[field], oldValues, nextUrl);
          if (!sameJson(replaced, vehicle[field])) update[field] = replaced;
        }
        if (Object.keys(update).length) {
          const { error: updateError } = await context.supabase.from("vehicles").update(update).eq("id", vehicle.id);
          if (updateError) throw new Error(updateError.message);
        }
      }

      const { data: posts, error: postsError } = await context.supabase
        .from("blog_posts")
        .select("id,cover_image,og_image");
      if (postsError) throw new Error(postsError.message);
      for (const post of posts ?? []) {
        const update: Record<string, unknown> = {};
        for (const field of ["cover_image", "og_image"] as const) {
          const replaced = replaceString(post[field], oldValues, nextUrl);
          if (replaced !== post[field]) update[field] = replaced;
        }
        if (Object.keys(update).length) {
          const { error: updateError } = await context.supabase.from("blog_posts").update(update).eq("id", post.id);
          if (updateError) throw new Error(updateError.message);
        }
      }

      const { data: pages, error: pagesError } = await context.supabase.from("pages").select("id,og_image");
      if (pagesError) throw new Error(pagesError.message);
      for (const page of pages ?? []) {
        const replaced = replaceString(page.og_image, oldValues, nextUrl);
        if (replaced !== page.og_image) {
          const { error: updateError } = await context.supabase.from("pages").update({ og_image: replaced }).eq("id", page.id);
          if (updateError) throw new Error(updateError.message);
        }
      }

      const { data: galleries, error: galleriesError } = await context.supabase.from("galleries").select("id,items");
      if (galleriesError) throw new Error(galleriesError.message);
      for (const gallery of galleries ?? []) {
        const replaced = replaceJson(gallery.items, oldValues, nextUrl);
        if (!sameJson(replaced, gallery.items)) {
          const { error: updateError } = await context.supabase.from("galleries").update({ items: replaced }).eq("id", gallery.id);
          if (updateError) throw new Error(updateError.message);
        }
      }

      const { data: settings, error: settingsError } = await context.supabase.from("site_settings").select("key,value");
      if (settingsError) throw new Error(settingsError.message);
      for (const setting of settings ?? []) {
        const replaced = replaceJson(setting.value, oldValues, nextUrl);
        if (!sameJson(replaced, setting.value)) {
          const { error: updateError } = await context.supabase
            .from("site_settings")
            .update({ value: replaced })
            .eq("key", setting.key);
          if (updateError) throw new Error(updateError.message);
        }
      }
    }
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
  type: z.enum(["image", "video"]).optional().default("image"),
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

export const createUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; password: string; displayName?: string; role: string }) =>
    z
      .object({
        email: z.string().email().max(255),
        password: z.string().min(6).max(72),
        displayName: z.string().max(120).optional(),
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

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { display_name: data.displayName ?? data.email.split("@")[0] },
    });
    if (error) throw new Error(error.message);
    const newId = created.user?.id;
    if (!newId) throw new Error("User creation failed");

    // handle_new_user trigger creates profile + default role; override role
    await supabaseAdmin.from("user_roles").delete().eq("user_id", newId);
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newId, role: data.role as never });
    if (roleErr) throw new Error(roleErr.message);
    return { ok: true, id: newId };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) =>
    z.object({ userId: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin");
    if ((roles ?? []).length === 0) throw new Error("Only administrators can manage users");
    if (data.userId === context.userId) throw new Error("You cannot delete your own account");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
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

// ============================================================
// CONTENT INDEX (powers relational pickers across the CMS)
// Returns lightweight, linkable records for every content type.
// ============================================================
export const getContentIndex = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [pages, vehicles, brands, posts, galleries, faqs] = await Promise.all([
      supabase.from("pages").select("id,title,slug,status").order("title"),
      supabase.from("vehicles").select("id,title,slug,sold,availability").order("title"),
      supabase.from("brands").select("id,name,slug").order("name"),
      supabase.from("blog_posts").select("id,title,slug,status").order("title"),
      supabase.from("galleries").select("id,name,slug").order("name"),
      supabase.from("faqs").select("id,question,category").order("category"),
    ]);

    const items: {
      id: string;
      type: string;
      label: string;
      slug: string;
      status?: string;
    }[] = [];

    (pages.data ?? []).forEach((p) =>
      items.push({ id: p.id, type: "page", label: p.title, slug: p.slug, status: p.status }),
    );
    (vehicles.data ?? []).forEach((v) =>
      items.push({
        id: v.id,
        type: "vehicle",
        label: v.title,
        slug: v.slug,
        status: v.sold ? "sold" : v.availability ?? "available",
      }),
    );
    (brands.data ?? []).forEach((b) =>
      items.push({ id: b.id, type: "brand", label: b.name, slug: b.slug }),
    );
    (posts.data ?? []).forEach((p) =>
      items.push({ id: p.id, type: "post", label: p.title, slug: p.slug, status: p.status }),
    );
    (galleries.data ?? []).forEach((g) =>
      items.push({ id: g.id, type: "gallery", label: g.name, slug: g.slug }),
    );
    (faqs.data ?? []).forEach((f) =>
      items.push({
        id: f.id,
        type: "faq",
        label: f.question,
        slug: f.id,
        status: f.category ?? undefined,
      }),
    );

    return { items };
  });

// ============================================================
// HEALTH CHECK (admin dashboard diagnostics)
// ============================================================
export const getHealthCheck = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const check = async <T>(fn: () => Promise<T>): Promise<{ ok: boolean; error?: string; value?: T }> => {
      try {
        const value = await fn();
        return { ok: true, value };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    };

    // Database connectivity + counts
    const vehicles = await check(async () => {
      const { count, error } = await supabase
        .from("vehicles")
        .select("*", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return count ?? 0;
    });
    const brands = await check(async () => {
      const { count, error } = await supabase
        .from("brands")
        .select("*", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return count ?? 0;
    });
    const images = await check(async () => {
      const { count, error } = await supabase
        .from("media_assets")
        .select("*", { count: "exact", head: true });
      if (error) throw new Error(error.message);
      return count ?? 0;
    });

    // Storage connectivity + media bucket
    const bucket = await check(async () => {
      const { data, error } = await supabase.storage.getBucket("media");
      if (error) throw new Error(error.message);
      return { exists: !!data, public: data?.public ?? false };
    });

    const dbConnected = vehicles.ok && brands.ok && images.ok;
    const storageConnected = bucket.ok;

    return {
      checkedAt: new Date().toISOString(),
      database: { ok: dbConnected, error: vehicles.error ?? brands.error ?? images.error },
      storage: { ok: storageConnected, error: bucket.error },
      mediaBucket: {
        ok: bucket.ok && !!bucket.value?.exists,
        public: bucket.value?.public ?? false,
        error: bucket.error,
      },
      auth: { ok: !!userId, userId },
      counts: {
        vehicles: vehicles.value ?? null,
        brands: brands.value ?? null,
        images: images.value ?? null,
      },
      deployment: {
        env: import.meta.env.MODE,
        builtAt: import.meta.env.VITE_BUILD_TIME ?? null,
      },
    };
  });
