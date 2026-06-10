// Helpers for handling media items that can be either an image URL or a video
// (currently YouTube). Used by the gallery editor and any public renderer.

export type MediaKind = "image" | "video";

/** Extract a YouTube video id from common URL shapes, or null if not YouTube. */
export function youtubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export function isYoutube(url: string): boolean {
  return youtubeId(url) !== null;
}

/** Best-guess media kind from a URL. */
export function detectKind(url: string): MediaKind {
  return isYoutube(url) ? "video" : "image";
}

/** Thumbnail image for a media item (YouTube poster frame, or the image itself). */
export function mediaThumb(url: string): string {
  const id = youtubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : url;
}

/** Embeddable player URL for a YouTube video, or null for non-video items. */
export function youtubeEmbed(url: string): string | null {
  const id = youtubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
