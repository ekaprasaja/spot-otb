"use client";

import React from "react";
import { AlertTriangle, UserCheck, CameraOff, Lightbulb, User } from "lucide-react";
import { motion } from "framer-motion";
import { useDoctorConfig } from "@/context/DoctorConfigContext";

export function SafetyNotice() {
  const doctorConfig = useDoctorConfig();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-[2.5rem] bg-rose-500/5 border border-rose-500/10 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <AlertTriangle className="w-24 h-24 text-rose-500" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <h3 className="text-sm font-black text-rose-500 uppercase tracking-[0.2em]">Peringatan Keakuratan AI</h3>
        </div>

        <p className="text-sm text-foreground/70 leading-relaxed mb-6">
          Analisis kecerdasan buatan (AI) ini dirancang sebagai <span className="text-white font-bold italic underline decoration-rose-500/30">panduan edukatif awal</span> dan bukan merupakan diagnosis medis final. Hasil perhitungan dapat mengalami deviasi atau kesalahan karena faktor teknis berikut:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { icon: Lightbulb, text: "Intensitas cahaya ruangan yang kurang optimal" },
            { icon: CameraOff, text: "Sudut pengambilan gambar yang tidak tegak lurus" },
            { icon: User, text: "Pakaian longgar yang menghalangi visualisasi postur" },
            { icon: UserCheck, text: "Distorsi lensa kamera pada jarak terlalu dekat" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <item.icon className="w-4 h-4 text-rose-400/60" />
              <span className="text-[11px] text-foreground/50 font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-3">
          <p className="text-[11px] font-bold text-rose-300 leading-relaxed text-left border-b border-rose-500/10 pb-3">
            ⚠️ <strong>Pernyataan Batasan Resmi:</strong> Portal skrining SpineCare AI ini bukanlah instrumen diagnosis medis resmi dan tidak menggantikan keputusan klinis profesional. Aplikasi ini berfungsi sebagai media pemantauan mandiri (monitoring aid) dan alat edukasi penunjang untuk membantu Anda mengenali gejala dan melacak kemajuan latihan fusi leher/pinggang secara terstruktur selama masa pemulihan di bawah pengawasan dokter.
          </p>
          <p className="text-xs font-black text-rose-200 leading-relaxed text-center pt-1">
            Demi keselamatan medis, Anda WAJIB melakukan konsultasi fisik langsung dengan {doctorConfig.name || "Spesialis Orthopedi Tulang Belakang"} sebelum merencanakan tindakan atau menghentikan terapi pemulihan!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
