"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, Bell } from "lucide-react";
import { useDoctorConfig } from "@/context/DoctorConfigContext";
import { useNotificationStore } from "@/store/useNotificationStore";

export default function MobileHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { notifications, togglePanel } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const doctorConfig = useDoctorConfig();

  return (
    <header className="sticky top-0 z-50 md:hidden bg-[#0A0A0B]/80 backdrop-blur-lg border-b border-white/5">
      <div
        className="relative flex items-center justify-between px-6 h-16 md:h-14"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {isHome ? (
          /* Home Page Header: Profile Style */
          <>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/20 shadow-xl">
                  <img 
                    src={doctorConfig.image || "/images/doctor_profile.webp"} 
                    alt={doctorConfig.name} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A0A0B] flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold text-primary uppercase tracking-widest leading-none mb-1">Spine & Pain Intervention</p>
                <h2 className="text-sm font-bold text-white leading-none tracking-tight">{doctorConfig.name}</h2>
              </div>
            </div>
            <button
              onClick={togglePanel}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative active:scale-95 transition-transform bell-trigger"
            >
              <Bell className="w-5 h-5 text-white/50" />
              {unreadCount > 0 && (
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-[#0A0A0B] animate-pulse" />
              )}
            </button>
          </>
        ) : (
          /* Tool Page Header: Back + Title */
          <>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 -ml-2 rounded-xl active:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white/60" />
              </Link>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[16px] font-inter font-bold text-white tracking-tight"
              >
                {doctorConfig.clinic || "SpineCare AI"}
              </motion.h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/80">
                Online
              </span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
