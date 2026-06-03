"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ActivitySquare, 
  AlertTriangle, 
  CheckCircle, 
  PhoneCall, 
  ShieldAlert, 
  RefreshCw, 
  ChevronRight,
  Info,
  MapPin,
  TrendingUp,
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

type PrimaryLocation = "lumbar_radiation" | "cervical_radiation" | "lumbar_local" | "cervical_local" | "none";
type SensationType = "tingling_numbness" | "burning_heat" | "aching" | "cramping";
type AggravatingFactor = "sitting_bending" | "standing_walking" | "extension_rotation" | "none";

export default function SciaticaMapper() {
  const addRecord = useOrthoStore((state) => state.addRecord);

  const [primaryLocation, setPrimaryLocation] = useState<PrimaryLocation>("none");
  const [sensationType, setSensationType] = useState<SensationType>("aching");
  const [aggravatingFactor, setAggravatingFactor] = useState<AggravatingFactor>("none");
  const [painScale, setPainScale] = useState<number>(3);
  const [motorWeakness, setMotorWeakness] = useState<boolean | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [result, setResult] = useState<{
    status: "stable" | "warning" | "danger";
    zone: string;
    message: string;
    suspectedCondition: string;
  } | null>(null);

  const handleEvaluate = async () => {
    if (primaryLocation === "none" || motorWeakness === null) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    let status: "stable" | "warning" | "danger" = "stable";
    let zone = "ZONA HIJAU";
    let suspectedCondition = "Nyeri Punggung/Leher Non-Spesifik";
    let message = "Nyeri punggung atau leher Anda saat ini tergolong lokalisir tanpa gejala jepitan saraf radikuler yang berat. Silakan pantau gejala Anda secara berkala.";

    // Logic parsing
    if (motorWeakness) {
      status = "danger";
      zone = "ZONA MERAH";
      suspectedCondition = "Defisit Motorik Akut / Sindrom Kauda Ekuina Suspect";
      message = "🚨 ALARM KRITIS: DEFISIT MOTORIK PROGRESSIF\nKelemahan motorik mendadak (seperti foot drop/pergelangan kaki lunglai atau hilangnya genggaman tangan) menandakan kompresi saraf tingkat tinggi yang membutuhkan tindakan dekompresi segera.\n\nTindakan Darurat Anda:\n1. Segera hentikan aktivitas berjalan atau membawa barang berat.\n2. Segera menuju IGD Rumah Sakit terdekat atau hubungi dr. Wisnu Baskoro, Sp.BS untuk evaluasi bedah darurat demi mencegah kelumpuhan permanen!";
    } else if (painScale >= 7) {
      status = "danger";
      zone = "ZONA MERAH";
      suspectedCondition = "Radikulopati Berat dengan Nyeri Akut";
      message = "🚨 ALARM NYERI RADIKULER HEBAT\nNyeri menjalar hebat (VAS " + painScale + "/10) mengindikasikan inflamasi/gesekan agresif pada akar saraf. Direkomendasikan istirahat total (bed rest) dalam posisi semi-Fowler (lutut ditekuk/disangga bantal) untuk lumbar, atau menggunakan cervical collar lunak untuk leher.\n\nTindakan Darurat:\nSegera hubungi asisten klinis dr. Wisnu Baskoro untuk resep anti-inflamasi/anti-nyeri neuropatik dosis terarah.";
    } else if (primaryLocation === "lumbar_radiation") {
      status = "warning";
      zone = "ZONA KUNING";
      if (aggravatingFactor === "sitting_bending") {
        suspectedCondition = "Hernia Nukleus Pulposus (HNP) Lumbar Suspect";
        message = "Nyeri menjalar dari pinggang ke kaki yang memburuk saat duduk/membungkuk sangat dicurigai merupakan HNP Lumbar (L4-L5 / L5-S1). Bantalan sendi menonjol ke belakang menekan saraf sciatica.\n\nSaran Perawatan Mandiri:\n1. Batasi duduk tegak > 20 menit, berbaringlah jika nyeri timbul.\n2. Hindari membungkuk mengambil barang di lantai. Gunakan postur jongkok tegap.";
      } else if (aggravatingFactor === "standing_walking") {
        suspectedCondition = "Stenosis Kanalis Spinal Lumbar Suspect";
        message = "Nyeri/kebas menjalar pada kaki yang memburuk saat berdiri tegak atau jalan jauh, dan membaik saat membungkuk ke depan (Spinal Claudication) sangat khas untuk Stenosis Spinal.\n\nSaran Perawatan Mandiri:\n1. Saat berjalan, condongkan postur tubuh sedikit ke depan (membantu memperlebar kanal saraf).\n2. Istirahat berkala dengan posisi duduk condong ke depan.";
      } else {
        suspectedCondition = "Radikulopati Lumbar / Sciatica Ringan-Sedang";
        message = "Gejala kesemutan atau linu menjalar ke kaki mengindikasikan iritasi pada saraf sciatica (iskiadikus).\n\nSaran Perawatan Mandiri:\n1. Kompres hangat bagian pinggang selama 15-20 menit.\n2. Hindari mengangkat beban di atas 5 kg.";
      }
    } else if (primaryLocation === "cervical_radiation") {
      status = "warning";
      zone = "ZONA KUNING";
      suspectedCondition = "Radikulopati Cervical Suspect (Jepitan Saraf Leher)";
      message = "Nyeri menjalar dari leher ke bahu atau lengan Anda mengindikasikan kompresi akar saraf cervical (saraf leher).\n\nSaran Perawatan Mandiri:\n1. Batasi aktivitas menatap HP/laptop menunduk terlalu lama. Posisikan layar sejajar mata.\n2. Gunakan bantal ortopedi penyangga leher saat tidur, jangan gunakan bantal bertumpuk tinggi.\n3. Jangan menyampirkan tas ransel berat pada satu sisi bahu saja.";
    } else if (painScale >= 4) {
      status = "warning";
      zone = "ZONA KUNING";
      suspectedCondition = "Nyeri Tulang Belakang Lokal (Axial Spine Pain)";
      message = "Nyeri terlokalisir di area pinggang atau leher tanpa penjalaran saraf ke kaki/tangan. Umumnya disebabkan spasme otot (muscle strain) atau sindrom facet joint.\n\nSaran Perawatan Mandiri:\n1. Lakukan peregangan ringan (stretching) punggung jika tidak memicu nyeri.\n2. Mandi air hangat atau gunakan koyo hangat di titik nyeri.";
    }

    addRecord({
      type: "Sciatica",
      value: {
        primaryLocation,
        sensationType,
        aggravatingFactor,
        painScale,
        motorWeakness,
        zone
      },
      status: status === "stable" ? "normal" : status === "warning" ? "warning" : "critical",
      notes: `Sciatica Mapper: ${zone} - Suspect ${suspectedCondition}, VAS ${painScale}/10`
    });

    setResult({
      status,
      zone,
      message,
      suspectedCondition
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    setIsLoading(false);
  };

  const handleReset = () => {
    setPrimaryLocation("none");
    setSensationType("aching");
    setAggravatingFactor("none");
    setPainScale(3);
    setMotorWeakness(null);
    setResult(null);
  };

  const getScaleColor = (val: number) => {
    if (val <= 3) return "text-emerald-400";
    if (val <= 6) return "text-amber-400";
    return "text-red-500";
  };

  const isFormComplete = primaryLocation !== "none" && motorWeakness !== null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ─── Emergency Overlay (ZONA MERAH) ─── */}
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
                  ZONA MERAH • ALARM SARAF MOTORIK
                </span>
                <h2 className="text-3xl md:text-5xl font-outfit font-black text-white leading-tight uppercase tracking-tight">
                  {result.suspectedCondition}
                </h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent w-3/4 mx-auto my-4" />
                <p className="text-sm md:text-base text-red-200/90 font-medium leading-relaxed max-w-xl mx-auto whitespace-pre-line text-left">
                  {result.message}
                </p>
              </div>

              <div className="bg-black/50 border border-red-500/10 rounded-2xl p-6 text-left space-y-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
                  Petunjuk Tindakan Segera Pasien:
                </p>
                <ul className="space-y-3.5 text-sm font-semibold text-white/90">
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span><strong>Segera posisikan tubuh berbaring datar</strong> (flat) jika keluhan berada di kaki untuk meredakan tekanan gravitasi.</span>
                  </li>
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span>Hubungi tim medis <strong>dr. Wisnu Baskoro, Sp.BS</strong> di klinik atau UGD sekarang juga!</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setShowClinicModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-6 rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
                >
                  <Stethoscope className="w-5 h-5" /> Kunjungi Klinik (Tatap Muka)
                </button>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=UGD+Instalasi+Gawat+Darurat+Rumah+Sakit+Terdekat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
                >
                  <MapPin className="w-5 h-5 text-red-400" /> Rute UGD Terdekat
                </a>
              </div>

              <div className="pt-6 border-t border-red-500/10">
                <button 
                  onClick={() => {
                    if (confirm("Pernyataan: Saya memahami peringatan kritis ini. Reset kuesioner?")) {
                      handleReset();
                    }
                  }}
                  className="text-xs font-bold text-red-500/50 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Setel Ulang Skrining
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Interface ─── */}
      <div className="w-full bg-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden p-8 md:p-12 space-y-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ActivitySquare className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-white tracking-tight">Sciatica & Radiculopathy Mapper</h2>
            <p className="text-emerald-400/80 text-xs font-black uppercase tracking-[0.2em] mt-0.5">Spine & Neural Compression Screener</p>
          </div>
        </div>

        <ToolInstruction 
          color="emerald"
          educationalGoal="Sciatica & Radiculopathy Mapper mengidentifikasi kecenderungan kelainan jepitan saraf punggung bawah (Sciatica/HNP lumbar/Stenosis) atau saraf leher (Cervical Radiculopathy) secara asisten skrining digital mandiri sebelum konsultasi klinis."
          steps={[
            { title: "Lokalisasi Gejala", desc: "Tentukan apakah rasa nyeri Anda dominan di pinggang menjalar ke kaki atau leher menjalar ke lengan." },
            { title: "Identifikasi Posisi", desc: "Tentukan apakah rasa sakit bertambah berat saat duduk membungkuk (indikasi HNP) atau berdiri tegak (stenosis)." },
            { title: "Skrining Tanda Bahaya", desc: "Pastikan tidak ada kelemahan motorik aktif (foot drop) yang memerlukan pembedahan segera." }
          ]}
        />

        {/* Instan Result Banner */}
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
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Kemungkinan Kondisi</p>
                    <h3 className="text-lg font-outfit font-black uppercase tracking-tight">
                      {result.zone} • {result.suspectedCondition}
                    </h3>
                  </div>
                </div>
                {isSaved && (
                  <span className="text-[10px] bg-emerald-500 text-white font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" /> Tersimpan
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-white/95 leading-relaxed whitespace-pre-line pl-1 bg-black/20 p-4 rounded-xl border border-white/5">
                {result.message}
              </p>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Evaluasi Ulang
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
          <div className="space-y-8">
            {/* 1. Primary Location */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                1. Di mana Letak Rasa Nyeri Utama / Penjalaran Anda?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { type: "lumbar_radiation", label: "Pinggang Menjalar ke Kaki", desc: "Dari bokong ke paha belakang hingga betis/telapak kaki" },
                  { type: "cervical_radiation", label: "Leher Menjalar ke Lengan", desc: "Dari leher belakang ke bahu, lengan, hingga jari tangan" },
                  { type: "lumbar_local", label: "Pinggang Lokal", desc: "Hanya terpusat di punggung bawah tanpa jepitan menjalar" },
                  { type: "cervical_local", label: "Leher Lokal", desc: "Hanya terpusat di leher/pundak atas tanpa jepitan menjalar" }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setPrimaryLocation(item.type as PrimaryLocation)}
                    className={`p-5 rounded-2xl border text-left font-bold transition-all flex flex-col gap-1.5 ${
                      primaryLocation === item.type
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/5"
                        : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="text-xs font-bold text-white">{item.label}</span>
                    <span className="text-[10px] text-zinc-500 font-medium normal-case leading-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Sensation Type */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                2. Apa Sensasi Penyerta yang Paling Dominan?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: "tingling_numbness", label: "Kesemutan / Baal", icon: "⚡" },
                  { id: "burning_heat", label: "Panas Terbakar", icon: "🔥" },
                  { id: "aching", label: "Pegal Linu", icon: "🩹" },
                  { id: "cramping", label: "Kram Kaku", icon: "🌀" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSensationType(item.id as SensationType)}
                    className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 font-bold ${
                      sensationType === item.id
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-[#18181b]/30 border-white/5 text-zinc-400 hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Aggravating Factor */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                3. Apa Aktivitas yang Paling Memperparah Gejala Anda?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: "sitting_bending", label: "Duduk Lama / Membunguk", desc: "Khas pada tekanan diskus HNP" },
                  { id: "standing_walking", label: "Berdiri Tegak / Jalan Jauh", desc: "Khas pada penyempitan Stenosis" },
                  { id: "extension_rotation", label: "Menengadah / Memutar Sisi", desc: "Khas pada radikulopati leher" }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAggravatingFactor(item.id as AggravatingFactor)}
                    className={`p-4 rounded-xl border text-left font-bold transition-all flex flex-col gap-1 ${
                      aggravatingFactor === item.id
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-white/[0.01] border-white/5 text-white/50 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="text-xs text-white">{item.label}</span>
                    <span className="text-[9px] text-zinc-500 normal-case font-medium">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. VAS Pain Scale */}
            <div className="space-y-3 bg-white/[0.01] border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
                  4. Berapa Skala Nyeri Menjalar Anda Saat Ini?
                </label>
                <span className={`text-2xl font-black font-outfit ${getScaleColor(painScale)}`}>
                  {painScale} <span className="text-xs text-zinc-600">/ 10</span>
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="10"
                value={painScale}
                onChange={(e) => setPainScale(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-white/5 rounded-lg appearance-none mt-4"
              />
              <div className="flex justify-between text-[8px] font-bold text-foreground/30 px-1 mt-2">
                <span>1 (Ringan)</span>
                <span>5 (Mengganggu)</span>
                <span>10 (Ekstrem)</span>
              </div>
            </div>

            {/* 5. Motor Weakness */}
            <div className="space-y-3 bg-red-500/[0.01] border border-red-500/10 rounded-2xl p-6">
              <label className="text-xs font-bold text-red-400 uppercase tracking-widest block">
                5. Skrining Defisit Saraf Motorik (Sangat Penting)
              </label>
              <p className="text-xs text-white/80 leading-relaxed font-semibold">
                Apakah Anda kesulitan berjalan jinjit, berjalan menggunakan tumit (pergelangan kaki terkulai/foot drop), atau benda sering terlepas sendiri dari genggaman tangan Anda?
              </p>
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setMotorWeakness(true)}
                  className={`flex-1 py-3.5 rounded-xl border text-xs font-bold uppercase transition-all tracking-wider ${
                    motorWeakness === true
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-[#18181b]/30 border-white/5 text-zinc-500 hover:bg-red-500/5 hover:border-red-500/10"
                  }`}
                >
                  Ya, Ada Kelemahan
                </button>
                <button
                  type="button"
                  onClick={() => setMotorWeakness(false)}
                  className={`flex-1 py-3.5 rounded-xl border text-xs font-bold uppercase transition-all tracking-wider ${
                    motorWeakness === false
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-[#18181b]/30 border-white/5 text-zinc-500 hover:bg-emerald-500/5 hover:border-emerald-500/10"
                  }`}
                >
                  Tidak, Kekuatan Stabil
                </button>
              </div>
            </div>

            {/* Evaluate Button */}
            <button
              onClick={handleEvaluate}
              disabled={!isFormComplete || isLoading}
              className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] text-sm md:text-base ${
                isFormComplete 
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20" 
                  : "bg-white/5 border border-white/5 text-foreground/20 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Mengevaluasi Kompresi Saraf...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5" /> Skrining Jepitan Saraf
                </>
              )}
            </button>
          </div>
        )}

        {/* Clinical Section */}
        <div className="border-t border-white/[0.04] pt-8">
          <ClinicalSection 
            title="Dasar Klinis: Radikulopati Saraf Spinal & Sciatica"
            description="Sciatica dan Radikulopati leher merupakan kondisi tertekannya akar saraf keluar (spinal nerve root) akibat herniasi nucleus pulposus (HNP), hipertrofi ligamen, atau osteofit. Skrining posisi yang memperberat dan deteksi kelemahan motorik (seperti parese L5 penyebab foot drop) memilah secara tajam mana indikasi konservatif/blok nyeri, dan mana indikasi tindakan bedah dekompresi dekompresif minimal invasif (BESS/PELD)."
            disclaimer="Skrining mandiri digital ini bukan pengganti penegakan diagnosis radiologis (MRI/CT Scan) oleh dr. Wisnu Baskoro, Sp.BS."
            colorClass="emerald"
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
              <button 
                onClick={() => setShowClinicModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] block">Praktek Klinis</span>
                <h3 className="text-xl font-bold text-white">Jadwal & Alamat Praktek</h3>
              </div>

              <div className="h-px bg-white/5 w-full" />

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
