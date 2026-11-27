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
    <div className="md:hidden fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 pointer-events-none">
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto inline-flex items-center justify-center gap-2 min-h-[48px] px-4 py-3 rounded-full bg-[#84CC16] hover:bg-[#9AE02C] active:scale-95 text-[#0B100D] font-bold text-sm shadow-lg shadow-black/40 border border-[#0B100D]/15 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
        aria-label="Konsultasi cepat via WhatsApp"
      >
        <WhatsAppIcon className="w-5 h-5 fill-current shrink-0" />
        <span>Chat WA</span>
      </a>
    </div>
  );
}
