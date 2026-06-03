"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Activity, 
  Scan, 
  ChevronRight, 
  Zap, 
  Shield, 
  LayoutGrid,
  Search,
  ActivitySquare,
  Hand,
  XCircle,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import DiagnosticToolGrid from "@/components/patterns/DiagnosticToolGrid";
import SpotlightCard from "@/components/shared/SpotlightCard";

const tools = [
  {
    id: "sciatica-radiculopathy",
    tool: "Sciatica & Radiculopathy Mapper",
    href: "/tools/sciatica-radiculopathy",
    icon: <Activity className="w-5 h-5 text-emerald-400" />,
    color: "bg-emerald-500/10",
    category: "Spine & Pain",
    description: "Skrining mandiri 3 menit gejala jepitan saraf pinggang menjalar (sciatica) atau saraf leher.",
    recommendation: "Sangat Dianjurkan Pasien HNP & Stenosis Spinal"
  },
  {
    id: "dermatome-tracker",
    tool: "Dermatome Pain Tracker",
    href: "/tools/dermatome-tracker",
    icon: <Hand className="w-5 h-5 text-indigo-400" />,
    color: "bg-indigo-500/10",
    category: "Spine & Pain",
    description: "Pemetaan area kebas, kesemutan, atau hilangnya sensasi raba pada kulit sesuai dermatom saraf spinal.",
    recommendation: "Pantau Gangguan Sensorik & Terapi Nyeri Saraf"
  },
  {
    id: "dexterity",
    tool: "Dexterity Pulse",
    href: "/tools/dexterity",
    icon: <Hand className="w-5 h-5 text-rose-400" />,
    color: "bg-rose-500/10",
    category: "Cervical Spine",
    description: "Uji koordinasi motorik halus jari telunjuk untuk memantau derajat keparahan Cervical Myelopathy leher.",
    recommendation: "Pantau Kelemahan Jari Pasca-ACDF Leher & Mielopati"
  },
  {
    id: "spine-inclinometer",
    tool: "Cervical & Lumbar ROM",
    href: "/tools/spine",
    icon: <Scan className="w-5 h-5 text-emerald-400" />,
    color: "bg-emerald-500/10",
    category: "Spine ROM",
    description: "Evaluasi batas aman tunduk/dongak leher & pinggang pasca-operasi besar fusi tulang belakang.",
    recommendation: "Batas Aman Leher & Punggung Pasca-ACDF / BESS / TLIF"
  },
  {
    id: "trauma",
    tool: "Weight-Bear Guide",
    href: "/tools/trauma",
    icon: <ActivitySquare className="w-5 h-5 text-purple-400" />,
    color: "bg-purple-500/10",
    category: "Spine Trauma",
    description: "Panduan pembebanan kaki aman bertahap pasca fiksasi internal cedera tulang belakang.",
    recommendation: "Rehabilitasi Pasca-TLIF & Kyphoplasty Osteoporosis"
  },
  {
    id: "edema",
    tool: "Wound & CSF Tracker",
    href: "/tools/edema",
    icon: <ActivitySquare className="w-5 h-5 text-indigo-400" />,
    color: "bg-indigo-500/10",
    category: "Spine Surgical",
    description: "Evaluasi perban luka operasi tulang belakang dari rembesan cairan serebrospinal (CSF) secara stateless.",
    recommendation: "Pantau Luka Bedah ACDF/BESS & Kebocoran Cairan Serebrospinal"
  },
  {
    id: "recovery",
    tool: "VAS & Neuro-Deficit Diary",
    href: "/tools/recovery",
    icon: <TrendingUp className="w-5 h-5 text-indigo-400" />,
    color: "bg-indigo-500/10",
    category: "Spine & Pain",
    description: "Evaluasi pemulihan harian skala nyeri (VAS) dan jarak berjalan pasca-tindakan injeksi blok saraf.",
    recommendation: "Sangat Penting Pasca-Injeksi Blok Saraf & Tindakan Nyeri PLDD"
  }
];

export default function ToolsLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    return tools.filter(t => 
      t.tool.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex-1 min-h-screen bg-background pb-12">
      {/* Hero Section */}
      <header className="px-6 pt-10 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-primary" />
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Diagnostic Suite</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-inter font-bold text-white mb-3"
        >
          Perpustakaan Alat AI
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-foreground/40 leading-relaxed max-w-sm mb-8"
        >
          Koleksi alat diagnostik presisi tinggi untuk monitoring kesehatan saraf & pasca-operasi Anda secara mandiri.
        </motion.p>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari alat atau kategori..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/30 focus:bg-white/[0.05] transition-all"
          />
        </motion.div>
      </header>

      {/* Main Content */}
      <div className="px-6">
        {filteredTools.length > 0 ? (
          <>
            {/* Featured Tool - only show when not searching */}
            {!searchQuery && (
              <section className="mb-10">
                <Link href="/tools/sciatica-radiculopathy" prefetch={false}>
                  <SpotlightCard 
                    className="relative overflow-hidden group p-6 border-emerald-500/20 bg-emerald-500/[0.03] shadow-2xl"
                    spotlightColor="rgba(167, 243, 208, 0.2)"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Activity className="w-32 h-32 text-emerald-400" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-full">Terfavorit</span>
                        <span className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-widest">Symptom Mapping</span>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">Sciatica & Radiculopathy Mapper</h2>
                      <p className="text-sm text-foreground/50 mb-6 max-w-[200px]">Skrining mandiri 3 menit gejala jepitan saraf pinggang menjalar (sciatica) atau saraf leher.</p>
                      <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-bold uppercase tracking-widest translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        Mulai Skrining <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </SpotlightCard>
                </Link>
              </section>
            )}

            {/* All Tools Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">
                  {searchQuery ? `Hasil Pencarian (${filteredTools.length})` : "Semua Alat"}
                </h3>
                <div className="h-px flex-1 bg-white/5 ml-4" />
              </div>
              
              <DiagnosticToolGrid 
                tools={filteredTools.map(t => ({
                  ...t,
                  isNew: t.id === 'edema' || t.id === 'sciatica-radiculopathy' || t.id === 'dermatome-tracker' || t.id === 'dexterity' || t.id === 'recovery'
                }))} 
              />
            </section>
          </>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Alat Tidak Ditemukan</h3>
            <p className="text-sm text-foreground/40 max-w-xs mx-auto mb-8">
              Kami tidak dapat menemukan alat untuk "{searchQuery}". Coba kata kunci lain.
            </p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-primary font-bold text-xs uppercase tracking-widest"
            >
              Hapus Pencarian
            </button>
          </motion.div>
        )}
      </div>

      {/* Clinical Standards Footer */}
      <section className="px-6 mt-16 pb-10">
        <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-widest">Standar Klinis & Edukasi</h4>
            <p className="text-[10px] text-foreground/40 leading-relaxed">
              Seluruh algoritma AI divalidasi oleh spesialis orthopedi konsultan tulang belakang (spine) sebagai asisten pemantauan mandiri (monitoring aid) dan media edukasi penunjang. Alat ini bukan instrumen diagnosis medis resmi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
