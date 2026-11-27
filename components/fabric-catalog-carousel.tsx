"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface PublicFabricItem {
  id: number;
  name: string;
  badge?: string | null;
  gsm?: string | null;
  recommendation?: string | null;
  imageUrl?: string | null;
  description: string;
}

interface FabricCatalogCarouselProps {
  fabrics: PublicFabricItem[];
}

const DEFAULT_FABRICS: PublicFabricItem[] = [
  {
    id: -1,
    name: "Dry-Fit Milano",
    badge: "Best Seller",
    gsm: "145-155 gsm",
    recommendation: "Futsal, Sepak Bola, Mini Soccer",
    imageUrl: null,
    description:
      "Tekstur pori zig-zag elegan, lembut di kulit, sirkulasi udara sangat cepat, dan jatuh dengan rapi saat dipakai.",
  },
  {
    id: -2,
    name: "Dry-Fit Embos",
    badge: "Premium Look",
    gsm: "150-160 gsm",
    recommendation: "Jersey Kompetisi, Esport, Kontingen",
    imageUrl: null,
    description:
      "Memiliki motif timbul 3D mewah di permukaan kain, tebal namun tetap sejuk dan terlihat eksklusif seperti jersey liga pro.",
  },
  {
    id: -3,
    name: "Dry-Fit Brazil / Jarum",
    badge: "Ultra Light",
    gsm: "130-140 gsm",
    recommendation: "Running, Sepeda, Badminton, Voli",
    imageUrl: null,
    description:
      "Pori-pori mikro titik jarum yang sangat ringan dan cepat melepas panas tubuh pada aktivitas intensitas tinggi.",
  },
  {
    id: -4,
    name: "Dry-Fit Serena",
    badge: "Smooth & Stretch",
    gsm: "140-150 gsm",
    recommendation: "Seragam Event, Komunitas, Esport",
    imageUrl: null,
    description:
      "Permukaan rata halus, elastis, dan padat sehingga detail garis desain kecil maupun logo instansi terlihat sangat tajam.",
  },
];

const BADGE_PALETTES = [
  "bg-[#2C1E14] text-[#F2B366] border-[#4A3220]",
  "bg-[#172B1B] text-[#A3E635] border-[#2B4E31]",
  "bg-[#12262E] text-[#7DD3E8] border-[#1F424F]",
  "bg-[#2A2416] text-[#E6C574] border-[#463B22]",
];

function formatGsm(raw?: string | null): string | null {
  const clean = raw?.trim();
  if (!clean) return null;
  return /gsm$/i.test(clean) ? clean : `${clean} gsm`;
}

function getBadgeStyle(badge: string, index: number): string {
  const lower = badge.toLowerCase();
  if (lower.includes("best") || lower.includes("favorit") || lower.includes("populer")) {
    return BADGE_PALETTES[0];
  }
  if (lower.includes("premium") || lower.includes("pro") || lower.includes("unggulan")) {
    return BADGE_PALETTES[1];
  }
  if (lower.includes("light") || lower.includes("ringan") || lower.includes("sejuk")) {
    return BADGE_PALETTES[2];
  }
  if (lower.includes("smooth") || lower.includes("stretch") || lower.includes("halus")) {
    return BADGE_PALETTES[3];
  }
  return BADGE_PALETTES[index % BADGE_PALETTES.length];
}

function FabricZoomImage({ src, name }: { src: string; name: string }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const updateOriginFromClient = (
    el: HTMLDivElement,
    clientX: number,
    clientY: number
  ) => {
    const imgEl = imgRef.current;
    if (!imgEl) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    imgEl.style.transformOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
  };

  return (
    <div
      onMouseEnter={(e) => {
        updateOriginFromClient(e.currentTarget, e.clientX, e.clientY);
        setIsZoomed(true);
      }}
      onMouseMove={(e) => {
        updateOriginFromClient(e.currentTarget, e.clientX, e.clientY);
      }}
      onMouseLeave={() => {
        setIsZoomed(false);
        if (imgRef.current) {
          imgRef.current.style.transformOrigin = "50% 50%";
        }
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") {
          if (isZoomed) {
            setIsZoomed(false);
            if (imgRef.current) {
              imgRef.current.style.transformOrigin = "50% 50%";
            }
          } else {
            updateOriginFromClient(e.currentTarget, e.clientX, e.clientY);
            setIsZoomed(true);
          }
        }
      }}
      className="relative w-full aspect-[4/3] overflow-hidden bg-[#0D1310] border-b border-[#243129] cursor-zoom-in select-none"
    >
      <Image
        ref={imgRef}
        src={src}
        alt={`Tekstur detail kain ${name}`}
        fill
        sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 84vw"
        className={`object-cover object-center transition-transform duration-300 ease-out ${
          isZoomed ? "will-change-transform" : ""
        }`}
        style={{
          transformOrigin: "50% 50%",
          transform: isZoomed ? "scale(1.65)" : "scale(1)",
        }}
      />
    </div>
  );
}

export function FabricCatalogCarousel({ fabrics }: FabricCatalogCarouselProps) {
  const displayFabrics = fabrics.length > 0 ? fabrics : DEFAULT_FABRICS;

  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(displayFabrics.length > 1);

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
  }, [syncScrollState, displayFabrics.length]);

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

  return (
    <section
      id="katalog-bahan"
      className="py-20 sm:py-28 bg-[#0B100D] scroll-mt-20"
      aria-label="Katalog Material Kain"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Asimetris */}
        <div className="mb-10 sm:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E59A3C]">
              Katalog Material Kain
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.12] [text-wrap:balance] text-[#F4F3EE]">
              Pilih Karakter Kain Sesuai Cabang Olahraga Anda
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end justify-between gap-4 max-w-md">
            <p className="text-sm text-[#A4B0A8] leading-relaxed lg:text-right">
              Semua kain telah melewati uji penyerapan tinta sublimasi untuk menghasilkan warna paling pekat dan cerah.
            </p>

            {displayFabrics.length > 1 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-semibold tabular-nums text-[#95A39A] mr-1">
                  {activeIndex + 1} / {displayFabrics.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={!canScrollPrev}
                  aria-label="Bahan kain sebelumnya"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#26332B] bg-[#141B17] text-[#F4F3EE] hover:border-[#84CC16] hover:text-[#A3E635] disabled:opacity-35 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
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
                  aria-label="Bahan kain berikutnya"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#26332B] bg-[#141B17] text-[#F4F3EE] hover:border-[#84CC16] hover:text-[#A3E635] disabled:opacity-35 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
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

        {/* Track Horizontal */}
        <div
          ref={trackRef}
          onScroll={syncScrollState}
          role="region"
          aria-roledescription="carousel"
          aria-label="Daftar jenis bahan kain"
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayFabrics.map((item, idx) => (
            <article
              key={item.id}
              className="shrink-0 snap-start w-[84%] max-w-[340px] sm:max-w-none sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] rounded-xl bg-[#141B17] border border-[#243129] overflow-hidden flex flex-col justify-between transition-colors hover:border-[#364B3E]"
            >
              <div>
                {item.imageUrl ? (
                  <FabricZoomImage src={item.imageUrl} name={item.name} />
                ) : (
                  <div className="relative w-full aspect-[4/3] bg-[#19211C] border-b border-[#243129] flex flex-col items-center justify-center gap-1.5 text-center px-6">
                    <span className="font-[family-name:var(--font-display)] text-lg font-extrabold text-[#F4F3EE]">
                      {item.name}
                    </span>
                    {formatGsm(item.gsm) && (
                      <span className="text-xs font-mono font-medium text-[#95A39A]">
                        {formatGsm(item.gsm)}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6 space-y-4">
                  {(item.badge || item.gsm) && (
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {item.badge ? (
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getBadgeStyle(
                            item.badge,
                            idx
                          )}`}
                        >
                          {item.badge}
                        </span>
                      ) : (
                        <span />
                      )}
                      {formatGsm(item.gsm) && (
                        <span className="text-xs font-mono font-medium tabular-nums text-[#95A39A]">
                          {formatGsm(item.gsm)}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-[-0.02em] text-[#F4F3EE] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[15px] text-[#A4B0A8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {item.recommendation && (
                <div className="px-6 pb-6 pt-3.5 border-t border-[#222E26]">
                  <p className="text-xs font-bold text-[#A3E635] mb-1">
                    Rekomendasi:
                  </p>
                  <p className="text-sm font-medium text-[#E5E7E3] leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Indikator Slide di Bawah */}
        {displayFabrics.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {displayFabrics.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Lihat kain ${idx + 1}: ${item.name}`}
                  aria-current={isActive ? "true" : undefined}
                  className="inline-flex items-center justify-center min-w-[32px] min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16] rounded-full"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      isActive ? "w-7 bg-[#84CC16]" : "w-2 bg-[#2A3830]"
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
