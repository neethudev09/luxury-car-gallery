import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const KEY = "cgd-compare";
const SAVE_KEY = "cgd-saved";
const MAX = 4;

interface Store {
  compare: string[];
  saved: string[];
  toggleCompare: (slug: string) => void;
  toggleSaved: (slug: string) => void;
  clearCompare: () => void;
  isCompared: (slug: string) => boolean;
  isSaved: (slug: string) => boolean;
}

const CompareContext = createContext<Store | null>(null);

function read(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compare, setCompare] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setCompare(read(KEY));
    setSaved(read(SAVE_KEY));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(compare));
  }, [compare]);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
  }, [saved]);

  const toggleCompare = (slug: string) =>
    setCompare((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length >= MAX ? prev : [...prev, slug],
    );
  const toggleSaved = (slug: string) =>
    setSaved((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const value: Store = {
    compare,
    saved,
    toggleCompare,
    toggleSaved,
    clearCompare: () => setCompare([]),
    isCompared: (slug) => compare.includes(slug),
    isSaved: (slug) => saved.includes(slug),
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

export const MAX_COMPARE = MAX;
