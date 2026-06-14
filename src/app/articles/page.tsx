"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  ChevronRight, 
  Clock, 
  User,
  Calendar,
  Search,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useDoctorConfig } from "@/context/DoctorConfigContext";

const fallbackArticles = [
  {
    id: 1,
    title: "Deteksi Dini Osteosarcoma: Waspadai Nyeri Tulang pada Anak dan Remaja",
    excerpt: "Nyeri tulang yang sering disalahartikan sebagai 'growing pains' bisa jadi merupakan gejala osteosarcoma. Kenali tanda bahaya sejak awal untuk penanganan yang tepat.",
    category: "Kanker Tulang",
    date: "12 Juni 2026",
    readTime: "8 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/osteosarcoma.png",
    color: "from-blue-500/20 to-transparent"
  },
  {
    id: 2,
    title: "Sarkoma Jaringan Lunak: Mengapa Jalur Biopsi yang Benar Sangat Menentukan",
    excerpt: "Biopsi yang salah pada tumor otot atau lemak dapat mengontaminasi jaringan sehat dan mempersulit operasi penyelamatan ekstremitas. Konsultasikan ke subspesialis onkologi ortopedi.",
    category: "Tumor Jaringan Lunak",
    date: "10 Juni 2026",
    readTime: "10 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/soft_tissue_sarcoma.png",
    color: "from-emerald-500/20 to-transparent"
  },
  {
    id: 3,
    title: "Limb Salvage Surgery: Menyelamatkan Ekstremitas Pasien Kanker Tulang Tanpa Amputasi",
    excerpt: "Teknologi rekonstruksi modern menggunakan megaprosthesis atau bone graft memungkinkan pembuangan sel kanker tulang secara bersih sekaligus mempertahankan fungsi kaki atau tangan.",
    category: "Teknologi Bedah",
    date: "8 Juni 2026",
    readTime: "9 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/limb_salvage.png",
    color: "from-rose-500/20 to-transparent"
  },
  {
    id: 4,
    title: "Metastasis Tulang: Strategi Paliatif & Paliasi Nyeri untuk Mempertahankan Kualitas Hidup",
    excerpt: "Ketika kanker dari organ lain (payudara, paru, prostat) menyebar ke tulang, tindakan stabilisasi dengan implan dapat mencegah fraktur patologis dan meredakan nyeri hebat.",
    category: "Kanker Tulang",
    date: "6 Juni 2026",
    readTime: "7 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/osteosarcoma.png",
    color: "from-amber-500/20 to-transparent"
  },
  {
    id: 5,
    title: "Penanganan Cedera Tulang Kompleks & Fraktur Patologis Akibat Tumor",
    excerpt: "Tulang yang rapuh akibat tumor sangat rentan mengalami patah tulang spontan. Pelajari bagaimana fiksasi internal dan semen tulang (cementoplasty) membantu stabilitas mekanis.",
    category: "Cedera Tulang",
    date: "4 Juni 2026",
    readTime: "11 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/limb_salvage.png",
    color: "from-purple-500/20 to-transparent"
  },
  {
    id: 6,
    title: "Mengenal Benigna Bone Tumor: Jenis-jenis Tumor Tulang Jinak yang Sering Ditemui",
    excerpt: "Tidak semua benjolan pada tulang bersifat kanker. Pahami perbedaan tumor tulang jinak seperti osteochondroma atau giant cell tumor (GCT) serta indikasi operasinya.",
    category: "Tumor Jaringan Lunak",
    date: "2 Juni 2026",
    readTime: "9 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/soft_tissue_sarcoma.png",
    color: "from-blue-500/20 to-transparent"
  }
];

export default function ArticlesPage() {
  const doctorConfig = useDoctorConfig();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  const [articlesList, setArticlesList] = useState<any[]>(fallbackArticles);
  const [categories, setCategories] = useState<string[]>(["Semua", "Kanker Tulang", "Tumor Jaringan Lunak", "Teknologi Bedah", "Cedera Tulang"]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchArticles() {
      if (!doctorConfig) return;
      setLoading(true);
      try {
        // Scenario A: Headless WordPress
        if (doctorConfig.wordpressApiUrl) {
          const cleanUrl = doctorConfig.wordpressApiUrl.replace(/\/$/, '');
          let fetchUrl = `${cleanUrl}/wp-json/wp/v2/posts?_embed&per_page=20`;
          if (doctorConfig.wordpressCategoryFilter) {
            const catFilter = String(doctorConfig.wordpressCategoryFilter).trim();
            if (catFilter) {
              fetchUrl += `&categories=${catFilter}`;
            }
          }
          const res = await fetch(fetchUrl);
          if (res.ok) {
            const posts = await res.json();
            if (posts && Array.isArray(posts) && posts.length > 0) {
              const wpArticles = posts.map(post => {
                let thumbnail = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=60&w=400";
                const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
                if (featuredMedia?.source_url) {
                  thumbnail = featuredMedia.source_url;
                }

                let category = "EDUKASI";
                const terms = post._embedded?.['wp:term']?.[0];
                if (terms && terms.length > 0) {
                  category = terms[0].name;
                }

                let excerpt = post.excerpt?.rendered || "";
                excerpt = excerpt.replace(/<[^>]*>/g, '').substring(0, 160) + "...";

                return {
                  id: post.id || post.slug,
                  title: post.title?.rendered || 'Artikel Edukasi',
                  excerpt: excerpt,
                  category: category,
                  date: new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                  readTime: '5 menit',
                  author: post._embedded?.author?.[0]?.name || 'Tim Medis',
                  image: thumbnail,
                  color: "from-blue-500/20 to-transparent",
                  isWp: true
                };
              });

              if (active) {
                setArticlesList(wpArticles);
                const wpCats = ["Semua", ...new Set(wpArticles.map(a => a.category))];
                setCategories(wpCats);
                return;
              }
            }
          }
        }

        // Scenario B: Cloudflare Workers API
        const tenantId = doctorConfig.id || 'spot-otb';
        const cfRes = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles`);
        if (cfRes.ok) {
          const data = await cfRes.json();
          if (data?.articles && Array.isArray(data.articles) && data.articles.length > 0) {
            const cfArticles = data.articles.map((art: any) => ({
              id: art.slug || art.id,
              title: art.title,
              excerpt: art.excerpt || art.description || "Baca artikel lengkap mengenai kesehatan saraf dan tulang belakang.",
              category: "EDUKASI",
              date: new Date(art.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
              readTime: '5 menit',
              author: 'Tim Medis',
              image: art.cover_image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=60&w=400",
              color: "from-blue-500/20 to-transparent"
            }));

            if (active) {
              setArticlesList(cfArticles);
              setCategories(["Semua", "EDUKASI"]);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch articles:", err);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchArticles();
    return () => { active = false; };
  }, [doctorConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${doctorConfig.doctorId}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, referrer: window.location.href }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Terjadi kesalahan koneksi. Silakan coba lagi.");
    }
  };

  const filteredArticles = articlesList.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === "Semua") return true;
    return article.category.toLowerCase().includes(activeCategory.toLowerCase()) || 
           activeCategory.toLowerCase().includes(article.category.toLowerCase());
  });

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#0A0A0B]">
      {/* Header Section */}
      <section className="px-5 md:px-12 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-3xl md:text-5xl font-outfit font-bold text-white tracking-tight">Artikel Kesehatan</h1>
            <p className="text-foreground/40 mt-2">Wawasan medis terpercaya untuk kesehatan orthopedi & tulang belakang Anda.</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel..." 
              className="w-full bg-card border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all shadow-inner"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide touch-pan-x">
            {categories.map((tag) => (
              <button 
                key={tag} 
                onClick={() => setActiveCategory(tag)}
                className={`px-6 py-4 border rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === tag 
                    ? "bg-primary border-primary text-white" 
                    : "bg-card border-white/5 text-foreground/40 hover:text-white hover:border-primary/20"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => (
              <Link key={article.id} href={`/articles/detail?id=${article.id}`} className="group cursor-pointer">
                <motion.div
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.08,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group active:scale-[0.98] transition-all duration-500"
                >
                <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-6 border border-white/5">
                  <img 
                    src={article.image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=60&w=400"} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${article.color} to-transparent`} />
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex items-center gap-4 text-[11px] font-bold text-foreground/30 uppercase tracking-widest mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-primary" />
                      {article.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-primary" />
                      {article.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-sm text-foreground/50 leading-relaxed line-clamp-3 mb-6">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {article.author.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-foreground/40">{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                      Baca <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="px-5 md:px-12 pb-20">
        <div className="bg-primary/5 border border-primary/10 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] -z-10 rounded-full" />
          
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-outfit font-bold text-white mb-6">Jangan Lewatkan Update Medis</h2>
          <p className="text-base md:text-xl text-foreground/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Dapatkan tips wawasan orthopedi & tulang belakang langsung ke inbox Anda setiap minggu. Berlangganan buletin kami sekarang.
          </p>
          
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white mb-2">🎉 Hampir Selesai!</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Kami telah mengirimkan email konfirmasi ke inbox Anda. Silakan klik tautan di dalamnya untuk menyelesaikan pendaftaran buletin.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="email" 
                  required
                  disabled={status === "submitting"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Anda" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={status === "submitting"}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Mendaftarkan...
                    </>
                  ) : (
                    "Berlangganan"
                  )}
                </button>
              </div>
              {status === "error" && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 font-bold"
                >
                  {errorMessage}
                </motion.p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
