import { NextResponse } from "next/server";
import {
  getSiteSettings,
  getActiveFabrics,
  getFeaturedCatalogs,
  getLatestBlogs,
} from "@/lib/public-data";
import { getSiteUrl } from "@/lib/site-url";

export async function GET() {
  const siteUrl = getSiteUrl();
  const [settings, fabrics, featuredCatalogs, latestBlogs] = await Promise.all([
    getSiteSettings(),
    getActiveFabrics(),
    getFeaturedCatalogs(),
    getLatestBlogs(5),
  ]);

  const lines: string[] = [
    `# ${settings.storeName}`,
    "",
    `> ${settings.storeDescription}`,
    "",
    "## Informasi Usaha",
    `- Nama Usaha: ${settings.storeName}`,
    `- Alamat Workshop: ${settings.storeAddress}`,
    `- Jam Operasional: ${settings.operatingHours}`,
    `- WhatsApp Resmi: https://wa.me/${settings.whatsappNumber}`,
    ...(settings.instagramUrl ? [`- Instagram: ${settings.instagramUrl}`] : []),
    ...(settings.googleMapsUrl ? [`- Google Maps: ${settings.googleMapsUrl}`] : []),
    "",
    "## Halaman Utama",
    `- [Beranda](${siteUrl}/): Profil konveksi custom jersey, keunggulan produksi, dan model unggulan.`,
    `- [Katalog Model Jersey](${siteUrl}/katalog): Daftar lengkap model jersey futsal, sepak bola, esports, running, dan jaket tim.`,
    `- [Alur & Cara Pemesanan](${siteUrl}/cara-pesan): Panduan order via WhatsApp, tabel ukuran, dan pilihan bahan kain.`,
    `- [Blog](${siteUrl}/blog): Artikel edukasi bahan kain, desain jersey, dan perawatan sablon sublimasi.`,
    "",
  ];

  if (fabrics.length > 0) {
    lines.push("## Pilihan Bahan Kain");
    for (const fabric of fabrics) {
      lines.push(`- ${fabric.name}: ${fabric.description}`);
    }
    lines.push("");
  }

  if (featuredCatalogs.length > 0) {
    lines.push("## Model Jersey Unggulan");
    for (const item of featuredCatalogs) {
      lines.push(
        `- ${item.title} (${item.category}) — Bahan: ${item.fabric}${item.priceInfo ? `, ${item.priceInfo}` : ""}`
      );
    }
    lines.push("");
  }

  if (latestBlogs.length > 0) {
    lines.push("## Artikel Terbaru");
    for (const post of latestBlogs) {
      lines.push(`- [${post.title}](${siteUrl}/blog/${post.slug}): ${post.excerpt}`);
    }
    lines.push("");
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
