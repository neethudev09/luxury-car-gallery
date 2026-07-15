import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { getPublicFaqs } from "@/lib/public.functions";

type Faq = { question: string; answer: string; category: string | null; sort_order: number };

export function FaqSection({
  category,
  eyebrow = "FAQ",
  title = "Frequently Asked Questions",
}: {
  category?: string;
  eyebrow?: string;
  title?: string;
}) {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    let cancelled = false;
    getPublicFaqs()
      .then((res) => {
        if (cancelled) return;
        const list = (res.faqs as Faq[]) ?? [];
        setFaqs(
          category
            ? list.filter((f) => (f.category ?? "").toLowerCase() === category.toLowerCase())
            : list,
        );
      })
      .catch(() => setFaqs([]));
    return () => {
      cancelled = true;
    };
  }, [category]);

  if (faqs.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <SectionHeading eyebrow={eyebrow} title={title} align="center" />
      <div className="mt-10 space-y-3">
        {faqs.map((f, i) => (
          <Reveal key={f.question} delay={i * 0.04}>
            <div className="rounded-2xl border border-border bg-card">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <span className="font-medium">{f.question}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gold transition-transform ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
