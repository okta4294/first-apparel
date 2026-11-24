"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface FeaturedCatalogItem {
  id: number;
  title: string;
  fabric: string;
  priceInfo: string | null;
  imageUrl: string;
}

interface FeaturedCatalogCarouselProps {
  catalogs: FeaturedCatalogItem[];
  hasRealData: boolean;
}

export function FeaturedCatalogCarousel({
  catalogs,
  hasRealData,
}: FeaturedCatalogCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(catalogs.length > 1);

  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft < maxScroll - 4);

    const slides = Array.from(el.children) as HTMLElement[];
    if (slides.length === 0) return;

    let closestIdx = 0;
    let minDistance = Infinity;
    for (let i = 0; i < slides.length; i++) {
      const distance = Math.abs(slides[i].offsetLeft - el.scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = i;
      }
    }
    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", syncScrollState, { passive: true });
    return () => window.removeEventListener("resize", syncScrollState);
  }, [syncScrollState, catalogs.length]);

  const scrollToSlide = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const slides = Array.from(el.children) as HTMLElement[];
    const target = slides[index];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, []);

  const handleStep = useCallback(
    (direction: -1 | 1) => {
      const el = trackRef.current;
      if (!el) return;
      const slides = Array.from(el.children) as HTMLElement[];
      if (slides.length === 0) return;
      const nextIndex = Math.min(
        slides.length - 1,
        Math.max(0, activeIndex + direction)
      );
      scrollToSlide(nextIndex);
    },
    [activeIndex, scrollToSlide]
  );

  if (!catalogs || catalogs.length === 0) return null;

  return (
    <section
      id="katalog"
      className="py-16 sm:py-20 border-b border-[#E2E8F0] dark:border-[#27272A]"
      aria-label="Pilihan Model Jersey Populer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Seksi & Kontrol Navigasi Carousel */}
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div data-animate="text-reveal">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA]">
              Pilihan Model Jersey Populer
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
            <Link
              href="/katalog"
              className="text-sm font-semibold text-[#4D7C0F] dark:text-[#84CC16] hover:text-[#365314] dark:hover:text-[#9ee238] transition-colors inline-flex items-center gap-1"
            >
              Lihat Semua Katalog Model →
            </Link>

            {catalogs.length > 1 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold tabular-nums text-[#64748B] dark:text-[#71717A] mr-1">
                  {activeIndex + 1} / {catalogs.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={!canScrollPrev}
                  aria-label="Model jersey sebelumnya"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#CBD5E1] dark:border-[#27272A] bg-white dark:bg-[#141418] text-[#0F172A] dark:text-[#FAFAFA] hover:border-[#65A30D] dark:hover:border-[#84CC16] hover:text-[#4D7C0F] dark:hover:text-[#84CC16] disabled:opacity-35 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65A30D] dark:focus-visible:outline-[#84CC16]"
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
                  onClick={() => handleStep(1)}
                  disabled={!canScrollNext}
                  aria-label="Model jersey berikutnya"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-[#CBD5E1] dark:border-[#27272A] bg-white dark:bg-[#141418] text-[#0F172A] dark:text-[#FAFAFA] hover:border-[#65A30D] dark:hover:border-[#84CC16] hover:text-[#4D7C0F] dark:hover:text-[#84CC16] disabled:opacity-35 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65A30D] dark:focus-visible:outline-[#84CC16]"
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
              </div>
            )}
          </div>
        </div>

        {/* Track Carousel Horizontal: 3 Berjejer di Desktop, 2 di Tablet, 1 Mengintip di Mobile */}
        <div
          ref={trackRef}
          onScroll={syncScrollState}
          role="region"
          aria-roledescription="carousel"
          aria-label="Daftar model jersey populer"
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {catalogs.map((item, idx) => {
            const isBestSeller = idx === 0;
            const rawPrice = item.priceInfo?.trim() || "";
            const hasPrice = Boolean(rawPrice && rawPrice !== "-");
            const cleanPrice = hasPrice
              ? rawPrice.replace(/mulai\s*/i, "").replace(/\/.*$/, "").trim()
              : "";
            const detailHref = hasRealData ? `/katalog/${item.id}` : "/katalog";

            return (
              <Link
                key={item.id}
                href={detailHref}
                className="group shrink-0 snap-start block w-[80%] max-w-[300px] sm:max-w-none sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
              >
                {/* Visual Produk Bersih (3:4) */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#F1F5F9] dark:bg-[#141418]">
                  {isBestSeller && (
                    <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-md bg-[#65A30D] dark:bg-[#84CC16] text-white dark:text-[#09090B] text-[10px] font-bold tracking-wide uppercase shadow-sm">
                      Terlaris
                    </span>
                  )}

                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 80vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center p-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E2E8F0] dark:bg-[#181922] flex items-center justify-center text-[#4D7C0F] dark:text-[#84CC16]">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <span className="text-[11px] text-[#64748B] dark:text-[#A1A1AA] font-medium">
                        Pratinjau Produksi HD
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Produk Ringkas di Bawah Gambar */}
                <div className="pt-3 space-y-1">
                  <h3 className="text-sm font-medium text-[#0F172A] dark:text-[#FAFAFA] leading-snug line-clamp-2 group-hover:text-[#4D7C0F] dark:group-hover:text-[#84CC16] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-[#A1A1AA] truncate">
                    {item.fabric}
                  </p>
                  {hasPrice && cleanPrice && (
                    <div className="flex items-baseline gap-1 pt-0.5">
                      <span className="text-sm font-bold text-[#0F172A] dark:text-[#FAFAFA] tabular-nums">
                        {cleanPrice}
                      </span>
                      <span className="text-xs text-[#64748B] dark:text-[#71717A]">
                        / pcs
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Indikator Slide di Bawah Carousel */}
        {catalogs.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {catalogs.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Lihat model jersey ${idx + 1}: ${item.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className="inline-flex items-center justify-center min-w-[32px] min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65A30D] dark:focus-visible:outline-[#84CC16] rounded-full"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "w-7 bg-[#65A30D] dark:bg-[#84CC16]"
                        : "w-2 bg-[#CBD5E1] dark:bg-[#3F3F46]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
