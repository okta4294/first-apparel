import { NextResponse } from "next/server";
import sharp from "sharp";
import { getSiteSettings } from "@/lib/public-data";

export async function GET() {
  try {
    const s = await getSiteSettings();

    if (s.logoUrl && (s.logoUrl.startsWith("https://") || s.logoUrl.startsWith("http://"))) {
      const res = await fetch(s.logoUrl, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        const inputBuffer = Buffer.from(await res.arrayBuffer());
        const pngBuffer = await sharp(inputBuffer)
          .resize(192, 192, {
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png()
          .toBuffer();

        return new NextResponse(new Uint8Array(pngBuffer), {
          status: 200,
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        });
      }
    }
  } catch {
    // Kembalikan respons kosong jika DB atau gambar belum tersedia
  }

  return new NextResponse(null, { status: 204 });
}
