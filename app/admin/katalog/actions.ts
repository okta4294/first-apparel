"use server";

import { db } from "@/lib/db";
import { catalogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { utapi, sanitizeUploadThingUrl } from "@/lib/uploadthing-server";
import { revalidatePath, updateTag } from "next/cache";

function sanitizeImageGallery(raw: string | null | undefined): { url: string; key: string }[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid: { url: string; key: string }[] = [];
    for (const item of parsed) {
      const safeUrl = sanitizeUploadThingUrl(item?.url);
      const safeKey = typeof item?.key === "string" ? item.key.trim() : "";
      if (safeUrl && safeKey) {
        valid.push({ url: safeUrl, key: safeKey });
      }
    }
    return valid;
  } catch {
    return [];
  }
}

export async function createCatalogAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim().toUpperCase() || "CUSTOM LAINNYA";
  const description = (formData.get("description") as string)?.trim() || null;
  const minOrder = (formData.get("minOrder") as string)?.trim() || null;
  const isFeatured = formData.get("isFeatured") === "on";

  // Tangani multi-gambar (maksimal 4)
  const imagesRaw = (formData.get("images") as string)?.trim();
  let images = sanitizeImageGallery(imagesRaw);

  // Fallback single image
  const singleUrl = sanitizeUploadThingUrl((formData.get("imageUrl") as string)?.trim());
  const singleKey = (formData.get("imageKey") as string)?.trim();
  if (images.length === 0 && singleUrl && singleKey) {
    images = [{ url: singleUrl, key: singleKey }];
  }

  const imageUrl = images[0]?.url || singleUrl || "";
  const imageKey = images[0]?.key || (singleUrl ? singleKey : "") || "";

  // Size chart
  const sizeChartUrl = sanitizeUploadThingUrl((formData.get("sizeChartUrl") as string)?.trim() || null);
  const sizeChartKey = sizeChartUrl ? (formData.get("sizeChartKey") as string)?.trim() || null : null;

  if (!title || !imageUrl || !imageKey) {
    return { success: false, error: "Judul dan setidaknya 1 foto produk wajib diunggah." };
  }

  try {
    const [created] = await db
      .insert(catalogs)
      .values({
        title,
        category,
        description,
        minOrder,
        imageUrl,
        imageKey,
        images: JSON.stringify(images),
        sizeChartUrl,
        sizeChartKey,
        isFeatured,
        isActive: true,
      })
      .returning();

    updateTag("catalogs");
    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath(`/katalog/${created.id}`);
    revalidatePath("/admin");
    revalidatePath("/admin/katalog");

    return { success: true, item: created };
  } catch (err: unknown) {
    console.error("createCatalogAction error:", err);
    return { success: false, error: "Gagal menyimpan katalog." };
  }
}

export async function updateCatalogAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const id = Number(formData.get("id"));
  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim().toUpperCase() || "CUSTOM LAINNYA";
  const description = (formData.get("description") as string)?.trim() || null;
  const minOrder = (formData.get("minOrder") as string)?.trim() || null;
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";

  // Tangani multi-gambar
  const imagesRaw = (formData.get("images") as string)?.trim();
  let images = sanitizeImageGallery(imagesRaw);

  const singleUrl = sanitizeUploadThingUrl((formData.get("imageUrl") as string)?.trim());
  const singleKey = (formData.get("imageKey") as string)?.trim();
  if (images.length === 0 && singleUrl && singleKey) {
    images = [{ url: singleUrl, key: singleKey }];
  }

  const imageUrl = images[0]?.url || singleUrl || "";
  const imageKey = images[0]?.key || (singleUrl ? singleKey : "") || "";

  // Size chart
  const sizeChartUrl = sanitizeUploadThingUrl((formData.get("sizeChartUrl") as string)?.trim() || null);
  const sizeChartKey = sizeChartUrl ? (formData.get("sizeChartKey") as string)?.trim() || null : null;

  if (!id || !title || !imageUrl || !imageKey) {
    return { success: false, error: "Data produk tidak lengkap: judul dan foto utama wajib ada." };
  }

  try {
    const existing = await db
      .select({
        imageKey: catalogs.imageKey,
        images: catalogs.images,
        sizeChartKey: catalogs.sizeChartKey,
      })
      .from(catalogs)
      .where(eq(catalogs.id, id))
      .limit(1);

    const oldKeys = new Set<string>();
    if (existing[0]?.imageKey) oldKeys.add(existing[0].imageKey);
    for (const img of sanitizeImageGallery(existing[0]?.images)) {
      oldKeys.add(img.key);
    }
    const newKeys = new Set(images.map((img) => img.key));
    if (imageKey) newKeys.add(imageKey);
    const removedGalleryKeys = Array.from(oldKeys).filter((k) => !newKeys.has(k));
    const dbOldSizeChartKey = existing[0]?.sizeChartKey || null;

    await db
      .update(catalogs)
      .set({
        title,
        category,
        description,
        minOrder,
        imageUrl,
        imageKey,
        images: JSON.stringify(images),
        sizeChartUrl,
        sizeChartKey,
        isFeatured,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(catalogs.id, id));

    // Bersihkan berkas milik baris ini yang dihapus saat pengeditan
    if (removedGalleryKeys.length > 0) {
      await utapi.deleteFiles(removedGalleryKeys);
    }

    // Bersihkan size chart lama jika diganti
    if (dbOldSizeChartKey && dbOldSizeChartKey !== sizeChartKey) {
      await utapi.deleteFiles(dbOldSizeChartKey);
    }

    updateTag("catalogs");
    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath(`/katalog/${id}`);
    revalidatePath("/admin");
    revalidatePath("/admin/katalog");

    return { success: true };
  } catch (err: unknown) {
    console.error("updateCatalogAction error:", err);
    return { success: false, error: "Gagal memperbarui katalog." };
  }
}

export async function deleteCatalogAction(id: number, _allKeys?: string[] | string) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak." };
  }

  try {
    const existing = await db
      .select({
        imageKey: catalogs.imageKey,
        images: catalogs.images,
        sizeChartKey: catalogs.sizeChartKey,
      })
      .from(catalogs)
      .where(eq(catalogs.id, id))
      .limit(1);

    // 1. Hapus dari database Neon
    await db.delete(catalogs).where(eq(catalogs.id, id));

    // 2. Hapus semua file fisik milik produk ini dari UploadThing (galeri foto + size chart)
    const keysSet = new Set<string>();
    if (existing[0]?.imageKey) keysSet.add(existing[0].imageKey);
    if (existing[0]?.sizeChartKey) keysSet.add(existing[0].sizeChartKey);
    for (const img of sanitizeImageGallery(existing[0]?.images)) {
      keysSet.add(img.key);
    }
    const keysToDelete = Array.from(keysSet);

    if (keysToDelete.length > 0) {
      await utapi.deleteFiles(keysToDelete);
    }

    updateTag("catalogs");
    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath(`/katalog/${id}`);
    revalidatePath("/admin");
    revalidatePath("/admin/katalog");

    return { success: true };
  } catch (err: unknown) {
    console.error("deleteCatalogAction error:", err);
    return { success: false, error: "Gagal menghapus produk." };
  }
}
