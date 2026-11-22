"use server";

import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { comparePassword, setAdminSessionCookie, signAdminToken, removeAdminSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export interface ActionResponse {
  error?: string;
  success?: boolean;
}

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function loginAdminAction(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = (formData.get("password") as string)?.trim();

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." };
  }

  try {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

    if (!admin) {
      return { error: "Email atau kata sandi tidak sesuai." };
    }

    const now = new Date();
    if (admin.lockedUntil && admin.lockedUntil > now) {
      return {
        error: "Email atau kata sandi tidak sesuai.",
      };
    }

    const isValid = await comparePassword(password, admin.passwordHash);
    if (!isValid) {
      const nextAttempts = admin.failedAttempts + 1;
      if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
        await db
          .update(admins)
          .set({ failedAttempts: nextAttempts, lockedUntil })
          .where(eq(admins.id, admin.id));

        return {
          error: "Email atau kata sandi tidak sesuai.",
        };
      }

      await db
        .update(admins)
        .set({ failedAttempts: nextAttempts, lockedUntil: null })
        .where(eq(admins.id, admin.id));

      return {
        error: "Email atau kata sandi tidak sesuai.",
      };
    }

    if (admin.failedAttempts > 0 || admin.lockedUntil) {
      await db
        .update(admins)
        .set({ failedAttempts: 0, lockedUntil: null })
        .where(eq(admins.id, admin.id));
    }

    const token = await signAdminToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
    });

    await setAdminSessionCookie(token);
    return { success: true };
  } catch (err: unknown) {
    console.error("loginAdminAction error:", err);
    return { error: "Gagal memproses login. Silakan coba lagi nanti." };
  }
}

export async function logoutAdminAction(): Promise<void> {
  await removeAdminSessionCookie();
  redirect("/admin/login");
}
