import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { EMAIL, PHONE, whatsappLink } from "@/data/cars";
import { FaqSection } from "@/components/FaqSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Luxury Car Gallery Dubai | Luxury Car Showroom" },
      { name: "description", content: "Get in touch with Luxury Car Gallery Dubai. Call, WhatsApp, email or visit our luxury car showroom at 87 4th St, Al Quoz Industrial Third, Dubai." },
      { property: "og:title", content: "Contact Luxury Car Gallery Dubai" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="pt-28">
      <div className="mx-auto max-w-7xl px-5 py-10">
        <span className="text-xs uppercase tracking-luxury text-gold">Contact</span>
        <h1 className="mt-3 text-4xl md:text-5xl">Let's Talk</h1>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-6 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-4">
            {[
              { Icon: Phone, t: "Call", d: PHONE, href: `tel:${PHONE.replace(/\s/g, "")}` },
              { Icon: Mail, t: "Email", d: EMAIL, href: `mailto:${EMAIL}` },
              { Icon: MapPin, t: "Showroom", d: "87 4th St - Al Qouz Ind.third - Al Quoz - Dubai", href: "#" },
            ].map(({ Icon, t, d, href }) => (
              <a key={t} href={href} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-gold">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold"><Icon className="h-5 w-5" /></span>
                <div><p className="font-medium">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </a>
            ))}
            <a href={whatsappLink("Hello Luxury Car Gallery Dubai")} target="_blank" rel="noopener noreferrer" className="block rounded-full bg-gold py-3.5 text-center text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105">Chat on WhatsApp</a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass rounded-2xl p-8">
            {sent ? (
              <div className="py-16 text-center"><Check className="mx-auto h-12 w-12 text-gold" /><h2 className="mt-4 text-2xl">Message Sent</h2><p className="mt-2 text-muted-foreground">We'll be in touch shortly.</p></div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                <input required placeholder="Full Name" className="cfield" />
                <input required type="email" placeholder="Email" className="cfield" />
                <input required type="tel" placeholder="Phone" className="cfield" />
                <textarea required placeholder="How can we help?" rows={5} className="cfield resize-none" />
                <button className="w-full rounded-full bg-gold py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105">Send Message</button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
      <FaqSection />
      <style>{`.cfield{width:100%;border-radius:0.5rem;border:1px solid var(--border);background:var(--card);padding:0.75rem 0.95rem;font-size:0.875rem;outline:none}.cfield:focus{border-color:var(--gold)}`}</style>
    </div>
  );
}
