import { supabase } from "@/integrations/supabase/client";

const MEDIA_MARKER = "/storage/v1/object/public/media/";

/**
 * Horizontally flips (mirrors) an image.
 *
 * When the image already lives in our `media` storage bucket the flipped result
 * OVERWRITES the original file at the same path. This keeps the public URL
 * identical, so every vehicle gallery / brand / page that references it shows
 * the flipped photo immediately — no dangling old copies. For external URLs it
 * uploads a brand-new file and returns that URL instead.
 *
 * Runs entirely in the browser using a canvas, so it works on any
 * CORS-enabled image URL.
 */
export async function flipImageHorizontally(src: string): Promise<string> {
  const img = await loadImage(src);

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.92),
  );
  if (!blob) throw new Error("Could not process image (the browser blocked reading it)");

  const existingPath = getMediaPath(src);

  if (existingPath) {
    // Overwrite the original file in place so the URL — and every reference to
    // it — updates. upsert:true replaces the object and purges the CDN cache.
    const { error } = await supabase.storage
      .from("media")
      .upload(existingPath, blob, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });
    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from("media").getPublicUrl(existingPath);
    return data.publicUrl;
  }

  // External image — upload a fresh copy.
  const path = `uploads/flipped-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, blob, { cacheControl: "3600", upsert: false, contentType: "image/jpeg" });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

/** Returns the object path inside the `media` bucket, or null if not ours. */
function getMediaPath(url: string): string | null {
  const clean = url.split("?")[0];
  const idx = clean.indexOf(MEDIA_MARKER);
  if (idx === -1) return null;
  const path = clean.slice(idx + MEDIA_MARKER.length);
  return path || null;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image (CORS or missing file)"));
    // Cache-bust the source read so we flip the freshest version, not a stale
    // cached copy after a previous flip.
    img.src = src.includes("?") ? `${src}&cb=${Date.now()}` : `${src}?cb=${Date.now()}`;
  });
}
