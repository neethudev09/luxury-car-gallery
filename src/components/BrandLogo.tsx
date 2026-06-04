import ferrari from "@/assets/brands/ferrari.png.asset.json";
import lamborghini from "@/assets/brands/lamborghini.png.asset.json";
import porsche from "@/assets/brands/porsche.png.asset.json";
import rollsRoyce from "@/assets/brands/rolls-royce.png.asset.json";
import bentley from "@/assets/brands/bentley.png.asset.json";
import bmw from "@/assets/brands/bmw.png.asset.json";
import mercedes from "@/assets/brands/mercedes-benz.png.asset.json";
import mclaren from "@/assets/brands/mclaren.png.asset.json";
import astonMartin from "@/assets/brands/aston-martin.png.asset.json";
import audi from "@/assets/brands/audi.png.asset.json";
import rangeRover from "@/assets/brands/range-rover.png.asset.json";

/** Real brand logos for each marque, keyed by slug. */
const logos: Record<string, { url: string }> = {
  ferrari,
  lamborghini,
  porsche,
  "rolls-royce": rollsRoyce,
  bentley,
  bmw,
  "mercedes-benz": mercedes,
  mclaren,
  "aston-martin": astonMartin,
  audi,
  "range-rover": rangeRover,
};

export function BrandLogo({ slug, className }: { slug: string; className?: string }) {
  const logo = logos[slug];
  if (!logo) return null;
  return (
    <img
      src={logo.url}
      alt={`${slug} logo`}
      loading="lazy"
      className={`${className ?? ""} object-contain`}
    />
  );
}
