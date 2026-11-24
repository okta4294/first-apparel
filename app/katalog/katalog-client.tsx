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
  fabric: string;
  priceInfo: string | null;
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
        item.fabric.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const isFiltered = selectedCategory !== "SEMUA" || searchQuery.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Toolbar Filter & Pencarian */}
      <div className="border-b border-[#27272A] pb-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tab Kategori */}
          <div
            role="tablist"
            aria-label="Filter kategori katalog"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  className={`min-h-9 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-[#84CC16] text-[#09090B] font-semibold"
                      : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418]"
                  }`}
                >
                  {formatCategoryLabel(cat)}
                </button>
              );
            })}
          </div>

          {/* Kolom Pencarian */}
          <div className="relative w-full md:w-72 shrink-0">
            <svg
              className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
              placeholder="Cari nama model atau bahan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari model jersey atau bahan kain"
              className="w-full h-10 pl-10 pr-8 rounded-full bg-[#141418] border border-[#27272A] text-xs sm:text-sm text-[#FAFAFA] placeholder:text-[#71717A] focus:border-[#84CC16] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Hapus pencarian"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A1A1AA] hover:text-[#FAFAFA]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Baris Ringkas Jumlah Hasil */}
        <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
          <p>
            Menampilkan{" "}
            <span className="font-semibold text-[#FAFAFA] tabular-nums">
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
              className="font-medium text-[#84CC16] hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>
      </div>

      {/* Grid Produk */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center space-y-3 border-b border-[#27272A]">
          <h2 className="text-base font-semibold text-[#FAFAFA]">
            Tidak ada model yang cocok
          </h2>
          <p className="text-sm text-[#A1A1AA] max-w-md mx-auto">
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
              className="inline-flex min-h-10 items-center px-5 py-2 rounded-full bg-[#84CC16] text-[#09090B] font-semibold text-xs sm:text-sm hover:bg-[#9ee238] transition-colors"
            >
              Tampilkan semua model
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {filteredItems.map((item, itemIdx) => {
            const coverImage = getCoverImage(item);
            const rawPrice = item.priceInfo?.trim() || "";
            const hasPrice = Boolean(rawPrice && rawPrice !== "-");
            const cleanPrice = hasPrice
              ? rawPrice.replace(/mulai\s*/i, "").replace(/\/.*$/, "").trim()
              : "";

            return (
              <Link
                key={item.id}
                href={`/katalog/${item.id}`}
                className="group block focus-visible:outline-none"
              >
                <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#141418] border border-[#27272A]">
                  {item.isFeatured && (
                    <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-0.5 rounded-full bg-[#09090B]/85 backdrop-blur-sm text-[#FAFAFA] text-[10px] font-semibold tracking-wide border border-[#27272A]">
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
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center">
                      <span className="text-xs text-[#A1A1AA]">
                        Foto belum tersedia
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 space-y-1">
                  <h2 className="text-base font-semibold text-[#FAFAFA] leading-snug line-clamp-2 group-hover:text-[#84CC16] transition-colors">
                    {item.title}
                  </h2>
                  {hasPrice && cleanPrice && (
                    <p className="text-xs sm:text-sm font-normal text-[#A1A1AA] pt-0.5 line-clamp-2">
                      {cleanPrice}
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
