"use client";

import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, CheckCircle2, Lightbulb } from "lucide-react";

interface Step {
  title: string;
  desc: string;
}

interface ToolInstructionProps {
  steps: Step[];
  educationalGoal: string;
  color?: "primary" | "emerald" | "purple" | "rose" | "amber";
}

const colorMap = {
  primary: "text-primary bg-primary/10 border-primary/20",
  emerald: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  rose: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

export function ToolInstruction({ steps, educationalGoal, color = "primary" }: ToolInstructionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 space-y-6"
    >
      {/* Educational Goal */}
      <div className={`p-4 rounded-2xl border flex gap-3 ${colorMap[color]}`}>
        <Lightbulb className="w-5 h-5 shrink-0" />
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest mb-1">Tujuan Edukasi</p>
          <p className="text-xs leading-relaxed opacity-90">{educationalGoal}</p>
        </div>
      </div>

      {/* Steps */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-5 flex items-center gap-2">
          <HelpCircle className="w-3 h-3" /> Cara Penggunaan
        </h4>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-foreground/40 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-full bg-white/10 my-1" />
                )}
              </div>
              <div className="pb-2">
                <p className="text-[11px] font-bold text-white mb-0.5">{step.title}</p>
                <p className="text-[10px] text-foreground/50 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
