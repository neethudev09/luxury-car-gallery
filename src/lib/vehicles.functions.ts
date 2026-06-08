import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---- Role / current user ----
export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, display_name")
      .eq("id", userId)
      .maybeSingle();
    const roleList = (roles ?? []).map((r) => r.role as string);
    return {
      userId,
      roles: roleList,
      isStaff: roleList.includes("admin") || roleList.includes("manager"),
      email: profile?.email ?? null,
      displayName: profile?.display_name ?? null,
    };
  });

// ---- List vehicles (admin) ----
export const listVehiclesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("vehicles")
      .select(
        "id, slug, title, brand, model, year, price, sold, featured, new_arrival, published, availability, image, updated_at, sort_order",
      )
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { vehicles: data ?? [] };
  });

// ---- Get single vehicle ----
export const getVehicleAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: vehicle, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { vehicle };
  });

const galleryArray = z.array(z.string().max(2000)).max(200);

const vehicleSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens"),
  title: z.string().min(1).max(200),
  brand: z.string().min(1).max(100),
  brand_slug: z.string().min(1).max(100),
  model: z.string().max(100).nullable().optional(),
  year: z.number().int().min(1900).max(2100).nullable().optional(),
  price: z.number().min(0).max(100000000).nullable().optional(),
  mileage: z.number().int().min(0).max(10000000).nullable().optional(),
  transmission: z.string().max(60).nullable().optional(),
  fuel: z.string().max(60).nullable().optional(),
  body_type: z.string().max(60).nullable().optional(),
  exterior_colour: z.string().max(80).nullable().optional(),
  interior_colour: z.string().max(80).nullable().optional(),
  engine: z.string().max(120).nullable().optional(),
  horsepower: z.number().int().min(0).max(5000).nullable().optional(),
  description: z.string().max(20000).nullable().optional(),
  video_url: z.string().max(2000).nullable().optional(),
  image: z.string().max(2000).nullable().optional(),
  availability: z.string().max(40),
  featured: z.boolean(),
  new_arrival: z.boolean(),
  sold: z.boolean(),
  published: z.boolean(),
  sort_order: z.number().int().min(0).max(100000),
  gallery: galleryArray,
  interior_gallery: galleryArray,
  exterior_gallery: galleryArray,
  // SEO
  seo_title: z.string().max(200).nullable().optional(),
  meta_description: z.string().max(400).nullable().optional(),
  canonical_url: z.string().max(2000).nullable().optional(),
  og_image: z.string().max(2000).nullable().optional(),
  noindex: z.boolean(),
});

export const saveVehicle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => vehicleSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { id, ...fields } = data;
    if (id) {
      const { data: updated, error } = await supabase
        .from("vehicles")
        .update(fields)
        .eq("id", id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: updated.id };
    }
    const { data: inserted, error } = await supabase
      .from("vehicles")
      .insert(fields)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });

// ---- Quick toggle (sold / featured / published) ----
export const toggleVehicleFlag = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; field: string; value: boolean }) =>
    z
      .object({
        id: z.string().min(1),
        field: z.enum(["sold", "featured", "new_arrival", "published"]),
        value: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { error } = await supabase
      .from("vehicles")
      .update({ [data.field]: data.value })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteVehicle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { error } = await supabase.from("vehicles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
