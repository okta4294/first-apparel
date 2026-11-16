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

  // Efek geser otomatis (Carousel Auto-slide) setiap 3.5 detik
  useEffect(() => {
    if (isPaused || designs.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % designs.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, designs.length]);

  const current = designs[currentIndex];

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Admin First Apparel, saya tertarik dengan contoh desain "${current.title}" (${current.category}) yang ada di beranda. Bisa info detail pemesanannya?`
  )}`;

  return (
    <div
      className="relative rounded-2xl bg-[#141418] border border-[#27272A] p-6 shadow-2xl overflow-hidden flex flex-col justify-between"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header Kartu Sesuai Desain */}
      <div className="flex items-center justify-between pb-4 border-b border-[#27272A] mb-5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#84CC16]/10 text-[#84CC16] text-[11px] font-bold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-pulse" />
          {current.badge || "PREVIEW DESAIN TERPILIH"}
        </span>
        <span className="text-xs text-[#71717A] font-medium">Seri First Apparel Pro</span>
      </div>

      {/* Area Carousel Preview Desain yang Bergerak Sendiri */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative h-64 rounded-xl bg-gradient-to-b from-[#1F1F24] to-[#0E0E12] border border-[#2E2E36] p-6 overflow-hidden group cursor-pointer"
        title="Klik untuk konsultasi desain ini via WhatsApp"
      >
        {/* Latar Belakang Gambar Jika Ada */}
        {current.imageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
            style={{ backgroundImage: `url(${current.imageUrl})` }}
          />
        )}

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#84CC16] bg-[#09090B]/60 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-[#27272A]">
              {current.category}
            </span>

            {/* Indikator Titik Carousel */}
            <div className="flex items-center gap-1.5">
              {designs.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentIndex
                      ? "w-6 bg-[#84CC16]"
                      : "w-1.5 bg-[#3F3F46] hover:bg-[#71717A]"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#FAFAFA] tracking-tight group-hover:text-[#84CC16] transition-colors">
              {current.title}
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-1.5 font-medium">
              {current.fabric}
            </p>
          </div>
        </div>
      </a>

      {/* Bagian Bawah Kartu Sesuai Desain */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#27272A]">
        <span className="text-xs text-[#A1A1AA]">
          Pemesanan langsung via WhatsApp admin
        </span>
        <span className="inline-block px-3 py-1 rounded-full bg-[#27272A] text-xs font-bold text-[#84CC16]">
          {current.priceInfo || "Mulai Rp 115.000 / pcs"}
        </span>
      </div>
    </div>
  );
}
