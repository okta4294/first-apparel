"use client";

import { useState } from "react";

interface SizeChartTriggerProps {
  title: string;
  sizeChartUrl: string;
}

export function SizeChartTrigger({ title, sizeChartUrl }: SizeChartTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#181920] hover:bg-[#20212B] text-[#D4D4D8] hover:text-[#84CC16] border border-[#27272A] hover:border-[#84CC16]/40 text-[11px] font-semibold transition-all mb-2 shadow-sm"
      >
        <svg className="w-3.5 h-3.5 text-[#84CC16]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>Lihat Panduan Ukuran (Size Chart)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090B]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#141418] border border-[#27272A] rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📐</span>
                <h3 className="text-sm font-bold text-[#FAFAFA]">
                  Panduan Ukuran (Size Chart) — {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#181920] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto rounded-xl border border-[#27272A] bg-[#09090B] flex items-center justify-center p-3">
              <img
                src={sizeChartUrl}
                alt={`Size chart ${title}`}
                className="max-w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#71717A]">
                Format resolusi tinggi. Pastikan mengukur sebelum konfirmasi pesanan.
              </span>
              <a
                href={sizeChartUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#84CC16] hover:underline font-semibold"
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
