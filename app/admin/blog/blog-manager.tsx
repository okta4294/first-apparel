"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import { compressImageToWebP } from "@/lib/image-compression";
import { createBlogAction, updateBlogAction, deleteBlogAction } from "./actions";

export interface BlogItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  thumbnailKey: string;
  isPublished: boolean;
  publishedAt: Date;
  updatedAt: Date;
}

interface BlogManagerProps {
  initialItems: BlogItem[];
}

export function BlogManager({ initialItems }: BlogManagerProps) {
  const [items, setItems] = useState<BlogItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<BlogItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailKey, setThumbnailKey] = useState("");
  const [oldThumbnailKey, setOldThumbnailKey] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  // Upload states
  const [uploadStatus, setUploadStatus] = useState<"idle" | "compressing" | "uploading" | "success" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState(0);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setThumbnailUrl("");
    setThumbnailKey("");
    setOldThumbnailKey("");
    setIsPublished(true);
    setUploadStatus("idle");
    setUploadProgress(0);
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleStartEdit = (item: BlogItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSlug(item.slug);
    setExcerpt(item.excerpt);
    setContent(item.content);
    setThumbnailUrl(item.thumbnailUrl);
    setThumbnailKey(item.thumbnailKey);
    setOldThumbnailKey(item.thumbnailKey);
    setIsPublished(item.isPublished);
    setUploadStatus("success");
    setIsAdding(true);
    setStatusMessage(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !thumbnailUrl) {
      setStatusMessage({ type: "error", text: "Mohon lengkapi judul artikel dan unggah gambar thumbnail." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("title", title);
    if (slug) formData.append("slug", slug);
    formData.append("excerpt", excerpt);
    formData.append("content", content);
    formData.append("thumbnailUrl", thumbnailUrl);
    formData.append("thumbnailKey", thumbnailKey);
    if (isPublished) formData.append("isPublished", "on");

    if (editingItem) {
      formData.append("id", editingItem.id.toString());
      if (oldThumbnailKey) formData.append("oldThumbnailKey", oldThumbnailKey);

      const res = await updateBlogAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setStatusMessage({ type: "success", text: `Artikel "${title}" berhasil diperbarui!` });
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  title,
                  slug: slug || item.slug,
                  excerpt,
                  content,
                  thumbnailUrl,
                  thumbnailKey,
                  isPublished,
                  updatedAt: new Date(),
                }
              : item
          )
        );
        resetForm();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal memperbarui artikel." });
      }
    } else {
      const res = await createBlogAction(formData);
      setIsSubmitting(false);

      if (res.success && res.item) {
        setStatusMessage({ type: "success", text: "Artikel blog berhasil diterbitkan!" });
        setItems((prev) => [res.item as BlogItem, ...prev]);
        resetForm();
      } else if (res.success) {
        setStatusMessage({ type: "success", text: "Artikel blog berhasil diterbitkan!" });
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal menyimpan artikel." });
      }
    }
  };

  const handleDelete = async (item: BlogItem) => {
    if (!confirm(`Hapus artikel "${item.title}"?`)) return;

    const res = await deleteBlogAction(item.id, item.thumbnailKey);
    if (res.success) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setStatusMessage({ type: "success", text: "Artikel blog berhasil dihapus." });
    } else {
      setStatusMessage({ type: "error", text: res.error || "Gagal menghapus artikel." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181B]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Artikel Blog &amp; Edukasi</h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Publikasikan tips memilih bahan jersey, panduan desain, dan cerita komunitas untuk memperkuat SEO website.
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
          <span>{isAdding ? "Tutup Formulir" : "Tulis Artikel Baru"}</span>
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

      {/* Form Tambah / Edit Artikel */}
      {isAdding && (
        <div className="p-6 rounded-xl bg-[#141418] border border-[#27272A] space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
            <h2 className="text-sm font-semibold text-[#FAFAFA]">
              {editingItem ? `Edit Artikel: ${editingItem.title}` : "Tulis Artikel Blog Baru"}
            </h2>
            <span className="text-[11px] text-[#71717A]">
              Mendukung URL ramah SEO &amp; kompresi thumbnail WebP
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Judul Artikel <span className="text-[#84CC16]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Misal: 5 Jenis Kain Jersey Terbaik untuk Futsal & Sepak Bola"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-sm text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Kustom URL Slug <span className="text-[10px] text-[#71717A]">(Opsional / Otomatis)</span>
                </label>
                <input
                  type="text"
                  placeholder="jenis-kain-jersey-terbaik"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs font-mono text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                  Ringkasan Singkat (Excerpt)
                </label>
                <input
                  type="text"
                  placeholder="Ringkasan 1-2 kalimat yang tampil di kartu daftar artikel"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none"
                />
              </div>
            </div>

            {/* Unggah Thumbnail Artikel */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#D4D4D8] block">
                Gambar Sampul / Thumbnail <span className="text-[#84CC16]">*</span>
              </label>

              {thumbnailUrl ? (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-[#09090B] border border-[#84CC16]/40">
                  <div className="w-24 h-16 rounded-lg border border-[#27272A] overflow-hidden bg-[#141418] shrink-0">
                    <Image src={thumbnailUrl} alt="Thumbnail" width={96} height={64} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#84CC16] block">✓ Thumbnail Terpasang</span>
                    <span className="text-[10px] text-[#71717A] truncate block font-mono">Key: {thumbnailKey}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnailUrl("");
                      setThumbnailKey("");
                      setUploadStatus("idle");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                  >
                    Ganti Foto
                  </button>
                </div>
              ) : (
                <div className="relative border border-dashed border-[#3F3F46] rounded-xl p-3 bg-[#0D0E12] text-center overflow-hidden">
                  {(uploadStatus === "compressing" || uploadStatus === "uploading") && (
                    <div className="absolute inset-0 z-20 bg-[#0C0D11]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#27272A] border-t-[#84CC16] animate-spin" />
                      <span className="text-xs font-semibold text-[#84CC16]">
                        {uploadStatus === "compressing" ? "Mengompres thumbnail WebP..." : `Mengunggah (${uploadProgress}%)...`}
                      </span>
                    </div>
                  )}

                  <UploadDropzone
                    endpoint="blogThumbnail"
                    onBeforeUploadBegin={async (files) => {
                      setUploadStatus("compressing");
                      setUploadProgress(20);
                      try {
                        const compressed = await Promise.all(
                          files.map((f) => compressImageToWebP(f, 1200, 630, 0.82))
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
                        setThumbnailUrl(res[0].ufsUrl || res[0].url);
                        setThumbnailKey(res[0].key);
                        setUploadStatus("success");
                        setUploadProgress(100);
                      }
                    }}
                    onUploadError={(err: Error) => {
                      setUploadStatus("error");
                      setStatusMessage({
                        type: "error",
                        text: `Gagal upload thumbnail: ${err.message}`,
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

            {/* Isi Lengkap Artikel */}
            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Isi Konten Artikel <span className="text-[#84CC16]">*</span>
              </label>
              <textarea
                rows={8}
                required
                placeholder="Tuliskan isi artikel Anda di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Checkbox Status Terbit */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded border-[#27272A] bg-[#09090B] text-[#84CC16] accent-[#84CC16]"
              />
              <label htmlFor="isPublished" className="text-xs text-[#D4D4D8] cursor-pointer">
                Publikasikan Artikel Sekarang (Centang untuk tayang, hilangkan centang untuk draf)
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
                disabled={isSubmitting || !thumbnailUrl}
                className="px-5 py-2 rounded-lg bg-[#84CC16] disabled:opacity-50 text-[#09090B] font-bold text-xs hover:bg-[#9ee238] transition-colors"
              >
                {isSubmitting ? "Menyimpan..." : editingItem ? "Simpan Perubahan Artikel" : "Terbitkan Artikel"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabel Data Artikel Blog */}
      <div className="rounded-xl border border-[#18181B] bg-[#0C0D11] overflow-hidden">
        <div className="p-4 border-b border-[#18181B] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#FAFAFA]">
            Daftar Artikel Blog ({items.length} Artikel)
          </span>
          <span className="text-[11px] text-[#71717A]">
            Terkoneksi langsung ke rute publik blog
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#71717A] space-y-2">
            <p>Belum ada artikel yang dipublikasikan.</p>
            <p className="text-[11px] text-[#52525B]">
              Klik tombol &quot;Tulis Artikel Baru&quot; di atas untuk membuat artikel blog pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#D4D4D8]">
              <thead className="bg-[#121318] text-[11px] text-[#71717A] uppercase tracking-wider border-b border-[#18181B]">
                <tr>
                  <th className="py-3 px-4">Thumbnail</th>
                  <th className="py-3 px-4">Judul Artikel</th>
                  <th className="py-3 px-4">Slug URL</th>
                  <th className="py-3 px-4">Tanggal Rilis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18181B]">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#14151B] transition-colors">
                    <td className="py-3 px-4">
                      {item.thumbnailUrl ? (
                        <div className="w-14 h-9 rounded-lg bg-[#181920] border border-[#27272A] overflow-hidden">
                          <Image src={item.thumbnailUrl} alt={item.title} width={56} height={36} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#71717A]">No Image</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#FAFAFA]">
                      <div>{item.title}</div>
                      <span className="text-[10px] text-[#71717A] font-normal line-clamp-1">{item.excerpt}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#84CC16]">
                      /{item.slug}
                    </td>
                    <td className="py-3 px-4 text-[#A1A1AA]">
                      {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4">
                      {item.isPublished ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#84CC16]/10 text-[#84CC16] text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                          Tayang
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#27272A] text-[#71717A] text-[10px] font-medium">
                          Draf
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
