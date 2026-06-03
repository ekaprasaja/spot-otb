"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Insight {
  id: number | string;
  title: string;
  tag: string;
  img: string;
}

interface MedicalInsightScrollerProps {
  insights: Insight[];
  title?: string;
  viewAllHref?: string;
}

export default function MedicalInsightScroller({ 
  insights, 
  title = "Wawasan Medis", 
  viewAllHref = "/articles" 
}: MedicalInsightScrollerProps) {
  return (
    <section className="mb-12 overflow-hidden">
      <div className="px-6 flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-white/80 uppercase tracking-widest">{title}</h2>
        <Link href={viewAllHref} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <ChevronRight className="w-4 h-4 text-white/30" />
        </Link>
      </div>
      
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-6 pb-4 snap-x snap-mandatory touch-auto">
        {insights.map((insight) => (
          <Link key={insight.id} href={`/articles/${insight.id}`} prefetch={false} className="snap-center shrink-0 w-[260px] group first:ml-0 last:mr-6">
            <div className="glass-card rounded-[2rem] overflow-hidden shadow-lg border-white/5">
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={insight.img} alt={insight.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-full text-[7px] font-bold text-white uppercase tracking-widest border border-white/10">
                  {insight.tag}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-[13px] font-bold text-white mb-1 line-clamp-1">{insight.title}</h4>
                <div className="flex items-center gap-1 text-primary text-[9px] font-bold uppercase tracking-widest">
                  Baca Artikel <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
