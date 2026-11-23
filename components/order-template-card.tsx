"use client";

import { useState } from "react";

interface OrderTemplateCardProps {
  waNumber: string;
  storeName: string;
}

type TemplateId = "order" | "rekap";
type CopyState = "idle" | "copied" | "error";

/**
 * Fungsi: Menyediakan dua template teks siap salin untuk mempermudah pemesanan
 *         (format order baru dan rekap data pemain satu tim).
 * Cara Kerja: Pengguna memilih tab template, menekan tombol salin (dengan fallback
 *             execCommand bila Clipboard API diblokir), lalu dapat langsung membuka
 *             WhatsApp dengan isi pesan yang sama.
 * Cara Penggunaan: `<OrderTemplateCard waNumber="628..." storeName="First Apparel" />`
 */
export function OrderTemplateCard({ waNumber, storeName }: OrderTemplateCardProps) {
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("order");
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const templateOptions: {
    id: TemplateId;
    label: string;
    title: string;
    description: string;
    text: string;
  }[] = [
    {
      id: "order",
      label: "Format Order",
      title: "Format Chat WhatsApp Siap Pakai",
      description:
        "Salin format ini atau bagikan ke grup tim Anda sebelum menghubungi admin WhatsApp kami.",
      text: `Halo Admin ${storeName}, saya ingin konsultasi dan order jersey tim dengan rincian berikut:

*Form Pemesanan Jersey:*
• Nama Tim: 
• Jumlah Jersey: ... pcs
• Pilihan Bahan: (Dryfit Milano / Brazil / Lainnya)
• Jenis Kerah: (O-Neck / V-Neck / Polo)
• File Desain: (Sudah ada / Minta bantuan desain)
• Target Selesai: (Tanggal/Bulan)`,
    },
    {
      id: "rekap",
      label: "Rekap Pemain",
      title: "Format Rekap Nama, Nomor & Size Pemain",
      description:
        "Tempel template ini di grup tim, isi bersama, lalu kirim ke admin. Bebas salah ketik nama punggung.",
      text: `Halo Admin ${storeName}, berikut rekap data pemain untuk jersey tim kami:

*Rekap Jersey Tim ...*
Format: No | Nama Punggung | Nomor | Size | Kain

1 | ANDI | 10 | L | Milano
2 | BUDI | 7 | M | Milano
3 | CANDRA | 4 | XL | Milano

• Total jersey: ... pcs
• Size khusus (4XL / anak): ...
• Catatan tambahan: ...`,
    },
  ];

  const active = templateOptions.find((option) => option.id === activeTemplate) ?? templateOptions[0];

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API tidak tersedia");
      }
      await navigator.clipboard.writeText(active.text);
      setCopyState("copied");
    } catch {
      // Fallback untuk browser lama atau izin clipboard yang dibatasi
      const textarea = document.createElement("textarea");
      textarea.value = active.text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopyState(copied ? "copied" : "error");
    }

    window.setTimeout(() => setCopyState("idle"), 2500);
  };

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(active.text)}`;

  return (
    <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#27272A]">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#FAFAFA]">{active.title}</h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">{active.description}</p>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
            copyState === "copied"
              ? "bg-[#22C55E] text-white"
              : copyState === "error"
                ? "bg-[#EF4444] text-white"
                : "bg-[#18181B] hover:bg-[#27272A] text-[#FAFAFA] border border-[#27272A]"
          }`}
          aria-label={`Salin ${active.label.toLowerCase()} ke clipboard`}
        >
          {copyState === "copied" ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Berhasil disalin</span>
            </>
          ) : copyState === "error" ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              <span>Gagal menyalin, blok manual</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              <span>Salin teks</span>
            </>
          )}
        </button>
      </div>

      {/* Pengumuman status salin untuk pembaca layar */}
      <span role="status" aria-live="polite" className="sr-only">
        {copyState === "copied"
          ? `${active.label} berhasil disalin ke clipboard.`
          : copyState === "error"
            ? "Gagal menyalin otomatis. Silakan blok teks template secara manual."
            : ""}
      </span>

      {/* Pemilih template: order baru vs rekap data pemain */}
      <div
        role="group"
        aria-label="Pilih template pesan WhatsApp"
        className="mt-5 inline-flex gap-1 rounded-xl border border-[#27272A] bg-[#09090B] p-1"
      >
        {templateOptions.map((option) => {
          const isActive = option.id === activeTemplate;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setActiveTemplate(option.id);
                setCopyState("idle");
              }}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors ${
                isActive
                  ? "bg-[#84CC16] text-[#09090B]"
                  : "text-[#A1A1AA] hover:bg-[#141418] hover:text-[#FAFAFA]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Preview Snippet Box */}
      <div className="mt-3 p-4 rounded-xl bg-[#09090B] border border-[#27272A] font-mono text-xs text-[#D4D4D8] leading-relaxed whitespace-pre-wrap select-all">
        {active.text}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <span className="text-xs text-[#A1A1AA]">
          Bisa langsung ditempel ke grup tim sebelum dikirim ke admin.
        </span>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#84CC16] hover:bg-[#9ee238] active:scale-[0.98] text-[#09090B] text-xs font-bold transition-colors"
        >
          <span>Kirim ke WhatsApp →</span>
        </a>
      </div>
    </div>
  );
}
