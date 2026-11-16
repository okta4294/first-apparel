import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin-shell";
import { SettingsForm } from "./settings-form";

export const instant = false;

export default async function AdminPengaturanPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let settings: typeof siteSettings.$inferSelect | null = null;

  try {
    const [s] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
    settings = s || null;
  } catch {
    // Fallback jika database belum ada data
  }

  return (
    <AdminShell session={session} active="pengaturan">
      <SettingsForm initialSettings={settings} />
    </AdminShell>
  );
}
