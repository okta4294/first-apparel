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
import { getSiteUrl } from "@/lib/site-url";
import {
  getSiteSettings,
  getActivePromos,
  getFeaturedCatalogs,
  getActivePartners,
  getActiveFabrics,
  getActiveReviews,
} from "@/lib/public-data";

export const instant = false;

const INITIAL_CATALOGS = [
  {
    id: 1,
    title: "Striker Volt Pro Series",
    category: "FUTSAL & SEPAK BOLA",
    description: "Dryfit Brazil Original • Mulai Rp 125.000 / pcs",
    imageUrl: "",
    sizeChartUrl: null as string | null,
  },
  {
    id: 2,
    title: "Cyber Pulse Apex Pro",
    category: "ESPORTS PRO",
    description: "Dryfit Milano • Mulai Rp 135.000 / pcs",
    imageUrl: "",
    sizeChartUrl: null as string | null,
  },
  {
    id: 3,
    title: "Aero Glide Ultralight Series",
    category: "RUNNING & CYCLING",
    description: "Micro Mesh • Mulai Rp 115.000 / pcs",
    imageUrl: "",
    sizeChartUrl: null as string | null,
  },
  {
    id: 4,
    title: "Official Team Coach Jacket",
    category: "COACH & APPAREL JAKET",
    description: "Taslan Parasut • Mulai Rp 175.000 / pcs",
    imageUrl: "",
    sizeChartUrl: null as string | null,
  },
];

const FIELD_PROBLEMS = [
  {
    num: "01",
    title: "Warna jersey tidak sesuai dan cepat luntur",
    description:
      "Baru dicuci 2-3 kali, warna jersey sudah kusam itu karena tinta murah dan kualitas cetakan tidak terjaga",
  },
  {
    num: "02",
    title: "Bahan panas dan bikin gerah",
    description:
      "Kain jersey kaku yang tidak menyerap keringat, bikin gerah, membuat tidak nyaman bergerak di cuaca terik dan bau saat dipakai",
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
      "Vendor hanya makelar tanpa mesin sendiri sehingga antrean dilempar sana-sini dan jersey baru tiba setelah event selesai.",
  },
];

const WORKSHOP_STANDARDS = [
  {
    num: "01",
    title: "Sublimation Menggunakan Printer Epson",
    description:
      "Menggunakan tinta original Epson made in Japan sehingga meresap permanen ke dalam serat kain. Bebas gradasi warna tak terbatas, tidak menutup pori-pori kain, dan 100% anti-luntur.",
  },
  {
    num: "02",
    title: "Material Dry-Fit Premium",
    description:
      "Ada 9 pilihan kain dry-fit mulai dari Milano, Embosh, hingga jacquard dengan berbagai motif yang ringan, sejuk, cepat kering, dan anti-bakteri saat berkeringat.",
  },
  {
    num: "03",
    title: "Produksi Mandiri & Tepat Waktu",
    description:
      "Dikerjakan langsung di workshop First Apparel tanpa lempar ke pihak ketiga, menjamin ketepatan jadwal pengiriman.",
  },
  {
    num: "04",
    title: "One-Stop Solution",
    description:
      "Mulai dari konsultasi konsep, pembuatan mockup 3D, pola kerah custom, jahit standart apparel internasional, hingga kemasan rapi per produk.",
  },
];

const ORDER_STEPS = [
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
      "Setelah transfer DP pesanan masuk proses cetak & penjahitan rapi 3-10 hari kerja sesuai kesepakatan pemesanan",
  },
  {
    num: "04",
    title: "Pengecekan Akhir & Kirim",
    description:
      "Pemeriksaan ukuran dan nama punggung, pelunasan, lalu paket jersey dikirim aman ke alamat Anda.",
  },
];

export default async function HomePage() {
  const [
    settings,
    activePromos,
    featuredCatalogs,
    partnerList,
    activeFabrics,
    activeReviews,
  ] = await Promise.all([
    getSiteSettings(),
    getActivePromos(),
    getFeaturedCatalogs(),
    getActivePartners(),
    getActiveFabrics(),
    getActiveReviews(),
  ]);

  const {
    storeName,
    storeAddress,
    operatingHours,
    whatsappNumber,
    defaultWaText,
    instagramUrl,
    logoUrl,
    storeDescription,
    heroTitle,
    heroTitleHighlight,
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
    ...(logoUrl ? { image: logoUrl, logo: logoUrl } : {}),
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

  const heroWaHref = getWaLink(
    "Halo Admin First Apparel, saya ingin mulai konsultasi pembuatan custom jersey untuk tim saya."
  );

  return (
    <div className="min-h-screen bg-[#0B100D] text-[#F4F3EE] flex flex-col selection:bg-[#84CC16] selection:text-[#0B100D]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <a
        href="#utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-[#84CC16] focus:text-[#0B100D] focus:text-sm focus:font-bold"
      >
        Langsung ke konten utama
      </a>

      {/* 1. Navbar */}
      <Navbar
        waNumber={whatsappNumber}
        storeName={storeName}
        companyName={settings.companyName}
        logoUrl={logoUrl}
      />

      {/* Pop-up Promo Otomatis (Jika Diaktifkan Admin) */}
      <PromoPopup promos={popupPromos} waNumber={whatsappNumber} />

      <main id="utama" className="flex-1">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden border-b border-[#222E26] bg-[#0B100D] lg:min-h-[560px] xl:min-h-[620px] flex flex-col-reverse lg:flex-row lg:items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 pt-4 pb-10 sm:pt-6 sm:pb-14 lg:py-20">
            {/* Info Kiri */}
            <div className="lg:w-[48%] space-y-6 fa-hero-enter">
              <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl lg:text-[52px] font-extrabold tracking-[-0.035em] leading-[1.08] [text-wrap:balance] text-[#F4F3EE]">
                {heroTitle}
                {heroTitleHighlight ? (
                  <>
                    {" "}
                    <span className="text-[#84CC16]">{heroTitleHighlight}</span>
                  </>
                ) : null}
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[#A4B0A8] leading-relaxed max-w-[48ch] [text-wrap:pretty]">
                {storeDescription}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <a
                  href={heroWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3.5 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] text-[#0B100D] font-bold text-xs sm:text-sm tracking-wide transition-all active:scale-[0.98]"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                  <span>Mulai Konsultasi via WhatsApp</span>
                </a>
                <Link
                  href="#katalog"
                  className="inline-flex items-center justify-center gap-2 min-h-[48px] px-7 py-3.5 rounded-lg bg-[#141B17]/90 backdrop-blur-sm border border-[#28352D] text-[#F4F3EE] font-semibold text-xs sm:text-sm tracking-wide hover:border-[#84CC16]/60 hover:bg-[#19211C] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#A3E635] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>Lihat Katalog Model</span>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-[#222E26]">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums leading-none text-[#F4F3EE]">
                    100.000<span className="text-[#84CC16]">+</span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#95A39A] font-medium mt-1.5 leading-snug">
                    Jersey Terproduksi
                  </p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums leading-none text-[#A3E635]">
                    100%
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#95A39A] font-medium mt-1.5 leading-snug">
                    Garansi Tepat Waktu
                  </p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold tracking-tight tabular-nums leading-none text-[#E59A3C]">
                    100%
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#95A39A] font-medium mt-1.5 leading-snug">
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
        <section className="py-20 sm:py-28 bg-[#191714] border-b border-[#2E2A24]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.035em] leading-[1.1] [text-wrap:balance] text-[#F4F3EE]">
                  Pernah kecewa pesan jersey tim karena 4 masalah klasik ini
                  <span className="text-[#E59A3C]">?</span>
                </h2>
                <p className="text-sm sm:text-base text-[#B5AEA4] leading-relaxed [text-wrap:pretty]">
                  Semua produksi First Apparel dikerjakan di workshop sendiri dengan kontrol kualitas per potong agar semangat tim dan jadwal acara tetap terjaga.
                </p>
              </div>

              <ol className="lg:col-span-7 divide-y divide-[#2E2A24] border-t border-b border-[#2E2A24]">
                {FIELD_PROBLEMS.map((item) => (
                  <li
                    key={item.num}
                    className="py-6 flex items-start gap-5"
                  >
                    <span className="font-mono text-sm font-bold tabular-nums text-[#E59A3C] pt-1 shrink-0">
                      {item.num}
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="font-[family-name:var(--font-display)] text-base sm:text-lg font-bold tracking-[-0.015em] text-[#F4F3EE] leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-[15px] text-[#B5AEA4] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
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

        {/* 3. USP Section (Kenapa First Apparel) */}
        <section className="py-20 sm:py-28 bg-[#14291C] text-[#F4F3EE] border-y border-[#234530]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.035em] leading-[1.1] [text-wrap:balance] text-[#F4F3EE]">
                  Kualitas Apparel Profesional untuk Performa Maksimal di Lapangan dan Acara Eventmu
                </h2>
                <p className="text-sm sm:text-base text-[#C4D3C8] leading-relaxed max-w-[44ch] [text-wrap:pretty]">
                  Kombinasi teknologi cetak modern, bahan kain pilihan, dan manajemen produksi mandiri dalam satu pintu.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[#234530]">
                {WORKSHOP_STANDARDS.map((item) => (
                  <div
                    key={item.num}
                    className="p-6 sm:p-8 border-r border-b border-[#234530] space-y-3"
                  >
                    <span className="block font-mono text-xs font-semibold tabular-nums text-[#84CC16]">
                      {item.num}
                    </span>
                    <h3 className="font-[family-name:var(--font-display)] text-base sm:text-lg font-bold tracking-[-0.02em] text-[#F4F3EE] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-[#C4D3C8] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3.5 Katalog Material Kain (Carousel 3 Berjejer + Zoom Detail) */}
        <FabricCatalogCarousel fabrics={activeFabrics} />

        {/* 4. Katalog Section (Carousel 3 Berjejer) */}
        <FeaturedCatalogCarousel
          catalogs={displayCatalogs.slice(0, 5)}
          hasRealData={featuredCatalogs.length > 0}
        />

        {/* 5.5 Seksi Ulasan Pelanggan (Hanya Tampil Jika Ada Data Asli di Database) */}
        {activeReviews.length > 0 && (
          <section className="py-20 sm:py-28 bg-[#191714] border-y border-[#2E2A24]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-2 max-w-2xl">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] text-[#F4F3EE]">
                    Kata Pelanggan Tentang Hasil Produksi Kami
                  </h2>
                  <p className="text-sm sm:text-base text-[#B5AEA4]">
                    Penilaian langsung dari tim dan komunitas yang sudah memesan jersey di {storeName}.
                  </p>
                </div>

                {averageRating !== null && (
                  <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#221F1B] border border-[#353029] self-start md:self-auto">
                    <div className="flex items-center gap-0.5" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(averageRating)
                              ? "text-[#E59A3C] fill-[#E59A3C]"
                              : "text-[#3D3831] fill-transparent"
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
                    <span className="text-sm font-bold text-[#F4F3EE] tabular-nums">
                      {averageRating} / 5 ({activeReviews.length} ulasan)
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-xl bg-[#221F1B] border border-[#353029] p-6 sm:p-7 flex flex-col justify-between gap-6"
                  >
                    <div className="space-y-4">
                      <div
                        className="flex items-center gap-0.5"
                        aria-label={`Rating ${review.rating} dari 5 bintang`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-[#E59A3C] fill-[#E59A3C]"
                                : "text-[#3D3831] fill-transparent"
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
                      <p className="text-[15px] text-[#E6E2DC] leading-relaxed">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#322E27]">
                      <p className="text-sm font-bold text-[#F4F3EE]">
                        {review.customerName}
                      </p>
                      {(review.teamOrRole || review.productName) && (
                        <p className="text-xs text-[#B5AEA4] mt-0.5">
                          {[review.teamOrRole, review.productName]
                            .filter(Boolean)
                            .join(" • ")}
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
        <section id="alur" className="py-20 sm:py-28 bg-[#0B100D] border-b border-[#222E26] scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
              <div className="max-w-2xl space-y-3">
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-[-0.035em] leading-[1.1] [text-wrap:balance] text-[#F4F3EE]">
                  4 Tahap Mudah Pemesanan via WhatsApp
                </h2>
                <p className="text-sm sm:text-base text-[#A4B0A8] leading-relaxed [text-wrap:pretty]">
                  Pemesanan langsung terhubung ke admin desainer profesional tanpa repot mengisi formulir web.
                </p>
              </div>

              <Link
                href="/cara-pesan"
                className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#141B17] border border-[#28352D] text-[#F4F3EE] text-xs sm:text-sm font-semibold hover:border-[#84CC16] hover:text-[#A3E635] transition-colors self-start lg:self-auto shrink-0"
              >
                <span>Panduan Lengkap, Ukuran &amp; Bahan</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {ORDER_STEPS.map((step) => (
                <li
                  key={step.num}
                  className="pt-5 border-t-2 border-[#84CC16] space-y-3"
                >
                  <span className="block font-[family-name:var(--font-display)] text-2xl font-extrabold tabular-nums text-[#A3E635]">
                    {step.num}
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-base sm:text-lg font-bold tracking-[-0.015em] text-[#F4F3EE] leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-[#A4B0A8] leading-relaxed">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6.5 Pertanyaan yang Sering Ditanyakan (FAQ) */}
        <FaqSection variant="editorial" waHref={heroWaHref} />

        {/* 7. Spanduk CTA WhatsApp */}
        <section className="py-16 sm:py-20 bg-[#14291C] border-y border-[#234530]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl text-center lg:text-left space-y-2.5">
                <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#F4F3EE]">
                  Siap Produksi Jersey Tim Anda?
                </h2>
                <p className="text-sm sm:text-base text-[#C4D3C8] leading-relaxed">
                  Konsultasikan konsep desain gratis dan dapatkan penawaran harga spesial untuk tim atau komunitas Anda langsung di WhatsApp.
                </p>
              </div>
              <a
                href={getWaLink(
                  "Halo Admin First Apparel, saya ingin berkonsultasi konsep desain dan penawaran harga khusus tim."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-7 py-3.5 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] text-[#0B100D] font-bold text-sm tracking-wide transition-all active:scale-[0.98] shrink-0"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Chat WhatsApp Admin Sekarang →</span>
              </a>
            </div>
          </div>
        </section>

        {/* Seksi Mitra & Partner sebelum Footer */}
        {partnerList.length > 0 && (
          <section className="py-16 sm:py-20 bg-[#0B100D]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#F4F3EE] [text-wrap:balance]">
                  Dipercaya Komunitas &amp; Tim Olahraga
                </h2>
                <p className="text-xs sm:text-sm text-[#A4B0A8] leading-relaxed">
                  Mulai dari tim esport, komunitas lari, hingga klub liga lokal telah mempercayakan produksi jersey tim kepada First Apparel.
                </p>
              </div>

              <div className="flex flex-wrap items-stretch justify-center gap-3.5 sm:gap-4 max-w-5xl mx-auto">
                {partnerList.map((partner) => {
                  const content = (
                    <div className="h-full px-4 py-3 sm:px-5 sm:py-3.5 rounded-xl bg-[#141B17] border border-[#26332B] hover:border-[#84CC16]/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3.5 text-left group">
                      <div className="h-12 min-w-[48px] max-w-[96px] px-1.5 rounded-lg bg-[#0B100D] border border-[#222E26] flex items-center justify-center shrink-0 overflow-hidden">
                        {partner.logoUrl ? (
                          <Image
                            src={partner.logoUrl}
                            alt={partner.name}
                            width={96}
                            height={44}
                            sizes="96px"
                            className="w-auto h-auto max-h-9 max-w-[84px] object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <span className="font-[family-name:var(--font-display)] text-sm font-extrabold text-[#A3E635]">
                            {partner.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#F4F3EE] group-hover:text-[#A3E635] transition-colors leading-snug line-clamp-2">
                          {partner.name}
                        </span>
                        {partner.category && partner.category !== "MITRA LAINNYA" && (
                          <span className="block text-[11px] font-medium text-[#95A39A] mt-0.5 line-clamp-1">
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
      <Footer />

      {/* Bar Aksi Cepat WhatsApp di Mobile Saat Scroll */}
      <MobileWaFab waHref={heroWaHref} />
    </div>
  );
}
