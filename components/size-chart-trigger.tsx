"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SizeChartTriggerProps {
  title: string;
  sizeChartUrl: string;
  variant?: "dark" | "editorial";
}

export function SizeChartTrigger({
  title,
  sizeChartUrl,
  variant = "dark",
}: SizeChartTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isEditorial = variant === "editorial";

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const titleId = `size-chart-title-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          isEditorial
            ? "w-full min-h-[48px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#141B17] hover:bg-[#1B2620] text-[#F4F3EE] border border-[#26332B] hover:border-[#84CC16]/60 text-sm font-semibold transition-colors"
            : "w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#181920] hover:bg-[#20212B] text-[#D4D4D8] hover:text-[#84CC16] border border-[#27272A] hover:border-[#84CC16]/40 text-xs font-semibold transition-all mb-2 shadow-sm"
        }
      >
        <svg
          className={
            isEditorial
              ? "w-4 h-4 text-[#A3E635] shrink-0"
              : "w-4 h-4 text-[#84CC16] shrink-0"
          }
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>Lihat Panduan Ukuran</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-[#141915]/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={
              isEditorial
                ? "bg-[#121815] border border-[#26332B] rounded-xl max-w-2xl w-full p-5 space-y-4 shadow-2xl relative"
                : "bg-[#141418] border border-[#27272A] rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl relative"
            }
          >
            <div
              className={
                isEditorial
                  ? "flex items-center justify-between gap-3 border-b border-[#222E26] pb-3"
                  : "flex items-center justify-between gap-3 border-b border-[#27272A] pb-3"
              }
            >
              <h3
                id={titleId}
                className={
                  isEditorial
                    ? "text-base font-bold text-[#F4F3EE]"
                    : "text-sm font-bold text-[#FAFAFA]"
                }
              >
                Panduan Ukuran — {title}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Tutup panduan ukuran"
                className={
                  isEditorial
                    ? "min-w-[44px] min-h-[44px] rounded-lg bg-[#19211C] border border-[#28352D] text-[#A4B0A8] hover:text-[#F4F3EE] flex items-center justify-center text-sm font-bold transition-colors shrink-0"
                    : "min-w-[44px] min-h-[44px] rounded-lg bg-[#181920] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center justify-center text-sm font-bold transition-colors shrink-0"
                }
              >
                ✕
              </button>
            </div>

            <div
              className={
                isEditorial
                  ? "max-h-[65vh] overflow-auto rounded-lg border border-[#243129] bg-[#0B100D] flex items-center justify-center p-3"
                  : "max-h-[65vh] overflow-auto rounded-xl border border-[#27272A] bg-[#09090B] flex items-center justify-center p-3"
              }
            >
              <Image
                src={sizeChartUrl}
                alt={`Panduan ukuran ${title}`}
                width={800}
                height={600}
                className="max-w-full w-auto max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span
                className={
                  isEditorial
                    ? "text-xs text-[#95A39A]"
                    : "text-xs text-[#A1A1AA]"
                }
              >
                Format resolusi tinggi. Pastikan mengukur sebelum konfirmasi pesanan.
              </span>
              <a
                href={sizeChartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  isEditorial
                    ? "text-xs text-[#A3E635] hover:text-[#BEF264] hover:underline font-semibold"
                    : "text-xs text-[#84CC16] hover:underline font-semibold"
                }
              >
                Buka Gambar Penuh ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
