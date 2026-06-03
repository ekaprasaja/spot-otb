"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  PhoneCall, 
  ShieldAlert, 
  RefreshCw, 
  ChevronRight,
  Info,
  MapPin,
  TrendingUp,
  SlidersHorizontal,
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

type InterventionType = "nerve_block" | "pldd" | "radiofrequency" | "conservative";

export default function SpinalRecoveryTracker() {
  const addRecord = useOrthoStore((state) => state.addRecord);
  
  const [intervention, setIntervention] = useState<InterventionType>("nerve_block");
  const [vasPainScore, setVasPainScore] = useState<number>(3);
  const [walkingDuration, setWalkingDuration] = useState<string>("15");
  const [claudicationLimit, setClaudicationLimit] = useState<string>("300");
  const [transientConfirmed, setTransientConfirmed] = useState<boolean>(false);
  const [hasNewNumbness, setHasNewNumbness] = useState<boolean | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [result, setResult] = useState<{
    status: "stable" | "warning" | "danger";
    zone: string;
    message: string;
  } | null>(null);

  const parsedDuration = parseInt(walkingDuration);
  const parsedLimit = parseInt(claudicationLimit);

  const handleCalculate = async () => {
    if (isNaN(parsedDuration) || isNaN(parsedLimit) || hasNewNumbness === null) return;
    
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 450));

    let status: "stable" | "warning" | "danger" = "stable";
    let zone = "ZONA HIJAU";
    let message = "Tingkat pemulihan Anda terpantau sangat baik. Skala nyeri terkontrol dan kapasitas berjalan stabil. Tetap patuhi program rehabilitasi bertahap.";

    // Clinical Logic
    if (hasNewNumbness) {
      status = "danger";
      zone = "ZONA MERAH";
      if (intervention === "nerve_block") {
        message = "⚠️ ALARM DEFISIT SARAF PASCA-TINDAKAN\nAnda melaporkan kebas/lemas baru yang progresif di kaki. Jika ini terjadi lebih dari 6 jam pasca-suntikan blok saraf, hal ini mengindikasikan potensi risiko hematoma (bekuan darah) yang menekan akar saraf spinal di area suntikan.\n\nTindakan Darurat:\n1. Segera hentikan aktivitas berjalan, berbaring rata tanpa bantal.\n2. Segera kunjungi tempat praktek dr. Nama Dokter, Sp.OT, Subsp. OTB (K) atau menuju Instalasi Gawat Darurat (IGD) Rumah Sakit terdekat!";
      } else if (intervention === "pldd") {
        message = "⚠️ ALARM DEFISIT SARAF PASCA-PLDD\nTerjadi kelemahan/kebas baru pasca-tindakan dekompresi laser. Ini merupakan indikasi iritasi saraf akut atau kompresi sisa bantalan tulang belakang.\n\nTindakan Darurat:\n1. Berbaring telentang, jangan membungkuk atau memutar pinggang.\n2. Segera kunjungi tempat praktek dr. Nama Dokter, Sp.OT, Subsp. OTB (K) sekarang untuk evaluasi neurologis tatap muka darurat!";
      } else {
        message = "⚠️ ALARM NEUROLOGIS PROGRESIF\nTerjadi kelemahan motorik atau kebas baru pada kaki yang semakin memberat. Segera kunjungi tempat praktek dr. Nama Dokter, Sp.OT, Subsp. OTB (K) secara langsung atau langsung kunjungi IGD terdekat!";
      }
    } else if (vasPainScore >= 7) {
      status = "danger";
      zone = "ZONA MERAH";
      message = "⚠️ ALERT SKALA NYERI EKSTREM\nSkala nyeri Anda berada di level berat (" + vasPainScore + "/10). Sangat dianjurkan untuk tidak memaksakan aktivitas fisik, segera konsumsi obat pereda nyeri sesuai resep dr. Nama Dokter, Sp.OT, Subsp. OTB (K), dan segera jadwalkan kontrol jika nyeri menetap lebih dari 24 jam.";
    } else if (vasPainScore >= 4 || parsedLimit < 100) {
      status = "warning";
      zone = "ZONA KUNING";
      if (parsedLimit < 100) {
        message = "Kapasitas jalan Anda memendek secara signifikan (< 100 meter) sebelum timbul nyeri/kebas (Klaudikasi Spinal). Kurangi aktivitas berdiri lama atau berjalan jauh, posisikan tubuh membungkuk sedikit ke depan saat duduk untuk memperlonggar kanal saraf, dan catat perkembangan skala nyeri Anda.";
      } else {
        message = "Nyeri Anda terpantau di skala sedang (" + vasPainScore + "/10). Batasi aktivitas beban tulang belakang, gunakan korset penyangga bila berjalan, lakukan kompres hangat di punggung, dan minumlah obat pereda nyeri sesuai anjuran.";
      }
    } else if (intervention === "nerve_block" && !transientConfirmed) {
      status = "warning";
      zone = "ZONA KUNING";
      message = "Catatan: Jika Anda baru saja menjalani tindakan blok saraf dalam 4-6 jam terakhir, rasa tebal, kebas, atau lemas pada kaki adalah efek normal dari anestesi lokal yang akan memudar sepenuhnya dalam waktu beberapa jam. Silakan konfirmasi edukasi ini di bawah.";
    }

    addRecord({
      type: "Recovery",
      value: {
        vasPainScore: vasPainScore,
        walkingDurationMins: isNaN(parsedDuration) ? 0 : parsedDuration,
        claudicationLimitMeters: isNaN(parsedLimit) ? 0 : parsedLimit,
        transientNumbnessConfirmed: transientConfirmed,
        zone: zone
      },
      status: status === "stable" ? "normal" : status === "warning" ? "warning" : "critical",
      notes: `Spinal Recovery (${intervention}): ${zone} - VAS ${vasPainScore}/10, Jalan ${parsedLimit}m`
    });

    setResult({
      status,
      zone,
      message
    });
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    setIsLoading(false);
  };

  const handleReset = () => {
    setIntervention("nerve_block");
    setVasPainScore(3);
    setWalkingDuration("15");
    setClaudicationLimit("300");
    setTransientConfirmed(false);
    setHasNewNumbness(null);
    setResult(null);
  };

  const getVasColor = (score: number) => {
    if (score <= 3) return "text-emerald-400";
    if (score <= 6) return "text-amber-400";
    return "text-red-500";
  };

  const getVasLabel = (score: number) => {
    if (score === 0) return "Tidak Ada Nyeri";
    if (score <= 3) return "Nyeri Ringan (Aktivitas Normal)";
    if (score <= 6) return "Nyeri Sedang (Mengganggu Konsentrasi)";
    if (score <= 9) return "Nyeri Berat (Sangat Mengganggu Aktivitas)";
    return "Nyeri Ekstrem / Tak Tertahankan";
  };

  const isFormComplete = !isNaN(parsedDuration) && !isNaN(parsedLimit) && hasNewNumbness !== null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ─── Emergency Overlay for New Neurological Deficit (ZONA MERAH) ─── */}
      <AnimatePresence>
        {result && result.status === "danger" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#0A0505] flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.2),transparent_70%)] animate-pulse" />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative max-w-2xl w-full bg-[#1A0A0A] border-2 border-red-500/40 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center space-y-8"
            >
              <div className="mx-auto w-24 h-24 rounded-full bg-red-500/10 border-4 border-red-500 flex items-center justify-center animate-bounce shadow-xl shadow-red-500/25">
                <ShieldAlert className="w-12 h-12 text-red-500" />
              </div>

              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-black uppercase tracking-[0.2em]">
                  ZONA MERAH • KRITIS
                </span>
                <h2 className="text-3xl md:text-5xl font-outfit font-black text-white leading-tight uppercase tracking-tight">
                  ALARM DEFISIT NEUROLOGIS
                </h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent w-3/4 mx-auto my-4" />
                <p className="text-sm md:text-base text-red-200/90 font-medium leading-relaxed max-w-xl mx-auto whitespace-pre-line">
                  {result.message}
                </p>
              </div>

              <div className="bg-black/50 border border-red-500/10 rounded-2xl p-6 text-left space-y-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
                  Petunjuk Tindakan Segera:
                </p>
                <ul className="space-y-3.5 text-sm font-semibold text-white/90">
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span><strong>Segera hentikan mobilitas</strong>, berbaring telentang rata (flat) untuk mengurangi kompresi mekanis.</span>
                  </li>
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span>Hubungi <strong className="text-red-400 font-bold">dr. Nama Dokter, Sp.OT, Subsp. OTB (K)</strong> sekarang juga untuk instruksi lebih lanjut.</span>
                  </li>
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <span>Jika respon melambat atau kelumpuhan memberat secara progresif, <strong>segera pergi ke Unit Gawat Darurat (UGD) terdekat</strong>.</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setShowClinicModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-6 rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
                  id="btn-emergency-clinic"
                >
                  <Stethoscope className="w-5 h-5" /> Kunjungi Klinik dr. Wisnu (Tatap Muka)
                </button>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Instalasi+Gawat+Darurat+IGD+Rumah+Sakit+Terdekat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
                  id="btn-emergency-maps"
                >
                  <MapPin className="w-5 h-5 text-red-400" /> Navigasi UGD (Google Maps)
                </a>
              </div>

              <div className="pt-6 border-t border-red-500/10">
                <button 
                  onClick={() => {
                    if (confirm("Apakah Anda menyatakan telah mengerti petunjuk darurat di atas dan ingin menyetel ulang kuesioner pemulihan ini?")) {
                      handleReset();
                    }
                  }}
                  className="text-xs font-bold text-red-500/50 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Setel Ulang Peringatan Kritis
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Standard Questionnaire Flow ─── */}
      <div className="w-full bg-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden p-8 md:p-12 space-y-12">
        {/* Header */}
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <TrendingUp className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-white tracking-tight">VAS Pain & Recovery Tracker</h2>
            <p className="text-indigo-400/80 text-xs font-black uppercase tracking-[0.2em] mt-0.5">Spinal Interventions & Rehab Log</p>
          </div>
        </div>

        {/* Instructions */}
        <ToolInstruction 
          color="purple"
          educationalGoal="Alat pemantauan harian pasca-tindakan injeksi blok saraf, PLDD, atau terapi konservatif punggung. Mengukur skala nyeri visual (VAS), kemampuan berjalan fungsional, dan mendeteksi defisit saraf progresif sedini mungkin."
          steps={[
            { title: "Pilih Prosedur Anda", desc: "Tentukan tindakan medis yang baru saja Anda jalani dari menu pilihan." },
            { title: "Geser Skala Nyeri", desc: "Tentukan tingkat nyeri tulang belakang Anda hari ini dari skala 0 (tidak ada nyeri) hingga 10." },
            { title: "Catat Jarak Jalan", desc: "Masukkan jarak berjalan maksimal (meter) sebelum timbul rasa nyeri tebal atau kebas." },
            { title: "Skrining Tanda Bahaya", desc: "Konfirmasi apakah ada kebas baru yang mendadak atau kelemahan motorik pasca-tindakan." }
          ]}
        />

        {/* State Banner / Result Display (Green/Yellow) */}
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
              <div className="flex items-center gap-3">
                {result.status === "stable" ? (
                  <CheckCircle className="w-6 h-6 shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 shrink-0" />
                )}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status Pemulihan</p>
                  <h3 className="text-xl font-outfit font-black uppercase tracking-tight">
                    {result.zone}
                  </h3>
                </div>
              </div>

              <p className="text-sm font-semibold text-white/95 leading-relaxed pl-1 whitespace-pre-line">
                {result.message}
              </p>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Ulangi Evaluasi
                </button>
                <Link
                  href="/dashboard"
                  className={`px-5 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 ${
                    result.status === "stable" 
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20" 
                      : "bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-500/20"
                  }`}
                  id="btn-view-records"
                >
                  Lihat Rekam Medis <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        {!result && (
          <div className="space-y-10">
            {/* Step 1: Treatment Type */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 1. Jenis Tindakan Medis Tulang Belakang
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: "nerve_block", title: "Injeksi Blok Saraf", desc: "Suntikan anestesi lokal & steroid ke akar saraf" },
                  { id: "pldd", title: "PLDD (Laser Dekompresi)", desc: "Penyusutan bantalan sendi menggunakan serat laser" },
                  { id: "radiofrequency", title: "Radiofrekuensi Ablasi", desc: "Penonaktifan jarum sensor nyeri saraf facet" },
                  { id: "conservative", title: "Terapi Konservatif / Obat", desc: "Pemulihan mandiri dengan obat & fisioterapi" }
                ].map((item) => {
                  const isSelected = intervention === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setIntervention(item.id as InterventionType)}
                      className={`text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-1.5 ${
                        isSelected 
                          ? "bg-indigo-500/10 border-indigo-500/40 text-white shadow-lg shadow-indigo-500/5" 
                          : "bg-background/40 border-white/5 text-foreground/75 hover:bg-white/[0.03] hover:border-white/10"
                      }`}
                      id={`opt-treatment-${item.id}`}
                    >
                      <span className="text-sm font-bold block">{item.title}</span>
                      <span className="text-[11px] text-foreground/40 leading-relaxed block">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: VAS Pain Scale Slider */}
            <div className="space-y-4 bg-background/20 border border-white/5 rounded-3xl p-6 md:p-8">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> 2. Skala Nyeri Visual (VAS Pain Score)
                </label>
                <span className={`text-3xl font-black font-outfit ${getVasColor(vasPainScore)}`}>
                  {vasPainScore} <span className="text-sm text-foreground/40">/ 10</span>
                </span>
              </div>

              <div className="space-y-4 pt-4">
                <input 
                  type="range"
                  min="0"
                  max="10"
                  value={vasPainScore}
                  onChange={(e) => setVasPainScore(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-white/5 rounded-lg appearance-none"
                  id="slider-vas-pain"
                />
                
                <div className="flex justify-between text-[10px] font-bold text-foreground/30 px-1">
                  <span>0 (Bebas Nyeri)</span>
                  <span>5 (Nyeri Sedang)</span>
                  <span>10 (Nyeri Ekstrem)</span>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center mt-4">
                  <p className="text-xs font-semibold text-white/80">
                    Kategori Nyeri: <strong className={getVasColor(vasPainScore)}>{getVasLabel(vasPainScore)}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Walking Tolerances */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> 3a. Durasi Jalan Tanpa Nyeri (Menit)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={walkingDuration}
                    onChange={(e) => setWalkingDuration(e.target.value)}
                    placeholder="Contoh: 15"
                    className="w-full bg-background/50 border border-white/5 rounded-2xl py-4 pl-5 pr-16 text-sm text-white focus:outline-none focus:border-indigo-500/30 transition-all font-semibold"
                    id="input-walking-duration"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground/30">Menit</span>
                </div>
                <p className="text-[10px] text-foreground/40 italic leading-relaxed pl-1">
                  Berapa lama Anda bisa berdiri atau berjalan sebelum nyeri punggung/kaki mulai timbul.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> 3b. Jarak Bebas Klaudikasi (Meter)
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    value={claudicationLimit}
                    onChange={(e) => setClaudicationLimit(e.target.value)}
                    placeholder="Contoh: 300"
                    className="w-full bg-background/50 border border-white/5 rounded-2xl py-4 pl-5 pr-16 text-sm text-white focus:outline-none focus:border-indigo-500/30 transition-all font-semibold"
                    id="input-claudication-limit"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-foreground/30">Meter</span>
                </div>
                <p className="text-[10px] text-foreground/40 italic leading-relaxed pl-1">
                  Perkiraan jarak berjalan kaki sebelum Anda terpaksa berhenti/membungkuk untuk meredakan nyeri kaki.
                </p>
              </div>
            </div>

            {/* Step 4: Emergency Warning Check (Numbness or Weakness) */}
            <div className="space-y-4 bg-red-500/[0.02] border border-red-500/10 rounded-3xl p-6 md:p-8">
              <label className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> 4. Skrining Kelemahan Motorik & Defisit Baru
              </label>
              
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white/90">
                  Apakah Anda merasakan kebas baru, baal, atau kaki terasa lemas (seperti mau lepas/sulit diangkat) yang terus memburuk pasca-tindakan?
                </p>
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setHasNewNumbness(true)}
                    className={`flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${
                      hasNewNumbness === true 
                        ? "bg-red-500/20 border-red-500/40 text-red-400" 
                        : "bg-background border-white/5 text-foreground/60 hover:bg-white/[0.02]"
                    }`}
                    id="btn-numbness-yes"
                  >
                    Ya, Ada Kebas/Lemas Baru
                  </button>
                  <button
                    onClick={() => setHasNewNumbness(false)}
                    className={`flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${
                      hasNewNumbness === false 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-background border-white/5 text-foreground/60 hover:bg-white/[0.02]"
                    }`}
                    id="btn-numbness-no"
                  >
                    Tidak Ada
                  </button>
                </div>
              </div>
            </div>

            {/* Step 5: Transient block confirmation - only for nerve block injection */}
            {intervention === "nerve_block" && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                <input 
                  type="checkbox"
                  checked={transientConfirmed}
                  onChange={(e) => setTransientConfirmed(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-indigo-500 cursor-pointer"
                  id="chk-transient-confirmed"
                />
                <div className="space-y-1">
                  <label htmlFor="chk-transient-confirmed" className="text-xs font-bold text-white cursor-pointer select-none">
                    Saya Memahami Edukasi Kelemahan Sementara (Transient Block)
                  </label>
                  <p className="text-[10px] text-foreground/40 leading-relaxed leading-normal">
                    Menyatakan Anda mengerti bahwa lemas atau tebal beberapa jam setelah suntikan adalah hal wajar akibat obat bius lokal dan akan pulih dengan sendirinya.
                  </p>
                </div>
              </div>
            )}

            {/* Calculate Button */}
            <div className="h-px bg-white/5 w-full pt-4" />
            
            <button
              onClick={handleCalculate}
              disabled={!isFormComplete || isLoading}
              className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] text-sm md:text-base ${
                isFormComplete 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/25" 
                  : "bg-white/5 border border-white/5 text-foreground/20 cursor-not-allowed"
              }`}
              id="btn-calculate-recovery"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Menganalisis Parameter Nyeri & Pemulihan...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" /> Evaluasi Progress Pemulihan
                </>
              )}
            </button>
          </div>
        )}

        {/* Clinical Section Footer */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <ClinicalSection 
            title="Dasar Medis: Visual Analog Scale (VAS) & Klaudikasi Saraf"
            description="Visual Analog Scale (VAS) merupakan baku emas klinis untuk mengukur tingkat keparahan nyeri secara subjektif. Pada kelainan tulang belakang (seperti HNP atau stenosis), perbaikan kapasitas jalan tanpa keluhan kesemutan/lemas (Klaudikasi Intermiten Neurogenik) adalah tolok ukur utama keberhasilan terapi intervensi nyeri (PLDD/Block) untuk memantau dekompresi saraf yang memadai."
            disclaimer="Layanan log mandiri ini bersifat asisten pemantau pemulihan dan tidak menggantikan keputusan medis darurat dokter. Hubungi layanan darurat atau dr. Nama Dokter jika terjadi penurunan motorik ekstrim mendadak."
            colorClass="indigo"
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
