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
    <div className="w-full max-w-[460px] mx-auto lg:mx-0 space-y-3">
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#141B17] border border-[#26332B]">
        {current?.url ? (
          <Image
            src={current.url}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 460px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-[#95A39A] bg-[#141B17]">
            Foto belum tersedia
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {images.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.key || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Tampilkan foto ${idx + 1}`}
                aria-pressed={isSelected}
                className={`relative w-14 sm:w-16 aspect-[3/4] rounded-lg overflow-hidden border shrink-0 transition-all ${
                  isSelected
                    ? "border-[#84CC16] ring-2 ring-[#84CC16]/35"
                    : "border-[#26332B] opacity-65 hover:opacity-100"
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
