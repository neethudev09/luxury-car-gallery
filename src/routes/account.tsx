import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Heart, Clock } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account | Luxury Car Gallery Dubai" },
      { name: "description", content: "Sign in to your Luxury Car Gallery Dubai account to manage saved vehicles and enquiries." },
    ],
    links: [{ rel: "canonical", href: "/account" }],
  }),
  component: Account,
});

function Account() {
  return (
    <div className="pt-28">
      <div className="mx-auto max-w-md px-5 py-16">
        <div className="glass rounded-3xl p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold"><User className="h-6 w-6" /></span>
          <h1 className="mt-5 text-3xl">My Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to save vehicles and track your enquiries.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-4 text-left">
            <input type="email" placeholder="Email" className="afield" />
            <input type="password" placeholder="Password" className="afield" />
            <button className="w-full rounded-full bg-gold py-3.5 text-sm font-medium uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:scale-105">Sign In</button>
          </form>
          <div className="mt-8 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-xl border border-border bg-card p-4"><Heart className="h-5 w-5 text-gold" /><p className="mt-2 text-sm">Saved Cars</p></div>
            <div className="rounded-xl border border-border bg-card p-4"><Clock className="h-5 w-5 text-gold" /><p className="mt-2 text-sm">Enquiries</p></div>
          </div>
          <Link to="/inventory" className="mt-6 inline-block text-sm text-gold hover:underline">Continue browsing inventory</Link>
        </div>
      </div>
      <style>{`.afield{width:100%;border-radius:0.5rem;border:1px solid var(--border);background:var(--card);padding:0.75rem 0.95rem;font-size:0.875rem;outline:none}.afield:focus{border-color:var(--gold)}`}</style>
    </div>
  );
}
