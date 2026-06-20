"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Gavel, AlertTriangle, Scale, BookOpen } from "lucide-react";
import { useDoctorConfig } from "@/context/DoctorConfigContext";

export default function TermsPage() {
  const doctorConfig = useDoctorConfig();
  const doctorName = doctorConfig?.name || "Dokter Kami";
  const doctorSpecialty = doctorConfig?.specialty || "Spesialis";
  const clinicName = doctorConfig?.clinic || "Klinik Kami";
  const domainName = typeof window !== "undefined" ? window.location.hostname : "platform kami";

  const sections = [
    {
      title: "Ketentuan Penggunaan Layanan",
      icon: Gavel,
      content: `Dengan menggunakan platform portal kesehatan kami (${clinicName}), Anda menyetujui bahwa seluruh alat bantu diagnosis AI, kalkulator interaktif, dan log kesehatan dalam aplikasi ini bersifat edukatif dan pemantauan mandiri. Alat-alat ini dirancang untuk mendampingi pemulihan Anda dan tidak boleh dijadikan sebagai dasar diagnosis medis tunggal atau pengganti konsultasi langsung dengan ${doctorSpecialty}.`
    },
    {
      title: "Batasan Tanggung Jawab Medis",
      icon: AlertTriangle,
      content: `${doctorName} beserta tim pengembang dan Incode Panel tidak bertanggung jawab atas keputusan medis atau tindakan pengobatan mandiri yang diambil pengguna berdasarkan hasil perhitungan AI. Keakuratan deteksi sensor dan kamera sangat dipengaruhi oleh kondisi lingkungan (seperti pencahayaan) serta spesifikasi teknis perangkat Anda.`
    },
    {
      title: "Kepatuhan & Penggunaan Data",
      icon: Scale,
      content: "Pengguna wajib memberikan data input yang jujur dan akurat untuk memastikan kalkulator pemulihan menghasilkan estimasi yang tepat. Kami berkomitmen melindungi privasi data Anda dengan memproses seluruh input medis secara lokal dan stateless tanpa retensi data di database kami."
    },
    {
      title: "Hak Cipta & Lisensi",
      icon: BookOpen,
      content: `Seluruh materi edukasi, artikel kesehatan, dan algoritma asisten AI di platform ini dilindungi oleh hak cipta intelektual. Penggunaan, penyalinan, atau distribusi komersial tanpa izin tertulis dari ${doctorName} dilarang keras.`
    }
  ];

  return (
    <div className="min-h-screen py-10 md:py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary transition-colors mb-12 group"
        >
          <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Kembali</span>
        </Link>

        <header className="mb-16">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
            <Gavel className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-4xl font-outfit font-bold text-white mb-4">Syarat & Ketentuan</h1>
          <p className="text-foreground/40 font-medium">Terakhir diperbarui: 27 Mei 2026</p>
        </header>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <section key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <section.icon className="w-24 h-24 text-amber-500" />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <section.icon className="w-4 h-4 text-amber-500" />
                  </div>
                  {section.title}
                </h2>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-20 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-foreground/20">
            Penggunaan platform {domainName} secara berkelanjutan dianggap sebagai persetujuan penuh atas seluruh ketentuan di atas.
          </p>
        </footer>
      </div>
    </div>
  );
}
