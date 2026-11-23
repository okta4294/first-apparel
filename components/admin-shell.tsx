"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { logoutAdminAction } from "@/app/admin/login/actions";
import { ThemeToggle } from "@/components/theme-toggle";

interface AdminShellProps {
  session: {
    id?: number;
    name: string;
    email: string;
  };
  active: "dashboard" | "katalog" | "promo" | "blog" | "partner" | "pengaturan" | "bahan" | "review";
  children: React.ReactNode;
}

const PAGE_LABELS: Record<AdminShellProps["active"], string> = {
  dashboard: "Dashboard",
  katalog: "Katalog",
  bahan: "Pilihan Bahan Kain",
  promo: "Banner Promo",
  blog: "Artikel Blog",
  partner: "Mitra & Partner",
  review: "Ulasan Pelanggan",
  pengaturan: "Pengaturan Toko",
};

export function AdminShell({ session, active, children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tutup laci menu mobile saat tombol Escape ditekan
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const getNavClass = (key: string) => {
    return active === key
      ? "flex items-center justify-between px-3 py-3 lg:py-2.5 rounded-lg bg-[#181920] text-[#FAFAFA] text-xs font-medium ring-1 ring-white/5 transition-all"
      : "flex items-center justify-between px-3 py-3 lg:py-2.5 rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#14151B] text-xs font-medium transition-all group";
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#E4E4E7] flex flex-col lg:flex-row font-sans antialiased">
      {/* Top Bar Mobile & Tablet (< lg) */}
      <header className="lg:hidden sticky top-0 z-30 h-14 px-3 sm:px-4 flex items-center justify-between border-b border-[#18181B] bg-[#0C0D11]">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="min-h-[44px] px-2.5 inline-flex items-center gap-2 rounded-lg text-[#FAFAFA] hover:bg-[#18191E] active:scale-95 transition-colors text-xs font-medium shrink-0"
            aria-label="Buka Menu Admin"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Menu</span>
          </button>

          <div className="h-4 w-px bg-[#27272A] shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#181920] border border-[#27272A] flex items-center justify-center font-bold text-[#84CC16] text-[10px] shrink-0">
              FA
            </div>
            <span className="text-xs font-semibold text-[#FAFAFA] truncate">
              {PAGE_LABELS[active]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <ThemeToggle className="w-9 h-9 p-2" />
          <Link
            href="/"
            target="_blank"
            title="Lihat Halaman Toko Publik"
            aria-label="Lihat Halaman Toko Publik"
            className="min-w-[40px] min-h-[40px] text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#18191E] rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Backdrop Laci Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigasi (Laci geser di mobile, Sidebar tetap di desktop) */}
      <aside
        className={`${
          mobileMenuOpen ? "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw]" : "hidden"
        } lg:flex lg:w-64 lg:sticky lg:top-0 border-r border-[#18181B] bg-[#0C0D11] flex-col justify-between shrink-0 h-screen overflow-y-auto`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#18181B]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-[#181920] border border-[#27272A] flex items-center justify-center font-bold text-[#84CC16] text-xs">
                FA
              </div>
              <div>
                <span className="font-semibold text-xs tracking-tight text-[#FAFAFA] block">
                  FIRST APPAREL
                </span>
                <span className="text-[10px] text-[#71717A] tracking-wide block">
                  Console Manajemen
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <ThemeToggle className="w-7 h-7 p-1 hidden lg:flex" />
              <Link
                href="/"
                target="_blank"
                title="Lihat Halaman Toko Publik"
                className="hidden lg:flex text-[#71717A] hover:text-[#FAFAFA] hover:bg-[#18191E] p-1.5 rounded-md transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="lg:hidden min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#18191E] transition-colors"
                aria-label="Tutup Menu Admin"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Menu Navigasi Terstruktur */}
          <div className="p-3.5 space-y-6">
            {/* Grup 1: Ringkasan */}
            <div className="space-y-1.5">
              <span className="px-3 text-[10px] font-semibold text-[#52525B] tracking-wider uppercase block">
                Ringkasan
              </span>
              <Link href="/admin" onClick={closeMenu} className={getNavClass("dashboard")}>
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 shrink-0 ${active === "dashboard" ? "text-[#FAFAFA]" : "text-[#71717A] group-hover:text-[#A1A1AA]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  </svg>
                  <span>Dashboard</span>
                </div>
                {active === "dashboard" && <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0" />}
              </Link>
            </div>

            {/* Grup 2: Konten & Katalog */}
            <div className="space-y-1.5">
              <span className="px-3 text-[10px] font-semibold text-[#52525B] tracking-wider uppercase block">
                Katalog & Konten
              </span>

              {/* Katalog Jersey */}
              <Link href="/admin/katalog" onClick={closeMenu} className={getNavClass("katalog")}>
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 shrink-0 ${active === "katalog" ? "text-[#FAFAFA]" : "text-[#71717A] group-hover:text-[#A1A1AA]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                  </svg>
                  <span>Katalog</span>
                </div>
                {active === "katalog" && <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0" />}
              </Link>

              {/* Pilihan Bahan Kain */}
              <Link href="/admin/bahan" onClick={closeMenu} className={getNavClass("bahan")}>
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 shrink-0 ${active === "bahan" ? "text-[#FAFAFA]" : "text-[#71717A] group-hover:text-[#A1A1AA]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2H6z" />
                  </svg>
                  <span>Pilihan Bahan Kain</span>
                </div>
                {active === "bahan" && <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0" />}
              </Link>

              {/* Banner Promo */}
              <Link href="/admin/promo" onClick={closeMenu} className={getNavClass("promo")}>
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 shrink-0 ${active === "promo" ? "text-[#FAFAFA]" : "text-[#71717A] group-hover:text-[#A1A1AA]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span>Banner Promo</span>
                </div>
                {active === "promo" && <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0" />}
              </Link>

              {/* Artikel Blog */}
              <Link href="/admin/blog" onClick={closeMenu} className={getNavClass("blog")}>
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 shrink-0 ${active === "blog" ? "text-[#FAFAFA]" : "text-[#71717A] group-hover:text-[#A1A1AA]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span>Artikel Blog</span>
                </div>
                {active === "blog" && <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0" />}
              </Link>

              {/* Mitra & Partner */}
              <Link href="/admin/partner" onClick={closeMenu} className={getNavClass("partner")}>
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 shrink-0 ${active === "partner" ? "text-[#FAFAFA]" : "text-[#71717A] group-hover:text-[#A1A1AA]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Mitra & Partner</span>
                </div>
                {active === "partner" && <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0" />}
              </Link>

              {/* Ulasan Pelanggan */}
              <Link href="/admin/review" onClick={closeMenu} className={getNavClass("review")}>
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 shrink-0 ${active === "review" ? "text-[#FAFAFA]" : "text-[#71717A] group-hover:text-[#A1A1AA]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  <span>Ulasan Pelanggan</span>
                </div>
                {active === "review" && <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0" />}
              </Link>
            </div>

            {/* Grup 3: Preferensi */}
            <div className="space-y-1.5">
              <span className="px-3 text-[10px] font-semibold text-[#52525B] tracking-wider uppercase block">
                Preferensi
              </span>
              <Link href="/admin/pengaturan" onClick={closeMenu} className={getNavClass("pengaturan")}>
                <div className="flex items-center gap-3">
                  <svg className={`w-4 h-4 shrink-0 ${active === "pengaturan" ? "text-[#FAFAFA]" : "text-[#71717A] group-hover:text-[#A1A1AA]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Pengaturan Toko</span>
                </div>
                {active === "pengaturan" && <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] shrink-0" />}
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Profil Pengguna & Keluar */}
        <div className="p-3.5 border-t border-[#18181B] bg-[#0A0B0E] space-y-3 mt-auto">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-[#121316] border border-[#1A1B22] overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-[#1F2026] border border-[#27272A] flex items-center justify-center text-xs font-semibold text-[#FAFAFA] shrink-0">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <span className="text-xs font-medium text-[#FAFAFA] block truncate leading-tight">{session.name}</span>
              <span className="text-[10px] text-[#71717A] block truncate leading-tight mt-0.5">{session.email}</span>
            </div>
          </div>
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full py-2.5 lg:py-2 px-3 rounded-lg bg-transparent hover:bg-[#18191E] border border-[#27272A] hover:border-[#EF4444]/40 text-[#A1A1AA] hover:text-[#EF4444] text-xs font-medium transition-colors text-center flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar Sesi</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Halaman */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 md:px-8 py-5 sm:py-7 overflow-x-hidden max-w-6xl w-full">
        {children}
      </main>
    </div>
  );
}
