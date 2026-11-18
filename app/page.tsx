import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroShowcaseCarousel } from "@/components/hero-showcase-carousel";
import { SizeChartTrigger } from "@/components/size-chart-trigger";
import { PromoPopup } from "@/components/promo-popup";
import { PromoBannerCarousel } from "@/components/promo-banner-carousel";
import { db } from "@/lib/db";
import { siteSettings, catalogs, promos, partners, blogs } from "@/lib/db/schema";
import { eq, and, lte, gte, or, asc, desc } from "drizzle-orm";

export const instant = false;

const INITIAL_CATALOGS = [
  {
    id: 1,
    title: "Striker Volt Pro Series",
    category: "FUTSAL & SEPAK BOLA",
    fabric: "Dryfit Brazil Original",
    priceInfo: "Mulai Rp 125.000 / pcs",
    imageUrl: "",
    sizeChartUrl: null as string | null,
  },
  {
    id: 2,
    title: "Cyber Pulse Apex Pro",
    category: "ESPORTS PRO",
    fabric: "Dryfit Milano",
    priceInfo: "Mulai Rp 135.000 / pcs",
    imageUrl: "",
    sizeChartUrl: null as string | null,
  },
  {
    id: 3,
    title: "Aero Glide Ultralight Series",
    category: "RUNNING & CYCLING",
    fabric: "Micro Mesh",
    priceInfo: "Mulai Rp 115.000 / pcs",
    imageUrl: "",
    sizeChartUrl: null as string | null,
  },
  {
    id: 4,
    title: "Official Team Coach Jacket",
    category: "COACH & APPAREL JAKET",
    fabric: "Taslan Parasut",
    priceInfo: "Mulai Rp 175.000 / pcs",
    imageUrl: "",
    sizeChartUrl: null as string | null,
  },
];

const DEFAULT_PARTNERS = [
  { id: 1, name: "Bandung Futsal League", category: "Kompetisi Futsal", logoUrl: "", websiteUrl: null },
  { id: 2, name: "Apex Esports ID", category: "Tim E-Sports", logoUrl: "", websiteUrl: null },
  { id: 3, name: "Siliwangi Runners", category: "Komunitas Lari", logoUrl: "", websiteUrl: null },
  { id: 4, name: "Garuda Muda FC", category: "Klub Sepak Bola", logoUrl: "", websiteUrl: null },
];

export default async function HomePage() {
  let storeName = "First Apparel";
  let storeAddress = "Jl. Terusan Olahraga No. 8, Bandung, Jawa Barat";
  let googleMapsUrl: string | null = null;
  let operatingHours = "Senin – Sabtu, 09.00 – 17.00 WIB";
  let whatsappNumber = "6281234567890";
  let defaultWaText =
    "Halo Admin First Apparel, saya ingin berkonsultasi mengenai pemesanan custom jersey.";
  let instagramUrl: string | null = null;
  let logoUrl: string | null = null;
  let storeSizeChartUrl: string | null = null;
  let storeDescription =
    "Konveksi spesialis jersey olahraga custom & apparel tim profesional di Bandung. Bebas custom desain, bahan dryfit premium, dan melayani kirim ke seluruh Indonesia.";

  let activePromos: (typeof promos.$inferSelect)[] = [];
  let popupPromo: typeof promos.$inferSelect | null = null;
  let featuredCatalogs: (typeof catalogs.$inferSelect)[] = [];
  let partnerList: (typeof partners.$inferSelect)[] = [];
  let latestBlogs: (typeof blogs.$inferSelect)[] = [];

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
      storeSizeChartUrl = s.sizeChartUrl || null;
      storeDescription = s.storeDescription || storeDescription;
    }

    const now = new Date();
    activePromos = await db
      .select()
      .from(promos)
      .where(
        and(
          eq(promos.isActive, true),
          or(
            eq(promos.hasDuration, false),
            and(lte(promos.startDate, now), gte(promos.endDate, now))
          )
        )
      )
      .orderBy(desc(promos.id));

    const popupResults = await db
      .select()
      .from(promos)
      .where(
        and(
          eq(promos.isActive, true),
          eq(promos.isPopup, true),
          or(
            eq(promos.hasDuration, false),
            and(lte(promos.startDate, now), gte(promos.endDate, now))
          )
        )
      )
      .orderBy(desc(promos.id))
      .limit(1);
    popupPromo = popupResults[0] || null;

    featuredCatalogs = await db
      .select()
      .from(catalogs)
      .where(and(eq(catalogs.isActive, true), eq(catalogs.isFeatured, true)))
      .limit(4);

    partnerList = await db
      .select()
      .from(partners)
      .where(eq(partners.isActive, true))
      .orderBy(asc(partners.sortOrder));

    latestBlogs = await db
      .select()
      .from(blogs)
      .where(eq(blogs.isPublished, true))
      .orderBy(desc(blogs.publishedAt))
      .limit(3);
  } catch {
    // Gunakan nilai bawaan jika koneksi belum aktif atau saat kompilasi statis
  }

  const getWaLink = (message?: string) => {
    const text = message || defaultWaText;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const displayCatalogs =
    featuredCatalogs.length > 0 ? featuredCatalogs : INITIAL_CATALOGS;

  const displayPartners =
    partnerList.length > 0 ? partnerList : DEFAULT_PARTNERS;

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      {/* 1. Navbar */}
      <Navbar waNumber={whatsappNumber} storeName={storeName} logoUrl={logoUrl} />

      {/* Pop-up Promo Otomatis (Jika Diaktifkan Admin) */}
      <PromoPopup promo={popupPromo} waNumber={whatsappNumber} />

      <main className="flex-1">
      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-10 sm:py-16 lg:py-24 border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Info Kiri */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-[-0.035em] leading-[1.1] [text-wrap:balance] text-[#FAFAFA]">
                Custom Jersey Olahraga <span className="text-[#84CC16]">Sesuai Desain Tim Anda</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[#A1A1AA] leading-relaxed max-w-[52ch] [text-wrap:pretty]">
                Bebas konsultasi desain dan pesan tanpa minimum order (bisa satuan hingga ratusan pcs). Seluruh alur pemesanan dan pratinjau desain dilayani langsung oleh tim desainer kami via WhatsApp.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href={getWaLink("Halo Admin First Apparel, saya ingin mulai konsultasi pembuatan custom jersey untuk tim saya.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#84CC16] text-[#09090B] font-bold text-xs sm:text-sm tracking-wide transition-all hover:bg-[#9ee238] active:scale-95 shadow-[0_0_25px_rgba(132,204,22,0.25)]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
                  </svg>
                  <span>Mulai Konsultasi via WhatsApp</span>
                </a>
                <Link
                  href="#katalog"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-transparent border border-[#27272A] text-[#E4E4E7] font-semibold text-xs sm:text-sm tracking-wide hover:border-[#3F3F46] hover:bg-[#141418] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#84CC16]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Lihat Katalog Model</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-[#1F1F23] text-xs text-[#A1A1AA] font-medium tracking-tight">
                <div className="flex items-center gap-2">
                  <span className="text-[#84CC16] font-bold text-sm">✓</span> Bahan Premium
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#84CC16] font-bold text-sm">✓</span> Pengerjaan Cepat (3–7 Hari)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#84CC16] font-bold text-sm">✓</span> Bebas Konsultasi Desain
                </div>
              </div>
            </div>

            {/* Kartu Carousel Preview Desain Terpilih (Kanan) */}
            <div className="lg:col-span-5">
              <HeroShowcaseCarousel
                waNumber={whatsappNumber}
                items={displayCatalogs}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Banner Promo Dinamis Carousel */}
      {activePromos.length > 0 && (
        <PromoBannerCarousel
          promos={activePromos}
          waNumber={whatsappNumber}
        />
      )}

      {/* 3. USP Section (Keunggulan Produksi Resmi) */}
      <section className="py-20 border-b border-[#27272A] bg-[#0C0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
              Mengapa Tim Anda Memilih First Apparel?
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] mt-3">
              Kualitas jahitan standar apparel profesional dengan teknologi cetak modern dan bahan kain grade-A.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-8 flex flex-col justify-between hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/25 flex items-center justify-center text-[#84CC16] mb-6 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#84CC16] tracking-wider block mb-2">
                  Ringan &amp; Menyerap Keringat
                </span>
                <h3 className="text-lg font-bold text-[#FAFAFA] mb-2.5">
                  Dryfit Milano & Brazil Original
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Serat kain berpori mikro yang menyerap keringat seketika. Ringan, sejuk, dan tidak membatasi pergerakan saat bertanding.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-8 flex flex-col justify-between hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/25 flex items-center justify-center text-[#84CC16] mb-6 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4 4 4 0 014-4 4 4 0 014 4 4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#84CC16] tracking-wider block mb-2">
                  Sablon Awet Tahan Lama
                </span>
                <h3 className="text-lg font-bold text-[#FAFAFA] mb-2.5">
                  Sublimasi Full Print HD
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Tinta khusus meresap sempurna ke serat kain. Warna tajam, gradasi rapi, tidak pecah, dan tidak luntur meski dicuci berkali-kali.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-8 flex flex-col justify-between hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/25 flex items-center justify-center text-[#84CC16] mb-6 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-[#84CC16] tracking-wider block mb-2">
                  Pesan Satuan atau Partai Besar
                </span>
                <h3 className="text-lg font-bold text-[#FAFAFA] mb-2.5">
                  Tanpa Minimum Order
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Melayani pesanan mulai dari 1 pcs untuk contoh atau kapten, hingga ratusan pcs untuk turnamen dengan harga berjenjang makin hemat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Katalog Section */}
      <section id="katalog" className="py-20 border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
                Pilihan Model Jersey Populer
              </h2>
            </div>
            <Link
              href="/katalog"
              className="text-sm font-semibold text-[#84CC16] hover:text-[#9ee238] transition-colors inline-flex items-center gap-1 self-start md:self-auto"
            >
              Lihat Semua Katalog Model →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {displayCatalogs.map((item, idx) => {
              const waItemMsg = `Halo Admin First Apparel, saya tertarik memesan custom jersey model "${item.title}" (${item.category}). Bisa info detail pemesanannya?`;
              const isBestSeller = idx === 0;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl bg-[#141418] border transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                    isBestSeller
                      ? "border-[#84CC16] ring-1 ring-[#84CC16]/30 shadow-lg"
                      : "border-[#27272A] hover:border-[#3F3F46] hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {/* Badge Best Seller untuk Model Utama */}
                  {isBestSeller && (
                    <div className="bg-[#84CC16] text-[#09090B] text-[10px] font-black uppercase tracking-widest text-center py-1">
                      ★ PALING BANYAK DIPESAN TIM
                    </div>
                  )}

                  {/* Visual Mockup & Kategori Tag */}
                  <div className="h-48 bg-gradient-to-b from-[#1C1D24] to-[#121318] border-b border-[#27272A] relative overflow-hidden p-4 flex items-center justify-center">
                    {/* Kategori Badge di Pojok Kiri Atas */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#09090B]/85 backdrop-blur-sm border border-[#27272A] text-[10px] font-bold text-[#84CC16] tracking-wider uppercase">
                        {item.category}
                      </span>
                    </div>

                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-center space-y-2 relative z-10 transition-transform duration-300 group-hover:scale-105">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#181922] border border-[#84CC16]/25 flex items-center justify-center text-[#84CC16]">
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider font-bold block">
                          Preview Produksi HD
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Keterangan & Blok Harga */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#FAFAFA] leading-snug group-hover:text-[#84CC16] transition-colors">
                        {item.title}
                      </h3>

                      {/* Tag Spesifikasi Bahan */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1C1D24] border border-[#27272A] text-[11px] text-[#D4D4D8] font-medium mt-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                        <span>{item.fabric}</span>
                      </div>
                    </div>

                    {/* Blok Harga */}
                    <div className="pt-4 mt-5 border-t border-[#1F1F23]">
                      <div className="mb-3.5 p-3.5 rounded-xl bg-[#0A0B0E] border border-[#1F2026]">
                        {/* Baris Atas: Label & Lencana Spesifikasi */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-bold text-[#84CC16] tracking-widest uppercase">
                            HARGA MULAI
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#181920] border border-[#27272A] text-[10px] font-bold text-[#D4D4D8] uppercase tracking-wider shrink-0">
                            Full Print
                          </span>
                        </div>

                        {/* Baris Bawah: Angka Harga Tanpa Patah Baris */}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#FAFAFA] tabular-nums whitespace-nowrap">
                            {item.priceInfo ? item.priceInfo.replace(/mulai\s*/i, "").replace(/\/.*$/, "").trim() : "Hubungi Kami"}
                          </span>
                          <span className="text-xs font-semibold text-[#A1A1AA] whitespace-nowrap">/ pcs</span>
                        </div>
                      </div>

                      {(storeSizeChartUrl || item.sizeChartUrl) && (
                        <div className="mb-2.5">
                          <SizeChartTrigger
                            title={item.title}
                            sizeChartUrl={(storeSizeChartUrl || item.sizeChartUrl)!}
                          />
                        </div>
                      )}

                      <a
                        href={getWaLink(waItemMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#84CC16] hover:bg-[#9ee238] active:scale-[0.98] text-[#09090B] font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(132,204,22,0.25)] group-hover:shadow-[0_0_30px_rgba(132,204,22,0.4)]"
                      >
                        <span>Pesan Model Ini via WA →</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Seksi Mitra & Partner */}
      <section className="py-16 border-b border-[#27272A] bg-[#0C0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
              Dipercaya Komunitas & Tim Olahraga
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2">
              Mulai dari tim esport, komunitas lari, hingga klub liga lokal telah mempercayakan produksi jersey tim kepada First Apparel.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 items-center">
            {displayPartners.map((partner) => {
              const content = (
                <div className="p-4 rounded-xl bg-[#141418] border border-[#27272A] hover:border-[#3F3F46] transition-all flex flex-col items-center justify-center text-center gap-2 group min-h-[120px] h-auto">
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.name}
                      width={130}
                      height={44}
                      className="max-h-11 max-w-[130px] object-contain opacity-85 group-hover:opacity-100 transition-opacity shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#27272A] flex items-center justify-center text-sm font-bold text-[#84CC16] shrink-0">
                      {partner.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs sm:text-sm font-semibold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors line-clamp-2">
                    {partner.name}
                  </span>
                  {partner.category && partner.category !== "MITRA LAINNYA" && (
                    <span className="text-[10px] text-[#A1A1AA] line-clamp-1">
                      {partner.category}
                    </span>
                  )}
                </div>
              );

              return partner.websiteUrl ? (
                <a
                  key={partner.id}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <div key={partner.id}>{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Alur Pemesanan Section */}
      <section id="alur" className="py-20 border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
              4 Tahap Mudah Pemesanan via WhatsApp
            </h2>
            <p className="text-sm sm:text-base text-[#A1A1AA] mt-3">
              Pemesanan langsung terhubung ke admin desainer profesional tanpa repot mengisi formulir web.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 flex flex-col justify-between hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] font-black text-lg mb-5 group-hover:scale-105 transition-transform">
                01
              </div>
              <div>
                <h3 className="text-base font-bold text-[#FAFAFA] mb-2 group-hover:text-[#84CC16] transition-colors">
                  Chat WA & Kirim Konsep
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Pilih model dari katalog atau kirim gambar sketsa ide, warna, dan logo tim via WhatsApp.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 flex flex-col justify-between hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] font-black text-lg mb-5 group-hover:scale-105 transition-transform">
                02
              </div>
              <div>
                <h3 className="text-base font-bold text-[#FAFAFA] mb-2 group-hover:text-[#84CC16] transition-colors">
                  Pratinjau Desain Digital
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Tim desainer kami buatkan preview visual jersey untuk disetujui bersama sebelum dicetak.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 flex flex-col justify-between hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] font-black text-lg mb-5 group-hover:scale-105 transition-transform">
                03
              </div>
              <div>
                <h3 className="text-base font-bold text-[#FAFAFA] mb-2 group-hover:text-[#84CC16] transition-colors">
                  Produksi Sublimasi & Jahit
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Setelah transfer DP pesanan masuk proses cetak sublimasi HD & penjahitan rapi 3-7 hari kerja.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 flex flex-col justify-between hover:border-[#3F3F46] hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] font-black text-lg mb-5 group-hover:scale-105 transition-transform">
                04
              </div>
              <div>
                <h3 className="text-base font-bold text-[#FAFAFA] mb-2 group-hover:text-[#84CC16] transition-colors">
                  Pengecekan Akhir & Kirim
                </h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Pemeriksaan ukuran dan nama punggung, pelunasan, lalu paket jersey dikirim aman ke alamat Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/cara-pesan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#181920] border border-[#27272A] text-[#FAFAFA] text-xs sm:text-sm font-semibold hover:border-[#84CC16]/50 hover:text-[#84CC16] transition-all"
            >
              <span>Pelajari Alur Lengkap, Size Chart & Panduan Bahan</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6.5 Preview Blog & Panduan */}
      {latestBlogs.length > 0 && (
        <section className="py-20 border-b border-[#27272A] bg-[#0C0D11]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
                  Blog &amp; Panduan Jersey Olahraga
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#84CC16] hover:underline"
              >
                <span>Lihat Semua Artikel</span>
                <span>→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestBlogs.map((b) => (
                <article
                  key={b.id}
                  className="rounded-2xl bg-[#141418] border border-[#27272A] overflow-hidden hover:border-[#3F3F46] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <Link href={`/blog/${b.slug}`} className="aspect-[16/10] overflow-hidden bg-[#1E1F27] block">
                    <img
                      src={b.thumbnailUrl}
                      alt={b.title}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <p className="text-[11px] text-[#A1A1AA]">
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(b.publishedAt))}
                      </p>
                      <h3 className="font-bold text-base text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${b.slug}`}>
                          {b.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#A1A1AA] line-clamp-2 leading-relaxed">
                        {b.excerpt}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#27272A]">
                      <Link
                        href={`/blog/${b.slug}`}
                        className="text-xs font-bold text-[#84CC16] inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                      >
                        <span>Baca Selengkapnya</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Spanduk CTA WhatsApp */}
      <section className="py-16 bg-[#09090B] border-b border-[#27272A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-[#181A22] via-[#14151C] to-[#101116] border border-[#27272A] shadow-xl">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
                Siap Produksi Jersey Tim Anda?
              </h2>
              <p className="text-sm sm:text-base text-[#A1A1AA] mt-2 leading-relaxed">
                Konsultasikan konsep desain gratis dan dapatkan penawaran harga spesial untuk tim atau komunitas Anda langsung di WhatsApp.
              </p>
            </div>
            <a
              href={getWaLink("Halo Admin First Apparel, saya ingin berkonsultasi konsep desain dan penawaran harga khusus tim.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#84CC16] text-[#09090B] font-bold text-sm tracking-wide transition-all hover:bg-[#9ee238] active:scale-95 shadow-[0_0_30px_rgba(132,204,22,0.3)] shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
              </svg>
              <span>Chat WhatsApp Admin Sekarang →</span>
            </a>
          </div>
        </div>
      </section>
      </main>

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
