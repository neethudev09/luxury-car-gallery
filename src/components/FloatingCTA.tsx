import { Phone, MessageCircle } from "lucide-react";
import { PHONE, whatsappLink } from "@/data/cars";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 print:hidden">
      <a
        href={whatsappLink("Hello Car Gallery Dubai, I'd like to enquire about a vehicle.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
      <a
        href={`tel:${PHONE.replace(/\s/g, "")}`}
        aria-label="Call us"
        className="group flex items-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-medium text-primary-foreground shadow-gold transition-transform hover:scale-105"
      >
        <Phone className="h-5 w-5" />
        <span className="hidden sm:inline">Call</span>
      </a>
    </div>
  );
}
