import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export function sanitizeUploadThingUrl(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return null;
    const host = parsed.hostname.toLowerCase();
    if (host === "utfs.io" || host.endsWith(".ufs.sh")) {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}
