import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSiteSettings, getPublishedBlogs } from "@/lib/public-data";

export const metadata = {
  title: "Blog Custom Jersey | First Apparel",
  description:
    "Kumpulan artikel, tips desain jersey olahraga, panduan bahan kain dryfit, serta cara merawat jersey printing sublimasi dari tim First Apparel.",
};

export const instant = false;

export default async function BlogPage() {
  const [settings, blogList] = await Promise.all([
    getSiteSettings(),
    getPublishedBlogs(),
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    return `${minutes} Menit Baca`;
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      {/* 1. Navbar */}
      <Navbar waNumber={whatsappNumber} storeName={storeName} logoUrl={logoUrl} />

      {/* 2. Hero Header Blog */}
      <section className="relative py-16 sm:py-20 border-b border-[#27272A] bg-gradient-to-b from-[#121318] to-[#09090B] overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FAFAFA] uppercase">
            Tips, Wawasan &amp; Inspirasi Desain
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] mt-4 leading-relaxed max-w-2xl mx-auto">
            Pelajari panduan memilih bahan kain dryfit yang tepat, cara merawat jersey agar warna tidak pudar, serta inspirasi tren desain jersey olahraga terkini.
          </p>
        </div>
      </section>

      {/* 3. Daftar Kartu Artikel Blog */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {blogList.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-[#141418] border border-[#27272A] p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#84CC16]/10 border border-[#84CC16]/30 flex items-center justify-center text-[#84CC16] text-2xl mx-auto mb-5">
              ✍️
            </div>
            <h2 className="text-xl font-bold text-[#FAFAFA] mb-2">
              Belum Ada Artikel yang Dipublikasikan
            </h2>
            <p className="text-sm text-[#A1A1AA] mb-6">
              Artikel panduan dan edukasi seputar jersey kustom sedang dalam proses penyusunan oleh tim First Apparel.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-bold hover:bg-[#9ee238] transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogList.map((item, idx) => (
              <article
                key={item.id}
                className="flex flex-col rounded-2xl bg-[#141418] border border-[#27272A] overflow-hidden hover:border-[#3F3F46] hover:shadow-md transition-all group"
              >
                {/* Thumbnail Gambar */}
                <Link href={`/blog/${item.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-[#1E1F27]">
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    width={400}
                    height={250}
                    priority={idx < 3}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Konten Ringkas */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Meta Informasi */}
                    <div className="flex items-center justify-between text-xs text-[#71717A]">
                      <span>{formatDate(item.publishedAt)}</span>
                      <span className="flex items-center gap-1 text-[#84CC16]">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
                        </svg>
                        {calculateReadTime(item.content)}
                      </span>
                    </div>

                    {/* Judul Artikel */}
                    <h2 className="text-lg font-bold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors leading-snug line-clamp-2">
                      <Link href={`/blog/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h2>

                    {/* Ringkasan Singkat (Excerpt) */}
                    <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>

                  {/* Tombol Baca Selengkapnya */}
                  <div className="pt-2 border-t border-[#27272A]/80">
                    <Link
                      href={`/blog/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#84CC16] group-hover:translate-x-1 transition-transform"
                    >
                      <span>Baca Selengkapnya</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 4. Banner Konsultasi WA */}
      <section className="py-14 bg-[#0C0D11] border-t border-[#27272A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-[#FAFAFA]">
            Punya Pertanyaan Seputar Bahan &amp; Desain Jersey?
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-2 mb-6">
            Masih bingung pilih bahan? Tanya langsung ke admin produksi kami via WhatsApp.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Halo Admin ${storeName}, saya membaca blog Anda dan ingin berkonsultasi seputar pemesanan custom jersey.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-bold tracking-wide hover:bg-[#9ee238] active:scale-95 shadow-[0_0_20px_rgba(132,204,22,0.25)] transition-all"
          >
            <span>Konsultasi Gratis via WhatsApp</span>
            <span>→</span>
          </a>
        </div>
      </section>

      {/* 5. Footer */}
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
