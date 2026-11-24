"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdminAction, ActionResponse } from "./actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    loginAdminAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.replace("/admin");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09090B] text-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-md bg-[#141418] border border-[#27272A] rounded-xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow efek halus di bagian atas */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#84CC16]/10 blur-3xl pointer-events-none rounded-full" />

        {/* Header Form */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16] text-xs font-semibold uppercase tracking-wider mb-4">
            Panel Admin
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FAFAFA]">
            Masuk ke First Apparel
          </h1>
          <p className="text-sm text-[#A1A1AA] mt-1.5">
            Kelola katalog model jersey, artikel blog, dan konsultasi.
          </p>
        </div>

        {/* Alert Pesan Error */}
        {state?.error && (
          <div className="mb-6 p-3.5 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-medium leading-relaxed">
            {state.error}
          </div>
        )}

        {/* Formulir */}
        <form action={formAction} className="space-y-5 relative z-10">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-[#FAFAFA] mb-2"
            >
              Alamat Email Admin
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="hayo apa"
              className="w-full px-4 py-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#84CC16] focus:ring-1 focus:ring-[#84CC16] transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[#FAFAFA]"
              >
                Kata Sandi
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-[#09090B] border border-[#27272A] text-sm text-[#FAFAFA] placeholder-[#52525B] focus:outline-none focus:border-[#84CC16] focus:ring-1 focus:ring-[#84CC16] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 mt-2 inline-flex items-center justify-center rounded-full bg-[#84CC16] text-[#09090B] font-bold text-sm tracking-wide transition-all hover:bg-[#9ee238] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(132,204,22,0.2)]"
          >
            {isPending ? "Memverifikasi..." : "Masuk ke Panel Admin"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#27272A] text-center">
          <p className="text-xs text-[#71717A]">
            Area terbatas khusus pengelola. Percobaan gagal berulang akan mengunci akun sementara.
          </p>
        </div>
      </div>
    </div>
  );
}
