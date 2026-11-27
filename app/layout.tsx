import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { getSiteUrl } from "@/lib/site-url";
import { getSiteSettings } from "@/lib/public-data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const iconVersion = settings.logoUrl
    ? Buffer.from(settings.logoUrl).toString("base64url").slice(-10)
    : "default";
  const iconUrl = `/api/icon?v=${iconVersion}`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: "First Apparel | Printing Jersey Kendal & Custom Jersey Olahraga",
    description:
      "Jasa printing jersey Kendal & konveksi custom jersey futsal, sepak bola, e-sports, dan running. Cetak sublimasi tajam, bebas desain, tanpa minimum order.",
    keywords: [
      "printing jersey kendal dan sekitarnya",
      "custom jersey kendal dan sekitarnya",
      "konveksi jersey kendal dan sekitarnya",
      "bikin jersey kendal",
      "jersey futsal kendal",
      "First Apparel",
      "custom jersey semarang dan sekitarnya",
      "fisrt apparel kendal",
    ],
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: "First Apparel",
      title: "First Apparel | Printing Jersey Kendal & Custom Jersey Olahraga",
      description:
        "Jasa printing jersey Kendal & konveksi custom jersey futsal, sepak bola, e-sports, dan running. Cetak sublimasi tajam, bebas desain, tanpa minimum order.",
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [{ url: iconUrl, type: "image/png", sizes: "192x192" }],
      shortcut: iconUrl,
      apple: iconUrl,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`h-full dark ${inter.variable} ${archivo.variable}`}>
      <head>
        <link rel="preconnect" href="https://utfs.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://utfs.io" />
        <link rel="dns-prefetch" href="https://ufs.sh" />
      </head>
      <body className="min-h-full flex flex-col bg-[#09090B] text-[#FAFAFA] antialiased font-sans">
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KYYVTM0EYJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-KYYVTM0EYJ');`}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
