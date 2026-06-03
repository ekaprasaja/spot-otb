"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Scan, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert, 
  PhoneCall, 
  MapPin, 
  Info,
  Maximize2,
  Lock,
  Stethoscope,
  Calendar,
  Clock,
  MapPinned,
  X
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { useOrthoStore } from "@/store/useOrthoStore";
import { ClinicalSection } from "@/components/shared/ClinicalSection";
import { ToolInstruction } from "@/components/shared/ToolInstruction";
import { useDoctorConfig } from "@/context/DoctorConfigContext";

type MovementType = "cervical_flexion" | "cervical_extension" | "lumbar_flexion" | "lumbar_extension";
type ProcedureType = "acdf" | "bess_peld" | "tlif" | "pain_interventions" | "general";

export default function InclinometerAI() {
  const doctorConfig = useDoctorConfig();
  const addRecord = useOrthoStore((state) => state.addRecord);
  const { status: permissionStatus, requestSensors } = usePermissions();

  const [procedureType, setProcedureType] = useState<ProcedureType>("general");
  const [movementType, setMovementType] = useState<MovementType>("cervical_flexion");
  const [rawAngle, setRawAngle] = useState({ beta: 0, gamma: 0 });
  const [baseline, setBaseline] = useState({ beta: 0, gamma: 0 });
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [manualAngle, setManualAngle] = useState<number>(0);
  const [useManualInput, setUseManualInput] = useState(false);

  const [painLevel, setPainLevel] = useState<number>(2);
  const [lockedOrSeverePain, setLockedOrSeverePain] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [result, setResult] = useState<{
    status: "stable" | "warning" | "danger";
    zone: string;
    message: string;
    angleDegrees: number;
    painLevel: number;
    lockedOrSeverePain: boolean;
  } | null>(null);

  // Live orientation sensor callback
  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (event.beta !== null && event.gamma !== null) {
      setRawAngle({ beta: event.beta, gamma: event.gamma });
    }
  }, []);

  useEffect(() => {
    if (permissionStatus.sensors === 'granted') {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [permissionStatus.sensors, handleOrientation]);

  // Calibration setting current angle as baseline (0 degrees)
  const calibrate = () => {
    setBaseline({ beta: rawAngle.beta, gamma: rawAngle.gamma });
    setIsCalibrated(true);
    setManualAngle(0);
  };

  // Compute live relative angle
  const getLiveAngle = () => {
    if (useManualInput) return manualAngle;
    
    // Choose tracking axis based on type
    const diffBeta = rawAngle.beta - baseline.beta;
    const diffGamma = rawAngle.gamma - baseline.gamma;
    
    // Most movement tests use the sagittal tilt (beta)
    let calculated = Math.abs(diffBeta);
    if (movementType.includes("lumbar")) {
      calculated = Math.abs(diffBeta);
    } else {
      // cervical movements
      calculated = Math.abs(diffBeta);
    }

    // Cap angle at 180 degrees
    const finalAngle = Math.min(Math.round(calculated), 180);
    return isNaN(finalAngle) ? 0 : finalAngle;
  };

  const measuredAngle = getLiveAngle();

  const handleEvaluate = async (isInstantEmergency = false) => {
    setIsLoading(true);

    const actualEmergency = isInstantEmergency || lockedOrSeverePain;
    const finalAngle = actualEmergency ? 0 : measuredAngle;

    // Wait a brief moment for satisfying UX loading state
    await new Promise(r => setTimeout(r, 400));

    // Custom clinical rules based on procedure type
    let status: "stable" | "warning" | "danger" = "stable";
    let zone = "ZONA HIJAU";
    let message = "Rentang gerak (ROM) tulang belakang Anda berada dalam batas aman pemulihan. Lanjutkan latihan mobilitas bertahap secara hati-hati.";

    if (actualEmergency) {
      status = "danger";
      zone = "ZONA MERAH";
      message = "⚠️ PERINGATAN KEKAKUAN / NYERI AKUT EKSTREM\nTerjadi hambatan mekanis kaku total atau nyeri tajam ekstrem saat melakukan gerakan pemulihan tulang belakang. Jangan paksakan gerakan tubuh Anda demi keselamatan implan Anda.";
    } else if (procedureType === "acdf") {
      // ACDF (Leher): cervical flexion or extension
      if (movementType.startsWith("cervical")) {
        if (finalAngle > 20) {
          status = "danger";
          zone = "ZONA MERAH";
          message = "⚠️ ALARM BATAS IMPLAN LEHER (ACDF)\nRentang gerak leher Anda (" + finalAngle + "°) melebihi batas aman maksimal 20° pada fase awal pemulihan ACDF. Memaksakan gerakan leher berlebih berisiko tinggi merenggangkan atau menggeser cage implan leher Anda!";
        } else if (finalAngle > 12 || painLevel >= 4) {
          status = "warning";
          zone = "ZONA KUNING";
          message = "Rentang gerak leher (" + finalAngle + "°) mendekati batas aman pemulihan ACDF (maksimal 20°). Batasi gerakan leher ekstrem dan gunakan cervical collar penyangga leher jika direkomendasikan.";
        }
      } else {
        // lumbar movements for cervical post-op (should be gentle)
        if (finalAngle > 40 || painLevel >= 5) {
          status = "warning";
          zone = "ZONA KUNING";
          message = "Perhatian: Anda terdaftar dengan prosedur ACDF (leher). Pastikan leher Anda tetap tegak lurus dan terfiksasi dengan aman saat Anda menguji gerakan pinggang.";
        }
      }
    } else if (procedureType === "tlif") {
      // TLIF (Fusi Pinggang): lumbar flexion/extension
      if (movementType.startsWith("lumbar")) {
        if (finalAngle > 25) {
          status = "danger";
          zone = "ZONA MERAH";
          message = "⚠️ ALARM REGANGAN PEN PUNGGUNG (TLIF)\nRentang gerak pinggang Anda (" + finalAngle + "°) melebihi batas aman maksimal 25° pasca-fiksasi TLIF. Hal ini berisiko melonggarkan sekrup pen punggung (percutaneous screw) Anda!";
        } else if (finalAngle > 15 || painLevel >= 4) {
          status = "warning";
          zone = "ZONA KUNING";
          message = "Rentang gerak pinggang (" + finalAngle + "°) mendekati batas aman fiksasi sekrup TLIF. Harap patuhi aturan ketat BLT (No Bending, No Twisting, No heavy Lifting) demi menjaga kestabilan pen.";
        }
      }
    } else if (procedureType === "bess_peld") {
      // BESS/PELD (Endoskopi Pinggang)
      if (movementType.startsWith("lumbar")) {
        if (finalAngle > 45) {
          status = "danger";
          zone = "ZONA MERAH";
          message = "⚠️ PERINGATAN REGANGAN DISKUS POST-ENDOSKOPI\nRentang gerak pinggang Anda (" + finalAngle + "°) terlalu jauh untuk fase pemulihan endoskopi BESS/PELD. Hindari membungkuk berlebih demi mencegah terjadinya saraf kejepit berulang!";
        } else if (finalAngle > 30 || painLevel >= 5) {
          status = "warning";
          zone = "ZONA KUNING";
          message = "Sudut gerakan pinggang Anda (" + finalAngle + "°) mengalami keterbatasan sedang atau nyeri ringan. Lakukan gerakan secara perlahan dan hindari memutar punggung mendadak.";
        }
      }
    } else if (procedureType === "pain_interventions") {
      // Intervensi Nyeri (PLDD/Laser/Block/Radiofrekuensi)
      if (painLevel >= 6) {
        status = "danger";
        zone = "ZONA MERAH";
        message = "⚠️ PERINGATAN NYERI PASCA-TINDAKAN INTERVENSI\nTerdeteksi peningkatan rasa nyeri yang signifikan (" + painLevel + "/10) pasca-tindakan injeksi/laser/radiofrekuensi. Harap istirahat total dan batasi peregangan berlebih.";
      } else if (painLevel >= 4) {
        status = "warning";
        zone = "ZONA KUNING";
        message = "Terasa nyeri ringan hingga sedang pasca-tindakan intervensi. Rasa tebal atau kesemutan sementara di kaki/tangan adalah normal akibat efek pembiusan lokal.";
      }
    } else {
      // General/Lainnya
      if (finalAngle < 15 || painLevel >= 7) {
        status = "danger";
        zone = "ZONA MERAH";
        message = "⚠️ PERINGATAN KEKAKUAN / NYERI AKUT TULANG BELAKANG\nTerjadi hambatan mekanis kaku atau nyeri tajam saat melakukan gerakan pemulihan. Segera hentikan latihan fiksasi mandiri ini.";
      } else if (finalAngle < 30 || painLevel >= 5) {
        status = "warning";
        zone = "ZONA KUNING";
        message = "Terdeteksi keterbatasan gerakan sedang atau nyeri ringan-sedang. Batasi gerakan ekstrem, gunakan penyangga jika perlu, dan lakukan latihan secara perlahan.";
      }
    }

    const statusMap = {
      stable: "normal" as const,
      warning: "warning" as const,
      danger: "critical" as const
    };

    // Save record to local store if it's NOT danger (danger locks screen and is critical)
    if (status !== "danger") {
      addRecord({
        type: "Spine",
        value: {
          movementType: movementType,
          angleDegrees: finalAngle,
          painLevel: painLevel,
          lockedOrSeverePain: actualEmergency,
          zone: zone
        },
        status: statusMap[status],
        notes: `ROM ${movementType} (${procedureType}): ${finalAngle}° - Nyeri: ${painLevel}/10 (${zone})`
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }

    setResult({
      status: status,
      zone: zone,
      message: message,
      angleDegrees: finalAngle,
      painLevel: painLevel,
      lockedOrSeverePain: actualEmergency
    });
    
    setIsLoading(false);
  };

  const handleReset = () => {
    setLockedOrSeverePain(false);
    setPainLevel(2);
    setResult(null);
    setIsCalibrated(false);
    setManualAngle(0);
  };

  const getMovementLabel = (type: MovementType) => {
    switch (type) {
      case "cervical_flexion": return "Tunduk Leher (Cervical Flexion)";
      case "cervical_extension": return "Dongak Leher (Cervical Extension)";
      case "lumbar_flexion": return "Tunduk Pinggang (Lumbar Flexion)";
      case "lumbar_extension": return "Dongak Pinggang (Lumbar Extension)";
    }
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
                  ZONA MERAH • ALARM DARURAT
                </span>
                <h2 className="text-3xl md:text-5xl font-outfit font-black text-white leading-tight uppercase tracking-tight">
                  ⚠️ PERINGATAN KEKAKUAN / NYERI AKUT
                </h2>
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent w-3/4 mx-auto my-4" />
                <p className="text-sm md:text-base text-red-200/90 font-medium leading-relaxed max-w-xl mx-auto whitespace-pre-line">
                  {result.message.split("\nTindakan")[0]}
                </p>
              </div>

              <div className="bg-black/50 border border-red-500/10 rounded-2xl p-6 text-left space-y-4">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> Tindakan Segera Anda:
                </p>
                <ul className="space-y-3.5 text-sm font-semibold text-white/90">
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span><strong>Segera hentikan latihan fiksasi mandiri ini</strong>. Jangan dipaksakan memutar atau menekuk badan Anda.</span>
                  </li>
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span>Segera <strong>jadwalkan pertemuan fisik langsung dengan dr. Nama Dokter, Sp.OT, Subsp. OTB (K)</strong> di klinik rumah sakit untuk evaluasi implan/pen tulang belakang Anda.</span>
                  </li>
                  <li className="flex gap-3 items-start leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <span>Jika nyeri kian menjalar atau kaku tak tertahankan, segera pergi ke Instalasi Gawat Darurat (IGD) rumah sakit terdekat!</span>
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
                  <MapPin className="w-5 h-5 text-red-400" /> Rute ke IGD Terdekat
                </a>
              </div>

              <div className="pt-6 border-t border-red-500/10">
                <button 
                  onClick={() => {
                    if (confirm("Pernyataan Medis:\nSaya telah memahami resiko ini dan akan membatasi pergerakan tulang belakang. Setel ulang layar kuesioner?")) {
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

      {/* ─── Main Inclinometer Interface ─── */}
      <div className="w-full bg-card rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden p-8 md:p-12 space-y-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Scan className="text-white w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-outfit font-bold text-white flex items-center gap-2.5">
              Cervical & Lumbar ROM <span className="text-[9px] bg-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400 font-black tracking-widest uppercase">Spine</span>
            </h2>
            <p className="text-foreground/50 text-xs md:text-sm">Pemantau Range of Motion Tulang Belakang Pasca-Operasi Besar</p>
          </div>
        </div>

        <ToolInstruction 
          color="emerald"
          educationalGoal="Cervical & Lumbar ROM mengukur seberapa jauh gerakan leher atau pinggang yang dapat Anda lakukan secara aman selama masa rehabilitasi pasca-fusi tulang belakang atau laminektomi."
          steps={[
            { title: "Pilih Mode Gerakan", desc: "Pilih area spinal (leher / pinggang) dan jenis gerakan (tunduk / dongak)." },
            { title: "Kalibrasi Awal", desc: "Tempelkan HP di dada (leher) atau punggung atas (pinggang) saat berdiri tegak, lalu klik Kalibrasi." },
            { title: "Lakukan Gerakan ROM", desc: "Tekuk badan atau leher secara perlahan hingga batas nyaman Anda, lalu tahan." },
            { title: "Evaluasi Hasil", desc: "Klik 'Kunci & Evaluasi ROM' untuk memvalidasi keamanan derajat implan Anda." }
          ]}
        />

        {/* Form Controls */}
        <div className="space-y-8">
          <div>
            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest block mb-4">
              1. Pilih Prosedur / Tindakan Medis Anda:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { type: "acdf", label: "ACDF Leher", desc: "Mikroskopis ACDF", icon: "🦴" },
                { type: "bess_peld", label: "Endoskopi", desc: "BESS / PELD / PSLD", icon: "🔬" },
                { type: "tlif", label: "MISS TLIF", desc: "Fusi Sekrup Punggung", icon: "🔩" },
                { type: "pain_interventions", label: "Terapi Nyeri", desc: "PLDD / Block / RF", icon: "⚡" },
                { type: "general", label: "Umum / Kontrol", desc: "Pemeriksaan Umum", icon: "🩺" }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setProcedureType(item.type as ProcedureType);
                    // Automatically pre-select logical movement type
                    if (item.type === "acdf" && !movementType.startsWith("cervical")) {
                      setMovementType("cervical_flexion");
                    } else if ((item.type === "bess_peld" || item.type === "tlif") && !movementType.startsWith("lumbar")) {
                      setMovementType("lumbar_flexion");
                    }
                    setIsCalibrated(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-center font-bold text-xs uppercase transition-all flex flex-col justify-center items-center gap-1 hover:scale-[1.02] relative overflow-hidden ${
                    procedureType === item.type
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/5"
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-lg mb-0.5">{item.icon}</span>
                  <span className="text-[10px] tracking-wide leading-snug">{item.label}</span>
                  <span className="text-[7.5px] opacity-40 lowercase normal-case leading-none">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest block mb-4">
              2. Pilih Gerakan & Implan Target:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["cervical_flexion", "cervical_extension", "lumbar_flexion", "lumbar_extension"] as MovementType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setMovementType(type);
                    setIsCalibrated(false);
                  }}
                  className={`p-4 rounded-2xl border text-center font-bold text-xs uppercase transition-all flex flex-col justify-center items-center gap-2 hover:scale-[1.02] ${
                    movementType === type
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/5"
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-[10px] tracking-wide leading-snug">
                    {type.split("_")[0] === "cervical" ? "Leher" : "Pinggang"}
                  </span>
                  <span className="text-[9px] opacity-60">
                    {type.split("_")[1] === "flexion" ? "Tunduk ↓" : "Dongak ↑"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Device Orientation Sensor vs Slider Manual Toggles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest block">
                3. Pengukuran Sudut (Inclinometer):
              </label>
              
              <button
                type="button"
                onClick={() => setUseManualInput(!useManualInput)}
                className="text-[10px] font-bold text-emerald-400 hover:underline uppercase tracking-wider"
              >
                {useManualInput ? "Gunakan Sensor HP" : "Input Manual Saja"}
              </button>
            </div>

            {useManualInput ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-white/60">
                  <span>Input Manual Sudut Gerakan:</span>
                  <span className="text-xl font-outfit text-emerald-400 font-black">{manualAngle}°</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="120"
                  value={manualAngle}
                  onChange={(e) => setManualAngle(Number(e.target.value))}
                  className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[9px] font-bold text-white/20">
                  <span>0° (Kaku)</span>
                  <span>45° (Normal Leher)</span>
                  <span>90°+ (Penuh)</span>
                </div>
              </div>
            ) : (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
                {permissionStatus.sensors !== 'granted' ? (
                  <div className="text-center py-4 space-y-4 max-w-sm">
                    <AlertCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Sensor belum aktif</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      ROM Inclinometer memerlukan sensor orientasi smartphone Anda secara real-time.
                    </p>
                    <button
                      type="button"
                      onClick={requestSensors}
                      className="px-6 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Buka Sensor HP
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full space-y-6">
                    {/* Visual needle gauges */}
                    <div className="relative w-44 h-44 flex items-center justify-center rounded-full border-4 border-white/5 bg-black/40">
                      <div className="absolute inset-2 border border-white/5 border-dashed rounded-full" />
                      
                      <motion.div 
                        animate={{ rotate: measuredAngle }}
                        transition={{ type: "spring", stiffness: 60 }}
                        className="absolute w-1 h-full bg-emerald-500/25 flex flex-col justify-between items-center py-1"
                      >
                        <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <div className="w-2 h-2 bg-emerald-500/40 rounded-full" />
                      </motion.div>

                      <div className="text-center z-10">
                        <span className="text-5xl font-outfit font-black text-white">{measuredAngle}°</span>
                        <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Sudut ROM</p>
                      </div>
                    </div>

                    <div className="flex w-full gap-4">
                      <button
                        type="button"
                        onClick={calibrate}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> 
                        {isCalibrated ? "Kalibrasi Ulang" : "Set Titik Nol (0°)"}
                      </button>
                    </div>

                    {!isCalibrated && (
                      <p className="text-[10px] text-amber-400/80 leading-relaxed text-center italic">
                        ⚠️ Letakkan HP tegak di dada/punggung lalu klik "Set Titik Nol" sebelum menekuk badan.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pain Scale Selector */}
          <div>
            <label className="text-xs font-bold text-foreground/40 uppercase tracking-widest block mb-4">
              3. Berapa Skala Nyeri yang Dirasakan? (VAS: 0 - 10):
            </label>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-white/60">Skala VAS (Visual Analog Scale):</span>
                <span className="text-lg font-outfit font-black text-emerald-400">{painLevel} / 10</span>
              </div>

              <input 
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />

              <div className="flex justify-between text-[9px] font-bold text-white/20">
                <span>0 (Bebas Nyeri)</span>
                <span>5 (Sedang)</span>
                <span>10 (Nyeri Ekstrem)</span>
              </div>
            </div>
          </div>

          {/* Instant Emergency Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setLockedOrSeverePain(true);
                handleEvaluate(true);
              }}
              className="w-full py-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-bold text-xs uppercase tracking-widest rounded-2xl transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-95 shadow-md shadow-rose-500/5"
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" /> 
              🚨 Nyeri Hebat / Kaku Punggung Akut (Spasme)
            </button>
          </div>
        </div>

        {/* Results Card */}
        {result && result.status !== "danger" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 md:p-8 rounded-[2rem] border relative overflow-hidden ${
              result.status === "stable" 
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                : "bg-amber-500/5 border-amber-500/20 text-amber-400"
            }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] blur-2xl" />
            <div className="flex gap-4 items-start relative z-10">
              <div className="p-3 bg-white/5 rounded-2xl shrink-0 border border-white/5 shadow-inner">
                {result.status === "stable" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 inline-block">
                  {result.zone} • {result.status === "stable" ? "Normal" : "Perlu Atensi"}
                </span>
                <h3 className="text-lg md:text-xl font-outfit font-black text-white">
                  Evaluasi Sudut: {result.angleDegrees}°
                </h3>
                <p className="text-xs md:text-sm text-white/70 leading-relaxed font-semibold">
                  {result.message}
                </p>
                <div className="pt-2 text-[10px] text-foreground/30 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Data berhasil ditambahkan ke riwayat panel.
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Submission */}
        {(!result || result.status !== "danger") && (
          <div className="flex gap-4 pt-4">
            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95"
              >
                Ulangi Uji
              </button>
            )}
            <button
              type="button"
              disabled={isLoading || (!useManualInput && !isCalibrated)}
              onClick={() => handleEvaluate(false)}
              className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Menghitung Evaluasi ROM...
                </>
              ) : isSaved ? (
                "✓ Hasil Tersimpan!"
              ) : (
                "Kunci & Evaluasi ROM"
              )}
            </button>
          </div>
        )}

        {/* Clinical Section & Guides */}
        <div className="border-t border-white/[0.04] pt-8 space-y-6">
          <ClinicalSection 
            title="Dasar Klinis: Spinal Range of Motion (ROM)"
            description="Keterbatasan fleksi dan ekstensi pasca-bedah spinal fusion atau laminektomi disebabkan oleh proses fiksasi implan pen metal atau perlengketan jaringan fibrosa. Mengukur ROM secara reguler memastikan pasien bergerak di rentang aman (< 45°) untuk menjaga kestabilan posisi kawat atau implan, serta menghindari timbulnya gejala kompresi radikuler ulang akibat pergeseran implan."
            disclaimer="Uji Range of Motion mandiri ini bukan pengganti rontgen fusi tulang belakang (Spinal X-Ray). Selalu lakukan gerakan secara perlahan dan berhenti bila terjadi nyeri menusuk."
            colorClass="emerald"
          />

          <div className="p-6 bg-white/[0.02] rounded-3xl border border-white/5">
            <h4 className="text-xs font-bold text-foreground/40 uppercase mb-3 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> Catatan {doctorConfig.name || "Dokter Spesialis"}
            </h4>
            <p className="text-[11px] text-foreground/50 leading-relaxed italic">
              "Kekakuan mendadak disertai spasme otot hebat di area operasi leher atau pinggang pasca-fusi merupakan alarm darurat pergeseran implan. Segera hentikan seluruh mobilisasi paksa dan lakukan rujukan fisik langsung."
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
                    {doctorConfig.clinic || "Spine & Pain Clinic"}
                  </h4>
                  <div className="flex gap-2.5 text-xs text-foreground/60 leading-relaxed">
                    <MapPinned className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{doctorConfig.location || "Kota, Indonesia"}</span>
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
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctorConfig.clinic || "")}+${encodeURIComponent(doctorConfig.location || "")}`}
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
