"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

interface StatGridProps {
  stats: StatItem[];
  columns?: number;
}

export default function StatGrid({ stats, columns = 3 }: StatGridProps) {
  const gridCols = columns === 3 ? "grid-cols-3" : "grid-cols-2";

  return (
    <section className={`grid ${gridCols} gap-4 mb-16`}>
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="glass-card p-4 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className={`w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center mb-3 border border-white/5 ${stat.color}`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <span className="text-[20px] font-bold text-white mb-1">{stat.value}</span>
          <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-[0.2em]">{stat.label}</span>
        </motion.div>
      ))}
    </section>
  );
}
