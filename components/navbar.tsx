"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

interface NavbarProps {
  waNumber: string;
  storeName?: string;
  companyName?: string | null;
  logoUrl?: string | null;
}

export function Navbar({ waNumber, storeName = "FIRST APPAREL", companyName, logoUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin berkonsultasi mengenai pemesanan custom jersey.`
  )}`;

  const isHome = pathname === "/";
  const isKatalog = pathname.startsWith("/katalog");
  const isCaraPesan = pathname === "/cara-pesan" || pathname === "/alur-pemesanan";
  // const isBlog = pathname.startsWith("/blog");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#27272A] bg-[#09090B]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#27272A]/80 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <Image src={logoUrl} alt={storeName} width={36} height={36} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#84CC16] flex items-center justify-center font-black text-[#09090B] text-base transition-transform group-hover:scale-105 shrink-0">
              {storeName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-base sm:text-lg tracking-tight leading-tight text-[#FAFAFA] truncate max-w-[200px] sm:max-w-xs">
              {storeName.toUpperCase()}
            </span>
            {companyName && (
              <span className="text-[10px] sm:text-[11px] font-medium text-[#A1A1AA] leading-tight truncate max-w-[200px] sm:max-w-xs mt-0.5">
                {companyName}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className={isHome ? "text-[#84CC16] font-semibold transition-colors" : "text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"}
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            className={isKatalog ? "text-[#84CC16] font-semibold transition-colors" : "text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"}
          >
            Katalog
          </Link>
          <Link
            href="/cara-pesan"
            className={isCaraPesan ? "text-[#84CC16] font-semibold transition-colors" : "text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"}
          >
            Alur Pemesanan
          </Link>
          {/* <Link
            href="/blog"
            className={isBlog ? "text-[#84CC16] font-semibold transition-colors" : "text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"}
          >
            Blog
          </Link> */}
        </nav>

        {/* Desktop WhatsApp CTA & Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-bold tracking-wide transition-all hover:bg-[#9ee238] active:scale-95 shadow-md"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
            <span>Konsultasi via WhatsApp</span>
          </a>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex md:hidden items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="min-w-[44px] min-h-[44px] w-11 h-11 inline-flex items-center justify-center rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418] transition-colors"
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#27272A] bg-[#0C0D11] px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
              isHome ? "text-[#84CC16] bg-[#141418]" : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418]"
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isKatalog ? "text-[#84CC16] bg-[#141418]" : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418]"
            }`}
          >
            Katalog
          </Link>
          <Link
            href="/cara-pesan"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isCaraPesan ? "text-[#84CC16] bg-[#141418]" : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418]"
            }`}
          >
            Alur Pemesanan
          </Link>
          {/* <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isBlog ? "text-[#84CC16] bg-[#141418]" : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418]"
            }`}
          >
            Blog
          </Link> */}
          <div className="pt-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-bold tracking-wide"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
              <span>Konsultasi via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
