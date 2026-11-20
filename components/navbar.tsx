"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  waNumber: string;
  storeName?: string;
  logoUrl?: string | null;
}

export function Navbar({ waNumber, storeName = "FIRST APPAREL", logoUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin berkonsultasi mengenai pemesanan custom jersey.`
  )}`;

  const isHome = pathname === "/";
  const isKatalog = pathname === "/katalog";
  const isCaraPesan = pathname === "/cara-pesan" || pathname === "/alur-pemesanan";
  const isBlog = pathname.startsWith("/blog");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#27272A] bg-[#09090B]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#27272A]/80 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <img src={logoUrl} alt={storeName} width={36} height={36} decoding="async" fetchPriority="high" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#84CC16] flex items-center justify-center font-black text-[#09090B] text-base transition-transform group-hover:scale-105 shrink-0">
              {storeName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <span className="font-bold text-lg tracking-tight text-[#FAFAFA] truncate max-w-[200px] sm:max-w-xs">
            {storeName.toUpperCase()}
          </span>
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
            Katalog Jersey
          </Link>
          <Link
            href="/cara-pesan"
            className={isCaraPesan ? "text-[#84CC16] font-semibold transition-colors" : "text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"}
          >
            Alur Pemesanan
          </Link>
          <Link
            href="/blog"
            className={isBlog ? "text-[#84CC16] font-semibold transition-colors" : "text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"}
          >
            Blog & Panduan
          </Link>
        </nav>

        {/* Desktop WhatsApp CTA & Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-bold tracking-wide transition-all hover:bg-[#9ee238] active:scale-95 shadow-[0_0_20px_rgba(132,204,22,0.2)]"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
            </svg>
            <span>Konsultasi via WhatsApp</span>
          </a>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex md:hidden items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418] transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
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
            Katalog Jersey
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
          <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-medium ${
              isBlog ? "text-[#84CC16] bg-[#141418]" : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#141418]"
            }`}
          >
            Blog & Panduan
          </Link>
          <div className="pt-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-bold tracking-wide"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
              </svg>
              <span>Konsultasi via WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
