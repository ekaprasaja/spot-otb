"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({ 
  children, 
  className,
  spotlightColor = "rgba(174, 198, 255, 0.1)"
}: SpotlightCardProps) {
  // COMPLETELY STRIPPED interactive radial gradients to prevent build-time metadata corruption.
  // Using a subtle solid border/background instead.

  return (
    <div
      className={cn(
        "group relative glass-card rounded-[2rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500",
        className
      )}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
