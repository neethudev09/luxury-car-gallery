// Shared, client-safe helpers for the relational CMS.
// A "content reference" points at an existing CMS record by type + id.
// URLs and labels are DERIVED from the referenced content so that renaming a
// brand or changing a page slug updates every link automatically.

export type RefType =
  | "page"
  | "vehicle"
  | "brand"
  | "post"
  | "gallery"
  | "faq"
  | "custom";

export interface ContentRef {
  type: RefType;
  /** id of the referenced record (omitted for custom links) */
  id?: string;
  /** custom links only */
  label?: string;
  url?: string;
}

/** A lightweight, pickable record returned by getContentIndex. */
export interface IndexItem {
  id: string;
  type: RefType;
  label: string;
  slug: string;
  status?: string;
}

export interface ResolvedRef {
  label: string;
  url: string;
  type: RefType;
  /** false when the referenced record no longer exists */
  valid: boolean;
}

export const REF_TYPES: { type: RefType; label: string }[] = [
  { type: "page", label: "Page" },
  { type: "vehicle", label: "Vehicle" },
  { type: "brand", label: "Brand" },
  { type: "post", label: "Blog Post" },
  { type: "gallery", label: "Gallery" },
  { type: "faq", label: "FAQ Group" },
];

/** Build the canonical URL for a referenced record from its type + slug. */
export function refUrl(type: RefType, slug: string): string {
  switch (type) {
    case "vehicle":
      return `/cars/${slug}`;
    case "brand":
      return `/brands/${slug}`;
    case "post":
      return `/blog/${slug}`;
    case "gallery":
      return "/media";
    case "faq":
      return "/faqs";
    case "page":
      return `/${slug}`;
    default:
      return "/";
  }
}

/** Resolve a stored reference against the current content index. */
export function resolveRef(ref: ContentRef, index: IndexItem[]): ResolvedRef {
  if (ref.type === "custom") {
    return {
      label: ref.label ?? ref.url ?? "Link",
      url: ref.url ?? "#",
      type: "custom",
      valid: Boolean(ref.url),
    };
  }
  const item = index.find((i) => i.type === ref.type && i.id === ref.id);
  if (!item) {
    return { label: ref.label ?? "Removed item", url: "#", type: ref.type, valid: false };
  }
  return {
    label: item.label,
    url: refUrl(item.type, item.slug),
    type: item.type,
    valid: true,
  };
}
