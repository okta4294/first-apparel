"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface PromoItem {
  id: number;
  label: string;
  title: string;
  badgeText: string;
  imageUrl?: string | null;
  imageKey?: string | null;
  waMessage?: string | null;
  hasDuration?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive: boolean;
  isPopup?: boolean;
}

interface PromoBannerCarouselProps {
  promos: PromoItem[];
  waNumber: string;
}

function splitBadgeHighlight(raw: string): { main: string; sub: string } {
  const clean = raw.trim();
  if (!clean) return { main: "PROMO", sub: "PENAWARAN AKTIF" };

  const percentMatch = clean.match(/\d+\s*%/);
  if (percentMatch) {
    const main = percentMatch[0].replace(/\s+/g, "");
    const rest = clean.replace(percentMatch[0], "").trim();
    return { main, sub: rest || "POTONGAN HARGA" };
  }

  const words = clean.split(/\s+/);
  if (words.length >= 2) {
    return { main: words[0], sub: words.slice(1).join(" ") };
  }

  return { main: clean, sub: "PENAWARAN AKTIF" };
}

export function PromoBannerCarousel({
  promos,
  waNumber,
}: PromoBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (isPaused || promos.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, promos.length]);

  if (!promos || promos.length === 0) return null;

  const safeIndex = currentIndex % promos.length;
  const current = promos[safeIndex] || promos[0];

  const waText =
    current.waMessage ||
    `Halo Admin First Apparel, saya ingin klaim promo "${current.title}" yang sedang tayang di website.`;

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  const { main: highlightMain, sub: highlightSub } = splitBadgeHighlight(
    current.badgeText || "PROMO"
  );

  const durationLabel =
    current.hasDuration && current.endDate
      ? `Berlaku s/d ${new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(new Date(current.endDate))}`
      : "Penawaran Terbatas";

  const minSwipeDistance = 45;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null || promos.length <= 1) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
    }
  };

  const hasImage = Boolean(current.imageUrl);

  return (
    <section
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#09090B]"
      aria-label="Promo Aktif"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Seksi Ringkas */}
        <div data-animate="text-reveal" className="mb-6 sm:mb-8 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0F172A] dark:text-[#FAFAFA]">
            Promo Aktif
          </h2>
          <p className="text-sm sm:text-base text-[#475569] dark:text-[#A1A1AA] mt-1.5 leading-relaxed">
            Potongan harga dan penawaran khusus untuk pemesanan custom jersey tim langsung via WhatsApp.
          </p>
        </div>

        {/* Kartu Banner Promo dengan Background Gambar Upload (Fallback Gradien Lime) */}
        <div
          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-11 grid grid-cols-1 md:grid-cols-[1fr_auto] md:items-center gap-4 md:gap-x-10 md:gap-y-5 select-none border ${
            hasImage
              ? "bg-[#F8FAFC] dark:bg-[#09090B] border-[#E2E8F0] dark:border-[#27272A] shadow-[0_12px_32px_-12px_rgba(15,23,42,0.10)] dark:shadow-none"
              : "bg-gradient-to-r from-[#BEF264] via-[#A3E635] to-[#84CC16] border-transparent shadow-sm"
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {current.imageUrl && (
            <>
              <Image
                key={`bg-${current.id}`}
                src={current.imageUrl}
                alt={current.title}
                fill
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-cover object-center"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC]/96 via-[#F8FAFC]/85 to-[#F8FAFC]/45 md:bg-gradient-to-r md:from-[#F8FAFC]/95 md:via-[#F8FAFC]/80 md:to-[#F8FAFC]/25 dark:from-[#09090B]/95 dark:via-[#09090B]/82 dark:to-[#09090B]/45 md:dark:from-[#09090B]/92 md:dark:via-[#09090B]/72 md:dark:to-[#09090B]/35 pointer-events-none"
                aria-hidden="true"
              />
            </>
          )}

          {/* Informasi Promo: Label, Judul, dan Deskripsi */}
          <div className="relative z-10 md:col-start-1 md:row-start-1 space-y-2.5 sm:space-y-3.5 max-w-xl">
            <span
              className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                hasImage
                  ? "bg-[#ECFCCB] border border-[#BEF264] text-[#365314] dark:bg-white/15 dark:backdrop-blur-sm dark:border-white/20 dark:text-white"
                  : "bg-[#14532D] text-[#ECFCCB]"
              }`}
            >
              {durationLabel}
            </span>

            <h3
              className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase leading-tight ${
                hasImage ? "text-[#0F172A] dark:text-white" : "text-[#052E16]"
              }`}
            >
              {current.title}
            </h3>

            {current.label && (
              <p
                className={`text-sm sm:text-base font-medium leading-relaxed ${
                  hasImage ? "text-[#334155] dark:text-white/85" : "text-[#14532D]"
                }`}
              >
                {current.label}
              </p>
            )}
          </div>

          {/* Kotak Highlight Diskon: Bar Ringkas di Mobile, Kotak Kanan di Desktop */}
          <div
            className={`relative z-10 md:col-start-2 md:row-start-1 md:row-span-2 md:min-w-[180px] lg:min-w-[220px] rounded-xl md:rounded-2xl px-4 py-3 md:px-7 md:py-8 flex flex-row md:flex-col items-baseline md:items-center justify-between md:justify-center gap-3 md:gap-0 md:text-center shrink-0 ${
              hasImage
                ? "bg-white/88 backdrop-blur-md border border-[#E2E8F0] shadow-[0_8px_24px_-8px_rgba(15,23,42,0.12)] dark:bg-black/55 dark:border-white/20 dark:shadow-none"
                : "bg-white/30 border border-white/45"
            }`}
          >
            <span
              className={`text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none tabular-nums ${
                hasImage ? "text-[#0F172A] dark:text-white" : "text-[#052E16]"
              }`}
            >
              {highlightMain}
            </span>
            <span
              className={`md:mt-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest ${
                hasImage ? "text-[#4D7C0F] dark:text-[#BEF264]" : "text-[#14532D]"
              }`}
            >
              {highlightSub}
            </span>
          </div>

          {/* Tombol Aksi Utama: Penuh di Bawah saat Mobile, Sejajar Kiri saat Desktop */}
          <div className="relative z-10 md:col-start-1 md:row-start-2 flex flex-wrap items-center gap-3">
            <span
              className={`hidden sm:inline text-[11px] font-bold uppercase tracking-widest ${
                hasImage ? "text-[#475569] dark:text-white/75" : "text-[#14532D]/80"
              }`}
            >
              Klaim Via:
            </span>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[40px] px-5 py-2.5 sm:py-2 rounded-full active:scale-[0.98] text-xs font-bold tracking-wider uppercase transition-all ${
                hasImage
                  ? "bg-[#65A30D] hover:bg-[#4D7C0F] text-white dark:bg-[#84CC16] dark:hover:bg-[#A3E635] dark:text-[#052E16]"
                  : "bg-[#052E16] hover:bg-[#14532D] text-[#ECFCCB]"
              }`}
            >
              <span>Klaim Promo</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Indikator Titik Minimalis di Bawah Kartu */}
        {promos.length > 1 && (
          <div
            className="mt-4 flex items-center justify-center gap-1"
            role="group"
            aria-label="Navigasi promo"
          >
            {promos.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className="min-w-[28px] min-h-[32px] flex items-center justify-center px-1 group/dot"
                aria-label={`Tampilkan promo ${idx + 1}`}
                aria-current={idx === safeIndex ? "true" : undefined}
              >
                <span
                  className={`h-1.5 rounded-full transition-all block ${
                    idx === safeIndex
                      ? "w-6 bg-[#65A30D] dark:bg-[#84CC16]"
                      : "w-1.5 bg-[#CBD5E1] dark:bg-[#3F3F46] group-hover/dot:bg-[#94A3B8] dark:group-hover/dot:bg-[#71717A]"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
