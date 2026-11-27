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
    <div className="space-y-6">
      {/* 1. Gambar Panduan Ukuran Resmi dari Pengaturan Toko */}
      <div className="rounded-xl bg-[#141B17] border border-[#26332B] p-4 sm:p-6 overflow-hidden">
        {imageUrl ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#243129] bg-[#0B100D] overflow-hidden flex items-center justify-center p-2 sm:p-4">
              <Image
                src={imageUrl}
                alt={`Panduan Ukuran Resmi ${storeName}`}
                width={800}
                height={600}
                className="w-full h-auto max-h-[680px] object-contain rounded-lg"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[#A4B0A8] px-1">
              <span>
                Standar potong jahit konveksi berkisar ±1 cm. Jika menyukai potongan longgar, disarankan naik 1 size.
              </span>
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A3E635] hover:text-[#BEF264] hover:underline font-semibold whitespace-nowrap shrink-0"
              >
                Buka Gambar Ukuran Penuh ↗
              </a>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <p className="text-base font-semibold text-[#F4F3EE]">
              Gambar Size Chart Belum Tersedia
            </p>
            <p className="text-sm text-[#95A39A]">
              Admin belum mengunggah gambar panduan ukuran di menu Pengaturan Toko.
            </p>
          </div>
        )}
      </div>

      {/* 2. Banner Bantuan Ukuran via WA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-xl bg-[#191714] border border-[#2E2A24]">
        <div>
          <span className="font-semibold text-sm sm:text-base text-[#F4F3EE] block">
            Ada pemain dengan ukuran jumbo (4XL ke atas) atau ukuran anak-anak?
          </span>
          <span className="text-sm text-[#B5AEA4] mt-1 block">
            Kami siap memproduksi ukuran custom sesuai kebutuhan tim Anda tanpa batasan.
          </span>
        </div>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center gap-2 px-5 py-2.5 rounded-lg bg-[#221F1B] hover:bg-[#2C2822] border border-[#353029] hover:border-[#E59A3C]/60 text-sm font-semibold text-[#E59A3C] transition-colors shrink-0"
        >
          <span>Konsultasi Ukuran Khusus via WA →</span>
        </a>
      </div>
    </div>
  );
}
