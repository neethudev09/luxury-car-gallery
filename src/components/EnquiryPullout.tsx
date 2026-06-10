import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ChevronUp, X, Send, MessageSquareText } from "lucide-react";
import { submitEnquiry, getPublicVehicles } from "@/lib/public.functions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INTERESTS = [
  "Buy a vehicle",
  "Sell my vehicle",
  "Finance options",
  "Trade-in valuation",
  "General enquiry",
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  make: string;
  model: string;
  message: string;
};

const EMPTY: FormState = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  make: "",
  model: "",
  message: "",
};

export function EnquiryPullout() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const send = useServerFn(submitEnquiry);
  const fetchVehicles = useServerFn(getPublicVehicles);

  const { data: vehData } = useQuery({
    queryKey: ["public-vehicles-enquiry"],
    queryFn: () => fetchVehicles(),
    staleTime: 5 * 60 * 1000,
  });

  const { makes, modelsByMake } = useMemo(() => {
    const vehicles = vehData?.vehicles ?? [];
    const makeSet = new Set<string>();
    const map: Record<string, Set<string>> = {};
    for (const v of vehicles) {
      const mk = (v.brand ?? "").trim();
      if (!mk) continue;
      makeSet.add(mk);
      map[mk] = map[mk] ?? new Set<string>();
      const md = (v.model ?? "").trim();
      if (md) map[mk].add(md);
    }
    return {
      makes: Array.from(makeSet).sort(),
      modelsByMake: Object.fromEntries(
        Object.entries(map).map(([k, s]) => [k, Array.from(s).sort()]),
      ) as Record<string, string[]>,
    };
  }, [vehData]);

  const models = form.make ? modelsByMake[form.make] ?? [] : [];

  const set = (k: keyof FormState, v: string) =>
    setForm((s) => ({ ...s, [k]: v, ...(k === "make" ? { model: "" } : {}) }));

  const onChange =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(k, e.target.value);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.interest) {
      toast.error("Please select what you're interested in.");
      return;
    }
    setSending(true);
    try {
      await send({ data: { ...form, source: "enquiry-bar" } });
      setDone(true);
      setForm(EMPTY);
      toast.success("Enquiry sent — we'll be in touch shortly.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send enquiry");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 print:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Bottom bar / pull-up panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 print:hidden transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "translate-y-[calc(100%-3.5rem)]"
        }`}
      >
        {/* Handle bar — always visible, toggles open/closed */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close enquiry form" : "Open enquiry form"}
          className="flex h-14 w-full items-center justify-center gap-2 border-t border-gold/30 bg-card text-foreground shadow-[0_-8px_30px_rgba(0,0,0,0.25)]"
        >
          <span className="flex items-center gap-2 text-sm font-semibold tracking-wide">
            <MessageSquareText className="h-4 w-4 text-gold" />
            Make an Enquiry
          </span>
          {open ? (
            <X className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gold" />
          )}
        </button>

        {/* Panel body */}
        <div className="max-h-[78vh] overflow-y-auto border-t border-border bg-card">
          <div className="mx-auto w-full max-w-3xl px-5 py-6">
            {done ? (
              <div className="rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
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
              <form onSubmit={onSubmit} className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Tell us what you're looking for and our team will get back to you shortly.
                  Fields marked <span className="text-gold">*</span> are required.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="enq-name">
                      Full name <span className="text-gold">*</span>
                    </Label>
                    <Input id="enq-name" required value={form.name} onChange={onChange("name")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="enq-phone">
                      Phone <span className="text-gold">*</span>
                    </Label>
                    <Input
                      id="enq-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={onChange("phone")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="enq-email">
                      Email <span className="text-gold">*</span>
                    </Label>
                    <Input
                      id="enq-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={onChange("email")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>
                      I'm interested in <span className="text-gold">*</span>
                    </Label>
                    <Select value={form.interest} onValueChange={(v) => set("interest", v)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {INTERESTS.map((i) => (
                          <SelectItem key={i} value={i}>
                            {i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {makes.length > 0 && (
                    <>
                      <div className="space-y-1.5">
                        <Label>Make</Label>
                        <Select value={form.make} onValueChange={(v) => set("make", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Any make" />
                          </SelectTrigger>
                          <SelectContent>
                            {makes.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Model</Label>
                        <Select
                          value={form.model}
                          onValueChange={(v) => set("model", v)}
                          disabled={!form.make || models.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={form.make ? "Any model" : "Select a make first"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {models.map((m) => (
                              <SelectItem key={m} value={m}>
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="enq-message">Message</Label>
                  <Textarea
                    id="enq-message"
                    rows={3}
                    placeholder="Any additional details..."
                    value={form.message}
                    onChange={onChange("message")}
                  />
                </div>

                <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                  {sending && <Loader2 className="h-4 w-4 animate-spin" />} Send enquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
