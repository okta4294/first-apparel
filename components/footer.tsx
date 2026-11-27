import Link from "next/link";
import Image from "next/image";
import { getActiveCatalogCategories, getSiteSettings } from "@/lib/public-data";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

export interface FooterProps {
  storeName?: string;
  storeAddress?: string;
  googleMapsUrl?: string | null;
  operatingHours?: string | null;
  whatsappNumber?: string;
  defaultWaText?: string;
  instagramUrl?: string | null;
  logoUrl?: string | null;
  footerLogoUrl?: string | null;
  footerCompanyName?: string | null;
  storeDescription?: string | null;
  showClosingCta?: boolean;
}

function formatCategoryLabel(category: string): string {
  return category
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function Footer({
  storeName,
  storeAddress,
  googleMapsUrl,
  operatingHours,
  whatsappNumber,
  defaultWaText,
  instagramUrl,
  logoUrl,
  footerLogoUrl,
  footerCompanyName,
  storeDescription,
  showClosingCta = false,
}: FooterProps = {}) {
  const [categories, siteSettings] = await Promise.all([
    getActiveCatalogCategories(),
    getSiteSettings(),
  ]);

  const resolvedStoreName = storeName ?? siteSettings.storeName;
  const resolvedAddress = storeAddress ?? siteSettings.storeAddress;
  const resolvedMapsUrl = googleMapsUrl ?? siteSettings.googleMapsUrl;
  const resolvedHours = operatingHours ?? siteSettings.operatingHours;
  const resolvedWaNumber = whatsappNumber ?? siteSettings.whatsappNumber;
  const resolvedWaText = defaultWaText ?? siteSettings.defaultWaText;
  const resolvedInstagram = instagramUrl ?? siteSettings.instagramUrl;
  const resolvedDescription = storeDescription ?? siteSettings.storeDescription;

  const waLink = `https://wa.me/${resolvedWaNumber}?text=${encodeURIComponent(resolvedWaText)}`;
  const closingWaLink = `https://wa.me/${resolvedWaNumber}?text=${encodeURIComponent(
    `Halo Admin ${resolvedStoreName}, saya ingin berkonsultasi konsep desain dan penawaran harga khusus tim.`
  )}`;

  const companyLogoUrl =
    footerLogoUrl ?? siteSettings.footerLogoUrl ?? logoUrl ?? siteSettings.logoUrl;
  const companyLogo2Url = siteSettings.footerLogo2Url;
  const companyDisplayName =
    footerCompanyName ??
    siteSettings.footerCompanyName ??
    siteSettings.companyName ??
    resolvedStoreName;

  return (
    <footer className="border-t border-[#234530] bg-[#14291C] text-[#F4F3EE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Baris Penutup & CTA Utama dalam Satu Seksi Footer */}
        {showClosingCta && (
          <div className="py-16 sm:py-24 border-b border-[#274B32] flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-medium text-[#A3E635]">
                Konsultasi desain dan estimasi harga tim
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.06] text-[#F4F3EE] [text-wrap:balance]">
                Siap produksi jersey tim Anda bersama workshop kami.
              </h2>
              <p className="text-base text-[#C7D4CA] leading-relaxed max-w-[54ch]">
                Kirim referensi desain, warna, atau jumlah pemain lewat WhatsApp. Desainer kami bantu siapkan pratinjau sebelum masuk produksi.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={closingWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-7 py-3.5 rounded-lg bg-[#84CC16] hover:bg-[#9AE02C] text-[#0B100D] font-bold text-sm sm:text-base tracking-[-0.01em] transition-all active:scale-[0.98]"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>Konsultasi via WhatsApp</span>
              </a>
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center min-h-[52px] px-6 py-3.5 rounded-lg border border-[#346141] hover:border-[#84CC16] text-[#F4F3EE] font-semibold text-sm sm:text-base transition-colors"
              >
                Lihat Katalog Model
              </Link>
            </div>
          </div>
        )}

        {/* Direktori Footer 4 Kolom */}
        <div className="py-14 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-[#274B32] text-sm">
          {/* C1: Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="inline-block group">
              <span className="font-[family-name:var(--font-display)] font-extrabold text-xl tracking-[-0.02em] text-[#F4F3EE] group-hover:text-[#A3E635] transition-colors">
                {resolvedStoreName}
              </span>
            </Link>
            <p className="text-[#C7D4CA] leading-relaxed max-w-[38ch]">
              {resolvedDescription}
            </p>
          </div>

          {/* C2: Tautan Halaman */}
          <div className="md:col-span-2">
            <h3 className="font-semibold text-sm text-[#F4F3EE] mb-4">Halaman</h3>
            <ul className="space-y-3 text-[#C7D4CA]">
              <li>
                <Link href="/" className="hover:text-[#A3E635] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#A3E635] transition-colors">
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/cara-pesan" className="hover:text-[#A3E635] transition-colors">
                  Alur Pemesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* C3: Kategori Olahraga */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-sm text-[#F4F3EE] mb-4">Kategori Produk</h3>
            <ul className="space-y-3 text-[#C7D4CA]">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/katalog?kategori=${encodeURIComponent(category)}`}
                      className="hover:text-[#A3E635] transition-colors"
                    >
                      {formatCategoryLabel(category)}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/katalog" className="hover:text-[#A3E635] transition-colors">
                    Lihat Semua Katalog
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* C4: Kontak & Lokasi Workshop */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-sm text-[#F4F3EE] mb-4">Workshop &amp; Kontak</h3>
            <ul className="space-y-3 text-[#C7D4CA]">
              <li>
                <span className="block text-[#F4F3EE] font-medium mb-0.5">Alamat Workshop</span>
                <span>{resolvedAddress}</span>
              </li>
              {resolvedMapsUrl && (
                <li>
                  <a
                    href={resolvedMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A3E635] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Buka di Google Maps →
                  </a>
                </li>
              )}
              <li>
                <span className="block text-[#F4F3EE] font-medium mb-0.5">Jam Operasional</span>
                <span>{resolvedHours}</span>
              </li>
              <li>
                <span className="block text-[#F4F3EE] font-medium mb-0.5">WhatsApp Resmi</span>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A3E635] hover:underline"
                >
                  +{resolvedWaNumber}
                </a>
              </li>
              {resolvedInstagram && (
                <li>
                  <a
                    href={resolvedInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A3E635] hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Instagram Resmi →
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Baris Legal & Logo Perusahaan */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#AFC2B4]">
          <p>
            © 2026 {resolvedStoreName}. Seluruh pemesanan dilayani via WhatsApp Resmi.
          </p>
          {(companyLogoUrl || companyLogo2Url) && (
            <div className="flex flex-wrap items-center justify-center gap-6">
              {companyLogoUrl && (
                <Image
                  src={companyLogoUrl}
                  alt={companyDisplayName}
                  width={180}
                  height={64}
                  sizes="180px"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              )}
              {companyLogo2Url && (
                <Image
                  src={companyLogo2Url}
                  alt={`${companyDisplayName} logo 2`}
                  width={180}
                  height={64}
                  sizes="180px"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
