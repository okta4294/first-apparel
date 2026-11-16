"use client";

import { useState, useMemo, useEffect } from "react";
import { SizeChartTrigger } from "@/components/size-chart-trigger";

export interface CatalogImageItem {
  url: string;
  key: string;
}

export interface CatalogItem {
  id: number;
  title: string;
  category: string;
  fabric: string;
  priceInfo: string | null;
  imageUrl: string;
  imageKey: string;
  images: string | null;
  sizeChartUrl: string | null;
  sizeChartKey: string | null;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
}

interface KatalogClientProps {
  items: CatalogItem[];
  waNumber: string;
}

function getCatalogImages(item: CatalogItem): CatalogImageItem[] {
  if (item.images) {
    try {
      const parsed = JSON.parse(item.images);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // ignore
    }
  }
  if (item.imageUrl && item.imageKey) {
    return [{ url: item.imageUrl, key: item.imageKey }];
  }
  return [];
}

export function KatalogClient({ items, waNumber }: KatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("SEMUA");
  const [searchQuery, setSearchQuery] = useState("");
  // Track selected active image per catalog card (card id -> image url)
  const [activeImages, setActiveImages] = useState<Record<number, string>>({});

  // State untuk modal pop-up galeri gambar desain
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<{
    item: CatalogItem;
    activeIndex: number;
  } | null>(null);

  // Navigasi keyboard untuk modal pop-up (Escape, Panah Kiri, Panah Kanan)
  useEffect(() => {
    if (!selectedGalleryItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedGalleryItem(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedGalleryItem((prev) => {
          if (!prev) return null;
          const images = getCatalogImages(prev.item);
          if (images.length <= 1) return prev;
          const nextIdx = (prev.activeIndex - 1 + images.length) % images.length;
          return { ...prev, activeIndex: nextIdx };
        });
      } else if (e.key === "ArrowRight") {
        setSelectedGalleryItem((prev) => {
          if (!prev) return null;
          const images = getCatalogImages(prev.item);
          if (images.length <= 1) return prev;
          const nextIdx = (prev.activeIndex + 1) % images.length;
          return { ...prev, activeIndex: nextIdx };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedGalleryItem]);

  const openGalleryModal = (item: CatalogItem, initialUrl?: string) => {
    const images = getCatalogImages(item);
    let idx = 0;
    if (initialUrl && images.length > 0) {
      const foundIdx = images.findIndex((img) => img.url === initialUrl);
      if (foundIdx >= 0) idx = foundIdx;
    }
    setSelectedGalleryItem({ item, activeIndex: idx });
  };

  // Kategori dinamis yang diambil otomatis dari data produk aktif di database
  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((item) => {
      if (item.category?.trim()) {
        cats.add(item.category.trim().toUpperCase());
      }
    });
    return ["SEMUA", ...Array.from(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat =
        selectedCategory === "SEMUA" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.fabric.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const handleSelectThumbnail = (itemId: number, url: string) => {
    setActiveImages((prev) => ({ ...prev, [itemId]: url }));
  };

  const getWaOrderLink = (item: CatalogItem) => {
    const text = `Halo Admin First Apparel, saya tertarik memesan custom jersey model ${item.title} (Kategori: ${item.category}). Bisa info detail dan konsultasi desainnya?`;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-8">
      {/* Bar Pencarian & Filter Kategori */}
      <div className="space-y-5 bg-[#121318] border border-[#27272A] rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <svg
              className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari model jersey atau jenis bahan kain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#09090B] border border-[#27272A] text-xs text-[#FAFAFA] placeholder:text-[#52525B] focus:border-[#84CC16] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#71717A] hover:text-[#FAFAFA]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-[#71717A]">
            Menampilkan{" "}
            <span className="font-bold text-[#84CC16] tabular-nums">
              {filteredItems.length}
            </span>{" "}
            dari {items.length} model desain
          </div>
        </div>

        {/* Pil Filter Kategori Olahraga Dinamis */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dynamicCategories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#84CC16] text-[#09090B] font-bold shadow-sm"
                    : "bg-[#181920] text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#20212B] border border-[#27272A]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Katalog Jersey */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-[#121318] border border-[#27272A] rounded-2xl p-8 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#181920] border border-[#27272A] flex items-center justify-center text-2xl text-[#84CC16]">
            🔍
          </div>
          <h3 className="text-base font-bold text-[#FAFAFA]">Model Jersey Tidak Ditemukan</h3>
          <p className="text-xs text-[#71717A] max-w-sm mx-auto">
            Tidak ada desain yang cocok dengan kata kunci &quot;{searchQuery}&quot; atau kategori yang dipilih.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("SEMUA");
            }}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#84CC16] text-[#09090B] font-bold text-xs hover:bg-[#9ee238] transition-colors"
          >
            Reset Filter &amp; Tampilkan Semua
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const itemImages = getCatalogImages(item);
            const activeImage =
              activeImages[item.id] || itemImages[0]?.url || item.imageUrl;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#141418] border border-[#27272A] hover:border-[#3F3F46] hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                <div>
                  {/* Foto Utama & Badge */}
                  <div
                    onClick={() => openGalleryModal(item, activeImage)}
                    className="h-60 bg-gradient-to-b from-[#1C1D24] to-[#121318] border-b border-[#27272A] relative overflow-hidden flex items-center justify-center cursor-pointer select-none group/img"
                    title="Klik untuk membuka galeri foto pop-up"
                  >
                    {/* Badge Kategori */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#09090B]/85 backdrop-blur-sm border border-[#27272A] text-[10px] font-bold text-[#84CC16] tracking-wider uppercase">
                        {item.category}
                      </span>
                    </div>

                    {/* Badge Unggulan jika ada */}
                    {item.isFeatured && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#84CC16] text-[#09090B] text-[10px] font-black uppercase tracking-wider shadow-sm">
                          ★ Unggulan
                        </span>
                      </div>
                    )}

                    {/* Tombol Overlay Hover "Lihat Galeri Foto" */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity z-10 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#09090B]/90 border border-[#84CC16] text-xs font-bold text-[#84CC16] shadow-xl transform translate-y-1 group-hover/img:translate-y-0 transition-transform">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                        Lihat Galeri Foto
                      </span>
                    </div>

                    {activeImage ? (
                      <img
                        src={activeImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      />
                    ) : (
                      <div className="text-center space-y-2 relative z-10">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#181922] border border-[#84CC16]/25 flex items-center justify-center text-[#84CC16]">
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-bold block">
                          Preview Mockup HD
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Strip Thumbnail Galeri (Jika Memiliki Lebih Dari 1 Foto) */}
                  {itemImages.length > 1 && (
                    <div className="flex items-center gap-2 p-3 bg-[#0E0F14] border-b border-[#27272A] overflow-x-auto">
                      <span className="text-[10px] font-bold text-[#71717A] shrink-0 uppercase tracking-wider">
                        Sudut:
                      </span>
                      {itemImages.map((img, idx) => {
                        const isCurrentActive =
                          (activeImages[item.id] || itemImages[0]?.url) === img.url;

                        return (
                          <button
                            key={img.key || idx}
                            type="button"
                            onClick={() => handleSelectThumbnail(item.id, img.url)}
                            className={`w-10 h-10 rounded-md overflow-hidden border shrink-0 transition-all ${
                              isCurrentActive
                                ? "border-[#84CC16] ring-1 ring-[#84CC16]"
                                : "border-[#27272A] opacity-60 hover:opacity-100"
                            }`}
                            title={`Lihat Sudut Foto ${idx + 1}`}
                          >
                            <img src={img.url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Detail Spesifikasi Produk */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3
                        onClick={() => openGalleryModal(item, activeImage)}
                        className="text-base font-bold text-[#FAFAFA] leading-snug group-hover:text-[#84CC16] transition-colors cursor-pointer"
                        title="Klik untuk membuka galeri foto pop-up"
                      >
                        {item.title}
                      </h3>

                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1C1D24] border border-[#27272A] text-[11px] text-[#D4D4D8] font-medium mt-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                        <span>{item.fabric}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Kartu & Tombol Aksi */}
                <div className="p-5 pt-0">
                  <div className="pt-4 border-t border-[#1F1F23] space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#0A0B0E] border border-[#1F2026]">
                      {/* Baris Atas: Label & Lencana Spesifikasi */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold text-[#84CC16] tracking-widest uppercase">
                          HARGA MULAI
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#181920] border border-[#27272A] text-[10px] font-bold text-[#D4D4D8] uppercase tracking-wider shrink-0">
                          Full Print
                        </span>
                      </div>

                      {/* Baris Bawah: Angka Harga Tanpa Patah Baris */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#FAFAFA] tabular-nums whitespace-nowrap">
                          {item.priceInfo
                            ? item.priceInfo.replace(/mulai\s*/i, "").replace(/\/.*$/, "").trim()
                            : "Hubungi Kami"}
                        </span>
                        <span className="text-xs font-semibold text-[#71717A] whitespace-nowrap">/ pcs</span>
                      </div>
                    </div>

                    {/* Tombol Panduan Ukuran (Size Chart) Jika Ada */}
                    {item.sizeChartUrl && (
                      <SizeChartTrigger
                        title={item.title}
                        sizeChartUrl={item.sizeChartUrl}
                      />
                    )}

                    {/* Tombol Order Langsung via WhatsApp */}
                    <a
                      href={getWaOrderLink(item)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#84CC16] hover:bg-[#9ee238] active:scale-[0.98] text-[#09090B] font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(132,204,22,0.25)] group-hover:shadow-[0_0_30px_rgba(132,204,22,0.4)]"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
                      </svg>
                      <span>Pesan Model Ini via WA →</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Pop-up Galeri Foto Desain (Lightbox) */}
      {selectedGalleryItem && (() => {
        const { item, activeIndex } = selectedGalleryItem;
        const galleryImages = getCatalogImages(item);
        const currentImg = galleryImages[activeIndex]?.url || item.imageUrl;
        const totalImages = galleryImages.length;

        const nextImage = () => {
          if (totalImages <= 1) return;
          setSelectedGalleryItem((prev) =>
            prev ? { ...prev, activeIndex: (prev.activeIndex + 1) % totalImages } : null
          );
        };

        const prevImage = () => {
          if (totalImages <= 1) return;
          setSelectedGalleryItem((prev) =>
            prev ? { ...prev, activeIndex: (prev.activeIndex - 1 + totalImages) % totalImages } : null
          );
        };

        return (
          <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
            onClick={() => setSelectedGalleryItem(null)}
          >
            <div
              className="relative w-full max-w-4xl bg-[#141418] border border-[#27272A] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272A] bg-[#0E0F14]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#181922] border border-[#27272A] text-[10px] font-bold text-[#84CC16] uppercase tracking-wider shrink-0">
                    {item.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#FAFAFA] truncate">
                    {item.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedGalleryItem(null)}
                  className="w-8 h-8 rounded-lg bg-[#181922] hover:bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA] flex items-center justify-center transition-colors text-sm shrink-0 ml-3"
                  title="Tutup (Esc)"
                >
                  ✕
                </button>
              </div>

              {/* Area Tampilan Gambar Utama Pop-up */}
              <div className="relative flex-1 min-h-[300px] max-h-[58vh] bg-[#09090B] flex items-center justify-center overflow-hidden p-4 select-none">
                {currentImg ? (
                  <img
                    src={currentImg}
                    alt={`${item.title} - Foto ${activeIndex + 1}`}
                    className="max-h-[54vh] max-w-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center text-[#71717A] text-xs">
                    Gambar tidak tersedia
                  </div>
                )}

                {/* Tombol Geser Panah Kiri */}
                {totalImages > 1 && (
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#84CC16] hover:text-[#09090B] text-white border border-white/20 flex items-center justify-center text-lg transition-all shadow-lg active:scale-95"
                    title="Foto Sebelumnya (Panah Kiri)"
                  >
                    ‹
                  </button>
                )}

                {/* Tombol Geser Panah Kanan */}
                {totalImages > 1 && (
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-[#84CC16] hover:text-[#09090B] text-white border border-white/20 flex items-center justify-center text-lg transition-all shadow-lg active:scale-95"
                    title="Foto Berikutnya (Panah Kanan)"
                  >
                    ›
                  </button>
                )}

                {/* Indikator Posisi Foto */}
                {totalImages > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-sm border border-[#27272A] text-[11px] font-bold text-[#FAFAFA] tabular-nums">
                    Foto {activeIndex + 1} dari {totalImages}
                  </div>
                )}
              </div>

              {/* Baris Strip Thumbnail Sudut Foto */}
              {totalImages > 1 && (
                <div className="flex items-center justify-center gap-2 p-3 bg-[#0E0F14] border-t border-b border-[#27272A] overflow-x-auto">
                  {galleryImages.map((img, idx) => {
                    const isCurrent = activeIndex === idx;
                    return (
                      <button
                        key={img.key || idx}
                        type="button"
                        onClick={() => setSelectedGalleryItem((prev) => prev ? { ...prev, activeIndex: idx } : null)}
                        className={`w-12 h-12 rounded-lg overflow-hidden border shrink-0 transition-all ${
                          isCurrent
                            ? "border-[#84CC16] ring-2 ring-[#84CC16] scale-105"
                            : "border-[#27272A] opacity-60 hover:opacity-100"
                        }`}
                        title={`Lihat Sudut Foto ${idx + 1}`}
                      >
                        <img src={img.url} alt={`Sudut ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Footer Info Produk & Aksi Cepat */}
              <div className="p-4 sm:p-5 bg-[#141418] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider">
                      Bahan:
                    </span>
                    <span className="text-xs font-bold text-[#FAFAFA] bg-[#1C1D24] px-2 py-0.5 rounded border border-[#27272A]">
                      {item.fabric}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider">
                      Estimasi:
                    </span>
                    <span className="text-base font-black text-[#84CC16] tabular-nums">
                      {item.priceInfo || "Hubungi Kami"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {item.sizeChartUrl && (
                    <SizeChartTrigger
                      title={item.title}
                      sizeChartUrl={item.sizeChartUrl}
                    />
                  )}
                  <a
                    href={getWaOrderLink(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-[#84CC16] hover:bg-[#9ee238] active:scale-[0.98] text-[#09090B] font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(132,204,22,0.25)]"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
                    </svg>
                    <span>Pesan via WA</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
