"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { UploadDropzone } from "@/lib/uploadthing";
import { compressImageToWebP } from "@/lib/image-compression";
import { createCatalogAction, updateCatalogAction, deleteCatalogAction } from "./actions";

export interface CatalogImageItem {
  url: string;
  key: string;
}

export interface CatalogItem {
  id: number;
  title: string;
  category: string;
  description: string | null;
  minOrder: string | null;
  imageUrl: string;
  imageKey: string;
  images: string | null;
  sizeChartUrl: string | null;
  sizeChartKey: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
}

interface CatalogManagerProps {
  initialItems: CatalogItem[];
}

function getCatalogImages(item: CatalogItem): CatalogImageItem[] {
  if (item.images) {
    try {
      const parsed = JSON.parse(item.images);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore JSON parse error
    }
  }
  if (item.imageUrl && item.imageKey) {
    return [{ url: item.imageUrl, key: item.imageKey }];
  }
  return [];
}

export function CatalogManager({ initialItems }: CatalogManagerProps) {
  const [items, setItems] = useState<CatalogItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("FUTSAL & SEPAK BOLA");
  const [description, setDescription] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Multi-image states (maksimal 4 foto per model)
  const [images, setImages] = useState<CatalogImageItem[]>([]);
  const [deletedKeys, setDeletedKeys] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "compressing" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");

  // Size chart states
  const [sizeChartUrl, setSizeChartUrl] = useState("");
  const [sizeChartKey, setSizeChartKey] = useState("");
  const [oldSizeChartKey, setOldSizeChartKey] = useState("");

  // Modal Lightbox Size Chart
  const [modalSizeChart, setModalSizeChart] = useState<{ title: string; url: string } | null>(null);

  // Daftar kategori dinamis (kombinasi kategori tersimpan di database + saran bawaan)
  const allCategories = useMemo(() => {
    const defaults = [
      "FUTSAL & SEPAK BOLA",
      "ESPORTS PRO",
      "RUNNING & CYCLING",
      "BASKETBALL",
      "BADMINTON",
      "VOLLEYBALL",
      "APPAREL & JAKET",
      "CUSTOM LAINNYA",
    ];
    const fromItems = items
      .map((i) => i.category?.trim().toUpperCase())
      .filter(Boolean);
    return Array.from(new Set([...fromItems, ...defaults]));
  }, [items]);

  const resetForm = () => {
    setTitle("");
    setCategory("FUTSAL & SEPAK BOLA");
    setDescription("");
    setMinOrder("");
    setIsFeatured(false);
    setIsActive(true);
    setImages([]);
    setDeletedKeys([]);
    setSizeChartUrl("");
    setSizeChartKey("");
    setOldSizeChartKey("");
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadFileName("");
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleStartEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description || "");
    setMinOrder(item.minOrder || "");
    setIsFeatured(item.isFeatured);
    setIsActive(item.isActive);

    const existingImages = getCatalogImages(item);
    setImages(existingImages);
    setDeletedKeys([]);

    setSizeChartUrl(item.sizeChartUrl || "");
    setSizeChartKey(item.sizeChartKey || "");
    setOldSizeChartKey(item.sizeChartKey || "");

    setUploadStatus(existingImages.length > 0 ? "success" : "idle");
    setUploadProgress(existingImages.length > 0 ? 100 : 0);
    setUploadFileName(item.title);
    setIsAdding(true);
    setStatusMessage(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRemoveImage = (index: number) => {
    const target = images[index];
    if (target?.key) {
      setDeletedKeys((prev) => [...prev, target.key]);
    }
    const next = images.filter((_, i) => i !== index);
    setImages(next);
    if (next.length === 0) {
      setUploadStatus("idle");
      setUploadProgress(0);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const others = images.filter((_, i) => i !== index);
    setImages([target, ...others]);
    setStatusMessage({ type: "success", text: "Foto utama sampul berhasil diubah!" });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || images.length === 0) {
      setStatusMessage({ type: "error", text: "Mohon isi nama model dan unggah minimal 1 foto jersey." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("minOrder", minOrder);
    formData.append("imageUrl", images[0]?.url || "");
    formData.append("imageKey", images[0]?.key || "");
    formData.append("images", JSON.stringify(images));
    if (sizeChartUrl) formData.append("sizeChartUrl", sizeChartUrl);
    if (sizeChartKey) formData.append("sizeChartKey", sizeChartKey);
    if (isFeatured) formData.append("isFeatured", "on");
    if (isActive) formData.append("isActive", "on");

    if (editingItem) {
      formData.append("id", editingItem.id.toString());
      if (oldSizeChartKey) formData.append("oldSizeChartKey", oldSizeChartKey);
      if (deletedKeys.length > 0) formData.append("deletedKeys", JSON.stringify(deletedKeys));

      const res = await updateCatalogAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setStatusMessage({ type: "success", text: `Perubahan model "${title}" berhasil disimpan!` });
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  title,
                  category,
                  description: description.trim() || null,
                  minOrder: minOrder.trim() || null,
                  imageUrl: images[0]?.url || "",
                  imageKey: images[0]?.key || "",
                  images: JSON.stringify(images),
                  sizeChartUrl: sizeChartUrl || null,
                  sizeChartKey: sizeChartKey || null,
                  isFeatured,
                  isActive,
                }
              : item
          )
        );
        resetForm();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal memperbarui produk." });
      }
    } else {
      const res = await createCatalogAction(formData);
      setIsSubmitting(false);

      if (res.success && res.item) {
        setStatusMessage({ type: "success", text: "Model jersey, galeri foto, dan size chart berhasil disimpan!" });
        setItems((prev) => [res.item as CatalogItem, ...prev]);
        resetForm();
      } else if (res.success) {
        setStatusMessage({ type: "success", text: "Model jersey, galeri foto, dan size chart berhasil disimpan!" });
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal menyimpan produk." });
      }
    }
  };

  const handleDelete = async (item: CatalogItem) => {
    if (!confirm(`Hapus model "${item.title}" beserta seluruh foto dan size chart dari penyimpanan?`)) return;

    const allKeys: string[] = [];
    const itemImages = getCatalogImages(item);
    itemImages.forEach((img) => {
      if (img.key) allKeys.push(img.key);
    });
    if (item.imageKey && !allKeys.includes(item.imageKey)) allKeys.push(item.imageKey);
    if (item.sizeChartKey) allKeys.push(item.sizeChartKey);

    const res = await deleteCatalogAction(item.id, allKeys);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setStatusMessage({ type: "success", text: "Model jersey dan seluruh fotonya berhasil dihapus." });
    } else {
      setStatusMessage({ type: "error", text: res.error || "Gagal menghapus model jersey." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181B]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Katalog Jersey & Galeri Foto</h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Unggah hingga 4 foto per model jersey, sematkan panduan ukuran (size chart), dan kelola status tayang.
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
          <span>{isAdding ? "Tutup Formulir" : "Tambah Model & Upload"}</span>
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

      {/* Form Tambah / Edit Produk */}
      {isAdding && (
        <div className="p-6 rounded-xl bg-[#141418] border border-[#27272A] space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
            <h2 className="text-sm font-semibold text-[#FAFAFA]">
              {editingItem ? `Edit Model: ${editingItem.title}` : "Form Tambah Model Jersey Baru"}
            </h2>
            <span className="text-[11px] text-[#71717A]">
              Maksimal 4 foto per model • Foto terkompresi otomatis WebP
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Bagian 1: Galeri Foto Jersey (Maks 4 Foto) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-[#FAFAFA] flex items-center gap-1.5">
                    <span>Galeri Foto Jersey (Maks. 4 Foto)</span>
                    <span className="text-[#84CC16]">*</span>
                  </label>
                  <p className="text-[11px] text-[#71717A]">
                    Foto pertama otomatis menjadi foto sampul depan. Anda dapat mengunggah hingga 4 sudut foto (depan, belakang, kerah, bahan).
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1F2026] text-[#A1A1AA] text-[11px] font-semibold border border-[#27272A]">
                  {images.length}/4 Foto Terunggah
                </span>
              </div>

              {/* Grid Thumbnail Foto yang Sudah Terunggah */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#09090B] border border-[#27272A]">
                  {images.map((img, idx) => (
                    <div
                      key={img.key || idx}
                      className={`relative rounded-lg overflow-hidden border group bg-[#121318] flex flex-col justify-between ${
                        idx === 0
                          ? "border-[#84CC16] shadow-[0_0_12px_rgba(132,204,22,0.15)] ring-1 ring-[#84CC16]/40"
                          : "border-[#27272A]"
                      }`}
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-[#0C0D11]">
                        <Image src={img.url} alt={`Foto ${idx + 1}`} width={160} height={160} className="w-full h-full object-cover" />
                        
                        {/* Badge Urutan Foto */}
                        <div className="absolute top-1.5 left-1.5">
                          {idx === 0 ? (
                            <span className="px-1.5 py-0.5 rounded bg-[#84CC16] text-[#09090B] text-[9px] font-black uppercase tracking-wider">
                              ★ Utama
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-[#09090B]/80 text-[#D4D4D8] text-[9px] font-semibold border border-[#27272A]">
                              Foto #{idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Tombol Hapus Satuan */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          title="Hapus foto ini"
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded bg-red-600/90 hover:bg-red-600 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Baris Tombol Aksi Bawah */}
                      <div className="p-1.5 bg-[#14151C] border-t border-[#27272A] flex items-center justify-between text-[10px]">
                        {idx !== 0 ? (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(idx)}
                            className="text-[#84CC16] hover:underline font-semibold"
                          >
                            Jadikan Utama
                          </button>
                        ) : (
                          <span className="text-[#84CC16] font-medium">Foto Sampul</span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="text-red-400 hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Area Dropzone Upload (Muncul jika foto masih kurang dari 4) */}
              {images.length < 4 ? (
                <div className="relative border border-dashed border-[#3F3F46] rounded-xl p-4 bg-[#0D0E12] text-center overflow-hidden">
                  {(uploadStatus === "compressing" || uploadStatus === "uploading") && (
                    <div className="absolute inset-0 z-20 bg-[#0C0D11]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-3.5 animate-in fade-in duration-200">
                      <div className="relative flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-2 border-[#27272A] border-t-[#84CC16] animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-black text-[#84CC16]">
                            {uploadStatus === "compressing" ? "⚡" : `${uploadProgress}%`}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#84CC16]/10 text-[#84CC16] text-[11px] font-semibold border border-[#84CC16]/30">
                          {uploadStatus === "compressing"
                            ? "Tahap 1/2: Mengompres Foto (WebP)..."
                            : `Tahap 2/2: Mengunggah Galeri Foto (${uploadProgress}%)`}
                        </div>
                        <p className="text-xs text-[#FAFAFA] font-medium max-w-xs truncate mx-auto">
                          {uploadFileName || "Memproses berkas gambar..."}
                        </p>
                        <p className="text-[11px] text-[#A1A1AA]">
                          {uploadStatus === "compressing"
                            ? "Mengompres foto ke format WebP agar ringan & cepat..."
                            : "Menyimpan ke media storage cloud UploadThing..."}
                        </p>
                      </div>

                      <div className="w-full max-w-xs bg-[#1F2026] h-2 rounded-full overflow-hidden border border-[#2E303B]">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            uploadStatus === "compressing"
                              ? "w-1/3 bg-[#84CC16] animate-pulse"
                              : "bg-gradient-to-r from-[#84CC16] to-[#A3E635] shadow-[0_0_12px_rgba(132,204,22,0.6)]"
                          }`}
                          style={
                            uploadStatus === "uploading"
                              ? { width: `${Math.max(uploadProgress, 12)}%` }
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  )}

                  <UploadDropzone
                    endpoint="catalogImage"
                    onBeforeUploadBegin={async (files) => {
                      setUploadStatus("compressing");
                      setUploadProgress(15);
                      if (files[0]) setUploadFileName(files[0].name);
                      try {
                        const compressed = await Promise.all(
                          files.slice(0, 4 - images.length).map((f) => compressImageToWebP(f, 1200, 1200, 0.82))
                        );
                        return compressed;
                      } catch {
                        return files.slice(0, 4 - images.length);
                      }
                    }}
                    onUploadBegin={(name) => {
                      setUploadStatus("uploading");
                      setUploadProgress(30);
                      setUploadFileName(name);
                    }}
                    onUploadProgress={(progress) => {
                      setUploadStatus("uploading");
                      setUploadProgress(progress);
                    }}
                    onClientUploadComplete={(res) => {
                      if (res && res.length > 0) {
                        const newUploaded = res.map((r) => ({
                          url: r.ufsUrl || r.url,
                          key: r.key,
                        }));
                        setImages((prev) => [...prev, ...newUploaded].slice(0, 4));
                        setUploadStatus("success");
                        setUploadProgress(100);
                        setStatusMessage({
                          type: "success",
                          text: `${res.length} foto jersey berhasil diunggah!`,
                        });
                      }
                    }}
                    onUploadError={(err: Error) => {
                      setUploadStatus("error");
                      setUploadProgress(0);
                      setStatusMessage({
                        type: "error",
                        text: `Gagal mengunggah foto: ${err.message}`,
                      });
                    }}
                    appearance={{
                      container: "border-none p-2",
                      label: "text-xs text-[#A1A1AA] hover:text-[#FAFAFA]",
                      button: "bg-[#84CC16] text-[#09090B] font-bold text-xs px-4 py-2 rounded-lg hover:bg-[#9ee238]",
                      allowedContent: "text-[10px] text-[#71717A]",
                    }}
                  />
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#84CC16]/10 border border-[#84CC16]/30 text-xs text-[#84CC16] flex items-center justify-between font-medium">
                  <span>✓ Kuota 4 foto sudah terpenuhi. Hapus salah satu foto di atas jika ingin mengganti dengan foto lain.</span>
                </div>
              )}
            </div>

            {/* Bagian 2: Input Data Spesifikasi Produk */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#27272A]">
              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Nama Model / Seri <span className="text-[#84CC16]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Apex Pro Striker Series"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Kategori Olahraga / Produk <span className="text-[#84CC16]">*</span>
                  <span className="text-[10px] text-[#71717A] font-normal ml-1">(Ketik bebas atau pilih saran)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    list="category-suggestions"
                    placeholder="Ketik kategori bebas (misal: VOLI, TENNIS, dll.)"
                    value={category}
                    onChange={(e) => setCategory(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none uppercase font-semibold"
                  />
                  <datalist id="category-suggestions">
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>

                {/* Pil Saran Kategori Cepat */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {allCategories.slice(0, 8).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                        category === cat
                          ? "bg-[#84CC16] text-[#09090B] font-bold"
                          : "bg-[#181920] text-[#A1A1AA] hover:text-[#FAFAFA] border border-[#27272A]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Keterangan
                </label>
                <input
                  type="text"
                  placeholder="Misal: Menggunakan bahan jacquard motif batik (opsional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>
            </div>

            {/* Checkbox Unggulan & Status Aktif */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-[#27272A] bg-[#09090B] text-[#84CC16] accent-[#84CC16]"
                />
                <label htmlFor="isFeatured" className="text-xs text-[#D4D4D8] cursor-pointer">
                  Tampilkan di Seksi Unggulan (*Featured*)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-[#27272A] bg-[#09090B] text-[#84CC16] accent-[#84CC16]"
                />
                <label htmlFor="isActive" className="text-xs text-[#D4D4D8] cursor-pointer">
                  Status Aktif (Tampilkan di Katalog Publik)
                </label>
              </div>
            </div>

            {/* Tombol Simpan & Status Kesiapan */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#27272A]">
              <div className="text-[11px]">
                {uploadStatus === "compressing" || uploadStatus === "uploading" ? (
                  <span className="text-[#84CC16] flex items-center gap-1.5 font-medium animate-pulse">
                    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Sedang memproses galeri foto ({uploadProgress}%)... Tombol simpan akan aktif setelah selesai.
                  </span>
                ) : images.length === 0 ? (
                  <span className="text-[#71717A] flex items-center gap-1">
                    <span>💡</span> Unggah minimal 1 foto jersey untuk mengaktifkan tombol simpan.
                  </span>
                ) : (
                  <span className="text-[#84CC16] flex items-center gap-1.5 font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {images.length} foto siap disimpan! {sizeChartUrl ? "• Size chart terpasang 📐" : ""}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg border border-[#27272A] text-xs text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18191E]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || images.length === 0 || uploadStatus === "compressing" || uploadStatus === "uploading"}
                  className="px-5 py-2 rounded-lg bg-[#84CC16] disabled:opacity-40 disabled:cursor-not-allowed text-[#09090B] font-bold text-xs hover:bg-[#9ee238] transition-all flex items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : uploadStatus === "compressing" || uploadStatus === "uploading" ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      <span>Mengunggah Foto...</span>
                    </>
                  ) : editingItem ? (
                    "Simpan Perubahan"
                  ) : (
                    "Simpan Produk"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data Katalog Produk */}
      <div className="rounded-xl border border-[#18181B] bg-[#0C0D11] overflow-hidden">
        <div className="p-4 border-b border-[#18181B] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#FAFAFA]">
            Daftar Model Jersey ({items.length} Produk)
          </span>
          <span className="text-[11px] text-[#71717A]">
            Mendukung Galeri Foto Multi-Upload (Maks 4) &amp; Panduan Ukuran (Size Chart)
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#71717A] space-y-2">
            <p>Belum ada produk yang diunggah.</p>
            <p className="text-[11px] text-[#52525B]">
              Klik tombol &quot;Tambah Model &amp; Upload&quot; di atas untuk mengunggah model jersey pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#D4D4D8]">
              <thead className="bg-[#121318] text-[11px] text-[#71717A] uppercase tracking-wider border-b border-[#18181B]">
                <tr>
                  <th className="py-3 px-4">Foto & Galeri</th>
                  <th className="py-3 px-4">Nama Model</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">Size Chart</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18181B]">
                {items.map((item) => {
                  const itemImages = getCatalogImages(item);
                  const displayThumb = itemImages[0]?.url || item.imageUrl;

                  return (
                    <tr key={item.id} className="hover:bg-[#14151B] transition-colors">
                      <td className="py-3 px-4">
                        <div className="relative inline-block">
                          {displayThumb ? (
                            <a
                              href={displayThumb}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Klik untuk lihat foto utama"
                              className="block w-12 h-12 rounded-lg bg-[#181920] border border-[#27272A] overflow-hidden"
                            >
                              <Image
                                src={displayThumb}
                                alt={item.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover hover:scale-110 transition-transform"
                              />
                            </a>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-[#181920] border border-[#27272A] flex items-center justify-center text-[10px] text-[#71717A]">
                              No Foto
                            </div>
                          )}

                          {/* Badge jumlah foto jika lebih dari 1 */}
                          {itemImages.length > 1 && (
                            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#84CC16] text-[#09090B] text-[9px] font-black border border-[#09090B] shadow-sm">
                              +{itemImages.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#FAFAFA] block">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#71717A]">
                          {itemImages.length} foto galeri
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#181920] text-[#84CC16] text-[10px] font-bold border border-[#27272A]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#FAFAFA] max-w-xs">
                        <span className="block line-clamp-2">{item.description || "-"}</span>
                        {item.minOrder && (
                          <span className="text-[10px] text-[#71717A] font-normal">
                            Min. order: {item.minOrder}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.sizeChartUrl ? (
                          <button
                            type="button"
                            onClick={() => setModalSizeChart({ title: item.title, url: item.sizeChartUrl! })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-semibold transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Lihat Size Chart</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#52525B]">Belum ada</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {item.isFeatured ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#84CC16]/10 text-[#84CC16] text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                              Unggulan
                            </span>
                          ) : (
                            <span className="text-[#52525B] text-[11px]">Reguler</span>
                          )}
                          {!item.isActive && (
                            <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 text-[9px] font-medium border border-amber-500/20">
                              Nonaktif (Draft)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            className="px-2.5 py-1 rounded bg-[#181920] hover:bg-[#84CC16]/10 text-[#84CC16] hover:text-[#9ee238] border border-[#27272A] hover:border-[#84CC16]/30 text-[11px] font-medium transition-colors"
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

      {/* Modal Lightbox Tampilan Penuh Size Chart */}
      {modalSizeChart && (
        <div className="fixed inset-0 z-50 bg-[#09090B]/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#141418] border border-[#27272A] rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📐</span>
                <h3 className="text-sm font-bold text-[#FAFAFA]">
                  Panduan Ukuran (Size Chart) — {modalSizeChart.title || "Jersey"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalSizeChart(null)}
                className="w-8 h-8 rounded-lg bg-[#181920] border border-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto rounded-xl border border-[#27272A] bg-[#09090B] flex items-center justify-center p-3">
              <Image
                src={modalSizeChart.url}
                alt={`Size Chart ${modalSizeChart.title}`}
                width={800}
                height={600}
                className="max-w-full w-auto max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#71717A]">
                Format gambar resolusi tinggi untuk panduan ukuran baju tim.
              </span>
              <a
                href={modalSizeChart.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#84CC16] hover:underline font-semibold"
              >
                Buka Gambar di Tab Baru ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
