"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ChevronRight, Shield } from "lucide-react";
import { useDoctorConfig } from "@/context/DoctorConfigContext";

const articlesData: Record<string, any> = {};

function getFallbackImage(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes("osteosarcoma") || s.includes("kanker") || s.includes("tulang")) return "/images/articles/osteosarcoma.png";
  if (s.includes("sarcoma") || s.includes("sarkoma") || s.includes("jaringan-lunak")) return "/images/articles/soft_tissue_sarcoma.png";
  if (s.includes("limb-salvage") || s.includes("amputasi") || s.includes("bedah")) return "/images/articles/limb_salvage.png";
  return "/images/articles/osteosarcoma.png";
}

function ArticleDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const doctorConfig = useDoctorConfig();
  
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const replacePlaceholders = (text: string) => {
    if (!text || !doctorConfig) return "";
    const name = doctorConfig.name || "dr. Prahesta Adi Wibowo, Sp.OT, Subsp. OTB (K)";
    const clinic = doctorConfig.clinic || "Klinik Bedah Orthopedi";
    
    return text
      .replace(/dr\. Nama Dokter, Sp\.OT, Subsp\. Onk\.Ort \(K\)/gi, name)
      .replace(/dr\. Nama Dokter, Sp\.OT, Subsp\. OTB \(K\)/gi, name)
      .replace(/dr\. Nama Dokter/gi, name)
      .replace(/Nama Dokter/gi, name)
      .replace(/Wisnu SpineCare/gi, clinic)
      .replace(/wisnubaskoro\.id/gi, typeof window !== "undefined" ? window.location.hostname : "prahesta.id");
  };

  useEffect(() => {
    if (!id) return;

    // Check remote dynamic API
    async function fetchArticle() {
      try {
        const tenantId = doctorConfig.id || "spot-otb";
        const cfRes = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles/${id}`);
        if (cfRes.ok) {
          const matched = await cfRes.json();
          if (matched && !matched.error) {
            setArticle({
              id: matched.slug || matched.id,
              title: matched.title,
              date: new Date(matched.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
              category: "EDUKASI",
              image: matched.cover_image || getFallbackImage(matched.slug || matched.id || ""),
              content: matched.content || matched.excerpt || "",
              author: doctorConfig.name || "Tim Medis",
              readTime: "5 menit"
            });
            setLoading(false);
            return;
          }
        }
        
        // If remote search fails, try searching the general list
        const cfListRes = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles`);
        if (cfListRes.ok) {
          const data = await cfListRes.json();
          if (data?.articles && Array.isArray(data.articles)) {
            const matchedDetail = data.articles.find((art: any) => art.id === id || art.slug === id);
            if (matchedDetail) {
              setArticle({
                id: matchedDetail.slug || matchedDetail.id,
                title: matchedDetail.title,
                date: new Date(matchedDetail.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
                category: "EDUKASI",
                image: matchedDetail.cover_image || getFallbackImage(matchedDetail.slug || matchedDetail.id || ""),
                content: matchedDetail.content || matchedDetail.excerpt || "",
                author: doctorConfig.name || "Tim Medis",
                readTime: "5 menit"
              });
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching article client side:", err);
      }

      // Default Fallback to null
      setArticle(null);
      setLoading(false);
    }

    fetchArticle();
  }, [id, doctorConfig]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center">
        <h2 className="text-white text-xl font-bold mb-4">Artikel Tidak Ditemukan</h2>
        <Link href="/articles" className="text-primary hover:underline">
          Kembali ke Semua Artikel
        </Link>
      </div>
    );
  }

  const displayTitle = replacePlaceholders(article.title);
  const displayAuthor = doctorConfig.name || "Tim Medis";
  const displayContent = replacePlaceholders(article.content);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#0A0A0B]">
      {/* Article Hero */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <img 
          src={article.image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=60&w=400"} 
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

            {/* Surgeon Note */}
            <div className="mt-16 p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center">
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

          {/* Related Articles CTA */}
          <div className="mt-20 flex flex-col items-center text-center">
            <h3 className="text-2xl font-bold text-white mb-8">Lanjutkan Membaca</h3>
            <Link href="/articles" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 transition-all">
              Kembali ke Semua Artikel <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

export default function ArticleDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ArticleDetailContent />
    </Suspense>
  );
}
