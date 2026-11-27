"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

export interface CatalogImageItem {
  url: string;
  key: string;
}

export interface CatalogItem {
  id: number;
  title: string;
  category: string;
  description: string | null;
  minOrder?: string | null;
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
  initialCategory?: string;
}

function getCoverImage(item: CatalogItem): string {
  if (item.images) {
    try {
      const parsed = JSON.parse(item.images);
      if (Array.isArray(parsed) && parsed[0]?.url) return parsed[0].url;
    } catch {
      // Fallback ke imageUrl
    }
  }
  return item.imageUrl;
}

function formatCategoryLabel(category: string): string {
  if (category === "SEMUA") return "Semua";
  return category
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function KatalogClient({ items, initialCategory }: KatalogClientProps) {
  const resolvedInitialCategory = useMemo(() => {
    if (!initialCategory?.trim()) return "SEMUA";
    const target = initialCategory.trim().toUpperCase();
    const matched = items.find((item) =>
      item.category?.trim().toUpperCase().includes(target)
    );
    return matched ? matched.category.trim().toUpperCase() : "SEMUA";
  }, [items, initialCategory]);

  const [selectedCategory, setSelectedCategory] = useState(resolvedInitialCategory);
  const [searchQuery, setSearchQuery] = useState("");

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
        (item.description?.toLowerCase().includes(query) ?? false) ||
        item.category.toLowerCase().includes(query);

      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const isFiltered = selectedCategory !== "SEMUA" || searchQuery.trim().length > 0;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Toolbar Filter & Pencarian */}
      <div className="border-b border-[#222E26] pb-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tab Kategori */}
          <div
            role="tablist"
            aria-label="Filter kategori katalog"
            className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {dynamicCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16] ${
                    isSelected
                      ? "bg-[#84CC16] text-[#0B100D] font-bold"
                      : "bg-[#19211C] text-[#A4B0A8] hover:text-[#F4F3EE] hover:bg-[#222E26]"
                  }`}
                >
                  {formatCategoryLabel(cat)}
                </button>
              );
            })}
          </div>

          {/* Kolom Pencarian */}
          <div className="relative w-full lg:w-80 shrink-0">
            <svg
              className="w-4 h-4 text-[#95A39A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Cari nama model atau keterangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari model jersey atau keterangan"
              className="w-full min-h-[44px] pl-10 pr-9 rounded-lg bg-[#19211C] border border-[#28352D] text-sm text-[#F4F3EE] placeholder:text-[#7E8D83] focus:border-[#84CC16] focus:bg-[#0F1512] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded-md text-xs text-[#95A39A] hover:text-[#F4F3EE] hover:bg-[#222E26]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Baris Ringkas Jumlah Hasil */}
        <div className="flex items-center justify-between text-sm text-[#95A39A]">
          <p>
            Menampilkan{" "}
            <span className="font-semibold text-[#F4F3EE] tabular-nums">
              {filteredItems.length}
            </span>
            {isFiltered ? ` dari ${items.length}` : ""} model
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("SEMUA");
              }}
              className="font-semibold text-[#A3E635] hover:text-[#BEF264] underline underline-offset-4 transition-colors"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>

      {/* Grid Produk */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-xl bg-[#19211C] border border-[#28352D] px-6">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#F4F3EE]">
            Tidak ada model yang cocok
          </h2>
          <p className="text-sm sm:text-base text-[#A4B0A8] max-w-md mx-auto">
            {searchQuery.trim()
              ? `Pencarian "${searchQuery.trim()}" tidak ditemukan di kategori ${formatCategoryLabel(selectedCategory)}.`
              : `Belum ada model pada kategori ${formatCategoryLabel(selectedCategory)}.`}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("SEMUA");
              }}
              className="inline-flex min-h-[44px] items-center px-5 py-2.5 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] text-[#0B100D] font-bold text-sm transition-colors"
            >
              Tampilkan semua model
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {filteredItems.map((item, itemIdx) => {
            const coverImage = getCoverImage(item);
            const rawDesc = item.description?.trim() || "";
            const hasDesc = Boolean(rawDesc && rawDesc !== "-");

            return (
              <Link
                key={item.id}
                href={`/katalog/${item.id}`}
                className="group block transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#84CC16] rounded-xl"
              >
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#19211C] border border-[#28352D]">
                  {item.isFeatured && (
                    <span className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B100D]/90 border border-[#28352D] text-[#F4F3EE] text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" aria-hidden="true" />
                      Unggulan
                    </span>
                  )}

                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={item.title}
                      fill
                      priority={itemIdx < 4}
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center bg-[#19211C]">
                      <span className="text-xs font-medium text-[#95A39A]">
                        Foto belum tersedia
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3.5 space-y-1">
                  <h2 className="text-sm sm:text-base font-bold text-[#F4F3EE] leading-snug line-clamp-2 group-hover:text-[#A3E635] transition-colors">
                    {item.title}
                  </h2>
                  {hasDesc && (
                    <p className="text-xs sm:text-sm text-[#95A39A] line-clamp-2 leading-relaxed">
                      {rawDesc}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
