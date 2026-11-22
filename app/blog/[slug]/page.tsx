import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ShareButtons } from "./share-buttons";
import { getSiteSettings, getBlogBySlug, getRelatedBlogs } from "@/lib/public-data";
import { getSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";

export const instant = false;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await getBlogBySlug(slug);

  if (p) {
    return {
      title: `${p.title} | Blog First Apparel`,
      description: p.excerpt,
      openGraph: {
        title: p.title,
        description: p.excerpt,
        images: [{ url: p.thumbnailUrl }],
      },
    };
  }

  return {
    title: "Artikel Blog | First Apparel",
    description: "Panduan dan tips custom jersey olahraga First Apparel.",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const [settings, post] = await Promise.all([
    getSiteSettings(),
    getBlogBySlug(slug),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedBlogs(post.id);

  const {
    storeName,
    storeAddress,
    googleMapsUrl,
    operatingHours,
    whatsappNumber,
    defaultWaText,
    instagramUrl,
    logoUrl,
    storeDescription,
  } = settings;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    return `${minutes} Menit Baca`;
  };

  const waArticleHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo Admin ${storeName}, saya membaca artikel "${post.title}" di website. Saya ingin berkonsultasi untuk pembuatan custom jersey tim saya.`
  )}`;

  const siteUrl = getSiteUrl();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.publishedAt).toISOString(),
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: {
      "@type": "Organization",
      name: storeName,
    },
    publisher: {
      "@type": "Organization",
      name: storeName,
      ...(logoUrl ? { logo: { "@type": "ImageObject", url: logoUrl } } : {}),
    },
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] flex flex-col selection:bg-[#84CC16] selection:text-[#09090B]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* 1. Navbar */}
      <Navbar waNumber={whatsappNumber} storeName={storeName} logoUrl={logoUrl} />

      {/* 2. Artikel Header & Breadcrumbs */}
      <header className="relative pt-12 pb-10 border-b border-[#27272A] bg-gradient-to-b from-[#121318] to-[#09090B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs Nav */}
          <nav className="flex items-center gap-2 text-xs text-[#71717A] mb-6">
            <Link href="/" className="hover:text-[#FAFAFA] transition-colors">
              Beranda
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#FAFAFA] transition-colors">
              Blog &amp; Panduan
            </Link>
            <span>/</span>
            <span className="text-[#84CC16] truncate max-w-xs">{post.title}</span>
          </nav>

          {/* Meta Informasi */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#71717A] mb-4">
            <span className="px-2.5 py-1 rounded-full bg-[#84CC16]/10 border border-[#84CC16]/30 text-[#84CC16] font-bold">
              EDUKASI JERSEY
            </span>
            <span>•</span>
            <time dateTime={new Date(post.publishedAt).toISOString()}>
              {formatDate(post.publishedAt)}
            </time>
            <span>•</span>
            <span>{calculateReadTime(post.content)}</span>
          </div>

          {/* Judul Utama Artikel */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FAFAFA] leading-tight">
            {post.title}
          </h1>

          {/* Ringkasan Pembuka */}
          {post.excerpt && (
            <p className="text-sm sm:text-base text-[#A1A1AA] mt-4 leading-relaxed font-medium">
              {post.excerpt}
            </p>
          )}

          {/* Action Bar: Penulis & Tombol Share */}
          <div className="mt-8 pt-6 border-t border-[#27272A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#84CC16] text-[#09090B] font-black text-sm flex items-center justify-center shrink-0">
                FA
              </div>
              <div>
                <p className="text-xs font-bold text-[#FAFAFA]">Tim Redaksi {storeName}</p>
                <p className="text-[11px] text-[#71717A]">Spesialis Konveksi &amp; Apparel Olahraga</p>
              </div>
            </div>

            <ShareButtons title={post.title} />
          </div>
        </div>
      </header>

      {/* 3. Konten Utama Artikel */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Gambar Thumbnail Utama */}
        <div className="rounded-2xl overflow-hidden border border-[#27272A] bg-[#141418] mb-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            width={896}
            height={480}
            priority
            className="w-full max-h-[480px] object-cover"
          />
        </div>

        {/* Isi Paragraf Artikel */}
        <article className="prose prose-invert max-w-none space-y-6 text-[#D4D4D8] leading-relaxed text-sm sm:text-base">
          {post.content.split("\n\n").map((paragraph, idx) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Jika diawali dengan heading (# atau ##)
            if (trimmed.startsWith("### ")) {
              return (
                <h3 key={idx} className="text-lg sm:text-xl font-bold text-[#FAFAFA] text-[#84CC16] pt-4">
                  {trimmed.replace("### ", "")}
                </h3>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h2 key={idx} className="text-xl sm:text-2xl font-black text-[#FAFAFA] border-b border-[#27272A] pb-2 pt-6">
                  {trimmed.replace("## ", "")}
                </h2>
              );
            }
            if (trimmed.startsWith("# ")) {
              return (
                <h2 key={idx} className="text-2xl font-black text-[#FAFAFA] pt-6">
                  {trimmed.replace("# ", "")}
                </h2>
              );
            }

            // Jika bullet point (- atau *)
            if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
              const listItems = trimmed.split("\n").map((li) => li.replace(/^[-*]\s+/, ""));
              return (
                <ul key={idx} className="space-y-2 pl-5 list-disc list-outside text-[#A1A1AA]">
                  {listItems.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={idx} className="text-[#D4D4D8] leading-relaxed whitespace-pre-line">
                {trimmed}
              </p>
            );
          })}
        </article>

        {/* 4. Kotak CTA WhatsApp Khusus Artikel */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#181A22] via-[#14151C] to-[#101116] border border-[#84CC16]/40 shadow-[0_0_40px_rgba(132,204,22,0.12)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <span className="text-[11px] font-bold tracking-widest text-[#84CC16] uppercase block">
                KONSULTASI DESAIN &amp; MATERIAL
              </span>
              <h3 className="text-xl font-bold text-[#FAFAFA]">
                Ingin Membuat Jersey dengan Standar Kualitas Ini?
              </h3>
              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
                Diskusikan konsep desain, pilihan bahan kain, serta penawaran harga terbaik untuk tim Anda langsung bersama desainer kami.
              </p>
            </div>

            <a
              href={waArticleHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#84CC16] text-[#09090B] text-xs font-bold shrink-0 hover:bg-[#9ee238] active:scale-95 transition-all shadow-[0_0_20px_rgba(132,204,22,0.3)]"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.076-1.745-.383-1.423-.588-2.339-2.04-2.41-2.134-.071-.094-.572-.76-.572-1.448 0-.689.361-1.028.49-1.168.129-.14.282-.175.376-.175s.188.005.271.01c.088.005.206-.033.322.247.121.292.412 1.006.448 1.08.036.074.06.16.012.257-.048.097-.072.157-.144.24-.072.083-.153.186-.218.25-.072.072-.148.15-.064.294.084.144.373.616.8 1 .552.497 1.018.652 1.162.724.144.072.228.06.313-.037.085-.097.362-.423.458-.568.096-.145.193-.121.325-.072.133.048.843.398.988.47.145.072.241.108.277.17.036.06.036.357-.108.762z" />
              </svg>
              <span>Konsultasi Pemesanan via WA</span>
            </a>
          </div>
        </div>

        {/* 5. Rekomendasi Artikel Terkait Lainnya */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-[#27272A]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-[#84CC16] uppercase tracking-wider block">
                  BACA JUGA
                </span>
                <h3 className="text-xl font-bold text-[#FAFAFA] mt-1">
                  Artikel Edukasi Lainnya
                </h3>
              </div>
              <Link
                href="/blog"
                className="text-xs font-semibold text-[#84CC16] hover:underline"
              >
                Lihat Semua Artikel →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl bg-[#141418] border border-[#27272A] overflow-hidden hover:border-[#84CC16]/50 transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#1E1F27]">
                    <Image
                      src={related.thumbnailUrl}
                      alt={related.title}
                      width={320}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <p className="text-[11px] text-[#71717A] mb-1.5">{formatDate(related.publishedAt)}</p>
                    <h4 className="text-xs font-bold text-[#FAFAFA] group-hover:text-[#84CC16] transition-colors line-clamp-2 leading-snug">
                      {related.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 6. Footer */}
      <Footer
        storeName={storeName}
        storeAddress={storeAddress}
        googleMapsUrl={googleMapsUrl}
        operatingHours={operatingHours}
        whatsappNumber={whatsappNumber}
        defaultWaText={defaultWaText}
        instagramUrl={instagramUrl}
        logoUrl={logoUrl}
        storeDescription={storeDescription}
      />
    </div>
  );
}
