import React from "react";
import { Info, AlertCircle, LucideIcon } from "lucide-react";

interface ClinicalSectionProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  disclaimer?: string;
  colorClass?: string;
}

export function ClinicalSection({ 
  title, 
  description, 
  icon: Icon = Info, 
  disclaimer,
  colorClass = "purple"
}: ClinicalSectionProps) {
  const colorMap: Record<string, string> = {
    purple: "text-purple-400 bg-purple-500/5 border-purple-500/10",
    pink: "text-pink-400 bg-pink-500/5 border-pink-500/10",
    cyan: "text-cyan-400 bg-cyan-500/5 border-cyan-500/10",
    amber: "text-amber-500 bg-amber-500/5 border-amber-500/10",
  };

  const selectedColor = colorMap[colorClass] || colorMap.purple;
  const [textColor, bgColor] = selectedColor.split(" ");

  return (
    <div className="space-y-4">
      <div className={`p-5 rounded-3xl border ${selectedColor}`}>
        <h4 className={`text-xs font-bold uppercase mb-3 flex items-center gap-2 ${textColor}`}>
          <Icon className="w-3 h-3" /> {title}
        </h4>
        <p className="text-[12px] text-foreground/70 leading-relaxed italic">
          "{description}"
        </p>
      </div>

      {disclaimer && (
        <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
          <p className="text-[10px] text-rose-400/80 leading-relaxed text-center font-medium">
            ⚕️ {disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}
