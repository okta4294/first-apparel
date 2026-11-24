import { NextResponse } from "next/server";
import sharp from "sharp";
import { getSiteSettings } from "@/lib/public-data";
import { sanitizeUploadThingUrl } from "@/lib/uploadthing-server";

const MAX_ICON_BYTES = 5 * 1024 * 1024;

export async function GET() {
  try {
    const s = await getSiteSettings();
    const safeLogoUrl = sanitizeUploadThingUrl(s.logoUrl);

    if (safeLogoUrl) {
      const res = await fetch(safeLogoUrl, { signal: AbortSignal.timeout(5000) });
      const contentLength = Number(res.headers.get("content-length") || "0");
      if (res.ok && contentLength <= MAX_ICON_BYTES) {
        const arrayBuf = await res.arrayBuffer();
        if (arrayBuf.byteLength > 0 && arrayBuf.byteLength <= MAX_ICON_BYTES) {
          const inputBuffer = Buffer.from(arrayBuf);
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
              "Cache-Control": "public, max-age=300, s-maxage=300, must-revalidate",
            },
          });
        }
      }
    }
  } catch {
    // Kembalikan respons kosong jika DB atau gambar belum tersedia
  }

  return new NextResponse(null, { status: 204 });
}
