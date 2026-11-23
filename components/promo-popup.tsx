"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export interface PromoPopupData {
  id: number;
  label: string;
  title: string;
  badgeText: string;
  imageUrl: string | null;
  popupImageUrl?: string | null;
  waMessage: string;
}

interface PromoPopupProps {
  promos: PromoPopupData[];
  waNumber: string;
}

export function PromoPopup({ promos, waNumber }: PromoPopupProps) {
  const [queue, setQueue] = useState<PromoPopupData[]>([]);
  const [initialCount, setInitialCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const activePromo = queue[0] ?? null;

  const handleClose = useCallback(() => {
    if (!activePromo) {
      setIsOpen(false);
      return;
    }

    try {
      sessionStorage.setItem(`promo_closed_${activePromo.id}`, "true");
    } catch {
      // Fallback
    }

    setQueue((prev) => {
      const next = prev.slice(1);
      if (next.length === 0) {
        setIsOpen(false);
      }
      return next;
    });
  }, [activePromo]);

  useEffect(() => {
    if (!promos.length) return;

    // Saring promo yang belum ditutup pengunjung di sesi sekarang
    const unclosed = promos.filter((item) => {
      try {
        return sessionStorage.getItem(`promo_closed_${item.id}`) !== "true";
      } catch {
        return true;
      }
    });

    if (unclosed.length === 0) return;

    // Tampilkan pop-up setelah halaman selesai dirender agar tidak mengganggu LCP
    const timer = setTimeout(() => {
      setQueue(unclosed);
      setInitialCount(unclosed.length);
      setIsOpen(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [promos]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !activePromo) return null;

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(activePromo.waMessage)}`;
  const posterUrl = activePromo.popupImageUrl || activePromo.imageUrl;
  const remainingBehind = Math.min(queue.length - 1, 2);
  const currentStep = initialCount - queue.length + 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activePromo.title}
      onClick={handleClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-sm sm:max-w-md w-full"
      >
        {/* Efek Tumpukan Kartu di Belakang */}
        {remainingBehind >= 2 && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl bg-[#141418] border border-white/10 shadow-lg translate-y-6 scale-[0.92] opacity-65 pointer-events-none transition-all duration-200"
          />
        )}
        {remainingBehind >= 1 && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl bg-[#141418] border border-white/10 shadow-xl translate-y-3 scale-[0.96] opacity-85 pointer-events-none transition-all duration-200"
          />
        )}

        {/* Kartu Promo Teratas */}
        <div
          key={activePromo.id}
          className="relative z-10 w-full rounded-2xl bg-[#09090B] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        >
          {/* Penanda Urutan Tumpukan */}
          {initialCount > 1 && (
            <div className="pointer-events-none absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-[#09090B]/80 backdrop-blur-md text-[#FAFAFA] text-[11px] font-semibold shadow-sm border border-white/15">
              Promo {currentStep} / {initialCount}
            </div>
          )}

          {/* Tombol Tutup (Tidak Memicu Link WA) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            aria-label="Tutup promo"
            className="absolute top-3 right-3 z-30 w-11 h-11 rounded-full bg-[#09090B]/80 hover:bg-[#09090B] backdrop-blur-md text-[#FAFAFA] flex items-center justify-center text-sm font-bold transition-colors shadow-md border border-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
          >
            ✕
          </button>

          {posterUrl ? (
            /* Pop-up Penuh Gambar: Klik Gambar Langsung ke WhatsApp */
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              aria-label={`Klaim promo ${activePromo.title} via WhatsApp`}
              className="block w-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#84CC16]"
            >
              <Image
                src={posterUrl}
                alt={activePromo.title}
                width={1080}
                height={1600}
                sizes="(min-width: 640px) 448px, 92vw"
                className="w-full h-auto max-h-[82vh] object-contain block"
              />
            </a>
          ) : (
            /* Cadangan Jika Promo Pop-up Tidak Memakai Gambar */
            <div className="p-6 sm:p-7 space-y-4 text-left bg-white dark:bg-[#141418]">
              <div className="space-y-2.5 pr-10">
                <div className="flex flex-wrap items-center gap-2">
                  {activePromo.badgeText && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#65A30D]/10 dark:bg-[#84CC16]/15 text-[#4D7C0F] dark:text-[#84CC16] text-xs font-semibold">
                      {activePromo.badgeText}
                    </span>
                  )}
                  {activePromo.label && (
                    <span className="text-xs font-medium text-[#64748B] dark:text-[#A1A1AA]">
                      {activePromo.label}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA] leading-snug">
                  {activePromo.title}
                </h3>
              </div>

              <div className="pt-2">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#65A30D] hover:bg-[#4D7C0F] text-white dark:bg-[#84CC16] dark:text-[#09090B] dark:hover:bg-[#9ee238] active:scale-[0.98] text-sm font-semibold transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>Klaim Promo</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
