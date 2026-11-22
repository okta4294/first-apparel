import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroShowcaseCarousel } from "@/components/hero-showcase-carousel";
import { SizeChartTrigger } from "@/components/size-chart-trigger";
import { PromoPopup } from "@/components/promo-popup";
import { PromoBannerCarousel } from "@/components/promo-banner-carousel";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { MobileWaFab } from "@/components/mobile-wa-fab";
import { getSiteUrl } from "@/lib/site-url";
import {
  getSiteSettings,
  getActivePromos,
  getFeaturedCatalogs,
  getActivePartners,
  getLatestBlogs,
  getActiveReviews,
} from "@/lib/public-data";

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

export default async function HomePage() {
  const [settings, activePromos, featuredCatalogs, partnerList, latestBlogs, activeReviews] =
    await Promise.all([
      getSiteSettings(),
      getActivePromos(),
      getFeaturedCatalogs(),
      getActivePartners(),
      getLatestBlogs(3),
      getActiveReviews(),
    ]);

  const {
    storeName,
    storeAddress,
    googleMapsUrl,
    operatingHours,
    whatsappNumber,
    defaultWaText,
    instagramUrl,
    logoUrl,
    sizeChartUrl: storeSizeChartUrl,
    storeDescription,
  } = settings;

  const popupPromo = activePromos.find((p) => p.isPopup) ?? null;
  const bannerPromos = activePromos;

  const getWaLink = (message?: string) => {
    const text = message || defaultWaText;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const displayCatalogs =
    featuredCatalogs.length > 0 ? featuredCatalogs : INITIAL_CATALOGS;

  const averageRating =
    activeReviews.length > 0
      ? Number(
          (
            activeReviews.reduce((sum, item) => sum + item.rating, 0) /
            activeReviews.length
          ).toFixed(1)
        )
      : null;

  const siteUrl = getSiteUrl();
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: storeName,
    description: storeDescription,
    url: siteUrl,
    telephone: `+${whatsappNumber}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: storeAddress,
      addressLocality: "Bandung",
      addressRegion: "Jawa Barat",
      addressCountry: "ID",
    },
    openingHours: operatingHours,
    ...(logoUrl ? { image: logoUrl } : {}),
    ...(instagramUrl ? { sameAs: [instagramUrl] } : {}),
    ...(averageRating !== null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: activeReviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessJsonLd).replace(/</g, "\\u003c"),
        }}
      />
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
                  className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3.5 rounded-full bg-[#84CC16] text-[#09090B] font-bold text-xs sm:text-sm tracking-wide transition-all hover:bg-[#9ee238] active:scale-95 shadow-lg"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>Mulai Konsultasi via WhatsApp</span>
                </a>
                <Link
                  href="#katalog"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3.5 rounded-full bg-transparent border border-[#27272A] text-[#E4E4E7] font-semibold text-xs sm:text-sm tracking-wide hover:border-[#3F3F46] hover:bg-[#141418] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#84CC16] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Lihat Katalog Model</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 pt-6 border-t border-[#1F1F23] text-xs text-[#A1A1AA] font-medium tracking-tight">
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
      {bannerPromos.length > 0 && (
        <PromoBannerCarousel
          promos={bannerPromos}
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
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-center space-y-2 relative z-10 transition-transform duration-300 group-hover:scale-105">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#181922] border border-[#84CC16]/25 flex items-center justify-center text-[#84CC16]">
                          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                        <span className="text-[11px] text-[#A1A1AA] uppercase tracking-wider font-bold block">
                          Pratinjau Produksi HD
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
                        className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#84CC16] hover:bg-[#9ee238] active:scale-[0.98] text-[#09090B] font-black text-xs tracking-wider uppercase transition-all shadow-md"
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

      {/* 5. Seksi Mitra & Partner (Hanya Tampil Jika Ada Data Nyata di Database) */}
      {partnerList.length > 0 && (
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
            {partnerList.map((partner) => {
              const content = (
                <div className="p-4 rounded-xl bg-[#141418] border border-[#27272A] hover:border-[#3F3F46] transition-all flex flex-col items-center justify-center text-center gap-2 group min-h-[120px] h-auto">
                  {partner.logoUrl ? (
                    <Image
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
      )}

      {/* 5.5 Seksi Ulasan Pelanggan (Hanya Tampil Jika Ada Data Asli di Database) */}
      {activeReviews.length > 0 && (
        <section className="py-20 border-b border-[#27272A] bg-[#09090B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
                  Kata Pelanggan Tentang Hasil Produksi Kami
                </h2>
                <p className="text-sm sm:text-base text-[#A1A1AA] mt-2">
                  Penilaian langsung dari tim dan komunitas yang sudah memesan jersey di {storeName}.
                </p>
              </div>
              {averageRating !== null && (
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#141418] border border-[#27272A] self-start md:self-auto">
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(averageRating)
                            ? "text-[#84CC16] fill-[#84CC16]"
                            : "text-[#3F3F46] fill-transparent"
                        }`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#FAFAFA] tabular-nums">
                    {averageRating} / 5 ({activeReviews.length} ulasan)
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl bg-[#141418] border border-[#27272A] p-6 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    <div
                      className="flex items-center gap-1"
                      aria-label={`Rating ${review.rating} dari 5 bintang`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-[#84CC16] fill-[#84CC16]"
                              : "text-[#3F3F46] fill-transparent"
                          }`}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-[#D4D4D8] leading-relaxed">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1F1F23]">
                    <p className="text-sm font-bold text-[#FAFAFA]">{review.customerName}</p>
                    {(review.teamOrRole || review.productName) && (
                      <p className="text-xs text-[#A1A1AA] mt-0.5">
                        {[review.teamOrRole, review.productName].filter(Boolean).join(" • ")}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
                  Tim desainer kami buatkan pratinjau visual jersey untuk disetujui bersama sebelum dicetak.
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
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-[#181920] border border-[#27272A] text-[#FAFAFA] text-xs sm:text-sm font-semibold hover:border-[#84CC16]/50 hover:text-[#84CC16] transition-all"
            >
              <span>Pelajari Alur Lengkap, Panduan Ukuran &amp; Bahan</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6.5 Preview Blog */}
      {latestBlogs.length > 0 && (
        <section className="py-20 border-b border-[#27272A] bg-[#0C0D11]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#FAFAFA]">
                  Blog
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
                    <Image
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
              className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-8 py-4 rounded-full bg-[#84CC16] text-[#09090B] font-bold text-sm tracking-wide transition-all hover:bg-[#9ee238] active:scale-95 shadow-lg shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
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
      {/* Tombol WhatsApp Melayang di Mobile Saat Scroll */}
      <MobileWaFab waHref={getWaLink()} />
    </div>
  );
}
