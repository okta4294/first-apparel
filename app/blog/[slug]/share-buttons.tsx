"use client";

import { useState } from "react";

interface ShareButtonsProps {
  title: string;
}

export function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWA = () => {
    if (typeof window !== "undefined") {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(`Baca artikel menarik: "${title}" di First Apparel: `);
      window.open(`https://api.whatsapp.com/send?text=${text}${url}`, "_blank");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-xs text-[#71717A] font-medium">Bagikan Artikel:</span>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181920] border border-[#27272A] text-xs font-semibold text-[#FAFAFA] hover:border-[#84CC16]/50 hover:text-[#84CC16] transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
        <span>{copied ? "✓ Tautan Tersalin!" : "Salin Tautan"}</span>
      </button>

      <button
        type="button"
        onClick={handleShareWA}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#84CC16]/10 border border-[#84CC16]/30 text-xs font-semibold text-[#84CC16] hover:bg-[#84CC16]/20 transition-colors"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
        </svg>
        <span>Bagikan ke WhatsApp</span>
      </button>
    </div>
  );
}
