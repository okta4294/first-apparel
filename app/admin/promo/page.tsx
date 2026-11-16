import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { promos } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AdminShell } from "@/components/admin-shell";
import { PromoManager } from "./promo-manager";

export const instant = false;

export default async function AdminPromoPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let items: (typeof promos.$inferSelect)[] = [];

  try {
    items = await db.select().from(promos).orderBy(desc(promos.createdAt));
  } catch {
    // Fallback jika query database sedang terhambat
  }

  return (
    <AdminShell session={session} active="promo">
      <PromoManager initialItems={items} />
    </AdminShell>
  );
}
