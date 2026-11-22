"use server";

import { db } from "@/lib/db";
import { catalogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { utapi } from "@/lib/uploadthing-server";
import { revalidatePath, updateTag } from "next/cache";

export async function createCatalogAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const title = (formData.get("title") as string)?.trim();
  const category = (formData.get("category") as string)?.trim().toUpperCase() || "CUSTOM LAINNYA";
  const fabric = (formData.get("fabric") as string)?.trim() || "Dryfit Brazil Original";
  const priceInfo = (formData.get("priceInfo") as string)?.trim() || "Mulai Rp 125.000 / pcs";
  const isFeatured = formData.get("isFeatured") === "on";

  // Tangani multi-gambar (maksimal 4)
  const imagesRaw = (formData.get("images") as string)?.trim();
  let images: { url: string; key: string }[] = [];
  try {
    if (imagesRaw) images = JSON.parse(imagesRaw);
  } catch {
    images = [];
  }

  // Fallback single image
  const singleUrl = (formData.get("imageUrl") as string)?.trim();
  const singleKey = (formData.get("imageKey") as string)?.trim();
  if (images.length === 0 && singleUrl && singleKey) {
    images = [{ url: singleUrl, key: singleKey }];
  }

  const imageUrl = images[0]?.url || singleUrl || "";
  const imageKey = images[0]?.key || singleKey || "";

  // Size chart
  const sizeChartUrl = (formData.get("sizeChartUrl") as string)?.trim() || null;
  const sizeChartKey = (formData.get("sizeChartKey") as string)?.trim() || null;

  if (!title || !imageUrl || !imageKey) {
    return { success: false, error: "Judul dan setidaknya 1 foto produk wajib diunggah." };
  }

  try {
    const [created] = await db
      .insert(catalogs)
      .values({
        title,
        category,
        fabric,
        priceInfo,
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
  const fabric = (formData.get("fabric") as string)?.trim() || "Dryfit Brazil Original";
  const priceInfo = (formData.get("priceInfo") as string)?.trim() || "Mulai Rp 125.000 / pcs";
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";

  // Tangani multi-gambar
  const imagesRaw = (formData.get("images") as string)?.trim();
  let images: { url: string; key: string }[] = [];
  try {
    if (imagesRaw) images = JSON.parse(imagesRaw);
  } catch {
    images = [];
  }

  const singleUrl = (formData.get("imageUrl") as string)?.trim();
  const singleKey = (formData.get("imageKey") as string)?.trim();
  if (images.length === 0 && singleUrl && singleKey) {
    images = [{ url: singleUrl, key: singleKey }];
  }

  const imageUrl = images[0]?.url || singleUrl || "";
  const imageKey = images[0]?.key || singleKey || "";

  // Size chart
  const sizeChartUrl = (formData.get("sizeChartUrl") as string)?.trim() || null;
  const sizeChartKey = (formData.get("sizeChartKey") as string)?.trim() || null;
  const oldSizeChartKey = (formData.get("oldSizeChartKey") as string)?.trim();

  // Berkas yang dihapus saat pengeditan
  const deletedKeysRaw = (formData.get("deletedKeys") as string)?.trim();
  let deletedKeys: string[] = [];
  try {
    if (deletedKeysRaw) deletedKeys = JSON.parse(deletedKeysRaw);
  } catch {
    deletedKeys = [];
  }

  if (!id || !title || !imageUrl || !imageKey) {
    return { success: false, error: "Data produk tidak lengkap: judul dan foto utama wajib ada." };
  }

  try {
    await db
      .update(catalogs)
      .set({
        title,
        category,
        fabric,
        priceInfo,
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

    // Bersihkan berkas yang dihapus dari UploadThing
    if (deletedKeys.length > 0) {
      await utapi.deleteFiles(deletedKeys);
    }

    // Bersihkan size chart lama jika diganti
    if (oldSizeChartKey && oldSizeChartKey !== sizeChartKey) {
      await utapi.deleteFiles(oldSizeChartKey);
    }

    updateTag("catalogs");
    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath("/admin");
    revalidatePath("/admin/katalog");

    return { success: true };
  } catch (err: unknown) {
    console.error("updateCatalogAction error:", err);
    return { success: false, error: "Gagal memperbarui katalog." };
  }
}

export async function deleteCatalogAction(id: number, allKeys: string[] | string) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak." };
  }

  try {
    // 1. Hapus dari database Neon
    await db.delete(catalogs).where(eq(catalogs.id, id));

    // 2. Hapus semua file fisik dari UploadThing (galeri foto + size chart)
    const keysToDelete: string[] = [];
    if (Array.isArray(allKeys)) {
      keysToDelete.push(...allKeys.filter(Boolean));
    } else if (typeof allKeys === "string" && allKeys) {
      try {
        const parsed = JSON.parse(allKeys);
        if (Array.isArray(parsed)) keysToDelete.push(...parsed.filter(Boolean));
        else keysToDelete.push(allKeys);
      } catch {
        keysToDelete.push(allKeys);
      }
    }

    if (keysToDelete.length > 0) {
      await utapi.deleteFiles(keysToDelete);
    }

    updateTag("catalogs");
    revalidatePath("/");
    revalidatePath("/katalog");
    revalidatePath("/admin");
    revalidatePath("/admin/katalog");

    return { success: true };
  } catch (err: unknown) {
    console.error("deleteCatalogAction error:", err);
    return { success: false, error: "Gagal menghapus produk." };
  }
}
