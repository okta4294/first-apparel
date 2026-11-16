import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { partners } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { AdminShell } from "@/components/admin-shell";
import { PartnerManager } from "./partner-manager";

export const instant = false;

export default async function AdminPartnerPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let items: (typeof partners.$inferSelect)[] = [];

  try {
    items = await db.select().from(partners).orderBy(asc(partners.sortOrder));
  } catch {
    // Fallback jika query database sedang terhambat
  }

  return (
    <AdminShell session={session} active="partner">
      <PartnerManager initialItems={items} />
    </AdminShell>
  );
}
