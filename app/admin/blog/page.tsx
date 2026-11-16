import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { blogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AdminShell } from "@/components/admin-shell";
import { BlogManager } from "./blog-manager";

export const instant = false;

export default async function AdminBlogPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let items: (typeof blogs.$inferSelect)[] = [];

  try {
    items = await db.select().from(blogs).orderBy(desc(blogs.publishedAt));
  } catch {
    // Fallback jika query database sedang terhambat
  }

  return (
    <AdminShell session={session} active="blog">
      <BlogManager initialItems={items} />
    </AdminShell>
  );
}
