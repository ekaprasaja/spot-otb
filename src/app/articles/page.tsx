"use client";

import { useState } from "react";
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

const articles = [
  {
    id: 1,
    title: "Panduan Lengkap Postur Tubuh WfH: Hindari Nyeri Punggung",
    excerpt: "Bekerja dari rumah tanpa ergonomi yang tepat bisa merusak tulang belakang. Pelajari langkah menciptakan ruang kerja ideal untuk kesehatan jangka panjang.",
    category: "Gaya Hidup",
    date: "6 Mei 2026",
    readTime: "8 menit",
    author: "Tim Medis Wisnu Baskoro",
    image: "/images/articles/posture.webp",
    color: "from-blue-500/20 to-transparent"
  },
  {
    id: 2,
    title: "Mengatasi Nyeri Punggung: Panduan Pencegahan Saraf Kejepit",
    excerpt: "Nyeri punggung bukan hanya masalah lansia. Ketahui strategi pelestarian tulang belakang (spine preservation) untuk tetap aktif di usia produktif.",
    category: "Kesehatan Spine",
    date: "5 Mei 2026",
    readTime: "10 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/article_exercise.webp",
    color: "from-emerald-500/20 to-transparent"
  },
  {
    id: 3,
    title: "Kapan Harus Menjalani Operasi Saraf Kejepit? Memahami Indikasi Absolut Tindakan Bedah",
    excerpt: "Sebagian besar kasus saraf kejepit (HNP) bisa sembuh tanpa operasi. Pahami tanda bahaya atau indikasi absolut kapan tindakan bedah saraf menjadi wajib dilakukan.",
    category: "Kesehatan Spine",
    date: "4 Mei 2026",
    readTime: "9 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/articles/lumbar_compression.webp",
    color: "from-rose-500/20 to-transparent"
  },
  {
    id: 4,
    title: "Radiofrekuensi Ablasi (RFA) Saraf: Solusi Nyeri Sendi Facet Tulang Belakang Tanpa Operasi",
    excerpt: "Bagi penderita nyeri pinggang kronis akibat radang sendi facet, tindakan RFA menawarkan pereda nyeri jangka panjang dengan menonaktifkan sensor nyeri saraf secara presisi.",
    category: "Kesehatan Spine",
    date: "3 Mei 2026",
    readTime: "7 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/articles/lumbar_compression.webp",
    color: "from-amber-500/20 to-transparent"
  },
  {
    id: 5,
    title: "Masa Depan Bedah Spine: AI dan Asisten Robotik",
    excerpt: "Bagaimana teknologi AI memberikan presisi sub-milimeter dalam operasi dekompresi/stabilisasi tulang belakang dan mempercepat rehabilitasi.",
    category: "Teknologi",
    date: "2 Mei 2026",
    readTime: "11 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/articles/ai_robotic_surgery.webp",
    color: "from-purple-500/20 to-transparent"
  },
  {
    id: 6,
    title: "Terapi PRP (Platelet-Rich Plasma) untuk Degenerasi Bantalan Tulang Belakang: Harapan Baru Regenerasi Sendi",
    excerpt: "Pelajari bagaimana terapi biologis suntikan plasma kaya trombosit (PRP) dapat memicu regenerasi sel bantalan sendi lumbar yang aus dan meminimalkan nyeri punggung.",
    category: "Kesehatan Spine",
    date: "1 Mei 2026",
    readTime: "9 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/spine_scan.webp",
    color: "from-blue-500/20 to-transparent"
  },
  {
    id: 7,
    title: "Bebas Saraf Kejepit dengan Sayatan 5mm: Mengenal Endoskopi Tulang Belakang (BESS)",
    excerpt: "Revolusi operasi saraf kejepit melalui sayatan kunci (keyhole surgery) minimal invasif untuk pemulihan instan pasca-tindakan.",
    category: "Kesehatan Spine",
    date: "30 April 2026",
    readTime: "8 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/articles/endoscopic_spine.webp",
    color: "from-emerald-500/20 to-transparent"
  },
  {
    id: 8,
    title: "Mielopati Cervical: Gejala Jepitan Saraf Leher yang Mempengaruhi Ketangkasan Jari dan Keseimbangan Berjalan",
    excerpt: "Sering mengancingkan baju terasa sulit atau jalan terasa goyah? Waspadai Mielopati Servikal akibat penyempitan saraf pusat di leher Anda.",
    category: "Kesehatan Spine",
    date: "29 April 2026",
    readTime: "9 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/articles/lumbar_compression.webp",
    color: "from-blue-500/20 to-transparent"
  },
  {
    id: 9,
    title: "Cedera Saraf Tulang Belakang (Spinal Cord Injury): Detik-Detik Emas 'Golden Hour' untuk Mencegah Kelumpuhan",
    excerpt: "Kecelakaan atau benturan hebat pada punggung membutuhkan penanganan darurat bedah saraf segera. Pahami dekompresi tulang belakang.",
    category: "Kesehatan Spine",
    date: "28 April 2026",
    readTime: "10 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/spine_scan.webp",
    color: "from-emerald-500/20 to-transparent"
  },
  {
    id: 10,
    title: "Terapi Injeksi Epidural Steroid (ESI): Mengatasi Peradangan Akut pada Saraf Kejepit Lumbar",
    excerpt: "Injeksi epidural steroid secara langsung ke kanal spinal dapat dengan cepat meredakan nyeri sciatica menjalar hebat akibat hernia diskus lumbar.",
    category: "Kesehatan Spine",
    date: "27 April 2026",
    readTime: "9 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/articles/endoscopic_spine.webp",
    color: "from-purple-500/20 to-transparent"
  },
  {
    id: 11,
    title: "Pilihan Terapi Tanpa Operasi Saraf Kejepit: Mengapa Blok Saraf dan PLDD Menjadi Solusi Populer",
    excerpt: "Bagi penderita saraf kejepit yang takut operasi besar, tindakan minimal invasif seperti Selective Nerve Root Block dan dekompresi laser PLDD menawarkan pemulihan cepat tanpa rawat inap.",
    category: "Kesehatan Spine",
    date: "26 April 2026",
    readTime: "8 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/articles/lumbar_compression.webp",
    color: "from-emerald-500/20 to-transparent"
  },
  {
    id: 12,
    title: "Mengenal Operasi ACDF dan MISS TLIF: Kapan Stabilisasi Tulang Belakang dengan Pen/Sekrup Diperlukan?",
    excerpt: "Memahami indikasi fusi leher (ACDF) dan bedah minimal invasif pinggang (MISS TLIF). Pelajari protokol pemulihan pasca-tindakan demi stabilitas implan pen tulang belakang.",
    category: "Kesehatan Spine",
    date: "25 April 2026",
    readTime: "9 menit",
    author: "dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS",
    image: "/images/spine_scan.webp",
    color: "from-blue-500/20 to-transparent"
  }
];

export default function ArticlesPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("https://newsletter-api.eka-prasaja.workers.dev/v1/wisnu-baskoro-k6uh8/subscribe", {
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
            <p className="text-foreground/40 mt-2">Wawasan medis terpercaya untuk kesehatan bedah saraf Anda.</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Cari artikel..." 
              className="w-full bg-card border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all shadow-inner"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide touch-pan-x">
            {["Semua", "Gaya Hidup", "Spine", "Intervensi Nyeri", "Teknologi"].map((tag) => (
              <button key={tag} className="px-6 py-4 bg-card border border-white/5 rounded-2xl text-sm font-bold text-foreground/40 hover:text-white hover:border-primary/20 transition-all whitespace-nowrap">
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link key={article.id} href={`/articles/${article.id}`} className="group cursor-pointer">
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
                  src={article.image} 
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
      </section>

      {/* Newsletter Section */}
      <section className="px-5 md:px-12 pb-20">
        <div className="bg-primary/5 border border-primary/10 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] -z-10 rounded-full" />
          
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-outfit font-bold text-white mb-6">Jangan Lewatkan Update Medis</h2>
          <p className="text-base md:text-xl text-foreground/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Dapatkan tips wawasan bedah saraf langsung ke inbox Anda setiap minggu. Berlangganan buletin kami sekarang.
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
