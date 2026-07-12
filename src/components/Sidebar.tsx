"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Shield, 
  Menu,
  BookOpen,
  Stethoscope,
  ClipboardList
} from "lucide-react";
import { useDoctorConfig } from "@/context/DoctorConfigContext";

const navigation = [
  { name: "Beranda", href: "/", icon: Home },
  { name: "Alat Medis AI", href: "/tools", icon: Stethoscope },
  { name: "Rekam Medis", href: "/dashboard", icon: ClipboardList },
  { name: "Artikel Kesehatan", href: "/articles", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const doctorConfig = useDoctorConfig();

  return (
    <aside className="hidden md:flex flex-col w-72 bg-card border-r border-white/5 h-screen sticky top-0 overflow-hidden">
      {/* Branding */}
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="font-outfit font-bold text-xl tracking-tight text-white block">{doctorConfig.clinic || (doctorConfig.name ? (doctorConfig.name.split(",")[0] + " Care") : "Portal Kesehatan")}</span>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">
              {doctorConfig.whitelabelSub || (doctorConfig.whitelabelType === "spog" ? "Obstetrics & Gynecology" : "Spine & Pain Intervention")}
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navigation.map((item) => {
          const isActive = item.href === "/" 
            ? pathname === "/" 
            : pathname.startsWith(item.href) && item.href !== "#";
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all group ${
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-foreground/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-foreground/40 group-hover:text-white"}`} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User / Bottom Info */}
      <div className="p-4 mt-auto">
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shadow-inner">
            <img src={doctorConfig.image || "/images/doctor_profile.webp"} alt={doctorConfig.name} className="w-full h-full object-cover object-top" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white truncate">{doctorConfig.name}</p>
            <p className="text-[10px] text-foreground/40 uppercase font-bold tracking-tighter">Chief Surgeon</p>
          </div>
          <Menu className="w-4 h-4 text-foreground/20 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
}
