// SPOT-OTB — Doctor Configuration
// Ganti semua nilai di bawah ini sesuai identitas dokter yang akan menggunakan portal ini.
// tenant_id harus sama dengan ID di dashboard.incodepanel.com

export const doctorConfig = {
  tenant_id: "spot-otb",                       // ← ganti dengan tenant_id dari dashboard
  name: "Nama Dokter, Sp.XX",                   // ← nama lengkap + gelar spesialisasi
  specialty: "Spesialisasi Lengkap",             // ← spesialisasi lengkap
  clinic: "Nama Klinik / Rumah Sakit",           // ← nama klinik utama
  whatsapp: "62812345678",                       // ← nomor WA dokter (format: 62xxx)
  location: "Kota, Indonesia",                   // ← lokasi praktik
  image: "/images/doctor_profile.webp",          // ← ganti foto dokter
  bio: "Deskripsi singkat tentang dokter dan keahliannya.",
  socials: {
    instagram: "@handle_instagram",
    linkedin: "linkedin-slug",
  }
} as const;
