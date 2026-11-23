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

    // Tampilkan pop-up di awal kunjungan saja (tanpa pemicu saat scroll)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 600);

    return () => {
      clearTimeout(timer);
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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-md w-full rounded-2xl bg-white dark:bg-[#141418] border border-[#E2E8F0] dark:border-[#27272A] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Tombol Tutup Minimalis */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup promo"
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/90 dark:bg-[#141418]/90 backdrop-blur-md text-[#0F172A] dark:text-[#FAFAFA] hover:bg-white dark:hover:bg-[#27272A] flex items-center justify-center text-xs font-semibold transition-colors shadow-sm border border-[#E2E8F0]/80 dark:border-[#27272A]"
        >
          ✕
        </button>

        {/* Gambar Promo Tanpa Garis Pemisah Kaku */}
        {promo.imageUrl && (
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#F1F5F9] dark:bg-[#0E0F13]">
            <Image
              src={promo.imageUrl}
              alt={promo.title}
              fill
              sizes="(min-width: 640px) 448px, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-[#141418] to-transparent"
            />
          </div>
        )}

        {/* Konten Pop-up Bersih & Rata Kiri */}
        <div className="p-6 sm:p-7 space-y-4 text-left">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {promo.badgeText && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#65A30D]/10 dark:bg-[#84CC16]/15 text-[#4D7C0F] dark:text-[#84CC16] text-xs font-semibold">
                  {promo.badgeText}
                </span>
              )}
              {promo.label && (
                <span className="text-xs font-medium text-[#64748B] dark:text-[#A1A1AA]">
                  {promo.label}
                </span>
              )}
            </div>

            <h3
              id="promo-popup-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA] leading-snug"
            >
              {promo.title}
            </h3>

            <p className="text-sm text-[#475569] dark:text-[#A1A1AA] leading-relaxed">
              Hubungi tim kami di WhatsApp untuk menggunakan penawaran ini saat pemesanan jersey.
            </p>
          </div>

          {/* Baris Aksi Ringkas */}
          <div className="pt-2 flex items-center gap-2.5">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#65A30D] hover:bg-[#4D7C0F] text-white dark:bg-[#84CC16] dark:text-[#09090B] dark:hover:bg-[#9ee238] active:scale-[0.98] text-sm font-semibold transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              <span>Klaim Promo</span>
            </a>

            <button
              type="button"
              onClick={handleClose}
              className="min-h-[44px] px-4 rounded-full text-xs font-medium text-[#64748B] dark:text-[#A1A1AA] hover:text-[#0F172A] dark:hover:text-[#FAFAFA] hover:bg-[#F1F5F9] dark:hover:bg-[#1F1F23] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
