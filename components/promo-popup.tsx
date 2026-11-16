"use client";

import { useState, useEffect } from "react";

export interface PromoPopupData {
  id: number;
  label: string;
  title: string;
  badgeText: string;
  imageUrl: string | null;
  waMessage: string;
}

interface PromoPopupProps {
  promo: PromoPopupData | null;
  waNumber: string;
}

export function PromoPopup({ promo, waNumber }: PromoPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!promo) return;

    // Cek apakah pengunjung sudah pernah menutup promo ini di sesi sekarang
    try {
      const closed = sessionStorage.getItem(`promo_closed_${promo.id}`);
      if (closed === "true") return;
    } catch {
      // Fallback jika sessionStorage tidak dapat diakses
    }

    // Tampilkan pop-up setelah jeda 1 detik agar transisi mulus
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [promo]);

  const handleClose = () => {
    setIsOpen(false);
    if (promo) {
      try {
        sessionStorage.setItem(`promo_closed_${promo.id}`, "true");
      } catch {
        // Fallback
      }
    }
  };

  if (!isOpen || !promo) return null;

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(promo.waMessage)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-[#09090B]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full rounded-3xl bg-gradient-to-b from-[#181A22] via-[#14151C] to-[#0E0F14] border border-[#84CC16]/40 shadow-[0_0_60px_rgba(132,204,22,0.18)] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Tombol Tutup Silang di Sudut Kanan Atas */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup promo"
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#09090B]/80 hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center justify-center text-sm font-bold transition-colors border border-[#27272A]"
        >
          ✕
        </button>

        {/* Gambar Banner Promo (Jika Ada) */}
        {promo.imageUrl && (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#09090B] border-b border-[#27272A]">
            <img
              src={promo.imageUrl}
              alt={promo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#14151C] via-transparent to-transparent opacity-70" />
            
            {/* Badge Highlight di atas gambar */}
            <div className="absolute bottom-3 left-4">
              <span className="px-3 py-1 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-black tracking-wider shadow-lg">
                {promo.badgeText}
              </span>
            </div>
          </div>
        )}

        {/* Konten Pop-up */}
        <div className="p-6 sm:p-8 text-center space-y-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16] text-[11px] font-bold uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-pulse" />
              {promo.label}
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#FAFAFA] leading-snug">
              {promo.title}
            </h3>

            {!promo.imageUrl && (
              <div className="mt-3">
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-black tracking-wider shadow-md">
                  {promo.badgeText}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-sm mx-auto">
            Jangan lewatkan penawaran terbatas ini! Klaim kode promo Anda sekarang juga langsung melalui WhatsApp resmi kami.
          </p>

          {/* Tombol Aksi Klaim WA */}
          <div className="pt-2 space-y-2.5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#84CC16] text-[#09090B] text-xs sm:text-sm font-bold tracking-wide hover:bg-[#9ee238] active:scale-95 shadow-[0_0_25px_rgba(132,204,22,0.3)] transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
              </svg>
              <span>Klaim Promo via WhatsApp Sekarang →</span>
            </a>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-[#71717A] hover:text-[#FAFAFA] transition-colors py-1 block w-full text-center"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
