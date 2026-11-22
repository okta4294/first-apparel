"use client";

import { useState } from "react";
import { createReviewAction, updateReviewAction, deleteReviewAction } from "./actions";

export interface ReviewItem {
  id: number;
  customerName: string;
  teamOrRole: string | null;
  productName: string | null;
  rating: number;
  comment: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewManagerProps {
  initialItems: ReviewItem[];
}

function StarIcon({ filled, className = "w-4 h-4" }: { filled: boolean; className?: string }) {
  return (
    <svg
      className={`${className} ${filled ? "text-[#84CC16] fill-[#84CC16]" : "text-[#3F3F46] fill-transparent"}`}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
      />
    </svg>
  );
}

export function ReviewManager({ initialItems }: ReviewManagerProps) {
  const [items, setItems] = useState<ReviewItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<ReviewItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [teamOrRole, setTeamOrRole] = useState("");
  const [productName, setProductName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setCustomerName("");
    setTeamOrRole("");
    setProductName("");
    setRating(5);
    setComment("");
    setSortOrder(0);
    setIsActive(true);
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleStartEdit = (item: ReviewItem) => {
    setEditingItem(item);
    setCustomerName(item.customerName);
    setTeamOrRole(item.teamOrRole || "");
    setProductName(item.productName || "");
    setRating(item.rating);
    setComment(item.comment);
    setSortOrder(item.sortOrder);
    setIsActive(item.isActive);
    setIsAdding(true);
    setStatusMessage(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) {
      setStatusMessage({ type: "error", text: "Nama pelanggan dan isi ulasan wajib diisi." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("customerName", customerName.trim());
    if (teamOrRole.trim()) formData.append("teamOrRole", teamOrRole.trim());
    if (productName.trim()) formData.append("productName", productName.trim());
    formData.append("rating", rating.toString());
    formData.append("comment", comment.trim());
    formData.append("sortOrder", sortOrder.toString());
    if (isActive) formData.append("isActive", "on");

    if (editingItem) {
      formData.append("id", editingItem.id.toString());
      const res = await updateReviewAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === editingItem.id
              ? {
                  ...it,
                  customerName: customerName.trim(),
                  teamOrRole: teamOrRole.trim() || null,
                  productName: productName.trim() || null,
                  rating,
                  comment: comment.trim(),
                  sortOrder,
                  isActive,
                  updatedAt: new Date(),
                }
              : it
          )
        );
        resetForm();
        setStatusMessage({ type: "success", text: "Ulasan pelanggan berhasil diperbarui." });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal memperbarui ulasan." });
      }
    } else {
      const res = await createReviewAction(formData);
      setIsSubmitting(false);

      if (res.success && res.item) {
        setItems((prev) => [res.item as ReviewItem, ...prev]);
        resetForm();
        setStatusMessage({ type: "success", text: "Ulasan pelanggan berhasil ditambahkan." });
      } else if (res.success) {
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal menambahkan ulasan." });
      }
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Hapus ulasan dari "${name}"? Ulasan ini tidak akan tampil lagi di beranda.`)) {
      return;
    }

    const res = await deleteReviewAction(id);
    if (res.success) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      setStatusMessage({ type: "success", text: `Ulasan dari "${name}" berhasil dihapus.` });
    } else {
      setStatusMessage({ type: "error", text: res.error || "Gagal menghapus ulasan." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181B]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">
            Manajemen Ulasan Pelanggan
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Catat testimoni asli dan rating bintang dari tim atau pelanggan yang tampil di halaman beranda.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (isAdding) {
              resetForm();
            } else {
              setIsAdding(true);
              setStatusMessage(null);
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84CC16] hover:bg-[#9ee238] text-[#09090B] text-xs font-bold transition-colors self-start sm:self-auto"
        >
          {isAdding ? "Tutup Formulir" : "+ Tambah Ulasan"}
        </button>
      </div>

      {/* Pesan Status */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-lg text-xs font-medium border ${
            statusMessage.type === "success"
              ? "bg-[#84CC16]/10 border-[#84CC16]/30 text-[#84CC16]"
              : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Formulir Tambah / Edit */}
      {isAdding && (
        <form
          onSubmit={handleFormSubmit}
          className="rounded-xl bg-[#121316] border border-[#1F2026] p-5 sm:p-6 space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2026]">
            <h2 className="text-sm font-semibold text-[#FAFAFA]">
              {editingItem ? "Edit Ulasan Pelanggan" : "Tambah Ulasan Pelanggan Baru"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
                Nama Pelanggan <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="customerName"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nama pelanggan atau kapten tim"
                className="w-full px-3.5 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#84CC16]"
              />
            </div>

            <div>
              <label htmlFor="teamOrRole" className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
                Nama Tim / Komunitas (Opsional)
              </label>
              <input
                id="teamOrRole"
                type="text"
                value={teamOrRole}
                onChange={(e) => setTeamOrRole(e.target.value)}
                placeholder="Tim, klub, atau asal kota"
                className="w-full px-3.5 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#84CC16]"
              />
            </div>

            <div>
              <label htmlFor="productName" className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
                Jenis Pesanan / Model (Opsional)
              </label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Model jersey atau bahan yang dipesan"
                className="w-full px-3.5 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#84CC16]"
              />
            </div>

            <div>
              <span className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
                Rating Bintang <span className="text-[#EF4444]">*</span>
              </span>
              <div className="flex items-center gap-2 py-1.5" role="radiogroup" aria-label="Pilih rating bintang">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star} bintang`}
                    aria-checked={rating === star}
                    role="radio"
                    className="p-1.5 rounded-md bg-[#09090B] border border-[#27272A] hover:border-[#84CC16] transition-colors"
                  >
                    <StarIcon filled={star <= rating} className="w-5 h-5" />
                  </button>
                ))}
                <span className="text-xs font-semibold text-[#FAFAFA] ml-2 tabular-nums">
                  {rating} / 5
                </span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
              Isi Ulasan Pelanggan <span className="text-[#EF4444]">*</span>
            </label>
            <textarea
              id="comment"
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis ulasan asli dari pelanggan..."
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:outline-none focus:border-[#84CC16]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label htmlFor="sortOrder" className="block text-xs font-medium text-[#D4D4D8] mb-1.5">
                Urutan Tampil
              </label>
              <input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                className="w-full max-w-[140px] px-3.5 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:outline-none focus:border-[#84CC16]"
              />
            </div>

            <label className="inline-flex items-center gap-2.5 text-xs text-[#D4D4D8] cursor-pointer pt-4 sm:pt-0">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded accent-[#84CC16]"
              />
              <span>Tampilkan di halaman beranda</span>
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-[#1F2026]">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-[#84CC16] hover:bg-[#9ee238] text-[#09090B] text-xs font-bold transition-colors disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Simpan Ulasan"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 rounded-lg bg-[#181920] border border-[#27272A] text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Daftar Ulasan */}
      {items.length === 0 ? (
        <div className="rounded-xl bg-[#121316] border border-[#1F2026] p-10 text-center space-y-3">
          <p className="text-sm font-medium text-[#FAFAFA]">Belum ada ulasan pelanggan</p>
          <p className="text-xs text-[#71717A] max-w-md mx-auto">
            Tambahkan ulasan asli dari pelanggan atau kapten tim yang sudah memesan agar tampil di halaman beranda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-[#121316] border border-[#1F2026] p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#FAFAFA]">{item.customerName}</h3>
                    {item.teamOrRole && (
                      <p className="text-xs text-[#A1A1AA]">{item.teamOrRole}</p>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                      item.isActive
                        ? "bg-[#84CC16]/10 border-[#84CC16]/30 text-[#84CC16]"
                        : "bg-[#181920] border-[#27272A] text-[#71717A]"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${item.isActive ? "bg-[#84CC16]" : "bg-[#52525B]"}`} />
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                <div className="flex items-center gap-1" aria-label={`Rating ${item.rating} dari 5 bintang`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} filled={star <= item.rating} className="w-4 h-4" />
                  ))}
                  {item.productName && (
                    <span className="text-[11px] text-[#71717A] ml-2 truncate">
                      {item.productName}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#D4D4D8] leading-relaxed">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#1F2026] text-xs">
                <span className="text-[11px] text-[#71717A] tabular-nums">
                  Urutan: {item.sortOrder}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(item)}
                    className="px-3 py-1.5 rounded-md bg-[#181920] border border-[#27272A] text-[#D4D4D8] hover:text-[#FAFAFA] hover:border-[#3F3F46] transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.customerName)}
                    className="px-3 py-1.5 rounded-md bg-[#181920] border border-[#27272A] text-[#EF4444] hover:bg-[#EF4444]/10 hover:border-[#EF4444]/30 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
