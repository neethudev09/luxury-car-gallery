import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { GitCompare, X } from "lucide-react";
import { useCompare } from "@/lib/compare";
import { cars } from "@/data/cars";

export function CompareBar() {
  const { compare, toggleCompare, clearCompare } = useCompare();
  const items = compare.map((slug) => cars.find((c) => c.slug === slug)).filter(Boolean);

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed inset-x-0 bottom-14 z-40 px-4 pb-4"
        >
          <div className="glass-strong mx-auto flex max-w-5xl flex-wrap items-center gap-3 rounded-2xl border border-gold/20 p-3 shadow-luxury">
            <span className="flex items-center gap-2 px-2 text-xs uppercase tracking-widest text-gold">
              <GitCompare className="h-4 w-4" /> Compare ({items.length})
            </span>
            <div className="flex flex-1 flex-wrap gap-2">
              {items.map((c) => (
                <span
                  key={c!.slug}
                  className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs"
                >
                  <img src={c!.image} alt="" className="h-6 w-9 rounded object-cover" />
                  {c!.model}
                  <button onClick={() => toggleCompare(c!.slug)} aria-label="Remove">
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-gold" />
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={clearCompare}
              className="px-3 text-xs uppercase tracking-widest text-muted-foreground hover:text-gold"
            >
              Clear
            </button>
            <Link
              to="/compare"
              className="rounded-full bg-gold px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-primary-foreground transition-transform hover:scale-105"
            >
              Compare Now
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
