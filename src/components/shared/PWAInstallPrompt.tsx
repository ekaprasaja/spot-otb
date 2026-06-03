"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { useDoctorConfig } from "@/context/DoctorConfigContext";

export default function PWAInstallPrompt() {
  const config = useDoctorConfig();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the prompt
    const isDismissed = localStorage.getItem("pwa_install_dismissed") === "true";
    if (isDismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show the install promotion custom prompt
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the browser install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    // Don't show again once closed/dismissed
    localStorage.setItem("pwa_install_dismissed", "true");
    setShowPrompt(false);
  };

  const clinicTitle = config?.clinic ? config.clinic.toUpperCase() : "WISNU SPINECARE";

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-black/75 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#16161B] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl text-center space-y-6 overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 blur-[80px] -z-10 rounded-full" />
            
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Wrapper */}
            <div className="mx-auto w-16 h-16 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10">
              <Download className="w-8 h-8 text-primary" />
            </div>

            {/* Typography */}
            <div className="space-y-3">
              <h2 className="text-xl md:text-2xl font-outfit font-black italic tracking-wide text-white uppercase leading-none">
                PASANG <span className="text-primary font-bold">{clinicTitle}</span>
              </h2>
              <p className="text-xs md:text-sm text-foreground/60 leading-relaxed px-2">
                {config?.whitelabelType === "spog"
                  ? "Akses pemantauan mandiri kehamilan & perkembangan janin Anda lebih mudah langsung dari layar utama. Cukup satu klik."
                  : "Akses pemantauan mandiri saraf & pemulihan pasca-operasi Anda lebih mudah langsung dari layar utama. Cukup satu klik."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-2">
              <button
                onClick={handleInstallClick}
                className="w-full py-4 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl text-center text-sm shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Pasang Aplikasi
              </button>
              
              <button
                onClick={handleClose}
                className="block mx-auto text-[10px] font-black text-foreground/30 hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                Nanti Saja
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
