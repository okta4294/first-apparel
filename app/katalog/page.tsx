import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { db } from "@/lib/db";
import { siteSettings, catalogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { KatalogClient } from "./katalog-client";

export const instant = false;

export default async function KatalogPage() {
  let storeName = "First Apparel";
  let storeAddress = "Jl. Terusan Olahraga No. 8, Bandung, Jawa Barat";
  let googleMapsUrl: string | null = null;
  let operatingHours = "Senin - Sabtu, 09.00 - 17.00 WIB";
  let whatsappNumber = "6281234567890";
  let defaultWaText = "Halo Admin First Apparel, saya ingin berkonsultasi tentang pemesanan jersey kustom.";
  let instagramUrl: string | null = null;
  let logoUrl: string | null = null;
  let storeDescription =
    "Vendor konveksi dan produsen custom jersey olahraga profesional. Melayani pembuatan seragam futsal, sepak bola, esports, running, dan apparel komunitas.";

  let catalogList: (typeof catalogs.$inferSelect)[] = [];

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
      storeDescription = s.storeDescription || storeDescription;
    }

    catalogList = await db
      .select()
      .from(catalogs)
      .where(eq(catalogs.isActive, true))
      .orderBy(desc(catalogs.createdAt));
  } catch {
    // Fallback jika query database sedang terhambat
  }

  const getWaLink = (message?: string) => {
    const text = message || defaultWaText;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      {/* 1. Navbar */}
      <Navbar waNumber={whatsappNumber} storeName={storeName} logoUrl={logoUrl} />

      {/* 2. Hero Header Katalog */}
      <section className="relative py-16 border-b border-[#27272A] bg-gradient-to-b from-[#121318] to-[#09090B] overflow-hidden">
        {/* Glow ambient atletik hijau neon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#84CC16]/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <span className="inline-block px-3 py-1 rounded-full bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16] text-xs font-bold uppercase tracking-widest mb-4">
            KATALOG RESMI FIRST APPAREL
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FAFAFA] uppercase">
            Eksplorasi Desain Jersey Tim Anda
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] mt-4 leading-relaxed">
            Pilihan model jersey futsal, sepak bola, e-sports pro, running, dan jaket tim dengan bahan Dryfit premium berstandar atlet. Seluruh desain dapat dikustomisasi penuh sesuai logo, sponsor, dan nama tim Anda.
          </p>
        </div>
      </section>

      {/* 3. Konten Utama Katalog & Filter Interaktif */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <KatalogClient items={catalogList} waNumber={whatsappNumber} />
      </main>

      {/* 4. Footer */}
      <footer className="border-t border-[#27272A] bg-[#0C0D11] pt-16 pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1F1F24]">
            {/* C1: Brand Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                {logoUrl ? (
                  <div className="w-8 h-8 rounded-lg bg-[#181920] border border-[#27272A] flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <img src={logoUrl} alt={storeName} className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-md bg-[#84CC16] flex items-center justify-center font-black text-[#09090B] text-xs shrink-0">
                    {storeName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-base tracking-tight text-[#FAFAFA]">
                  {storeName}
                </span>
              </Link>
              <p className="text-[#71717A] leading-relaxed">
                {storeDescription}
              </p>
            </div>

            {/* C2: Tautan Halaman */}
            <div>
              <h3 className="font-bold text-sm text-[#FAFAFA] mb-4">Navigasi Halaman</h3>
              <ul className="space-y-2.5 text-[#A1A1AA]">
                <li>
                  <Link href="/" className="hover:text-[#84CC16] transition-colors">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/katalog" className="text-[#84CC16] font-medium">
                    Katalog Jersey
                  </Link>
                </li>
                <li>
                  <Link href="/cara-pesan" className="hover:text-[#84CC16] transition-colors">
                    Alur Pemesanan
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-[#84CC16] transition-colors">
                    Blog &amp; Panduan
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-[#52525B] hover:text-[#A1A1AA] transition-colors">
                    Panel Admin (Login)
                  </Link>
                </li>
              </ul>
            </div>

            {/* C3: Kategori Olahraga */}
            <div>
              <h3 className="font-bold text-sm text-[#FAFAFA] mb-4">Kategori Produk</h3>
              <ul className="space-y-2.5 text-[#A1A1AA]">
                <li>
                  <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                    Jersey Futsal &amp; Bola
                  </Link>
                </li>
                <li>
                  <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                    Jersey Esports Pro
                  </Link>
                </li>
                <li>
                  <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                    Jersey Running &amp; Cycling
                  </Link>
                </li>
                <li>
                  <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                    Jaket &amp; Coach Jacket
                  </Link>
                </li>
              </ul>
            </div>

            {/* C4: Kontak & Lokasi Workshop */}
            <div>
              <h3 className="font-bold text-sm text-[#FAFAFA] mb-4">Kontak &amp; Workshop</h3>
              <ul className="space-y-2.5 text-[#71717A]">
                <li>
                  <span className="block text-[#FAFAFA] font-medium mb-0.5">Alamat Workshop:</span>
                  <span>{storeAddress}</span>
                </li>
                {googleMapsUrl && (
                  <li>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#84CC16] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      📍 Buka di Google Maps →
                    </a>
                  </li>
                )}
                <li>
                  <span className="block text-[#FAFAFA] font-medium mb-0.5">Jam Kerja:</span>
                  <span>{operatingHours}</span>
                </li>
                <li>
                  <span className="block text-[#FAFAFA] font-medium mb-0.5">WhatsApp Resmi:</span>
                  <a
                    href={getWaLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#84CC16] hover:underline"
                  >
                    +{whatsappNumber}
                  </a>
                </li>
                {instagramUrl && (
                  <li>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#84CC16] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      📸 Ikuti Instagram Kami →
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center text-[#52525B]">
            © 2026 {storeName}. All Rights Reserved. Seluruh pemesanan dilayani via WhatsApp Resmi.
          </div>
        </div>
      </footer>
    </div>
  );
}
