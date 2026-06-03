# Development Plan
## Multi-Tenant Medical SaaS Platform: Booking Engine & Niramaya Admin Dashboard

---

Rencana pengembangan ini dibagi menjadi **5 Fase Taktis** untuk membangun arsitektur SaaS berskala 10.000 dokter dengan integrasi notifikasi real-time WhatsApp & Telegram.

---

## 📅 Fase 1: Setup Arsitektur Database & Multi-Tenancy & Clerk Auth (Minggu 1 - 2)
Fokus pada perancangan basis data relasional berpresisi tinggi yang aman dan terisolasi serta autentikasi Clerk.

* **Supabase / PostgreSQL Setup (Multi-Location & Schedules)**:
  * Skema tabel `doctors` (STR, SIP, Spesialisasi, Whatsapp, Telegram Chat ID).
  * Skema tabel `patients` (Nama, No HP, Email, Rekam Medis).
  * Skema tabel `doctor_schedules` (ID Schedule, ID Dokter, Lokasi Praktek, Hari Praktek, Jam Mulai, Jam Selesai, Maksimal Kuota).
    * *Field terpisah*: `lokasi` (Text), `hari` (Text), `jam_mulai` (Time), `jam_selesai` (Time).
  * Skema tabel `bookings` (ID Booking, ID Dokter, ID Pasien, ID Schedule, Jam Booking, Status: *Pending / Confirmed / Cancelled*).
* **Row Level Security (RLS) Policy**:
  * Terapkan RLS di mana dokter hanya bisa membaca/menulis data yang memiliki `doctor_id` yang cocok dengan JWT Session mereka.
* **Integrasi Clerk Authentication**:
  * Menggunakan `@clerk/clerk-react` di dalam proyek **`niramaya`** dengan konfigurasi `PUBLISHABLE_KEY` yang sama seperti di `dashboard.incodepanel.com`.
  * Integrasikan sesi login agar dokter yang login di `niramaya.incodepanel.com/doctor` langsung terhubung dengan data profil medis dan antrean mereka dari database D1.
* **Fitur Input Lokasi & Jadwal di `dashboard.incodepanel.com`**:
  * Menambahkan panel manajemen **"Lokasi & Jadwal Praktik"** di `dashboard` sehingga Anda dapat menginput multi-lokasi untuk satu dokter.
  * Setiap baris jadwal memiliki input spesifik untuk kolom **Lokasi**, **Hari**, **Jam Mulai**, dan **Jam Selesai** secara terpisah.

---

## 📅 Fase 2: Pembangunan Core Booking & Cross-Project Integration (Bumil-Main Pilot) (Minggu 3 - 4)
Fokus pada pengintegrasian booking dari portal eksternal **`bumil-main`** (sebagai pilot project pertama karena telah 100% mendukung dynamic white-label dari `dashboard.incodepanel.com`) ke basis data riil `niramaya`.

* **Pembersihan Data Dummy**:
  * Menghapus seluruh data mock/dummy dari frontend `niramaya`.
  * Menghubungkan visualisasi kalender slot praktik, daftar dokter, dan log antrean langsung ke API Workers terpusat (`newsletter-db`).
* **Pengujian Integrasi Praktik & Lokasi (`bumil-main` Pilot)**:
  * Memanfaatkan ketersediaan integrasi dynamic API ke Workers D1 yang telah dimiliki `bumil-main` via `DoctorConfigContext`.
  * Tambahkan modul antarmuka booking pada proyek **`bumil-main`** menggunakan properti dinamis jam praktik (`clinicAddress` & `doctorCvJson`) yang di-fetch dari D1.
  * Ketika user menekan tombol booking di portal `bumil-main`, kirim payload pendaftaran pasien secara langsung ke Endpoint API `niramaya.incodepanel.com/api/bookings`.

---

## 📅 Fase 3: Integrasi & Pengujian Sistem Notifikasi Dua Arah WA, Telegram, & Email (Minggu 5 - 6)
Fokus pada otomatisasi pengiriman pesan real-time ke dokter dan pasien secara simultan.

* **Setup Message Queue & Webhook Dispatcher**:
  * Konfigurasi webhook trigger di Workers API ketika data booking baru sukses terbuat dari `bumil-main`.
* **Fungsionalitas Penuh Pengiriman WhatsApp (Dual Path)**:
  * Mengirim pesan WA konfirmasi ke Pasien (karcis antrean) dan notifikasi detail keluhan pasien ke Dokter menggunakan API Gateway Fonnte/Wablas.
* **Telegram Bot Connector (Two-Way)**:
  * Bot resmi platform mengirimkan detail medis ke `chat_id` dokter dan mengirim karcis digital interaktif ke `chat_id` pasien.
* **Email Notification Engine**:
  * Integrasikan SMTP / Cloudflare API Email Router dengan menggunakan repositori `newsletter` sebagai engine pengiriman email otomatis (transactional email) konfirmasi booking untuk pasien dan alert untuk dokter.

---

## 📅 Fase 4: Pembangunan Niramaya Super-Admin Dashboard & Doctor Portal (Minggu 7 - 8)
Fokus pada antarmuka pengelola (Admin/Owner) dan dokter di proyek **`niramaya`** (`niramaya.incodepanel.com`).

* **Niramaya Super-Admin Portal**:
  * Halaman persetujuan STR/SIP dokter baru.
  * Statistik kumulatif booking bulanan/harian dalam bentuk grafik interaktif.
  * Manajemen integrasi gateway token.
* **Doctor Portal Interface (niramaya.incodepanel.com/doctor)**:
  * Kalender antrean pasien harian untuk masing-masing dokter.
  * Form input rekam medis digital sederhana (*digital medical record*) saat pasien datang berkonsultasi.

---

## 📅 Fase 5: Pengujian Skala Besar & Peluncuran (Minggu 9)
Memastikan sistem dapat melayani ribuan transaksi tanpa hambatan.

* **Load Testing (Simulasi Trafik)**:
  * Gunakan k6 load testing untuk menyimulasikan 10.000+ request booking bersamaan guna mematikan kinerja database RLS dan antrean WhatsApp.
* **Security & Vulnerability Audit**:
  * Lakukan pengujian celah keamanan enkripsi data pasien dan integritas sesi otentikasi multi-tenant.
* **Deployment ke Cloudflare Pages & Workers**:
  * Luncurkan sistem ke server produksi Cloudflare untuk performa akses global berkecepatan tinggi.
