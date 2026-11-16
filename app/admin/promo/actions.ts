"use server";

import { db } from "@/lib/db";
import { promos } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { utapi } from "@/lib/uploadthing-server";
import { revalidatePath } from "next/cache";

export async function createPromoAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const label = (formData.get("label") as string)?.trim() || "PROMO SPESIAL";
  const title = (formData.get("title") as string)?.trim();
  const badgeText = (formData.get("badgeText") as string)?.trim() || "DISKON";
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const imageKey = (formData.get("imageKey") as string)?.trim() || null;
  const waMessage =
    (formData.get("waMessage") as string)?.trim() ||
    "Halo Admin First Apparel, saya ingin klaim promo di website.";
  const hasDuration = formData.get("hasDuration") === "on";
  const startDateRaw = formData.get("startDate") as string;
  const endDateRaw = formData.get("endDate") as string;
  const isActive = formData.get("isActive") === "on";
  const isPopup = formData.get("isPopup") === "on";

  if (!title) {
    return { success: false, error: "Judul promo wajib diisi." };
  }

  const startDate = hasDuration && startDateRaw ? new Date(startDateRaw) : null;
  const endDate = hasDuration && endDateRaw ? new Date(endDateRaw) : null;

  try {
    await db.insert(promos).values({
      label,
      title,
      badgeText,
      imageUrl,
      imageKey,
      waMessage,
      hasDuration,
      startDate,
      endDate,
      isActive,
      isPopup,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/promo");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan promo.";
    return { success: false, error: msg };
  }
}

export async function updatePromoAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const id = Number(formData.get("id"));
  const label = (formData.get("label") as string)?.trim() || "PROMO SPESIAL";
  const title = (formData.get("title") as string)?.trim();
  const badgeText = (formData.get("badgeText") as string)?.trim() || "DISKON";
  const imageUrl = (formData.get("imageUrl") as string)?.trim() || null;
  const imageKey = (formData.get("imageKey") as string)?.trim() || null;
  const oldImageKey = (formData.get("oldImageKey") as string)?.trim();
  const waMessage =
    (formData.get("waMessage") as string)?.trim() ||
    "Halo Admin First Apparel, saya ingin klaim promo di website.";
  const hasDuration = formData.get("hasDuration") === "on";
  const startDateRaw = formData.get("startDate") as string;
  const endDateRaw = formData.get("endDate") as string;
  const isActive = formData.get("isActive") === "on";
  const isPopup = formData.get("isPopup") === "on";

  if (!id || !title) {
    return { success: false, error: "Data promo tidak lengkap." };
  }

  const startDate = hasDuration && startDateRaw ? new Date(startDateRaw) : null;
  const endDate = hasDuration && endDateRaw ? new Date(endDateRaw) : null;

  try {
    await db
      .update(promos)
      .set({
        label,
        title,
        badgeText,
        imageUrl,
        imageKey,
        waMessage,
        hasDuration,
        startDate,
        endDate,
        isActive,
        isPopup,
      })
      .where(eq(promos.id, id));

    // Jika banner lama diganti atau dihapus, bersihkan dari UploadThing
    if (oldImageKey && oldImageKey !== imageKey) {
      await utapi.deleteFiles(oldImageKey);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/promo");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui promo.";
    return { success: false, error: msg };
  }
}

export async function deletePromoAction(id: number, imageKey: string | null) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak." };
  }

  try {
    await db.delete(promos).where(eq(promos.id, id));

    if (imageKey) {
      await utapi.deleteFiles(imageKey);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/promo");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus promo.";
    return { success: false, error: msg };
  }
}
