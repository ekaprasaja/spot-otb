"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Activity, 
  Timer, 
  Target, 
  RefreshCw, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  Save, 
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Award,
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

const TEST_DURATION = 10; // seconds

export default function DexterityPulse() {
  const addRecord = useOrthoStore((state) => state.addRecord);
  
  const [hand, setHand] = useState<"left" | "right">("right");
  const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
  const [activeTarget, setActiveTarget] = useState<"A" | "B">("A");
  
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [result, setResult] = useState<{
    status: "stable" | "warning" | "danger";
    zone: string;
    message: string;
    speedTps: number;
    accuracy: number;
    avgDelayMs: number;
    consistency: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    setGameState("playing");
    setHits(0);
    setMisses(0);
    setTimeLeft(TEST_DURATION);
    setTapTimes([]);
    setActiveTarget("A");
    setResult(null);
  };

  const handleTapTarget = (targetName: "A" | "B", e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== "playing") return;

    // Haptic feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(15);
    }

    if (targetName === activeTarget) {
      setHits(prev => prev + 1);
      setTapTimes(prev => [...prev, Date.now()]);
      setActiveTarget(prev => (prev === "A" ? "B" : "A"));
    } else {
      setMisses(prev => prev + 1);
    }
  };

  const handleMissedTap = () => {
    if (gameState !== "playing") return;
    setMisses(prev => prev + 1);
  };

  // Timer countdown
  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const handleFinishTest = async () => {
    setGameState("finished");
  };

  // Run the data analysis when test ends
  useEffect(() => {
    if (gameState !== "finished" || hits === 0) return;

    const analyzeAndSubmit = async () => {
      setIsLoading(true);

      const totalTaps = hits + misses;
      const accuracy = Math.round((hits / (totalTaps || 1)) * 100);
      const speedTps = Math.round((hits / TEST_DURATION) * 10) / 10;

      // Rhythm consistency (STDDEV of intervals)
      let avgDelayMs = 0;
      let consistency = 100;

      if (tapTimes.length >= 2) {
        const intervals: number[] = [];
        for (let i = 1; i < tapTimes.length; i++) {
          intervals.push(tapTimes[i] - tapTimes[i - 1]);
        }
        avgDelayMs = Math.round(intervals.reduce((a, b) => a + b, 0) / intervals.length);
        
        const variance = intervals.reduce((a, b) => a + Math.pow(b - avgDelayMs, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);
        consistency = Math.max(0, Math.round(100 - (stdDev / 12)));
      }

      try {
        const res = await fetch("https://newsletter-api.eka-prasaja.workers.dev/v1/neuro-motor/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalTaps,
            speedTps,
            accuracy,
            avgDelayMs,
            consistency
          })
        });

        if (!res.ok) {
          throw new Error("Gagal mengevaluasi motorik.");
        }

        const data = await res.json();

        const statusMap = {
          stable: "normal" as const,
          warning: "warning" as const,
          danger: "critical" as const
        };

        if (data.status !== "danger") {
          addRecord({
            type: "Dexterity",
            value: {
              totalTaps: data.totalTaps,
              speedTps: data.speedTps,
              accuracy: data.accuracy,
              avgDelayMs: data.avgDelayMs,
              consistency: data.consistency,
              zone: data.zone,
              hand
            },
            status: statusMap[data.status as "stable" | "warning" | "danger"] || "normal",
            notes: `Neuro-Motor: ${data.zone} (${data.speedTps} TPS)`
          });
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 3000);
        }

        setResult({
          status: data.status,
          zone: data.zone,
          message: data.message,
          speedTps: data.speedTps,
          accuracy: data.accuracy,
          avgDelayMs: data.avgDelayMs,
          consistency: data.consistency
        });

      } catch (err) {
        console.error(err);
        
        // Fallback local scoring
        let status: "stable" | "warning" | "danger" = "stable";
        let zone = "ZONA HIJAU";
        let message = "Koordinasi saraf motorik halus terpantau normal dan stabil. Pertahankan kestabilan irama ketukan dan lakukan tes berkala.";

        if (speedTps < 2.0 || accuracy < 60) {
          status = "danger";
          zone = "ZONA MERAH";
          message = "⚠️ ALARM GANGGUAN MOTORIK NEUROLOGIS\nTerjadi penurunan drastis pada fungsi koordinasi motorik halus jari tangan Anda. Ini merupakan tanda adanya kompresi saraf tulang belakang leher (Cervical Myelopathy).\nTindakan yang Harus Dilakukan:\nHarap segera menghentikan aktivitas, batasi pergerakan leher, dan segera temui dr. Nama Dokter, Sp.OT, Subsp. OTB (K) di tempat praktik Rumah Sakit, atau langsung kunjungi Instalasi Gawat Darurat (IGD) terdekat hari ini juga untuk pemeriksaan fisik dan evaluasi MRI tulang belakang leher!";
        } else if (speedTps < 3.5 || accuracy < 80 || consistency < 70) {
          status = "warning";
          zone = "ZONA KUNING";
          message = "Terjadi sedikit penurunan koordinasi motorik halus jari tangan Anda. Kurangi kelelahan, istirahat cukup, dan ulangi tes dalam keadaan tenang. Jika gejala berlanjut, hubungi dokter.";
        }

        if (status !== "danger") {
          addRecord({
            type: "Dexterity",
            value: {
              totalTaps,
              speedTps,
              accuracy,
              avgDelayMs,
              consistency,
              zone,
              hand
            },
            status: status === "stable" ? "normal" : "warning",
            notes: `Neuro-Motor (Local Fallback): ${zone} (${speedTps} TPS)`
          });
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 3000);
        }

        setResult({
          status,
          zone,
          message,
          speedTps,
          accuracy,
          avgDelayMs,
          consistency
        });
      } finally {
        setIsLoading(false);
      }
    };

    analyzeAndSubmit();
  }, [gameState]);

  const handleReset = () => {
    setGameState("idle");
    setHits(0);
    setMisses(0);
    setTimeLeft(TEST_DURATION);
    setResult(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ─── Emergency Overlay for Corticospinal Tract Loss (ZONA MERAH) ─── */}
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
                  ZONA MERAH • KRITIS SARAF
                </span>
                <h2 className="text-3xl md:text-5xl font-outfit font-black text-white leading-tight uppercase tracking-tight">
                  ⚠️ ALARM GANGGUAN MOTORIK
                </h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent w-3/4 mx-auto my-4" />
                <p className="text-sm md:text-base text-red-200/90 font-medium leading-relaxed max-w-xl mx-auto">
                  Terjadi penurunan drastis pada fungsi koordinasi motorik halus jari tangan Anda. Ini merupakan tanda adanya kompresi saraf tulang belakang leher (Cervical Myelopathy).
                </p>
              </div>

              <div className="bg-black/50 border border-red-500/10 rounded-2xl p-6 text-left space-y-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest">
                  Tindakan yang Harus Dilakukan Segera:
                </p>
                <ul className="space-y-3.5 text-sm font-semibold text-white/90">
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span>Harap segera menghentikan aktivitas, batasi pergerakan, dan segera temui <strong className="text-red-400 font-bold">dr. Nama Dokter, Sp.OT, Subsp. OTB (K)</strong> di Rumah Sakit sekarang.</span>
                  </li>
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span>Langsung kunjungi <strong>Instalasi Gawat Darurat (IGD) terdekat</strong> hari ini juga untuk pemeriksaan fisik komprehensif dan evaluasi MRI tulang belakang leher!</span>
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
                  href="https://www.google.com/maps/search/?api=1&query=CT+Scan+IGD+Instalasi+Gawat+Darurat+Rumah+Sakit+Terdekat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 text-sm md:text-base"
                >
                  <MapPin className="w-5 h-5 text-red-400" /> Temukan IGD & CT-Scan
                </a>
              </div>

              <div className="pt-6 border-t border-red-500/10">
                <button 
                  onClick={() => {
                    if (confirm("Pernyataan Keamanan Medis:\nSaya mengerti ini tanda bahaya saraf dan akan segera menemui dokter. Setel ulang modul tes?")) {
                      handleReset();
                    }
                  }}
                  className="text-xs font-bold text-red-500/50 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Abaikan & Setel Ulang
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Standard Clinical UI ─── */}
      <div className="w-full bg-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden p-8 md:p-12 space-y-12">
        
        {/* Rebranding Header */}
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
            <BrainCircuit className="text-white w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-white tracking-tight">Dexterity Pulse</h2>
            <p className="text-rose-400/80 text-xs font-black uppercase tracking-[0.2em] mt-0.5">Cervical Myelopathy & Fine Motor Screener</p>
          </div>
        </div>

        {/* Clinical Goal Instructions */}
        <ToolInstruction 
          color="rose"
          educationalGoal="Dexterity Pulse dirancang sebagai alat uji Neuro-Motor cepat untuk mendeteksi gejala Cervical Myelopathy (jepitan saraf di tulang belakang leher) yang menyebabkan tangan baal, kaku, atau kehilangan koordinasi halus. Tes mengetuk berseling (tapping test) mengukur kecepatan dan konsistensi motorik halus jari sebagai indikator awal kompresi medula spinalis servikal."
          steps={[
            { title: "Pilih Sisi Pengujian", desc: "Pilih tangan yang akan diuji (Kiri atau Kanan). Lakukan pada kedua tangan secara berkala." },
            { title: "Ketuk Tombol Bergantian", desc: "Gunakan hanya satu jari telunjuk. Ketuk Target A dan Target B secara bergantian secepat dan seakurat mungkin." },
            { title: "Selesaikan Durasi", desc: "Pertahankan kecepatan dan stabilitas irama ketukan Anda selama 10 detik penuh." },
            { title: "Evaluasi & Tunjukkan", desc: "Data tren ketukan (TPS & Stabilitas Irama) disimpan di memori HP untuk langsung ditunjukkan pada dr. Wisnu." }
          ]}
        />

        <AnimatePresence mode="wait">
          {/* Result Summary for Green/Yellow */}
          {gameState === "finished" && result && result.status !== "danger" && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-6 rounded-[2rem] border ${
                result.status === "stable" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400"
              } space-y-5`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    result.status === "stable" ? "bg-emerald-500/20" : "bg-amber-500/20"
                  }`}>
                    ✓
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Uji Saraf Tangan {hand === 'left' ? 'Kiri' : 'Kanan'}</p>
                    <h3 className="text-xl font-outfit font-black uppercase tracking-tight">
                      {result.zone} • {result.speedTps} TPS
                    </h3>
                  </div>
                </div>
                {isSaved && (
                  <span className="text-[10px] bg-emerald-500 text-white font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <Save className="w-3 h-3" /> Tersimpan
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[9px] font-black text-white/40 uppercase mb-1">Kecepatan</p>
                  <p className="text-lg font-outfit font-bold text-white">{result.speedTps} <span className="text-[9px] font-normal">Hz</span></p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[9px] font-black text-white/40 uppercase mb-1">Akurasi</p>
                  <p className="text-lg font-outfit font-bold text-white">{result.accuracy}%</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <p className="text-[9px] font-black text-white/40 uppercase mb-1">Konsistensi</p>
                  <p className="text-lg font-outfit font-bold text-white">{result.consistency}%</p>
                </div>
              </div>

              <p className="text-xs font-semibold text-white/90 leading-relaxed italic pl-1">
                "{result.message}"
              </p>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleReset}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-white/5 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Tes Ulang
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

          {/* Idle State / Setup */}
          {gameState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 space-y-8"
            >
              {/* Hand selector */}
              <div className="flex justify-center gap-3">
                {(["left", "right"] as const).map(h => (
                  <button 
                    key={h}
                    onClick={() => setHand(h)}
                    className={`px-6 py-3 rounded-xl border transition-all duration-300 font-bold text-xs uppercase tracking-widest ${
                      hand === h 
                        ? "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20" 
                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    Tangan {h === "left" ? "Kiri" : "Kanan"}
                  </button>
                ))}
              </div>

              <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner border border-rose-500/20">
                <BrainCircuit className="w-10 h-10 text-rose-500 animate-pulse" />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-outfit font-bold text-white">Siap untuk Uji Neuro-Motor Tangan {hand === "left" ? "Kiri" : "Kanan"}?</h3>
                <p className="text-xs text-foreground/50 max-w-sm mx-auto leading-relaxed">
                  Gunakan satu jari telunjuk. Ketuk Target A dan Target B secara bergantian secepat mungkin saat tes dimulai selama 10 detik.
                </p>
              </div>

              <button
                onClick={startTest}
                className="px-10 py-5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-rose-500/20 active:scale-95 text-xs uppercase tracking-widest"
              >
                Mulai Tes 10 Detik
              </button>
            </motion.div>
          )}

          {/* Playing / Tapping State */}
          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
              onClick={handleMissedTap}
            >
              {/* Stats Bar */}
              <div className="flex justify-between items-center bg-background/50 p-5 rounded-2xl border border-white/5 shadow-inner">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-rose-500" />
                  <span className="font-outfit font-black text-2xl text-white">{timeLeft}s</span>
                </div>
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                  UJI TANGAN {hand === "left" ? "KIRI" : "KANAN"}
                </span>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-outfit font-black text-2xl text-white">{hits}</span>
                </div>
              </div>

              {/* Two Targets A and B side-by-side */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                {/* Target A */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => handleTapTarget("A", e)}
                  className={`aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden select-none ${
                    activeTarget === "A"
                      ? "bg-rose-500/10 border-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.3)] scale-105"
                      : "bg-background/40 border-white/5 opacity-30 cursor-not-allowed"
                  }`}
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-black uppercase tracking-wider font-outfit shadow-2xl ${
                    activeTarget === "A" ? "bg-rose-500 text-white" : "bg-white/5 text-foreground/20"
                  }`}>
                    A
                  </div>
                  {activeTarget === "A" && (
                    <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest mt-3 animate-pulse">KETUK!</span>
                  )}
                </motion.button>

                {/* Target B */}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => handleTapTarget("B", e)}
                  className={`aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden select-none ${
                    activeTarget === "B"
                      ? "bg-rose-500/10 border-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.3)] scale-105"
                      : "bg-background/40 border-white/5 opacity-30 cursor-not-allowed"
                  }`}
                >
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-lg font-black uppercase tracking-wider font-outfit shadow-2xl ${
                    activeTarget === "B" ? "bg-rose-500 text-white" : "bg-white/5 text-foreground/20"
                  }`}>
                    B
                  </div>
                  {activeTarget === "B" && (
                    <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest mt-3 animate-pulse">KETUK!</span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Loading Evaluator Screen */}
          {gameState === "finished" && isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 space-y-6"
            >
              <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white font-outfit">Mengevaluasi Jalur Kortikospinal...</h4>
                <p className="text-xs text-foreground/40 max-w-xs mx-auto leading-relaxed">
                  Workers AI sedang menghitung micro-delay delay ketukan dan menilai akurasi koordinasi visual-motorik Anda.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Clinical Section Footer */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <ClinicalSection 
            title="Dasar Klinis: Finger Tapping Test (FTT) untuk Cervical Myelopathy"
            description="Tapping Test berseling A/B merupakan metode klinis standar untuk menguji fungsionalitas traktus kortikospinal yang melewati tulang belakang leher. Inkonsistensi irama (micro-delay bervariasi) mengarah pada tanda awal disdiadokokinesia akibat kompresi medula spinalis servikal, sedangkan penurunan akurasi visual fokal sensitif untuk mendeteksi gejala Cervical Myelopathy seperti tangan kaku, baal, dan kehilangan ketangkasan."
            disclaimer="Layar sentuh yang lambat atau pelindung layar dapat sedikit mempengaruhi akurasi pengukuran irama. Hubungi dr. Nama Dokter, Sp.OT, Subsp. OTB (K) jika terjadi kelemahan fisik ekstrem."
            colorClass="purple"
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
