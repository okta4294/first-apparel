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

export function FaqSection() {
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
