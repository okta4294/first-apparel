import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

export async function GET() {
  try {
    const [s] = await db
      .select({ logoUrl: siteSettings.logoUrl })
      .from(siteSettings)
      .limit(1);

    if (s?.logoUrl && (s.logoUrl.startsWith("https://") || s.logoUrl.startsWith("http://"))) {
      return NextResponse.redirect(s.logoUrl, {
        status: 307,
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        },
      });
    }
  } catch {
    // Kembalikan respons kosong jika DB belum tersedia
  }

  return new NextResponse(null, { status: 204 });
}
