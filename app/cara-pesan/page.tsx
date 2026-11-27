import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SizeChartDisplay } from "@/components/size-chart-display";
import { OrderTemplateCard } from "@/components/order-template-card";
import { FaqSection } from "@/components/faq-section";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { getSiteSettings, getActiveFabrics } from "@/lib/public-data";

const quickNavLinks = [
  { href: "#alur-pemesanan", label: "Tahapan Order" },
  { href: "#format-order", label: "Format Chat" },
  { href: "#panduan-ukuran", label: "Tabel Ukuran" },
  { href: "#panduan-desain", label: "File & Logo" },
  { href: "#pilihan-bahan", label: "Pilihan Bahan" },
  { href: "#faq", label: "Tanya Jawab" },
];

const orderSteps = [
  {
    number: "01",
    title: "Kirim ide desain atau referensi",
    meta: "Gratis desain",
    description:
      "Hubungi admin lewat WhatsApp dengan membawa sketsa tangan, foto referensi, file desain sendiri, atau model pilihan dari katalog. Sampaikan warna utama, logo tim, pilihan kerah (O-neck, V-neck, atau Polo), dan sponsor yang ingin dipasang.",
  },
  {
    number: "02",
    title: "Pratinjau mockup dan revisi",
    meta: "Revisi sampai cocok",
    description:
      "Desainer kami membuat pratinjau digital tampak depan, belakang, dan samping. Periksa posisi logo, gaya huruf nama, dan proporsi nomor punggung. Kalau ada bagian yang belum pas, kami ubah sampai Anda setuju untuk naik cetak.",
  },
  {
    number: "03",
    title: "Rekap data pemain dan DP 50%",
    meta: "Jadwal produksi dikunci",
    description:
      "Setelah desain disetujui, kirim daftar nama punggung, nomor, ukuran baju, dan jenis bahan yang dipilih. Jadwal produksi dikunci setelah pembayaran DP 50% sesuai invoice resmi rekening toko.",
    subItems: [
      {
        label: "Rekap pemain",
        detail: "Gunakan template rekap di bawah agar ejaan nama dan nomor punggung tidak keliru.",
      },
      {
        label: "Invoice resmi",
        detail: "Pembayaran hanya dilakukan ke rekening atas nama toko yang tertera di invoice.",
      },
    ],
  },
  {
    number: "04",
    title: "Cetak sublimasi, potong pola, dan jahit",
    meta: "3–7 hari kerja",
    description:
      "Pesanan masuk ke workshop untuk cetak sublimasi full print, pemotongan pola kain, dan penjahitan. Setiap baju diperiksa satu per satu untuk memastikan nama, nomor, dan jahitan sesuai rekap.",
  },
  {
    number: "05",
    title: "Foto hasil jadi, pelunasan, dan kirim",
    meta: "Garansi salah produksi",
    description:
      "Kami kirim foto dan video jersey yang sudah selesai dikemas. Setelah sisa pembayaran dilunasi, paket dikirim lewat JNE, J&T, SiCepat, Lion Parcel, atau kargo untuk pesanan partai besar beserta nomor resinya.",
  },
];

const placementGuides = [
  { num: "1", label: "Logo dada kiri", spec: "8 × 8 cm, sejajar dada" },
  { num: "2", label: "Logo dada kanan / sponsor", spec: "maksimal 10 × 6 cm" },
  { num: "3", label: "Logo lengan", spec: "6 × 6 cm, opsional" },
  { num: "4", label: "Nama punggung", spec: "huruf kapital, tinggi sekitar 5 cm" },
  { num: "5", label: "Nomor punggung", spec: "25 × 20 cm, huruf tebal" },
];

export const metadata = {
  title: "Alur & Cara Pemesanan Custom Jersey | First Apparel",
  description:
    "Panduan langkah pemesanan jersey custom di First Apparel via WhatsApp, lengkap dengan format chat, tabel ukuran, standar file desain, dan pilihan bahan dryfit.",
};

export const instant = false;

export default async function CaraPesanPage() {
  const [settings, fabricList] = await Promise.all([
    getSiteSettings(),
    getActiveFabrics(),
  ]);

  const {
    storeName,
    whatsappNumber,
    logoUrl,
    sizeChartUrl,
  } = settings;

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin konsultasi dan mulai pesan custom jersey untuk tim saya.`
  )}`;

  const waExpressHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya sudah punya file desain siap cetak dan ingin tanya slot express.`
  )}`;

  return (
    <div className="min-h-screen bg-[#0B100D] text-[#F4F3EE] flex flex-col selection:bg-[#84CC16] selection:text-[#0B100D]">
      <a
        href="#utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-[#84CC16] focus:text-[#0B100D] focus:text-sm focus:font-bold"
      >
        Langsung ke panduan pemesanan
      </a>

      <Navbar
        waNumber={whatsappNumber}
        storeName={storeName}
        companyName={settings.companyName}
        logoUrl={logoUrl}
      />

      <main id="utama" className="flex-1">
        {/* Hero */}
        <section className="border-b border-[#222E26] bg-[#0B100D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 sm:pt-16 sm:pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start fa-hero-enter">
              <div className="lg:col-span-7 space-y-4">
                <p className="text-sm font-semibold text-[#A3E635]">
                  Panduan produksi &amp; pemesanan
                </p>
                <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] text-[#F4F3EE] leading-[1.06] [text-wrap:balance]">
                  Cara pesan jersey custom di {storeName}
                </h1>
                <p className="text-base text-[#A4B0A8] max-w-[54ch] leading-relaxed">
                  Semua proses dilakukan langsung lewat WhatsApp tanpa perlu membuat akun. Kirim referensi atau logo tim Anda, kami buatkan mockup digital sampai cocok sebelum masuk produksi.
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center gap-2.5 px-6 py-3 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] text-[#0B100D] text-sm font-bold transition-all active:scale-[0.98]"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                    <span>Konsultasi via WhatsApp</span>
                  </a>
                  <Link
                    href="/katalog"
                    className="inline-flex min-h-[48px] items-center gap-2 px-5 py-3 rounded-lg bg-[#141B17] border border-[#28352D] text-[#F4F3EE] text-sm font-semibold hover:border-[#84CC16] hover:text-[#A3E635] transition-colors"
                  >
                    <span>Lihat Katalog Model</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              {/* Ringkasan Praktis Produksi */}
              <div className="lg:col-span-5 rounded-xl bg-[#14291C] border border-[#234530] p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A3E635] mb-4">
                  Ringkasan produksi
                </p>
                <dl className="divide-y divide-[#234530] text-sm">
                  <div className="pb-3.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#C4D3C8]">Pengerjaan reguler</dt>
                    <dd className="font-semibold text-[#F4F3EE] text-right tabular-nums">3–7 hari kerja</dd>
                  </div>
                  <div className="py-3.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#C4D3C8]">Minimal order</dt>
                    <dd className="font-semibold text-[#F4F3EE] text-right">Satuan hingga partai besar</dd>
                  </div>
                  <div className="py-3.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#C4D3C8]">Sistem pembayaran</dt>
                    <dd className="font-semibold text-[#F4F3EE] text-right">DP 50%, lunas saat jadi</dd>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <dt className="font-semibold text-[#F4F3EE]">Sudah punya file siap cetak?</dt>
                      <dd className="text-xs text-[#C4D3C8] mt-0.5">Tersedia slot express 3–5 hari kerja.</dd>
                    </div>
                    <a
                      href={waExpressHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#A3E635] hover:text-[#BEF264] hover:underline whitespace-nowrap shrink-0"
                    >
                      Kirim file via WA →
                    </a>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Navigasi Lompat Seksi */}
          <nav
            aria-label="Navigasi bagian halaman cara pesan"
            className="border-t border-[#222E26] bg-[#121815]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ul className="flex items-center gap-6 sm:gap-8 overflow-x-auto py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {quickNavLinks.map((link) => (
                  <li key={link.href} className="shrink-0">
                    <a
                      href={link.href}
                      className="inline-flex py-1 text-sm font-medium text-[#A4B0A8] transition-colors hover:text-[#A3E635] focus-visible:text-[#A3E635] focus-visible:outline-none"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </section>

        {/* 1. Tahapan Pemesanan */}
        <section id="alur-pemesanan" className="py-20 sm:py-28 bg-[#121815] border-b border-[#222E26] scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4 self-start space-y-3">
                <p className="text-sm font-medium text-[#A3E635]">
                  Alur kerja workshop
                </p>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.08] text-[#F4F3EE]">
                  5 tahap dari chat sampai kirim
                </h2>
                <p className="text-base text-[#A4B0A8] leading-relaxed">
                  Alur ini berlaku untuk pesanan satuan maupun satu tim. Anda selalu menerima pratinjau desain dan foto hasil jadi sebelum barang dikirim.
                </p>
                <div className="pt-2">
                  <Link
                    href="/katalog"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A3E635] underline decoration-[#84CC16]/60 underline-offset-4 hover:text-[#BEF264] transition-colors"
                  >
                    <span>Lihat referensi model di katalog</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <ol className="lg:col-span-8 divide-y divide-[#222E26] border-t border-b border-[#222E26]">
                {orderSteps.map((step) => (
                  <li key={step.number} className="py-6 sm:py-8 flex gap-5 sm:gap-6">
                    <span className="font-mono text-sm font-bold text-[#84CC16] pt-1 w-7 shrink-0 tabular-nums">
                      {step.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold tracking-[-0.015em] text-[#F4F3EE]">
                          {step.title}
                        </h3>
                        <span className="text-xs font-semibold text-[#E59A3C]">
                          {step.meta}
                        </span>
                      </div>
                      <p className="mt-2.5 text-[15px] text-[#A4B0A8] leading-relaxed">
                        {step.description}
                      </p>

                      {step.subItems && (
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#222E26]">
                          {step.subItems.map((sub) => (
                            <div key={sub.label}>
                              <span className="block text-sm font-semibold text-[#F4F3EE]">
                                {sub.label}
                              </span>
                              <p className="mt-1 text-sm text-[#95A39A] leading-relaxed">
                                {sub.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 2. Format Chat Siap Salin (Pita Kontras Hijau Hutan) */}
        <section id="format-order" className="py-20 sm:py-24 border-b border-[#234530] bg-[#14291C] scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <OrderTemplateCard waNumber={whatsappNumber} storeName={storeName} />
          </div>
        </section>

        {/* 3. Panduan Ukuran */}
        <section id="panduan-ukuran" className="py-20 sm:py-28 border-b border-[#222E26] bg-[#0B100D] scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 space-y-2.5">
              <p className="text-sm font-medium text-[#A3E635]">
                Patokan ukuran jersey
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.08] text-[#F4F3EE]">
                Tabel ukuran standar {storeName}
              </h2>
              <p className="text-base text-[#A4B0A8] leading-relaxed">
                Cocokkan lebar dada dan panjang baju dengan tabel di bawah sebelum mengumpulkan data ukuran pemain.
              </p>
            </div>

            <SizeChartDisplay
              imageUrl={sizeChartUrl}
              waNumber={whatsappNumber}
              storeName={storeName}
            />
          </div>
        </section>

        {/* 4. Panduan File Desain & Penempatan Logo (Latar Hangat Charcoal-Umber) */}
        <section id="panduan-desain" className="py-20 sm:py-28 border-b border-[#2E2A24] bg-[#191714] scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-12 space-y-2.5">
              <p className="text-sm font-semibold text-[#E59A3C]">
                Standar cetak sublimasi
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.08] text-[#F4F3EE]">
                Standar file desain dan posisi logo
              </h2>
              <p className="text-base text-[#B5AEA4] leading-relaxed">
                Belum punya file desain? Cukup kirim sketsa atau foto referensi. Jika sudah punya file sendiri, ikuti patokan ini supaya hasil cetak tidak pecah.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Spesifikasi File */}
              <div className="lg:col-span-5">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#F4F3EE] mb-4">
                  Format file yang kami terima
                </h3>
                <ol className="divide-y divide-[#2E2A24] border-t border-b border-[#2E2A24] text-sm">
                  <li className="py-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-[#F4F3EE]">File vektor</span>
                      <span className="text-xs font-semibold text-[#E59A3C]">Paling disarankan</span>
                    </div>
                    <p className="mt-1.5 text-sm text-[#B5AEA4] leading-relaxed">
                      Format <span className="font-mono text-[#F4F3EE]">.AI</span>,{" "}
                      <span className="font-mono text-[#F4F3EE]">.EPS</span>,{" "}
                      <span className="font-mono text-[#F4F3EE]">.PDF</span>,{" "}
                      <span className="font-mono text-[#F4F3EE]">.CDR</span>, atau{" "}
                      <span className="font-mono text-[#F4F3EE]">.SVG</span>. Hasil cetak tetap tajam di ukuran baju mana pun.
                    </p>
                  </li>
                  <li className="py-5">
                    <span className="block font-semibold text-[#F4F3EE]">Gambar transparan</span>
                    <p className="mt-1.5 text-sm text-[#B5AEA4] leading-relaxed">
                      Format <span className="font-mono text-[#F4F3EE]">.PNG</span> tanpa latar belakang, minimal 300 DPI. Hindari tangkapan layar dari media sosial karena tepi logo akan pecah saat dicetak.
                    </p>
                  </li>
                  <li className="py-5">
                    <span className="block font-semibold text-[#F4F3EE]">Font dan file besar</span>
                    <p className="mt-1.5 text-sm text-[#B5AEA4] leading-relaxed">
                      Ubah teks menjadi <em>outline</em> atau sertakan file font asli. Jika ukuran file di atas 25 MB, kirim lewat tautan Google Drive atau WeTransfer.
                    </p>
                  </li>
                </ol>

                <div className="mt-6">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Halo Admin ${storeName}, saya ingin mengirim file desain jersey tim. Berikut tautan filenya: `
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E59A3C] underline decoration-[#E59A3C]/60 underline-offset-4 hover:text-[#F2B366] transition-colors"
                  >
                    <span>Kirim file desain ke admin</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              {/* Peta Penempatan Logo */}
              <div className="lg:col-span-7 rounded-xl bg-[#221F1B] border border-[#353029] p-6 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#F4F3EE]">
                    Acuan posisi logo dan nomor
                  </h3>
                  <span className="text-xs text-[#B5AEA4]">
                    Posisi final dikunci saat mockup disetujui
                  </span>
                </div>

                <div className="rounded-lg bg-[#161411] border border-[#2E2A24] p-4">
                  <svg
                    viewBox="0 0 320 210"
                    role="img"
                    aria-labelledby="peta-logo-title"
                    className="mx-auto h-auto w-full max-w-sm text-[#8F887E]"
                  >
                    <title id="peta-logo-title">
                      Peta penempatan logo dada, lengan, nama, dan nomor punggung pada jersey
                    </title>

                    <path
                      d="M 46 46 L 30 52 L 16 86 L 34 94 L 34 178 Q 80 188 126 178 L 126 94 L 144 86 L 130 52 L 114 46 Q 80 60 46 46 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path d="M 80 62 L 80 180" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4" opacity="0.4" />

                    <path
                      d="M 206 46 L 190 52 L 176 86 L 194 94 L 194 178 Q 240 188 286 178 L 286 94 L 304 86 L 290 52 L 274 46 Q 240 54 206 46 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />

                    <g fontSize="10" fontWeight="700" textAnchor="middle">
                      <circle cx="104" cy="82" r="8.5" fill="#84CC16" />
                      <text x="104" y="85.5" fill="#0B100D">1</text>

                      <circle cx="58" cy="82" r="8.5" fill="#84CC16" />
                      <text x="58" y="85.5" fill="#0B100D">2</text>

                      <circle cx="31" cy="72" r="8.5" fill="#84CC16" />
                      <text x="31" y="75.5" fill="#0B100D">3</text>

                      <circle cx="240" cy="96" r="8.5" fill="#E59A3C" />
                      <text x="240" y="99.5" fill="#0B100D">4</text>

                      <circle cx="240" cy="140" r="8.5" fill="#E59A3C" />
                      <text x="240" y="143.5" fill="#0B100D">5</text>
                    </g>

                    <g fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.85">
                      <text x="80" y="200">Tampak Depan</text>
                      <text x="240" y="200">Tampak Belakang</text>
                    </g>
                  </svg>
                </div>

                <ol className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                  {placementGuides.map((item) => (
                    <li key={item.num} className="flex items-baseline gap-2.5">
                      <span className="font-mono font-bold text-[#84CC16] w-4 shrink-0">
                        {item.num}.
                      </span>
                      <span className="text-[#B5AEA4] leading-relaxed">
                        <strong className="font-semibold text-[#F4F3EE]">{item.label}:</strong>{" "}
                        {item.spec}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Pilihan Bahan Kain */}
        <section id="pilihan-bahan" className="py-20 sm:py-28 bg-[#121815] border-b border-[#222E26] scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10 space-y-2.5">
              <p className="text-sm font-medium text-[#A3E635]">
                Spesifikasi kain olahraga
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.08] text-[#F4F3EE]">
                Pilihan bahan dryfit
              </h2>
              <p className="text-base text-[#A4B0A8] leading-relaxed">
                Tiap kain punya pori, tekstur, dan bobot berbeda. Sesuaikan dengan cabang olahraga dan kenyamanan tim Anda.
              </p>
            </div>

            {fabricList.length === 0 ? (
              <div className="py-10 border-t border-b border-[#222E26] text-base text-[#A4B0A8]">
                Daftar bahan sedang diperbarui. Hubungi admin lewat WhatsApp untuk menanyakan stok kain yang tersedia.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#222E26]">
                {fabricList.map((item) => (
                  <article
                    key={item.id}
                    className="p-6 sm:p-7 border-r border-b border-[#222E26] bg-[#141B17] flex flex-col space-y-2.5"
                  >
                    <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#F4F3EE]">
                      {item.name}
                    </h3>
                    <p className="text-[15px] text-[#A4B0A8] leading-relaxed">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 6. Tanya Jawab */}
        <FaqSection variant="editorial" waHref={waHref} />
      </main>

      <Footer showClosingCta />
    </div>
  );
}
