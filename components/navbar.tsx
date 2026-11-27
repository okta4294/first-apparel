"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

interface NavbarProps {
  waNumber: string;
  storeName?: string;
  companyName?: string | null;
  logoUrl?: string | null;
}

export function Navbar({
  waNumber,
  storeName = "FIRST APPAREL",
  companyName,
  logoUrl,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin berkonsultasi mengenai pemesanan custom jersey.`
  )}`;

  const isHome = pathname === "/";
  const isKatalog = pathname.startsWith("/katalog");
  const isCaraPesan = pathname === "/cara-pesan" || pathname === "/alur-pemesanan";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#222E26] bg-[#0B100D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              width={160}
              height={40}
              sizes="(min-width: 640px) 180px, 140px"
              loading="eager"
              className="w-auto h-auto max-h-9 sm:max-h-10 max-w-[140px] sm:max-w-[180px] object-contain shrink-0 transition-transform duration-200 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-[#84CC16] flex items-center justify-center font-[family-name:var(--font-display)] font-black text-[#0B100D] text-sm tracking-tight shrink-0 transition-transform duration-200 group-hover:scale-[1.03]">
              {storeName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg tracking-[-0.02em] leading-tight text-[#F4F3EE] truncate max-w-[200px] sm:max-w-xs">
              {storeName.toUpperCase()}
            </span>
            {companyName && (
              <span className="text-[11px] font-medium text-[#95A39A] leading-tight truncate max-w-[200px] sm:max-w-xs mt-0.5">
                {companyName}
              </span>
            )}
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium" aria-label="Navigasi utama">
          <Link
            href="/"
            aria-current={isHome ? "page" : undefined}
            className={
              isHome
                ? "py-1 text-[#F4F3EE] font-semibold border-b-2 border-[#84CC16] transition-colors"
                : "py-1 text-[#A4B0A8] hover:text-[#F4F3EE] transition-colors"
            }
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            aria-current={isKatalog ? "page" : undefined}
            className={
              isKatalog
                ? "py-1 text-[#F4F3EE] font-semibold border-b-2 border-[#84CC16] transition-colors"
                : "py-1 text-[#A4B0A8] hover:text-[#F4F3EE] transition-colors"
            }
          >
            Katalog
          </Link>
          <Link
            href="/cara-pesan"
            aria-current={isCaraPesan ? "page" : undefined}
            className={
              isCaraPesan
                ? "py-1 text-[#F4F3EE] font-semibold border-b-2 border-[#84CC16] transition-colors"
                : "py-1 text-[#A4B0A8] hover:text-[#F4F3EE] transition-colors"
            }
          >
            Alur Pemesanan
          </Link>
        </nav>

        {/* Desktop WhatsApp CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] text-[#0B100D] text-sm font-bold tracking-[-0.01em] transition-all active:scale-[0.98]"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
            <span>Konsultasi via WhatsApp</span>
          </a>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="min-w-[44px] min-h-[44px] w-11 h-11 inline-flex items-center justify-center rounded-lg border border-[#26332B] bg-[#141B17] text-[#F4F3EE] hover:bg-[#1B2620] transition-colors"
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
        <div className="md:hidden border-t border-[#222E26] bg-[#0B100D] px-4 pt-4 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className={`flex items-center min-h-[48px] px-3.5 rounded-lg text-base font-semibold ${
              isHome
                ? "text-[#A3E635] bg-[#14291C]"
                : "text-[#A4B0A8] hover:text-[#F4F3EE] hover:bg-[#141B17]"
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            onClick={() => setIsOpen(false)}
            className={`flex items-center min-h-[48px] px-3.5 rounded-lg text-base font-medium ${
              isKatalog
                ? "text-[#A3E635] bg-[#14291C] font-semibold"
                : "text-[#A4B0A8] hover:text-[#F4F3EE] hover:bg-[#141B17]"
            }`}
          >
            Katalog
          </Link>
          <Link
            href="/cara-pesan"
            onClick={() => setIsOpen(false)}
            className={`flex items-center min-h-[48px] px-3.5 rounded-lg text-base font-medium ${
              isCaraPesan
                ? "text-[#A3E635] bg-[#14291C] font-semibold"
                : "text-[#A4B0A8] hover:text-[#F4F3EE] hover:bg-[#141B17]"
            }`}
          >
            Alur Pemesanan
          </Link>
          <div className="pt-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#84CC16] text-[#0B100D] text-sm font-bold"
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
