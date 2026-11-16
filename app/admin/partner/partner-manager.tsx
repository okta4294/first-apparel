"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";
import { compressImageToWebP } from "@/lib/image-compression";
import { createPartnerAction, updatePartnerAction, deletePartnerAction } from "./actions";

export interface PartnerItem {
  id: number;
  name: string;
  category: string | null;
  logoUrl: string;
  logoKey: string;
  websiteUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

interface PartnerManagerProps {
  initialItems: PartnerItem[];
}

export function PartnerManager({ initialItems }: PartnerManagerProps) {
  const [items, setItems] = useState<PartnerItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<PartnerItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("TIM ESPORTS");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [logoUrl, setLogoUrl] = useState("");
  const [logoKey, setLogoKey] = useState("");
  const [oldLogoKey, setOldLogoKey] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Upload states
  const [uploadStatus, setUploadStatus] = useState<"idle" | "compressing" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setName("");
    setCategory("TIM ESPORTS");
    setWebsiteUrl("");
    setSortOrder(0);
    setLogoUrl("");
    setLogoKey("");
    setOldLogoKey("");
    setIsActive(true);
    setUploadStatus("idle");
    setUploadProgress(0);
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleStartEdit = (item: PartnerItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category || "TIM ESPORTS");
    setWebsiteUrl(item.websiteUrl || "");
    setSortOrder(item.sortOrder);
    setLogoUrl(item.logoUrl);
    setLogoKey(item.logoKey);
    setOldLogoKey(item.logoKey);
    setIsActive(item.isActive);
    setUploadStatus("success");
    setIsAdding(true);
    setStatusMessage(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !logoUrl) {
      setStatusMessage({ type: "error", text: "Mohon isi nama partner dan unggah logo." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("logoUrl", logoUrl);
    formData.append("logoKey", logoKey);
    formData.append("sortOrder", sortOrder.toString());
    if (websiteUrl) formData.append("websiteUrl", websiteUrl);
    if (isActive) formData.append("isActive", "on");

    if (editingItem) {
      formData.append("id", editingItem.id.toString());
      if (oldLogoKey) formData.append("oldLogoKey", oldLogoKey);

      const res = await updatePartnerAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setStatusMessage({ type: "success", text: `Data partner "${name}" berhasil diperbarui!` });
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  name,
                  category,
                  logoUrl,
                  logoKey,
                  websiteUrl: websiteUrl || null,
                  sortOrder,
                  isActive,
                }
              : item
          )
        );
        resetForm();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal memperbarui partner." });
      }
    } else {
      const res = await createPartnerAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setStatusMessage({ type: "success", text: "Partner berafiliasi berhasil ditambahkan!" });
        setItems((prev) => [
          ...prev,
          {
            id: Date.now(),
            name,
            category,
            logoUrl,
            logoKey,
            websiteUrl: websiteUrl || null,
            sortOrder,
            isActive,
            createdAt: new Date(),
          },
        ]);
        resetForm();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal menambahkan partner." });
      }
    }
  };

  const handleDelete = async (item: PartnerItem) => {
    if (!confirm(`Hapus partner "${item.name}"?`)) return;

    const res = await deletePartnerAction(item.id, item.logoKey);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setStatusMessage({ type: "success", text: "Partner dan file logo berhasil dihapus." });
    } else {
      setStatusMessage({ type: "error", text: res.error || "Gagal menghapus partner." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181B]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Mitra &amp; Partner Berafiliasi</h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Kelola logo klub, tim olahraga, komunitas, dan instansi yang telah bekerja sama dengan First Apparel.
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
          <span>{isAdding ? "Tutup Formulir" : "Tambah Partner Baru"}</span>
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

      {/* Form Tambah / Edit Partner */}
      {isAdding && (
        <div className="p-6 rounded-xl bg-[#141418] border border-[#27272A] space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
            <h2 className="text-sm font-semibold text-[#FAFAFA]">
              {editingItem ? `Edit Partner: ${editingItem.name}` : "Form Tambah Partner Baru"}
            </h2>
            <span className="text-[11px] text-[#71717A]">
              Logo terkompresi otomatis WebP transparan (hemat kuota)
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Nama Partner / Klub / Tim <span className="text-[#84CC16]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bandung Striker FC"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Kategori Partner
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
                >
                  <option value="TIM ESPORTS">TIM ESPORTS</option>
                  <option value="KLUB SEPAK BOLA & FUTSAL">KLUB SEPAK BOLA &amp; FUTSAL</option>
                  <option value="KOMUNITAS LARI & SEPEDA">KOMUNITAS LARI &amp; SEPEDA</option>
                  <option value="INSTANSI & PERUSAHAAN">INSTANSI &amp; PERUSAHAAN</option>
                  <option value="KAMPUS & SEKOLAH">KAMPUS &amp; SEKOLAH</option>
                  <option value="MITRA LAINNYA">MITRA LAINNYA</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Tautan Website / Instagram <span className="text-[10px] text-[#71717A]">(Opsional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/namapartner"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Urutan Tampil (Sort Order)
                </label>
                <input
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
                />
              </div>
            </div>

            {/* Unggah Logo Partner */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#D4D4D8] block">
                Logo Partner <span className="text-[#84CC16]">*</span>
                <span className="text-[10px] text-[#71717A] font-normal ml-1">(Disarankan PNG transparan)</span>
              </label>

              {logoUrl ? (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#09090B] border border-[#84CC16]/40">
                  <div className="w-16 h-16 rounded-lg border border-[#27272A] overflow-hidden bg-[#181920] flex items-center justify-center p-2 shrink-0">
                    <img src={logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#84CC16] block">✓ Logo Terpasang</span>
                    <span className="text-[10px] text-[#71717A] truncate block font-mono">Key: {logoKey}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLogoUrl("");
                      setLogoKey("");
                      setUploadStatus("idle");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                  >
                    Ganti Logo
                  </button>
                </div>
              ) : (
                <div className="relative border border-dashed border-[#3F3F46] rounded-xl p-3 bg-[#0D0E12] text-center overflow-hidden">
                  {(uploadStatus === "compressing" || uploadStatus === "uploading") && (
                    <div className="absolute inset-0 z-20 bg-[#0C0D11]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#27272A] border-t-[#84CC16] animate-spin" />
                      <span className="text-xs font-semibold text-[#84CC16]">
                        {uploadStatus === "compressing" ? "Mengompres logo WebP..." : `Mengunggah (${uploadProgress}%)...`}
                      </span>
                    </div>
                  )}

                  <UploadDropzone
                    endpoint="partnerLogo"
                    onBeforeUploadBegin={async (files) => {
                      setUploadStatus("compressing");
                      setUploadProgress(20);
                      try {
                        const compressed = await Promise.all(
                          files.map((f) => compressImageToWebP(f, 400, 400, 0.85))
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
                      container: "border-none p-2",
                      label: "text-xs text-[#A1A1AA] hover:text-[#FAFAFA]",
                      button: "bg-[#84CC16] text-[#09090B] font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-[#9ee238]",
                      allowedContent: "text-[10px] text-[#71717A]",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Toggle Status Aktif */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-[#27272A] bg-[#09090B] text-[#84CC16] accent-[#84CC16]"
              />
              <label htmlFor="isActive" className="text-xs text-[#D4D4D8] cursor-pointer">
                Status Aktif (Tampilkan Logo Partner di Halaman Beranda)
              </label>
            </div>

            {/* Tombol Simpan */}
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
                disabled={isSubmitting || !logoUrl}
                className="px-5 py-2 rounded-lg bg-[#84CC16] disabled:opacity-50 text-[#09090B] font-bold text-xs hover:bg-[#9ee238] transition-colors"
              >
                {isSubmitting ? "Menyimpan..." : editingItem ? "Simpan Perubahan Partner" : "Simpan Partner"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data Partner */}
      <div className="rounded-xl border border-[#18181B] bg-[#0C0D11] overflow-hidden">
        <div className="p-4 border-b border-[#18181B] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#FAFAFA]">
            Daftar Mitra Berafiliasi ({items.length} Partner)
          </span>
          <span className="text-[11px] text-[#71717A]">
            Terkoneksi langsung ke seksi mitra di halaman depan
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#71717A] space-y-2">
            <p>Belum ada mitra atau partner yang ditambahkan.</p>
            <p className="text-[11px] text-[#52525B]">
              Klik tombol &quot;Tambah Partner Baru&quot; di atas untuk memasang logo tim atau komunitas pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#D4D4D8]">
              <thead className="bg-[#121318] text-[11px] text-[#71717A] uppercase tracking-wider border-b border-[#18181B]">
                <tr>
                  <th className="py-3 px-4">Logo</th>
                  <th className="py-3 px-4">Nama Partner</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tautan Web</th>
                  <th className="py-3 px-4">Urutan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18181B]">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#14151B] transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg bg-[#181920] border border-[#27272A] overflow-hidden flex items-center justify-center p-1.5">
                        <img src={item.logoUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#FAFAFA]">
                      {item.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#181920] text-[#84CC16] text-[10px] font-bold border border-[#27272A]">
                        {item.category || "MITRA"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {item.websiteUrl ? (
                        <a
                          href={item.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#84CC16] hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <span>Buka Link ↗</span>
                        </a>
                      ) : (
                        <span className="text-[#52525B] text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#A1A1AA]">
                      #{item.sortOrder}
                    </td>
                    <td className="py-3 px-4">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#84CC16]/10 text-[#84CC16] text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                          Tampil
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#27272A] text-[#71717A] text-[10px] font-medium">
                          Sembunyi
                        </span>
                      )}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
