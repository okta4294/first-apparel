"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { sanitizeUploadThingUrl } from "@/lib/uploadthing-server";
import { revalidatePath, updateTag } from "next/cache";

function sanitizeUrl(urlString: string | null): string | null {
  if (!urlString) return null;
  const trimmed = urlString.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export async function updateSettingsAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const storeName = (formData.get("storeName") as string)?.trim() || "First Apparel";
  const companyName = (formData.get("companyName") as string)?.trim() || null;
  const storeAddress =
    (formData.get("storeAddress") as string)?.trim() ||
    "Jl. Terusan Olahraga No. 8, Bandung, Jawa Barat";
  const googleMapsUrl = sanitizeUrl((formData.get("googleMapsUrl") as string)?.trim() || null);
  const operatingHours =
    (formData.get("operatingHours") as string)?.trim() ||
    "Senin - Sabtu, 09.00 - 17.00 WIB";
  const rawWa = (formData.get("whatsappNumber") as string)?.trim() || "6281234567890";
  // Sanitasi nomor WhatsApp agar formatnya angka bersih (contoh: 628...)
  const whatsappNumber = rawWa.replace(/[^\d]/g, "");
  const defaultWaText =
    (formData.get("defaultWaText") as string)?.trim() ||
    "Halo Admin First Apparel, saya ingin berkonsultasi tentang pemesanan jersey kustom.";
  const instagramUrl = sanitizeUrl((formData.get("instagramUrl") as string)?.trim() || null);
  const logoUrl = sanitizeUploadThingUrl((formData.get("logoUrl") as string)?.trim() || null);
  const logoKey = logoUrl ? (formData.get("logoKey") as string)?.trim() || null : null;
  const footerCompanyName = (formData.get("footerCompanyName") as string)?.trim() || null;
  const footerLogoUrl = sanitizeUploadThingUrl((formData.get("footerLogoUrl") as string)?.trim() || null);
  const footerLogoKey = footerLogoUrl ? (formData.get("footerLogoKey") as string)?.trim() || null : null;
  const footerLogo2Url = sanitizeUploadThingUrl((formData.get("footerLogo2Url") as string)?.trim() || null);
  const footerLogo2Key = footerLogo2Url ? (formData.get("footerLogo2Key") as string)?.trim() || null : null;
  const sizeChartUrl = sanitizeUploadThingUrl((formData.get("sizeChartUrl") as string)?.trim() || null);
  const sizeChartKey = sizeChartUrl ? (formData.get("sizeChartKey") as string)?.trim() || null : null;
  const storeDescription =
    (formData.get("storeDescription") as string)?.trim() ||
    "Konveksi spesialis jersey olahraga custom & apparel tim profesional di Bandung. Bebas custom desain, bahan dryfit premium, dan melayani kirim ke seluruh Indonesia.";
  const heroTitle =
    (formData.get("heroTitle") as string)?.trim() ||
    "Custom Jersey Olahraga";
  const heroTitleHighlight = (formData.get("heroTitleHighlight") as string)?.trim() || null;

  try {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettings)
        .set({
          storeName,
          companyName,
          storeAddress,
          googleMapsUrl,
          operatingHours,
          whatsappNumber,
          defaultWaText,
          instagramUrl,
          logoUrl,
          logoKey,
          footerCompanyName,
          footerLogoUrl,
          footerLogoKey,
          footerLogo2Url,
          footerLogo2Key,
          sizeChartUrl,
          sizeChartKey,
          storeDescription,
          heroTitle,
          heroTitleHighlight,
          updatedAt: new Date(),
        })
        .where(eq(siteSettings.id, 1));
    } else {
      await db.insert(siteSettings).values({
        id: 1,
        storeName,
        companyName,
        storeAddress,
        googleMapsUrl,
        operatingHours,
        whatsappNumber,
        defaultWaText,
        instagramUrl,
        logoUrl,
        logoKey,
        footerCompanyName,
        footerLogoUrl,
        footerLogoKey,
        footerLogo2Url,
        footerLogo2Key,
        sizeChartUrl,
        sizeChartKey,
        storeDescription,
        heroTitle,
        heroTitleHighlight,
      });
    }

    updateTag("site-settings");
    revalidatePath("/", "layout");
    revalidatePath("/api/icon");
    revalidatePath("/katalog");
    revalidatePath("/cara-pesan");
    revalidatePath("/alur-pemesanan");
    revalidatePath("/admin");
    revalidatePath("/admin/pengaturan");

    return { success: true };
  } catch (err: unknown) {
    console.error("updateSettingsAction error:", err);
    return { success: false, error: "Gagal menyimpan pengaturan toko." };
  }
}
