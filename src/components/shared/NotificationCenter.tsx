"use client";

import { useNotificationStore } from "@/store/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check, Trash2, ShieldAlert, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

export default function NotificationCenter() {
  const { 
    notifications, 
    isPanelOpen, 
    togglePanel, 
    markAsRead, 
    markAllAsRead, 
    clearAll 
  } = useNotificationStore();

  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isPanelOpen && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        // Only close if we didn't click one of the bell triggers
        const target = event.target as HTMLElement;
        if (!target.closest('.bell-trigger')) {
          togglePanel();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPanelOpen, togglePanel]);

  // Format date helper
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHrs < 24) return `${diffHrs} jam lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "critical": return <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getCategoryBg = (category: string, read: boolean) => {
    if (read) return "bg-white/[0.01] border-white/5";
    switch (category) {
      case "success": return "bg-emerald-500/[0.04] border-emerald-500/20";
      case "warning": return "bg-amber-500/[0.04] border-amber-500/20";
      case "critical": return "bg-rose-500/[0.04] border-rose-500/20";
      default: return "bg-blue-500/[0.04] border-blue-500/20";
    }
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop glass blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9990] bg-black/50 backdrop-blur-sm"
          />

          {/* Sliding Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0F0F11]/95 border-l border-white/10 z-[9995] shadow-2xl flex flex-col h-full backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-none">Notifikasi Medis</h3>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase mt-1 tracking-wider">
                    {notifications.filter(n => !n.read).length} Baru
                  </p>
                </div>
              </div>

              <button
                onClick={togglePanel}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-foreground/50 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            {notifications.length > 0 && (
              <div className="px-6 py-3 bg-white/[0.01] border-b border-white/5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                <button
                  onClick={markAllAsRead}
                  className="text-primary hover:text-primary-hover flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Tandai Semua Dibaca
                </button>
                <button
                  onClick={clearAll}
                  className="text-foreground/30 hover:text-rose-500 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Bersihkan Semua
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-foreground/20" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Tidak Ada Notifikasi</h4>
                    <p className="text-xs text-foreground/30 max-w-[200px] mt-1 leading-relaxed">
                      Laporan triase mandiri atau tips harian Anda akan muncul di sini.
                    </p>
                  </div>
                </div>
              ) : (
                notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    layoutId={`notif-card-${n.id}`}
                    onClick={() => markAsRead(n.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 group hover:border-white/15 relative overflow-hidden flex gap-3 ${getCategoryBg(n.category, n.read)}`}
                  >
                    {/* Unread indicator dot */}
                    {!n.read && (
                      <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full" />
                    )}

                    {/* Icon */}
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mt-0.5">
                      {getCategoryIcon(n.category)}
                    </div>

                    {/* Content */}
                    <div className="space-y-1 pr-4">
                      <h4 className={`text-xs font-bold text-white ${!n.read ? "font-black" : "opacity-80"}`}>
                        {n.title}
                      </h4>
                      <p className="text-[11px] text-foreground/50 leading-relaxed font-medium">
                        {n.content}
                      </p>
                      <span className="text-[9px] font-bold text-foreground/30 uppercase tracking-wide block pt-1">
                        {formatTime(n.date)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
