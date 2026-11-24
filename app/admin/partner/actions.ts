"use server";

import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { utapi, sanitizeUploadThingUrl } from "@/lib/uploadthing-server";
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

export async function createPartnerAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const name = (formData.get("name") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || null;
  const logoUrl = sanitizeUploadThingUrl((formData.get("logoUrl") as string)?.trim());
  const logoKey = (formData.get("logoKey") as string)?.trim();
  const rawWebsiteUrl = (formData.get("websiteUrl") as string)?.trim() || null;
  const websiteUrl = sanitizeUrl(rawWebsiteUrl);
  const sortOrder = Number(formData.get("sortOrder")) || 0;
  const isActive = formData.get("isActive") === "on";

  if (!name || !logoUrl || !logoKey) {
    return { success: false, error: "Nama partner dan logo wajib diisi." };
  }

  try {
    const [created] = await db
      .insert(partners)
      .values({
        name,
        category,
        logoUrl,
        logoKey,
        websiteUrl,
        sortOrder,
        isActive,
      })
      .returning();

    updateTag("partners");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/partner");

    return { success: true, item: created };
  } catch (err: unknown) {
    console.error("createPartnerAction error:", err);
    return { success: false, error: "Gagal menyimpan partner." };
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
  const logoUrl = sanitizeUploadThingUrl((formData.get("logoUrl") as string)?.trim());
  const logoKey = (formData.get("logoKey") as string)?.trim();
  const rawWebsiteUrl = (formData.get("websiteUrl") as string)?.trim() || null;
  const websiteUrl = sanitizeUrl(rawWebsiteUrl);
  const sortOrder = Number(formData.get("sortOrder")) || 0;
  const isActive = formData.get("isActive") === "on";

  if (!id || !name || !logoUrl || !logoKey) {
    return { success: false, error: "Data partner tidak lengkap." };
  }

  try {
    const existing = await db
      .select({ logoKey: partners.logoKey })
      .from(partners)
      .where(eq(partners.id, id))
      .limit(1);
    const dbOldLogoKey = existing[0]?.logoKey;

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

    if (dbOldLogoKey && dbOldLogoKey !== logoKey) {
      await utapi.deleteFiles(dbOldLogoKey);
    }

    updateTag("partners");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/partner");

    return { success: true };
  } catch (err: unknown) {
    console.error("updatePartnerAction error:", err);
    return { success: false, error: "Gagal memperbarui partner." };
  }
}

export async function deletePartnerAction(id: number, _logoKey?: string) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak." };
  }

  try {
    const existing = await db
      .select({ logoKey: partners.logoKey })
      .from(partners)
      .where(eq(partners.id, id))
      .limit(1);

    await db.delete(partners).where(eq(partners.id, id));

    const keyToDelete = existing[0]?.logoKey;
    if (keyToDelete) {
      await utapi.deleteFiles(keyToDelete);
    }

    updateTag("partners");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/partner");

    return { success: true };
  } catch (err: unknown) {
    console.error("deletePartnerAction error:", err);
    return { success: false, error: "Gagal menghapus partner." };
  }
}
