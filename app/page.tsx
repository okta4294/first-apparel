import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroShowcaseCarousel } from "@/components/hero-showcase-carousel";
import { PromoPopup } from "@/components/promo-popup";
import { PromoBannerCarousel } from "@/components/promo-banner-carousel";
import { FabricCatalogCarousel } from "@/components/fabric-catalog-carousel";
import { FeaturedCatalogCarousel } from "@/components/featured-catalog-carousel";
import { FaqSection } from "@/components/faq-section";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { MobileWaFab } from "@/components/mobile-wa-fab";
import { PageMotion } from "@/components/motion-provider";
import { getSiteUrl } from "@/lib/site-url";
import {
  getSiteSettings,
  getActivePromos,
  getFeaturedCatalogs,
  getActivePartners,
  getLatestBlogs,
  getActiveFabrics,
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
  const [
    settings,
    activePromos,
    featuredCatalogs,
    partnerList,
    latestBlogs,
    activeFabrics,
    activeReviews,
  ] = await Promise.all([
    getSiteSettings(),
    getActivePromos(),
    getFeaturedCatalogs(),
    getActivePartners(),
    getLatestBlogs(3),
    getActiveFabrics(),
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
    storeDescription,
  } = settings;

  const popupPromos = activePromos.filter((p) => p.isPopup);
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
      addressLocality: "Kendal",
      addressRegion: "Jawa Tengah",
      addressCountry: "ID",
    },
    areaServed: ["Kendal", "Semarang", "Jawa Tengah", "Indonesia"],
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
      <PageMotion />
      <Navbar waNumber={whatsappNumber} storeName={storeName} companyName={settings.companyName} logoUrl={logoUrl} />

      {/* Pop-up Promo Otomatis (Jika Diaktifkan Admin) */}
      <PromoPopup promos={popupPromos} waNumber={whatsappNumber} />

      <main className="flex-1">
      {/* 2. Hero Section */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#09090B] lg:min-h-[540px] xl:min-h-[600px] flex flex-col-reverse lg:flex-row lg:items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 pt-4 pb-10 sm:pt-6 sm:pb-14 lg:py-20">
          {/* Info Kiri */}
          <div data-animate="hero" className="lg:w-[48%] space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-[-0.035em] leading-[1.08] [text-wrap:balance] text-[#0F172A] dark:text-[#FAFAFA]">
              Custom Jersey Olahraga <span className="text-[#4D7C0F] dark:text-[#84CC16]">Sesuai Desain Tim Anda</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#475569] dark:text-[#A1A1AA] leading-relaxed max-w-[48ch] [text-wrap:pretty]">
              Bebas konsultasi desain dan pesan tanpa minimum order (bisa satuan hingga ratusan pcs). Seluruh alur pemesanan dan pratinjau desain dilayani langsung oleh tim desainer kami via WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                href={getWaLink("Halo Admin First Apparel, saya ingin mulai konsultasi pembuatan custom jersey untuk tim saya.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3.5 rounded-full bg-[#65A30D] hover:bg-[#4D7C0F] text-white dark:bg-[#84CC16] dark:text-[#09090B] dark:hover:bg-[#9ee238] font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-95 shadow-lg"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Mulai Konsultasi via WhatsApp</span>
              </a>
              <Link
                href="#katalog"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3.5 rounded-full bg-white/95 dark:bg-[#09090B]/80 backdrop-blur-sm border border-[#CBD5E1] dark:border-[#27272A] text-[#0F172A] dark:text-[#E4E4E7] font-semibold text-xs sm:text-sm tracking-wide hover:border-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:border-[#3F3F46] dark:hover:bg-[#141418] transition-colors"
              >
                <svg className="w-4 h-4 text-[#4D7C0F] dark:text-[#84CC16] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Lihat Katalog Model</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-[#E2E8F0] dark:border-[#1F1F23]">
              <div>
                <p className="text-xl sm:text-2xl font-black tracking-tight tabular-nums leading-none text-[#0F172A] dark:text-[#FAFAFA]">
                  100.000<span className="text-[#4D7C0F] dark:text-[#84CC16]">+</span>
                </p>
                <p className="text-[11px] sm:text-xs text-[#475569] dark:text-[#A1A1AA] font-medium mt-1.5 leading-snug">
                  Jersey Terproduksi
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black tracking-tight tabular-nums leading-none text-[#4D7C0F] dark:text-[#84CC16]">
                  100%
                </p>
                <p className="text-[11px] sm:text-xs text-[#475569] dark:text-[#A1A1AA] font-medium mt-1.5 leading-snug">
                  Garansi Tepat Waktu
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black tracking-tight tabular-nums leading-none text-[#0F172A] dark:text-[#FAFAFA]">
                  100%
                </p>
                <p className="text-[11px] sm:text-xs text-[#475569] dark:text-[#A1A1AA] font-medium mt-1.5 leading-snug">
                  Workshop Mandiri
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Full-Bleed Kanan (Data Gambar UploadThing) */}
        <HeroShowcaseCarousel items={displayCatalogs} />
      </section>

      {/* 2.5 Seksi Realita di Lapangan (4 Masalah Klasik) */}
      <section className="py-16 sm:py-24 border-b border-[#E2E8F0] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-animate="text-reveal" className="max-w-4xl mb-10 sm:mb-14 space-y-4">
            <p className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#475569] dark:text-[#A1A1AA]">
              <span className="w-5 h-[2px] bg-[#DC2626] dark:bg-[#F87171] shrink-0" aria-hidden="true" />
              <span>Realita di Lapangan</span>
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-[-0.035em] leading-[1.1] [text-wrap:balance] text-[#0F172A] dark:text-[#FAFAFA]">
              Pernah kecewa pesan jersey tim karena 4 masalah klasik ini
              <span className="text-[#DC2626] dark:text-[#F87171]">?</span>
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#A1A1AA] leading-relaxed max-w-2xl [text-wrap:pretty]">
              Semua produksi First Apparel dikerjakan di workshop sendiri dengan kontrol kualitas per potong agar semangat tim dan jadwal acara tetap terjaga.
            </p>
          </div>

          <ol
            data-animate="stagger-cards"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10"
          >
            {[
              {
                num: "01",
                title: "Warna cepat pudar dan luntur",
                description:
                  "Baru dicuci 2-3 kali, warna jersey sudah kusam atau sablon retak karena memakai tinta murah dan suhu press tidak standar.",
              },
              {
                num: "02",
                title: "Bahan panas dan bikin gerah",
                description:
                  "Kain polyester kaku yang tidak menyerap keringat membuat pemain cepat lelah dan tidak nyaman bergerak di cuaca terik.",
              },
              {
                num: "03",
                title: "Ukuran dan nameset meleset",
                description:
                  "Size chart berantakan (terlalu sempit atau kedodoran), hingga salah cetak ejaan nama punggung dan nomor pemain saat hari pertandingan.",
              },
              {
                num: "04",
                title: "Jadwal molor dari hari-H",
                description:
                  "Vendor hanya makelar tanpa mesin sendiri sehingga antrean dilempar sana-sini dan jersey baru tiba setelah turnamen selesai.",
              },
            ].map((item) => (
              <li
                key={item.num}
                className="border-t border-[#CBD5E1] dark:border-[#27272A] pt-5 space-y-2.5"
              >
                <span className="block text-xs font-mono font-semibold tabular-nums tracking-wider text-[#DC2626] dark:text-[#F87171]">
                  {item.num}
                </span>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA] leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#A1A1AA] leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Banner Promo Dinamis Carousel */}
      {bannerPromos.length > 0 && (
        <PromoBannerCarousel
          promos={bannerPromos}
          waNumber={whatsappNumber}
        />
      )}

      {/* 3. USP Section (Kenapa First Apparel) */}
      <section className="py-16 sm:py-24 border-b border-[#E2E8F0] dark:border-[#27272A] bg-[#FFFFFF] dark:bg-[#0C0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-animate="text-reveal" className="max-w-4xl mb-10 sm:mb-14 space-y-4">
            <p className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#475569] dark:text-[#A1A1AA]">
              <span className="w-5 h-[2px] bg-[#4D7C0F] dark:bg-[#84CC16] shrink-0" aria-hidden="true" />
              <span>Kenapa First Apparel</span>
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-[-0.035em] leading-[1.1] [text-wrap:balance] text-[#0F172A] dark:text-[#FAFAFA]">
              Kualitas Apparel Profesional untuk Performa Maksimal di Lapangan
              <span className="text-[#4D7C0F] dark:text-[#84CC16]">.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#A1A1AA] leading-relaxed max-w-2xl [text-wrap:pretty]">
              Kombinasi teknologi cetak modern, bahan kain pilihan, dan manajemen produksi mandiri dalam satu pintu.
            </p>
          </div>

          <ol
            data-animate="stagger-cards"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10"
          >
            {[
              {
                num: "01",
                title: "Sublimation Printing Tajam",
                description:
                  "Tinta meresap permanen ke dalam serat kain. Bebas gradasi warna tak terbatas, tidak menutup pori-pori kain, dan 100% anti-luntur.",
              },
              {
                num: "02",
                title: "Material Dry-Fit Premium",
                description:
                  "Pilihan kain Milano, Embos, Brazil, hingga Serena (130-160 gsm) yang ringan, sejuk, cepat kering, dan anti-bakteri saat berkeringat.",
              },
              {
                num: "03",
                title: "Produksi Mandiri & Tepat Waktu",
                description:
                  "Dikerjakan langsung di workshop CV Asika Multiguna Semesta tanpa lempar ke pihak ketiga, menjamin ketepatan jadwal pengiriman.",
              },
              {
                num: "04",
                title: "One-Stop Solution",
                description:
                  "Mulai dari konsultasi konsep, pembuatan mockup 3D, pola kerah custom, jahit rantai standar distro, hingga kemasan rapi per pemain.",
              },
            ].map((item) => (
              <li
                key={item.num}
                className="border-t border-[#CBD5E1] dark:border-[#27272A] pt-5 space-y-2.5"
              >
                <span className="block text-xs font-mono font-semibold tabular-nums tracking-wider text-[#4D7C0F] dark:text-[#84CC16]">
                  {item.num}
                </span>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA] leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#A1A1AA] leading-relaxed">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 3.5 Katalog Material Kain (Carousel 3 Berjejer + Zoom Detail) */}
      <FabricCatalogCarousel fabrics={activeFabrics} />

      {/* 4. Katalog Section (Carousel 3 Berjejer) */}
      <FeaturedCatalogCarousel
        catalogs={displayCatalogs}
        hasRealData={featuredCatalogs.length > 0}
      />

      {/* 5.5 Seksi Ulasan Pelanggan (Hanya Tampil Jika Ada Data Asli di Database) */}
      {activeReviews.length > 0 && (
        <section className="py-20 border-b border-[#27272A] bg-[#09090B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-animate="text-reveal" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
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

            <div data-animate="stagger-cards" className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <section id="alur" className="py-16 sm:py-24 border-b border-[#E2E8F0] dark:border-[#27272A] bg-[#F8FAFC] dark:bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-animate="text-reveal" className="max-w-4xl mb-10 sm:mb-14 space-y-4">
            <p className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#475569] dark:text-[#A1A1AA]">
              <span className="w-5 h-[2px] bg-[#4D7C0F] dark:bg-[#84CC16] shrink-0" aria-hidden="true" />
              <span>Cara Pesan</span>
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-[-0.035em] leading-[1.1] [text-wrap:balance] text-[#0F172A] dark:text-[#FAFAFA]">
              4 Tahap Mudah Pemesanan via WhatsApp
              <span className="text-[#4D7C0F] dark:text-[#84CC16]">.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#A1A1AA] leading-relaxed max-w-2xl [text-wrap:pretty]">
              Pemesanan langsung terhubung ke admin desainer profesional tanpa repot mengisi formulir web.
            </p>
          </div>

          <ol
            data-animate="stagger-cards"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10"
          >
            {[
              {
                num: "01",
                title: "Chat WA & Kirim Konsep",
                description:
                  "Pilih model dari katalog atau kirim gambar sketsa ide, warna, dan logo tim via WhatsApp.",
              },
              {
                num: "02",
                title: "Pratinjau Desain Digital",
                description:
                  "Tim desainer kami buatkan pratinjau visual jersey untuk disetujui bersama sebelum dicetak.",
              },
              {
                num: "03",
                title: "Produksi Sublimasi & Jahit",
                description:
                  "Setelah transfer DP pesanan masuk proses cetak sublimasi HD & penjahitan rapi 3-7 hari kerja.",
              },
              {
                num: "04",
                title: "Pengecekan Akhir & Kirim",
                description:
                  "Pemeriksaan ukuran dan nama punggung, pelunasan, lalu paket jersey dikirim aman ke alamat Anda.",
              },
            ].map((step) => (
              <li
                key={step.num}
                className="border-t border-[#CBD5E1] dark:border-[#27272A] pt-5 space-y-2.5"
              >
                <span className="block text-xs font-mono font-semibold tabular-nums tracking-wider text-[#4D7C0F] dark:text-[#84CC16]">
                  {step.num}
                </span>
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA] leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-[#475569] dark:text-[#A1A1AA] leading-relaxed">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <Link
              href="/cara-pesan"
              className="inline-flex items-center gap-2 min-h-[44px] px-6 py-3 rounded-full bg-white dark:bg-[#181920] border border-[#CBD5E1] dark:border-[#27272A] text-[#0F172A] dark:text-[#FAFAFA] text-xs sm:text-sm font-semibold hover:border-[#4D7C0F] dark:hover:border-[#84CC16]/50 hover:text-[#4D7C0F] dark:hover:text-[#84CC16] transition-colors"
            >
              <span>Pelajari Alur Lengkap, Panduan Ukuran &amp; Bahan</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6.5 Preview Blog */}
      {latestBlogs.length > 0 && (
        <section className="py-20 border-b border-[#27272A] bg-[#0C0D11]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-animate="text-reveal" className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
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

            <div data-animate="stagger-cards" className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                      sizes="(min-width: 768px) 33vw, 100vw"
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

      {/* 6.5 Pertanyaan yang Sering Ditanyakan (FAQ) */}
      <FaqSection />

      {/* 7. Spanduk CTA WhatsApp */}
      <section className="py-16 bg-[#09090B] border-b border-[#27272A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div data-animate="fade-up" className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-[#181A22] via-[#14151C] to-[#101116] border border-[#27272A] shadow-xl">
            <div data-animate="text-reveal" className="max-w-2xl text-center lg:text-left">
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

      {/* Seksi Mitra & Partner sebelum Footer */}
      {partnerList.length > 0 && (
      <section className="py-14 sm:py-16 border-b border-[#27272A] bg-[#0C0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-animate="text-reveal" className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA] text-balance">
              Dipercaya Komunitas & Tim Olahraga
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 leading-relaxed">
              Mulai dari tim esport, komunitas lari, hingga klub liga lokal telah mempercayakan produksi jersey tim kepada First Apparel.
            </p>
          </div>

          <div data-animate="stagger-cards" className="flex flex-wrap items-stretch justify-center gap-3.5 sm:gap-4 max-w-5xl mx-auto">
            {partnerList.map((partner) => {
              const content = (
                <div className="h-full px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-[#141418] border border-[#27272A] hover:border-[#84CC16]/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 text-left group">
                  <div className="h-12 min-w-[48px] max-w-[96px] px-1.5 rounded-xl bg-[#18181B] border border-[#27272A] flex items-center justify-center shrink-0 overflow-hidden">
                    {partner.logoUrl ? (
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        width={96}
                        height={44}
                        sizes="96px"
                        className="max-h-9 w-auto max-w-[84px] object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <span className="text-sm font-bold text-[#84CC16]">
                        {partner.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors leading-snug line-clamp-2">
                      {partner.name}
                    </span>
                    {partner.category && partner.category !== "MITRA LAINNYA" && (
                      <span className="block text-[11px] font-medium text-[#A1A1AA] mt-0.5 line-clamp-1">
                        {partner.category}
                      </span>
                    )}
                  </div>
                </div>
              );

              return partner.websiteUrl ? (
                <a
                  key={partner.id}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full max-w-[340px] sm:w-auto sm:min-w-[220px] sm:max-w-[300px]"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={partner.id}
                  className="w-full max-w-[340px] sm:w-auto sm:min-w-[220px] sm:max-w-[300px]"
                >
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}
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
