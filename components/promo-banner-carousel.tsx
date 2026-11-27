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
  if (!clean) return { main: "PROMO", sub: "Penawaran aktif" };

  const percentMatch = clean.match(/\d+\s*%/);
  if (percentMatch) {
    const main = percentMatch[0].replace(/\s+/g, "");
    const rest = clean.replace(percentMatch[0], "").trim();
    return { main, sub: rest || "Potongan harga" };
  }

  const words = clean.split(/\s+/);
  if (words.length >= 2) {
    return { main: words[0], sub: words.slice(1).join(" ") };
  }

  return { main: clean, sub: "Penawaran aktif" };
}

function formatDurationRange(promo: PromoItem): string {
  if (!promo.hasDuration) return "Penawaran terbatas";

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
      return `${shortFmt.format(start)} – ${fullFmt.format(end)}`;
    }
    return `${fullFmt.format(start)} – ${fullFmt.format(end)}`;
  }

  if (promo.endDate) {
    return `Berlaku s/d ${fullFmt.format(new Date(promo.endDate))}`;
  }

  return "Penawaran terbatas";
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
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#0B100D]"
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
          className="relative w-full overflow-hidden rounded-xl bg-[#14291C] border border-[#234530]"
        >
          <div className="relative">
            {activePromo.imageUrl ? (
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
                    loading={safeIndex === 0 ? "eager" : "lazy"}
                    className="w-full h-auto block transition-opacity duration-500"
                  />
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 absolute bottom-4 right-4 z-20 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] text-[#111C14] text-sm font-bold transition-transform group-hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6F5F0]"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>Klaim via WA</span>
                </a>
              </div>
            ) : (
              <div className="relative w-full min-h-[260px] sm:min-h-[300px] flex items-center bg-[#15331E]">
                <div className="relative z-10 w-full px-6 sm:px-14 lg:px-16 py-10 sm:py-12">
                  <div className="max-w-3xl space-y-4 sm:space-y-5">
                    <p className="text-sm font-medium text-[#A3E635]">
                      Promo aktif First Apparel · {durationLabel}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7">
                      <div className="shrink-0">
                        <p className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl font-black tracking-tight leading-none text-[#84CC16] tabular-nums">
                          {highlightMain}
                        </p>
                        <p className="text-xs font-semibold text-[#C7D4CA] mt-1.5">
                          {highlightSub}
                        </p>
                      </div>

                      <div
                        className="hidden sm:block w-px self-stretch bg-[#274B32]"
                        aria-hidden="true"
                      />

                      <div className="min-w-0">
                        <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-[-0.025em] leading-tight text-[#F6F5F0] [text-wrap:balance]">
                          {activePromo.title}
                        </h2>
                        {activePromo.label && (
                          <p className="text-sm sm:text-base text-[#C7D4CA] mt-1.5 leading-relaxed line-clamp-2 max-w-[52ch]">
                            {activePromo.label}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-1">
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] text-[#111C14] text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F6F5F0]"
                      >
                        <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                        <span>Klaim Promo via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Promo sebelumnya"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#15331E]/85 hover:bg-[#15331E] text-[#F6F5F0] border border-white/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Promo berikutnya"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#15331E]/85 hover:bg-[#15331E] text-[#F6F5F0] border border-white/15 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </>
            )}

            {total > 1 && (
              <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-1.5">
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
                            ? "w-5 h-1.5 bg-[#84CC16]"
                            : "w-1.5 h-1.5 bg-white/45 hover:bg-white/75"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {activePromo.imageUrl && (
            <div className="sm:hidden flex items-center justify-between gap-3 px-4 py-3 bg-[#15331E] border-t border-[#274B32]">
              <span className="text-xs font-medium text-[#F6F5F0] truncate">
                {activePromo.title}
              </span>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] text-[#111C14] text-xs font-bold shrink-0 transition-colors"
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
