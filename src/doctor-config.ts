// SPOT-OTB — Doctor Configuration
// Ganti semua nilai di bawah ini sesuai identitas dokter yang akan menggunakan portal ini.
// tenant_id harus sama dengan ID di dashboard.incodepanel.com

export const doctorConfig = {
  tenant_id: "dr-prahesta-adi-wibowo-spot-su-sht1a",                       // ← ganti dengan tenant_id dari dashboard
  name: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)", // ← nama lengkap + gelar spesialisasi
  specialty: "Spesialis Orthopedi & Traumatologi, Konsultan Tulang Belakang (Spine Surgeon)",             // ← spesialisasi lengkap
  clinic: "Spine & Pain Clinic",               // ← nama klinik utama
  whatsapp: "62812345678",                       // ← nomor WA dokter (format: 62xxx)
  location: "Kota, Indonesia",                   // ← lokasi praktik
  image: "/images/doctor_profile.webp",          // ← ganti foto dokter
  bio: "Spesialis Orthopedi & Traumatologi — Konsultan Bedah Tulang Belakang & Intervensi Nyeri.",
  socials: {
    instagram: "@handle_instagram",
    linkedin: "linkedin-slug",
  }
} as const;
