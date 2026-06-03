"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ActivitySquare, 
  TrendingUp, 
  AlertCircle, 
  Save, 
  ChevronRight, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  RefreshCw,
  Scale,
  Sparkles,
  Stethoscope,
  Calendar,
  Clock,
  MapPinned,
  X
} from "lucide-react";
import { useOrthoStore } from "@/store/useOrthoStore";
import { ClinicalSection } from "@/components/shared/ClinicalSection";
import { ToolInstruction } from "@/components/shared/ToolInstruction";
import { doctorConfig } from "@/doctor-config";

type WeightBearProcedure = "vertebroplasty" | "tlif" | "general";

export default function WeightBearGuide() {
  const addRecord = useOrthoStore((state) => state.addRecord);
  
  const [procedureType, setProcedureType] = useState<WeightBearProcedure>("general");
  const [bodyWeight, setBodyWeight] = useState<string>("70");
  const [percentage, setPercentage] = useState<number>(25);
  const [painLevel, setPainLevel] = useState<number>(2);
  const [suddenWeakness, setSuddenWeakness] = useState<boolean | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [result, setResult] = useState<{
    targetWeightKg: number;
    status: "stable" | "warning" | "danger";
    zone: string;
    message: string;
  } | null>(null);

  const parsedWeight = parseFloat(bodyWeight);
  const localTargetKg = isNaN(parsedWeight) ? 0 : Math.round((parsedWeight * (percentage / 100)) * 10) / 10;

  const handleCalculate = async () => {
    if (isNaN(parsedWeight) || parsedWeight <= 0 || suddenWeakness === null) return;

    setIsLoading(true);

    // Wait a brief moment for satisfying UX loading state
    await new Promise(r => setTimeout(r, 450));

    const fallbackTarget = localTargetKg;
    let status: "stable" | "warning" | "danger" = "stable";
    let zone = "ZONA HIJAU";
    let message = "Latihan berjalan terpantau aman dan terkontrol. Lanjutkan latihan secara disiplin untuk mempercepat pemulihan Anda.";

    if (suddenWeakness) {
      status = "danger";
      zone = "ZONA MERAH";
      if (procedureType === "tlif") {
        message = "⚠️ PERINGATAN DARURAT FOOT DROP (TLIF)\nTerjadi kelemahan motorik kaki mendadak (sulit mengangkat pergelangan kaki / foot drop). Ini mengindikasikan kemungkinan kompresi atau regangan serius pada akar saraf L5 pasca-operasi TLIF.\n\nTindakan Darurat Segera:\n1. Segera hentikan seluruh latihan jalan, berbaring telentang flat.\n2. Segera hubungi dr. Nama Dokter, Sp.OT, Subsp. OTB (K) atau langsung menuju UGD!";
      } else if (procedureType === "vertebroplasty") {
        message = "⚠️ PERINGATAN DARURAT MOTORIK (POST-SEMEN MEDIS)\nTerjadi kelemahan kaki mendadak pasca-injeksi semen medis tulang belakang. Hal ini mengindikasikan kompresi sumsum saraf mendadak (misalnya akibat semen medis meluap ke kanal spinal).\n\nTindakan Darurat Segera:\n1. Hentikan seluruh aktivitas berjalan, berbaring telentang tegap.\n2. Segera hubungi dr. Nama Dokter, Sp.OT, Subsp. OTB (K) untuk rontgen/CT Scan tulang belakang darurat!";
      } else {
        message = "⚠️ PERINGATAN DARURAT MOTORIK\nTerjadi kelemahan motorik kaki secara mendadak. Segera hentikan latihan berjalan menggunakan kruk Anda dan segera periksakan diri ke dr. Nama Dokter, Sp.OT, Subsp. OTB (K) atau ke IGD terdekat!";
      }
    } else if (painLevel >= 7) {
      status = "danger";
      zone = "ZONA MERAH";
      message = "⚠️ PERINGATAN SKALA NYERI EKSTREM\nSkala nyeri Anda sangat tinggi (" + painLevel + "/10). Memaksakan latihan jalan dalam kondisi nyeri hebat berisiko tinggi melonggarkan implan sekrup fiksasi atau memperparah iritasi saraf tulang belakang.";
    } else if (painLevel >= 5) {
      status = "warning";
      zone = "ZONA KUNING";
      message = "Terdeteksi peningkatan nyeri sedang (" + painLevel + "/10). Kurangi tumpuan beban kaki sementara waktu (gunakan alat bantu kruk/walker lebih dominan), istirahatlah dengan posisi punggung rileks, dan gunakan penyangga (korset/brace) jika dianjurkan.";
    } else if (procedureType === "tlif") {
      // TLIF specific green message
      message = "Latihan berjalan pasca-TLIF berjalan dengan baik. Tetap patuhi aturan BLT (No Bending, No Twisting, No heavy Lifting) untuk menjaga sekrup percutaneous, dan pertahankan target tumpuan beban kaki " + fallbackTarget + " kg (" + percentage + "%).";
    } else if (procedureType === "vertebroplasty") {
      // Vertebroplasty specific green message
      message = "Mobilisasi bertahap pasca-Vertebroplasty (semen medis osteoporosis) terpantau aman. Jaga postur tubuh tetap tegap saat berjalan untuk membantu perkuatan semen medis, hindari gerakan meliuk/duduk membungkuk, dan jangan mengangkat beban > 2kg.";
    }

    const statusMap = {
      stable: "normal" as const,
      warning: "warning" as const,
      danger: "critical" as const
    };

    if (status !== "danger") {
      addRecord({
        type: "WeightBear",
        value: {
          bodyWeight: parsedWeight,
          percentage: percentage,
          targetWeightKg: fallbackTarget,
          painScale: painLevel,
          suddenWeakness: suddenWeakness,
          zone: zone
        },
        status: statusMap[status],
        notes: `Weight-Bear Log (${procedureType}): ${zone} - Target ${fallbackTarget} kg`
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }

    setResult({
      targetWeightKg: fallbackTarget,
      status: status,
      zone: zone,
      message: message
    });

    setIsLoading(false);
  };

  const handleReset = () => {
    setBodyWeight("70");
    setPercentage(25);
    setPainLevel(2);
    setSuddenWeakness(null);
    setResult(null);
  };

  const isFormComplete = !isNaN(parsedWeight) && parsedWeight > 0 && suddenWeakness !== null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ─── Emergency Overlay for Motor Weakness (ZONA MERAH) ─── */}
      <AnimatePresence>
        {result && result.status === "danger" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#0A0505] flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.18),transparent_70%)] animate-pulse" />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative max-w-2xl w-full bg-[#1A0A0A] border-2 border-red-500/40 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center space-y-8 animate-shake"
            >
              <div className="mx-auto w-24 h-24 rounded-full bg-red-500/10 border-4 border-red-500 flex items-center justify-center animate-bounce shadow-xl shadow-red-500/25">
                <ShieldAlert className="w-12 h-12 text-red-500" />
              </div>

              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                  ZONA MERAH • MEDIS DARURAT
                </span>
                <h2 className="text-3xl md:text-5xl font-outfit font-black text-white leading-tight uppercase tracking-tight">
                  ⚠️ PERINGATAN DARURAT MOTORIK
                </h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent w-3/4 mx-auto my-4" />
                <p className="text-sm md:text-base text-red-200/90 font-medium leading-relaxed max-w-xl mx-auto">
                  Terjadi indikasi penurunan kekuatan motorik kaki secara mendadak. <strong>Segera hentikan latihan berjalan menggunakan kruk Anda.</strong>
                </p>
              </div>

              <div className="bg-black/50 border border-red-500/10 rounded-2xl p-6 text-left space-y-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
                  Tindakan yang Harus Dilakukan Segera:
                </p>
                <ul className="space-y-3.5 text-sm font-semibold text-white/90">
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span>Segera jadwalkan pertemuan langsung atau lakukan pemeriksaan fisik darurat dengan <strong className="text-red-400 font-bold">dr. Nama Dokter, Sp.OT, Subsp. OTB (K)</strong> di Rumah Sakit sekarang.</span>
                  </li>
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span>Segera kunjungi <strong>Instalasi Gawat Darurat (IGD)</strong> Rumah Sakit terdekat untuk evaluasi rontgen / saraf ulang!</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setShowClinicModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-6 rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
                >
                  <Stethoscope className="w-5 h-5" /> Kunjungi Klinik dr. Wisnu (Tatap Muka)
                </button>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=IGD+Instalasi+Gawat+Darurat+Rumah+Sakit+Terdekat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
                >
                  <MapPin className="w-5 h-5 text-red-400" /> Temukan IGD Terdekat
                </a>
              </div>

              <div className="pt-6 border-t border-red-500/10">
                <button 
                  onClick={() => {
                    if (confirm("Pernyataan Medis:\nSaya telah memahami peringatan ini dan akan segera menghentikan latihan jalan. Setel ulang layar kuesioner?")) {
                      handleReset();
                    }
                  }}
                  className="text-xs font-bold text-red-500/50 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Abaikan & Mulai Ulang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <div className="w-full bg-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden p-8 md:p-12 space-y-12">
        {/* Header */}
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ActivitySquare className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-white tracking-tight">Weight-Bear Guide</h2>
            <p className="text-cyan-400/80 text-xs font-black uppercase tracking-[0.2em] mt-0.5">Partial Weight Bearing (PWB) Protocol</p>
          </div>
        </div>

        {/* Education Goal Instructions */}
        <ToolInstruction 
          color="emerald"
          educationalGoal="Weight-Bear Guide memandu pasien Neurotrauma atau Neurospine yang mengalami paraparesis (kelemahan kaki) pasca-operasi stabilisasi tulang belakang. Panduan ini memastikan tumpuan berat badan bertahap berjalan sesuai batas aman agar tidak merusak fiksasi implan pen atau memperparah jepitan saraf."
          steps={[
            { title: "Input Data Dasar", desc: "Masukkan Berat Badan Utuh Anda saat ini dan Persentase Beban instruksi Dokter (25%, 50%, atau 75%)." },
            { title: "Gunakan Timbangan", desc: "Tempatkan timbangan injak di bawah kaki sakit saat berdiri untuk merasakan target beban kilogram secara akurat." },
            { title: "Skrining Nyeri & Saraf", desc: "Pilih skala kenyamanan nyeri VAS serta jawab skrining kelemahan motorik secara jujur harian." },
            { title: "Simpan Secara Lokal", desc: "Hasil kalkulasi akan disimpan di memori HP Anda secara aman untuk langsung ditunjukkan pada dr. Wisnu saat jadwal kontrol." }
          ]}
        />

        {/* Instan Results Summary for Green/Yellow */}
        <AnimatePresence mode="wait">
          {result && result.status !== "danger" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`p-6 rounded-[2rem] border ${
                result.status === "stable" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              } space-y-4`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    result.status === "stable" ? "bg-emerald-500/20" : "bg-amber-500/20"
                  }`}>
                    ✓
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Hasil Evaluasi PWB</p>
                    <h3 className="text-lg font-outfit font-black uppercase tracking-tight">
                      {result.zone} • Target: {result.targetWeightKg} kg ({percentage}%)
                    </h3>
                  </div>
                </div>
                {isSaved && (
                  <span className="text-[10px] bg-emerald-500 text-white font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <Save className="w-3 h-3" /> Tersimpan
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-white/95 leading-relaxed italic">
                "{result.message}"
              </p>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Latihan Baru
                </button>
                <Link
                  href="/dashboard"
                  className={`px-5 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${
                    result.status === "stable" 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20" 
                      : "bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20"
                  }`}
                >
                  Lihat Rekam Medis <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Form Fields */}
        {!result && (
          <div className="space-y-10">
            <div className="h-px bg-white/5 w-full" />

            {/* Target Gauge Visual Preview */}
            <div className="p-8 bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
              <div>
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Kalkulasi Batas Aman
                </span>
                <h3 className="text-4xl md:text-5xl font-outfit font-black text-white">
                  {localTargetKg} <span className="text-lg font-bold text-foreground/40 font-sans">kg</span>
                </h3>
                <p className="text-xs text-foreground/50 mt-1 max-w-sm leading-relaxed">
                  Target tekanan beban maksimal pada kaki yang sakit ({percentage}% dari total {parsedWeight || 0} kg berat tubuh).
                </p>
              </div>

              {/* Graphical Adaptative Bar */}
              <div className="w-full md:w-48 bg-white/5 h-4 rounded-full overflow-hidden border border-white/5 relative">
                <motion.div 
                  className="bg-cyan-500 h-full shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                />
              </div>
            </div>

            {/* 1. Pilih Prosedur / Tindakan Medis */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                1. Pilih Prosedur / Tindakan Medis Anda
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { type: "tlif", label: "MISS TLIF (Fusi Sekrup)", desc: "Pasca-Fiksasi Sekrup", icon: "🔩" },
                  { type: "vertebroplasty", label: "Vertebroplasty (Semen)", desc: "Semen Medis Osteoporosis", icon: "💉" },
                  { type: "general", label: "Trauma Patah Kaki / Lainnya", desc: "Umum / Fiksasi Ekstremitas", icon: "🦵" }
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setProcedureType(item.type as WeightBearProcedure);
                      // Set default percentage logically based on procedure
                      if (item.type === "vertebroplasty") {
                        setPercentage(100); // Full mobilization expected early
                      } else if (item.type === "tlif") {
                        setPercentage(50); // Partial weight-bearing initially
                      } else {
                        setPercentage(25);
                      }
                      setResult(null);
                    }}
                    className={`p-4 rounded-2xl border text-left font-bold transition-all hover:scale-[1.01] flex items-center gap-3 ${
                      procedureType === item.type
                        ? "bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/5"
                        : "bg-[#18181b]/30 border-white/5 text-zinc-400 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-white leading-snug">{item.label}</span>
                      <span className="text-[7.5px] text-zinc-500 font-medium normal-case leading-none mt-0.5">{item.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Body Weight Input */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                2. Masukkan Berat Badan Utuh Anda (kg)
              </label>
              <div className="relative group max-w-xs">
                <input 
                  type="number"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(e.target.value)}
                  placeholder="Contoh: 70"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-cyan-500 transition-all font-outfit font-bold text-lg"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm text-foreground/30 font-bold">Kg</span>
              </div>
            </div>

            {/* 3. Percentage Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                3. Pilih Persentase Beban Instruksi Dokter (%)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[25, 50, 75].map((pct) => {
                  const isSel = percentage === pct;
                  return (
                    <button
                      key={pct}
                      onClick={() => setPercentage(pct)}
                      className={`py-4 rounded-2xl border transition-all duration-300 font-outfit font-black ${
                        isSel 
                          ? "bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/5 scale-105"
                          : "bg-background/40 border-white/5 text-foreground/50 hover:bg-white/[0.03] hover:border-white/10"
                      }`}
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Pain Scale Selection (VAS) */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-cyan-400" />
                4. Pilih Tingkat Skala Nyeri Saat Berdiri/Melangkah (VAS)
              </label>
              <div className="bg-white/5 rounded-3xl border border-white/10 p-6 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-foreground/40">
                  <span>Bebas Nyeri (0)</span>
                  <span>Sangat Nyeri (10)</span>
                </div>
                <div className="flex justify-between gap-1.5 overflow-x-auto scrollbar-hide py-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const isSel = painLevel === num;
                    return (
                      <button
                        key={num}
                        onClick={() => setPainLevel(num)}
                        className={`flex-1 min-w-[32px] aspect-square rounded-xl text-xs font-bold transition-all ${
                          isSel 
                            ? "bg-cyan-500 text-white scale-110 shadow-lg shadow-cyan-500/30 font-black"
                            : "bg-background/50 border border-white/5 text-foreground/40 hover:bg-white/5"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. Sudden Neurological Weakness Screening */}
            <div className="space-y-4">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                5. Skrining Motorik (Kritis)
              </label>
              <div className="bg-red-500/[0.02] border border-red-500/10 rounded-3xl p-6 md:p-8 space-y-5">
                <p className="text-sm font-bold text-white leading-relaxed">
                  Apakah Anda mendadak merasa kaki jauh lebih lemas atau lumpuh total dibanding kemarin?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSuddenWeakness(true)}
                    className={`flex-1 py-4 rounded-2xl border transition-all duration-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${
                      suddenWeakness === true 
                        ? "bg-red-500/20 border-red-500 text-red-400 shadow-lg shadow-red-500/5 font-black"
                        : "bg-background/40 border-white/5 text-foreground/40 hover:bg-red-500/5 hover:border-red-500/10"
                    }`}
                  >
                    Ya, Terasa Lumpuh / Lemas
                  </button>
                  <button
                    onClick={() => setSuddenWeakness(false)}
                    className={`flex-1 py-4 rounded-2xl border transition-all duration-300 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${
                      suddenWeakness === false 
                        ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/5 font-black"
                        : "bg-background/40 border-white/5 text-foreground/40 hover:bg-emerald-500/5 hover:border-emerald-500/10"
                    }`}
                  >
                    Tidak, Kekuatan Sama / Stabil
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Evaluate Button */}
            <button
              onClick={handleCalculate}
              disabled={!isFormComplete || isLoading}
              className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] text-sm md:text-base ${
                isFormComplete 
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white shadow-xl shadow-cyan-500/20" 
                  : "bg-white/5 border border-white/5 text-foreground/20 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Mengevaluasi Batas Aman Saraf...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" /> Hitung & Simpan Batas Beban Aman
                </>
              )}
            </button>
          </div>
        )}

        {/* Clinical Section Disclaimer */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <ClinicalSection 
            title="Dasar Klinis: Partial Weight Bearing (PWB) Medula Spinalis"
            description="Latihan jalan bertahap (PWB) pada pasien paraparesis pasca-operasi stabilisasi tulang belakang bertujuan melindungi implan pen/pedicle screw dari degradasi mekanis (loose/breakage) sembari melatih sinap-sinap motorik baru. Skrining motorik harian mendeteksi dini kegagalan implan atau pergeseran vertebra yang mengancam kompresi medula spinalis akut."
            disclaimer="Status PWB sangat bervariasi sesuai level cedera korda spinalis Anda. Selalu ikuti persentase beban spesifik dari dr. Nama Dokter, Sp.OT, Subsp. OTB (K)."
            colorClass="cyan"
          />
        </div>
      </div>

      {/* ─── CLINICAL PRACTICE DETAILS MODAL ─── */}
      <AnimatePresence>
        {showClinicModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowClinicModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-md w-full bg-[#111113] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowClinicModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon & Title */}
              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] block">Praktek Klinis</span>
                <h3 className="text-xl font-bold text-white">Jadwal & Alamat Praktek</h3>
              </div>

              <div className="h-px bg-white/5 w-full" />

              {/* Clinic Info */}
              <div className="space-y-4 text-left">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    RS Soeradji Tirtonegoro Klaten
                  </h4>
                  <div className="flex gap-2.5 text-xs text-foreground/60 leading-relaxed">
                    <MapPinned className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>Jalan KRT Jl. Dr. Soeradji Tirtonegoro No.1, Dusun 1, Tegalyoso, Kec. Klaten Sel., Kabupaten Klaten, Jawa Tengah 57424</span>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex items-center gap-3.5">
                  <Clock className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-primary uppercase tracking-wider">Jam Praktek</h5>
                    <p className="text-xs font-bold text-white mt-1">Senin – Jumat</p>
                    <p className="text-[10px] text-foreground/50">09.00 – 14.00 WIB</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=RS+Dr.+Soeradji+Tirtonegoro+Klaten"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-primary text-white font-bold rounded-2xl text-center text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20"
                >
                  Buka Peta Lokasi
                </a>
                <button 
                  onClick={() => setShowClinicModal(false)}
                  className="block w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl text-sm transition-colors hover:bg-white/10"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
