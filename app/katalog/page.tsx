import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSiteSettings, getAllActiveCatalogs } from "@/lib/public-data";
import { KatalogClient } from "./katalog-client";

export const metadata: Metadata = {
  title: "Katalog Model Custom Jersey | First Apparel",
  description:
    "Eksplorasi pilihan model custom jersey futsal, sepak bola, esports, running, dan jaket tim dengan bahan dryfit premium dari First Apparel.",
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
    sizeChartUrl: storeSizeChartUrl,
    storeDescription,
  } = settings;

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      {/* 1. Navbar */}
      <Navbar waNumber={whatsappNumber} storeName={storeName} logoUrl={logoUrl} />

      {/* 2. Hero Header Katalog */}
      <section className="relative py-16 border-b border-[#27272A] bg-gradient-to-b from-[#121318] to-[#09090B] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#FAFAFA] uppercase">
            Eksplorasi Desain Jersey Tim Anda
          </h1>
          <p className="text-sm sm:text-base text-[#A1A1AA] mt-4 leading-relaxed">
            Pilihan model jersey futsal, sepak bola, e-sports pro, running, dan jaket tim dengan bahan Dryfit premium berstandar atlet. Seluruh desain dapat dikustomisasi penuh sesuai logo, sponsor, dan nama tim Anda.
          </p>
        </div>
      </section>

      {/* 3. Konten Utama Katalog & Filter Interaktif */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <KatalogClient
          items={catalogList}
          waNumber={whatsappNumber}
          storeSizeChartUrl={storeSizeChartUrl}
          initialCategory={initialCategory}
        />
      </main>

      {/* 4. Footer */}
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
