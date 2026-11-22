import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { asc, desc } from "drizzle-orm";
import { AdminShell } from "@/components/admin-shell";
import { ReviewManager } from "./review-manager";

export const instant = false;

export default async function AdminReviewPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  let items: (typeof reviews.$inferSelect)[] = [];

  try {
    items = await db
      .select()
      .from(reviews)
      .orderBy(asc(reviews.sortOrder), desc(reviews.id));
  } catch {
    // Fallback jika tabel belum dimigrasi atau query bermasalah
  }

  return (
    <AdminShell session={session} active="review">
      <ReviewManager initialItems={items} />
    </AdminShell>
  );
}
