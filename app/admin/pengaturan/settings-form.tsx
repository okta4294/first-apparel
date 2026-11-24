"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { compressImageToWebP } from "@/lib/image-compression";
import { updateSettingsAction } from "./actions";

interface SettingsFormProps {
  initialSettings: {
    storeName: string;
    companyName?: string | null;
    storeAddress: string;
    googleMapsUrl: string | null;
    operatingHours: string | null;
    whatsappNumber: string;
    defaultWaText: string;
    instagramUrl: string | null;
    logoUrl?: string | null;
    logoKey?: string | null;
    footerCompanyName?: string | null;
    footerLogoUrl?: string | null;
    footerLogoKey?: string | null;
    footerLogo2Url?: string | null;
    footerLogo2Key?: string | null;
    sizeChartUrl?: string | null;
    sizeChartKey?: string | null;
    storeDescription?: string | null;
    heroTitle?: string | null;
    heroTitleHighlight?: string | null;
  } | null;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [storeName, setStoreName] = useState(initialSettings?.storeName || "First Apparel");
  const [companyName, setCompanyName] = useState(initialSettings?.companyName || "");
  const [logoUrl, setLogoUrl] = useState(initialSettings?.logoUrl || "");
  const [logoKey, setLogoKey] = useState(initialSettings?.logoKey || "");
  const [footerCompanyName, setFooterCompanyName] = useState(initialSettings?.footerCompanyName || "");
  const [footerLogoUrl, setFooterLogoUrl] = useState(initialSettings?.footerLogoUrl || "");
  const [footerLogoKey, setFooterLogoKey] = useState(initialSettings?.footerLogoKey || "");
  const [footerLogo2Url, setFooterLogo2Url] = useState(initialSettings?.footerLogo2Url || "");
  const [footerLogo2Key, setFooterLogo2Key] = useState(initialSettings?.footerLogo2Key || "");
  const [sizeChartUrl, setSizeChartUrl] = useState(initialSettings?.sizeChartUrl || "");
  const [sizeChartKey, setSizeChartKey] = useState(initialSettings?.sizeChartKey || "");
  const [storeDescription, setStoreDescription] = useState(
    initialSettings?.storeDescription ||
      "Konveksi spesialis jersey olahraga custom & apparel tim profesional di Bandung. Bebas custom desain, bahan dryfit premium, dan melayani kirim ke seluruh Indonesia."
  );
  const [heroTitle, setHeroTitle] = useState(
    initialSettings?.heroTitle ||
      "Mau Tampil Keren di Lapangan? Dapatkan Jersey Printing dengan Harga Miring,"
  );
  const [heroTitleHighlight, setHeroTitleHighlight] = useState(
    initialSettings?.heroTitleHighlight ?? "Kualitas Tetap Terbaik!"
  );
  const [storeAddress, setStoreAddress] = useState(
    initialSettings?.storeAddress || "Jl. Terusan Olahraga No. 8, Bandung, Jawa Barat"
  );
  const [googleMapsUrl, setGoogleMapsUrl] = useState(initialSettings?.googleMapsUrl || "");
  const [operatingHours, setOperatingHours] = useState(
    initialSettings?.operatingHours || "Senin - Sabtu, 09.00 - 17.00 WIB"
  );
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialSettings?.whatsappNumber || "6281234567890"
  );
  const [defaultWaText, setDefaultWaText] = useState(
    initialSettings?.defaultWaText ||
      "Halo Admin First Apparel, saya ingin berkonsultasi tentang pemesanan jersey kustom."
  );
  const [instagramUrl, setInstagramUrl] = useState(initialSettings?.instagramUrl || "");

  // Upload states untuk Logo Navbar
  const [uploadStatus, setUploadStatus] = useState<"idle" | "compressing" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Upload states untuk Logo Perusahaan Footer 1 & 2
  const [footerUploadStatus, setFooterUploadStatus] = useState<"idle" | "compressing" | "uploading" | "success" | "error">("idle");
  const [footerUploadProgress, setFooterUploadProgress] = useState(0);
  const [footer2UploadStatus, setFooter2UploadStatus] = useState<"idle" | "compressing" | "uploading" | "success" | "error">("idle");
  const [footer2UploadProgress, setFooter2UploadProgress] = useState(0);

  // Upload states untuk Size Chart
  const [sizeChartUploadStatus, setSizeChartUploadStatus] = useState<"idle" | "compressing" | "uploading" | "success" | "error">("idle");
  const [sizeChartUploadProgress, setSizeChartUploadProgress] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("storeName", storeName);
    formData.append("companyName", companyName);
    formData.append("logoUrl", logoUrl);
    formData.append("logoKey", logoKey);
    formData.append("footerCompanyName", footerCompanyName);
    formData.append("footerLogoUrl", footerLogoUrl);
    formData.append("footerLogoKey", footerLogoKey);
    formData.append("footerLogo2Url", footerLogo2Url);
    formData.append("footerLogo2Key", footerLogo2Key);
    formData.append("sizeChartUrl", sizeChartUrl);
    formData.append("sizeChartKey", sizeChartKey);
    formData.append("storeDescription", storeDescription);
    formData.append("heroTitle", heroTitle);
    formData.append("heroTitleHighlight", heroTitleHighlight);
    formData.append("storeAddress", storeAddress);
    formData.append("googleMapsUrl", googleMapsUrl);
    formData.append("operatingHours", operatingHours);
    formData.append("whatsappNumber", whatsappNumber);
    formData.append("defaultWaText", defaultWaText);
    formData.append("instagramUrl", instagramUrl);

    const res = await updateSettingsAction(formData);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage({
        type: "success",
        text: "Pengaturan profil toko, logo brand & kontak WhatsApp berhasil disimpan! Seluruh halaman publik telah diperbarui.",
      });
    } else {
      setStatusMessage({ type: "error", text: res.error || "Gagal menyimpan pengaturan." });
    }
  };

  const previewWaUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(defaultWaText)}`;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181B]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Pengaturan Profil Toko &amp; Kontak</h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Kelola nomor WhatsApp tujuan pemesanan, alamat workshop fisik, titik Google Maps, dan pesan otomatis.
          </p>
        </div>

        <a
          href={previewWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#181920] hover:bg-[#20212B] text-[#84CC16] border border-[#27272A] hover:border-[#84CC16]/40 text-xs font-semibold transition-colors self-start sm:self-auto shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>Uji Coba Tautan WhatsApp</span>
        </a>
      </div>

      {/* Alert Notifikasi Status */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
            statusMessage.type === "success"
              ? "bg-[#84CC16]/10 border-[#84CC16]/30 text-[#84CC16]"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="hover:underline text-[11px] opacity-75"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Form Konfigurasi Toko */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Grup 1: Identitas & Kontak WhatsApp */}
        <div className="p-6 rounded-xl bg-[#141418] border border-[#27272A] space-y-4">
          <div className="border-b border-[#27272A] pb-3">
            <h2 className="text-sm font-semibold text-[#FAFAFA]">Identitas Brand &amp; WhatsApp Utama</h2>
            <span className="text-[11px] text-[#71717A]">
              Nomor ini menjadi penerima seluruh klik pemesanan katalog, konsultasi desain, dan klaim promo.
            </span>
          </div>

          {/* Unggah Logo Toko (Navbar) */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#D4D4D8] block">
              Logo Toko / Brand (Navbar Atas)
              <span className="text-[10px] text-[#71717A] font-normal ml-1">
                (Format PNG transparan atau WebP, maks. 2MB)
              </span>
            </label>

            {logoUrl ? (
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#09090B] border border-[#84CC16]/40">
                <div className="w-16 h-16 rounded-xl border border-[#27272A] overflow-hidden bg-[#181920] flex items-center justify-center p-2 shrink-0">
                  <Image src={logoUrl} alt="Logo Toko" width={64} height={64} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[#84CC16] block">✓ Logo Navbar Terpasang</span>
                  <span className="text-[11px] text-[#A1A1AA] block mt-0.5">
                    Ditampilkan di Navbar atas (dan menjadi cadangan Footer bila logo Footer belum diisi).
                  </span>
                  <span className="text-[10px] text-[#71717A] truncate block font-mono mt-1">Key: {logoKey || "external"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLogoUrl("");
                    setLogoKey("");
                    setUploadStatus("idle");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors shrink-0"
                >
                  Hapus / Ganti
                </button>
              </div>
            ) : (
              <div className="relative border border-dashed border-[#3F3F46] rounded-xl p-4 bg-[#0D0E12] text-center overflow-hidden">
                {(uploadStatus === "compressing" || uploadStatus === "uploading") && (
                  <div className="absolute inset-0 z-20 bg-[#0C0D11]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#27272A] border-t-[#84CC16] animate-spin" />
                    <span className="text-xs font-semibold text-[#84CC16]">
                      {uploadStatus === "compressing" ? "Mengompres logo WebP..." : `Mengunggah logo (${uploadProgress}%)...`}
                    </span>
                  </div>
                )}

                <UploadDropzone
                  endpoint="storeLogo"
                  onBeforeUploadBegin={async (files) => {
                    setUploadStatus("compressing");
                    setUploadProgress(20);
                    try {
                      const compressed = await Promise.all(
                        files.map((f) => compressImageToWebP(f, 400, 400, 0.9))
                      );
                      return compressed;
                    } catch {
                      return files;
                    }
                  }}
                  onUploadBegin={() => {
                    setUploadStatus("uploading");
                    setUploadProgress(40);
                  }}
                  onUploadProgress={(progress) => {
                    setUploadStatus("uploading");
                    setUploadProgress(progress);
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setLogoUrl(res[0].ufsUrl || res[0].url);
                      setLogoKey(res[0].key);
                      setUploadStatus("success");
                      setUploadProgress(100);
                    }
                  }}
                  onUploadError={(err: Error) => {
                    setUploadStatus("error");
                    setStatusMessage({
                      type: "error",
                      text: `Gagal upload logo: ${err.message}`,
                    });
                  }}
                  appearance={{
                    container: "py-6 border-none bg-transparent",
                    label: "text-xs font-semibold text-[#84CC16] hover:text-[#9ee238]",
                    allowedContent: "text-[10px] text-[#71717A]",
                    button: "bg-[#84CC16] hover:bg-[#9ee238] text-[#09090B] font-bold text-xs py-2 px-4 rounded-lg mt-3",
                  }}
                  content={{
                    label: "Pilih file logo toko atau tarik ke sini",
                    allowedContent: "Maksimal 2MB (PNG / JPG / WEBP)",
                    button({ ready }) {
                      return ready ? "Pilih Logo Toko" : "Memuat...";
                    },
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Nama Usaha / Toko (Navbar) <span className="text-[#84CC16]">*</span>
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Nama Perusahaan / CV Induk (Navbar)
              </label>
              <input
                type="text"
                placeholder="Contoh: CV Asika Multiguna Semesta"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Nomor WhatsApp Admin <span className="text-[#84CC16]">*</span>
                <span className="text-[10px] text-[#71717A] font-normal ml-1">(Format diawali 62)</span>
              </label>
              <input
                type="text"
                required
                placeholder="6281234567890"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs font-mono text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>
          </div>

          {/* Identitas Perusahaan Khusus Footer */}
          <div className="pt-4 border-t border-[#27272A] space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-[#FAFAFA]">Identitas Perusahaan di Footer (Opsional)</h3>
              <span className="text-[11px] text-[#71717A]">
                Atur logo dan nama perusahaan induk khusus untuk Footer. Jika dikosongkan, otomatis mengikuti data Navbar.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#D4D4D8] block">
                Logo Perusahaan 1 (Footer Bawah)
                <span className="text-[10px] text-[#71717A] font-normal ml-1">
                  (Format PNG transparan atau WebP, maks. 2MB)
                </span>
              </label>

              {footerLogoUrl ? (
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#09090B] border border-[#84CC16]/40">
                  <div className="w-16 h-16 rounded-xl border border-[#27272A] overflow-hidden bg-[#181920] flex items-center justify-center p-2 shrink-0">
                    <Image src={footerLogoUrl} alt="Logo Footer" width={64} height={64} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#84CC16] block">✓ Logo Footer Terpasang</span>
                    <span className="text-[11px] text-[#A1A1AA] block mt-0.5">
                      Logo ini ditampilkan di atas nama perusahaan pada Footer.
                    </span>
                    <span className="text-[10px] text-[#71717A] truncate block font-mono mt-1">Key: {footerLogoKey || "external"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFooterLogoUrl("");
                      setFooterLogoKey("");
                      setFooterUploadStatus("idle");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors shrink-0"
                  >
                    Hapus / Ganti
                  </button>
                </div>
              ) : (
                <div className="relative border border-dashed border-[#3F3F46] rounded-xl p-4 bg-[#0D0E12] text-center overflow-hidden">
                  {(footerUploadStatus === "compressing" || footerUploadStatus === "uploading") && (
                    <div className="absolute inset-0 z-20 bg-[#0C0D11]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#27272A] border-t-[#84CC16] animate-spin" />
                      <span className="text-xs font-semibold text-[#84CC16]">
                        {footerUploadStatus === "compressing" ? "Mengompres logo WebP..." : `Mengunggah logo (${footerUploadProgress}%)...`}
                      </span>
                    </div>
                  )}

                  <UploadDropzone
                    endpoint="storeLogo"
                    onBeforeUploadBegin={async (files) => {
                      setFooterUploadStatus("compressing");
                      setFooterUploadProgress(20);
                      try {
                        const compressed = await Promise.all(
                          files.map((f) => compressImageToWebP(f, 400, 400, 0.9))
                        );
                        return compressed;
                      } catch {
                        return files;
                      }
                    }}
                    onUploadBegin={() => {
                      setFooterUploadStatus("uploading");
                      setFooterUploadProgress(40);
                    }}
                    onUploadProgress={(progress) => {
                      setFooterUploadStatus("uploading");
                      setFooterUploadProgress(progress);
                    }}
                    onClientUploadComplete={(res) => {
                      if (res?.[0]) {
                        setFooterLogoUrl(res[0].ufsUrl || res[0].url);
                        setFooterLogoKey(res[0].key);
                        setFooterUploadStatus("success");
                        setFooterUploadProgress(100);
                      }
                    }}
                    onUploadError={(err: Error) => {
                      setFooterUploadStatus("error");
                      setStatusMessage({
                        type: "error",
                        text: `Gagal upload logo footer: ${err.message}`,
                      });
                    }}
                    appearance={{
                      container: "py-6 border-none bg-transparent",
                      label: "text-xs font-semibold text-[#84CC16] hover:text-[#9ee238]",
                      allowedContent: "text-[10px] text-[#71717A]",
                      button: "bg-[#84CC16] hover:bg-[#9ee238] text-[#09090B] font-bold text-xs py-2 px-4 rounded-lg mt-3",
                    }}
                    content={{
                      label: "Pilih file logo perusahaan 1 untuk Footer atau tarik ke sini",
                      allowedContent: "Maksimal 2MB (PNG / JPG / WEBP)",
                      button({ ready }) {
                        return ready ? "Pilih Logo Footer 1" : "Memuat...";
                      },
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#D4D4D8] block">
                Logo Perusahaan 2 (Footer Bawah — Opsional)
                <span className="text-[10px] text-[#71717A] font-normal ml-1">
                  (Tampil bersebelahan di kanan Logo 1, maks. 2MB)
                </span>
              </label>

              {footerLogo2Url ? (
                <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#09090B] border border-[#84CC16]/40">
                  <div className="w-16 h-16 rounded-xl border border-[#27272A] overflow-hidden bg-[#181920] flex items-center justify-center p-2 shrink-0">
                    <Image src={footerLogo2Url} alt="Logo Footer 2" width={64} height={64} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#84CC16] block">✓ Logo Footer 2 Terpasang</span>
                    <span className="text-[11px] text-[#A1A1AA] block mt-0.5">
                      Logo ini ditampilkan bersebelahan dengan Logo 1 di bagian bawah Footer.
                    </span>
                    <span className="text-[10px] text-[#71717A] truncate block font-mono mt-1">Key: {footerLogo2Key || "external"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFooterLogo2Url("");
                      setFooterLogo2Key("");
                      setFooter2UploadStatus("idle");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors shrink-0"
                  >
                    Hapus / Ganti
                  </button>
                </div>
              ) : (
                <div className="relative border border-dashed border-[#3F3F46] rounded-xl p-4 bg-[#0D0E12] text-center overflow-hidden">
                  {(footer2UploadStatus === "compressing" || footer2UploadStatus === "uploading") && (
                    <div className="absolute inset-0 z-20 bg-[#0C0D11]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#27272A] border-t-[#84CC16] animate-spin" />
                      <span className="text-xs font-semibold text-[#84CC16]">
                        {footer2UploadStatus === "compressing" ? "Mengompres logo WebP..." : `Mengunggah logo (${footer2UploadProgress}%)...`}
                      </span>
                    </div>
                  )}

                  <UploadDropzone
                    endpoint="storeLogo"
                    onBeforeUploadBegin={async (files) => {
                      setFooter2UploadStatus("compressing");
                      setFooter2UploadProgress(20);
                      try {
                        const compressed = await Promise.all(
                          files.map((f) => compressImageToWebP(f, 400, 400, 0.9))
                        );
                        return compressed;
                      } catch {
                        return files;
                      }
                    }}
                    onUploadBegin={() => {
                      setFooter2UploadStatus("uploading");
                      setFooter2UploadProgress(40);
                    }}
                    onUploadProgress={(progress) => {
                      setFooter2UploadStatus("uploading");
                      setFooter2UploadProgress(progress);
                    }}
                    onClientUploadComplete={(res) => {
                      if (res?.[0]) {
                        setFooterLogo2Url(res[0].ufsUrl || res[0].url);
                        setFooterLogo2Key(res[0].key);
                        setFooter2UploadStatus("success");
                        setFooter2UploadProgress(100);
                      }
                    }}
                    onUploadError={(err: Error) => {
                      setFooter2UploadStatus("error");
                      setStatusMessage({
                        type: "error",
                        text: `Gagal upload logo footer 2: ${err.message}`,
                      });
                    }}
                    appearance={{
                      container: "py-6 border-none bg-transparent",
                      label: "text-xs font-semibold text-[#84CC16] hover:text-[#9ee238]",
                      allowedContent: "text-[10px] text-[#71717A]",
                      button: "bg-[#84CC16] hover:bg-[#9ee238] text-[#09090B] font-bold text-xs py-2 px-4 rounded-lg mt-3",
                    }}
                    content={{
                      label: "Pilih file logo perusahaan 2 untuk Footer atau tarik ke sini",
                      allowedContent: "Maksimal 2MB (PNG / JPG / WEBP)",
                      button({ ready }) {
                        return ready ? "Pilih Logo Footer 2" : "Memuat...";
                      },
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Nama Perusahaan / CV Induk (Footer)
              </label>
              <input
                type="text"
                placeholder="Kosongkan jika sama dengan CV Induk di Navbar"
                value={footerCompanyName}
                onChange={(e) => setFooterCompanyName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Judul Utama Hero (H1)
                <span className="text-[10px] text-[#71717A] font-normal ml-1">(Teks utama halaman depan)</span>
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Contoh: Custom Jersey Olahraga"
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Aksen Hijau Judul Hero <span className="text-[10px] text-[#71717A] font-normal">(Opsional)</span>
              </label>
              <input
                type="text"
                value={heroTitleHighlight}
                onChange={(e) => setHeroTitleHighlight(e.target.value)}
                placeholder="Contoh: Sesuai Desain Tim Anda"
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
              Deskripsi Singkat Usaha / Toko
              <span className="text-[10px] text-[#71717A] font-normal ml-1">
                (Ditampilkan di profil brand pada footer landing page)
              </span>
            </label>
            <textarea
              rows={3}
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              placeholder="Jelaskan spesialisasi konveksi Anda, jenis produk jersey unggulan, dan keunggulan layanan..."
              className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none leading-relaxed"
            />
            <span className="text-[10px] text-[#71717A]">
              Deskripsi ini digunakan untuk memperkenalkan keunggulan First Apparel kepada calon pelanggan di website utama.
            </span>
          </div>

          <div>
            <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
              Pesan Konsultasi WhatsApp Bawaan (Default Message)
            </label>
            <textarea
              rows={2}
              value={defaultWaText}
              onChange={(e) => setDefaultWaText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none leading-relaxed"
            />
            <span className="text-[10px] text-[#71717A]">
              Pesan yang otomatis tertulis saat pengunjung mengklik tombol konsultasi di Navbar atau Footer.
            </span>
          </div>
        </div>

        {/* Grup 2: Lokasi Toko & Jam Operasional */}
        <div className="p-6 rounded-xl bg-[#141418] border border-[#27272A] space-y-4">
          <div className="border-b border-[#27272A] pb-3">
            <h2 className="text-sm font-semibold text-[#FAFAFA]">Lokasi Fisik Workshop &amp; Jadwal</h2>
            <span className="text-[11px] text-[#71717A]">
              Ditampilkan pada footer halaman publik agar pelanggan dapat mendatangi workshop langsung.
            </span>
          </div>

          <div>
            <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
              Alamat Lengkap Workshop / Toko
            </label>
            <textarea
              rows={2}
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Tautan Titik Google Maps <span className="text-[10px] text-[#71717A]">(URL Maps)</span>
              </label>
              <input
                type="url"
                placeholder="https://maps.app.goo.gl/..."
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Jam Operasional Toko
              </label>
              <input
                type="text"
                placeholder="Senin - Sabtu, 09.00 - 17.00 WIB"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
              Tautan Profil Instagram Resmi <span className="text-[10px] text-[#71717A]">(Opsional)</span>
            </label>
            <input
              type="url"
              placeholder="https://instagram.com/firstapparel.id"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
            />
          </div>
        </div>

        {/* Grup 3: Gambar Panduan Ukuran Resmi Toko (Size Chart) */}
        <div className="p-6 rounded-xl bg-[#141418] border border-[#27272A] space-y-4">
          <div className="border-b border-[#27272A] pb-3">
            <h2 className="text-sm font-semibold text-[#FAFAFA]">Gambar Size Chart Resmi Toko</h2>
            <span className="text-[11px] text-[#71717A]">
              Unggah gambar tabel panduan ukuran resmi Anda. Gambar ini akan ditampilkan di halaman Alur Pemesanan (/cara-pesan) lengkap dengan fitur klik untuk memperbesar.
            </span>
          </div>

          <div className="space-y-2">
            {sizeChartUrl ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-[#09090B] border border-[#84CC16]/40">
                <div className="w-24 h-24 rounded-xl border border-[#27272A] overflow-hidden bg-[#181920] flex items-center justify-center p-1 shrink-0">
                  <Image src={sizeChartUrl} alt="Size Chart Toko" width={96} height={96} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[#84CC16] block">✓ Gambar Size Chart Terpasang</span>
                  <span className="text-[11px] text-[#A1A1AA] block mt-0.5">
                    Gambar ini otomatis tampil di halaman Alur Pemesanan dan dapat diperbesar oleh pengunjung.
                  </span>
                  <span className="text-[10px] text-[#71717A] truncate block font-mono mt-1">Key: {sizeChartKey || "external"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSizeChartUrl("");
                    setSizeChartKey("");
                    setSizeChartUploadStatus("idle");
                  }}
                  className="px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors shrink-0"
                >
                  Hapus / Ganti Gambar
                </button>
              </div>
            ) : (
              <div className="relative border border-dashed border-[#3F3F46] rounded-xl p-4 bg-[#0D0E12] text-center overflow-hidden">
                {(sizeChartUploadStatus === "compressing" || sizeChartUploadStatus === "uploading") && (
                  <div className="absolute inset-0 z-20 bg-[#0C0D11]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#27272A] border-t-[#84CC16] animate-spin" />
                    <span className="text-xs font-semibold text-[#84CC16]">
                      {sizeChartUploadStatus === "compressing"
                        ? "Mengompres gambar size chart..."
                        : `Mengunggah size chart (${sizeChartUploadProgress}%)...`}
                    </span>
                  </div>
                )}

                <UploadDropzone
                  endpoint="sizeChartImage"
                  onBeforeUploadBegin={async (files) => {
                    setSizeChartUploadStatus("compressing");
                    setSizeChartUploadProgress(20);
                    try {
                      const compressed = await compressImageToWebP(files[0], 1600, 0.85);
                      setSizeChartUploadStatus("uploading");
                      setSizeChartUploadProgress(40);
                      return [compressed];
                    } catch {
                      setSizeChartUploadStatus("uploading");
                      return files;
                    }
                  }}
                  onUploadBegin={() => {
                    setSizeChartUploadStatus("uploading");
                    setSizeChartUploadProgress(40);
                  }}
                  onUploadProgress={(progress) => {
                    setSizeChartUploadStatus("uploading");
                    setSizeChartUploadProgress(progress);
                  }}
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setSizeChartUrl(res[0].ufsUrl || res[0].url);
                      setSizeChartKey(res[0].key);
                      setSizeChartUploadStatus("success");
                      setSizeChartUploadProgress(100);
                    }
                  }}
                  onUploadError={(err: Error) => {
                    setSizeChartUploadStatus("error");
                    setStatusMessage({
                      type: "error",
                      text: `Gagal upload gambar size chart: ${err.message}`,
                    });
                  }}
                  appearance={{
                    container: "py-6 border-none bg-transparent",
                    label: "text-xs font-semibold text-[#84CC16] hover:text-[#9ee238]",
                    allowedContent: "text-[10px] text-[#71717A]",
                    button: "bg-[#84CC16] hover:bg-[#9ee238] text-[#09090B] font-bold text-xs py-2 px-4 rounded-lg mt-3",
                  }}
                  content={{
                    label: "Pilih file gambar Size Chart atau tarik ke sini",
                    allowedContent: "Format PNG, JPG, atau WEBP (Maksimal 4MB)",
                    button({ ready }) {
                      return ready ? "Pilih Gambar Size Chart" : "Memuat...";
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tombol Simpan Pengaturan */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-[#84CC16] disabled:opacity-50 text-[#09090B] font-bold text-xs hover:bg-[#9ee238] transition-colors shadow-sm"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Seluruh Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
