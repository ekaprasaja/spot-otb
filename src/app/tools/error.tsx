"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ToolsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-20 h-20 rounded-[2rem] bg-rose-500/10 flex items-center justify-center mb-8"
      >
        <AlertCircle className="w-10 h-10 text-rose-500" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-inter font-bold text-white mb-3"
      >
        Terjadi Kesalahan
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-foreground/40 mb-10 max-w-xs leading-relaxed"
      >
        Kami kesulitan memuat perpustakaan alat. Silakan coba lagi atau kembali ke beranda.
      </motion.p>

      <div className="flex flex-col w-full gap-3 max-w-xs">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold active:scale-95 transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          Coba Lagi
        </button>
        
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-white/5 text-white/60 py-4 rounded-2xl font-bold active:scale-95 transition-transform border border-white/5"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
