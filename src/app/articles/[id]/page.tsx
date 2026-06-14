import ArticleClient from "./ArticleClient";
import { Bone, Activity, Zap, Stethoscope } from "lucide-react";
import React from "react";

const articlesData: Record<string, any> = {
  "1": {
    title: "Deteksi Dini Osteosarcoma: Waspadai Nyeri Tulang pada Anak dan Remaja",
    category: "Kanker Tulang",
    date: "12 Juni 2026",
    readTime: "8 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/osteosarcoma.png",
    content: `
      <p class="mb-6 leading-relaxed">Osteosarcoma adalah jenis kanker tulang primer ganas yang paling sering menyerang anak-anak dan remaja di usia pertumbuhan aktif (10-20 tahun). Lokasi yang paling sering terkena adalah area sekitar lutut (femur distal dan tibia proksimal) serta lengan atas (humerus proksimal).</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Gejala Klinis yang Wajib Diwaspadai</h2>
      <p class="mb-6 leading-relaxed">Sering kali, gejala awal osteosarcoma dianggap remeh sebagai cedera olahraga ringan atau "growing pains" (nyeri pertumbuhan). Perhatikan tanda-tanda berikut:</p>
      <div class="space-y-6 mb-10">
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">1. Nyeri Tulang Persisten & Non-Traumatis</h3>
          <p class="text-sm text-foreground/70">Rasa nyeri di tulang yang dirasakan terus-menerus, memburuk di malam hari saat beristirahat, dan tidak kunjung hilang meskipun sudah diberi obat pereda nyeri biasa.</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">2. Pembengkakan atau Benjolan</h3>
          <p class="text-sm text-foreground/70">Munculnya benjolan yang teraba keras, terasa hangat, dan bertambah besar secara progresif dalam hitungan minggu atau bulan.</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">3. Keterbatasan Gerak & Pincang</h3>
          <p class="text-sm text-foreground/70">Jika tumor berada di dekat sendi lutut, pasien akan mengalami kesulitan menekuk lutut dan berjalan pincang tanpa adanya riwayat trauma berat.</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Pentingnya Diagnosis Cepat (Rontgen Sederhana)</h2>
      <p class="mb-6 leading-relaxed">Langkah awal yang sangat sederhana namun menentukan adalah melakukan foto Rontgen (X-Ray) pada area yang nyeri. Tanda-tanda radiologis khas seperti "Codman triangle" atau gambaran "sunburst appearance" pada tulang dapat segera mengarahkan kecurigaan ke arah osteosarcoma untuk kemudian dirujuk ke subspesialis onkologi ortopedi guna biopsi dan pemeriksaan MRI/CT Scan.</p>
    `
  },
  "2": {
    title: "Sarkoma Jaringan Lunak: Mengapa Jalur Biopsi yang Benar Sangat Menentukan",
    category: "Tumor Jaringan Lunak",
    date: "10 Juni 2026",
    readTime: "10 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/soft_tissue_sarcoma.png",
    content: `
      <p class="mb-6 leading-relaxed">Sarkoma jaringan lunak (Soft Tissue Sarcoma) adalah kanker langka yang tumbuh di jaringan penyokong tubuh, seperti otot, lemak, tendon, pembuluh darah, dan jaringan saraf. Salah satu tantangan terbesar dalam penanganan tumor ini adalah melakukan biopsi awal dengan teknik dan jalur yang benar.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Apa itu Biopsi dan Mengapa Jalur Biopsi Sangat Vital?</h2>
      <p class="mb-6 leading-relaxed">Biopsi adalah pengambilan sampel jaringan tumor untuk diperiksa di laboratorium guna memastikan jenis tumor (jinak atau ganas) serta derajat keganasannya (grade). Jalur jarum atau sayatan biopsi akan terkontaminasi oleh sel tumor ganas. Oleh karena itu, jalur biopsi ini harus dibuang/dieksisi secara utuh bersama tumor saat operasi definitif.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Dampak Buruk Kesalahan Biopsi</h2>
      <ul class="list-disc pl-6 mb-6 space-y-3 leading-relaxed">
        <li><strong>Kontaminasi Jaringan Sehat:</strong> Jika biopsi dilakukan melalui jalur yang tidak searah dengan rencana operasi eksisi, sel kanker akan menyebar ke area sehat di sekitarnya.</li>
        <li><strong>Gagalnya Limb Salvage:</strong> Kesalahan penempatan sayatan biopsi dapat memaksa dokter melakukan amputasi demi kebersihan margin tumor, padahal awalnya tungkai pasien masih bisa diselamatkan.</li>
        <li><strong>Peningkatan Risiko Kekambuhan:</strong> Sisa-sisa sel tumor pada jalur biopsi yang tidak terangkat dapat memicu kekambuhan lokal pasca-operasi.</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Rekomendasi Terbaik</h2>
      <p class="mb-6 leading-relaxed">Setiap benjolan dalam otot yang berukuran lebih dari 5 cm, terletak jauh di dalam (deep-seated), atau membesar dengan cepat harus dicurigai sebagai sarkoma. Jangan lakukan tindakan biopsi atau pembuangan tumor (lumpektomi) di fasilitas non-spesialis sebelum berkonsultasi dengan Konsultan Onkologi Ortopedi.</p>
    `
  },
  "3": {
    title: "Limb Salvage Surgery: Menyelamatkan Ekstremitas Pasien Kanker Tulang Tanpa Amputasi",
    category: "Teknologi Bedah",
    date: "8 Juni 2026",
    readTime: "9 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/limb_salvage.png",
    content: `
      <p class="mb-6 leading-relaxed">Amputasi bukan lagi satu-satunya jalan keluar bagi penderita kanker tulang ganas. Dengan kemajuan teknik bedah onkologi ortopedi dan teknologi implan medis, kini lebih dari 90% pasien kanker tulang dapat menjalani prosedur **Limb Salvage Surgery (Limb Sparing Surgery)**.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Bagaimana Prosedur Limb Salvage Bekerja?</h2>
      <p class="mb-6 leading-relaxed">Prosedur ini terdiri dari dua tahap utama yang dilakukan dalam satu operasi:</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div class="p-5 bg-white/5 rounded-2xl border border-white/5">
          <h4 class="font-bold text-rose-400 mb-2">1. Reseksi Tumor dengan Margin Bersih</h4>
          <p class="text-xs text-foreground/60">Pengangkatan seluruh bagian tulang yang terkena kanker secara utuh beserta margin jaringan sehat di sekelilingnya untuk memastikan tidak ada sel kanker yang tertinggal.</p>
        </div>
        <div class="p-5 bg-white/5 rounded-2xl border border-white/5">
          <h4 class="font-bold text-rose-400 mb-2">2. Rekonstruksi & Megaprosthesis</h4>
          <p class="text-xs text-foreground/60">Mengganti bagian tulang dan sendi yang dibuang menggunakan implan logam khusus berukuran besar (megaprosthesis) atau cangkok tulang (allograft) agar ekstremitas tetap berfungsi untuk bergerak dan menumpu beban.</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Keuntungan Utama Limb Salvage</h2>
      <p class="mb-6 leading-relaxed">Selain mempertahankan ekstremitas fisik, pasien terhindar dari dampak psikologis amputasi. Fungsi motorik tungkai bawah atau lengan atas dapat dipertahankan secara optimal sehingga pasien dapat kembali berjalan dan beraktivitas secara mandiri setelah menjalani rehabilitasi medis pasca-operasi.</p>
    `
  },
  "4": {
    title: "Metastasis Tulang: Strategi Paliatif & Paliasi Nyeri untuk Mempertahankan Kualitas Hidup",
    category: "Kanker Tulang",
    date: "6 Juni 2026",
    readTime: "7 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/osteosarcoma.png",
    content: `
      <p class="mb-6 leading-relaxed">Metastasis tulang adalah kondisi ketika sel kanker dari organ lain (paling sering dari kanker payudara, paru-paru, prostat, ginjal, atau tiroid) menyebar melalui aliran darah dan tumbuh di tulang belakang, panggul, atau tulang panjang ekstremitas.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Komplikasi Skeletal Related Events (SRE)</h2>
      <p class="mb-6 leading-relaxed">Tumbuhnya tumor di tulang menyebabkan pengeroposan struktur kekuatan mekanis tulang, memicu komplikasi berupa:</p>
      <ul class="list-disc pl-6 mb-6 space-y-3 leading-relaxed">
        <li><strong>Nyeri Tulang Hebat:</strong> Akibat peregangan periosteum dan pelepasan mediator inflamasi oleh tumor.</li>
        <li><strong>Fraktur Patologis:</strong> Patah tulang spontan akibat aktivitas normal sehari-hari karena struktur tulang yang sudah sangat rapuh.</li>
        <li><strong>Kompresi Sumsum Tulang Belakang:</strong> Jika terjadi di tulang belakang, dapat menekan saraf pusat dan menyebabkan kelumpuhan kedua tungkai.</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Peran Bedah Onkologi Ortopedi Paliatif</h2>
      <p class="mb-6 leading-relaxed">Tujuan utama bedah pada metastasis tulang bukanlah untuk menyembuhkan kanker primer, melainkan untuk paliasi nyeri dan stabilisasi struktur. Dengan memasang pen/sekrup titanium internal (stabilisasi) atau menyuntikkan semen tulang khusus (cementoplasty), pasien terhindar dari patah tulang, rasa nyeri berkurang drastis, dan mereka dapat tetap duduk atau berjalan dengan nyaman di sisa masa hidupnya.</p>
    `
  },
  "5": {
    title: "Penanganan Cedera Tulang Kompleks & Fraktur Patologis Akibat Tumor",
    category: "Cedera Tulang",
    date: "4 Juni 2026",
    readTime: "11 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/limb_salvage.png",
    content: `
      <p class="mb-6 leading-relaxed">Fraktur patologis adalah patah tulang yang terjadi pada tulang yang telah mengalami kelemahan akibat penyakit sistemik atau lokal, paling sering disebabkan oleh tumor tulang primer atau metastasis kanker.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Tantangan Penanganan Fraktur Patologis</h2>
      <p class="mb-6 leading-relaxed">Berbeda dengan patah tulang trauma biasa (seperti akibat jatuh atau kecelakaan), fraktur patologis tidak dapat menyembuh secara alami karena adanya sel tumor yang merusak proses remodeling tulang normal. Penanganan konvensional dengan gips saja tidak akan berhasil.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Protokol Penanganan Modern</h2>
      <p class="mb-6 leading-relaxed">Pendekatan komprehensif oleh spesialis ortopedi mencakup pengangkatan tumor secara lokal, dilanjutkan fiksasi internal yang kokoh menggunakan pen khusus (nailing/plating) yang diperkuat dengan bone cement (PMMA) untuk mengisi kekosongan tulang yang hancur. Kombinasi ini memberikan kekuatan mekanik instan sehingga pasien bisa segera bergerak bebas dari rasa nyeri tanpa menunggu tulang menyambung secara biologis.</p>
    `
  },
  "6": {
    title: "Mengenal Benigna Bone Tumor: Jenis-jenis Tumor Tulang Jinak yang Sering Ditemui",
    category: "Tumor Jaringan Lunak",
    date: "2 Juni 2026",
    readTime: "9 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. Onk.Ort (K)",
    image: "/images/articles/soft_tissue_sarcoma.png",
    content: `
      <p class="mb-6 leading-relaxed">Tidak semua benjolan atau lesi pada tulang bersifat ganas (kanker). Sebagian besar tumor tulang yang terdeteksi sebenarnya bersifat jinak (Benign). Meskipun jinak dan tidak menyebar ke organ lain, tumor tulang jinak tetap memerlukan penanganan yang tepat agar tidak merusak struktur tulang lokal.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Beberapa Jenis Tumor Tulang Jinak yang Umum</h2>
      <ul class="list-disc pl-6 mb-6 space-y-3 leading-relaxed">
        <li><strong>Osteochondroma:</strong> Tumor jinak berupa tonjolan tulang rawan yang sering tumbuh di dekat lempeng pertumbuhan tulang panjang di sekitar lutut atau bahu.</li>
        <li><strong>Giant Cell Tumor (GCT):</strong> Tumor jinak yang agresif secara lokal, sering tumbuh di ujung tulang dekat sendi pada usia dewasa muda (20-40 tahun), yang dapat menghancurkan tulang di sekitarnya secara cepat.</li>
        <li><strong>Kista Tulang (Simple/Aneurysmal Bone Cyst):</strong> Rongga berisi cairan di dalam tulang yang sering ditemukan pada anak-anak dan dapat menyebabkan tulang menjadi rapuh dan rentan patah.</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Kapan Tindakan Operasi Diperlukan?</h2>
      <p class="mb-6 leading-relaxed">Tumor jinak yang kecil dan tidak bergejala sering kali hanya memerlukan observasi berkala (watchful waiting). Namun, jika tumor menyebabkan nyeri hebat, mengganggu fungsi sendi, berukuran sangat besar sehingga berisiko memicu patah tulang patologis, atau memiliki potensi transformasi ganas, maka tindakan operasi berupa kuretase (pengerokan tumor) dan pengisian rongga tulang (bone grafting/bone cement) sangat disarankan.</p>
    `
  }
};

export function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" }
  ];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const article = articlesData[params.id] || articlesData["1"];
  
  return <ArticleClient article={article} />;
}
