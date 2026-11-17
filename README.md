# First Apparel

Website katalog dan profil usaha konveksi custom jersey olahraga First Apparel (Bandung).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Drizzle ORM + PostgreSQL (Neon)
- UploadThing (unggah gambar katalog, blog, logo, dan size chart)

## Menjalankan Secara Lokal

1. Pastikan variabel lingkungan di `.env` sudah terisi (`DATABASE_URL`, `AUTH_SECRET`, `UPLOADTHING_TOKEN`).
2. Jalankan server pengembangan:

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

## Perintah Utama

- `npm run dev` — Menjalankan server pengembangan.
- `npm run build` — Membangun aplikasi untuk produksi.
- `npm run lint` — Memeriksa aturan ESLint.
