import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { catalogs, promos, blogs, partners, siteSettings, fabrics } from "@/lib/db/schema";
import { count, desc } from "drizzle-orm";
import { AdminShell } from "@/components/admin-shell";

export const instant = false;

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let totalCatalogs = 0;
  let totalPromos = 0;
  let totalBlogs = 0;
  let totalPartners = 0;
  let totalFabrics = 0;
  let latestCatalogs: (typeof catalogs.$inferSelect)[] = [];
  let settingsData: typeof siteSettings.$inferSelect | null = null;

  try {
    const [catCount] = await db.select({ value: count() }).from(catalogs);
    const [proCount] = await db.select({ value: count() }).from(promos);
    const [blogCount] = await db.select({ value: count() }).from(blogs);
    const [partCount] = await db.select({ value: count() }).from(partners);
    const [fabCount] = await db.select({ value: count() }).from(fabrics);

    totalCatalogs = catCount?.value || 0;
    totalPromos = proCount?.value || 0;
    totalBlogs = blogCount?.value || 0;
    totalPartners = partCount?.value || 0;
    totalFabrics = fabCount?.value || 0;

    latestCatalogs = await db
      .select()
      .from(catalogs)
      .orderBy(desc(catalogs.createdAt))
      .limit(5);

    const [s] = await db.select().from(siteSettings).limit(1);
    settingsData = s || null;
  } catch {
    // Fallback aman jika query sedang terhambat
  }

  return (
    <AdminShell session={session} active="dashboard">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-[#18181B] mb-7">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Ringkasan Operasional</h1>
            <p className="text-xs text-[#71717A] mt-0.5">
              Kelola data katalog jersey, promosi, artikel, dan profil resmi First Apparel.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#141418] border border-[#27272A] text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors"
            >
              <span>Buka Website</span>
              <svg className="w-3.5 h-3.5 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Kartu Metrik Ringkas & Tenang */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[#121316] border border-[#1F2026]">
            <span className="text-[11px] font-medium text-[#71717A] block">Katalog Model</span>
            <div className="text-2xl font-semibold text-[#FAFAFA] mt-1.5 mb-0.5 tabular-nums">
              {totalCatalogs}
            </div>
            <span className="text-[10px] text-[#52525B]">Model jersey terdaftar</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121316] border border-[#1F2026]">
            <span className="text-[11px] font-medium text-[#71717A] block">Pilihan Bahan</span>
            <div className="text-2xl font-semibold text-[#84CC16] mt-1.5 mb-0.5 tabular-nums">
              {totalFabrics}
            </div>
            <span className="text-[10px] text-[#52525B]">Kain dryfit aktif</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121316] border border-[#1F2026]">
            <span className="text-[11px] font-medium text-[#71717A] block">Banner Promo</span>
            <div className="text-2xl font-semibold text-[#FAFAFA] mt-1.5 mb-0.5 tabular-nums">
              {totalPromos}
            </div>
            <span className="text-[10px] text-[#52525B]">Program promosi aktif</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121316] border border-[#1F2026]">
            <span className="text-[11px] font-medium text-[#71717A] block">Artikel Blog</span>
            <div className="text-2xl font-semibold text-[#FAFAFA] mt-1.5 mb-0.5 tabular-nums">
              {totalBlogs}
            </div>
            <span className="text-[10px] text-[#52525B]">Tulisan terbit & draf</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121316] border border-[#1F2026]">
            <span className="text-[11px] font-medium text-[#71717A] block">Mitra Berafiliasi</span>
            <div className="text-2xl font-semibold text-[#FAFAFA] mt-1.5 mb-0.5 tabular-nums">
              {totalPartners}
            </div>
            <span className="text-[10px] text-[#52525B]">Klub & tim kerja sama</span>
          </div>
        </div>

        {/* Dua Kolom Operasional: Daftar Terkini & Ringkasan Toko */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom 1 & 2: Katalog Jersey Terbaru */}
          <div className="lg:col-span-2 rounded-xl bg-[#121316] border border-[#1F2026] p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F2026] mb-3">
              <div>
                <h2 className="text-sm font-semibold text-[#FAFAFA]">Katalog Terakhir Ditambahkan</h2>
                <span className="text-[11px] text-[#71717A]">5 model terbaru yang tampil di website</span>
              </div>
              <Link
                href="/admin/katalog"
                className="text-xs text-[#84CC16] hover:underline font-medium"
              >
                Kelola Semua →
              </Link>
            </div>

            {latestCatalogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#71717A]">
                Belum ada produk yang dimasukkan ke basis data.
                <div className="mt-3">
                  <Link
                    href="/admin/katalog"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1E2026] text-xs text-[#FAFAFA] hover:bg-[#27272A] transition-colors"
                  >
                    + Tambah Produk Pertama
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-[#1F2026] text-xs">
                {latestCatalogs.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-[#FAFAFA] block">{item.title}</span>
                      <span className="text-[10px] text-[#71717A]">
                        {item.category} • {item.fabric}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[#A1A1AA] block">{item.priceInfo || "-"}</span>
                      <span className={`text-[10px] ${item.isActive ? "text-[#84CC16]" : "text-[#71717A]"}`}>
                        {item.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kolom 3: Konfigurasi Profil Toko */}
          <div className="rounded-xl bg-[#121316] border border-[#1F2026] p-5 flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-[#1F2026] mb-4">
                <h2 className="text-sm font-semibold text-[#FAFAFA]">Profil Kontak Toko</h2>
                <span className="text-[11px] text-[#71717A]">Tujuan pemesanan via WhatsApp</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#71717A] text-[10px] uppercase font-medium block">Nomor WhatsApp Admin</span>
                  <span className="font-mono text-[#FAFAFA] text-xs">
                    +{settingsData?.whatsappNumber || "6281234567890"}
                  </span>
                </div>
                <div>
                  <span className="text-[#71717A] text-[10px] uppercase font-medium block">Alamat Workshop</span>
                  <span className="text-[#D4D4D8] leading-relaxed block text-xs">
                    {settingsData?.storeAddress || "Jl. Terusan Olahraga No. 8, Bandung"}
                  </span>
                </div>
                <div>
                  <span className="text-[#71717A] text-[10px] uppercase font-medium block">Jam Operasional</span>
                  <span className="text-[#A1A1AA] block text-xs">
                    {settingsData?.operatingHours || "Senin – Sabtu, 09.00 – 17.00 WIB"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-[#1F2026]">
              <Link
                href="/admin/pengaturan"
                className="w-full inline-flex items-center justify-center py-2 px-3 rounded-md bg-[#1E2026] hover:bg-[#27272A] text-xs text-[#FAFAFA] font-medium transition-colors"
              >
                Ubah Pengaturan Toko
              </Link>
            </div>
          </div>
        </div>
    </AdminShell>
  );
}
