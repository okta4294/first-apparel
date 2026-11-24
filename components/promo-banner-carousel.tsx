"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

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

function formatDurationRange(promo: PromoItem): string {
  if (!promo.hasDuration) return "Penawaran Terbatas";

  const fullFmt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const shortFmt = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
  });

  if (promo.startDate && promo.endDate) {
    const start = new Date(promo.startDate);
    const end = new Date(promo.endDate);
    if (start.getFullYear() === end.getFullYear()) {
      return `${shortFmt.format(start)} - ${fullFmt.format(end)}`;
    }
    return `${fullFmt.format(start)} - ${fullFmt.format(end)}`;
  }

  if (promo.endDate) {
    return `Berlaku s/d ${fullFmt.format(new Date(promo.endDate))}`;
  }

  return "Penawaran Terbatas";
}

export function PromoBannerCarousel({
  promos,
  waNumber,
}: PromoBannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = promos?.length ?? 0;
  const safeIndex = total > 0 ? activeIndex % total : 0;

  const goPrev = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [total, isPaused]);

  if (!promos || total === 0) return null;

  const activePromo = promos[safeIndex];
  const waText =
    activePromo.waMessage ||
    `Halo Admin First Apparel, saya ingin klaim promo "${activePromo.title}" yang sedang tayang di website.`;
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
  const { main: highlightMain, sub: highlightSub } = splitBadgeHighlight(
    activePromo.badgeText || "PROMO"
  );
  const durationLabel = formatDurationRange(activePromo);

  return (
    <section
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-[#E2E8F0] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#09090B]"
      aria-label="Promo Aktif"
    >
      <div className="max-w-7xl mx-auto">
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Banner promo aktif"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
          className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#11131A] border border-[#E2E8F0] dark:border-[#27272A]"
        >
          <div className="relative">
          {activePromo.imageUrl ? (
            /* Banner Penuh Gambar dengan Tombol WhatsApp di Pojok (Desktop) & Bar Bawah (Mobile) */
            <div className="relative group">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Klaim promo ${activePromo.title} via WhatsApp`}
                className="block w-full focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#84CC16]"
              >
                <Image
                  key={activePromo.id}
                  src={activePromo.imageUrl}
                  alt={activePromo.title}
                  width={1920}
                  height={600}
                  sizes="(min-width: 1280px) 1216px, 100vw"
                  className="w-full h-auto block transition-opacity duration-500"
                />
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 absolute bottom-3.5 right-3.5 z-20 px-4 py-2 rounded-full bg-[#84CC16] hover:bg-[#9ee238] text-[#09090B] text-xs font-bold tracking-wide shadow-lg shadow-black/40 transition-transform group-hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAFAFA]"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Klaim via WA</span>
              </a>
            </div>
          ) : (
            /* Cadangan Jika Promo Tidak Memakai Gambar */
            <div className="relative w-full min-h-[260px] sm:min-h-[320px] lg:min-h-[360px] flex items-center">
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#14171F] via-[#11131A] to-[#1A2410]"
                aria-hidden="true"
              />

              <div className="relative z-10 w-full px-14 sm:px-16 lg:px-24 pt-8 pb-12 sm:py-12">
                <div className="max-w-3xl space-y-4 sm:space-y-5">
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.14em] text-[#84CC16]">
                    Promo Spesial First Apparel
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="shrink-0">
                      <p className="text-3xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-none text-[#FAFAFA] tabular-nums">
                        {highlightMain}
                      </p>
                      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#D4D4D8] mt-1">
                        {highlightSub}
                      </p>
                    </div>

                    <div
                      className="hidden sm:block w-px self-stretch bg-white/25"
                      aria-hidden="true"
                    />

                    <div className="min-w-0">
                      <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-[#FAFAFA] [text-wrap:balance]">
                        {activePromo.title}
                      </h2>
                      {activePromo.label && (
                        <p className="text-xs sm:text-sm text-[#D4D4D8] mt-1.5 leading-relaxed line-clamp-2 max-w-[52ch]">
                          {activePromo.label}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-medium text-[#E4E4E7]">
                    {durationLabel}
                  </p>

                  <div className="pt-1">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-sm bg-[#FAFAFA] hover:bg-[#84CC16] text-[#09090B] text-xs sm:text-sm font-bold tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
                    >
                      Klaim Promo
                    </a>
                  </div>
                </div>
              </div>

              <span className="hidden sm:block absolute bottom-3 right-5 z-10 text-[11px] font-medium text-white/70">
                *S&amp;K Berlaku
              </span>
            </div>
          )}

          {/* Tombol Panah Kiri & Kanan di Sisi Banner */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Promo sebelumnya"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-black/60 text-white/90 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={goNext}
                aria-label="Promo berikutnya"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/35 hover:bg-black/60 text-white/90 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Titik Indikator Slide di Bawah Tengah Banner */}
          {total > 1 && (
            <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5">
              {promos.map((item, idx) => {
                const isActive = idx === safeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`Tampilkan promo ${idx + 1}: ${item.title}`}
                    aria-current={isActive ? "true" : undefined}
                    className="inline-flex items-center justify-center w-6 h-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16] rounded-full"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        isActive
                          ? "w-2.5 h-2.5 bg-[#84CC16]"
                          : "w-2 h-2 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
          </div>

          {activePromo.imageUrl && (
            <div className="sm:hidden flex items-center justify-between gap-3 px-4 py-2.5 bg-[#14171F] border-t border-white/10">
              <span className="text-xs font-medium text-[#E4E4E7] truncate">
                {activePromo.title}
              </span>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 rounded-full bg-[#84CC16] hover:bg-[#9ee238] text-[#09090B] text-xs font-bold shrink-0 transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Klaim via WA</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
