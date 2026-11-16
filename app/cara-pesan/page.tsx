import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SizeChartDisplay } from "@/components/size-chart-display";
import { OrderTemplateCard } from "@/components/order-template-card";
import { db } from "@/lib/db";
import { siteSettings, fabrics } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

function getFabricBadge(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("milano")) return "Paling Populer • Futsal & Sepak Bola";
  if (lower.includes("brazil")) return "Serat Ringan • Running & Badminton";
  if (lower.includes("pique") || lower.includes("jarum")) return "Berpori Elegan • Polo & Event";
  if (lower.includes("serena")) return "Permukaan Licin • Esports & Gaming";
  return "Teknologi Quick-Dry Aktif";
}

/**
 * Fungsi: Daftar tautan navigasi cepat (anchor) di halaman cara pesan.
 * Cara Kerja: Dipetakan menjadi tautan `#id` yang melompat ke seksi terkait
 *             tanpa scroll manual panjang, terutama berguna di layar ponsel.
 * Cara Penggunaan: `quickNavLinks.map(...)` di dalam komponen navigasi cepat.
 */
const quickNavLinks = [
  { href: "#alur-pemesanan", label: "5 Langkah Order" },
  { href: "#format-order", label: "Format Chat" },
  { href: "#panduan-ukuran", label: "Tabel Ukuran" },
  { href: "#panduan-desain", label: "File & Logo" },
  { href: "#pilihan-bahan", label: "Pilihan Bahan" },
  { href: "#faq", label: "FAQ" },
];

export const metadata = {
  title: "Alur & Cara Pemesanan Custom Jersey | First Apparel",
  description:
    "Panduan lengkap dan mudah alur pemesanan jersey kustom di First Apparel via WhatsApp. Dari konsultasi desain gratis, pemilihan bahan dryfit, hingga pengiriman ekspedisi.",
};

export const instant = false;

export default async function CaraPesanPage() {
  let storeName = "First Apparel";
  let storeAddress = "Jl. Terusan Olahraga No. 8, Bandung, Jawa Barat";
  let googleMapsUrl: string | null = null;
  let operatingHours = "Senin - Sabtu, 09.00 - 17.00 WIB";
  let whatsappNumber = "6281234567890";
  let defaultWaText = "Halo Admin First Apparel, saya ingin berkonsultasi tentang pemesanan jersey kustom.";
  let instagramUrl: string | null = null;
  let logoUrl: string | null = null;
  let sizeChartUrl: string | null = null;
  let storeDescription =
    "Vendor konveksi dan produsen custom jersey olahraga profesional. Melayani pembuatan seragam futsal, sepak bola, esports, running, dan apparel tim.";

  let fabricList: (typeof fabrics.$inferSelect)[] = [];

  try {
    const settings = await db.select().from(siteSettings).limit(1);
    if (settings.length > 0) {
      const s = settings[0];
      storeName = s.storeName || storeName;
      storeAddress = s.storeAddress || storeAddress;
      googleMapsUrl = s.googleMapsUrl;
      operatingHours = s.operatingHours || operatingHours;
      whatsappNumber = s.whatsappNumber || whatsappNumber;
      defaultWaText = s.defaultWaText || defaultWaText;
      instagramUrl = s.instagramUrl;
      logoUrl = s.logoUrl || null;
      sizeChartUrl = s.sizeChartUrl || null;
      storeDescription = s.storeDescription || storeDescription;
    }

    fabricList = await db
      .select()
      .from(fabrics)
      .where(eq(fabrics.isActive, true))
      .orderBy(asc(fabrics.sortOrder), asc(fabrics.id));
  } catch {
    // Fallback data
  }

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin konsultasi dan memulai pemesanan custom jersey untuk tim saya.`
  )}`;

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      {/* 1. Navbar */}
      <Navbar waNumber={whatsappNumber} storeName={storeName} logoUrl={logoUrl} />

      {/* 1.1 Navigasi Cepat Antar Seksi — pengguna tidak perlu menggulir panjang */}
      <nav
        aria-label="Navigasi cepat panduan pemesanan"
        className="sticky top-20 z-40 border-b border-[#27272A] bg-[#09090B]/95 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-1.5 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickNavLinks.map((link) => (
              <li key={link.href} className="shrink-0">
                <a
                  href={link.href}
                  className="inline-flex h-11 items-center whitespace-nowrap rounded-full border border-transparent px-3.5 text-xs font-semibold text-[#A1A1AA] transition-colors hover:border-[#27272A] hover:bg-[#141418] hover:text-[#FAFAFA] focus-visible:border-[#84CC16] focus-visible:text-[#84CC16] focus-visible:outline-none"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative py-16 sm:py-24 border-b border-[#27272A] bg-gradient-to-b from-[#121318] to-[#09090B] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16] text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
            PANDUAN LENGKAP ORDER JERSEY RESMI
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#FAFAFA] uppercase">
            Alur Pemesanan Mudah &amp; Cepat
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] mt-5 max-w-2xl mx-auto leading-relaxed">
            Tidak perlu repot mengisi formulir pendaftaran. Seluruh proses dari konsultasi desain gratis, pemilihan bahan, hingga pengiriman dipandu ramah langsung oleh tim desainer kami via WhatsApp.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#84CC16] text-[#09090B] text-sm font-bold tracking-wide transition-all hover:bg-[#9ee238] active:scale-95 shadow-[0_0_30px_rgba(132,204,22,0.3)]"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
              </svg>
              <span>Mulai Konsultasi WhatsApp Sekarang</span>
            </a>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#181920] border border-[#27272A] text-[#FAFAFA] text-sm font-semibold hover:border-[#84CC16]/50 hover:text-[#84CC16] transition-colors"
            >
              Lihat Katalog Desain →
            </Link>
          </div>

          {/* Jalur Cepat Express & Desain Siap Cetak */}
          <div className="mt-8 p-3.5 sm:p-4 rounded-2xl bg-[#141418] border border-[#27272A] max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2.5 text-left">
              <span className="w-8 h-8 rounded-lg bg-[#84CC16]/10 text-[#84CC16] flex items-center justify-center font-bold text-base shrink-0">
                ⚡
              </span>
              <div>
                <span className="font-bold text-[#FAFAFA] block">Sudah Punya Desain Siap Cetak?</span>
                <span className="text-[#A1A1AA] text-[11px] block">Tersedia jalur prioritas express untuk turnamen (3–5 hari kerja)</span>
              </div>
            </div>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                `Halo Admin ${storeName}, saya sudah ada file desain siap cetak dan ingin konsultasi jalur express turnamen.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#84CC16] font-bold hover:underline whitespace-nowrap text-xs shrink-0 py-1 px-2.5 rounded-lg bg-[#84CC16]/10 hover:bg-[#84CC16]/20 transition-colors"
            >
              Kirim File via WA →
            </a>
          </div>
        </div>
      </section>

      {/* 3. Lima Tahapan Alur Pemesanan Rinci */}
      <section id="alur-pemesanan" className="py-20 border-b border-[#27272A] relative scroll-mt-36">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-[#84CC16] uppercase block mb-2">
              PROSES KERJA WORKSHOP KAMI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#FAFAFA]">
              5 Langkah Menuju Jersey Impian
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-3">
              Setiap langkah dibuat transparan agar Anda mengetahui progres jersey tim secara akurat.
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] font-black text-2xl shrink-0 group-hover:scale-105 transition-transform">
                01
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors">
                    Konsultasi &amp; Kirim Ide Konsep
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#27272A] text-[11px] font-semibold text-[#84CC16]">
                    Gratis Desain
                  </span>
                </div>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Hubungi admin kami melalui WhatsApp. Anda bebas membawa sketsa coretan tangan, foto referensi tim profesional, file desain mentah (Corel/AI/PSD), atau memilih model favorit dari katalog kami. Sampaikan warna utama, logo tim, dan nama sponsor yang ingin dipasang.
                </p>
                <div className="pt-1">
                  <Link
                    href="/katalog"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#84CC16] hover:underline"
                  >
                    <span>Buka Katalog Model Jersey Terpopuler</span>
                    <span>→</span>
                  </Link>
                </div>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#71717A]">
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Bebas Tentukan Warna</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Pilihan Kerah O-neck / V-neck / Polo</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Dibantu Penataan Logo Sponsor</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] font-black text-2xl shrink-0 group-hover:scale-105 transition-transform">
                02
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors">
                    Pembuatan Digital Mockup (Pratinjau)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#27272A] text-[11px] font-semibold text-[#84CC16]">
                    Revisi Sampai Cocok
                  </span>
                </div>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Tim desainer internal kami merender tampilan mockup digital 2D &amp; 3D dari sudut depan, belakang, dan samping. Anda dapat memeriksa tata letak nama, font nomor punggung, serta proporsi ukuran logo. Jika ada bagian yang kurang pas, kami perbaiki secara gratis sampai Anda sepakat.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#71717A]">
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Preview Sudut Lengkap</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Pilihan Font Nomor Modern</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Approval Resmi Sebelum Cetak</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] font-black text-2xl shrink-0 group-hover:scale-105 transition-transform">
                03
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors">
                    Rekap Ukuran Pemain &amp; Penguncian Produksi (DP 50%)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#27272A] text-[11px] font-semibold text-[#84CC16]">
                    Jadwal Terkunci
                  </span>
                </div>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Proses dibagi menjadi 2 tahap sederhana:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs text-[#D4D4D8]">
                  <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#1F2026]">
                    <span className="font-bold text-[#84CC16] block mb-1">Tahap 3A • Rekap Data Pemain</span>
                    <span className="text-[#A1A1AA] text-[11px] leading-relaxed block">
                      Admin mengirimkan template rekap. Anda cukup mengisi Nama Punggung, Nomor, Size baju, dan jenis kain dryfit yang dipilih.
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#1F2026]">
                    <span className="font-bold text-[#84CC16] block mb-1">Tahap 3B • DP 50% &amp; Invoice</span>
                    <span className="text-[#A1A1AA] text-[11px] leading-relaxed block">
                      Kunci jadwal pengerjaan workshop dengan DP 50% via transfer rekening resmi toko. Tagihan invoice resmi diterbitkan seketika.
                    </span>
                  </div>
                </div>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#71717A]">
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Rekap Data Rapi &amp; Jelas</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Pilihan Bahan Standar Atlet</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Invoice Resmi Rekening Toko</span>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] font-black text-2xl shrink-0 group-hover:scale-105 transition-transform">
                04
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors">
                    Produksi Sublimasi HD, Cutting &amp; Jahit Presisi
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#27272A] text-[11px] font-semibold text-[#84CC16]">
                    3 - 7 Hari Kerja
                  </span>
                </div>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Pesanan masuk ke lantai produksi: pencetakan tinta sublimasi original Epson (warna tajam, anti-pecah, awet bertahun-tahun), pemotongan kain akurat, dan penjahitan overdeck ganda oleh penjahit garmen profesional. Melewati proses Quality Control (QC) ketat per lembar baju.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#71717A]">
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Tinta Ramah Kulit OEKO-TEX</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Jahitan Rantai &amp; Kuat</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ QC Nama &amp; Nomor Teliti</span>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-start hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] font-black text-2xl shrink-0 group-hover:scale-105 transition-transform">
                05
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-bold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors">
                    Dokumentasi Hasil Jadi, Pelunasan &amp; Pengiriman
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#27272A] text-[11px] font-semibold text-[#84CC16]">
                    Garansi Cacat Produksi
                  </span>
                </div>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Kami mengirimkan video dan foto jersey yang sudah selesai dipacking rapi. Setelah pelunasan sisa pembayaran dikonfirmasi, paket langsung diserahkan ke jasa ekspedisi terpercaya (JNE, J&amp;T, SiCepat, Lion Parcel, atau Cargo untuk partai besar). Nomor resi otomatis dibagikan kepada Anda.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#71717A]">
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Packing Plastik Satuan Premium</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Resi Pengiriman Jelas</span>
                  <span className="px-3 py-1 rounded-md bg-[#1C1D24] border border-[#27272A]">✓ Kirim ke Seluruh Indonesia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3.1 Kotak Salin Cepat Format Pesanan */}
      <section id="format-order" className="py-12 border-b border-[#27272A] bg-[#0A0B0E] scroll-mt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <OrderTemplateCard waNumber={whatsappNumber} storeName={storeName} />
        </div>
      </section>

      {/* 4. Panduan Size Chart & Tabel Ukuran Standar */}
      <section id="panduan-ukuran" className="py-20 border-b border-[#27272A] bg-[#0C0D11] scroll-mt-36">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-[#84CC16] uppercase block mb-2">
              PANDUAN UKURAN RESMI
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FAFAFA]">
              Size Chart Standar {storeName}
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2">
              Cek tabel ukuran angka di bawah ini (selalu tersedia), lalu bandingkan dengan diagram gambar resmi toko bila sudah diunggah admin.
            </p>
          </div>

          <SizeChartDisplay
            imageUrl={sizeChartUrl}
            waNumber={whatsappNumber}
            storeName={storeName}
          />
        </div>
      </section>

      {/* 4.1 Panduan File Desain & Peta Penempatan Logo */}
      <section id="panduan-desain" className="py-20 border-b border-[#27272A] scroll-mt-36">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-[#84CC16] uppercase block mb-2">
              SIAPKAN SEBELUM CHAT ADMIN
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#FAFAFA]">
              Panduan File Desain &amp; Penempatan Logo
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-3">
              Tidak perlu jago desain. Cukup ikuti standar file dan posisi cetak di bawah ini agar hasil jersey tim presisi sejak percetakan pertama.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* A. Spesifikasi File Desain */}
            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 sm:p-7 flex flex-col">
              <div className="flex items-start gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v12a2 2 0 01-2 2z" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#FAFAFA]">
                    Format File yang Kami Terima
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Semakin asli file-nya, semakin tajam hasil sublimasinya.
                  </p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-3 rounded-xl bg-[#09090B] border border-[#1F2026] p-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#84CC16]/15 text-[10px] font-black text-[#84CC16]">
                    1
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-[#FAFAFA]">File vektor (paling disarankan)</span>
                      <span className="rounded-full bg-[#84CC16]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#84CC16]">
                        Prioritas
                      </span>
                    </div>
                    <p className="mt-1 leading-relaxed text-[#A1A1AA]">
                      <span className="font-mono text-[#D4D4D8]">.AI</span>,{" "}
                      <span className="font-mono text-[#D4D4D8]">.EPS</span>,{" "}
                      <span className="font-mono text-[#D4D4D8]">.PDF</span>,{" "}
                      <span className="font-mono text-[#D4D4D8]">.CDR</span>, atau{" "}
                      <span className="font-mono text-[#D4D4D8]">.SVG</span>. Tetap tajam di ukuran cetak berapa pun.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-[#09090B] border border-[#1F2026] p-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#84CC16]/15 text-[10px] font-black text-[#84CC16]">
                    2
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-[#FAFAFA]">Gambar raster (jika hanya punya ini)</span>
                    <p className="mt-1 leading-relaxed text-[#A1A1AA]">
                      <span className="font-mono text-[#D4D4D8]">.PNG</span> latar transparan minimal 300 DPI. Hindari screenshot atau foto logo dari media sosial karena akan pecah saat dicetak.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-[#09090B] border border-[#1F2026] p-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#84CC16]/15 text-[10px] font-black text-[#84CC16]">
                    3
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-[#FAFAFA]">Font &amp; pengiriman file</span>
                    <p className="mt-1 leading-relaxed text-[#A1A1AA]">
                      Sertakan font asli atau ubah teks menjadi <em>outline</em>. File di atas 25 MB cukup dikirim sebagai tautan Google Drive / WeTransfer.
                    </p>
                  </div>
                </li>
              </ul>

              <div className="mt-auto pt-5">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Halo Admin ${storeName}, saya ingin mengirim file desain jersey tim. Berikut tautan file desain kami: `
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#84CC16] hover:underline"
                >
                  <span>Kirim file desain Anda sekarang</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            {/* B. Peta Penempatan Logo & Nama */}
            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 sm:p-7 flex flex-col">
              <div className="flex items-start gap-3 mb-5">
                <span className="w-10 h-10 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2M9 12h6" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#FAFAFA]">
                    Peta Penempatan Logo &amp; Nama
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">
                    Acuan standar produksi kami, bukan sekadar perkiraan.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#09090B] border border-[#1F2026] p-4">
                <svg
                  viewBox="0 0 320 210"
                  role="img"
                  aria-labelledby="peta-logo-title"
                  className="mx-auto h-auto w-full max-w-sm text-[#71717A]"
                >
                  <title id="peta-logo-title">
                    Peta penempatan logo dada, lengan, nama, dan nomor punggung pada jersey
                  </title>

                  {/* Siluet jersey tampak depan */}
                  <path
                    d="M 46 46 L 30 52 L 16 86 L 34 94 L 34 178 Q 80 188 126 178 L 126 94 L 144 86 L 130 52 L 114 46 Q 80 60 46 46 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path d="M 80 62 L 80 180" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />

                  {/* Siluet jersey tampak belakang */}
                  <path
                    d="M 206 46 L 190 52 L 176 86 L 194 94 L 194 178 Q 240 188 286 178 L 286 94 L 304 86 L 290 52 L 274 46 Q 240 54 206 46 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />

                  {/* Penanda posisi cetak */}
                  <g fontSize="10" fontWeight="700" textAnchor="middle">
                    <circle cx="104" cy="82" r="8.5" fill="#84CC16" />
                    <text x="104" y="85.5" fill="#09090B">1</text>

                    <circle cx="58" cy="82" r="8.5" fill="#84CC16" />
                    <text x="58" y="85.5" fill="#09090B">2</text>

                    <circle cx="31" cy="72" r="8.5" fill="#84CC16" />
                    <text x="31" y="75.5" fill="#09090B">3</text>

                    <circle cx="240" cy="96" r="8.5" fill="#84CC16" />
                    <text x="240" y="99.5" fill="#09090B">4</text>

                    <circle cx="240" cy="140" r="8.5" fill="#84CC16" />
                    <text x="240" y="143.5" fill="#09090B">5</text>
                  </g>

                  <g fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.8">
                    <text x="80" y="200">Tampak Depan</text>
                    <text x="240" y="200">Tampak Belakang</text>
                  </g>
                </svg>
              </div>

              <ol className="mt-4 space-y-2 text-xs">
                <li className="flex items-baseline gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#84CC16]/15 text-[10px] font-black text-[#84CC16]">1</span>
                  <span className="text-[#A1A1AA]">
                    <strong className="text-[#FAFAFA]">Logo dada kiri</strong> — 8 × 8 cm, sejajar jantung.
                  </span>
                </li>
                <li className="flex items-baseline gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#84CC16]/15 text-[10px] font-black text-[#84CC16]">2</span>
                  <span className="text-[#A1A1AA]">
                    <strong className="text-[#FAFAFA]">Logo dada kanan / sponsor</strong> — maksimal 10 × 6 cm.
                  </span>
                </li>
                <li className="flex items-baseline gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#84CC16]/15 text-[10px] font-black text-[#84CC16]">3</span>
                  <span className="text-[#A1A1AA]">
                    <strong className="text-[#FAFAFA]">Logo lengan</strong> — 6 × 6 cm, opsional.
                  </span>
                </li>
                <li className="flex items-baseline gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#84CC16]/15 text-[10px] font-black text-[#84CC16]">4</span>
                  <span className="text-[#A1A1AA]">
                    <strong className="text-[#FAFAFA]">Nama punggung</strong> — huruf kapital, tinggi ±5 cm.
                  </span>
                </li>
                <li className="flex items-baseline gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#84CC16]/15 text-[10px] font-black text-[#84CC16]">5</span>
                  <span className="text-[#A1A1AA]">
                    <strong className="text-[#FAFAFA]">Nomor punggung</strong> — 25 × 20 cm, font tebal.
                  </span>
                </li>
              </ol>

              <p className="mt-auto pt-4 text-[11px] leading-relaxed text-[#71717A]">
                Ukuran di atas adalah acuan standar. Posisi final akan dikunci pada mockup yang Anda setujui sebelum produksi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Karakteristik Kain Dryfit Unggulan */}
      <section id="pilihan-bahan" className="py-20 border-b border-[#27272A] scroll-mt-36">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-[#84CC16] uppercase block mb-2">
              MATERIAL PILIHAN ATLET
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#FAFAFA]">
              Karakteristik Kain Dryfit Premium
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-2">
              Seluruh bahan kami memiliki teknologi pendinginan cepat (quick dry) dan sirkulasi udara optimal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fabricList.length === 0 ? (
              <div className="col-span-full text-center py-12 rounded-2xl bg-[#141418] border border-[#27272A] p-6 text-[#A1A1AA] text-xs">
                Pilihan bahan kain sedang diperbarui. Hubungi admin WhatsApp kami untuk konsultasi sampel kain lengkap.
              </div>
            ) : (
              fabricList.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 hover:border-[#84CC16]/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#84CC16]/10 text-[#84CC16] flex items-center justify-center font-bold text-sm">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#84CC16]/10 border border-[#84CC16]/25 text-[#84CC16] text-[10px] font-bold tracking-tight uppercase">
                        {getFabricBadge(item.name)}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#FAFAFA] mb-2">{item.name}</h3>
                    <p className="text-xs text-[#A1A1AA] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. FAQ Pemesanan */}
      <section id="faq" className="py-20 border-b border-[#27272A] bg-[#0C0D11] scroll-mt-36">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-[#84CC16] uppercase block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FAFAFA]">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-[#141418] border border-[#27272A] p-5">
              <h3 className="font-bold text-sm text-[#FAFAFA] mb-1.5 flex items-center gap-2">
                <span className="text-[#84CC16]">Q:</span> Apakah bisa memesan jersey dalam jumlah sedikit atau satuan?
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed pl-5">
                Ya! First Apparel melayani pemesanan tanpa batasan minimum order. Anda bisa membuat jersey satuan, lusinan untuk satu tim, maupun ratusan pcs untuk kebutuhan instansi/event turnamen.
              </p>
            </div>

            <div className="rounded-xl bg-[#141418] border border-[#27272A] p-5">
              <h3 className="font-bold text-sm text-[#FAFAFA] mb-1.5 flex items-center gap-2">
                <span className="text-[#84CC16]">Q:</span> Berapa lama proses pengerjaan pembuatan jersey tim?
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed pl-5">
                Estimasi pengerjaan reguler berkisar 3 sampai 7 hari kerja setelah desain disetujui (fix) dan pembayaran DP masuk. Untuk kebutuhan mendesak (*urgent*), tersedia layanan express dengan konfirmasi terlebih dahulu ke admin.
              </p>
            </div>

            <div className="rounded-xl bg-[#141418] border border-[#27272A] p-5">
              <h3 className="font-bold text-sm text-[#FAFAFA] mb-1.5 flex items-center gap-2">
                <span className="text-[#84CC16]">Q:</span> Apakah ada biaya tambahan untuk mencetak nama dan nomor punggung yang berbeda tiap pemain?
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed pl-5">
                Tidak ada biaya tambahan alias GRATIS! Sistem cetak sublimasi full printing kami memungkinkan setiap lembar jersey memiliki nama pemain, nomor punggung, dan ukuran yang berbeda-beda tanpa biaya ekstra.
              </p>
            </div>

            <div className="rounded-xl bg-[#141418] border border-[#27272A] p-5">
              <h3 className="font-bold text-sm text-[#FAFAFA] mb-1.5 flex items-center gap-2">
                <span className="text-[#84CC16]">Q:</span> Bagaimana jika barang yang saya terima cacat atau salah nomor?
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed pl-5">
                Kami memberikan garansi 100% ganti baru tanpa biaya tambahan jika terjadi kesalahan produksi dari pihak kami (seperti salah cetak nomor, nama salah ketik dari data rekap, atau cacat jahitan).
              </p>
            </div>

            <div className="rounded-xl bg-[#141418] border border-[#27272A] p-5">
              <h3 className="font-bold text-sm text-[#FAFAFA] mb-1.5 flex items-center gap-2">
                <span className="text-[#84CC16]">Q:</span> Format file desain seperti apa yang harus saya siapkan?
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed pl-5">
                Cukup file vektor (<span className="font-mono">.AI</span>, <span className="font-mono">.EPS</span>, <span className="font-mono">.PDF</span>, <span className="font-mono">.CDR</span>, <span className="font-mono">.SVG</span>) atau PNG transparan minimal 300 DPI. Belum punya file? Kirim saja foto referensi atau sketsa tangan, desainer kami buatkan mockup-nya gratis. Rincian lengkap ada di{" "}
                <a href="#panduan-desain" className="font-semibold text-[#84CC16] hover:underline">
                  panduan file desain &amp; penempatan logo
                </a>
                .
              </p>
            </div>

            <div className="rounded-xl bg-[#141418] border border-[#27272A] p-5">
              <h3 className="font-bold text-sm text-[#FAFAFA] mb-1.5 flex items-center gap-2">
                <span className="text-[#84CC16]">Q:</span> Ke rekening mana pembayaran DP dilakukan dan apakah aman?
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed pl-5">
                DP 50% baru dibayarkan setelah Anda menerima invoice resmi yang mencantumkan nomor rekening atas nama toko/perusahaan. Admin tidak pernah meminta transfer ke rekening pribadi lewat pesan singkat. Jika ragu, konfirmasi ulang nomor rekening melalui WhatsApp resmi yang tertera di halaman ini sebelum mentransfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Spanduk CTA WhatsApp */}
      <section className="py-16 bg-[#09090B] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#181A22] via-[#14151C] to-[#101116] border border-[#27272A] shadow-xl">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#FAFAFA]">
              Siap Wujudkan Jersey Custom Tim Anda?
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] mt-3 max-w-xl mx-auto">
              Konsultasikan ide desain Anda sekarang juga. Desainer kami siap membantu memilih warna, font, dan bahan terbaik untuk tim kebanggaan Anda.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#84CC16] text-[#09090B] text-sm font-bold tracking-wide transition-all hover:bg-[#9ee238] active:scale-95 shadow-[0_0_25px_rgba(132,204,22,0.3)]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
                </svg>
                <span>Konsultasi WhatsApp Sekarang</span>
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#141418] border border-[#27272A] text-[#FAFAFA] text-sm font-semibold hover:border-[#84CC16]/50 transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <Footer
        storeName={storeName}
        storeAddress={storeAddress}
        googleMapsUrl={googleMapsUrl}
        operatingHours={operatingHours}
        whatsappNumber={whatsappNumber}
        defaultWaText={defaultWaText}
        instagramUrl={instagramUrl}
        logoUrl={logoUrl}
        storeDescription={storeDescription}
      />
    </div>
  );
}
