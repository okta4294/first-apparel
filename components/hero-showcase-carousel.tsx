"use client";

import { useState, useEffect } from "react";

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
          {current.badge || "PREVIEW DESAIN TERPILIH"}
        </span>

        {designs.length > 1 && (
          <div className="flex items-center gap-0.5 shrink-0" role="group" aria-label="Navigasi desain">
            {designs.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className="min-w-[28px] min-h-[44px] sm:min-h-[32px] flex items-center justify-center px-1 group/dot"
                aria-label={`Slide ${idx + 1}`}
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

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative min-h-[220px] sm:min-h-[256px] rounded-xl bg-gradient-to-b from-[#1F1F24] to-[#0E0E12] border border-[#2E2E36] p-5 sm:p-6 overflow-hidden group cursor-pointer"
        title="Klik untuk konsultasi desain ini via WhatsApp"
      >
        {/* Latar Belakang Gambar Jika Ada */}
        {current.imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
            style={{ backgroundImage: `url(${current.imageUrl})` }}
          />
        )}

        <div className="relative z-10 min-h-[180px] sm:min-h-[208px] flex flex-col justify-between gap-6">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#84CC16] bg-[#09090B]/60 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-[#27272A]">
              {current.category}
            </span>
            {designs.length > 1 && (
              <span className="text-[10px] font-semibold text-[#71717A] tabular-nums sm:hidden">
                Geser ↔
              </span>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-[#FAFAFA] tracking-tight group-hover:text-[#84CC16] transition-colors leading-snug">
              {current.title}
            </h2>
            <p className="text-xs text-[#A1A1AA] mt-1.5 font-medium leading-relaxed">
              {current.fabric}
            </p>
          </div>
        </div>
      </a>

      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-[#27272A]">
        <span className="text-xs text-[#A1A1AA]">
          Pemesanan langsung via WhatsApp admin
        </span>
        <span className="inline-block px-3 py-1 rounded-full bg-[#27272A] text-xs font-bold text-[#84CC16] tabular-nums whitespace-nowrap">
          {current.priceInfo || "Mulai Rp 115.000 / pcs"}
        </span>
      </div>
    </div>
  );
}
