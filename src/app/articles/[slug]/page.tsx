import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ChevronRight, ChevronLeft, Shield } from "lucide-react";
import ArticleBookingCTA from "@/components/ArticleBookingCTA";

const defaultDoctor = {
  name: "dr. Prahesta Adi Wibowo, Sp.OT",
  clinic: "Spine & Pain Clinic",
  doctorId: "dr-prahesta-adi-wibowo-spot-su-2mram"
};

function getFallbackImage(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("osteosarcoma") || s.includes("kanker") || s.includes("tulang")) return "/images/articles/osteosarcoma.png";
  if (s.includes("sarcoma") || s.includes("sarkoma") || s.includes("jaringan-lunak")) return "/images/articles/soft_tissue_sarcoma.png";
  if (s.includes("limb-salvage") || s.includes("amputasi") || s.includes("bedah")) return "/images/articles/limb_salvage.png";
  return "/images/articles/osteosarcoma.png";
}

function replacePlaceholders(text: string) {
  if (!text) return "";
  const name = defaultDoctor.name;
  const clinic = defaultDoctor.clinic;
  
  let result = text
    .replace(/dr\. Nama Dokter, Sp\.OT, Subsp\. Onk\.Ort \(K\)/gi, name)
    .replace(/dr\. Nama Dokter, Sp\.OT, Subsp\. OTB \(K\)/gi, name)
    .replace(/dr\. Nama Dokter/gi, name)
    .replace(/Nama Dokter/gi, name);

  return result
    .replace(/Wisnu SpineCare/gi, clinic)
    .replace(/prahesta\.id/gi, "prahesta.id");
}

async function fetchArticleData(slug: string) {
  try {
    const tenantId = defaultDoctor.doctorId;
    const cfRes = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles/${slug}`);
    if (cfRes.ok) {
      const matched = await cfRes.json();
      if (matched && !matched.error) {
        return {
          id: matched.slug || matched.id,
          title: matched.title,
          seoTitle: matched.seo_title || "",
          seoDescription: matched.seo_description || "",
          date: new Date(matched.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          isoDate: new Date(matched.published_at).toISOString(),
          category: "EDUKASI",
          image: matched.cover_image || getFallbackImage(matched.slug || matched.id || ""),
          content: matched.content || matched.excerpt || '',
          author: defaultDoctor.name,
          readTime: '5 menit'
        };
      }
    }

    const cfListRes = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles`);
    if (cfListRes.ok) {
      const data = await cfListRes.json();
      if (data?.articles && Array.isArray(data.articles)) {
        const matchedFromList = data.articles.find((art: any) => (art.slug === slug || String(art.id) === String(slug)));
        if (matchedFromList) {
          const slugToFetch = matchedFromList.slug || matchedFromList.id;
          const cfDetailRes = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles/${slugToFetch}`);
          if (cfDetailRes.ok) {
            const matched = await cfDetailRes.json();
            if (matched && !matched.error) {
              return {
                id: matched.slug || matched.id,
                title: matched.title,
                seoTitle: matched.seo_title || "",
                seoDescription: matched.seo_description || "",
                date: new Date(matched.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                isoDate: new Date(matched.published_at).toISOString(),
                category: "EDUKASI",
                image: matched.cover_image || getFallbackImage(matched.slug || matched.id || ""),
                content: matched.content || matched.excerpt || '',
                author: defaultDoctor.name,
                readTime: '5 menit'
              };
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error fetching article in server component:", err);
  }

  return null;
}

async function fetchAllArticles(): Promise<{ slug: string; title: string }[]> {
  try {
    const tenantId = defaultDoctor.doctorId;
    const res = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles`);
    if (res.ok) {
      const data = await res.json();
      if (data?.articles && Array.isArray(data.articles)) {
        return data.articles.map((a: any) => ({
          slug: a.slug || String(a.id),
          title: a.title || '',
        }));
      }
    }
  } catch {}
  return [];
}

export async function generateStaticParams() {
  try {
    const tenantId = defaultDoctor.doctorId;
    const res = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles`);
    if (res.ok) {
      const data = await res.json();
      if (data?.articles && Array.isArray(data.articles)) {
        return data.articles.map((art: any) => ({
          slug: art.slug || String(art.id),
        }));
      }
    }
  } catch (err) {
    console.error("Error fetching dynamic slugs for generateStaticParams:", err);
  }
  return [];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const article = await fetchArticleData(params.slug);
  
  if (!article) {
    return {
      title: `Artikel Tidak Ditemukan | ${defaultDoctor.name}`,
      description: "Artikel yang Anda cari tidak ditemukan."
    };
  }

  const seoTitleRaw = article.seoTitle || article.title;
  const displayTitle = replacePlaceholders(seoTitleRaw);
  
  const rawExcerpt = article.seoDescription || (article.content ? article.content.replace(/<[^>]+>/g, '').substring(0, 160) : article.title);
  const displayDescription = replacePlaceholders(rawExcerpt);

  return {
    title: `${displayTitle} | ${defaultDoctor.name}`,
    description: displayDescription,
    alternates: {
      canonical: `https://prahesta.id/articles/${params.slug}`,
    },
    openGraph: {
      type: "article",
      title: displayTitle,
      description: displayDescription,
      images: [
        {
          url: article.image.startsWith("http") ? article.image : `https://prahesta.id${article.image}`,
          width: 1200,
          height: 630,
          alt: displayTitle,
        }
      ]
    }
  };
}

export default async function ArticleDetailPage(props: PageProps) {
  const params = await props.params;
  const [article, allArticles] = await Promise.all([
    fetchArticleData(params.slug),
    fetchAllArticles(),
  ]);
  
  if (!article) {
    notFound();
  }

  const currentIndex = allArticles.findIndex(a => a.slug === params.slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const displayTitle = replacePlaceholders(article.title);
  const displayAuthor = defaultDoctor.name;
  const displayContent = replacePlaceholders(article.content);

  const rawExcerpt = article.seoDescription || (article.content ? article.content.replace(/<[^>]+>/g, '').substring(0, 160) : article.title);
  const displayDescription = replacePlaceholders(rawExcerpt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": displayTitle,
    "image": [
      article.image.startsWith("http") ? article.image : `https://prahesta.id${article.image}`
    ],
    "datePublished": article.isoDate || "2026-04-25T10:00:00+07:00",
    "dateModified": article.isoDate || "2026-04-25T10:00:00+07:00",
    "author": [{
      "@type": "Person",
      "name": displayAuthor,
      "url": "https://prahesta.id"
    }],
    "publisher": {
      "@type": "Physician",
      "name": defaultDoctor.name,
      "logo": {
        "@type": "ImageObject",
        "url": "https://prahesta.id/images/doctor_profile.webp"
      }
    },
    "description": displayDescription
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Beranda",
        "item": "https://prahesta.id"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Artikel Edukasi",
        "item": "https://prahesta.id/articles"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": displayTitle,
        "item": `https://prahesta.id/articles/${params.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#0A0A0B]">
        {/* Article Hero */}
        <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
          <img 
            src={article.image || "/images/articles/osteosarcoma.png"} 
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent" />
          
          <div className="absolute top-8 left-5 md:left-12 hidden md:block">
            <Link href="/articles" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/70 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <article className="px-5 md:px-12 -mt-20 relative z-10 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-white/5 rounded-[3rem] p-8 md:p-16 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-4 py-2 bg-primary/15 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/10">
                  {article.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-outfit font-bold text-white mb-8 leading-tight">
                {displayTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mb-12 py-6 border-y border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {displayAuthor?.charAt(0) || "T"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{displayAuthor || "Tim Medis"}</p>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-tighter">Dokter Spesialis</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/5 hidden md:block" />
                <div className="flex items-center gap-2 text-xs font-bold text-foreground/40">
                  <Calendar className="w-4 h-4 text-primary" />
                  {article.date}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground/40">
                  <Clock className="w-4 h-4 text-primary" />
                  {article.readTime || "5 menit"} Bacaan
                </div>
                <div className="flex gap-2 ml-auto">
                  <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:text-primary transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div 
                className="prose prose-invert prose-lg max-w-none text-foreground/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />

              {/* Article Booking CTA */}
              <ArticleBookingCTA doctorId={defaultDoctor.doctorId} />

              {/* Surgeon Note */}
              <div className="mt-8 p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center">
                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Pesan dari Spesialis</h4>
                  <p className="text-sm text-foreground/50 leading-relaxed italic">
                    "Artikel ini bertujuan untuk edukasi umum. Jika Anda mengalami keluhan yang persisten, silakan gunakan alat diagnostik kami atau segera jadwalkan konsultasi klinis untuk penanganan yang tepat."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* ── Prev / Next + Back Navigation ── */}
      <div className="max-w-3xl mx-auto px-4 pb-16 mt-2">
        {/* Back to Blog */}
        <div className="flex justify-center mb-8">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.03] text-white/50 hover:text-primary hover:border-primary/30 transition-all text-sm font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Blog
          </Link>
        </div>

        {/* Prev / Next */}
        {(prevArticle || nextArticle) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Previous */}
            {prevArticle ? (
              <Link
                href={`/articles/${prevArticle.slug}`}
                className="group flex flex-col gap-2 p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/20 transition-all"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-primary/60 transition-colors">
                  <ChevronLeft className="w-3 h-3" /> Artikel Sebelumnya
                </span>
                <p className="text-sm font-bold text-white/70 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                  {prevArticle.title}
                </p>
              </Link>
            ) : (
              <div />
            )}

            {/* Next */}
            {nextArticle ? (
              <Link
                href={`/articles/${nextArticle.slug}`}
                className="group flex flex-col gap-2 p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/20 transition-all text-right md:items-end"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-primary/60 transition-colors">
                  Artikel Berikutnya <ChevronRight className="w-3 h-3" />
                </span>
                <p className="text-sm font-bold text-white/70 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                  {nextArticle.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>
    </>
  );
}

