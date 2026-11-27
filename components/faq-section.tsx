const FAQ_ITEMS = [
  {
    question: "Apakah bisa pesan jersey satuan atau jumlah sedikit?",
    answer:
      "Bisa. Kami melayani pesanan tanpa minimal order, mulai dari satuan, satu tim, sampai ratusan potong untuk kebutuhan instansi atau turnamen.",
  },
  {
    question: "Berapa lama waktu pengerjaan jersey tim?",
    answer:
      "Pengerjaan reguler butuh 3 sampai 7 hari kerja setelah mockup disetujui dan DP masuk. Untuk kebutuhan mendesak seperti jadwal turnamen dekat, tanyakan slot express (3 sampai 5 hari kerja) ke admin sebelum transfer.",
  },
  {
    question:
      "Apakah nama dan nomor punggung berbeda tiap pemain dikenakan biaya tambahan?",
    answer:
      "Tidak ada biaya tambahan. Karena dicetak dengan teknik sublimasi full print, setiap baju bisa memakai nama, nomor punggung, dan ukuran berbeda.",
  },
  {
    question: "Bagaimana jika barang yang diterima cacat atau salah cetak nomor?",
    answer:
      "Kami ganti baru tanpa biaya tambahan bila kesalahan berasal dari pihak produksi, misalnya salah nomor, salah ejaan nama dari rekap yang disepakati, atau cacat jahitan.",
  },
  {
    question: "Format file desain apa yang perlu disiapkan?",
    answer:
      "Sebaiknya file vektor (.AI, .EPS, .PDF, .CDR, atau .SVG) atau gambar .PNG latar transparan minimal 300 DPI. Jika belum punya file, kirim saja foto referensi atau sketsa tangan dan desainer kami bantu buatkan mockup.",
  },
  {
    question: "Ke rekening mana pembayaran DP dikirim?",
    answer:
      "DP 50% dibayarkan setelah Anda menerima invoice resmi yang mencantumkan rekening toko. Admin tidak pernah meminta transfer ke rekening pribadi lewat pesan singkat. Pastikan kembali nomor rekening lewat WhatsApp resmi di halaman ini sebelum mentransfer.",
  },
];

interface FaqSectionProps {
  variant?: "dark" | "editorial";
  waHref?: string;
}

export function FaqSection({ variant = "dark", waHref }: FaqSectionProps) {
  if (variant === "editorial") {
    return (
      <section
        id="faq"
        className="py-20 sm:py-28 bg-[#121815] scroll-mt-24"
        aria-label="Pertanyaan yang sering ditanyakan"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4 space-y-4">
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] leading-[1.1] text-[#F4F3EE]">
                Pertanyaan yang sering ditanyakan
              </h2>
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A3E635] underline decoration-[#84CC16]/60 underline-offset-4 hover:text-[#BEF264] transition-colors pt-1"
                >
                  <span>Tanya admin lewat WhatsApp</span>
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </div>

            <div className="lg:col-span-8 divide-y divide-[#222E26] border-t border-b border-[#222E26]">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="py-6 sm:py-7">
                  <h3 className="text-base sm:text-lg font-bold tracking-[-0.015em] text-[#F4F3EE] leading-snug">
                    {item.question}
                  </h3>
                  <p className="mt-2.5 text-[15px] sm:text-base text-[#A4B0A8] leading-relaxed max-w-[64ch]">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="faq"
      className="py-16 sm:py-20 border-b border-[#E2E8F0] dark:border-[#27272A] bg-[#FFFFFF] dark:bg-[#0C0D11] scroll-mt-24"
      aria-label="Pertanyaan yang sering ditanyakan"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-animate="text-reveal" className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA]">
            Pertanyaan yang sering ditanyakan
          </h2>
        </div>

        <div className="divide-y divide-[#E2E8F0] dark:divide-[#27272A] border-t border-b border-[#E2E8F0] dark:border-[#27272A]">
          {FAQ_ITEMS.map((item, idx) => (
            <details
              key={item.question}
              open={idx === 0}
              className="group py-4 sm:py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm sm:text-base font-semibold text-[#0F172A] dark:text-[#FAFAFA] hover:text-[#4D7C0F] dark:hover:text-[#84CC16] transition-colors [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="text-lg font-normal text-[#64748B] dark:text-[#A1A1AA] transition-transform duration-200 group-open:rotate-45 shrink-0"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 pr-6 text-sm text-[#475569] dark:text-[#A1A1AA] leading-relaxed">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
