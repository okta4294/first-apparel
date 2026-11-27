"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface FeaturedCatalogItem {
  id: number;
  title: string;
  description: string | null;
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
  const scrollRafRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(catalogs.length > 1);

  const syncScrollState = useCallback(() => {
    if (scrollRafRef.current !== null) return;
    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
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
    });
  }, []);

  useEffect(() => {
    window.addEventListener("resize", syncScrollState, { passive: true });
    return () => {
      window.removeEventListener("resize", syncScrollState);
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
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
      className="py-20 sm:py-28 bg-[#121815] scroll-mt-20"
      aria-label="Portofolio Model Jersey"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Seksi & Kontrol Navigasi */}
        <div className="mb-10 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.08] text-[#F4F3EE]">
              Portofolio
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
            <Link
              href="/katalog"
              className="text-sm font-semibold text-[#A3E635] underline decoration-[#84CC16]/60 underline-offset-4 hover:text-[#BEF264] transition-colors inline-flex items-center gap-1"
            >
              <span>Lihat Semua Katalog Model</span>
              <span aria-hidden="true">→</span>
            </Link>

            {catalogs.length > 1 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-semibold tabular-nums text-[#95A39A] mr-1">
                  {activeIndex + 1} / {catalogs.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={!canScrollPrev}
                  aria-label="Model jersey sebelumnya"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#28352D] bg-[#19211C] text-[#F4F3EE] hover:border-[#84CC16] hover:text-[#A3E635] disabled:opacity-35 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
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
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#28352D] bg-[#19211C] text-[#F4F3EE] hover:border-[#84CC16] hover:text-[#A3E635] disabled:opacity-35 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
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

        {/* Track Horizontal: 3 Berjejer di Desktop, 2 di Tablet, 1 Mengintip di Mobile */}
        <div
          ref={trackRef}
          onScroll={syncScrollState}
          role="region"
          aria-roledescription="carousel"
          aria-label="Daftar model jersey populer"
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {catalogs.map((item, idx) => {
            const isBestSeller = idx === 0;
            const rawDesc = item.description?.trim() || "";
            const hasDesc = Boolean(rawDesc && rawDesc !== "-");
            const detailHref = hasRealData ? `/katalog/${item.id}` : "/katalog";

            return (
              <Link
                key={item.id}
                href={detailHref}
                className="group shrink-0 snap-start block w-[82%] max-w-[320px] sm:max-w-none sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {/* Visual Produk Bersih (3:4) */}
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#19211C] border border-[#28352D]">
                  {isBestSeller && (
                    <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B100D]/90 border border-[#28352D] text-[#F4F3EE] text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" aria-hidden="true" />
                      Terlaris
                    </span>
                  )}

                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 82vw"
                      loading={idx < 3 ? "eager" : "lazy"}
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-center p-4 bg-[#19211C]">
                      <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[#F4F3EE]">
                        {item.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Produk Ringkas di Bawah Gambar */}
                <div className="pt-3.5 space-y-1">
                  <h3 className="text-base font-bold text-[#F4F3EE] leading-snug line-clamp-1 group-hover:text-[#A3E635] transition-colors">
                    {item.title}
                  </h3>
                  {hasDesc && (
                    <p className="text-sm text-[#95A39A] line-clamp-2 leading-relaxed">
                      {rawDesc}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Indikator Slide di Bawah */}
        {catalogs.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {catalogs.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Lihat model jersey ${idx + 1}: ${item.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className="inline-flex items-center justify-center min-w-[32px] min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16] rounded-full"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      isActive ? "w-7 bg-[#84CC16]" : "w-2 bg-[#2F3E35]"
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
