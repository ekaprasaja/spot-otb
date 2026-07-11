"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, Stethoscope } from "lucide-react";
import BookingWidget from "./BookingWidget";

interface ArticleBookingCTAProps {
  doctorId: string;
}

export default function ArticleBookingCTA({ doctorId }: ArticleBookingCTAProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* ─── CTA SECTION ─── */}
      <div className="mt-12 relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 md:p-10">
        {/* Decorative glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10">
          {/* Icon */}
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
            <Stethoscope className="w-8 h-8 text-primary" />
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
              Konsultasi Langsung
            </p>
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight mb-1">
              Ingin Berkonsultasi dengan dr. Prahesta Adi Wibowo, Sp.OT?
            </h3>
            <p className="text-sm text-white/40 leading-relaxed">
              Jadwalkan kunjungan Anda sekarang di RSUP dr. Soeradji Tirtonegoro, Klaten - Jawa Tengah.
            </p>
          </div>

          {/* CTA Button */}
          <div className="shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowModal(true)}
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/25 transition-all text-sm whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              Jadwalkan Temu Dokter
            </motion.button>
          </div>
        </div>
      </div>

      {/* ─── MODAL OVERLAY ─── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative max-w-xl w-full bg-[#111113] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors z-50"
              >
                <X className="w-5 h-5" />
              </button>

              <BookingWidget
                doctorId={doctorId}
                onClose={() => setShowModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
