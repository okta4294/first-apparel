"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

interface MobileWaFabProps {
  waHref: string;
}

export function MobileWaFab({ waHref }: MobileWaFabProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 360);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-4 inset-x-4 z-40 pointer-events-none flex justify-end">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-5 py-3 rounded-full bg-[#84CC16] hover:bg-[#9ee238] active:scale-95 text-[#09090B] font-bold text-xs tracking-wide shadow-lg border border-[#09090B]/15 transition-all"
        aria-label="Konsultasi cepat via WhatsApp"
      >
        <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
        <span>Chat WA Admin</span>
      </a>
    </div>
  );
}
