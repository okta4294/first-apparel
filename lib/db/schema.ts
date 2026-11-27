import { pgTable, serial, integer, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

// 1. Tabel Akun Administrator
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  failedAttempts: integer("failed_attempts").default(0).notNull(),
  lockedUntil: timestamp("locked_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Tabel Katalog Jersey (PRD Seksi 6.1)
export const catalogs = pgTable("catalogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  minOrder: varchar("min_order", { length: 100 }),
  imageUrl: text("image_url").notNull(),
  imageKey: varchar("image_key", { length: 255 }).notNull(),
  images: text("images").default("[]").notNull(),
  sizeChartUrl: text("size_chart_url"),
  sizeChartKey: varchar("size_chart_key", { length: 255 }),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Tabel Promo Berdurasi & Tetap (PRD Seksi 6.2)
export const promos = pgTable("promos", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  badgeText: varchar("badge_text", { length: 100 }).notNull(),
  imageUrl: text("image_url"),
  imageKey: varchar("image_key", { length: 255 }),
  popupImageUrl: text("popup_image_url"),
  popupImageKey: varchar("popup_image_key", { length: 255 }),
  waMessage: text("wa_message").notNull(),
  hasDuration: boolean("has_duration").default(false).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  isPopup: boolean("is_popup").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Tabel Artikel Blog & Edukasi (PRD Seksi 6.3)
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  thumbnailKey: varchar("thumbnail_key", { length: 255 }).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Tabel Mitra & Partner Berafiliasi (PRD Seksi 6.4)
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  logoUrl: text("logo_url").notNull(),
  logoKey: varchar("logo_key", { length: 255 }).notNull(),
  websiteUrl: text("website_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Tabel Pengaturan Toko & Kontak WhatsApp (PRD Seksi 6.5)
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  storeName: varchar("store_name", { length: 150 }).default("First Apparel").notNull(),
  companyName: varchar("company_name", { length: 150 }),
  storeAddress: text("store_address")
    .default("Jl. Terusan Olahraga No. 8, Bandung, Jawa Barat")
    .notNull(),
  googleMapsUrl: text("google_maps_url"),
  operatingHours: varchar("operating_hours", { length: 150 }).default("Senin - Sabtu, 09.00 - 17.00 WIB"),
  whatsappNumber: varchar("whatsapp_number", { length: 30 }).default("6281234567890").notNull(),
  defaultWaText: text("default_wa_text")
    .default("Halo Admin First Apparel, saya ingin berkonsultasi tentang pemesanan jersey kustom.")
    .notNull(),
  instagramUrl: text("instagram_url"),
  logoUrl: text("logo_url"),
  logoKey: varchar("logo_key", { length: 255 }),
  footerCompanyName: varchar("footer_company_name", { length: 150 }),
  footerLogoUrl: text("footer_logo_url"),
  footerLogoKey: varchar("footer_logo_key", { length: 255 }),
  footerLogo2Url: text("footer_logo_2_url"),
  footerLogo2Key: varchar("footer_logo_2_key", { length: 255 }),
  sizeChartUrl: text("size_chart_url"),
  sizeChartKey: varchar("size_chart_key", { length: 255 }),
  storeDescription: text("store_description").default(
    "Konveksi spesialis jersey olahraga custom & apparel tim profesional di Bandung. Bebas custom desain, bahan dryfit premium, dan melayani kirim ke seluruh Indonesia."
  ),
  heroTitle: text("hero_title").default("Mau Tampil Keren di Lapangan? Dapatkan Jersey Printing dengan Harga Miring,"),
  heroTitleHighlight: text("hero_title_highlight").default("Kualitas Tetap Terbaik!"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 7. Tabel Karakteristik Pilihan Bahan Kain (Fabrics)
export const fabrics = pgTable("fabrics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  badge: varchar("badge", { length: 60 }),
  gsm: varchar("gsm", { length: 40 }),
  recommendation: varchar("recommendation", { length: 255 }),
  imageUrl: text("image_url"),
  imageKey: varchar("image_key", { length: 255 }),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 8. Tabel Ulasan & Rating Pelanggan (Reviews)
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  teamOrRole: varchar("team_or_role", { length: 120 }),
  productName: varchar("product_name", { length: 150 }),
  rating: integer("rating").default(5).notNull(),
  comment: text("comment").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type Catalog = typeof catalogs.$inferSelect;
export type Promo = typeof promos.$inferSelect;
export type Blog = typeof blogs.$inferSelect;
export type Partner = typeof partners.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Fabric = typeof fabrics.$inferSelect;
export type Review = typeof reviews.$inferSelect;
