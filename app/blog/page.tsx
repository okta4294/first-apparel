import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageMotion } from "@/components/motion-provider";
import { getSiteSettings, getPublishedBlogs } from "@/lib/public-data";

export const metadata = {
  title: "Blog Custom Jersey | First Apparel",
  description:
    "Kumpulan artikel seputar pemilihan bahan kain dryfit, cara merawat jersey printing sublimasi, dan panduan desain jersey tim dari First Apparel.",
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
    return `${minutes} menit baca`;
  };

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya membaca artikel di blog dan ingin konsultasi soal custom jersey.`
  )}`;

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      <PageMotion />
      <Navbar waNumber={whatsappNumber} storeName={storeName} logoUrl={logoUrl} />

      {/* Header Blog */}
      <section className="border-b border-[#27272A] bg-[#0C0D11]">
        <div
          data-animate="hero"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#FAFAFA]">
              Blog &amp; panduan jersey
            </h1>
            <p className="text-sm sm:text-base text-[#A1A1AA] mt-2.5 leading-relaxed">
              Catatan praktis soal memilih bahan dryfit, merawat cetakan sublimasi agar awet, dan persiapan desain jersey untuk tim.
            </p>
          </div>
          {blogList.length > 0 && (
            <p className="text-xs font-medium text-[#A1A1AA] tabular-nums shrink-0">
              {blogList.length} artikel tersedia
            </p>
          )}
        </div>
      </section>

      {/* Daftar Artikel */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {blogList.length === 0 ? (
          <div className="py-20 text-center space-y-3 border-b border-[#27272A]">
            <h2 className="text-lg font-bold text-[#FAFAFA]">
              Belum ada artikel yang diterbitkan
            </h2>
            <p className="text-sm text-[#A1A1AA] max-w-md mx-auto">
              Panduan seputar bahan dan perawatan jersey sedang disiapkan oleh tim {storeName}.
            </p>
            <div className="pt-2">
              <Link
                href="/katalog"
                className="inline-flex min-h-10 items-center px-5 py-2 rounded-full bg-[#84CC16] text-[#09090B] text-xs sm:text-sm font-semibold hover:bg-[#9ee238] transition-colors"
              >
                Lihat Katalog
              </Link>
            </div>
          </div>
        ) : (
          <div data-animate="stagger-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
            {blogList.map((item, idx) => (
              <article key={item.id} className="flex flex-col group">
                <Link
                  href={`/blog/${item.slug}`}
                  className="relative block aspect-[16/10] rounded-xl overflow-hidden bg-[#18181B] border border-[#27272A]"
                >
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.title}
                    width={480}
                    height={300}
                    priority={idx < 3}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="pt-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
                    <time dateTime={new Date(item.publishedAt).toISOString()}>
                      {formatDate(item.publishedAt)}
                    </time>
                    <span aria-hidden="true">·</span>
                    <span>{calculateReadTime(item.content)}</span>
                  </div>

                  <h2 className="mt-2 text-base sm:text-lg font-bold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors leading-snug line-clamp-2">
                    <Link href={`/blog/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-[#A1A1AA] line-clamp-3 leading-relaxed flex-1">
                    {item.excerpt}
                  </p>

                  <div className="pt-3 mt-3 border-t border-[#27272A]/70">
                    <Link
                      href={`/blog/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#84CC16] hover:underline"
                    >
                      <span>Baca artikel</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Penutup Ringkas */}
      <section className="py-12 bg-[#0C0D11] border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#FAFAFA]">
              Masih ada pertanyaan soal bahan atau desain?
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Tanyakan langsung ke admin produksi kami lewat WhatsApp.
            </p>
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 px-6 py-2.5 rounded-full bg-[#84CC16] text-[#09090B] text-sm font-bold hover:bg-[#9ee238] active:scale-[0.98] transition-colors shrink-0 self-start sm:self-auto"
          >
            <span>Tanya Admin di WhatsApp</span>
          </a>
        </div>
      </section>

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
