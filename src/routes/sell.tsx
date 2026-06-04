import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Check } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { brands, whatsappLink } from "@/data/cars";
import sellImg from "@/assets/sell-your-car.jpg";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell Your Luxury Car in Dubai | Car Gallery Dubai" },
      { name: "description", content: "Sell your luxury car or supercar in Dubai with Car Gallery Dubai. Free valuation, instant payment and a discreet, hassle-free process." },
      { property: "og:title", content: "Sell Your Luxury Car in Dubai" },
    ],
    links: [{ rel: "canonical", href: "/sell" }],
  }),
  component: Sell,
});

function Sell() {
  const [sent, setSent] = useState(false);
  return (
    <div className="pt-28">
      <div className="relative h-[40vh] min-h-[320px] overflow-hidden">
        <img src={sellImg} alt="Sell your car in Dubai" width={1600} height={1024} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-5 pb-10">
            <span className="text-xs uppercase tracking-luxury text-gold">Sell Your Car</span>
            <h1 className="mt-3 text-4xl md:text-5xl">Get a Premium Valuation</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1fr_1.1fr]">
        <Reveal>
          <h2 className="text-2xl">Why Sell With Us</h2>
          <ul className="mt-6 space-y-4">
            {["Free, no-obligation valuation within hours", "Competitive market-leading offers", "Instant and secure payment", "We handle all paperwork & transfer", "Discreet, white-glove service"].map((t) => (
              <li key={t} className="flex gap-3 text-muted-foreground">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" /> {t}
              </li>
            ))}
          </ul>
          <a href={whatsappLink("I'd like a valuation for my car.")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex rounded-full border border-gold/50 px-7 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-gold/10">
            Prefer WhatsApp?
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass rounded-2xl p-8">
            {sent ? (
              <div className="py-16 text-center">
                <Check className="mx-auto h-12 w-12 text-gold" />
                <h3 className="mt-4 text-2xl">Thank You</h3>
                <p className="mt-2 text-muted-foreground">Our team will contact you shortly with a valuation.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <h3 className="text-xl">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full Name"><input required className="field" /></Field>
                  <Field label="Phone"><input required type="tel" className="field" /></Field>
                </div>
                <Field label="Email"><input required type="email" className="field" /></Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Brand">
                    <select className="field" required>
                      <option value="">Select</option>
                      {brands.map((b) => <option key={b.slug}>{b.name}</option>)}
                    </select>
                  </Field>
                  <Field label="Model"><input required className="field" /></Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Year"><input required type="number" className="field" /></Field>
                  <Field label="Mileage (km)"><input required type="number" className="field" /></Field>
                </div>
                <Field label="Photos">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground hover:border-gold">
                    <Upload className="h-4 w-4 text-gold" /> Upload vehicle photos
                    <input type="file" multiple accept="image/*" className="hidden" />
                  </label>
                </Field>
                <button className="w-full rounded-full bg-gold py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105">
                  Request Valuation
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
      <style>{`.field{width:100%;border-radius:0.5rem;border:1px solid var(--border);background:var(--card);padding:0.65rem 0.85rem;font-size:0.875rem;outline:none}.field:focus{border-color:var(--gold)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
