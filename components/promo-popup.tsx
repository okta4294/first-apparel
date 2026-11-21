"use client";

import { useState, useEffect, useCallback } from "react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

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

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (promo) {
      try {
        sessionStorage.setItem(`promo_closed_${promo.id}`, "true");
      } catch {
        // Fallback
      }
    }
  }, [promo]);

  useEffect(() => {
    if (!promo) return;

    // Cek apakah pengunjung sudah pernah menutup promo ini di sesi sekarang
    try {
      const closed = sessionStorage.getItem(`promo_closed_${promo.id}`);
      if (closed === "true") return;
    } catch {
      // Fallback jika sessionStorage tidak dapat diakses
    }

    let triggered = false;
    const openOnce = () => {
      if (triggered) return;
      triggered = true;
      setIsOpen(true);
    };

    // Tampilkan pop-up setelah 8 detik atau setelah pengguna menggulir >=35% halaman
    const timer = setTimeout(openOnce, 8000);
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0 && window.scrollY / docHeight >= 0.35) {
        openOnce();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [promo]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !promo) return null;

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(promo.waMessage)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-popup-title"
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-[#09090B]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-lg w-full rounded-3xl bg-gradient-to-b from-[#181A22] via-[#14151C] to-[#0E0F14] border border-[#84CC16]/40 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Tombol Tutup Silang di Sudut Kanan Atas */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup promo"
          className="absolute top-3 right-3 z-20 min-w-[44px] min-h-[44px] rounded-full bg-[#09090B]/85 hover:bg-[#27272A] text-[#FAFAFA] flex items-center justify-center text-sm font-bold transition-colors border border-[#27272A]"
        >
          ✕
        </button>

        {/* Gambar Banner Promo (Jika Ada) */}
        {promo.imageUrl && (
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#09090B] border-b border-[#27272A]">
            <img
              src={promo.imageUrl}
              alt={promo.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div data-keep-dark="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            
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
            <span className="text-[#84CC16] text-xs font-bold uppercase tracking-widest block mb-2">
              {promo.label}
            </span>

            <h3 id="promo-popup-title" className="text-xl sm:text-2xl font-black tracking-tight text-[#FAFAFA] leading-snug">
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
          <div className="pt-2 space-y-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#84CC16] text-[#09090B] text-xs sm:text-sm font-bold tracking-wide hover:bg-[#9ee238] active:scale-95 shadow-lg transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              <span>Klaim Promo via WhatsApp Sekarang →</span>
            </a>

            <button
              type="button"
              onClick={handleClose}
              className="min-h-[44px] text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors py-2 block w-full text-center font-medium"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
