import React from "react";
import Link from "next/link";
import { ChevronLeft, Shield, Lock, Eye, Mail } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Pengumpulan Data Medis & Kontak",
      icon: Shield,
      content: "Kami memahami sensitivitas data kesehatan Anda. Aplikasi ini tidak menyimpan data medis pribadi atau data klinis Anda di server kami. Seluruh hasil perhitungan kalkulator klinis, analisis gerakan, dan log gejala diproses secara lokal di perangkat Anda (client-side) atau diproses secara stateless melalui API server aman kami (data langsung dibuang setelah dihitung). Riwayat rekam medis disimpan secara lokal di browser Anda (local storage) dan Anda dapat menghapusnya kapan saja."
    },
    {
      title: "Penggunaan Izin Kamera & Sensor",
      icon: Lock,
      content: "Akses kamera dan sensor giroskop hanya digunakan saat Anda aktif menggunakan tool diagnostik seperti Cranial Nerve Screener atau Cervical & Lumbar ROM. Kami tidak merekam, menyimpan, atau mengirim gambar, video, atau data sensor Anda ke server pihak ketiga mana pun tanpa persetujuan eksplisit Anda."
    },
    {
      title: "Layanan Newsletter & Email",
      icon: Mail,
      content: "Bagi Anda yang secara sukarela mendaftarkan email ke buletin/newsletter kami, kami mengumpulkan email dan nama Anda. Data ini disimpan dengan aman di database terenkripsi kami untuk keperluan pengiriman edukasi kesehatan berkala oleh dr. Nama Dokter, Sp.OT, Subsp. OTB (K). Anda dapat membatalkan langganan kapan saja melalui tautan berhenti berlangganan di email Anda."
    },
    {
      title: "Keamanan & Hak Pengguna",
      icon: Eye,
      content: "Seluruh data diproses menggunakan standar enkripsi modern. Anda memiliki kendali penuh atas data lokal Anda melalui tombol 'Hapus Semua' di halaman dashboard untuk membersihkan seluruh riwayat pemantauan secara permanen dari perangkat Anda."
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
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-outfit font-bold text-white mb-4">Kebijakan Privasi</h1>
          <p className="text-foreground/40 font-medium">Terakhir diperbarui: 27 Mei 2026</p>
        </header>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <section key={i} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <section.icon className="w-24 h-24 text-primary" />
              </div>
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                    <section.icon className="w-4 h-4 text-primary" />
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
            Pertanyaan mengenai privasi dapat diajukan langsung melalui sesi konsultasi resmi dr. Nama Dokter, Sp.OT, Subsp. OTB (K).
          </p>
        </footer>
      </div>
    </div>
  );
}
