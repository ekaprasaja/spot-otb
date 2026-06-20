"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Stethoscope, 
  Bone, 
  Hand, 
  Baby, 
  Zap, 
  ActivitySquare, 
  Scan, 
  ChevronRight,
  Shield,
  Bell,
  Info,
  X,
  Mail,
  BookOpen,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import DoctorCard from "@/components/DoctorCard";
import { useDoctorConfig } from "@/context/DoctorConfigContext";
import DiagnosticToolGrid from "@/components/patterns/DiagnosticToolGrid";
import MedicalInsightScroller from "@/components/patterns/MedicalInsightScroller";
import AnimeBackground from "@/components/shared/AnimeBackground";
import Magnetic from "@/components/shared/Magnetic";
import { useMotionValue, useSpring } from "framer-motion";
import React, { useEffect } from "react";

const tools = [
  {
    id: "sciatica-radiculopathy",
    title: "Spine & Pain",
    tool: "Sciatica & Radiculopathy Mapper",
    desc: "Skrining mandiri 3 menit gejala jepitan saraf pinggang menjalar (sciatica) atau saraf leher",
    icon: <Activity className="w-5 h-5" />,
    color: "bg-emerald-500",
    href: "/tools/sciatica-radiculopathy",
  },
  {
    id: "dermatome-tracker",
    title: "Spine & Pain",
    tool: "Dermatome Pain Tracker",
    desc: "Pemetaan area kebas, kesemutan, atau hilangnya sensasi raba pada kulit sesuai dermatom saraf spinal",
    icon: <Hand className="w-5 h-5" />,
    color: "bg-indigo-500",
    href: "/tools/dermatome-tracker",
  },
  {
    id: "dexterity",
    title: "Cervical Spine",
    tool: "Dexterity Pulse",
    desc: "Uji koordinasi motorik halus jari telunjuk untuk memantau derajat keparahan Cervical Myelopathy leher",
    icon: <Hand className="w-5 h-5" />,
    color: "bg-rose-500",
    href: "/tools/dexterity",
  },
  {
    id: "spine-inclinometer",
    title: "Spine ROM",
    tool: "Cervical & Lumbar ROM",
    desc: "Evaluasi batas aman leher & pinggang pasca-operasi besar fusi tulang belakang",
    icon: <Scan className="w-5 h-5" />,
    color: "bg-emerald-500",
    href: "/tools/spine",
  },
  {
    id: "trauma",
    title: "Spine Trauma",
    tool: "Weight-Bear Guide",
    desc: "Panduan pembebanan kaki aman bertahap pasca fiksasi internal cedera tulang belakang",
    icon: <ActivitySquare className="w-5 h-5" />,
    color: "bg-purple-500",
    href: "/tools/trauma",
  },
  {
    id: "edema",
    title: "Spine Surgical",
    tool: "Wound & CSF Tracker",
    desc: "Evaluasi perban luka operasi tulang belakang dari rembesan cairan serebrospinal (CSF)",
    icon: <ActivitySquare className="w-5 h-5" />,
    color: "bg-blue-500",
    href: "/tools/edema",
  },
  {
    id: "recovery",
    title: "Spine & Pain",
    tool: "VAS & Neuro-Deficit Diary",
    desc: "Evaluasi pemulihan harian skala nyeri (VAS) dan jarak berjalan pasca-tindakan injeksi blok saraf",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "bg-indigo-500",
    href: "/tools/recovery",
  },
];

export default function Home() {
  const doctorConfig = useDoctorConfig();
  const isSpog = doctorConfig?.whitelabelType === "spog";
  const customHeroTitle = doctorConfig?.heroTitle;
  const customHeroDesc = doctorConfig?.heroDescription;
  
  // Mobile Hero
  let heroTitleMobile = isSpog ? "Kesehatan Kehamilan," : "Spine & Pain,";
  let heroHighlightMobile = "Prioritas Utama";
  if (customHeroTitle) {
    if (customHeroTitle.includes(",")) {
      const parts = customHeroTitle.split(",");
      heroTitleMobile = parts.slice(0, -1).join(",") + ",";
      heroHighlightMobile = parts[parts.length - 1].trim();
    } else {
      heroTitleMobile = customHeroTitle;
      heroHighlightMobile = "";
    }
  }
  const heroDescMobile = customHeroDesc ? customHeroDesc : (isSpog 
    ? "Edukasi kehamilan & kandungan terpercaya di bawah pengawasan ahli."
    : "Edukasi intervensi nyeri & bedah tulang belakang terpercaya di bawah pengawasan ahli.");

  // Desktop Hero
  let heroTitleDesktop = isSpog ? "Kesehatan Kehamilan & Janin Anda," : "Kesehatan Spine & Manajemen Nyeri,";
  let heroHighlightDesktop = "Prioritas Utama Kami";
  if (customHeroTitle) {
    if (customHeroTitle.includes(",")) {
      const parts = customHeroTitle.split(",");
      heroTitleDesktop = parts.slice(0, -1).join(",") + ",";
      heroHighlightDesktop = parts[parts.length - 1].trim();
    } else {
      heroTitleDesktop = customHeroTitle;
      heroHighlightDesktop = "";
    }
  }
  const heroDescDesktop = customHeroDesc ? customHeroDesc : (isSpog
    ? "Dapatkan akses mandiri ke asisten digital kehamilan berstandar SpOG untuk menghitung HPL, rekam detak tendangan janin, kalkulator kontraksi 5-1-1, dan skrining preeklampsia dini."
    : "Dapatkan edukasi medis orthopedi tulang belakang & manajemen nyeri terpercaya serta akses teknologi diagnostik mandiri langsung di bawah pengawasan ahli.");

  const [showAboutModal, setShowAboutModal] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [articles, setArticles] = useState<any[]>([
    {
      id: "1",
      title: "Deteksi Dini Osteosarcoma",
      desc: "Waspadai nyeri tulang persisten pada anak-anak dan remaja di usia pertumbuhan aktif.",
      tag: "Kanker Tulang",
      img: "/images/articles/osteosarcoma.png"
    },
    {
      id: "3",
      title: "Limb Salvage Surgery",
      desc: "Teknologi rekonstruksi ekstremitas untuk menyelamatkan tungkai tanpa amputasi pada kanker tulang.",
      tag: "Teknologi Bedah",
      img: "/images/articles/limb_salvage.png"
    },
    {
      id: "2",
      title: "Sarkoma Jaringan Lunak",
      desc: "Mengapa ketepatan melakukan jalur biopsi pertama sangat menentukan masa depan ekstremitas pasien.",
      tag: "Tumor Jaringan Lunak",
      img: "/images/articles/soft_tissue_sarcoma.png"
    }
  ]);

  useEffect(() => {
    let active = true;
    async function fetchWpArticles() {
      if (!doctorConfig) return;
      try {
        if (doctorConfig.wordpressApiUrl) {
          const cleanUrl = doctorConfig.wordpressApiUrl.replace(/\/$/, '');
          let fetchUrl = `${cleanUrl}/wp-json/wp/v2/posts?_embed&per_page=5`;
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
                let thumbnail = "/images/article_exercise.webp";
                const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];
                if (featuredMedia?.source_url) {
                  thumbnail = featuredMedia.source_url;
                }

                let category = "EDUKASI";
                const terms = post._embedded?.['wp:term']?.[0];
                if (terms && terms.length > 0) {
                  category = terms[0].name;
                }

                let desc = post.excerpt?.rendered || "";
                desc = desc.replace(/<[^>]*>/g, '').substring(0, 120) + "...";

                return {
                  id: post.id || post.slug,
                  title: post.title?.rendered || 'Artikel Edukasi',
                  desc: desc,
                  tag: category,
                  img: thumbnail
                };
              });

              if (active) {
                setArticles(wpArticles);
                return;
              }
            }
          }
        }

        const tenantId = doctorConfig.id || 'spot-otb';
        const res = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles`);
        if (res.ok) {
          const data = await res.json();
          if (data?.articles && Array.isArray(data.articles) && data.articles.length > 0) {
            const cfArticles = data.articles.slice(0, 5).map((art: any) => ({
              id: art.slug || art.id,
              title: art.title,
              desc: art.excerpt || art.description || "Baca artikel lengkap mengenai kesehatan saraf dan tulang belakang.",
              tag: "EDUKASI",
              img: art.cover_image || "/images/article_exercise.webp"
            }));

            if (active) {
              setArticles(cfArticles);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch articles in SPOT-OTB homepage:", err);
      }
    }

    fetchWpArticles();
    return () => { active = false; };
  }, [doctorConfig]);

  const handleSubscribe = async (e: React.FormEvent) => {
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
      setErrorMessage("Koneksi gagal. Silakan periksa jaringan Anda.");
    }
  };
  
  // Mouse tracking for "magic" effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      {/* Educational Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAboutModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl max-h-[85vh] bg-[#121214] border border-white/10 rounded-[3rem] shadow-3xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 p-6 z-[20]">
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide relative">
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary/20 border border-primary/20 flex items-center justify-center mb-8">
                    <Info className="w-8 h-8 text-primary" />
                  </div>

                  <h2 className="text-3xl font-outfit font-bold text-white mb-6 tracking-tight">Tentang Aplikasi</h2>
                  
                  <div className="space-y-6">
                    <p className="text-sm text-foreground/60 leading-relaxed">
                      Platform ini dikembangkan dengan tujuan utama memberikan <span className="text-white font-bold">edukasi dan wawasan mendalam</span> seputar kesehatan tulang belakang (spine) dan manajemen intervensi nyeri (pain intervention) melalui bantuan teknologi AI terkini.
                    </p>

                    <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                      <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Peringatan Medis Penting (Update)
                      </h3>
                      <p className="text-xs text-amber-200/60 leading-relaxed">
                        Seluruh fitur diagnosis dan pemantauan mandiri yang tersedia di sini dirancang khusus sebagai <span className="text-amber-400 font-bold underline decoration-amber-400/30">alat bantu edukatif (educational tools)</span> dan bukan merupakan pengganti diagnosis medis profesional, saran medis, atau perawatan dari tenaga medis ahli.
                      </p>
                    </div>

                    <p className="text-sm text-foreground/60 leading-relaxed">
                      Kami sangat menyarankan Anda untuk selalu berkonsultasi dengan <span className="text-primary font-bold">dokter spesialis orthopedi konsultan tulang belakang (spine)</span> atau tenaga medis profesional sebelum mengambil keputusan medis apa pun. Gunakan teknologi ini secara bijak untuk meningkatkan kesadaran akan kesehatan tubuh Anda.
                    </p>

                    <button 
                      onClick={() => setShowAboutModal(false)}
                      className="w-full py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Saya Mengerti
                    </button>
                  </div>
                </div>

                {/* Decorative Glow */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* --- SHARED HERO SECTION --- */}
      <section className="relative px-5 md:px-12 pt-8 md:pt-16 pb-10 md:pb-20 overflow-hidden tech-grid">
        <AnimeBackground />
        
        {/* Magic Background Elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(0,119,255,0.18)_0%,transparent_100%)] md:bg-[radial-gradient(40%_40%_at_20%_20%,rgba(0,119,255,0.2)_0%,transparent_100%)]" 
        />

        {/* Digital Pulse / Scanline */}
        <motion.div
          animate={{ 
            y: ["0%", "200%"],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent -z-10 pointer-events-none"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,12,0.4)_100%)] pointer-events-none -z-10" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
        >
          {/* Left Content: Text & CTAs */}
          <div className="relative max-w-2xl">
            {/* MOBILE: Content OVER Portrait */}
            <div className="lg:hidden relative">
              {/* Mobile Decorative Glow Ring */}
              <motion.div 
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 rounded-[4rem] blur-2xl -z-10 opacity-60"
              />

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative w-full aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl mb-8 group"
              >
                <img src={doctorConfig.image} alt="dr. Prahesta Adi Wibowo, Sp.OT — Dokter Spesialis Bedah Tulang Belakang Orthopaedic Spine Klaten & Yogyakarta" className="w-full h-full object-cover object-top" />
                
                {/* Advanced Gradient Masking */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c]/60 via-transparent to-transparent" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="self-start"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/10 rounded-full backdrop-blur-md">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">Live Consultation</span>
                    </div>
                  </motion.div>

                  {/* Mobile HUD HUD Spell */}
                  <div className="absolute top-20 right-6 flex flex-col gap-2 pointer-events-none">
                    {[
                      { label: "AI Scan", val: "ACTIVE", color: "text-emerald-400" },
                      { label: "Accuracy", val: "99.2%", color: "text-primary" },
                      { label: "Status", val: "Ready", color: "text-white" }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          y: [0, -8, 0]
                        }}
                        transition={{ 
                          delay: 1 + i * 0.2,
                          y: {
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }
                        }}
                        className="px-2.5 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl"
                      >
                        <p className="text-[6px] font-black uppercase text-white/40 leading-none mb-1 tracking-tighter">{item.label}</p>
                        <p className={`text-[8px] font-bold ${item.color} leading-none tracking-tight`}>{item.val}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h1 className="text-[28px] font-outfit font-bold leading-[1.1] mb-2 tracking-tight text-white drop-shadow-lg">
                        {heroTitleMobile.split("").map((char, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 + i * 0.03 }}
                          >
                            {char}
                          </motion.span>
                        ))}
                        <br />
                        {heroHighlightMobile.split("").map((char, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 + i * 0.03 }}
                            className="text-primary"
                          >
                            {char}
                          </motion.span>
                        ))}
                      </h1>
                      
                      <p className="text-xs text-white/70 leading-relaxed mb-6 max-w-[240px]">
                        {heroDescMobile.split(" ").map((word, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2 + i * 0.1 }}
                            className="inline-block mr-1"
                          >
                            {word}
                          </motion.span>
                        ))}
                      </p>

                      <div className="flex flex-col gap-3">
                        <Link 
                          href="/tools" 
                          prefetch={false}
                          className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,119,255,0.3)] active:scale-95 transition-transform"
                        >
                          Cek Gejala Sekarang <ChevronRight className="w-5 h-5" />
                        </Link>
                        
                        <div className="flex items-center gap-3 mt-2 pt-4 border-t border-white/10">
                          <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shrink-0">
                            <img src={doctorConfig.image} alt="dr. Prahesta Adi Wibowo, Sp.OT — Orthopaedic Spine" className="w-full h-full object-cover object-top" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-[10px] font-bold text-white truncate">{doctorConfig.name}</h4>
                            <p className="text-[9px] text-white/50">{doctorConfig.specialty}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* DESKTOP CONTENT (Hidden on Mobile) */}
            <div className="hidden lg:block">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Available for Consultation</span>
              </div>
            </motion.div>
 
            <h1 className="text-[36px] md:text-7xl font-outfit font-bold leading-[1.05] mb-8 tracking-tight">
              {heroTitleDesktop.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                  className="inline-block mr-3"
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-primary inline-block mt-2 relative group"
              >
                {heroHighlightDesktop}
                <motion.div 
                  animate={{ 
                    x: ["-100%", "200%"],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] pointer-events-none"
                />
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-lg md:text-xl text-foreground/60 leading-relaxed mb-10 max-w-xl"
            >
              {heroDescDesktop}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex flex-wrap gap-4"
            >
              <Magnetic>
                <Link 
                  href="/tools" 
                  prefetch={false}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_8px_30px_rgb(0,119,255,0.3)]"
                >
                  Cek Gejala Sekarang <ChevronRight className="w-5 h-5" />
                </Link>
              </Magnetic>
            </motion.div>
            </div>
          </div>

          {/* Right Content: Doctor Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative w-[500px] h-[600px] mx-auto">
              {/* Background Glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
              
              {/* Main Image Container */}
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-white/20 shadow-2xl group">
                <img 
                  src={doctorConfig.image} 
                  alt={doctorConfig.name}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                {/* Cinematic Scan Beam */}
                <motion.div 
                  animate={{ 
                    y: ["-100%", "200%"],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-primary/20 to-transparent z-10 pointer-events-none"
                />
                
                {/* HUD Metrics Overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  {[
                    { label: "Bone Integrity", val: "98.4%", top: "15%", left: "10%" },
                    { label: "Joint Mobility", val: "Optimal", top: "25%", right: "10%" },
                    { label: "Neural Response", val: "12ms", bottom: "35%", left: "15%" }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      style={{ 
                        top: stat.top, 
                        left: stat.left, 
                        right: stat.right, 
                        bottom: stat.bottom,
                        x: springX.get() * (i % 2 === 0 ? 0.01 : -0.01),
                        y: springY.get() * (i % 2 === 0 ? 0.01 : -0.01)
                      }}
                      animate={{
                        y: [0, -10, 0],
                        transition: {
                          duration: 3 + i,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className="absolute p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl"
                    >
                      <p className="text-[8px] font-black uppercase tracking-widest text-primary mb-1">{stat.label}</p>
                      <p className="text-xs font-bold text-white">{stat.val}</p>
                    </motion.div>
                  ))}
                </div>
                
                {/* Overlay Info Card */}
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-card rounded-3xl border border-white/20 backdrop-blur-xl z-30">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{doctorConfig.name}</h3>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-primary/80 font-medium mb-3">{doctorConfig.specialty}</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white/10 bg-slate-800" />
                      ))}
                    </div>
                    <span className="text-[11px] text-white/50 font-medium">10,000+ Patients Helped</span>
                  </div>
                </div>
              </div>

              {/* Kinetic Indicators */}
              <div className="absolute -top-4 -right-4 w-24 h-24 glass-card rounded-2xl flex flex-col items-center justify-center border border-white/20 animate-bounce-subtle">
                <Activity className="w-8 h-8 text-primary mb-1" />
                <span className="text-[10px] font-bold text-white/60">LIVE</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- DESKTOP DESIGN (GRID/BENTO) --- */}
      <section className="hidden md:block px-12 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-outfit font-bold text-white">Alat Bantu Kesehatan Mandiri</h2>
            <p className="text-sm text-foreground/40 mt-1">Gunakan simulasi AI kami untuk memantau kondisi tulang belakang Anda di rumah</p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-foreground/40">
              Total 7 Modules
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Link key={tool.id} href={tool.href} prefetch={false} className="group">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="h-full p-8 bg-card hover:bg-white/[0.04] rounded-[2.5rem] border border-white/[0.03] hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col group"
              >
                {/* Hover Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-${tool.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform duration-500`}>
                  {tool.icon}
                </div>
                
                <div className="mt-auto">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] mb-2 block">{tool.title}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.tool}</h3>
                  <p className="text-sm text-foreground/40 leading-relaxed line-clamp-2">{tool.desc}</p>
                </div>

                <div className="mt-8 flex items-center text-primary text-[11px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                  Open Module <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <DoctorCard />
        </div>

        {/* --- LATEST ARTICLES SECTION --- */}
        {articles.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-outfit font-bold text-white">Wawasan Medis</h2>
                <p className="text-sm text-foreground/40 mt-1">Edukasi kesehatan orthopedi dan tumor tulang untuk pemulihan optimal Anda</p>
              </div>
              <Link href="/articles" prefetch={false} className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">
                Lihat Semua Artikel
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {articles.slice(0, 3).map((post, idx) => (
                <Link key={post.id} href={`/articles/detail?id=${post.id}`} prefetch={false} className="group">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-card rounded-[2rem] border border-white/5 overflow-hidden group-hover:border-primary/20 transition-all"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest mb-2 block">{post.tag}</span>
                      <h4 className="text-white font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h4>
                      <p className="text-[12px] text-foreground/40 line-clamp-2">{post.desc}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}
          {/* --- PREMIUM INTEGRATED NEWSLETTER BANNER --- */}
          <div className="mt-24 relative overflow-hidden bg-gradient-to-br from-primary/10 via-white/[0.02] to-transparent rounded-[3rem] border border-white/[0.05] p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] -z-10 rounded-full pointer-events-none" />
            
            <div className="max-w-xl relative text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
                <Bell className="w-3.5 h-3.5" />
                Edukasi Berkala
              </div>
              <h3 className="text-3xl md:text-4xl font-outfit font-bold text-white mb-4 tracking-tight">
                Dapatkan Update Kesehatan Orthopedi & Bone Tumor
              </h3>
              <p className="text-sm md:text-base text-foreground/50 leading-relaxed">
                Bergabunglah dengan ribuan pembaca setia kami. Dapatkan wawasan tepercaya, tips kebugaran orthopedi, dan artikel edukasi medis dari {doctorConfig.name} langsung ke inbox Anda setiap minggu.
              </p>
            </div>

            <div className="w-full lg:max-w-md shrink-0">
              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Pendaftaran Berhasil!</h4>
                  <p className="text-xs text-foreground/60 leading-relaxed">
                    Silakan periksa inbox Anda untuk mengonfirmasi pendaftaran buletin.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3 text-left">
                  <div className="relative flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input 
                        type="email" 
                        required
                        disabled={status === "submitting"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan alamat email Anda" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-12 text-sm text-white placeholder-foreground/30 focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30">
                        <Mail className="w-5 h-5" />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={status === "submitting"}
                      className="bg-primary text-white px-8 py-4 rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:scale-100 shrink-0 flex items-center justify-center gap-2"
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
                      className="text-xs text-rose-500 font-bold pl-2"
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                  <p className="text-[10px] text-foreground/30 pl-2 leading-relaxed">
                    Kami menjaga privasi Anda. Anda dapat berhenti berlangganan kapan saja dengan sekali klik.
                  </p>
                </form>
              )}
            </div>
          </div>

        {/* Web Footer Branding */}
        <footer className="py-16 text-center border-t border-white/[0.02] mt-24">
          <div className="flex justify-center gap-8 mb-8">
            <Link href="/privacy" className="text-xs font-bold text-foreground/30 uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs font-bold text-foreground/30 uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</Link>
          </div>
          <div className="flex justify-center gap-4 mb-4 opacity-20">
            <Shield className="w-5 h-5 text-primary" />
            <Activity className="w-5 h-5 text-primary" />
            <Stethoscope className="w-5 h-5 text-primary" />
          </div>
          <p className="text-[10px] text-foreground/20 uppercase font-black tracking-[0.4em] mb-2">
            Orthopaedic Spine Specialist Care • 2026
          </p>
          <p className="text-[10px] text-foreground/30 uppercase tracking-widest">
            Made by <a href="https://incodepanel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Incode Panel</a>
          </p>
        </footer>
      </section>

      {/* --- MOBILE DESIGN (LIST/NATIVE) --- */}
      {/* --- MOBILE DESIGN (MODERN PREMIUM) --- */}
      <div className="md:hidden bg-[#0A0A0B] min-h-screen pb-[calc(8rem+env(safe-area-inset-bottom))] overflow-x-hidden relative">
        {/* Floating Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <motion.div 
            animate={{ 
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-primary/5 blur-[100px] rounded-full"
          />
          <motion.div 
            animate={{ 
              x: [0, -40, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[100px] rounded-full"
          />
        </div>

        {/* Mobile Header Profile - REMOVED: Now handled by AppShell's MobileHeader */}


        <section className="px-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-primary/5 to-transparent border border-primary/20 overflow-hidden shadow-2xl shadow-primary/10 tech-grid"
          >
            <AnimeBackground />
            <motion.div 
              animate={{ 
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-48 h-48 bg-primary/20 blur-[60px] -mr-24 -mt-24" 
            />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 blur-[40px] -ml-16 -mb-16" />
            
            <div className="relative z-10">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 mb-4"
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(0,119,255,1)]" />
                <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">AI Diagnostics Live</span>
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-3 tracking-tight leading-tight">
                {["Pendamping", "Kesehatan"].map((word, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="text-primary text-4xl block mt-1"
                >
                  Orthopedi & Spine
                </motion.span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-xs text-foreground/50 leading-relaxed mb-6 max-w-[80%]"
              >
                Teknologi AI tercanggih untuk deteksi dini dan pemantauan spesialis orthopedi mandiri.
              </motion.p>
              
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAboutModal(true)}
                className="px-8 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-bold shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center gap-2 group"
              >
                Tentang Aplikasi
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Featured Tools Section - Replacement for Bento Trust */}
        <section className="px-6 grid grid-cols-2 gap-4 mb-12">
          <Link href="/tools/sciatica-radiculopathy" prefetch={false} className="block">
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="relative p-6 rounded-[2.5rem] overflow-hidden aspect-square shadow-2xl border border-white/10 group"
            >
              <img 
                src="/images/article_exercise.webp" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Ilustrasi Latihan Pemulihan Tulang Belakang dr. Prahesta Adi Wibowo, Sp.OT — Orthopaedic Spine"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
              <div className="relative h-full flex flex-col justify-between z-10">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight mb-1">Sciatica <br />Mapper</h3>
                  <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em]">Symptom Mapping</p>
                </div>
              </div>
            </motion.div>
          </Link>
          <Link href="/tools/spine" prefetch={false} className="block">
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="relative p-6 rounded-[2.5rem] overflow-hidden aspect-square shadow-2xl border border-white/10 group"
            >
              <img 
                src="/images/spine_scan.webp" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt="Hasil Pemindaian MRI Tulang Belakang Lumbar — Orthopaedic Spine Klaten & Yogyakarta"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
              <div className="relative h-full flex flex-col justify-between z-10">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Scan className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white leading-tight mb-1">Cervical & <br />Lumbar ROM</h3>
                  <p className="text-[8px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Orthopedi & Spine</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </section>

        <DiagnosticToolGrid 
          tools={tools.filter(t => t.id !== 'sciatica-radiculopathy' && t.id !== 'spine-inclinometer').map((t, i) => ({
            ...t,
            isNew: i === 0
          }))} 
        />

        <MedicalInsightScroller 
          insights={articles.map(art => ({
            id: art.id,
            title: art.title,
            tag: art.tag,
            img: art.img
          }))} 
        />

        <section className="px-6 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] whitespace-nowrap">Meet Your Surgeon</h2>
            <div className="h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />
          </div>
          <DoctorCard />
        </section>

        {/* Specialized Stats Footer - Mobile */}
        {/* Newsletter Section - Mobile */}
        <section className="px-6 mb-12">
          <div className="bg-gradient-to-br from-primary/20 via-white/[0.02] to-transparent border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] -z-10 rounded-full" />
            
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">Buletin Kesehatan</h3>
              <p className="text-xs text-foreground/50 leading-relaxed">
                Dapatkan wawasan medis terpercaya dari {doctorConfig?.name || "dokter kami"} langsung ke inbox Anda setiap minggu.
              </p>
            </div>

            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-6 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                  ✓
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Berhasil!</h4>
                <p className="text-[10px] text-foreground/60 leading-relaxed">
                  Periksa email Anda untuk menyelesaikan pendaftaran.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    disabled={status === "submitting"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Alamat email Anda" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-xs text-white placeholder-foreground/30 focus:outline-none focus:border-primary/50 transition-all disabled:opacity-50 animate-none"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-primary text-white py-3.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Mendaftarkan...
                    </>
                  ) : (
                    "Berlangganan Sekarang"
                  )}
                </button>
                {status === "error" && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] text-rose-500 font-bold text-center"
                  >
                    {errorMessage}
                  </motion.p>
                )}
                <p className="text-[9px] text-foreground/30 text-center leading-relaxed">
                  Anda dapat berhenti berlangganan kapan saja.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Mobile Footer Branding */}
        <footer className="py-12 text-center px-6 border-t border-white/[0.02]">
          <div className="flex justify-center gap-6 mb-8">
            <Link href="/privacy" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</Link>
          </div>
          <div className="flex justify-center gap-3 mb-4 opacity-20">
            <Shield className="w-4 h-4 text-primary" />
            <Activity className="w-4 h-4 text-primary" />
            <Stethoscope className="w-4 h-4 text-primary" />
          </div>
          <p className="text-[9px] text-foreground/20 uppercase font-black tracking-[0.4em] mb-2">
            Neurosurgery Specialist Care • 2026
          </p>
          <p className="text-[9px] text-foreground/30 uppercase tracking-widest">
            Made by <a href="https://incodepanel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Incode Panel</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
