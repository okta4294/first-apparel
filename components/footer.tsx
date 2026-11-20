import Link from "next/link";

export interface FooterProps {
  storeName: string;
  storeAddress: string;
  googleMapsUrl?: string | null;
  operatingHours?: string | null;
  whatsappNumber: string;
  defaultWaText?: string;
  instagramUrl?: string | null;
  logoUrl?: string | null;
  storeDescription?: string | null;
}

export function Footer({
  storeName = "First Apparel",
  storeAddress = "Jl. Terusan Olahraga No. 8, Bandung, Jawa Barat",
  googleMapsUrl,
  operatingHours = "Senin - Sabtu, 09.00 - 17.00 WIB",
  whatsappNumber = "6281234567890",
  defaultWaText = "Halo Admin First Apparel, saya ingin berkonsultasi tentang pemesanan jersey kustom.",
  instagramUrl,
  logoUrl,
  storeDescription = "Vendor konveksi dan produsen custom jersey olahraga profesional. Melayani pembuatan seragam futsal, sepak bola, esports, running, dan apparel tim.",
}: FooterProps) {
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultWaText)}`;

  return (
    <footer className="border-t border-[#27272A] bg-[#0C0D11] pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1F1F24]">
          {/* C1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              {logoUrl ? (
                <div className="w-8 h-8 rounded-lg border border-[#27272A]/80 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={logoUrl} alt={storeName} width={32} height={32} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-md bg-[#84CC16] flex items-center justify-center font-black text-[#09090B] text-xs shrink-0">
                  {storeName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="font-bold text-base tracking-tight text-[#FAFAFA]">
                {storeName}
              </span>
            </Link>
            <p className="text-[#71717A] leading-relaxed">
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
                  Katalog Jersey
                </Link>
              </li>
              <li>
                <Link href="/cara-pesan" className="hover:text-[#84CC16] transition-colors">
                  Alur Pemesanan
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#84CC16] transition-colors">
                  Blog &amp; Panduan
                </Link>
              </li>
            </ul>
          </div>

          {/* C3: Kategori Olahraga */}
          <div>
            <h3 className="font-bold text-sm text-[#FAFAFA] mb-4">Kategori Produk</h3>
            <ul className="space-y-2.5 text-[#A1A1AA]">
              <li>
                <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                  Jersey Futsal &amp; Bola
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                  Jersey Esports Pro
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                  Jersey Running &amp; Cycling
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-[#84CC16] transition-colors">
                  Jaket &amp; Coach Jacket
                </Link>
              </li>
            </ul>
          </div>

          {/* C4: Kontak & Lokasi Workshop */}
          <div>
            <h3 className="font-bold text-sm text-[#FAFAFA] mb-4">Kontak &amp; Workshop</h3>
            <ul className="space-y-2.5 text-[#71717A]">
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
                    📍 Buka di Google Maps →
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
                    📸 Ikuti Instagram Kami →
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center text-[#52525B]">
          © 2026 {storeName}. All Rights Reserved. Seluruh pemesanan dilayani via WhatsApp Resmi.
        </div>
      </div>
    </footer>
  );
}
