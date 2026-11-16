import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { catalogs } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AdminShell } from "@/components/admin-shell";
import { CatalogManager } from "./catalog-manager";

export const instant = false;

export default async function AdminKatalogPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let items: (typeof catalogs.$inferSelect)[] = [];

  try {
    items = await db
      .select()
      .from(catalogs)
      .orderBy(desc(catalogs.createdAt));
  } catch {
    // Fallback jika query database sedang terhambat
  }

  return (
    <AdminShell session={session} active="katalog">
      <CatalogManager initialItems={items} />
    </AdminShell>
  );
}
