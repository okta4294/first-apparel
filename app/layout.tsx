import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "First Apparel | Produsen Custom Jersey Olahraga & Tim",
  description:
    "Konveksi spesialis custom jersey olahraga futsal, sepak bola, e-sports, dan running berkualitas premium di Bandung. Bebas konsultasi desain dan tanpa minimum order.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`h-full dark ${inter.variable}`}>
      <body className="min-h-full flex flex-col bg-[#09090B] text-[#FAFAFA] antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
