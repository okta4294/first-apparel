import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "First Apparel | Printing Jersey Kendal & Custom Jersey Olahraga",
  description:
    "Jasa printing jersey Kendal dan konveksi custom jersey futsal, sepak bola, e-sports, dan running di Kendal, Jawa Tengah. Cetak sublimasi tajam, bebas desain, dan tanpa minimum order.",
  keywords: [
    "printing jersey kendal",
    "custom jersey kendal",
    "konveksi jersey kendal",
    "bikin jersey kendal",
    "jersey futsal kendal",
    "First Apparel",
  ],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "First Apparel",
    title: "First Apparel | Printing Jersey Kendal & Custom Jersey Olahraga",
    description:
      "Jasa printing jersey Kendal dan konveksi custom jersey futsal, sepak bola, e-sports, dan running di Kendal, Jawa Tengah. Cetak sublimasi tajam, bebas desain, dan tanpa minimum order.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/api/icon", type: "image/png", sizes: "192x192" }],
    shortcut: "/api/icon",
    apple: "/api/icon",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning className={`h-full ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://utfs.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://utfs.io" />
        <link rel="dns-prefetch" href="https://ufs.sh" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('first_apparel_theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] dark:bg-[#09090B] dark:text-[#FAFAFA] antialiased font-sans">
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
