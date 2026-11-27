/**
 * Kompresi Gambar di Sisi Klien (Browser Canvas API)
 * Sesuai PRD Seksi 3 & 7:
 * - Mengubah dimensi berlebih menjadi maksimal 1200px (katalog/blog) atau 400px (logo)
 * - Mengonversi ke format .webp dengan kualitas 0.82
 * - Menghemat kuota penyimpanan UploadThing (ukuran turun menjadi 30 - 300 KB)
 */
export async function compressImageToWebP(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.78
): Promise<File> {
  // Hanya proses jika bertipe gambar
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung rasio pengecilan proporsional
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // fallback ke file asli jika canvas gagal
          return;
        }

        // Render gambar ke canvas dengan kualitas downscale tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Ganti ekstensi file menjadi .webp
            const originalName = file.name.replace(/\.[^/.]+$/, "");
            const webpFile = new File([blob], `${originalName}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            resolve(webpFile);
          },
          "image/webp",
          quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

/**
 * Kompresi khusus Logo Partner (maksimal 400px, WebP transparan 30-80 KB)
 */
export async function compressLogoToWebP(file: File): Promise<File> {
  return compressImageToWebP(file, 400, 400, 0.85);
}
