import { supabase } from "@/integrations/supabase/client";

/**
 * Horizontally flips (mirrors) an image and uploads the result to the public
 * `media` storage bucket. Returns the new public URL.
 *
 * Runs entirely in the browser using a canvas, so it works on any
 * publicly-served image URL (CORS-enabled). Used to correct a car photo that
 * faces the wrong way without needing a replacement shot.
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
  if (!blob) throw new Error("Could not process image");

  const path = `uploads/flipped-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const { error } = await supabase.storage
    .from("media")
    .upload(path, blob, { cacheControl: "31536000", upsert: false, contentType: "image/jpeg" });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image (CORS or missing file)"));
    img.src = src;
  });
}
