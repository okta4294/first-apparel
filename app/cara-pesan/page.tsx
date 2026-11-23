import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageMotion } from "@/components/motion-provider";
import { SizeChartDisplay } from "@/components/size-chart-display";
import { OrderTemplateCard } from "@/components/order-template-card";
import { FaqSection } from "@/components/faq-section";
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
    storeAddress,
    googleMapsUrl,
    operatingHours,
    whatsappNumber,
    defaultWaText,
    instagramUrl,
    logoUrl,
    sizeChartUrl,
    storeDescription,
  } = settings;

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin konsultasi dan mulai pesan custom jersey untuk tim saya.`
  )}`;

  const waExpressHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya sudah punya file desain siap cetak dan ingin tanya slot express.`
  )}`;

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      <PageMotion />
      <Navbar waNumber={whatsappNumber} storeName={storeName} companyName={settings.companyName} logoUrl={logoUrl} />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-[#27272A] bg-[#0C0D11]">
          <div
            data-animate="hero"
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 sm:pt-16 sm:pb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-7">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FAFAFA] leading-[1.1] text-balance">
                  Cara pesan jersey custom di {storeName}
                </h1>
                <p className="mt-4 text-sm sm:text-base text-[#A1A1AA] max-w-xl leading-relaxed">
                  Semua proses dilakukan langsung lewat WhatsApp tanpa perlu membuat akun. Kirim referensi atau logo tim Anda, kami buatkan mockup digital sampai cocok sebelum masuk produksi.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 px-6 py-2.5 rounded-full bg-[#84CC16] text-[#09090B] text-sm font-bold transition-colors hover:bg-[#9ee238] active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
                    </svg>
                    <span>Chat Admin di WhatsApp</span>
                  </a>
                  <Link
                    href="/katalog"
                    className="inline-flex min-h-11 items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#141418] border border-[#27272A] text-[#FAFAFA] text-sm font-semibold hover:border-[#84CC16]/50 hover:text-[#84CC16] transition-colors"
                  >
                    <span>Lihat Katalog</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              {/* Ringkasan Praktis Produksi */}
              <div className="lg:col-span-5 rounded-2xl bg-[#141418] border border-[#27272A] p-5 sm:p-6">
                <dl className="divide-y divide-[#27272A] text-sm">
                  <div className="pb-3.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#A1A1AA]">Pengerjaan reguler</dt>
                    <dd className="font-semibold text-[#FAFAFA] text-right">3–7 hari kerja</dd>
                  </div>
                  <div className="py-3.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#A1A1AA]">Minimal order</dt>
                    <dd className="font-semibold text-[#FAFAFA] text-right">Satuan hingga partai besar</dd>
                  </div>
                  <div className="py-3.5 flex items-baseline justify-between gap-4">
                    <dt className="text-[#A1A1AA]">Sistem pembayaran</dt>
                    <dd className="font-semibold text-[#FAFAFA] text-right">DP 50%, lunas saat jadi</dd>
                  </div>
                  <div className="pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <dt className="font-semibold text-[#FAFAFA]">Sudah punya file siap cetak?</dt>
                      <dd className="text-xs text-[#A1A1AA] mt-0.5">Tersedia slot express 3–5 hari kerja.</dd>
                    </div>
                    <a
                      href={waExpressHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#84CC16] hover:underline whitespace-nowrap shrink-0"
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
            className="border-t border-[#27272A] bg-[#09090B]"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <ul className="flex items-center gap-5 sm:gap-7 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {quickNavLinks.map((link) => (
                  <li key={link.href} className="shrink-0">
                    <a
                      href={link.href}
                      className="inline-flex py-1 text-xs sm:text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#FAFAFA] focus-visible:text-[#84CC16] focus-visible:outline-none"
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
        <section id="alur-pemesanan" className="py-16 sm:py-20 border-b border-[#27272A] scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              <div data-animate="text-reveal" className="lg:col-span-4 lg:sticky lg:top-28 self-start">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
                  5 tahap dari chat sampai kirim
                </h2>
                <p className="text-sm text-[#A1A1AA] mt-3 leading-relaxed">
                  Alur ini berlaku untuk pesanan satuan maupun satu tim. Anda selalu menerima pratinjau desain dan foto hasil jadi sebelum barang dikirim.
                </p>
                <div className="mt-5">
                  <Link
                    href="/katalog"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#84CC16] hover:underline"
                  >
                    <span>Lihat referensi model di katalog</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>

              <ol className="lg:col-span-8 divide-y divide-[#27272A] border-t border-b border-[#27272A]">
                {orderSteps.map((step) => (
                  <li key={step.number} className="py-6 sm:py-7 flex gap-4 sm:gap-6">
                    <span className="font-mono text-sm font-bold text-[#84CC16] pt-0.5 w-7 shrink-0 tabular-nums">
                      {step.number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-[#FAFAFA]">
                          {step.title}
                        </h3>
                        <span className="text-xs font-medium text-[#A1A1AA]">
                          {step.meta}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">
                        {step.description}
                      </p>

                      {step.subItems && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#27272A]/70">
                          {step.subItems.map((sub) => (
                            <div key={sub.label}>
                              <span className="block text-xs font-semibold text-[#FAFAFA]">
                                {sub.label}
                              </span>
                              <p className="mt-1 text-xs text-[#A1A1AA] leading-relaxed">
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

        {/* 2. Format Chat Siap Salin */}
        <section id="format-order" className="py-16 border-b border-[#27272A] bg-[#0C0D11] scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <OrderTemplateCard waNumber={whatsappNumber} storeName={storeName} />
          </div>
        </section>

        {/* 3. Panduan Ukuran */}
        <section id="panduan-ukuran" className="py-16 sm:py-20 border-b border-[#27272A] scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-animate="text-reveal" className="max-w-2xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
                Tabel ukuran standar {storeName}
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-2 leading-relaxed">
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

        {/* 4. Panduan File Desain & Penempatan Logo */}
        <section id="panduan-desain" className="py-16 sm:py-20 border-b border-[#27272A] bg-[#0C0D11] scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-animate="text-reveal" className="max-w-2xl mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
                Standar file desain dan posisi logo
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-2 leading-relaxed">
                Belum punya file desain? Cukup kirim sketsa atau foto referensi. Jika sudah punya file sendiri, ikuti patokan ini supaya hasil cetak tidak pecah.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              {/* Spesifikasi File */}
              <div className="lg:col-span-5">
                <h3 className="text-base font-bold text-[#FAFAFA] mb-4">
                  Format file yang kami terima
                </h3>
                <ol className="divide-y divide-[#27272A] border-t border-b border-[#27272A] text-sm">
                  <li className="py-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-[#FAFAFA]">File vektor</span>
                      <span className="text-xs font-medium text-[#84CC16]">Paling disarankan</span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                      Format <span className="font-mono text-[#FAFAFA]">.AI</span>,{" "}
                      <span className="font-mono text-[#FAFAFA]">.EPS</span>,{" "}
                      <span className="font-mono text-[#FAFAFA]">.PDF</span>,{" "}
                      <span className="font-mono text-[#FAFAFA]">.CDR</span>, atau{" "}
                      <span className="font-mono text-[#FAFAFA]">.SVG</span>. Hasil cetak tetap tajam di ukuran baju mana pun.
                    </p>
                  </li>
                  <li className="py-4">
                    <span className="block font-semibold text-[#FAFAFA]">Gambar transparan</span>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                      Format <span className="font-mono text-[#FAFAFA]">.PNG</span> tanpa latar belakang, minimal 300 DPI. Hindari tangkapan layar dari media sosial karena tepi logo akan pecah saat dicetak.
                    </p>
                  </li>
                  <li className="py-4">
                    <span className="block font-semibold text-[#FAFAFA]">Font dan file besar</span>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                      Ubah teks menjadi <em>outline</em> atau sertakan file font asli. Jika ukuran file di atas 25 MB, kirim lewat tautan Google Drive atau WeTransfer.
                    </p>
                  </li>
                </ol>

                <div className="mt-5">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Halo Admin ${storeName}, saya ingin mengirim file desain jersey tim. Berikut tautan filenya: `
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#84CC16] hover:underline"
                  >
                    <span>Kirim file desain ke admin</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              {/* Peta Penempatan Logo */}
              <div className="lg:col-span-7 rounded-2xl bg-[#141418] border border-[#27272A] p-5 sm:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-5">
                  <h3 className="text-base font-bold text-[#FAFAFA]">
                    Acuan posisi logo dan nomor
                  </h3>
                  <span className="text-xs text-[#A1A1AA]">
                    Posisi final dikunci saat mockup disetujui
                  </span>
                </div>

                <div className="rounded-xl bg-[#09090B] border border-[#27272A] p-4">
                  <svg
                    viewBox="0 0 320 210"
                    role="img"
                    aria-labelledby="peta-logo-title"
                    className="mx-auto h-auto w-full max-w-sm text-[#71717A]"
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

                <ol className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                  {placementGuides.map((item) => (
                    <li key={item.num} className="flex items-baseline gap-2.5">
                      <span className="font-mono font-bold text-[#84CC16] w-4 shrink-0">
                        {item.num}.
                      </span>
                      <span className="text-[#A1A1AA] leading-relaxed">
                        <strong className="font-semibold text-[#FAFAFA]">{item.label}:</strong>{" "}
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
        <section id="pilihan-bahan" className="py-16 sm:py-20 border-b border-[#27272A] scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div data-animate="text-reveal" className="max-w-2xl mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAFAFA]">
                Pilihan bahan dryfit
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-2 leading-relaxed">
                Tiap kain punya pori, tekstur, dan bobot berbeda. Sesuaikan dengan cabang olahraga dan kenyamanan tim Anda.
              </p>
            </div>

            {fabricList.length === 0 ? (
              <div className="py-10 border-t border-b border-[#27272A] text-sm text-[#A1A1AA]">
                Daftar bahan sedang diperbarui. Hubungi admin lewat WhatsApp untuk menanyakan stok kain yang tersedia.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 border-t border-[#27272A] pt-8">
                {fabricList.map((item) => (
                  <article key={item.id} className="flex flex-col">
                    <h3 className="text-base font-bold text-[#FAFAFA]">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-[#A1A1AA] leading-relaxed">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 6. Tanya Jawab */}
        <FaqSection />

        {/* 7. Penutup Ringkas */}
        <section className="py-14 bg-[#09090B]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#FAFAFA]">
                Masih bingung pilih bahan atau ukuran?
              </h2>
              <p className="text-sm text-[#A1A1AA] mt-1">
                Kirim jumlah pesanan dan jadwal pakai Anda, admin kami bantu hitungkan estimasinya.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 px-6 py-2.5 rounded-full bg-[#84CC16] text-[#09090B] text-sm font-bold transition-colors hover:bg-[#9ee238] active:scale-[0.98]"
              >
                <span>Hubungi Admin WhatsApp</span>
              </a>
              <Link
                href="/katalog"
                className="inline-flex min-h-11 items-center px-5 py-2.5 rounded-full bg-[#141418] border border-[#27272A] text-[#FAFAFA] text-sm font-semibold hover:border-[#84CC16]/50 transition-colors"
              >
                Lihat Katalog
              </Link>
            </div>
          </div>
        </section>
      </main>

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
