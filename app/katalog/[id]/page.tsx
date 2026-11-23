import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PageMotion } from "@/components/motion-provider";
import { SizeChartTrigger } from "@/components/size-chart-trigger";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import {
  getSiteSettings,
  getCatalogById,
  getActiveFabrics,
} from "@/lib/public-data";
import { CatalogGallery } from "./catalog-gallery";

export const instant = false;

interface CatalogDetailPageProps {
  params: Promise<{ id: string }>;
}

function parseCatalogImages(raw: string | null, fallbackUrl: string, fallbackKey: string) {
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as { url: string; key: string }[];
      }
    } catch {
      // Fallback ke foto sampul jika JSON tidak valid
    }
  }
  return fallbackUrl ? [{ url: fallbackUrl, key: fallbackKey }] : [];
}

export async function generateMetadata({
  params,
}: CatalogDetailPageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return { title: "Katalog Tidak Ditemukan | First Apparel" };
  }

  const [item, fabrics] = await Promise.all([
    getCatalogById(id),
    getActiveFabrics(),
  ]);

  if (!item) {
    return { title: "Katalog Tidak Ditemukan | First Apparel" };
  }

  const matchedFabric = fabrics.find(
    (f) => f.name.trim().toLowerCase() === item.fabric.trim().toLowerCase()
  );
  const description =
    matchedFabric?.description ||
    `Model custom jersey ${item.title} berbahan ${item.fabric} dari First Apparel.`;

  return {
    title: `${item.title} | Katalog First Apparel`,
    description,
    openGraph: {
      title: item.title,
      description,
      images: item.imageUrl ? [{ url: item.imageUrl }] : undefined,
    },
  };
}

export default async function CatalogDetailPage({
  params,
}: CatalogDetailPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const [settings, item, fabrics] = await Promise.all([
    getSiteSettings(),
    getCatalogById(id),
    getActiveFabrics(),
  ]);

  if (!item) {
    notFound();
  }

  const matchedFabric = fabrics.find(
    (f) => f.name.trim().toLowerCase() === item.fabric.trim().toLowerCase()
  );

  const descriptionParagraphs = (
    matchedFabric?.description ||
    `Model jersey ini menggunakan bahan ${item.fabric}. Desain, warna, logo, dan nama tim dapat disesuaikan melalui konsultasi WhatsApp.`
  )
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const galleryImages = parseCatalogImages(
    item.images,
    item.imageUrl,
    item.imageKey
  );

  const sizeChartUrl = item.sizeChartUrl || settings.sizeChartUrl;
  const waMessage = `Halo Admin ${settings.storeName}, saya ingin memesan custom jersey model "${item.title}" (${item.category}, bahan ${item.fabric}). Bisa info detail pemesanannya?`;
  const waHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090B] text-[#0F172A] dark:text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      <PageMotion />
      <Navbar
        waNumber={settings.whatsappNumber}
        storeName={settings.storeName}
        logoUrl={settings.logoUrl}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] dark:text-[#A1A1AA] hover:text-[#4D7C0F] dark:hover:text-[#84CC16] transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5">
            <CatalogGallery title={item.title} images={galleryImages} />
          </div>

          <div data-animate="hero" className="lg:col-span-7 space-y-5 lg:pt-1">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#4D7C0F] dark:text-[#84CC16]">
                {item.category}
              </p>
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0F172A] dark:text-[#FAFAFA] leading-tight">
                {item.title}
              </h1>
            </div>

            <div className="space-y-3 text-sm sm:text-base text-[#475569] dark:text-[#A1A1AA] leading-relaxed">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F172A] dark:text-[#E4E4E7]">
                <span>Bahan: {item.fabric}</span>
                {item.minOrder && <span>Minimal Order: {item.minOrder}</span>}
              </div>
              {descriptionParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#27272A]">
              <p className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-[#FAFAFA] tabular-nums">
                {item.priceInfo || "Hubungi Kami"}
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {sizeChartUrl && (
                <SizeChartTrigger
                  title={item.title}
                  sizeChartUrl={sizeChartUrl}
                />
              )}

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#65A30D] hover:bg-[#4D7C0F] dark:bg-[#84CC16] dark:hover:bg-[#9ee238] active:scale-[0.99] text-white dark:text-[#09090B] font-bold text-sm tracking-wide transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 shrink-0" />
                <span>Pesan via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer
        storeName={settings.storeName}
        storeAddress={settings.storeAddress}
        googleMapsUrl={settings.googleMapsUrl}
        operatingHours={settings.operatingHours}
        whatsappNumber={settings.whatsappNumber}
        defaultWaText={settings.defaultWaText}
        instagramUrl={settings.instagramUrl}
        logoUrl={settings.logoUrl}
        storeDescription={settings.storeDescription}
      />
    </div>
  );
}
