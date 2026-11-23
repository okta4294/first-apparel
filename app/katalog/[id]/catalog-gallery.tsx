"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  url: string;
  key: string;
}

export function CatalogGallery({
  title,
  images,
}: {
  title: string;
  images: GalleryImage[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = images[activeIndex] ?? images[0];

  return (
    <div className="w-full max-w-[420px] mx-auto space-y-3">
      <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F1F5F9] dark:bg-[#141418] border border-[#E2E8F0] dark:border-[#27272A]">
        {current?.url ? (
          <Image
            src={current.url}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#64748B] dark:text-[#A1A1AA]">
            Foto belum tersedia
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {images.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.key || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Tampilkan foto ${idx + 1}`}
                aria-pressed={isSelected}
                className={`relative w-12 sm:w-14 aspect-[3/4] rounded-lg overflow-hidden border shrink-0 transition-colors ${
                  isSelected
                    ? "border-[#65A30D] dark:border-[#84CC16] ring-2 ring-[#65A30D]/40 dark:ring-[#84CC16]/40"
                    : "border-[#CBD5E1] dark:border-[#27272A] opacity-65 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={`${title} foto ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
