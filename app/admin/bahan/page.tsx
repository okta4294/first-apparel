import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { fabrics } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { AdminShell } from "@/components/admin-shell";
import { FabricManager } from "./fabric-manager";

export const instant = false;

export default async function AdminBahanPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let items: (typeof fabrics.$inferSelect)[] = [];

  try {
    items = await db
      .select()
      .from(fabrics)
      .orderBy(asc(fabrics.sortOrder), asc(fabrics.id));
  } catch {
    // Fallback jika query bermasalah
  }

  return (
    <AdminShell session={session} active="bahan">
      <FabricManager initialItems={items} />
    </AdminShell>
  );
}
