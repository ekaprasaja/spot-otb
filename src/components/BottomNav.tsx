"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ClipboardList, BookOpen, Stethoscope } from "lucide-react";
//
// (Lines 7 and 24 are deleted/replaced, keeping standard imports)


const navItems = [
  { href: "/", icon: Home, label: "Beranda" },
  { href: "/tools", icon: Stethoscope, label: "Alat" },
  { href: "/dashboard", icon: ClipboardList, label: "Rekam" },
  { href: "/articles", icon: BookOpen, label: "Artikel" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-[#0A192F]/80 backdrop-blur-2xl border-t border-white/[0.06]" />
      
      <div className="relative flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1.5 px-4 py-2 min-w-[64px] group"
            >
              {active && (
                <motion.div
                  layoutId="nav-glow-bubble"
                  className="absolute inset-x-1 inset-y-1 bg-primary/10 rounded-2xl -z-10"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              
              <div className="relative">
                <item.icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    active ? "text-primary scale-110 -translate-y-0.5" : "text-white/30 group-hover:text-white/50"
                  }`}
                />
                {active && (
                  <motion.div 
                    layoutId="active-dot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(0,119,255,1)]"
                  />
                )}
              </div>
              
              <span
                className={`text-[9px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${
                  active ? "text-primary opacity-100" : "text-white/20 opacity-0 group-hover:opacity-40"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
