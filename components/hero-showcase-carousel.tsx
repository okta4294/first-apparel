"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export interface ShowcaseDesign {
  id: number;
  title: string;
  category: string;
  description?: string | null;
  badge?: string;
  imageUrl?: string | null;
}

const DEFAULT_DESIGNS: ShowcaseDesign[] = [
  {
    id: 1,
    title: "SERI JERSEY ESPORT & FUTSAL",
    category: "ESPORTS & FUTSAL",
    description: "Sublimasi Full Print HD • Dryfit Brazil Original",
    badge: "PORTOFOLIO TERBARU",
  },
];

interface HeroShowcaseCarouselProps {
  items?: ShowcaseDesign[];
}

export function HeroShowcaseCarousel({ items }: HeroShowcaseCarouselProps) {
  const withImages = items?.filter((item) => Boolean(item.imageUrl)) ?? [];
  const designs =
    withImages.length > 0
      ? withImages
      : items && items.length > 0
        ? items
        : DEFAULT_DESIGNS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (isPaused || designs.length <= 1) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % designs.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, designs.length]);

  const safeIndex = currentIndex % designs.length;

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
      setCurrentIndex((prev) => (prev + 1) % designs.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentIndex((prev) => (prev - 1 + designs.length) % designs.length);
    }
  };

  const hasAnyImage = designs.some((d) => Boolean(d.imageUrl));

  return (
    <div
      className="relative w-full aspect-[3/4] max-h-[78vh] lg:aspect-auto lg:max-h-none lg:h-auto lg:absolute lg:inset-y-0 lg:right-0 lg:w-[56%] overflow-hidden bg-[#121815]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {hasAnyImage ? (
        designs.map((design, idx) =>
          design.imageUrl ? (
            <div
              key={design.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                idx === safeIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
              aria-hidden={idx !== safeIndex}
            >
              <Image
                src={design.imageUrl}
                alt={design.title}
                fill
                preload={idx === 0}
                fetchPriority={idx === 0 ? "high" : "auto"}
                loading={idx === 0 ? "eager" : "lazy"}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          ) : null
        )
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#14291C] via-[#101813] to-[#0B100D]" />
      )}

      {/* Gradasi halus menyambungkan area teks kiri ke gambar penuh di kanan */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0B100D] via-[#0B100D]/85 via-28% to-transparent"
      />
      <div
        aria-hidden="true"
        className="hidden lg:block absolute inset-x-0 bottom-0 h-24 z-10 pointer-events-none bg-gradient-to-t from-[#0B100D]/80 to-transparent"
      />
      <div
        aria-hidden="true"
        className="lg:hidden absolute inset-x-0 bottom-0 h-20 z-10 pointer-events-none bg-gradient-to-t from-[#0B100D] via-[#0B100D]/55 to-transparent"
      />

      {designs.length > 1 && (
        <div
          className="absolute bottom-4 right-5 z-20 flex items-center gap-1"
          role="group"
          aria-label="Navigasi pratinjau desain"
        >
          {designs.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className="min-w-[28px] min-h-[32px] flex items-center justify-center px-1 group/dot"
              aria-label={`Tampilkan desain ke-${idx + 1}`}
              aria-current={idx === safeIndex ? "true" : undefined}
            >
              <span
                className={`h-1.5 rounded-full transition-all block ${
                  idx === safeIndex
                    ? "w-6 bg-[#84CC16]"
                    : "w-1.5 bg-white/40 group-hover/dot:bg-white/75"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
