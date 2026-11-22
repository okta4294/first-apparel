"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export interface ShowcaseDesign {
  id: number;
  title: string;
  category: string;
  fabric: string;
  priceInfo?: string | null;
  badge?: string;
  imageUrl?: string | null;
}

const DEFAULT_DESIGNS: ShowcaseDesign[] = [
  {
    id: 1,
    title: "SERI JERSEY ESPORT & FUTSAL",
    category: "ESPORTS & FUTSAL",
    fabric: "Sublimasi Full Print HD • Dryfit Brazil Original",
    priceInfo: "Mulai Rp 125.000 / pcs",
    badge: "PORTOFOLIO TERBARU",
  },
  {
    id: 2,
    title: "CYBER PULSE APEX PRO",
    category: "ESPORTS PRO SERIES",
    fabric: "Kerah V-Neck Elastis • Dryfit Milano Anti-Bakteri",
    priceInfo: "Mulai Rp 135.000 / pcs",
    badge: "DESAIN UNGGULAN",
  },
  {
    id: 3,
    title: "AERO GLIDE ULTRALIGHT RUN",
    category: "RUNNING & CYCLING",
    fabric: "Bahan Berpori Mikro Super Sejuk • Micro Mesh",
    priceInfo: "Mulai Rp 115.000 / pcs",
    badge: "EDISI RUNNING",
  },
  {
    id: 4,
    title: "OFFICIAL TEAM COACH JACKET",
    category: "COACH & APPAREL",
    fabric: "Windbreaker Anti-Air • Taslan Parasut Premium",
    priceInfo: "Mulai Rp 175.000 / pcs",
    badge: "OUTER & JAKET",
  },
];

interface HeroShowcaseCarouselProps {
  items?: ShowcaseDesign[];
  waNumber: string;
}

export function HeroShowcaseCarousel({
  items,
  waNumber,
}: HeroShowcaseCarouselProps) {
  const designs = items && items.length > 0 ? items : DEFAULT_DESIGNS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Geser otomatis setiap 3.5 detik, hormati preferensi kurangi gerakan
  useEffect(() => {
    if (isPaused || designs.length <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % designs.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, designs.length]);

  const current = designs[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + designs.length) % designs.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % designs.length);
  };

  const minSwipeDistance = 45;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null || designs.length <= 1) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Admin First Apparel, saya tertarik dengan contoh desain "${current.title}" (${current.category}) yang ada di beranda. Bisa info detail pemesanannya?`
  )}`;

  return (
    <div
      className="relative rounded-2xl bg-[#141418] border border-[#27272A] p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-[#27272A] mb-4 sm:mb-5">
        <span className="text-[#84CC16] text-[11px] font-bold tracking-wider uppercase truncate">
          {current.badge || "PRATINJAU DESAIN TERPILIH"}
        </span>

        {designs.length > 1 && (
          <div className="flex items-center gap-0.5 shrink-0" role="group" aria-label="Navigasi desain">
            {designs.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className="min-w-[28px] min-h-[44px] sm:min-h-[32px] flex items-center justify-center px-1 group/dot"
                aria-label={`Tampilkan desain ke-${idx + 1}`}
                aria-current={idx === currentIndex ? "true" : undefined}
              >
                <span
                  className={`h-1.5 rounded-full transition-all block ${
                    idx === currentIndex
                      ? "w-6 bg-[#84CC16]"
                      : "w-1.5 bg-[#3F3F46] group-hover/dot:bg-[#71717A]"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Media Foto Jersey Penuh (Opacity 100%) */}
      <div className="relative rounded-xl bg-gradient-to-b from-[#1F1F24] to-[#0E0E12] border border-[#2E2E36] overflow-hidden group">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#121318]">
          {current.imageUrl ? (
            <Image
              src={current.imageUrl}
              alt={current.title}
              width={520}
              height={390}
              priority={currentIndex === 0}
              className="w-full h-full object-cover object-center opacity-100 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-2">
              <div className="w-14 h-14 rounded-2xl bg-[#181922] border border-[#84CC16]/25 flex items-center justify-center text-[#84CC16]">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-[#A1A1AA]">
                Pratinjau Jersey Full Print HD
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#84CC16] bg-[#09090B]/85 backdrop-blur-sm px-2.5 py-1 rounded-md border border-[#27272A]">
              {current.category}
            </span>
            {designs.length > 1 && (
              <span className="text-[11px] font-semibold text-[#FAFAFA] bg-[#09090B]/80 px-2 py-0.5 rounded-md tabular-nums sm:hidden">
                Geser ↔
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[#141418] border-t border-[#27272A]">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#FAFAFA] tracking-tight leading-snug">
            {current.title}
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1 font-medium leading-relaxed">
            {current.fabric}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-[#27272A]">
        <span className="inline-block px-3 py-1.5 rounded-full bg-[#27272A] text-xs font-bold text-[#84CC16] tabular-nums whitespace-nowrap">
          {current.priceInfo || "Mulai Rp 115.000 / pcs"}
        </span>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full bg-[#84CC16] hover:bg-[#9ee238] active:scale-95 text-[#09090B] text-xs font-bold tracking-wide transition-all"
        >
          <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
          <span>Pesan Model Ini →</span>
        </a>
      </div>
    </div>
  );
}
