import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { siteSettings, catalogs, promos, partners, blogs, fabrics, reviews } from "@/lib/db/schema";
import { eq, and, lte, gte, or, asc, desc, ne } from "drizzle-orm";

export interface PublicSiteSettings {
  storeName: string;
  storeAddress: string;
  googleMapsUrl: string | null;
  operatingHours: string;
  whatsappNumber: string;
  defaultWaText: string;
  instagramUrl: string | null;
  logoUrl: string | null;
  sizeChartUrl: string | null;
  storeDescription: string;
}

const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  storeName: "First Apparel",
  storeAddress: "Jl. Terusan Olahraga No. 8, Bandung, Jawa Barat",
  googleMapsUrl: null,
  operatingHours: "Senin – Sabtu, 09.00 – 17.00 WIB",
  whatsappNumber: "6281234567890",
  defaultWaText:
    "Halo Admin First Apparel, saya ingin berkonsultasi mengenai pemesanan custom jersey.",
  instagramUrl: null,
  logoUrl: null,
  sizeChartUrl: null,
  storeDescription:
    "Konveksi spesialis jersey olahraga custom & apparel tim profesional di Bandung. Bebas custom desain, bahan dryfit premium, dan melayani kirim ke seluruh Indonesia.",
};

export async function getSiteSettings(): Promise<PublicSiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("site-settings");

  try {
    const settings = await db.select().from(siteSettings).limit(1);
    if (settings.length > 0) {
      const s = settings[0];
      return {
        storeName: s.storeName || DEFAULT_SITE_SETTINGS.storeName,
        storeAddress: s.storeAddress || DEFAULT_SITE_SETTINGS.storeAddress,
        googleMapsUrl: s.googleMapsUrl,
        operatingHours: s.operatingHours || DEFAULT_SITE_SETTINGS.operatingHours,
        whatsappNumber: s.whatsappNumber || DEFAULT_SITE_SETTINGS.whatsappNumber,
        defaultWaText: s.defaultWaText || DEFAULT_SITE_SETTINGS.defaultWaText,
        instagramUrl: s.instagramUrl,
        logoUrl: s.logoUrl || null,
        sizeChartUrl: s.sizeChartUrl || null,
        storeDescription: s.storeDescription || DEFAULT_SITE_SETTINGS.storeDescription,
      };
    }
  } catch {
    // Fallback bawaan jika koneksi DB belum siap
  }

  return DEFAULT_SITE_SETTINGS;
}

export async function getActivePromos() {
  "use cache";
  cacheLife("minutes");
  cacheTag("promos");

  try {
    const now = new Date();
    return await db
      .select()
      .from(promos)
      .where(
        and(
          eq(promos.isActive, true),
          or(
            eq(promos.hasDuration, false),
            and(lte(promos.startDate, now), gte(promos.endDate, now))
          )
        )
      )
      .orderBy(desc(promos.id));
  } catch {
    return [];
  }
}

export async function getFeaturedCatalogs() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogs");

  try {
    return await db
      .select()
      .from(catalogs)
      .where(and(eq(catalogs.isActive, true), eq(catalogs.isFeatured, true)))
      .limit(4);
  } catch {
    return [];
  }
}

export async function getAllActiveCatalogs() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogs");

  try {
    return await db
      .select()
      .from(catalogs)
      .where(eq(catalogs.isActive, true))
      .orderBy(desc(catalogs.createdAt));
  } catch {
    return [];
  }
}

export async function getActivePartners() {
  "use cache";
  cacheLife("hours");
  cacheTag("partners");

  try {
    return await db
      .select()
      .from(partners)
      .where(eq(partners.isActive, true))
      .orderBy(asc(partners.sortOrder));
  } catch {
    return [];
  }
}

export async function getLatestBlogs(limit = 3) {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");

  try {
    return await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        excerpt: blogs.excerpt,
        thumbnailUrl: blogs.thumbnailUrl,
        publishedAt: blogs.publishedAt,
      })
      .from(blogs)
      .where(eq(blogs.isPublished, true))
      .orderBy(desc(blogs.publishedAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getPublishedBlogs() {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");

  try {
    return await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        excerpt: blogs.excerpt,
        content: blogs.content,
        thumbnailUrl: blogs.thumbnailUrl,
        publishedAt: blogs.publishedAt,
      })
      .from(blogs)
      .where(eq(blogs.isPublished, true))
      .orderBy(desc(blogs.publishedAt));
  } catch {
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs", `blog-${slug}`);

  try {
    const rows = await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.slug, slug), eq(blogs.isPublished, true)))
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedBlogs(excludeId: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");

  try {
    return await db
      .select({
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        thumbnailUrl: blogs.thumbnailUrl,
        publishedAt: blogs.publishedAt,
      })
      .from(blogs)
      .where(and(eq(blogs.isPublished, true), ne(blogs.id, excludeId)))
      .orderBy(desc(blogs.publishedAt))
      .limit(3);
  } catch {
    return [];
  }
}

export async function getActiveFabrics() {
  "use cache";
  cacheLife("hours");
  cacheTag("fabrics");

  try {
    return await db
      .select()
      .from(fabrics)
      .where(eq(fabrics.isActive, true))
      .orderBy(asc(fabrics.sortOrder), asc(fabrics.id));
  } catch {
    return [];
  }
}

export async function getActiveReviews() {
  "use cache";
  cacheLife("hours");
  cacheTag("reviews");

  try {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.isActive, true))
      .orderBy(asc(reviews.sortOrder), desc(reviews.id));
  } catch {
    return [];
  }
}
