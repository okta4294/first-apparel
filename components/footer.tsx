import Link from "next/link";
import Image from "next/image";
import { getActiveCatalogCategories, getSiteSettings } from "@/lib/public-data";

export interface FooterProps {
  storeName: string;
  storeAddress: string;
  googleMapsUrl?: string | null;
  operatingHours?: string | null;
  whatsappNumber: string;
  defaultWaText?: string;
  instagramUrl?: string | null;
  logoUrl?: string | null;
  footerLogoUrl?: string | null;
  footerCompanyName?: string | null;
  storeDescription?: string | null;
}

function formatCategoryLabel(category: string): string {
  return category
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function Footer({
  storeName = "First Apparel",
  storeAddress = "Jl. Terusan Olahraga No. 8, Bandung, Jawa Barat",
  googleMapsUrl,
  operatingHours = "Senin - Sabtu, 09.00 - 17.00 WIB",
  whatsappNumber = "6281234567890",
  defaultWaText = "Halo Admin First Apparel, saya ingin berkonsultasi tentang pemesanan jersey kustom.",
  instagramUrl,
  logoUrl,
  footerLogoUrl,
  footerCompanyName,
  storeDescription = "Vendor konveksi dan produsen custom jersey olahraga profesional. Melayani pembuatan seragam futsal, sepak bola, esports, running, dan apparel tim.",
}: FooterProps) {
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultWaText)}`;
  const [categories, siteSettings] = await Promise.all([
    getActiveCatalogCategories(),
    getSiteSettings(),
  ]);
  const companyLogoUrl = footerLogoUrl ?? siteSettings.footerLogoUrl ?? logoUrl ?? siteSettings.logoUrl;
  const companyLogo2Url = siteSettings.footerLogo2Url;
  const companyDisplayName =
    footerCompanyName ??
    siteSettings.footerCompanyName ??
    siteSettings.companyName ??
    storeName;

  return (
    <footer className="border-t border-[#27272A] bg-[#0C0D11] pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#27272A]">
          {/* C1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-bold text-base tracking-tight text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors">
                {storeName}
              </span>
            </Link>
            <p className="text-[#A1A1AA] leading-relaxed">
              {storeDescription}
            </p>
          </div>

          {/* C2: Tautan Halaman */}
          <div>
            <h3 className="font-bold text-sm text-[#FAFAFA] mb-4">Navigasi Halaman</h3>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li>
                <Link href="/" className="hover:text-[#84CC16] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/cara-pesan" className="hover:text-[#84CC16] transition-colors">
                  Alur Pemesanan
                </Link>
              </li>
              {/* <li>
                <Link href="/blog" className="hover:text-[#84CC16] transition-colors">
                  Blog
                </Link>
              </li> */}
            </ul>
          </div>

          {/* C3: Kategori Olahraga */}
          <div>
            <h3 className="font-bold text-sm text-[#FAFAFA] mb-4">Kategori Produk</h3>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/katalog?kategori=${encodeURIComponent(category)}`}
                      className="hover:text-[#84CC16] transition-colors"
                    >
                      {formatCategoryLabel(category)}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                    Lihat Semua Katalog
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* C4: Kontak & Lokasi Workshop */}
          <div>
            <h3 className="font-bold text-sm text-[#FAFAFA] mb-4">Kontak &amp; Workshop</h3>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li>
                <span className="block text-[#FAFAFA] font-medium mb-0.5">Alamat Workshop:</span>
                <span>{storeAddress}</span>
              </li>
              {googleMapsUrl && (
                <li>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#84CC16] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Buka di Google Maps →
                  </a>
                </li>
              )}
              <li>
                <span className="block text-[#FAFAFA] font-medium mb-0.5">Jam Kerja:</span>
                <span>{operatingHours}</span>
              </li>
              <li>
                <span className="block text-[#FAFAFA] font-medium mb-0.5">WhatsApp Resmi:</span>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#84CC16] hover:underline"
                >
                  +{whatsappNumber}
                </a>
              </li>
              {instagramUrl && (
                <li>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#84CC16] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Ikuti Instagram Kami →
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-5 text-center text-[#A1A1AA]">
          {(companyLogoUrl || companyLogo2Url) && (
            <div className="flex flex-wrap items-center justify-center gap-8">
              {companyLogoUrl && (
                <Image
                  src={companyLogoUrl}
                  alt={companyDisplayName}
                  width={220}
                  height={96}
                  sizes="220px"
                  className="h-20 sm:h-24 w-auto object-contain"
                />
              )}
              {companyLogo2Url && (
                <Image
                  src={companyLogo2Url}
                  alt={`${companyDisplayName} logo 2`}
                  width={220}
                  height={96}
                  sizes="220px"
                  className="h-20 sm:h-24 w-auto object-contain"
                />
              )}
            </div>
          )}
          <p>
            © 2026 {storeName}. Hak Cipta Dilindungi. Seluruh pemesanan dilayani via WhatsApp Resmi.
          </p>
        </div>
      </div>
    </footer>
  );
}
