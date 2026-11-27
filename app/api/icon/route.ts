import { NextResponse } from "next/server";
import { cacheLife, cacheTag } from "next/cache";
import sharp from "sharp";
import { getSiteSettings } from "@/lib/public-data";
import { sanitizeUploadThingUrl } from "@/lib/uploadthing-server";

const MAX_ICON_BYTES = 5 * 1024 * 1024;
const ICON_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800";

async function buildFallbackIconPng(storeName: string): Promise<Uint8Array> {
  const initials =
    storeName
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 2)
      .toUpperCase() || "FA";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192"><rect width="192" height="192" rx="36" fill="#09090B"/><rect x="14" y="14" width="164" height="164" rx="26" fill="#84CC16"/><text x="96" y="118" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="76" font-weight="900" fill="#09090B">${initials}</text></svg>`;
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Uint8Array(pngBuffer);
}

async function getCachedIconPng(): Promise<Uint8Array> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-settings");

  const s = await getSiteSettings();
  const safeLogoUrl = sanitizeUploadThingUrl(s.logoUrl);

  if (safeLogoUrl) {
    try {
      let res = await fetch(safeLogoUrl, { signal: AbortSignal.timeout(5000), redirect: "manual" });
      if (res.status >= 300 && res.status < 400) {
        const redirectTarget = sanitizeUploadThingUrl(res.headers.get("location"));
        if (!redirectTarget) throw new Error("Redirect logo tidak diizinkan");
        res = await fetch(redirectTarget, { signal: AbortSignal.timeout(5000), redirect: "error" });
      }
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

          return new Uint8Array(pngBuffer);
        }
      }
    } catch {
      // Lanjut ke ikon cadangan jika gambar sumber gagal diambil
    }
  }

  return buildFallbackIconPng(s.storeName);
}

export async function GET() {
  const pngBytes = await getCachedIconPng();

  return new NextResponse(new Uint8Array(pngBytes), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": ICON_CACHE_CONTROL,
    },
  });
}
