import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SizeChartTrigger } from "@/components/size-chart-trigger";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import {
  getSiteSettings,
  getCatalogById,
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

  const item = await getCatalogById(id);

  if (!item) {
    return { title: "Katalog Tidak Ditemukan | First Apparel" };
  }

  const description =
    item.description?.trim() ||
    `Model custom jersey ${item.title} (${item.category}) dari First Apparel.`;

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

  const [settings, item] = await Promise.all([
    getSiteSettings(),
    getCatalogById(id),
  ]);

  if (!item) {
    notFound();
  }

  const galleryImages = parseCatalogImages(
    item.images,
    item.imageUrl,
    item.imageKey
  );

  const sizeChartUrl = item.sizeChartUrl || settings.sizeChartUrl;
  const waMessage = `Halo Admin ${settings.storeName}, saya ingin memesan custom jersey model "${item.title}" (${item.category}). Bisa info detail pemesanannya?`;
  const waHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
  const cleanDescription =
    item.description?.trim() && item.description.trim() !== "-"
      ? item.description.trim()
      : null;

  return (
    <div className="min-h-screen bg-[#0B100D] text-[#F4F3EE] flex flex-col selection:bg-[#84CC16] selection:text-[#0B100D]">
      <Navbar
        waNumber={settings.whatsappNumber}
        storeName={settings.storeName}
        companyName={settings.companyName}
        logoUrl={settings.logoUrl}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="mb-8">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#A4B0A8] hover:text-[#A3E635] transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>Kembali ke Katalog</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-6">
            <CatalogGallery title={item.title} images={galleryImages} />
          </div>

          <div className="lg:col-span-6 lg:pt-1 space-y-6 fa-hero-enter">
            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-[#A3E635]">
                {item.category}
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-[#F4F3EE] leading-[1.08] [text-wrap:balance]">
                {item.title}
              </h1>
            </div>

            {cleanDescription && (
              <dl className="divide-y divide-[#222E26] border-t border-b border-[#222E26] text-sm sm:text-base">
                <div className="py-4 space-y-1.5">
                  <dt className="text-[#95A39A] font-medium text-sm">Keterangan</dt>
                  <dd className="font-medium text-[#F4F3EE] leading-relaxed">
                    {cleanDescription}
                  </dd>
                </div>
              </dl>
            )}

            <div className="space-y-3 pt-1">
              {sizeChartUrl && (
                <SizeChartTrigger
                  title={item.title}
                  sizeChartUrl={sizeChartUrl}
                  variant="editorial"
                />
              )}

              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] active:scale-[0.99] text-[#0B100D] font-bold text-sm sm:text-base transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Pesan Model Ini via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
