"use server";

import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath, updateTag } from "next/cache";

function clampRating(raw: FormDataEntryValue | null): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(5, Math.max(1, Math.round(parsed)));
}

export async function createReviewAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const customerName = (formData.get("customerName") as string)?.trim();
  const teamOrRole = (formData.get("teamOrRole") as string)?.trim() || null;
  const productName = (formData.get("productName") as string)?.trim() || null;
  const rating = clampRating(formData.get("rating"));
  const comment = (formData.get("comment") as string)?.trim();
  const sortOrder = Number(formData.get("sortOrder")) || 0;
  const isActive = formData.get("isActive") === "on";

  if (!customerName || !comment) {
    return { success: false, error: "Nama pelanggan dan isi ulasan wajib diisi." };
  }

  try {
    const [created] = await db
      .insert(reviews)
      .values({
        customerName,
        teamOrRole,
        productName,
        rating,
        comment,
        sortOrder,
        isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    updateTag("reviews");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/review");

    return { success: true, item: created };
  } catch (err: unknown) {
    console.error("createReviewAction error:", err);
    return { success: false, error: "Gagal menambahkan ulasan pelanggan." };
  }
}

export async function updateReviewAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const id = Number(formData.get("id"));
  const customerName = (formData.get("customerName") as string)?.trim();
  const teamOrRole = (formData.get("teamOrRole") as string)?.trim() || null;
  const productName = (formData.get("productName") as string)?.trim() || null;
  const rating = clampRating(formData.get("rating"));
  const comment = (formData.get("comment") as string)?.trim();
  const sortOrder = Number(formData.get("sortOrder")) || 0;
  const isActive = formData.get("isActive") === "on";

  if (!id || !customerName || !comment) {
    return { success: false, error: "Data ulasan tidak lengkap." };
  }

  try {
    await db
      .update(reviews)
      .set({
        customerName,
        teamOrRole,
        productName,
        rating,
        comment,
        sortOrder,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(reviews.id, id));

    updateTag("reviews");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/review");

    return { success: true };
  } catch (err: unknown) {
    console.error("updateReviewAction error:", err);
    return { success: false, error: "Gagal memperbarui ulasan pelanggan." };
  }
}

export async function deleteReviewAction(id: number) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  try {
    await db.delete(reviews).where(eq(reviews.id, id));

    updateTag("reviews");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/review");

    return { success: true };
  } catch (err: unknown) {
    console.error("deleteReviewAction error:", err);
    return { success: false, error: "Gagal menghapus ulasan pelanggan." };
  }
}
