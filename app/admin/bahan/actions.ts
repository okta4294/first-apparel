"use server";

import { db } from "@/lib/db";
import { fabrics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath, updateTag } from "next/cache";

export async function createFabricAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const sortOrder = Number(formData.get("sortOrder")) || 0;
  const isActive = formData.get("isActive") === "on";

  if (!name || !description) {
    return { success: false, error: "Nama kain dan deskripsi karakteristik wajib diisi." };
  }

  try {
    const [created] = await db
      .insert(fabrics)
      .values({
        name,
        description,
        sortOrder,
        isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    updateTag("fabrics");
    revalidatePath("/cara-pesan");
    revalidatePath("/alur-pemesanan");
    revalidatePath("/katalog");
    revalidatePath("/admin/bahan");
    revalidatePath("/admin/katalog");

    return { success: true, item: created };
  } catch (err: unknown) {
    console.error("createFabricAction error:", err);
    return { success: false, error: "Gagal menambahkan data bahan kain." };
  }
}

export async function updateFabricAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const id = Number(formData.get("id"));
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const sortOrder = Number(formData.get("sortOrder")) || 0;
  const isActive = formData.get("isActive") === "on";

  if (!id || !name || !description) {
    return { success: false, error: "Data bahan kain tidak lengkap." };
  }

  try {
    await db
      .update(fabrics)
      .set({
        name,
        description,
        sortOrder,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(fabrics.id, id));

    updateTag("fabrics");
    revalidatePath("/cara-pesan");
    revalidatePath("/alur-pemesanan");
    revalidatePath("/katalog");
    revalidatePath("/admin/bahan");
    revalidatePath("/admin/katalog");

    return { success: true };
  } catch (err: unknown) {
    console.error("updateFabricAction error:", err);
    return { success: false, error: "Gagal memperbarui data bahan kain." };
  }
}

export async function deleteFabricAction(id: number) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  try {
    await db.delete(fabrics).where(eq(fabrics.id, id));

    updateTag("fabrics");
    revalidatePath("/cara-pesan");
    revalidatePath("/alur-pemesanan");
    revalidatePath("/katalog");
    revalidatePath("/admin/bahan");
    revalidatePath("/admin/katalog");

    return { success: true };
  } catch (err: unknown) {
    console.error("deleteFabricAction error:", err);
    return { success: false, error: "Gagal menghapus bahan kain." };
  }
}
