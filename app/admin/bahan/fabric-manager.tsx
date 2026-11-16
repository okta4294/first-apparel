"use client";

import { useState } from "react";
import { createFabricAction, updateFabricAction, deleteFabricAction } from "./actions";

export interface FabricItem {
  id: number;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface FabricManagerProps {
  initialItems: FabricItem[];
}

export function FabricManager({ initialItems }: FabricManagerProps) {
  const [items, setItems] = useState<FabricItem[]>(initialItems);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<FabricItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName("");
    setDescription("");
    setSortOrder(0);
    setIsActive(true);
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleStartEdit = (item: FabricItem) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
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
    if (!name.trim() || !description.trim()) {
      setStatusMessage({ type: "error", text: "Mohon isi nama bahan kain dan deskripsi karakteristiknya." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("sortOrder", sortOrder.toString());
    if (isActive) formData.append("isActive", "on");

    if (editingItem) {
      formData.append("id", editingItem.id.toString());
      const res = await updateFabricAction(formData);
      setIsSubmitting(false);

      if (res.success) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === editingItem.id
              ? {
                  ...it,
                  name: name.trim(),
                  description: description.trim(),
                  sortOrder,
                  isActive,
                  updatedAt: new Date(),
                }
              : it
          )
        );
        resetForm();
        setStatusMessage({ type: "success", text: "Bahan kain berhasil diperbarui!" });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal memperbarui bahan kain." });
      }
    } else {
      const res = await createFabricAction(formData);
      setIsSubmitting(false);

      if (res.success && res.item) {
        setItems((prev) => [...prev, res.item as FabricItem]);
        resetForm();
        setStatusMessage({ type: "success", text: "Bahan kain baru berhasil ditambahkan!" });
      } else if (res.success) {
        window.location.reload();
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal menambahkan bahan kain." });
      }
    }
  };

  const handleDelete = async (id: number, fabricName: string) => {
    if (!confirm(`Hapus pilihan bahan "${fabricName}"? Bahan ini tidak akan tampil lagi di halaman panduan.`)) {
      return;
    }

    const res = await deleteFabricAction(id);
    if (res.success) {
      setItems((prev) => prev.filter((it) => it.id !== id));
      setStatusMessage({ type: "success", text: `Bahan "${fabricName}" berhasil dihapus.` });
    } else {
      setStatusMessage({ type: "error", text: res.error || "Gagal menghapus bahan." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#18181B]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">
            Manajemen Pilihan Bahan Kain (Fabrics)
          </h1>
          <p className="text-xs text-[#71717A] mt-0.5">
            Kelola jenis kain dryfit, karakteristik, dan keunggulan yang ditampilkan pada seksi panduan bahan di halaman Alur Pemesanan.
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84CC16] hover:bg-[#9ee238] text-[#09090B] text-xs font-bold transition-all shadow-sm self-start sm:self-auto"
        >
          {isAdding ? (
            <>
              <span>✕</span>
              <span>Tutup Formulir</span>
            </>
          ) : (
            <>
              <span>+</span>
              <span>Tambah Bahan Baru</span>
            </>
          )}
        </button>
      </div>

      {/* Alert Notifikasi */}
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

      {/* Form Tambah / Edit Bahan */}
      {isAdding && (
        <form onSubmit={handleFormSubmit} className="p-6 rounded-xl bg-[#141418] border border-[#27272A] space-y-4">
          <div className="border-b border-[#27272A] pb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#FAFAFA]">
              {editingItem ? `Edit Bahan: ${editingItem.name}` : "Tambah Pilihan Bahan Baru"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-[#71717A] hover:text-[#FAFAFA]"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Nama Bahan / Jenis Kain <span className="text-[#84CC16]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Dryfit Milano, Dryfit Brazil, Micro Mesh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
                Urutan Tampil (Sort Order)
              </label>
              <input
                type="number"
                min="0"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[#D4D4D8] block mb-1">
              Deskripsi Karakteristik &amp; Keunggulan Kain <span className="text-[#84CC16]">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Jelaskan tekstur pola serat, elastisitas, daya serap keringat, dan jenis olahraga yang cocok menggunakan bahan ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] focus:border-[#84CC16] focus:outline-none resize-y"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveFabric"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded bg-[#09090B] border-[#27272A] text-[#84CC16] focus:ring-[#84CC16]"
            />
            <label htmlFor="isActiveFabric" className="text-xs font-medium text-[#D4D4D8] cursor-pointer">
              Tampilkan bahan ini di halaman Alur Pemesanan publik (Aktif)
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#27272A]">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg bg-[#1F1F24] text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-[#84CC16] disabled:opacity-50 text-[#09090B] font-bold text-xs hover:bg-[#9ee238] transition-colors"
            >
              {isSubmitting ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Tambahkan Bahan"}
            </button>
          </div>
        </form>
      )}

      {/* Daftar Bahan Kain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-16 rounded-xl bg-[#141418] border border-[#27272A] p-6">
            <span className="text-3xl block mb-2">🧵</span>
            <h3 className="text-sm font-semibold text-[#FAFAFA]">Belum ada bahan kain terdaftar</h3>
            <p className="text-xs text-[#71717A] mt-1">
              Klik tombol &quot;Tambah Bahan Baru&quot; di atas untuk memasukkan pilihan kain pertama Anda.
            </p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl bg-[#141418] border border-[#27272A] p-5 flex flex-col justify-between hover:border-[#84CC16]/40 transition-colors group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="w-8 h-8 rounded-lg bg-[#84CC16]/10 text-[#84CC16] font-black text-xs flex items-center justify-center">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.isActive
                          ? "bg-[#84CC16]/10 text-[#84CC16] border border-[#84CC16]/20"
                          : "bg-[#27272A] text-[#71717A]"
                      }`}
                    >
                      {item.isActive ? "Aktif Tayang" : "Nonaktif"}
                    </span>
                    <span className="text-[10px] text-[#71717A] font-mono">
                      Urutan: {item.sortOrder}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors mb-2">
                  {item.name}
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-4">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#27272A] flex items-center justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleStartEdit(item)}
                  className="px-3 py-1.5 rounded-md bg-[#1F1F24] hover:bg-[#27272A] text-[#FAFAFA] font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.name)}
                  className="px-3 py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
