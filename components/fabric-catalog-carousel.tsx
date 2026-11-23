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
  "bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3] dark:bg-[#4C1D1B] dark:text-[#FCA5A5] dark:border-[#7F1D1D]/60",
  "bg-[#ECFCCB] text-[#3F6212] border-[#D9F99D] dark:bg-[#2E3B14] dark:text-[#BEF264] dark:border-[#4D7C0F]/60",
  "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD] dark:bg-[#11314A] dark:text-[#7DD3FC] dark:border-[#0369A1]/60",
  "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF] dark:bg-[#2F1B4B] dark:text-[#D8B4FE] dark:border-[#6B21A8]/60",
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
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const updateOriginFromClient = (
    el: HTMLDivElement,
    clientX: number,
    clientY: number
  ) => {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setOrigin({ x, y });
  };

  return (
    <div
      onMouseEnter={(e) => {
        updateOriginFromClient(e.currentTarget, e.clientX, e.clientY);
        setIsZoomed(true);
      }}
      onMouseMove={(e) => {
        updateOriginFromClient(e.currentTarget, e.clientX, e.clientY);
        if (!isZoomed) setIsZoomed(true);
      }}
      onMouseLeave={() => {
        setIsZoomed(false);
        setOrigin({ x: 50, y: 50 });
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") {
          if (isZoomed) {
            setIsZoomed(false);
            setOrigin({ x: 50, y: 50 });
          } else {
            updateOriginFromClient(e.currentTarget, e.clientX, e.clientY);
            setIsZoomed(true);
          }
        }
      }}
      className="relative w-full aspect-[4/3] overflow-hidden bg-[#F1F5F9] dark:bg-[#0B0D12] border-b border-[#E2E8F0] dark:border-[#1E2433] cursor-zoom-in select-none"
    >
      <Image
        src={src}
        alt={`Tekstur detail kain ${name}`}
        fill
        sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 84vw"
        className="object-cover object-center transition-transform duration-300 ease-out will-change-transform"
        style={{
          transformOrigin: `${origin.x}% ${origin.y}%`,
          transform: isZoomed ? "scale(1.65)" : "scale(1)",
        }}
      />
    </div>
  );
}

export function FabricCatalogCarousel({ fabrics }: FabricCatalogCarouselProps) {
  const displayFabrics = fabrics.length > 0 ? fabrics : DEFAULT_FABRICS;

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(displayFabrics.length > 1);

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
    syncScrollState();
    window.addEventListener("resize", syncScrollState, { passive: true });
    return () => window.removeEventListener("resize", syncScrollState);
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
      className="py-16 sm:py-24 border-b border-[#E2E8F0] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#09090B]"
      aria-label="Katalog Material Kain"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Asimetris: Judul Kiri, Penjelasan & Kontrol Carousel Kanan */}
        <div className="mb-8 sm:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div data-animate="text-reveal" className="max-w-2xl space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#EA580C] dark:text-[#FB923C]">
              Katalog Material Kain
            </p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-[-0.03em] leading-[1.12] [text-wrap:balance] text-[#0F172A] dark:text-[#FAFAFA]">
              Pilih Karakter Kain Sesuai Cabang Olahraga Anda
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end justify-between gap-4 max-w-md">
            <p className="text-sm text-[#475569] dark:text-[#A1A1AA] leading-relaxed lg:text-right">
              Semua kain telah melewati uji penyerapan tinta sublimasi untuk menghasilkan warna paling pekat dan cerah.
            </p>

            {displayFabrics.length > 1 && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold tabular-nums text-[#64748B] dark:text-[#71717A] mr-1">
                  {activeIndex + 1} / {displayFabrics.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={!canScrollPrev}
                  aria-label="Bahan kain sebelumnya"
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
                  aria-label="Bahan kain berikutnya"
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
          aria-label="Daftar jenis bahan kain"
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayFabrics.map((item, idx) => (
            <article
              key={item.id}
              className="shrink-0 snap-start w-[84%] max-w-[340px] sm:max-w-none sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] rounded-2xl bg-white dark:bg-[#11131A] border border-[#E2E8F0] dark:border-[#1E2433] overflow-hidden flex flex-col justify-between transition-colors hover:border-[#CBD5E1] dark:hover:border-[#334155]"
            >
              <div>
                {/* Foto Tekstur Kain (Otomatis Zoom Mengikuti Kursor) */}
                {item.imageUrl ? (
                  <FabricZoomImage src={item.imageUrl} name={item.name} />
                ) : (
                  <div className="relative w-full aspect-[4/3] bg-[#F1F5F9] dark:bg-[#0D1017] border-b border-[#E2E8F0] dark:border-[#1E2433] flex flex-col items-center justify-center gap-2 text-center px-6">
                    <div className="w-10 h-10 rounded-xl bg-[#E2E8F0] dark:bg-[#181D29] flex items-center justify-center text-[#64748B] dark:text-[#71717A]">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-[#64748B] dark:text-[#71717A]">
                      Foto tekstur {item.name} segera hadir
                    </span>
                  </div>
                )}

                {/* Isi Detail Kain */}
                <div className="p-5 sm:p-6 space-y-4">
                  {(item.badge || item.gsm) && (
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {item.badge ? (
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${getBadgeStyle(
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
                        <span className="text-xs font-mono font-medium tabular-nums text-[#64748B] dark:text-[#94A3B8]">
                          {formatGsm(item.gsm)}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA] leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Rekomendasi Olahraga */}
              {item.recommendation && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-[#F1F5F9] dark:border-[#1E2433]/80">
                  <p className="text-xs font-bold text-[#4D7C0F] dark:text-[#84CC16] mb-1">
                    Rekomendasi:
                  </p>
                  <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Indikator Slide di Bawah Carousel */}
        {displayFabrics.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {displayFabrics.map((item, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Lihat kain ${idx + 1}: ${item.name}`}
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
