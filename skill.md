# Coding Skill & Best Practices - OrthoBrand AI

Dokumen ini berfungsi sebagai panduan instruksi khusus untuk Antigravity selama proses pengembangan aplikasi OrthoBrand AI.

## 1. UI/UX Standard: "Surgical Aesthetic"
- **Color Palette:** Wajib menggunakan Deep Navy (`#0A192F`), Electric Blue (`#0077FF`), dan Clean Medical White. Jangan gunakan warna generik.
- **Typography:** Gunakan `Outfit` untuk heading dan `Inter` untuk body text.
- **Transitions:** Setiap transisi halaman atau kemunculan data sensor harus menggunakan `framer-motion` dengan *easing* yang halus (bukan animasi kasar).
- **Responsive:** Utamakan tampilan Mobile (Portrait) karena tool sensor & kamera akan digunakan melalui HP.

## 2. Sensor & Camera Implementation
- **Safe Hardware Access:** Selalu gunakan *try-catch* saat meminta izin kamera atau sensor. Berikan pesan error yang ramah jika izin ditolak (misal: "Izin kamera diperlukan untuk mengukur sudut lutut").
- **Client-Side Processing:** Logika AI (MediaPipe/TensorFlow) harus berjalan di Client Components (`"use client"`) untuk memastikan pemrosesan real-time tanpa delay server.
- **Cleanup:** Selalu hentikan stream kamera (`track.stop()`) dan hapus *event listener* sensor saat komponen di-unmount untuk menghemat baterai pasien.

## 3. Tech Stack Patterns (Next.js 14 App Router)
- **Component Structure:** Pisahkan logika perhitungan medis (misal: algoritma LSI) ke dalam folder `hooks/` atau `utils/`, terpisah dari komponen UI.
- **State Management:** Gunakan `Zustand` untuk menyimpan data log harian (misal: Edema Monitor) agar persistensi data lancar di sisi client.
- **PWA Ready:** Pastikan setiap asset (icons/manifest) memenuhi standar instalasi PWA.

## 4. Branding & Authority
- **Doctor's Persona:** Gunakan bahasa yang profesional namun menenangkan (misal: "Progres penyembuhan Anda terpantau baik" bukan "Data sukses disimpan").
- **Visual Evidence:** Setiap hasil tes (seperti Knee-Angle) harus disertai visualisasi yang "keren" (grafik atau overlay video) agar pasien merasa nilai branding dokternya tinggi.

## 5. Security & Privacy
- **HIPAA-Minded:** Jangan pernah menyimpan gambar/video pasien ke database secara otomatis. Simpan hanya angka hasil analisisnya saja.
- **Data Encryption:** Gunakan enkripsi standar jika data log sensitif harus disimpan ke Cloudflare D1.

---
**Antigravity Commitment:** Saya akan memvalidasi setiap fitur terhadap checklist di atas sebelum menyerahkan kodenya kepada Anda.
