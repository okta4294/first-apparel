import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { catalogs, fabrics } from "@/lib/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin-shell";
import { CatalogManager } from "./catalog-manager";

export const instant = false;

export default async function AdminKatalogPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let items: (typeof catalogs.$inferSelect)[] = [];
  let fabricList: { id: number; name: string; description: string }[] = [];

  try {
    [items, fabricList] = await Promise.all([
      db.select().from(catalogs).orderBy(desc(catalogs.createdAt)),
      db
        .select({
          id: fabrics.id,
          name: fabrics.name,
          description: fabrics.description,
        })
        .from(fabrics)
        .where(eq(fabrics.isActive, true))
        .orderBy(asc(fabrics.sortOrder), asc(fabrics.id)),
    ]);
  } catch {
    // Fallback jika query database sedang terhambat
  }

  return (
    <AdminShell session={session} active="katalog">
      <CatalogManager initialItems={items} fabrics={fabricList} />
    </AdminShell>
  );
}
