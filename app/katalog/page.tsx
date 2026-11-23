import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageMotion } from "@/components/motion-provider";
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
    storeAddress,
    googleMapsUrl,
    operatingHours,
    whatsappNumber,
    defaultWaText,
    instagramUrl,
    logoUrl,
    storeDescription,
  } = settings;

  const customDesignWaHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya ingin konsultasi desain jersey custom berdasarkan referensi sendiri.`
  )}`;

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      <PageMotion />
      <Navbar waNumber={whatsappNumber} storeName={storeName} companyName={settings.companyName} logoUrl={logoUrl} />

      {/* Header Katalog */}
      <section className="border-b border-[#27272A] bg-[#0C0D11]">
        <div
          data-animate="hero"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#FAFAFA]">
              Katalog jersey custom
            </h1>
            <p className="text-sm sm:text-base text-[#A1A1AA] mt-2.5 leading-relaxed">
              Pilih model sebagai acuan dasar. Warna, logo tim, sponsor, nama pemain, dan nomor punggung bisa disesuaikan lewat WhatsApp.
            </p>
          </div>

          <a
            href={customDesignWaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#84CC16] hover:underline shrink-0 self-start md:self-auto"
          >
            <span>Punya referensi desain sendiri? Kirim via WA</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* Daftar Produk & Filter */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <KatalogClient
          items={catalogList}
          initialCategory={initialCategory}
        />
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
