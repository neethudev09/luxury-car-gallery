import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, MessageSquareText, Send } from "lucide-react";
import { submitEnquiry } from "@/lib/public.functions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function EnquiryPullout() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const send = useServerFn(submitEnquiry);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await send({ data: { ...form, source: "enquiry-pullout" } });
      setDone(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      toast.success("Enquiry sent — we'll be in touch shortly.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send enquiry");
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open enquiry form"
          className="fixed left-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-2 rounded-r-xl bg-gold py-3 pl-2 pr-3 text-sm font-medium text-primary-foreground shadow-gold transition-transform hover:scale-105 print:hidden [writing-mode:vertical-rl] rotate-180"
        >
          <MessageSquareText className="h-4 w-4 rotate-90" />
          Enquire
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Make an Enquiry</SheetTitle>
          <SheetDescription>
            Tell us what you're looking for and our team will get back to you shortly.
          </SheetDescription>
        </SheetHeader>

        {done ? (
          <div className="mt-10 rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
            <Send className="mx-auto h-10 w-10 text-gold" />
            <h3 className="mt-4 text-xl">Thank You</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your enquiry has been received. We'll be in touch very soon.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>
              Send another
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="enq-name">Full name</Label>
              <Input id="enq-name" required value={form.name} onChange={update("name")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="enq-email">Email</Label>
              <Input id="enq-email" type="email" value={form.email} onChange={update("email")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="enq-phone">Phone</Label>
              <Input id="enq-phone" type="tel" value={form.phone} onChange={update("phone")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="enq-message">How can we help?</Label>
              <Textarea
                id="enq-message"
                rows={4}
                value={form.message}
                onChange={update("message")}
              />
            </div>
            <Button type="submit" disabled={sending} className="w-full">
              {sending && <Loader2 className="h-4 w-4 animate-spin" />} Send enquiry
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
