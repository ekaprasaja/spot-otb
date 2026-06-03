"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ActivitySquare, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Info,
  ChevronRight,
  Sparkles,
  Stethoscope,
  Calendar,
  Clock,
  MapPinned,
  X,
  Footprints,
  UserCheck
} from "lucide-react";
import { useOrthoStore } from "@/store/useOrthoStore";
import { ClinicalSection } from "@/components/shared/ClinicalSection";
import { ToolInstruction } from "@/components/shared/ToolInstruction";
import { doctorConfig } from "@/doctor-config";

type DermatomeZone = "C6" | "C7" | "C8" | "L4" | "L5" | "S1" | "none";
type SensationLevel = "normal" | "hypoesthesia" | "hyperesthesia" | "anesthesia";

export default function DermatomeTracker() {
  const addRecord = useOrthoStore((state) => state.addRecord);

  const [activeDermatome, setActiveDermatome] = useState<DermatomeZone>("none");
  const [sensationLevel, setSensationLevel] = useState<SensationLevel>("normal");
  const [tappedCount, setTappedCount] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [result, setResult] = useState<{
    status: "stable" | "warning" | "danger";
    zone: string;
    message: string;
  } | null>(null);

  const handleEvaluate = async () => {
    if (activeDermatome === "none") return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    let status: "stable" | "warning" | "danger" = "stable";
    let zone = "ZONA HIJAU";
    let message = "Sensasi sensorik pada dermatome " + activeDermatome + " terpantau normal dan simetris kanan-kiri. Saraf spinal dalam kondisi aman.";

    if (sensationLevel === "anesthesia") {
      status = "danger";
      zone = "ZONA MERAH";
      if (activeDermatome === "S1" || activeDermatome === "L5") {
        message = "🚨 ALARM KRITIS: MATI RASA TOTAL (ANESTESIA SPINAL / SADDLE ANESTHESIA)\nTerjadi hilangnya rasa raba total pada area dermatome " + activeDermatome + " atau area bokong/kemaluan. Kondisi ini dicurigai merupakan indikasi Sindrom Kauda Ekuina (Cauda Equina Syndrome) atau jepitan saraf parah.\n\nTindakan Darurat Anda:\n1. Segera hubungi asisten dr. Wisnu Baskoro, Sp.BS atau langsung pergi ke UGD Rumah Sakit terdekat sekarang juga!\n2. Kehilangan kontrol buang air kecil/besar pasca mati rasa merupakan indikasi bedah dekompresi darurat.";
      } else {
        message = "🚨 ALARM KRITIS: ANOMALI SENSORIK TOTAL\nMati rasa total pada area dermatome " + activeDermatome + " (lengan/tangan) mengindikasikan blok konduksi impuls saraf leher yang parah akibat herniasi masif.\n\nTindakan Darurat Anda:\nSegera hubungi dr. Wisnu Baskoro, Sp.BS untuk penjadwalan pemeriksaan neurologis mendesak guna mencegah defisit permanen.";
      }
    } else if (sensationLevel === "hypoesthesia") {
      status = "warning";
      zone = "ZONA KUNING";
      if (activeDermatome.startsWith("L")) {
        message = "Terdeteksi Hipestesia (penurunan sensasi/kebas) pada dermatom kaki " + activeDermatome + ". Kondisi ini menunjukkan adanya kompresi parsial akar saraf lumbar (pinggang), umumnya akibat HNP L3-L4 (untuk L4) atau HNP L4-L5 (untuk L5).\n\nSaran Perawatan:\n1. Hindari posisi duduk membungkuk atau mengangkat beban.\n2. Lakukan latihan peregangan saraf (nerve flossing) sesuai petunjuk fisioterapi.";
      } else if (activeDermatome === "S1") {
        message = "Terdeteksi Hipestesia pada dermatom kaki S1 (sisi luar dan telapak kaki). Menunjukkan kompresi akar saraf sakral S1, umumnya dipicu oleh HNP L5-S1.\n\nSaran Perawatan:\nHindari menggunakan alas kaki berhak tinggi/keras dan kurangi berdiri terlalu lama.";
      } else {
        message = "Terdeteksi Hipestesia pada dermatom tangan " + activeDermatome + ". Mengindikasikan kompresi akar saraf cervical leher (C5-C6 untuk C6, C6-C7 untuk C7, C7-T1 untuk C8).\n\nSaran Perawatan:\nGunakan bantal penyangga leher ergonomis dan hindari posisi leher menekuk terlalu lama.";
      }
    } else if (sensationLevel === "hyperesthesia") {
      status = "warning";
      zone = "ZONA KUNING";
      message = "Terdeteksi Hiperestesia / Alodinia (rasa terbakar, kesemutan hebat, atau nyeri disentuh ringan) pada dermatome " + activeDermatome + ". Hal ini menunjukkan iritasi/radang aktif pada pembungkus saraf (radikulitis).\n\nSaran Perawatan:\nLakukan kompres dingin lokal di leher/pinggang untuk meredakan radang akut, dan konsumsi suplemen vitamin neurotropik (B1, B6, B12) sesuai rekomendasi.";
    }

    addRecord({
      type: "Dermatome",
      value: {
        activeDermatome,
        tappedCount: tappedCount + 1,
        sensationLevel,
        zone
      },
      status: status === "stable" ? "normal" : status === "warning" ? "warning" : "critical",
      notes: `Dermatome ${activeDermatome}: ${zone} - Sensation ${sensationLevel}`
    });

    setTappedCount((prev) => prev + 1);
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
    setActiveDermatome("none");
    setSensationLevel("normal");
    setResult(null);
  };

  const dermatomes = [
    { id: "C6", name: "Dermatome C6 (Leher - Jempol)", region: "Upper Limb", desc: "Sisi luar lengan bawah hingga ibu jari tangan" },
    { id: "C7", name: "Dermatome C7 (Leher - Jari Tengah)", region: "Upper Limb", desc: "Tangan belakang hingga jari telunjuk dan jari tengah" },
    { id: "C8", name: "Dermatome C8 (Leher - Kelingking)", region: "Upper Limb", desc: "Sisi dalam lengan bawah hingga jari manis dan kelingking" },
    { id: "L4", name: "Dermatome L4 (Pinggang - Lutut)", region: "Lower Limb", desc: "Paha depan, melewati lutut, hingga sisi dalam betis bawah" },
    { id: "L5", name: "Dermatome L5 (Pinggang - Punggung Kaki)", region: "Lower Limb", desc: "Tungkai bawah sisi luar hingga punggung kaki dan jempol kaki" },
    { id: "S1", name: "Dermatome S1 (Sakral - Sisi Luar Kaki)", region: "Lower Limb", desc: "Sisi luar telapak kaki, kelingking kaki, dan tumit luar" }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ─── Emergency Overlay (ZONA MERAH) ─── */}
      <AnimatePresence>
        {result && result.status === "danger" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#0A0202] flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.22),transparent_75%)] animate-pulse" />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative max-w-2xl w-full bg-[#1A0505] border-2 border-red-600/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-center space-y-8 animate-shake"
            >
              <div className="mx-auto w-24 h-24 rounded-full bg-red-600/10 border-4 border-red-600 flex items-center justify-center animate-bounce shadow-xl shadow-red-600/25">
                <ShieldAlert className="w-12 h-12 text-red-500" />
              </div>

              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-red-600/20 text-red-400 border border-red-600/30 rounded-full text-xs font-black uppercase tracking-[0.2em] animate-pulse">
                  ZONA MERAH • ALARM SENSORIK KRITIS
                </span>
                <h2 className="text-3xl md:text-5xl font-outfit font-black text-white leading-tight uppercase tracking-tight">
                  🚨 MATI RASA TOTAL (ANESTESIA SPINAL)
                </h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent w-3/4 mx-auto my-4" />
                <p className="text-sm md:text-base text-red-200/90 font-medium leading-relaxed max-w-xl mx-auto text-left whitespace-pre-line">
                  {result.message}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => setShowClinicModal(true)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-5 px-6 rounded-2xl shadow-xl shadow-red-600/30 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
                >
                  <Stethoscope className="w-5 h-5 animate-pulse" /> Kunjungi Klinik dr. Wisnu (Tatap Muka)
                </button>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=IGD+Instalasi+Gawat+Darurat+Rumah+Sakit+Terdekat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
                >
                  <MapPin className="w-5 h-5 text-red-400" /> Rute ke IGD Terdekat
                </a>
              </div>

              <div className="pt-6 border-t border-red-600/10">
                <button 
                  onClick={() => {
                    if (confirm("Pernyataan: Saya memahami peringatan sensorik darurat ini. Reset layar pemantau?")) {
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

      {/* ─── Main Interface ─── */}
      <div className="w-full bg-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden p-8 md:p-12 space-y-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Footprints className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-white flex items-center gap-2.5">
              Dermatome Pain Tracker <span className="text-[9px] bg-indigo-500/20 px-2.5 py-1 rounded-full text-indigo-400 font-black tracking-widest uppercase">Spine</span>
            </h2>
            <p className="text-foreground/50 text-xs md:text-sm">Pemeta Gangguan Sensorik & Jalur Saraf Tulang Belakang</p>
          </div>
        </div>

        <ToolInstruction 
          color="primary"
          educationalGoal="Dermatome Pain Tracker memetakan gangguan sensorik pada kulit (kebas, panas, mati rasa) sesuai pembagian dermatom saraf spinal. Membantu pasien pasca-tindakan atau penderita HNP memantau daerah jepitan saraf leher (C6-C8) dan punggung bawah (L4-S1)."
          steps={[
            { title: "Pilih Area Dermatome", desc: "Ketuk salah satu area dermatome lengan (C6-C8) atau tungkai (L4-S1) yang mengalami keluhan." },
            { title: "Evaluasi Sensasi", desc: "Bandingkan kulit area tersebut dengan sisi tubuh yang sehat. Pilih level sensasinya." },
            { title: "Uji Raba Mandiri", desc: "Gunakan ujung jari atau kuas halus untuk menyapu kulit dengan lembut saat membandingkan sensasi." }
          ]}
        />

        {/* Normal / Yellow Result Banner */}
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
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Sensorik Saraf</p>
                    <h3 className="text-lg font-outfit font-black uppercase tracking-tight">
                      {result.zone} • {activeDermatome}
                    </h3>
                  </div>
                </div>
                {isSaved && (
                  <span className="text-[10px] bg-emerald-500 text-white font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    ✓ Tersimpan
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-white/95 leading-relaxed p-4 bg-black/20 rounded-2xl border border-white/5 whitespace-pre-line">
                {result.message}
              </p>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Uji Area Lain
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
            {/* 1. Body Outline / Dermatome Map Selection */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest block">
                1. Pilih Area Dermatom Yang Bermasalah:
              </label>

              {/* Graphic Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upper Limb Group */}
                <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-4">
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block">
                    💪 Area Lengan & Jari (Saraf Cervical / Leher)
                  </span>
                  <div className="space-y-2">
                    {dermatomes.filter(d => d.region === "Upper Limb").map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setActiveDermatome(d.id as DermatomeZone)}
                        className={`w-full p-4 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                          activeDermatome === d.id
                            ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5"
                            : "bg-background/40 border-white/5 text-foreground/60 hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-white">{d.name}</span>
                          <span className="text-[9px] text-zinc-500 font-medium normal-case">{d.desc}</span>
                        </div>
                        <span className="text-[10px] font-black font-outfit uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10 shrink-0">
                          {d.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lower Limb Group */}
                <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-4">
                  <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block">
                    🦵 Area Tungkai & Kaki (Saraf Lumbar-Sakral / Pinggang)
                  </span>
                  <div className="space-y-2">
                    {dermatomes.filter(d => d.region === "Lower Limb").map((d) => (
                      <button
                        key={d.id}
                        onClick={() => setActiveDermatome(d.id as DermatomeZone)}
                        className={`w-full p-4 rounded-2xl border text-left font-bold transition-all flex items-center justify-between ${
                          activeDermatome === d.id
                            ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/5"
                            : "bg-background/40 border-white/5 text-foreground/60 hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-white">{d.name}</span>
                          <span className="text-[9px] text-zinc-500 font-medium normal-case">{d.desc}</span>
                        </div>
                        <span className="text-[10px] font-black font-outfit uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10 shrink-0">
                          {d.id}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Sensation Level Selection */}
            {activeDermatome !== "none" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8"
              >
                <label className="text-xs font-bold text-indigo-400 uppercase tracking-widest block flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> 2. Pilih Tingkat Sensasi Saat Kulit Diraba Lembut:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "normal", label: "Normal", desc: "Sensasi rabaan normal 100% sama dengan sisi sehat", icon: "🟢" },
                    { id: "hypoesthesia", label: "Hipestesia (Kebas)", desc: "Sensasi rabaan terasa samar, tebal, atau berkurang", icon: "🟡" },
                    { id: "hyperesthesia", label: "Hiperestesia", desc: "Sangat sensitif, nyeri disentuh, atau rasa terbakar", icon: "🟠" },
                    { id: "anesthesia", label: "Anestesia (Mati Rasa)", desc: "Mati rasa total, tidak terasa sama sekali saat dicubit", icon: "🔴" }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSensationLevel(s.id as SensationLevel)}
                      className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 font-bold ${
                        sensationLevel === s.id
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                          : "bg-background border-white/5 text-zinc-400 hover:bg-white/[0.02]"
                      }`}
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <span className="text-xs font-bold text-white block">{s.label}</span>
                      <span className="text-[8px] text-zinc-500 leading-tight normal-case mt-1">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Evaluate Button */}
            <button
              onClick={handleEvaluate}
              disabled={activeDermatome === "none" || isLoading}
              className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] text-sm md:text-base ${
                activeDermatome !== "none" 
                  ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-xl shadow-indigo-500/20" 
                  : "bg-white/5 border border-white/5 text-foreground/20 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Mengevaluasi Konduksi Saraf...
                </>
              ) : (
                <>
                  <ActivitySquare className="w-5 h-5" /> Evaluasi Sensasi Dermatom
                </>
              )}
            </button>
          </div>
        )}

        {/* Clinical Section */}
        <div className="border-t border-white/[0.04] pt-8">
          <ClinicalSection 
            title="Dasar Klinis: Dermatom Saraf Spinal & Penurunan Sensasi"
            description="Dermatom merupakan peta area kulit yang disuplai oleh satu akar saraf spinal spesifik. Kerusakan atau penekanan akar saraf akibat HNP atau stenosis kanalis menimbulkan hilangnya hantaran sensorik (kebas/hipestesia) di area dermatom tersebut. Pelacakan klinis dermatom secara digital mendeteksi tingkat keparahan fungsional kompresi saraf, seperti parese dermatom S1 pada HNP L5-S1 atau parese C6 pada HNP leher."
            disclaimer="Uji dermatom mandiri ini bersifat asisten skrining awal. Diagnosis kompresi diskus melingkar hanya ditegakkan melalui pemeriksaan fisik langsung dan pencitraan MRI tulang belakang."
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
