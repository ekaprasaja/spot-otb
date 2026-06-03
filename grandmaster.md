# Grandmaster Architecture Guide
## Workspace: `Wisnu-Baskoro` — SpineCare & Pain Intervention AI

> **Untuk siapa dokumen ini?**  
> Dokumen ini ditulis agar siapapun — developer baru, AI agent, atau kolaborator — yang membukanya untuk pertama kali dapat langsung memahami *apa*, *mengapa*, dan *bagaimana* workspace ini bekerja secara menyeluruh, tanpa perlu bertanya lebih jauh.

---

## 1. Identitas Proyek

| Atribut | Nilai |
|---------|-------|
| **Nama Proyek** | SpineCare & Pain Intervention AI |
| **Nama Package** | `orthobrand-ai` |
| **Dokter** | dr. Wisnu Baskoro, Sp.BS, (F. N-TB), FINSS, FINPS |
| **Spesialisasi** | Bedah Saraf — Konsultan Tulang Belakang & Intervensi Nyeri |
| **Subspesialisasi** | Spine & Pain Surgeon (BESS, PLDD, RF Ablation) |
| **Klinik** | Specialist Care, Jakarta, Indonesia |
| **URL Live** | Dideploy ke Cloudflare Pages (Static Export) |
| **Tenant ID Chatbot** | `site_gkz9dc` |
| **Newsletter Tenant** | `wisnu-baskoro-k6uh8` |
| **API Central** | `https://newsletter-api.eka-prasaja.workers.dev` |
| **Chatbot API** | `https://api.incodebot.com` |
| **Framework** | Next.js 16 (App Router, Static Export) |
| **Runtime** | Browser-only — tidak ada server-side rendering aktif |

---

## 2. Filosofi & Tujuan Utama

Workspace ini adalah **white-label portal medis** untuk satu dokter spesialis. Ini bukan website company profile biasa. Ini adalah **platform edukasi & monitoring mandiri berbasis AI** yang dirancang untuk:

1. **Memberikan edukasi medis** seputar kesehatan tulang belakang & manajemen nyeri intervensi
2. **Menyediakan 7 alat diagnostik mandiri** (self-screening tools) berbasis sensor device & AI
3. **Merekam riwayat medis pasien secara lokal** (100% privasi — data tidak pernah naik ke server)
4. **Mengintegrasikan AI Chatbot** untuk menjawab pertanyaan pasien secara real-time
5. **Mengumpulkan newsletter subscriber** yang terintegrasi ke sistem SaaS Newsletter central

Desain sistem: **Surgical Precision** — estetika dark glassmorphism, warna Deep Navy + Electric Blue (`#0077FF`), tipografi Inter/Outfit. Rasanya seperti panel kontrol ruang bedah futuristik, bukan website dokter biasa.

---

## 3. Tech Stack Lengkap

```
Framework    : Next.js 16.2.4 (App Router)
Language     : TypeScript 5
Styling      : Tailwind CSS v4
Animasi      : Framer Motion 12 + Anime.js 4
State Mgmt   : Zustand v5 (dengan persist middleware → localStorage)
AI/Sensor    : MediaPipe Pose, FFmpeg.wasm, Gyroscope API, Touch Event API
PWA          : next-pwa (manifest, service worker, installable)
Icons        : Lucide React
Deploy       : Static Export (`output: "export"`) → Cloudflare Pages
Headers      : COEP + COOP required (untuk SharedArrayBuffer & FFmpeg.wasm)
Fonts        : Inter (body) + Outfit (headline) via Google Fonts
```

---

## 4. Struktur Folder & File Penting

```
Wisnu-Baskoro/
│
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── page.tsx                  # Halaman utama (Home) — Hero + Tools Grid + Newsletter
│   │   ├── layout.tsx                # Root layout: metadata, fonts, AppShell, chatbot script
│   │   ├── globals.css               # CSS global: CSS variables, keyframes, base styles
│   │   │
│   │   ├── dashboard/page.tsx        # Dashboard pasien: riwayat medis, profil, export data
│   │   ├── tools/page.tsx            # Halaman indeks semua tools
│   │   │
│   │   ├── tools/sciatica-radiculopathy/  # Tool: Sciatica & Radiculopathy Mapper
│   │   ├── tools/dermatome-tracker/       # Tool: Dermatome Pain Tracker (peta area kebas)
│   │   ├── tools/dexterity/               # Tool: Dexterity Pulse (koordinasi jari)
│   │   ├── tools/spine/                   # Tool: Cervical & Lumbar ROM Inclinometer
│   │   ├── tools/trauma/                  # Tool: Weight-Bear Guide (pembebanan pasca operasi)
│   │   ├── tools/edema/                   # Tool: Wound & CSF Tracker (evaluasi luka operasi)
│   │   └── tools/recovery/                # Tool: VAS & Neuro-Deficit Diary (nyeri harian)
│   │
│   ├── components/
│   │   ├── AppShell.tsx              # Wrapper layout: Sidebar (desktop) + BottomNav (mobile)
│   │   ├── Sidebar.tsx               # Navigasi sidebar desktop
│   │   ├── BottomNav.tsx             # Navigasi bottom tab bar mobile (native app feel)
│   │   ├── MobileHeader.tsx          # Header mobile dengan notification bell
│   │   ├── TopBar.tsx                # Top bar desktop
│   │   ├── DoctorCard.tsx            # Kartu profil dokter (nama, spesialisasi, CTA WhatsApp)
│   │   │
│   │   ├── patterns/
│   │   │   ├── DiagnosticToolGrid.tsx     # Grid card alat-alat diagnostik
│   │   │   ├── MedicalInsightScroller.tsx # Scroller artikel medis (horizontal scroll)
│   │   │   └── StatGrid.tsx               # Grid statistik (total rekam, kondisi baik, dll)
│   │   │
│   │   └── shared/
│   │       ├── AnimeBackground.tsx        # Background animasi partikel/grid (Anime.js)
│   │       ├── Magnetic.tsx               # Magnetic hover effect untuk CTA buttons
│   │       ├── SafetyNotice.tsx           # Disclaimer medis (peringatan alat edukatif)
│   │       └── ErrorBoundary.tsx          # Error boundary wrapper React
│   │
│   ├── store/
│   │   ├── useOrthoStore.ts          # Zustand: riwayat rekam medis pasien (persisted)
│   │   ├── usePatientStore.ts        # Zustand: profil pasien (nama, ID, gol darah, usia)
│   │   └── useNotificationStore.ts   # Zustand: in-app notification system
│   │
│   ├── hooks/                        # Custom React hooks (sensor access, permissions)
│   ├── lib/                          # Utility functions & helpers
│   ├── utils/                        # Helper functions (kalkulasi medis, format data)
│   └── doctor-config.ts              # Konstanta data dokter (nama, spesialisasi, WA, sosmed)
│
├── public/                           # Asset statis: gambar dokter, artikel, favicon, manifest
│
├── grandmaster.md                    # ← FILE INI — Dokumen arsitektur master
├── DESIGN.md                         # Design system token (warna, tipografi, spacing)
├── plan.md                           # Development plan (semua fase sudah selesai ✅)
├── prd.md                            # Product Requirements Document (original)
├── plan-saas.md                      # Plan integrasi SaaS lanjutan
├── prd-saas.md                       # PRD versi SaaS extended
├── skill.md                          # Skill file untuk AI agent context
├── next.config.js                    # Next.js config (static export, PWA, COEP/COOP headers)
├── package.json                      # Dependencies & scripts
└── AGENTS.md                         # Instruksi khusus untuk AI agent (wajib baca)
```

---

## 5. Halaman & Fitur Detail

### A. Halaman Utama (`/`) — `src/app/page.tsx`
**Ukuran:** 1052 baris, ~51KB

Halaman ini memiliki dua versi layout yang dirender secara kondisional:
- **Desktop (lg+):** Grid 2-kolom dengan foto dokter di kanan + HUD metrics overlay animasi, grid bento card tool, newsletter banner
- **Mobile:** Full-screen hero dengan foto dokter sebagai background + overlay konten, list card vertikal tool, newsletter form

**Komponen utama di halaman ini:**
1. `AnimeBackground` — animasi partikel/dot grid di hero section
2. `DoctorCard` — profil dokter dengan CTA konsultasi
3. `DiagnosticToolGrid` — 7 card tool yang dapat diklik
4. Newsletter form — memanggil `POST /v1/wisnu-baskoro-k6uh8/subscribe` ke API central
5. Educational modal — disclaimer medis dengan animasi

**Daftar 7 Tool (dengan route dan deskripsi klinis):**
| ID | Nama Tool | Kategori | Route |
|----|-----------|----------|-------|
| 1 | Sciatica & Radiculopathy Mapper | Spine | `/tools/sciatica-radiculopathy` |
| 2 | Dermatome Pain Tracker | Spine | `/tools/dermatome-tracker` |
| 3 | Dexterity Pulse | Neuro-Motor | `/tools/dexterity` |
| 4 | Cervical & Lumbar ROM | Spine | `/tools/spine` |
| 5 | Weight-Bear Guide | Trauma | `/tools/trauma` |
| 6 | Wound & CSF Tracker | Spine | `/tools/edema` |
| 7 | VAS & Neuro-Deficit Diary | Spine | `/tools/recovery` |

---

### B. Dashboard Pasien (`/dashboard`) — `src/app/dashboard/page.tsx`

Dashboard ini adalah **EHR (Electronic Health Record) lokal** yang sepenuhnya berjalan di browser pasien. **Tidak ada data yang dikirim ke server.**

**Fitur:**
- Tampilkan profil pasien (nama, ID, gol darah, usia, jenis kelamin)
- Edit profil via modal (tersimpan di `usePatientStore` → localStorage)
- Riwayat rekam medis dari semua tool (tersimpan di `useOrthoStore` → localStorage key: `spinecare-brand-storage`)
- StatGrid: total rekaman, jumlah kondisi normal, jumlah perlu atensi
- Export data ke **JSON** atau **CSV** (download langsung via Blob URL)
- Hapus rekaman individual atau clear semua
- Tampilkan DoctorCard + SafetyNotice di bawah

---

### C. Tools Medis

Setiap tool di `/tools/*` adalah modul independen yang:
1. **Meminta izin hardware** jika diperlukan (kamera, sensor gyroscope, touch)
2. **Melakukan kalkulasi berbasis AI atau sensor** secara lokal (tidak ada API call)
3. **Menyimpan hasil** ke `useOrthoStore` dalam format `PatientRecord`
4. **Menampilkan interpretasi klinis** (normal / warning / critical) beserta rekomendasi

**Teknologi hardware yang digunakan:**
- **MediaPipe Pose** → pelacakan joint & sudut sendi real-time via kamera
- **Device Orientation API / Gyroscope** → inclinometer tulang belakang
- **Touch Event API** → uji ketukan kecepatan jari (Dexterity Pulse)
- **FFmpeg.wasm** → analisis video gaya berjalan (frame-by-frame processing)

---

## 6. State Management (Zustand)

Tiga store Zustand, semua persisted ke `localStorage`:

### `useOrthoStore` — Riwayat Rekam Medis
- **Key localStorage:** `spinecare-brand-storage`
- **Interface `PatientRecord`:**
  ```ts
  { id, type, date, value: RecordValue, status: "normal" | "warning" | "critical", notes? }
  ```
- **Tipe `type`:** `"Spine" | "Edema" | "WeightBear" | "NeuroTrauma" | "Dexterity" | "CranialNerve" | "Recovery" | "Sciatica" | "Dermatome"`
- **Actions:** `addRecord`, `deleteRecord`, `clearRecords`

### `usePatientStore` — Profil Pasien
- **Fields:** `name`, `patientId`, `bloodType`, `age`, `gender`
- Bisa diedit via modal di halaman Dashboard

### `useNotificationStore` — Notifikasi In-App
- Notifikasi toast/bell yang muncul setelah aksi berhasil (misal: simpan profil, hasil tool critical)

---

## 7. Integrasi Eksternal

### A. Chatbot AI (Incodebot)
Dimuat via `<Script>` di `layout.tsx`:
```html
<script
  src="/chat-widget.js?v=20260525_gdpr"
  data-tenant-id="site_gkz9dc"
  data-api-url="https://api.incodebot.com"
  data-site-key="0x4AAAAAADLH-shsyjvDfhj8"
  data-bottom="100px"
/>
```
- **Chat widget** muncul di sudut kanan bawah semua halaman
- Chatbot mengetahui konteks dokter berdasarkan `tenant-id` (`site_gkz9dc`)
- RAG (Retrieval-Augmented Generation) menggunakan Cloudflare Vectorize
- Model LLM: Cloudflare Workers AI (Llama 3 / 3.1)

### B. Newsletter Subscription
- **Endpoint:** `POST https://newsletter-api.eka-prasaja.workers.dev/v1/wisnu-baskoro-k6uh8/subscribe`
- **Payload:** `{ email, referrer }`
- **Response sukses:** status 200 + konfirmasi email dikirim
- Data subscriber disimpan di `newsletter-db` (Cloudflare D1) dengan `tenant_id = "wisnu-baskoro-k6uh8"`

### C. API Central (Newsletter Worker)
Base URL: `https://newsletter-api.eka-prasaja.workers.dev`

Workspace ini menggunakan endpoint:
- `POST /v1/wisnu-baskoro-k6uh8/subscribe` — pendaftaran newsletter publik

(Semua endpoint admin lainnya dikelola melalui workspace `dashboard` — bukan di sini)

---

## 8. PWA (Progressive Web App)

Konfigurasi di `next.config.js` via `next-pwa`:
```js
const withPWA = require('next-pwa')({
  dest: 'public',          // service worker output
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});
```

**Artinya:** Aplikasi ini bisa **diinstall** di HP pasien seperti aplikasi native (ikon di homescreen, offline fallback). File `manifest.json` ada di `/public/manifest.json`.

**⚠️ Header Wajib (untuk FFmpeg.wasm):**  
`next.config.js` menambahkan header `Cross-Origin-Embedder-Policy: require-corp` dan `Cross-Origin-Opener-Policy: same-origin` secara global. Ini **wajib** agar `SharedArrayBuffer` bisa digunakan oleh FFmpeg.wasm. Tanpa header ini, tool analisis video akan crash.

---

## 9. Design System

Design system bernama **"Surgical Precision"** — dokumentasi lengkap di [`DESIGN.md`](DESIGN.md).

| Token | Nilai |
|-------|-------|
| **Primary Color** | Electric Blue `#0077FF` (alias `--color-primary`) |
| **Background** | Deep Navy `#0A0A0C` / `#10131b` |
| **Surface Card** | `rgba(255,255,255,0.03)` dengan `backdrop-blur` |
| **Font Headline** | `Outfit` (bold, tight letter-spacing) |
| **Font Body** | `Inter` (regular, legible) |
| **Border Radius Cards** | `2rem – 3rem` (sangat rounded, modern) |
| **Animation Easing** | `cubic-bezier(0.22, 1, 0.36, 1)` — smooth surgical |
| **Transition Duration** | 150ms–500ms |
| **Efek Utama** | Glassmorphism (backdrop-blur + semi-transparent borders) |

**Variabel CSS utama (di `globals.css`):**
- `--color-primary` → `#0077FF`
- `--font-inter`, `--font-outfit` → injected via Next.js font system
- `--color-foreground` → teks utama
- `bg-card` → class Tailwind untuk card surface

---

## 10. Deployment

### Stack Deploy
- **Output:** Static export (`output: "export"` di `next.config.js`)
- **Build command:** `npm run build` (= `next build --webpack`)
- **Output folder:** `/out` (bukan `/dist` — karena ini Next.js)
- **Target hosting:** Cloudflare Pages

### Prosedur Deploy Manual (WAJIB)

```bash
# 1. Build static site
cd /Users/ayah/Documents/GitHub/Wisnu-Baskoro
npm run build

# 2. Deploy ke Cloudflare Pages
npx wrangler pages deploy out --project-name=<nama-project-cloudflare>
```

> ⚠️ **JANGAN** gunakan auto-deploy Git di Cloudflare Pages. Selalu deploy manual.

### Catatan Penting Deploy
- Folder output adalah `/out`, **bukan** `/dist` (perbedaan dengan Vite)
- Verifikasi bahwa header COEP/COOP tetap aktif setelah deploy (cek via browser DevTools → Network → Response Headers)
- PWA service worker akan di-generate otomatis ke `/public` saat build

---

## 11. Konteks dalam Ekosistem SaaS Terpusat

Workspace `Wisnu-Baskoro` adalah **salah satu dari banyak white-label portal dokter** dalam ekosistem Medical SaaS yang lebih besar. Berikut posisinya:

```
Ekosistem Medical SaaS
│
├── newsletter/api              → Central API Gateway (Hono + Cloudflare Workers)
│   ├── /v1/{tenantId}/subscribe → Endpoint yang dipanggil workspace ini
│   └── Database: newsletter-db (D1 SQLite)
│
├── dashboard/                  → Super-Admin Portal
│   └── Tempat mengelola data tenant "wisnu-baskoro-k6uh8"
│
├── chatbot/                    → AI Chatbot SaaS (RAG + Vectorize)
│   └── chat-widget.js yang diembed di layout.tsx
│
└── Wisnu-Baskoro/              ← WORKSPACE INI (Client-facing portal)
    └── Tenant ID: wisnu-baskoro-k6uh8 / site_gkz9dc
```

**Data flow saat pasien menggunakan website ini:**
1. Pasien buka website → konten diambil dari file statis Cloudflare Pages
2. Chatbot dimuat → `chat-widget.js` dari API Incodebot (eksternal)
3. Pasien pakai tool → semua kalkulasi lokal di browser, hasil disimpan ke `localStorage`
4. Pasien subscribe newsletter → satu API call ke `newsletter-api.workers.dev`
5. **Tidak ada data medis** (hasil tool, profil pasien) yang dikirim ke server manapun

---

## 12. Alur Kerja Developer

### Menjalankan Lokal
```bash
cd /Users/ayah/Documents/GitHub/Wisnu-Baskoro
npm install
npm run dev
# Buka http://localhost:3000
```

> ⚠️ Tools yang menggunakan `SharedArrayBuffer` (FFmpeg.wasm) hanya bisa berjalan di HTTPS atau `localhost`. Jika port bukan 3000, pastikan header COEP/COOP aktif.

### Menambah Tool Baru
1. Buat folder baru di `src/app/tools/<nama-tool>/`
2. Buat `page.tsx` dengan komponen tool
3. Tambahkan entry ke array `tools` di `src/app/page.tsx`
4. Tambahkan entry ke grid di `src/app/tools/page.tsx`
5. Definisikan tipe `RecordValue` baru di `useOrthoStore.ts` jika diperlukan

### Mengubah Data Dokter
Edit `src/doctor-config.ts`:
```ts
export const doctorConfig = {
  name: "dr. Wisnu Baskoro, Sp.BS, ...",
  specialty: "Spesialis Bedah Saraf ...",
  clinic: "Specialist Care",
  whatsapp: "6281234567890",
  // ...
};
```
File ini diimpor di `page.tsx`, `dashboard/page.tsx`, dan komponen lainnya.

### Mengubah Warna Brand
1. Ubah nilai `--color-primary` di `globals.css`
2. Sesuaikan token di `DESIGN.md`

---

## 13. Hal Kritis yang JANGAN Diabaikan

| ⚠️ | Keterangan |
|----|-----------|
| **Header COEP/COOP** | Wajib ada untuk FFmpeg.wasm. Jika hilang, tool analisis video crash |
| **Static Export** | Tidak ada `getServerSideProps`, semua data fetch harus di client-side |
| **localStorage Data** | Semua data medis pasien hanya ada di browser user. Tidak ada backup server |
| **`/out` bukan `/dist`** | Folder build Next.js berbeda dari Vite. Gunakan `out` untuk deploy |
| **Tenant ID** | `site_gkz9dc` untuk chatbot, `wisnu-baskoro-k6uh8` untuk newsletter — keduanya hardcoded |
| **PWA Service Worker** | Di-generate ke `/public` saat build. Jangan hapus file `sw.js` dan `workbox-*.js` |
| **Newsletter API** | Endpoint public sudah terbuka tanpa auth. Rate limit dikelola di sisi Cloudflare Worker |
| **MediaPipe & FFmpeg** | Library berat (~10-30MB). Dimuat lazy hanya saat user membuka tool terkait |

---

## 14. Status Pengembangan

Berdasarkan [`plan.md`](plan.md), **semua 6 fase pengembangan sudah selesai:**

| Fase | Keterangan | Status |
|------|-----------|--------|
| 1 | Foundation: Next.js, PWA, Design System | ✅ Selesai |
| 2 | Hardware Access: Tools Dasar (LSI, Dexterity, Edema) | ✅ Selesai |
| 3 | AI Core: MediaPipe Pose, Inclinometer, Knee-Angle | ✅ Selesai |
| 4 | Complex Tools: FFmpeg.wasm, Gait Tracer, Arch Scan | ✅ Selesai |
| 5 | Data: Zustand, Dashboard, Weight-Bear Guide | ✅ Selesai |
| 6 | Launch: Branding, SEO, Animasi Final, Deploy | ✅ Selesai |

**Status saat ini:** Production-ready. Website live di Cloudflare Pages.

---

## 15. Referensi Cepat

| Kebutuhan | Lokasi |
|-----------|--------|
| Data dokter | `src/doctor-config.ts` |
| Semua halaman (routes) | `src/app/` |
| Semua komponen UI | `src/components/` |
| State management | `src/store/` |
| Token design system | `DESIGN.md` |
| Config Next.js | `next.config.js` |
| Dependencies | `package.json` |
| Instruksi AI agent | `AGENTS.md` |
| History dev plan | `plan.md` |
| API yang digunakan | `newsletter-api.eka-prasaja.workers.dev` |
| Chatbot API | `api.incodebot.com` |
| Tenant Newsletter | `wisnu-baskoro-k6uh8` |
| Tenant Chatbot | `site_gkz9dc` |
