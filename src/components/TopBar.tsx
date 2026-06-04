import { Search, Bell, Menu, Grid3X3, Activity } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useNotificationStore } from "@/store/useNotificationStore";

import { useDoctorConfig } from "@/context/DoctorConfigContext";

export default function TopBar() {
  const { notifications, togglePanel } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const doctorConfig = useDoctorConfig();
  const titleText = doctorConfig.clinic || (doctorConfig.name ? (doctorConfig.name.split(",")[0] + " Care") : "Portal Kesehatan");

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-6 sticky top-0 bg-background/80 backdrop-blur-xl z-50 border-b border-white/5">
      <div className="flex items-center gap-12 flex-1">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-inter font-bold text-white tracking-tight flex"
          >
            {titleText.split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 5, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ 
                  delay: index * 0.03,
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
        </Link>

        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-primary transition-colors" />
          <motion.input 
            whileFocus={{ scale: 1.02 }}
            type="text" 
            placeholder="Search patient records or tools..."
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePanel}
          className="w-11 h-11 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center text-foreground/40 hover:text-white hover:bg-white/10 transition-all relative bell-trigger"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </motion.button>
        <motion.button 
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-11 h-11 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center text-foreground/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <Grid3X3 className="w-5 h-5" />
        </motion.button>
      </div>
    </header>
  );
}
