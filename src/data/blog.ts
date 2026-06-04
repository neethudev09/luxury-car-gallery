import showroom from "@/assets/showroom-interior.jpg";
import carFerrari from "@/assets/car-ferrari.jpg";
import carRolls from "@/assets/car-rollsroyce.jpg";

export interface Post {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
}

export const blogCategories = [
  "Luxury Cars",
  "Supercars",
  "Buying Guides",
  "Market News",
  "Dubai Automotive News",
];

export const posts: Post[] = [
  {
    slug: "buying-a-supercar-in-dubai-2024",
    title: "The Complete Guide to Buying a Supercar in Dubai",
    category: "Buying Guides",
    excerpt:
      "From registration to insurance and import duties — everything you need to know before acquiring your dream supercar in the UAE.",
    date: "May 28, 2024",
    readTime: "8 min read",
    image: carFerrari,
  },
  {
    slug: "rolls-royce-bespoke-commissioning",
    title: "Inside Rolls-Royce Bespoke: Commissioning the Extraordinary",
    category: "Luxury Cars",
    excerpt:
      "A look at how the world's most discerning collectors personalise every detail of their Rolls-Royce motor cars.",
    date: "May 14, 2024",
    readTime: "6 min read",
    image: carRolls,
  },
  {
    slug: "dubai-luxury-car-market-2024",
    title: "Dubai Luxury Car Market: Trends Shaping 2024",
    category: "Market News",
    excerpt:
      "Demand for limited-production hypercars continues to surge across the Emirates. We break down the numbers.",
    date: "April 30, 2024",
    readTime: "5 min read",
    image: showroom,
  },
];
