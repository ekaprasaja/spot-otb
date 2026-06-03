# Product Requirements Document (PRD) - OrthoBrand Web-App

## 1. Project Overview
**Project Name:** OrthoBrand AI (Web-Based Branding Suite)
**Objective:** Membangun otoritas dan branding dokter spesialis Orthopedi melalui rangkaian tool pemantauan medis berbasis AI dan sensor yang mudah diakses (Web-based/PWA).
**Target Audience:** 
- Pasien pasca-operasi/rehabilitasi.
- Orang tua (untuk Pediatric Ortho).
- Atlet (untuk Sports Medicine).
- Calon pasien yang ingin melakukan skrining mandiri.

## 2. Core Features (The Medical Tool-Suite)

### A. Spine: Inclinometer AI
- **Fungsi:** Mengukur derajat kemiringan punggung (scoliosis/bending test).
- **Teknis:** Mengakses `DeviceOrientationEvent` pada smartphone.
- **Output:** Angka derajat kemiringan real-time dan grafik progres.

### B. Sports Medicine: LSI Calculator
- **Fungsi:** Menghitung *Limb Symmetry Index* (LSI) untuk kesiapan *Return to Play*.
- **Teknis:** Input manual data kekuatan otot (Newton atau Kg) dari hasil tes fisik.
- **Output:** Persentase simetri dan status "Safe" atau "Risk".

### C. Hip & Knee: Knee-Angle Cam
- **Fungsi:** Deteksi *Range of Motion* (ROM) tekukan lutut/panggul.
- **Teknis:** Kamera browser + MediaPipe Pose JS (On-device processing).
- **Output:** Overlay sudut derajat di atas video kamera secara real-time.

### D. Hand & Upper Limb: Dexterity Pulse
- **Fungsi:** Tes koordinasi motorik halus pasca-operasi tangan.
- **Teknis:** Target tapping pada layar dengan durasi 30 detik.
- **Output:** Skor frekuensi sentuhan dan stabilitas ritme.

### E. Pediatric Ortho: Gait Tracer
- **Fungsi:** Analisis pola jalan anak (slow-motion).
- **Teknis:** Upload/Record video + Frame extraction via FFmpeg.wasm.
- **Output:** Analisis per langkah (step length) dan deteksi *in-toeing*.

### F. Trauma & Recon: Weight-Bear Guide
- **Fungsi:** Panduan beban tumpuan kaki.
- **Teknis:** Logging harian tumpuan beban + Alarm visual jika melebihi limit dokter.
- **Output:** Status harian tumpuan beban (Partial vs Full Weight Bearing).

### G. Foot & Ankle: Arch Scan AI
- **Fungsi:** Skrining telapak kaki (Flat Foot).
- **Teknis:** Foto telapak kaki + Image processing (Edge detection) untuk hitung rasio lengkungan.
- **Output:** Status lengkungan (Normal, Flat, atau High Arch).

### H. Oncology Orthopedics: Edema Monitor
- **Fungsi:** Monitoring pembengkakan pasca-tumor.
- **Teknis:** Daily log lingkar anggota tubuh (cm) + Notifikasi otomatis jika ada kenaikan >10% dalam 2 hari.

## 3. Technology Stack (Proposed)
- **Frontend:** Next.js 14+ (App Router).
- **Styling:** Tailwind CSS + Framer Motion (Premium animations).
- **AI/CV:** MediaPipe Pose, TensorFlow.js.
- **Video Processing:** FFmpeg.wasm.
- **Backend/Database:** Cloudflare Workers + D1 Database (Edge storage).
- **Infrastructure:** Vercel atau Cloudflare Pages (PWA enabled).

## 4. Design & Aesthetics
- **Theme:** "Surgical Precision" (Deep Navy #0A192F, Electric Blue #0077FF, Clean White).
- **UI Style:** Glassmorphism, Micro-interactions pada setiap perubahan sensor, Data-heavy visualization (charts).
- **Typography:** Inter atau Outfit (Modern & Readable).

## 5. User Journey
1. **Home:** Landing page branding dokter + Daftar Sub-Spesialis.
2. **Selection:** Pasien memilih tool yang sesuai dengan keluhannya.
3. **Hardware Access:** Izin akses Kamera/Sensor (dengan panduan UX).
4. **Processing:** Pengambilan data via sensor/kamera.
5. **Result:** Hasil analisis yang bisa di-save sebagai PDF atau dibagikan ke WhatsApp Dokter.

## 6. Privacy & Security
- **No Data Leak:** Proses AI (Kamera/Video) dilakukan di browser pasien (*client-side*). Gambar tidak dikirim ke server kecuali pasien memilih untuk "Share to Doctor".
- **Encryption:** Semua data log di database dienkripsi tingkat tinggi.

## 7. Branding Integration
- **CTA Button:** "Konsultasi Lanjut via WhatsApp" pada setiap akhir hasil tes.
- **Doctor's Profile:** Muncul di setiap footer tool untuk meningkatkan *trust*.
- **Shareable Result:** Hasil tes memiliki desain yang "Instagrammable" dengan logo klinik/nama dokter.
