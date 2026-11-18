import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let title = "First Apparel | Produsen Custom Jersey Olahraga & Tim";
  let description =
    "Konveksi spesialis custom jersey olahraga futsal, sepak bola, e-sports, dan running berkualitas premium di Bandung. Bebas konsultasi desain dan tanpa minimum order.";
  let logoUrl: string | null = null;

  try {
    const [s] = await db
      .select({
        storeName: siteSettings.storeName,
        storeDescription: siteSettings.storeDescription,
        logoUrl: siteSettings.logoUrl,
      })
      .from(siteSettings)
      .limit(1);

    if (s) {
      if (s.storeName) title = `${s.storeName} | Produsen Custom Jersey Olahraga & Tim`;
      if (s.storeDescription) description = s.storeDescription;
      logoUrl = s.logoUrl || null;
    }
  } catch {
    // Gunakan metadata bawaan jika database belum siap saat build
  }

  return {
    title,
    description,
    ...(logoUrl ? { icons: { icon: logoUrl, apple: logoUrl } } : {}),
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning className={`h-full ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('first_apparel_theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] dark:bg-[#09090B] dark:text-[#FAFAFA] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
