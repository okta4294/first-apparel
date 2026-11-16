"use server";

import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { utapi } from "@/lib/uploadthing-server";
import { revalidatePath } from "next/cache";

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

export async function createPartnerAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const name = (formData.get("name") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || null;
  const logoUrl = (formData.get("logoUrl") as string)?.trim();
  const logoKey = (formData.get("logoKey") as string)?.trim();
  const rawWebsiteUrl = (formData.get("websiteUrl") as string)?.trim() || null;
  const websiteUrl = sanitizeUrl(rawWebsiteUrl);
  const sortOrder = Number(formData.get("sortOrder")) || 0;
  const isActive = formData.get("isActive") === "on";

  if (!name || !logoUrl || !logoKey) {
    return { success: false, error: "Nama partner dan logo wajib diisi." };
  }

  try {
    await db.insert(partners).values({
      name,
      category,
      logoUrl,
      logoKey,
      websiteUrl,
      sortOrder,
      isActive,
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/partner");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan partner.";
    return { success: false, error: msg };
  }
}

export async function updatePartnerAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const id = Number(formData.get("id"));
  const name = (formData.get("name") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || null;
  const logoUrl = (formData.get("logoUrl") as string)?.trim();
  const logoKey = (formData.get("logoKey") as string)?.trim();
  const oldLogoKey = (formData.get("oldLogoKey") as string)?.trim();
  const rawWebsiteUrl = (formData.get("websiteUrl") as string)?.trim() || null;
  const websiteUrl = sanitizeUrl(rawWebsiteUrl);
  const sortOrder = Number(formData.get("sortOrder")) || 0;
  const isActive = formData.get("isActive") === "on";

  if (!id || !name || !logoUrl || !logoKey) {
    return { success: false, error: "Data partner tidak lengkap." };
  }

  try {
    await db
      .update(partners)
      .set({
        name,
        category,
        logoUrl,
        logoKey,
        websiteUrl,
        sortOrder,
        isActive,
      })
      .where(eq(partners.id, id));

    if (oldLogoKey && oldLogoKey !== logoKey) {
      await utapi.deleteFiles(oldLogoKey);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/partner");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memperbarui partner.";
    return { success: false, error: msg };
  }
}

export async function deletePartnerAction(id: number, logoKey: string) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak." };
  }

  try {
    await db.delete(partners).where(eq(partners.id, id));

    if (logoKey) {
      await utapi.deleteFiles(logoKey);
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/partner");

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menghapus partner.";
    return { success: false, error: msg };
  }
}
