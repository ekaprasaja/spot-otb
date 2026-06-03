"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import SpotlightCard from "../shared/SpotlightCard";

interface Tool {
  id: string;
  tool: string;
  icon: React.ReactNode;
  color: string;
  href: string;
  isNew?: boolean;
  recommendation?: string;
}

interface DiagnosticToolGridProps {
  tools: Tool[];
  title?: string;
}

export default function DiagnosticToolGrid({ tools, title = "Alat Diagnostik AI" }: DiagnosticToolGridProps) {
  return (
    <section className="px-6 mb-12">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] whitespace-nowrap">{title}</h2>
        <div className="h-px w-full bg-gradient-to-r from-primary/20 to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool, i) => (
          <Link key={tool.id} href={tool.href} prefetch={false} className="block">
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ 
                delay: i * 0.04,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileTap={{ scale: 0.96 }}
            >
              <SpotlightCard className="glass-card p-5 rounded-[2rem] border border-white/5 hover:border-primary/30 transition-all relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className={`w-11 h-11 ${tool.color} rounded-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {tool.icon}
                </div>
                <h3 className="text-xs font-bold text-white leading-tight mb-1 group-hover:text-primary transition-colors">{tool.tool}</h3>
                
                {tool.recommendation && (
                  <p className="text-[7.5px] text-zinc-400 font-medium leading-relaxed mb-3 line-clamp-2">{tool.recommendation}</p>
                )}
                
                <div className="flex items-center gap-1.5 text-[8px] text-primary font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                  Launch Module <ChevronRight className="w-2.5 h-2.5" />
                </div>
                {tool.isNew && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                     <span className="text-[7px] font-black text-primary uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">New</span>
                     <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_12px_rgba(174,198,255,0.9)] animate-pulse" />
                  </div>
                )}
              </SpotlightCard>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
