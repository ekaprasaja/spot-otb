"use client";

import { useOrthoStore, PatientRecord } from "@/store/useOrthoStore";
import { usePatientStore } from "@/store/usePatientStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  History, 
  Trash2, 
  Calendar, 
  FileText, 
  ChevronLeft, 
  LayoutDashboard, 
  Clock, 
  Download, 
  Activity,
  Edit2,
  X,
  User,
  Info
} from "lucide-react";
import DoctorCard from "@/components/DoctorCard";
import { SafetyNotice } from "@/components/shared/SafetyNotice";
import Link from "next/link";
import StatGrid from "@/components/patterns/StatGrid";

export default function DashboardPage() {
  const { records, deleteRecord, clearRecords } = useOrthoStore();
  const { profile, updateProfile } = usePatientStore();
  const { addNotification } = useNotificationStore();

  // Profile Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState(profile.name);
  const [formPatientId, setFormPatientId] = useState(profile.patientId);
  const [formBloodType, setFormBloodType] = useState(profile.bloodType);
  const [formAge, setFormAge] = useState(profile.age);
  const [formGender, setFormGender] = useState(profile.gender);

  const openEditModal = () => {
    setFormName(profile.name);
    setFormPatientId(profile.patientId);
    setFormBloodType(profile.bloodType);
    setFormAge(profile.age);
    setFormGender(profile.gender);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formName,
      patientId: formPatientId,
      bloodType: formBloodType,
      age: Number(formAge),
      gender: formGender
    });
    
    // Add success notification
    addNotification(
      "Profil Pasien Diperbarui",
      `Data klinis pasien ${formName} (#${formPatientId}) telah berhasil disesuaikan dan disimpan secara lokal.`,
      "success"
    );

    setIsEditing(false);
  };

  const exportData = (format: 'csv' | 'json') => {
    if (records.length === 0) return;
    
    let content = "";
    let mimeType = "";
    let fileName = `neurospine-records-${new Date().toISOString().split('T')[0]}`;

    if (format === 'json') {
      content = JSON.stringify(records, null, 2);
      mimeType = "application/json";
      fileName += ".json";
    } else {
      const headers = ["ID", "Type", "Date", "Status", "Value", "Notes"];
      const rows = records.map(r => [
        r.id,
        r.type,
        r.date,
        r.status,
        typeof r.value === 'object' ? JSON.stringify(r.value).replace(/"/g, '""') : r.value,
        r.notes || ""
      ]);
      content = [headers, ...rows].map(row => row.join(",")).join("\n");
      mimeType = "text/csv";
      fileName += ".csv";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: PatientRecord["status"]) => {
    switch (status) {
      case "normal": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "warning": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "critical": return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default: return "text-foreground/40 bg-white/5 border-white/10";
    }
  };

  const getToolName = (type: PatientRecord["type"]) => {
    switch (type) {
      case "Spine": return "Cervical & Lumbar ROM";
      case "Edema": return "Wound & CSF Tracker";
      case "WeightBear": return "Weight-Bear Guide";
      case "Dexterity": return "Dexterity Pulse";
      case "Recovery": return "VAS & Neuro-Deficit Diary";
      case "Sciatica": return "Sciatica & Radiculopathy Mapper";
      case "Dermatome": return "Dermatome Pain Tracker";
      default: return type;
    }
  };

  const formatValue = (record: PatientRecord) => {
    if (typeof record.value !== 'object' || record.value === null) {
      return record.value;
    }
    
    // Cranial Nerve Screener Result
    // Sciatica Result
    if (record.type === "Sciatica" && typeof record.value === 'object' && 'painScale' in record.value) {
      const val = record.value as { zone: string; painScale: number; primaryLocation: string };
      const locText = val.primaryLocation.startsWith("lumbar") ? "Pinggang" : "Leher";
      return `${val.zone}: VAS ${val.painScale}/10 (${locText})`;
    }

    // Dermatome Result
    if (record.type === "Dermatome" && typeof record.value === 'object' && 'activeDermatome' in record.value) {
      const val = record.value as { zone: string; activeDermatome: string; sensationLevel: string };
      const sensText = val.sensationLevel === 'normal' ? 'Normal' :
                       val.sensationLevel === 'hypoesthesia' ? 'Kebas' :
                       val.sensationLevel === 'hyperesthesia' ? 'Sensitif' : 'Mati Rasa';
      return `${val.zone}: Area ${val.activeDermatome} (${sensText})`;
    }

    // Weight-Bear Guide Result
    if (record.type === "WeightBear" && typeof record.value === 'object') {
      const val = record.value as any;
      if ('targetWeightKg' in val) {
        return `${val.zone}: ${val.targetWeightKg} kg (${val.percentage}% dari ${val.bodyWeight} kg)`;
      } else if ('percent' in val) {
        return `Target: ${val.percent}% (Nyeri: ${val.pain || 0})`;
      }
    }

    // Dexterity Pulse Result
    if (record.type === "Dexterity" && typeof record.value === 'object' && 'speedTps' in record.value) {
      const val = record.value as { speedTps: number, accuracy: number, consistency: number, hand: string, zone: string };
      const handText = val.hand === 'left' ? 'Kiri' : 'Kanan';
      return `${val.zone}: ${val.speedTps} TPS (${handText}, Akurasi: ${val.accuracy}%, Stabilitas: ${val.consistency}%)`;
    }

    // Spine ROM Result
    if (record.type === "Spine" && typeof record.value === 'object' && 'movementType' in record.value) {
      const val = record.value as { movementType: string, angleDegrees: number, painLevel: number, zone: string };
      const typeText = val.movementType === 'cervical_flexion' ? 'Tunduk Leher' : 
                       val.movementType === 'cervical_extension' ? 'Dongak Leher' :
                       val.movementType === 'lumbar_flexion' ? 'Tunduk Pinggang' : 'Dongak Pinggang';
      return `${val.zone}: ${typeText} ${val.angleDegrees}° (Nyeri: ${val.painLevel}/10)`;
    }

    // Wound & CSF Tracker Result
    if (record.type === "Edema" && typeof record.value === 'object' && 'simulationType' in record.value) {
      const val = record.value as { simulationType: string, zone: string };
      const statusText = val.simulationType === 'csf' ? 'Bocor Cairan Otak (CSF)' :
                         val.simulationType === 'infection' ? 'Infeksi Nanah' : 'Kering & Bersih';
      return `${val.zone}: ${statusText}`;
    }

    return JSON.stringify(record.value);
  };

  return (
    <div className="min-h-screen py-6 md:py-16 px-5 md:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* ─── EDIT PROFILE MODAL ─── */}
        <AnimatePresence>
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
              onClick={() => setIsEditing(false)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                className="relative max-w-lg w-full bg-[#111113] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white leading-none">Edit Profil Pasien</h3>
                      <p className="text-[10px] text-foreground/40 font-bold uppercase mt-1 tracking-wider">Sesuaikan Data EHR Lokal</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-foreground/45 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">Nama Lengkap:</label>
                    <input 
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all"
                      placeholder="Masukkan nama lengkap..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">ID Pasien:</label>
                      <input 
                        type="text"
                        required
                        value={formPatientId}
                        onChange={(e) => setFormPatientId(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all"
                        placeholder="ID..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">Gol. Darah:</label>
                      <select 
                        value={formBloodType}
                        onChange={(e) => setFormBloodType(e.target.value)}
                        className="w-full bg-[#161619] border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all cursor-pointer"
                      >
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
                          <option key={g} value={g} className="bg-[#111113]">{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">Umur (Tahun):</label>
                      <input 
                        type="number"
                        required
                        min="1"
                        max="120"
                        value={formAge}
                        onChange={(e) => setFormAge(Number(e.target.value))}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest block">Jenis Kelamin:</label>
                      <select 
                        value={formGender}
                        onChange={(e) => setFormGender(e.target.value)}
                        className="w-full bg-[#161619] border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all cursor-pointer"
                      >
                        {["Laki-laki", "Perempuan"].map((jk) => (
                          <option key={jk} value={jk} className="bg-[#111113]">{jk}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex gap-3">
                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-foreground/40 leading-relaxed">
                      Seluruh pembaruan biodata ini tersimpan sepenuhnya pada media penyimpanan lokal (*Local Storage*) browser Anda untuk menjaga privasi medis.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 transition-all"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── HEADER ─── */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-outfit font-bold text-white tracking-tight">{profile.name}</h1>
              <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-3">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/10">ID: #{profile.patientId}</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/10">Gol: {profile.bloodType}</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/10">{profile.age} Thn</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/10">{profile.gender}</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex gap-4">
             <button 
               onClick={openEditModal}
               className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
             >
               <Edit2 className="w-3.5 h-3.5" /> Edit Profil
             </button>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden gap-3 mt-2">
             <button 
               onClick={openEditModal}
               className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-white/60 uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
             >
               <Edit2 className="w-3.5 h-3.5" /> Edit Profil
             </button>
          </div>
        </header>

        {/* ─── STATUS PANEL ─── */}
        <header className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-outfit font-bold text-white/80 flex items-center gap-4">
              <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8 text-primary/60" />
              Panel Monitoring
            </h2>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <StatGrid 
            stats={[
              { label: "Total Rekam", value: records.length, icon: FileText, color: "text-blue-500" },
              { label: "Kondisi Baik", value: records.filter(r => r.status === 'normal').length, icon: Activity, color: "text-emerald-500" },
              { label: "Perlu Atensi", value: records.filter(r => r.status !== 'normal').length, icon: History, color: "text-amber-500" },
            ]} 
          />
        </motion.div>

        {/* ─── LIST HISTORI ─── */}
        <header className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">Riwayat Terbaru</h2>
          
          <div className="flex gap-3">
            {records.length > 0 && (
              <div className="flex bg-white/5 rounded-2xl border border-white/10 p-1">
                <button 
                  onClick={() => exportData('json')}
                  className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Download className="w-3 h-3" /> JSON
                </button>
                <div className="w-px h-4 bg-white/10 self-center" />
                <button 
                  onClick={() => exportData('csv')}
                  className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
            )}
            
            <button 
              onClick={() => { if(confirm("Hapus semua riwayat?")) clearRecords(); }}
              className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-2xl transition-all active:scale-95"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {records.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-card rounded-[2.5rem] border border-white/5"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-foreground/10" />
                </div>
                <h3 className="text-xl font-bold text-white/40">Belum ada rekaman medis.</h3>
                <p className="text-sm text-foreground/20 mt-2">Gunakan tool monitoring untuk mulai mencatat data pasien.</p>
              </motion.div>
            ) : (
              records.map((record, index) => (
                <motion.div
                  key={record.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.06)" }}
                  className="relative p-6 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 group transition-all overflow-hidden shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16" />
                  
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{getToolName(record.type)}</span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase border backdrop-blur-md ${getStatusColor(record.status)}`}>
                          {record.status === 'normal' ? '✅ Normal' : record.status === 'warning' ? '⚠️ Perhatian' : '🚨 Kritis'}
                        </span>
                      </div>
                      <h4 className="text-xl font-outfit font-bold text-white mb-2">
                        Hasil Pemantauan {getToolName(record.type)}
                      </h4>
                      <div className="flex items-center gap-4 text-[10px] text-foreground/30 font-medium uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(record.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 border-white/10 pt-6 md:pt-0 relative z-10">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-2">Ringkasan Nilai</p>
                      <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 shadow-lg">
                        <p className="text-xl font-outfit font-bold text-white">
                          {formatValue(record)}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteRecord(record.id)}
                      className="p-3.5 bg-white/5 hover:bg-rose-500/10 text-foreground/20 hover:text-rose-500 rounded-2xl transition-all active:scale-90 border border-white/5"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="mt-20 space-y-12">
          <DoctorCard />
          <SafetyNotice />
          
          <footer className="py-12 text-center border-t border-white/[0.02]">
            <div className="flex justify-center gap-6 mb-4">
              <Link href="/privacy" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest hover:text-primary transition-colors">Terms of Service</Link>
            </div>
            <p className="text-[9px] text-foreground/10 uppercase font-black tracking-[0.4em]">SpineCare AI • 2026</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
