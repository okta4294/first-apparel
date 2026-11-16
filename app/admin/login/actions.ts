"use server";

import { db } from "@/lib/db";
import { admins } from "@/lib/db/schema";
import { comparePassword, hashPassword, setAdminSessionCookie, signAdminToken, removeAdminSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export interface ActionResponse {
  error?: string;
  success?: boolean;
}

interface RateLimitEntry {
  attempts: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, RateLimitEntry>();
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

  const now = Date.now();
  const currentLimit = loginAttempts.get(email);

  if (currentLimit?.lockedUntil && currentLimit.lockedUntil > now) {
    const remainingMinutes = Math.ceil((currentLimit.lockedUntil - now) / 60000);
    return {
      error: `Terlalu banyak percobaan gagal. Akun dikunci sementara selama ${remainingMinutes} menit demi keamanan.`,
    };
  }

  const recordFailedAttempt = () => {
    const entry = loginAttempts.get(email) || { attempts: 0 };
    entry.attempts += 1;
    if (entry.attempts >= MAX_FAILED_ATTEMPTS) {
      entry.lockedUntil = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
      loginAttempts.set(email, entry);
      return `Terlalu banyak percobaan salah (${MAX_FAILED_ATTEMPTS} kali). Akun dikunci sementara selama ${LOCKOUT_MINUTES} menit.`;
    }
    loginAttempts.set(email, entry);
    const remaining = MAX_FAILED_ATTEMPTS - entry.attempts;
    return `Email atau kata sandi tidak sesuai. Sisa kesempatan: ${remaining} kali sebelum akun terkunci.`;
  };

  try {
    const existingAdmins = await db.select().from(admins);

    // Jika basis data masih baru dan belum ada admin sama sekali, daftarkan akun pertama ini sebagai admin utama
    if (existingAdmins.length === 0) {
      const passwordHash = await hashPassword(password);
      const [newAdmin] = await db
        .insert(admins)
        .values({
          name: "Admin First Apparel",
          email,
          passwordHash,
        })
        .returning();

      const token = await signAdminToken({
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
      });

      loginAttempts.delete(email);
      await setAdminSessionCookie(token);
      return { success: true };
    }

    // Cari akun admin berdasarkan email
    const [admin] = await db.select().from(admins).where(eq(admins.email, email)).limit(1);

    if (!admin) {
      return { error: recordFailedAttempt() };
    }

    const isValid = await comparePassword(password, admin.passwordHash);
    if (!isValid) {
      return { error: recordFailedAttempt() };
    }

    // Reset percobaan gagal jika login berhasil
    loginAttempts.delete(email);

    // Jika kata sandi di database sebelumnya berupa teks biasa (diinput manual di Neon DB),
    // otomatis tingkatkan keamanannya dengan hashing bcrypt
    if (!admin.passwordHash.startsWith("$2")) {
      const newHash = await hashPassword(password);
      await db.update(admins).set({ passwordHash: newHash }).where(eq(admins.id, admin.id));
    }

    const token = await signAdminToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
    });

    await setAdminSessionCookie(token);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan sistem";
    return { error: `Gagal memproses login: ${message}` };
  }
}

export async function logoutAdminAction(): Promise<void> {
  await removeAdminSessionCookie();
  redirect("/admin/login");
}
