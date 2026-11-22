"use client";

import Image from "next/image";

interface SizeChartDisplayProps {
  imageUrl: string | null;
  waNumber: string;
  storeName: string;
}

export function SizeChartDisplay({ imageUrl, waNumber, storeName }: SizeChartDisplayProps) {
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin konsultasi ukuran khusus (size chart) untuk jersey tim kami.`
  )}`;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Gambar Panduan Ukuran Resmi dari Pengaturan Toko */}
      <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-4 sm:p-6 overflow-hidden">
        {imageUrl ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#27272A] bg-[#09090B] overflow-hidden flex items-center justify-center p-2 sm:p-4">
              <Image
                src={imageUrl}
                alt={`Panduan Ukuran Resmi ${storeName}`}
                width={800}
                height={600}
                className="w-full h-auto max-h-[680px] object-contain rounded-lg"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#A1A1AA] px-1">
              <span>
                Standar potong jahit konveksi berkisar ±1 cm. Jika menyukai potongan longgar, disarankan naik 1 size.
              </span>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#84CC16] hover:underline font-semibold whitespace-nowrap shrink-0"
              >
                Buka Gambar Ukuran Penuh ↗
              </a>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <p className="text-sm font-semibold text-[#FAFAFA]">
              Gambar Size Chart Belum Tersedia
            </p>
            <p className="text-xs text-[#71717A]">
              Admin belum mengunggah gambar panduan ukuran di menu Pengaturan Toko.
            </p>
          </div>
        )}
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
    </div>
  );
}
