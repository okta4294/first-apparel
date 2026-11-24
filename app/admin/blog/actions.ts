"use server";

import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { utapi, sanitizeUploadThingUrl } from "@/lib/uploadthing-server";
import { revalidatePath, updateTag } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export async function createBlogAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const title = (formData.get("title") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const thumbnailUrl = sanitizeUploadThingUrl((formData.get("thumbnailUrl") as string)?.trim());
  const thumbnailKey = (formData.get("thumbnailKey") as string)?.trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !thumbnailUrl || !thumbnailKey) {
    return { success: false, error: "Judul dan gambar thumbnail artikel wajib diisi." };
  }

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  // Tambahkan timestamp acak jika slug sudah ada
  const existing = await db.select().from(blogs).where(eq(blogs.slug, slug)).limit(1);
  if (existing.length > 0) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  try {
    const [created] = await db
      .insert(blogs)
      .values({
        title,
        slug,
        excerpt: excerpt || title,
        content: content || excerpt || title,
        thumbnailUrl,
        thumbnailKey,
        isPublished,
        publishedAt: new Date(),
      })
      .returning();

    updateTag("blogs");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin");
    revalidatePath("/admin/blog");

    return { success: true, item: created };
  } catch (err: unknown) {
    console.error("createBlogAction error:", err);
    return { success: false, error: "Gagal menyimpan artikel blog." };
  }
}

export async function updateBlogAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak: sesi telah berakhir." };
  }

  const id = Number(formData.get("id"));
  const title = (formData.get("title") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const thumbnailUrl = sanitizeUploadThingUrl((formData.get("thumbnailUrl") as string)?.trim());
  const thumbnailKey = (formData.get("thumbnailKey") as string)?.trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!id || !title || !thumbnailUrl || !thumbnailKey) {
    return { success: false, error: "Data artikel tidak lengkap." };
  }

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  try {
    const existing = await db
      .select({ thumbnailKey: blogs.thumbnailKey })
      .from(blogs)
      .where(eq(blogs.id, id))
      .limit(1);
    const dbOldThumbnailKey = existing[0]?.thumbnailKey;

    await db
      .update(blogs)
      .set({
        title,
        slug,
        excerpt: excerpt || title,
        content: content || excerpt || title,
        thumbnailUrl,
        thumbnailKey,
        isPublished,
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id));

    // Bersihkan gambar lama jika diganti
    if (dbOldThumbnailKey && dbOldThumbnailKey !== thumbnailKey) {
      await utapi.deleteFiles(dbOldThumbnailKey);
    }

    updateTag("blogs");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (err: unknown) {
    console.error("updateBlogAction error:", err);
    return { success: false, error: "Gagal memperbarui artikel." };
  }
}

export async function deleteBlogAction(id: number, _thumbnailKey?: string) {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Akses ditolak." };
  }

  try {
    const existing = await db
      .select({ thumbnailKey: blogs.thumbnailKey })
      .from(blogs)
      .where(eq(blogs.id, id))
      .limit(1);

    await db.delete(blogs).where(eq(blogs.id, id));

    const keyToDelete = existing[0]?.thumbnailKey;
    if (keyToDelete) {
      await utapi.deleteFiles(keyToDelete);
    }

    updateTag("blogs");
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (err: unknown) {
    console.error("deleteBlogAction error:", err);
    return { success: false, error: "Gagal menghapus artikel." };
  }
}
