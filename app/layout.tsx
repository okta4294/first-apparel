import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "First Apparel | Produsen Custom Jersey Olahraga & Tim",
  description:
    "Konveksi spesialis custom jersey olahraga futsal, sepak bola, e-sports, dan running berkualitas premium di Bandung. Bebas konsultasi desain dan tanpa minimum order.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "First Apparel",
    title: "First Apparel | Produsen Custom Jersey Olahraga & Tim",
    description:
      "Konveksi spesialis custom jersey olahraga futsal, sepak bola, e-sports, dan running berkualitas premium di Bandung. Bebas konsultasi desain dan tanpa minimum order.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/api/icon",
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
      </body>
    </html>
  );
}
