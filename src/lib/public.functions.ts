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

export const getPublicPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("slug,title,excerpt,category,cover_image,author,published_at,seo_title,meta_description")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return { posts: data ?? [] };
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
