import DermatomeTracker from "@/components/tools/DermatomeTracker";
import DoctorCard from "@/components/DoctorCard";
import { SafetyNotice } from "@/components/shared/SafetyNotice";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dermatome Mapper — Peta Sensorik Saraf Tulang Belakang",
    description: "Pemetaan area kebas, kesemutan, atau hilangnya sensasi raba kulit sesuai dermatom saraf spinal oleh dr. Prahesta Adi Wibowo, Sp.OT.",
  };
}

export default function DermatomePage() {
  return (
    <div className="min-h-screen py-10 md:py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link 
          href="/tools" 
          className="hidden md:inline-flex items-center gap-2 text-foreground/40 hover:text-primary transition-colors mb-4 group"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Kembali ke Daftar Alat</span>
        </Link>
        <DermatomeTracker />
        <DoctorCard />
        <SafetyNotice />
      </div>
    </div>
  );
}
