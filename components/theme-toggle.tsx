"use client";

import { useSyncExternalStore } from "react";

function subscribeToTheme(callback: () => void) {
  window.addEventListener("first-apparel-theme-change", callback);
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemChange = (e: MediaQueryListEvent) => {
    try {
      if (!localStorage.getItem("first_apparel_theme")) {
        document.documentElement.classList.toggle("dark", e.matches);
        callback();
      }
    } catch {
      // Abaikan jika akses localStorage dibatasi
    }
  };
  mediaQuery.addEventListener("change", handleSystemChange);
  return () => {
    window.removeEventListener("first-apparel-theme-change", callback);
    mediaQuery.removeEventListener("change", handleSystemChange);
  };
}

function getThemeSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot(): boolean | null {
  return null;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerSnapshot
  );

  const toggleTheme = () => {
    const nextDark = !(isDark ?? true);
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("first_apparel_theme", nextDark ? "dark" : "light");
    } catch {
      // Abaikan jika akses localStorage dibatasi
    }
    // Beri tahu komponen ThemeToggle lainnya di layar agar ikon tetap sinkron
    window.dispatchEvent(new Event("first-apparel-theme-change"));
  };

  // Render placeholder netral sebelum terhidrasi agar tidak terjadi pergeseran tata letak (CLS)
  if (isDark === null) {
    return (
      <div
        className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg border border-transparent p-2 ${className}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg border border-transparent hover:border-[#E2E8F0] dark:hover:border-[#27272A] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:text-[#A1A1AA] dark:hover:text-[#FAFAFA] dark:hover:bg-[#141418] transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#84CC16] ${className}`}
      aria-label={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
      title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
    >
      {isDark ? (
        // Ikon Matahari (Sun) untuk beralih ke Mode Terang
        <svg
          key="sun"
          className="w-5 h-5 text-[#FAFAFA] animate-in fade-in zoom-in-75 spin-in-45 duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" />
          <path d="M22 12L23 12" />
          <path d="M12 2V1" />
          <path d="M12 23V22" />
          <path d="M20 20L19 19" />
          <path d="M20 4L19 5" />
          <path d="M4 20L5 19" />
          <path d="M4 4L5 5" />
          <path d="M1 12L2 12" />
        </svg>
      ) : (
        // Ikon Bulan (Moon) untuk beralih ke Mode Gelap
        <svg
          key="moon"
          className="w-5 h-5 text-[#0F172A] animate-in fade-in zoom-in-75 -spin-in-45 duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 11.5066C3 16.7497 7.25034 21 12.4934 21C16.2209 21 19.4466 18.8518 21 15.7259C12.4934 15.7259 8.27411 11.5066 8.27411 3C5.14821 4.55344 3 7.77915 3 11.5066Z" />
        </svg>
      )}
    </button>
  );
}
