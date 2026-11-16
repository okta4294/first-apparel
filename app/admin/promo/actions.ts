"use server";

import { db } from "@/lib/db";
import { promos } from "@/lib/db/schema";
import { eq, desc, or } from "drizzle-orm";
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
    const [created] = await db
      .insert(promos)
      .values({
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
      .returning();

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/promo");

    return { success: true, item: created };
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

  let targetId = Number(formData.get("id"));
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

  // Penanganan aman jika ID yang dikirim berupa angka waktu milidetik (> 2.147.483.647) dari cache browser lama
  if (targetId > 2147483647) {
    if (imageKey || oldImageKey) {
      const matchConditions = [];
      if (imageKey) matchConditions.push(eq(promos.imageKey, imageKey));
      if (oldImageKey) matchConditions.push(eq(promos.imageKey, oldImageKey));

      if (matchConditions.length > 0) {
        const match = await db
          .select({ id: promos.id })
          .from(promos)
          .where(matchConditions.length === 1 ? matchConditions[0] : or(...matchConditions))
          .limit(1);

        if (match.length > 0) {
          targetId = match[0].id;
        }
      }
    }

    if (targetId > 2147483647 && title) {
      const matchTitle = await db
        .select({ id: promos.id })
        .from(promos)
        .where(eq(promos.title, title))
        .orderBy(desc(promos.id))
        .limit(1);
      if (matchTitle.length > 0) {
        targetId = matchTitle[0].id;
      }
    }

    if (targetId > 2147483647) {
      const [latest] = await db
        .select({ id: promos.id })
        .from(promos)
        .orderBy(desc(promos.id))
        .limit(1);
      if (latest) {
        targetId = latest.id;
      }
    }
  }

  if (!targetId || targetId > 2147483647 || !title) {
    return { success: false, error: "Data promo tidak valid. Silakan refresh halaman browser Anda." };
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
      .where(eq(promos.id, targetId));

    // Jika banner lama diganti atau dihapus, bersihkan dari UploadThing
    if (oldImageKey && oldImageKey !== imageKey) {
      await utapi.deleteFiles(oldImageKey);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/promo");

    return { success: true, updatedId: targetId };
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

  let targetId = id;
  if (targetId > 2147483647) {
    if (imageKey) {
      const match = await db
        .select({ id: promos.id })
        .from(promos)
        .where(eq(promos.imageKey, imageKey))
        .limit(1);
      if (match.length > 0) {
        targetId = match[0].id;
      }
    }
  }

  // Jika tetap melebihi batas, record palsu tersebut tidak ada di database
  if (targetId > 2147483647) {
    return { success: true, updatedId: targetId };
  }

  try {
    await db.delete(promos).where(eq(promos.id, targetId));

    if (imageKey) {
      await utapi.deleteFiles(imageKey);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/promo");

    return { success: true, updatedId: targetId };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus promo.";
    return { success: false, error: msg };
  }
}
