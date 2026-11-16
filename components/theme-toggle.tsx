"use client";

import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Cek status dark mode saat komponen dipasang di browser
    const currentIsDark = document.documentElement.classList.contains("dark");
    setIsDark(currentIsDark);

    // Dengarkan perubahan jika ada tombol tema lain yang diklik di halaman
    const handleThemeChange = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    // Dengarkan perubahan preferensi sistem (OS) jika pengguna belum memilih secara manual
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem("first_apparel_theme");
      if (!savedTheme) {
        if (e.matches) {
          document.documentElement.classList.add("dark");
          setIsDark(true);
        } else {
          document.documentElement.classList.remove("dark");
          setIsDark(false);
        }
      }
    };

    window.addEventListener("first-apparel-theme-change", handleThemeChange);
    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      window.removeEventListener("first-apparel-theme-change", handleThemeChange);
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("dark");
      try {
        localStorage.setItem("first_apparel_theme", "dark");
      } catch {
        // Abaikan jika akses localStorage dibatasi
      }
    } else {
      document.documentElement.classList.remove("dark");
      try {
        localStorage.setItem("first_apparel_theme", "light");
      } catch {
        // Abaikan jika akses localStorage dibatasi
      }
    }

    // Beri tahu komponen ThemeToggle lainnya di layar agar ikon tetap sinkron
    window.dispatchEvent(new Event("first-apparel-theme-change"));
  };

  // Render placeholder netral sebelum terhidrasi agar tidak terjadi pergeseran tata letak (CLS)
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border border-transparent p-2 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#27272A] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:text-[#A1A1AA] dark:hover:text-[#FAFAFA] dark:hover:bg-[#141418] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16] ${className}`}
      aria-label={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
      title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
    >
      {isDark ? (
        // Ikon Matahari (Sun) untuk beralih ke Mode Terang
        <svg
          className="w-4 h-4 text-[#FAFAFA] transition-transform hover:rotate-45"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41"
          />
        </svg>
      ) : (
        // Ikon Bulan (Moon) untuk beralih ke Mode Gelap
        <svg
          className="w-4 h-4 text-[#0F172A] transition-transform hover:-rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      )}
    </button>
  );
}
