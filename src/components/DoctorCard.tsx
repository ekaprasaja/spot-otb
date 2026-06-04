"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDoctorConfig } from "@/context/DoctorConfigContext";
import { 
  MapPin, 
  Camera, 
  Globe, 
  Calendar, 
  GraduationCap, 
  Award, 
  Clock, 
  X, 
  MapPinned 
} from "lucide-react";

export default function DoctorCard() {
  const [showSchedule, setShowSchedule] = useState(false);
  const doctorConfig = useDoctorConfig();

  const cvData = doctorConfig.cvTimeline;

  return (
    <>
      {/* ─── SCHEDULE & PRACTICE MODAL OVERLAY ─── */}
      <AnimatePresence>
        {showSchedule && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowSchedule(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-xl w-full bg-[#111113] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowSchedule(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Praktek Klinis</span>
                  <h3 className="text-xl font-bold text-white">Jadwal Temu & Konsultasi</h3>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full" />

              {/* Hospital Details */}
              <div className="space-y-5">
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    {doctorConfig.clinic}
                  </h4>
                  <div className="flex gap-3 text-xs text-foreground/60 leading-relaxed">
                    <MapPinned className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{doctorConfig.location}</span>
                  </div>
                </div>

                {/* Practice Hours */}
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex items-center gap-4">
                  <Clock className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold text-primary uppercase tracking-wider">Jam Praktek Dokter</h5>
                    <p className="text-sm font-bold text-white mt-1">Senin – Jumat</p>
                    <p className="text-xs text-foreground/50">09.00 – 14.00 WIB</p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex gap-4 pt-4">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctorConfig.clinic + " " + doctorConfig.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl text-center text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  Buka Peta Lokasi
                </a>
                <button 
                  onClick={() => setShowSchedule(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl text-sm hover:bg-white/10 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── DOCTOR CARD CONTAINER ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full bg-[#111113]/60 rounded-[3rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT SIDE: DOCTOR METADATA (7 Columns on large screens) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-xl">
                  <img 
                    src={doctorConfig.image} 
                    alt={doctorConfig.name} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-2 rounded-xl shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-outfit font-bold text-white tracking-tight leading-tight">
                  {doctorConfig.name}
                </h3>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1.5 mb-4">
                  {doctorConfig.specialty}
                </p>
                {doctorConfig.bio && (
                  <p className="text-foreground/50 text-sm leading-relaxed italic max-w-xl">
                    "{doctorConfig.bio}"
                  </p>
                )}
              </div>
            </div>



            {/* Main CTA */}
            <div className="pt-2">
              <button 
                onClick={() => setShowSchedule(true)}
                className="w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 text-sm"
              >
                <Calendar className="w-4 h-4" /> Jadwalkan Temu Dokter
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: ACADEMIC & FELLOWSHIP CV TIMELINE (5 Columns on large screens) */}
          <div className="lg:col-span-5 bg-white/[0.01] border border-white/5 rounded-[2rem] p-6 space-y-5">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Academic & Fellowship</h4>
            </div>
            
            {/* Scrollable Timeline */}
            <div className="relative max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent space-y-5 pl-1.5 py-1">
              {/* Vertical line indicator */}
              <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-white/5" />

              {cvData.map((item, idx) => (
                <div key={idx} className="relative pl-6 space-y-1 group">
                  {/* Timeline bullet */}
                  <div className="absolute left-0 top-[6px] w-[12px] h-[12px] rounded-full bg-background border-2 border-primary group-hover:bg-primary transition-colors duration-300" />
                  
                  <span className="text-[10px] font-black text-primary block leading-none">
                    {item.year}
                  </span>
                  <h5 className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                    {item.title}
                  </h5>
                  <p className="text-[10px] text-foreground/40 leading-relaxed font-semibold">
                    {item.description || item.institution || ""}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </motion.div>
    </>
  );
}
