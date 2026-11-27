import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSiteSettings, getAllActiveCatalogs } from "@/lib/public-data";
import { KatalogClient } from "./katalog-client";

export const metadata: Metadata = {
  title: "Katalog Model Custom Jersey | First Apparel",
  description:
    "Pilihan model custom jersey futsal, sepak bola, esports, running, dan jaket tim dari First Apparel. Warna, logo, dan nama pemain bisa disesuaikan.",
};

export const instant = false;

export default async function KatalogPage({
  searchParams,
}: {
  searchParams?: Promise<{ kategori?: string }>;
}) {
  const [settings, catalogList, resolvedParams] = await Promise.all([
    getSiteSettings(),
    getAllActiveCatalogs(),
    searchParams ?? Promise.resolve({} as { kategori?: string }),
  ]);
  const initialCategory =
    typeof resolvedParams?.kategori === "string" ? resolvedParams.kategori : undefined;

  const {
    storeName,
    whatsappNumber,
    logoUrl,
  } = settings;

  const customDesignWaHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin konsultasi desain jersey custom berdasarkan referensi sendiri.`
  )}`;

  return (
    <div className="min-h-screen bg-[#0B100D] text-[#F4F3EE] flex flex-col selection:bg-[#84CC16] selection:text-[#0B100D]">
      <a
        href="#utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-[#84CC16] focus:text-[#0B100D] focus:text-sm focus:font-bold"
      >
        Langsung ke daftar katalog
      </a>

      <Navbar
        waNumber={whatsappNumber}
        storeName={storeName}
        companyName={settings.companyName}
        logoUrl={logoUrl}
      />

      {/* Header Katalog */}
      <section className="border-b border-[#222E26] bg-[#0B100D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col md:flex-row md:items-end justify-between gap-6 fa-hero-enter">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold text-[#A3E635]">
              Katalog produksi · {catalogList.length} model siap custom
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold tracking-[-0.035em] leading-[1.06] text-[#F4F3EE]">
              Katalog jersey custom
            </h1>
            <p className="text-base text-[#A4B0A8] leading-relaxed max-w-[56ch]">
              Pilih model sebagai acuan dasar. Warna, logo tim, sponsor, nama pemain, dan nomor punggung dapat disesuaikan lewat WhatsApp.
            </p>
          </div>

          <a
            href={customDesignWaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#141B17] border border-[#28352D] text-sm font-semibold text-[#F4F3EE] hover:border-[#84CC16] hover:text-[#A3E635] transition-colors shrink-0 self-start md:self-auto"
          >
            <span>Punya desain sendiri? Kirim via WA</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* Daftar Produk & Filter */}
      <main id="utama" className="flex-1 bg-[#121815]">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <KatalogClient
            items={catalogList}
            initialCategory={initialCategory}
          />
        </div>
      </main>

      <Footer showClosingCta />
    </div>
  );
}
