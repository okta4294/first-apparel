"use client";

import { useState, useEffect } from "react";

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

export function PromoBannerCarousel({
  promos,
  waNumber,
}: PromoBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto-slide setiap 5 detik jika promo lebih dari 1 dan kursor tidak sedang di atas banner
  useEffect(() => {
    if (isPaused || promos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % promos.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, promos.length]);

  if (!promos || promos.length === 0) return null;

  const current = promos[currentIndex] || promos[0];

  const waText =
    current.waMessage ||
    `Halo Admin First Apparel, saya ingin klaim promo "${current.title}" yang sedang tayang di website.`;

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev - 1 + promos.length) % promos.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev + 1) % promos.length);
  };

  // Penanganan gestur usap layar (Touch Swipe) untuk perangkat mobile
  const minSwipeDistance = 45;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || promos.length <= 1) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <section
      className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-[#27272A] bg-[#0A0B0E]"
      aria-label="Korsel Banner Promosi Spesial"
    >
      <div className="max-w-7xl mx-auto">
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[#27272A] shadow-xl bg-[#14151C] min-h-[300px] sm:min-h-[360px] md:min-h-[400px] flex items-center group select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* 1. Latar Belakang Gambar Promo Berukuran Besar */}
          {current.imageUrl ? (
            <img
              key={`img-${current.id}`}
              src={current.imageUrl}
              alt={current.title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 animate-in fade-in"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#181A22] via-[#14151D] to-[#0D0E12]" />
          )}

          {/* 2. Layer Overlay Gelap untuk Kontras Maksimal Teks & Tombol */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B]/95 via-[#09090B]/75 to-[#09090B]/30 sm:bg-gradient-to-r sm:from-[#09090B]/95 sm:via-[#09090B]/80 sm:to-black/30" />

          {/* 3. Konten Teks Promo & Tombol Klaim di Atas Layer Gambar */}
          <div className="relative z-10 w-full max-w-2xl p-6 sm:p-10 md:p-12 flex flex-col justify-center items-start space-y-3 sm:space-y-4">
            {/* Lencana Diskon / Kategori Promo */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-black uppercase tracking-wider shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#09090B] animate-pulse" />
              {current.badgeText || "PROMO SPESIAL"}
            </span>

            {/* Judul Promo */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#FAFAFA] tracking-tight leading-[1.15] drop-shadow-md">
              {current.title}
            </h2>

            {/* Sub-judul / Deskripsi Promo */}
            {current.label && (
              <p className="text-sm sm:text-base md:text-lg text-[#D4D4D8] font-medium leading-relaxed drop-shadow-sm max-w-xl">
                {current.label}
              </p>
            )}

            {/* Tombol Klaim Promo via WA di Atas Layer Gambar */}
            <div className="pt-2 sm:pt-4">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#84CC16] hover:bg-[#9ee238] active:scale-95 text-[#09090B] text-xs sm:text-sm font-black uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(132,204,22,0.4)] hover:shadow-[0_0_35px_rgba(132,204,22,0.6)]"
              >
                <span>Klaim Promo via WhatsApp →</span>
              </a>
            </div>
          </div>

          {/* 4. Navigasi Panah Kiri & Kanan (Hanya Muncul Jika Promo > 1) */}
          {promos.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#09090B]/70 hover:bg-[#84CC16] border border-white/10 hover:border-[#84CC16] text-[#FAFAFA] hover:text-[#09090B] flex items-center justify-center text-lg font-bold transition-all backdrop-blur-sm shadow-lg active:scale-90"
                aria-label="Promo Sebelumnya"
                title="Promo Sebelumnya"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#09090B]/70 hover:bg-[#84CC16] border border-white/10 hover:border-[#84CC16] text-[#FAFAFA] hover:text-[#09090B] flex items-center justify-center text-lg font-bold transition-all backdrop-blur-sm shadow-lg active:scale-90"
                aria-label="Promo Berikutnya"
                title="Promo Berikutnya"
              >
                ›
              </button>

              {/* Indikator Titik (Dots) di Bawah Tengah */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#09090B]/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                {promos.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? "w-6 bg-[#84CC16]"
                        : "w-2 bg-white/30 hover:bg-white/60"
                    }`}
                    aria-label={`Beralih ke promo ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
