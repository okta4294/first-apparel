import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/public-data";

export async function GET() {
  try {
    const s = await getSiteSettings();

    if (s.logoUrl && (s.logoUrl.startsWith("https://") || s.logoUrl.startsWith("http://"))) {
      return NextResponse.redirect(s.logoUrl, {
        status: 307,
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
      });
    }
  } catch {
    // Kembalikan respons kosong jika DB belum tersedia
  }

  return new NextResponse(null, { status: 204 });
}
