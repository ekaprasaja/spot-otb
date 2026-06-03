"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark,
  ChevronRight,
  Shield,
  Activity,
  Zap,
  Bone,
  Stethoscope,
  Brain
} from "lucide-react";
import Link from "next/link";

interface ArticleClientProps {
  article: any;
}

const getIcon = (category: string) => {
  switch (category) {
    case "Gaya Hidup": return <Activity className="w-12 h-12 text-blue-500" />;
    case "Kesehatan Spine": return <Activity className="w-12 h-12 text-emerald-500" />;
    case "Kesehatan Otak": return <Brain className="w-12 h-12 text-blue-500" />;
    case "Sports Medicine": return <Zap className="w-12 h-12 text-rose-500" />;
    case "Edukasi": return <Stethoscope className="w-12 h-12 text-amber-500" />;
    case "Teknologi": return <Stethoscope className="w-12 h-12 text-purple-500" />;
    default: return <Shield className="w-12 h-12 text-primary" />;
  }
};

export default function ArticleClient({ article }: ArticleClientProps) {
  const icon = getIcon(article.category);
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#0A0A0B]">
      {/* Article Hero */}
      <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={article.image} 
          alt={article.title}
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-white/5 rounded-[3rem] p-8 md:p-16 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-4 py-2 bg-primary/15 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/10">
                {article.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-outfit font-bold text-white mb-8 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 mb-12 py-6 border-y border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{article.author}</p>
                  <p className="text-[10px] text-foreground/40 uppercase tracking-tighter">Penulis Medis</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/5 hidden md:block" />
              <div className="flex items-center gap-2 text-xs font-bold text-foreground/40">
                <Calendar className="w-4 h-4 text-primary" />
                {article.date}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground/40">
                <Clock className="w-4 h-4 text-primary" />
                {article.readTime} Bacaan
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
              dangerouslySetInnerHTML={{ __html: article.content }}
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
          </motion.div>

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
