"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { compressImageToWebP } from "@/lib/image-compression";
import { createPromoAction, updatePromoAction, deletePromoAction } from "./actions";

export interface PromoItem {
  id: number;
  label: string;
  title: string;
  badgeText: string;
  imageUrl: string | null;
  imageKey: string | null;
  waMessage: string;
  hasDuration: boolean;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  isPopup: boolean;
  createdAt: Date;
}

interface PromoManagerProps {
  initialItems: PromoItem[];
}

export function PromoManager({ initialItems }: PromoManagerProps) {
  const [items, setItems] = useState<PromoItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<PromoItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [label, setLabel] = useState("PROMO SPESIAL");
  const [title, setTitle] = useState("");
  const [badgeText, setBadgeText] = useState("DISKON 10%");
  const [waMessage, setWaMessage] = useState("Halo Admin First Apparel, saya ingin klaim promo diskon di website.");
  const [hasDuration, setHasDuration] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isPopup, setIsPopup] = useState(false);

  // Image states
  const [imageUrl, setImageUrl] = useState("");
  const [imageKey, setImageKey] = useState("");
  const [oldImageKey, setOldImageKey] = useState("");
  const [uploadStatus, setUploadStatus] = useState<"idle" | "compressing" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setLabel("PROMO SPESIAL");
    setTitle("");
    setBadgeText("DISKON 10%");
    setWaMessage("Halo Admin First Apparel, saya ingin klaim promo diskon di website.");
    setHasDuration(false);
    setStartDate("");
    setEndDate("");
    setIsActive(true);
    setIsPopup(false);
    setImageUrl("");
    setImageKey("");
    setOldImageKey("");
    setUploadStatus("idle");
    setUploadProgress(0);
    setEditingItem(null);
    setIsAdding(false);
  };

  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const handleStartEdit = (item: PromoItem) => {
    setEditingItem(item);
    setLabel(item.label);
    setTitle(item.title);
    setBadgeText(item.badgeText);
    setWaMessage(item.waMessage);
    setHasDuration(item.hasDuration);
    setStartDate(formatDateForInput(item.startDate));
    setEndDate(formatDateForInput(item.endDate));
    setIsActive(item.isActive);
    setIsPopup(item.isPopup);
    setImageUrl(item.imageUrl || "");
    setImageKey(item.imageKey || "");
    setOldImageKey(item.imageKey || "");
    setUploadStatus(item.imageUrl ? "success" : "idle");
    setIsAdding(true);
    setStatusMessage(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setStatusMessage({ type: "error", text: "Mohon isi judul promo." });
      return;
    }

    if (hasDuration && (!startDate || !endDate)) {
      setStatusMessage({ type: "error", text: "Mohon tentukan tanggal mulai dan tanggal berakhir promo berdurasi." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("label", label);
    formData.append("title", title);
    formData.append("badgeText", badgeText);
    formData.append("waMessage", waMessage);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (imageKey) formData.append("imageKey", imageKey);
    if (hasDuration) formData.append("hasDuration", "on");
    if (startDate) formData.append("startDate", startDate);
    if (endDate) formData.append("endDate", endDate);
    if (isActive) formData.append("isActive", "on");
    if (isPopup) formData.append("isPopup", "on");

    if (editingItem) {
      formData.append("id", editingItem.id.toString());
      if (oldImageKey) formData.append("oldImageKey", oldImageKey);

      const res = await updatePromoAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setStatusMessage({ type: "success", text: `Promo "${title}" berhasil diperbarui!` });
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  label,
                  title,
                  badgeText,
                  waMessage,
                  imageUrl: imageUrl || null,
                  imageKey: imageKey || null,
                  hasDuration,
                  startDate: startDate ? new Date(startDate) : null,
                  endDate: endDate ? new Date(endDate) : null,
                  isActive,
                  isPopup,
                }
              : item
          )
        );
        resetForm();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal memperbarui promo." });
      }
    } else {
      const res = await createPromoAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setStatusMessage({ type: "success", text: "Program promo berhasil disimpan dan ditayangkan!" });
        setItems((prev) => [
          {
            id: Date.now(),
            label,
            title,
            badgeText,
            waMessage,
            imageUrl: imageUrl || null,
            imageKey: imageKey || null,
            hasDuration,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            isActive,
            isPopup,
            createdAt: new Date(),
          },
          ...prev,
        ]);
        resetForm();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal menyimpan promo." });
      }
    }
  };

  const handleDelete = async (item: PromoItem) => {
    if (!confirm(`Hapus promo "${item.title}"?`)) return;

    const res = await deletePromoAction(item.id, item.imageKey);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setStatusMessage({ type: "success", text: "Promo dan berkas gambarnya berhasil dihapus." });
    } else {
      setStatusMessage({ type: "error", text: res.error || "Gagal menghapus promo." });
    }
  };

  const isPromoExpired = (item: PromoItem) => {
    if (!item.hasDuration || !item.endDate) return false;
    return new Date() > new Date(item.endDate);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181B]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Manajemen Banner Promo</h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Atur diskon, penawaran gratis jersey tambahan, banner bergambar, dan pembatasan tanggal promosi otomatis.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isAdding) {
              resetForm();
            } else {
              setIsAdding(true);
            }
            setStatusMessage(null);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84CC16] text-[#09090B] font-bold text-xs hover:bg-[#9ee238] transition-colors self-start sm:self-auto shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {isAdding ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            )}
          </svg>
          <span>{isAdding ? "Tutup Formulir" : "Tambah Promo Baru"}</span>
        </button>
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

      {/* Form Tambah / Edit Promo */}
      {isAdding && (
        <div className="p-6 rounded-xl bg-[#141418] border border-[#27272A] space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
            <h2 className="text-sm font-semibold text-[#FAFAFA]">
              {editingItem ? `Edit Promo: ${editingItem.title}` : "Form Tambah Promo Baru"}
            </h2>
            <span className="text-[11px] text-[#71717A]">
              Mendukung promo durasi otomatis & klaim langsung via WhatsApp
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Label Promo <span className="text-[#84CC16]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: PROMO BULAN INI"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Judul Penawaran Promo <span className="text-[#84CC16]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Pesan 24 Pcs Gratis 1 Pcs Jersey Kiper Custom"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Badge Diskon / Highlight <span className="text-[#84CC16]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: FREE 1 PCS atau DISKON 15%"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Template Teks Pesan Klaim WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="Pesan otomatis yang terisi saat pengunjung klik klaim promo"
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>
            </div>

            {/* Opsi Banner Promo Bergambar (Opsional) */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#D4D4D8] block">
                Gambar Banner Promo <span className="text-[10px] text-[#71717A] font-normal">(Opsional)</span>
              </label>

              {imageUrl ? (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#09090B] border border-[#84CC16]/40">
                  <div className="w-24 h-16 rounded-lg border border-[#27272A] overflow-hidden bg-[#141418] shrink-0">
                    <img src={imageUrl} alt="Banner" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#84CC16] block">✓ Banner Terpasang</span>
                    <span className="text-[10px] text-[#71717A] truncate block font-mono">Key: {imageKey}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setImageKey("");
                      setUploadStatus("idle");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                  >
                    Hapus Gambar
                  </button>
                </div>
              ) : (
                <div className="relative border border-dashed border-[#3F3F46] rounded-xl p-3 bg-[#0D0E12] text-center overflow-hidden">
                  {(uploadStatus === "compressing" || uploadStatus === "uploading") && (
                    <div className="absolute inset-0 z-20 bg-[#0C0D11]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#27272A] border-t-[#84CC16] animate-spin" />
                      <span className="text-xs font-semibold text-[#84CC16]">
                        {uploadStatus === "compressing" ? "Mengompres banner..." : `Mengunggah (${uploadProgress}%)...`}
                      </span>
                    </div>
                  )}

                  <UploadDropzone
                    endpoint="promoBanner"
                    onBeforeUploadBegin={async (files) => {
                      setUploadStatus("compressing");
                      setUploadProgress(20);
                      try {
                        const compressed = await Promise.all(
                          files.map((f) => compressImageToWebP(f, 1200, 600, 0.85))
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
                        setImageUrl(res[0].ufsUrl || res[0].url);
                        setImageKey(res[0].key);
                        setUploadStatus("success");
                        setUploadProgress(100);
                      }
                    }}
                    onUploadError={(err: Error) => {
                      setUploadStatus("error");
                      setStatusMessage({
                        type: "error",
                        text: `Gagal mengunggah banner: ${err.message}`,
                      });
                    }}
                    appearance={{
                      container: "border-none p-2",
                      label: "text-xs text-[#A1A1AA] hover:text-[#FAFAFA]",
                      button: "bg-[#84CC16] text-[#09090B] font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-[#9ee238]",
                      allowedContent: "text-[10px] text-[#71717A]",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Pengaturan Durasi Waktu */}
            <div className="p-4 rounded-xl bg-[#09090B] border border-[#27272A] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#FAFAFA] block">Batas Waktu Durasi Promo</span>
                  <span className="text-[11px] text-[#71717A]">
                    Jika diaktifkan, promo akan otomatis disembunyikan dari beranda setelah melewati batas tanggal.
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="hasDuration"
                  checked={hasDuration}
                  onChange={(e) => setHasDuration(e.target.checked)}
                  className="w-4 h-4 rounded border-[#27272A] bg-[#141418] text-[#84CC16] accent-[#84CC16]"
                />
              </div>

              {hasDuration && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#1F2026] animate-in fade-in duration-150">
                  <div>
                    <label className="text-[11px] text-[#D4D4D8] block mb-1 font-medium">Tanggal Mulai</label>
                    <input
                      type="date"
                      required={hasDuration}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#141418] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#D4D4D8] block mb-1 font-medium">Tanggal Berakhir</label>
                    <input
                      type="date"
                      required={hasDuration}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#141418] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Status Aktif & Pop-up */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-[#27272A] bg-[#09090B] text-[#84CC16] accent-[#84CC16]"
                />
                <label htmlFor="isActive" className="text-xs text-[#D4D4D8] cursor-pointer">
                  Status Aktif (Tayangkan Banner Promo di Beranda)
                </label>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#09090B] border border-[#27272A]">
                <input
                  type="checkbox"
                  id="isPopup"
                  checked={isPopup}
                  onChange={(e) => setIsPopup(e.target.checked)}
                  className="w-4 h-4 rounded border-[#27272A] bg-[#141418] text-[#84CC16] accent-[#84CC16] mt-0.5"
                />
                <label htmlFor="isPopup" className="text-xs text-[#D4D4D8] cursor-pointer">
                  <span className="font-semibold text-[#84CC16] block">
                    ⚡ Tampilkan Sebagai Promo Pop-up (Modal Pengunjung)
                  </span>
                  <span className="text-[11px] text-[#71717A] block mt-0.5">
                    Jika dicentang, promo ini akan otomatis muncul sebagai jendela pop-up saat pengunjung membuka halaman website.
                  </span>
                </label>
              </div>
            </div>

            {/* Tombol Aksi Simpan */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#27272A]">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-[#27272A] text-xs text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18191E]"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-[#84CC16] disabled:opacity-50 text-[#09090B] font-bold text-xs hover:bg-[#9ee238] transition-colors"
              >
                {isSubmitting ? "Menyimpan..." : editingItem ? "Simpan Perubahan Promo" : "Simpan & Tayangkan Promo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data Promo */}
      <div className="rounded-xl border border-[#18181B] bg-[#0C0D11] overflow-hidden">
        <div className="p-4 border-b border-[#18181B] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#FAFAFA]">
            Daftar Program Promo ({items.length} Promo)
          </span>
          <span className="text-[11px] text-[#71717A]">
            Terkoneksi langsung ke Neon DB &amp; Beranda Publik
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#71717A] space-y-2">
            <p>Belum ada program promo yang ditambahkan.</p>
            <p className="text-[11px] text-[#52525B]">
              Klik tombol &quot;Tambah Promo Baru&quot; di atas untuk membuat penawaran diskon pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#D4D4D8]">
              <thead className="bg-[#121318] text-[11px] text-[#71717A] uppercase tracking-wider border-b border-[#18181B]">
                <tr>
                  <th className="py-3 px-4">Banner</th>
                  <th className="py-3 px-4">Judul Promo</th>
                  <th className="py-3 px-4">Badge Diskon</th>
                  <th className="py-3 px-4">Masa Berlaku</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18181B]">
                {items.map((item) => {
                  const expired = isPromoExpired(item);

                  return (
                    <tr key={item.id} className="hover:bg-[#14151B] transition-colors">
                      <td className="py-3 px-4">
                        {item.imageUrl ? (
                          <div className="w-16 h-10 rounded-lg bg-[#181920] border border-[#27272A] overflow-hidden">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#52525B]">Teks saja</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#FAFAFA]">
                        <div>{item.title}</div>
                        <span className="text-[10px] text-[#71717A] font-normal">{item.label}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#84CC16]/10 text-[#84CC16] text-[10px] font-bold border border-[#84CC16]/30">
                          {item.badgeText}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#A1A1AA]">
                        {item.hasDuration ? (
                          <div className="space-y-0.5">
                            <span className="text-[11px] block text-[#FAFAFA]">
                              {formatDateForInput(item.startDate)} s/d {formatDateForInput(item.endDate)}
                            </span>
                            {expired && (
                              <span className="inline-block px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 text-[9px] font-semibold border border-red-500/20">
                                Sudah Berakhir
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#71717A] text-[11px]">Selamanya (Tanpa Batas)</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {item.isActive && !expired ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#84CC16]/10 text-[#84CC16] text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                              Tayang
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#27272A] text-[#71717A] text-[10px] font-medium">
                              {expired ? "Kedaluwarsa" : "Nonaktif"}
                            </span>
                          )}

                          {item.isPopup && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#84CC16]/20 border border-[#84CC16]/40 text-[#84CC16] text-[9px] font-bold tracking-tight">
                              ⚡ Pop-up
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="px-2.5 py-1 rounded bg-[#181920] hover:bg-[#84CC16]/10 text-[#84CC16] border border-[#27272A] hover:border-[#84CC16]/30 text-[11px] font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="px-2.5 py-1 rounded bg-transparent hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/20 text-[11px] font-medium transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
