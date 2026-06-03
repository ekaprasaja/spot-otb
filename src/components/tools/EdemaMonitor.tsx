"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ActivitySquare, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Eye,
  Info,
  Droplet,
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

type ProcedureType = "surgical" | "injection";
type SimType = "normal" | "csf" | "infection" | "hematoma" | "irritation";

export default function EdemaMonitor() {
  const addRecord = useOrthoStore((state) => state.addRecord);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [procedureType, setProcedureType] = useState<ProcedureType>("surgical");
  const [simulationType, setSimulationType] = useState<SimType>("normal");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [result, setResult] = useState<{
    status: "stable" | "danger";
    zone: string;
    message: string;
    simulationType: SimType;
  } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEvaluate = async () => {
    setIsLoading(true);

    // Wait a brief moment for satisfying UX loading state
    await new Promise(r => setTimeout(r, 450));

    let status: "stable" | "danger" = "stable";
    let zone = "ZONA HIJAU";
    let message = "Luka/titik bekas tindakan terpantau bersih dan kering. Tidak terdeteksi komplikasi atau tanda-tanda infeksi aktif. Lanjutkan perawatan steril sesuai instruksi dr. Nama Dokter, Sp.OT, Subsp. OTB (K).";

    if (procedureType === "surgical") {
      if (simulationType === "csf") {
        status = "danger";
        zone = "ZONA MERAH";
        message = "🚨 ALARM KRITIS: INDIKASI KEBOCORAN CAIRAN SEREBROSPINAL (CSF LEAK)\nTerdeteksi adanya rembesan cairan bening encer meluas pada perban luka operasi tulang belakang (spine) Anda. Kondisi ini membutuhkan penanganan steril segera untuk mencegah kontaminasi selaput otak/tulang belakang (meningitis).\n\nTindakan Darurat Anda:\n1. Tetap dalam posisi berbaring datar sempurna (tanpa bantal) jika luka berada di punggung atau leher.\n2. Segera pergi ke Rumah Sakit tempat dr. Nama Dokter, Sp.OT, Subsp. OTB (K) praktik atau langsung menuju UGD terdekat!";
      } else if (simulationType === "infection") {
        status = "danger";
        zone = "ZONA MERAH";
        message = "🚨 ALARM INFEKSI AKTIF PADA LUKA OPERASI\nTerdeteksi tanda-tanda infeksi bakteri seperti kemerahan meluas yang terasa panas, pembengkakan hebat, atau keluarnya cairan keruh/nanah dari luka bedah.\n\nTindakan Darurat Anda:\n1. Jaga area luka tetap steril, tutup dengan kasa kering steril baru.\n2. Segera hubungi asisten klinis dr. Nama Dokter, Sp.OT, Subsp. OTB (K) untuk evaluasi jahitan dan resep antibiotik.";
      }
    } else {
      // Injection/Intervention needle punctures
      if (simulationType === "hematoma") {
        status = "danger";
        zone = "ZONA MERAH";
        message = "🚨 ALARM MEMAR / HEMATOMA LOKAL MELUAS\nTerdeteksi pembengkakan keras berdenyut atau lebam keunguan yang meluas secara cepat di sekitar titik bekas jarum tindakan intervensi nyeri. Hal ini mengindikasikan perdarahan di bawah kulit.\n\nTindakan Darurat Anda:\n1. Lakukan kompres dingin dengan es dibalut handuk tipis selama 10-15 menit untuk menghentikan aliran darah.\n2. Hubungi dr. Nama Dokter, Sp.OT, Subsp. OTB (K) jika ukuran bengkak bertambah besar secara signifikan.";
      } else if (simulationType === "irritation") {
        status = "danger";
        zone = "ZONA MERAH";
        message = "🚨 ALARM IRITASI / REAKSI INFLAMASI TITIK SUNTIKAN\nTerdeteksi gatal hebat, rasa terbakar, bengkak merah lokal, atau bintik kemerahan meluas di area bekas jarum suntikan saraf. Hal ini dapat berupa reaksi hipersensitivitas obat atau iritasi kulit.\n\nTindakan Darurat Anda:\n1. Jaga agar titik suntikan tetap kering dan steril. Jangan mengoleskan salep tanpa resep atau menempelkan koyo.\n2. Hubungi tim dr. Wisnu jika keluhan berlanjut lebih dari 24 jam.";
      }
    }

    const statusMap = {
      stable: "normal" as const,
      danger: "critical" as const
    };

    // Save record to local store if it's NOT a danger zone (danger locks the screen)
    if (status !== "danger") {
      addRecord({
        type: "Edema", // Keep as Edema to align with useOrthoStore type definition
        value: {
          simulationType: simulationType,
          zone: zone
        },
        status: statusMap[status],
        notes: `Wound Tracker (${procedureType}): ${zone} - Status luka/titik suntikan bersih & kering.`
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }

    setResult({
      status: status,
      zone: zone,
      message: message,
      simulationType: simulationType
    });

    setIsLoading(false);
  };

  const handleReset = () => {
    setImagePreview(null);
    setSimulationType("normal");
    setResult(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* ─── Emergency Locked Screen Overlay (ZONA MERAH) ─── */}
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
                  ZONA MERAH • ALARM KRITIS MEDIS
                </span>
                <h2 className="text-3xl md:text-5xl font-outfit font-black text-white leading-tight uppercase tracking-tight">
                  🚨 INDIKASI REMBESAN CAIRAN TULANG BELAKANG / INFEKSI
                </h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent w-3/4 mx-auto my-4" />
                <p className="text-sm md:text-base text-red-200/90 font-medium leading-relaxed max-w-xl mx-auto">
                  Terdeteksi adanya rembesan cairan abnormal pada area perban luka operasi tulang belakang Anda. Kondisi ini membutuhkan penanganan steril segera untuk mencegah infeksi selaput saraf (<strong>meningitis/infeksi spinal</strong>).
                </p>
              </div>

              <div className="bg-black/60 border border-red-600/10 rounded-2xl p-6 text-left space-y-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <Droplet className="w-3.5 h-3.5 animate-bounce" /> Tindakan Darurat Segera Anda:
                </p>
                <ul className="space-y-3.5 text-sm font-semibold text-white/90">
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span><strong>Tetap dalam posisi berbaring datar (flat)</strong> jika luka berada di leher atau punggung untuk meminimalkan tekanan cairan tulang belakang.</span>
                  </li>
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span><strong>Segera pergi ke Rumah Sakit tempat dr. Nama Dokter, Sp.OT, Subsp. OTB (K) praktik</strong> atau langsung menuju <strong>Instalasi Gawat Darurat (IGD) terdekat sekarang juga!</strong> Jangan tunda sampai besok.</span>
                  </li>
                </ul>
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
                    if (confirm("Pernyataan Medis:\nSaya memahami indikasi kritis kebocoran CSF ini dan segera menuju rumah sakit. Setel ulang layar pemantau?")) {
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
            <ActivitySquare className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-white flex items-center gap-2.5">
              Wound & CSF Tracker <span className="text-[9px] bg-indigo-500/20 px-2.5 py-1 rounded-full text-indigo-400 font-black tracking-widest uppercase">Spine</span>
            </h2>
            <p className="text-foreground/50 text-xs md:text-sm">Pemantau Luka Operasi Tulang Belakang & Rembesan Cairan Spinal</p>
          </div>
        </div>

        <ToolInstruction 
          color="rose"
          educationalGoal="Wound & CSF Tracker mengevaluasi visual perban luka pasca-bedah tulang belakang (seperti BESS, PELD, ACDF, atau laminektomi) secara stateless untuk mendeteksi rembesan cairan serebrospinal (CSF) atau infeksi bakteri."
          steps={[
            { title: "Ambil Foto Perban", desc: "Gunakan kamera HP untuk mengambil foto luka/perban sedekat dan sejelas mungkin." },
            { title: "Stateless Processing", desc: "Model segmentasi gambar menganalisis rembesan cairan secara instan di memori lalu membuang foto Anda." },
            { title: "Pilih Mode Simulasi", desc: "Simulasikan tipe temuan visual perban Anda untuk keperluan evaluasi skrining awal." },
            { title: "Analisis & Tindakan", desc: "Dapatkan konfirmasi instan. Jika terindikasi bocor, segera ikuti protokol flat-bed di rumah sakit." }
          ]}
        />

        {/* Upload & Camera Area */}
        <div className="space-y-8">
          {/* Procedure Selector */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest block">
              1. Pilih Jenis Tindakan Anda:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: "surgical", label: "Luka Operasi Bedah", desc: "BESS, PELD, ACDF, Laminektomi", icon: "✂️" },
                { type: "injection", label: "Bekas Suntikan Saraf", desc: "Block Saraf, PLDD Laser, RF", icon: "💉" }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setProcedureType(item.type as ProcedureType);
                    setSimulationType("normal");
                    setResult(null);
                  }}
                  className={`p-4 rounded-3xl border text-left font-bold transition-all hover:scale-[1.01] flex items-center gap-4 ${
                    procedureType === item.type
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/5"
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-2.5xl">{item.icon}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400">{item.label}</span>
                    <span className="text-[9px] text-zinc-500 font-medium normal-case leading-tight mt-0.5">{item.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest block">
              2. Ambil Foto Luka / Titik Tindakan:
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visual Preview / Uploader */}
              <div className="relative aspect-video bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6 group cursor-pointer hover:border-indigo-500/30 transition-all">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" alt="Wound dressing preview" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-black/60 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                        <Camera className="w-4 h-4" /> Ubah Foto
                      </span>
                    </div>
                  </>
                ) : (
                  <label className="flex flex-col items-center gap-3 cursor-pointer w-full text-center">
                    <Camera className="w-10 h-10 text-indigo-400/50" />
                    <span className="text-xs font-bold text-white/60">Klik untuk Mengunggah Foto Luka</span>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">JPG, PNG up to 5MB</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="hidden" 
                    />
                  </label>
                )}
              </div>

              {/* Simulation Controls for Stateless evaluation */}
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col justify-center space-y-4">
                <span className="text-[10px] font-black text-foreground/40 uppercase tracking-widest block flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Mode Simulasi Deteksi Luka:
                </span>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  Pilih mode untuk menyimulasikan temuan visual luka guna menguji respon kecerdasan segmentasi piksel:
                </p>

                <div className="space-y-2.5">
                  {(procedureType === "surgical" ? [
                    { type: "normal", label: "Normal (Perban Kering & Bersih)" },
                    { type: "csf", label: "Cairan Spinal Meluas (CSF Leak)" },
                    { type: "infection", label: "Kemerahan & Nanah (Infeksi Aktif)" }
                  ] : [
                    { type: "normal", label: "Normal (Suntikan Bersih & Kering)" },
                    { type: "hematoma", label: "Memar / Lebam Meluas (Hematoma)" },
                    { type: "irritation", label: "Kemerahan & Bengkak (Iritasi)" }
                  ] as const).map((sim) => (
                    <button
                      key={sim.type}
                      type="button"
                      onClick={() => setSimulationType(sim.type as SimType)}
                      className={`w-full py-3 px-4 rounded-xl border font-bold text-[11px] uppercase transition-all text-left flex items-center justify-between ${
                        simulationType === sim.type
                          ? sim.type === 'normal' 
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                            : "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                          : "bg-white/[0.01] border-white/5 text-white/50 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span>{sim.label}</span>
                      {simulationType === sim.type && <span className="w-2 h-2 rounded-full bg-current" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stable / Clean Results display */}
        {result && result.status !== "danger" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 rounded-[2rem] border bg-emerald-500/5 border-emerald-500/20 text-emerald-400 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-[0.03] blur-2xl" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="p-3 bg-white/5 rounded-2xl shrink-0 border border-white/5 shadow-inner">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 inline-block">
                  {result.zone} • Luka Stabil
                </span>
                <h3 className="text-lg md:text-xl font-outfit font-black text-white">
                  Evaluasi Perban: Kering & Bersih
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed font-semibold">
                  {result.message}
                </p>
                <div className="pt-2 text-[10px] text-foreground/30 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Foto biner telah dihancurkan dari RAM Workers untuk kepatuhan medis.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Button */}
        {(!result || result.status !== "danger") && (
          <div className="flex gap-4 pt-4">
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95"
              >
                Uji Ulang
              </button>
            )}
            
            <button
              type="button"
              disabled={isLoading}
              onClick={handleEvaluate}
              className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Segmentasi Piksel Gambar...
                </>
              ) : isSaved ? (
                "✓ Analisis Luka Berhasil!"
              ) : (
                "Analisis Perban Luka Operasi"
              )}
            </button>
          </div>
        )}

        {/* Clinical section */}
        <div className="border-t border-white/[0.04] pt-8 space-y-6">
          <ClinicalSection 
            title="Dasar Klinis: Cerebrospinal Fluid (CSF) Leakage & Infection"
            description="Kebocoran Cairan Serebrospinal (CSF) melalui luka jahitan operasi leher atau punggung (spinal) merupakan komplikasi serius bedah tulang belakang yang dapat memicu kontaminasi retrograde ke selaput otak dan saraf (meningitis). Tanda khas CSF leak adalah terbentuknya noda rembesan cairan bening meluas di perban (halo sign). Segmentasi gambar stateless mengidentifikasi perubahan warna dan meluasnya rembesan secara instan untuk deteksi dini Dural Tear."
            disclaimer="Uji ini merupakan screening awal segmentasi visual perban steril Anda. Selalu kunjungi ruang praktek dr. Nama Dokter secara langsung atau kunjungi IGD terdekat bila perban terasa basah atau timbul demam tinggi."
            colorClass="rose"
          />

          <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
            <h4 className="text-xs font-bold text-foreground/40 uppercase mb-3 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> Protokol Flat-Bed di Rumah
            </h4>
            <p className="text-[11px] text-foreground/50 leading-relaxed italic">
              "Jika perban terindikasi bocor CSF, segeralah berbaring datar sempurna (tanpa bantal) untuk menurunkan tekanan hidrostatik cairan tulang belakang dan mencegah keluarnya cairan cerebrospinal lebih lanjut saat Anda dalam perjalanan ke rumah sakit."
            </p>
          </div>
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
