"use client";

import { useState } from "react";

interface SizeChartDisplayProps {
  imageUrl: string | null;
  waNumber: string;
  storeName: string;
}

export function SizeChartDisplay({ imageUrl, waNumber, storeName }: SizeChartDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin meminta panduan dan detail tabel ukuran (Size Chart) untuk pemesanan jersey tim saya.`
  )}`;

  if (!imageUrl) {
    return (
      <div className="rounded-3xl border border-dashed border-[#3F3F46] bg-[#141418] p-10 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] text-2xl mx-auto mb-4">
          📏
        </div>
        <h3 className="text-lg font-bold text-[#FAFAFA] mb-2">
          Gambar Size Chart Resmi Toko
        </h3>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto leading-relaxed mb-6">
          Admin toko dapat mengunggah gambar Size Chart resmi melalui Panel Admin (Pengaturan Toko). Anda juga dapat langsung berkonsultasi mengenai detail ukuran via WhatsApp.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-bold hover:bg-[#9ee238] transition-colors"
        >
          <span>Tanya Detail Ukuran via WhatsApp</span>
          <span>→</span>
        </a>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <div
          onClick={() => setIsOpen(true)}
          className="group relative cursor-pointer rounded-2xl overflow-hidden border border-[#27272A] bg-[#141418] hover:border-[#84CC16]/60 hover:shadow-[0_0_35px_rgba(132,204,22,0.15)] transition-all p-3 sm:p-4 text-center"
        >
          <div className="relative overflow-hidden rounded-xl bg-[#09090B]">
            <img
              src={imageUrl}
              alt={`Size Chart ${storeName}`}
              className="w-full max-h-[520px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {/* Overlay Hover Badge */}
            <div className="absolute inset-0 bg-[#09090B]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-bold shadow-lg">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
                <span>Klik untuk Memperbesar Gambar</span>
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-2 text-[11px] text-[#71717A]">
            <span>*Toleransi pemotongan jahit ±1 cm</span>
            <span className="text-[#84CC16] font-medium flex items-center gap-1">
              🔍 Ketuk untuk perbesar
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox Pop-up Modal Saat Gambar Diklik */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-[#09090B]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col rounded-2xl bg-[#141418] border border-[#27272A] overflow-hidden shadow-2xl"
          >
            {/* Header Modal */}
            <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#FAFAFA]">
                  Panduan Ukuran Resmi ({storeName})
                </h3>
                <span className="text-[11px] text-[#A1A1AA]">
                  Gunakan ukuran ini sebagai acuan pengisian data pemain tim Anda.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1F1F24] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Gambar Besar */}
            <div className="p-4 sm:p-6 flex-1 overflow-auto bg-[#09090B] flex items-center justify-center">
              <img
                src={imageUrl}
                alt={`Size Chart ${storeName}`}
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
              />
            </div>

            {/* Footer Modal */}
            <div className="p-3 sm:p-4 border-t border-[#27272A] bg-[#141418] flex items-center justify-between text-xs text-[#71717A]">
              <span>Tekan area luar atau tombol ✕ untuk menutup.</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#27272A] text-[#FAFAFA] font-medium hover:bg-[#3F3F46] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
