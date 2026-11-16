"use server";

import { db } from "@/lib/db";
import { fabrics } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
    await db.insert(fabrics).values({
      name,
      description,
      sortOrder,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/cara-pesan");
    revalidatePath("/alur-pemesanan");
    revalidatePath("/admin/bahan");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menambahkan data bahan kain.";
    return { success: false, error: msg };
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

    revalidatePath("/cara-pesan");
    revalidatePath("/alur-pemesanan");
    revalidatePath("/admin/bahan");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui data bahan kain.";
    return { success: false, error: msg };
  }
}

export async function deleteFabricAction(id: number) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  try {
    await db.delete(fabrics).where(eq(fabrics.id, id));

    revalidatePath("/cara-pesan");
    revalidatePath("/alur-pemesanan");
    revalidatePath("/admin/bahan");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus bahan kain.";
    return { success: false, error: msg };
  }
}
