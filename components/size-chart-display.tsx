"use client";

import { useState, useEffect, useCallback } from "react";

interface SizeChartDisplayProps {
  imageUrl: string | null;
  waNumber: string;
  storeName: string;
}

const standardSizes = [
  { size: "XS", width: "46 cm", length: "66 cm", weight: "40 - 50 kg" },
  { size: "S", width: "48 cm", length: "68 cm", weight: "50 - 60 kg" },
  { size: "M", width: "50 cm", length: "70 cm", weight: "60 - 70 kg" },
  { size: "L", width: "52 cm", length: "72 cm", weight: "70 - 80 kg" },
  { size: "XL", width: "54 cm", length: "74 cm", weight: "80 - 90 kg" },
  { size: "XXL", width: "56 cm", length: "76 cm", weight: "90 - 100 kg" },
  { size: "3XL", width: "58 cm", length: "78 cm", weight: "> 100 kg" },
];

export function SizeChartDisplay({ imageUrl, waNumber, storeName }: SizeChartDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Penanganan tombol keyboard Escape untuk menutup modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin konsultasi ukuran khusus (size chart) untuk jersey tim kami.`
  )}`;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Tabel HTML Ukuran Standar Jersey */}
      <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-5 sm:p-7 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#27272A]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#84CC16]/10 text-[#84CC16] text-[11px] font-bold tracking-wider uppercase mb-1">
              Standar Ukuran Lokal Dewasa
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#FAFAFA]">
              Tabel Ukuran Jersey Olahraga (Regular Fit)
            </h3>
          </div>

          {imageUrl && (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181920] hover:bg-[#1F2026] text-[#FAFAFA] border border-[#27272A] text-xs font-semibold transition-all hover:border-[#84CC16]/50 shrink-0"
            >
              <svg className="w-4 h-4 text-[#84CC16]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Lihat Gambar Diagram Toko</span>
            </button>
          )}
        </div>

        {/* Tabel Data Responsif */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#09090B] text-[#A1A1AA] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Lebar Dada (A)</th>
                <th className="py-3 px-4">Panjang Baju (B)</th>
                <th className="py-3 px-4">Estimasi Berat Badan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2026] text-[#D4D4D8]">
              {standardSizes.map((item) => (
                <tr key={item.size} className="hover:bg-[#181920] transition-colors">
                  <td className="py-3 px-4 font-black text-[#84CC16]">{item.size}</td>
                  <td className="py-3 px-4 font-medium text-[#FAFAFA]">{item.width}</td>
                  <td className="py-3 px-4 font-medium text-[#FAFAFA]">{item.length}</td>
                  <td className="py-3 px-4 text-[#A1A1AA]">{item.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panduan Pengukuran & Catatan Toleransi */}
        <div className="mt-5 pt-4 border-t border-[#1F2026] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#A1A1AA]">
          <div className="flex items-start gap-2">
            <span className="text-[#84CC16] font-bold">📏</span>
            <span>
              <strong>Cara Ukur:</strong> Lebar dada diukur dari bawah ketiak kiri ke ketiak kanan. Panjang diukur dari bahu samping kerah hingga ujung bawah jersey.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[#84CC16] font-bold">ℹ️</span>
            <span>
              <strong>Toleransi Jahit:</strong> Standar potong jahit konveksi berkisar ±1 cm. Jika menyukai potongan longgar (*loose fit*), disarankan naik 1 size.
            </span>
          </div>
        </div>
      </div>

      {/* 2. Banner Bantuan Ukuran via WA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#09090B] border border-[#27272A] text-center sm:text-left">
        <div>
          <span className="font-semibold text-xs text-[#FAFAFA] block">
            Ada pemain dengan ukuran jumbo (4XL ke atas) atau ukuran anak-anak?
          </span>
          <span className="text-[11px] text-[#71717A] mt-0.5 block">
            Kami siap memproduksi ukuran custom sesuai kebutuhan tim Anda tanpa batasan.
          </span>
        </div>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#181920] hover:bg-[#1F2026] border border-[#27272A] text-xs font-bold text-[#84CC16] hover:border-[#84CC16]/40 transition-all shrink-0"
        >
          <span>Konsultasi Ukuran Khusus via WA →</span>
        </a>
      </div>

      {/* 3. Modal Gambar Size Chart Resmi */}
      {isOpen && imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-2xl bg-[#141418] border border-[#27272A] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header Modal */}
            <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#FAFAFA]">
                  Panduan Gambar Size Chart Resmi ({storeName})
                </h3>
                <span className="text-[11px] text-[#A1A1AA]">
                  Tekan Esc atau klik area luar untuk menutup
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#1F2026] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1A1B22] flex items-center justify-center text-sm font-bold transition-colors"
                aria-label="Tutup pratinjau gambar"
              >
                ✕
              </button>
            </div>

            {/* Gambar Besar */}
            <div className="p-4 sm:p-6 flex-1 overflow-auto bg-[#09090B] flex items-center justify-center">
              <img
                src={imageUrl}
                alt={`Size Chart ${storeName}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Footer Modal */}
            <div className="p-3 sm:p-4 border-t border-[#27272A] bg-[#141418] flex items-center justify-between text-xs text-[#71717A]">
              <span>Gunakan acuan ini saat mendata nama dan nomor punggung pemain.</span>
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
    </div>
  );
}
