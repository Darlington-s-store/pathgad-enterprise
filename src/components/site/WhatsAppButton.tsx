import { MessageCircle } from "lucide-react";

export const WHATSAPP_NUMBER = "233530982527";
export const WHATSAPP_DISPLAY = "+233 53 098 2527";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
      style={{ backgroundColor: "#25D366" }}
    >
      <MessageCircle className="h-7 w-7 text-white" />
    </a>
  );
}
