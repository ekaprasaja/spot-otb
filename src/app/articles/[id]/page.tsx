import ArticleClient from "./ArticleClient";
import { Bone, Activity, Zap, Stethoscope } from "lucide-react";
import React from "react";

const articlesData: Record<string, any> = {
  "1": {
    title: "Panduan Lengkap Postur Tubuh WfH: Cara Menghindari Nyeri Punggung Kronis",
    category: "Gaya Hidup",
    date: "6 Mei 2026",
    readTime: "8 menit",
    author: "Tim Medis Nama Dokter",
    image: "/images/articles/posture.webp",
    content: `
      <p class="mb-6 leading-relaxed">Bekerja dari rumah (Work from Home) telah menjadi standar baru bagi jutaan profesional di Indonesia. Namun, transisi ini membawa tantangan kesehatan baru, terutama terkait kesehatan muskuloskeletal. Tanpa peralatan kantor yang ergonomis, banyak dari kita bekerja di sofa, tempat tidur, atau meja makan yang tidak dirancang untuk penggunaan jangka panjang.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Dampak Buruk Postur Statis pada Tulang Belakang</h2>
      <p class="mb-6 leading-relaxed">Tulang belakang manusia dirancang untuk bergerak, bukan untuk diam dalam satu posisi selama berjam-jam. Saat Anda membungkuk ke depan untuk melihat layar laptop, otot leher dan punggung atas Anda harus bekerja ekstra keras untuk menahan beban kepala Anda (yang beratnya sekitar 5kg). Kondisi ini sering disebut sebagai <strong>"Text Neck"</strong>.</p>
      <p class="mb-6 leading-relaxed">Beban tambahan ini, jika dibiarkan selama berbulan-bulan, dapat menyebabkan degenerasi diskus intervertebralis, ketegangan otot kronis, dan dalam kasus yang parah, herniasi nukleus pulposus (saraf kejepit).</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">5 Langkah Menciptakan Ruang Kerja Ergonomis di Rumah</h2>
      <div class="space-y-6 mb-10">
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">1. Elevasi Layar (Eye-Level Rule)</h3>
          <p class="text-sm text-foreground/70">Pastikan sepertiga bagian atas monitor sejajar dengan mata Anda. Jika menggunakan laptop, gunakan stand laptop atau tumpukan buku, lalu gunakan keyboard dan mouse eksternal.</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">2. Dukungan Lumbar (Lower Back Support)</h3>
          <p class="text-sm text-foreground/70">Gunakan kursi yang mendukung lengkungan alami punggung bawah Anda. Jika kursi Anda tidak memiliki fitur ini, letakkan bantal kecil atau gulungan handuk di area pinggang Anda.</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">3. Sudut Siku dan Pergelangan Tangan</h3>
          <p class="text-sm text-foreground/70">Atur ketinggian meja sehingga siku Anda membentuk sudut 90-100 derajat saat mengetik. Hindari menekuk pergelangan tangan ke atas atau ke bawah secara ekstrem.</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Pentingnya Dynamic Sitting (Duduk Dinamis)</h2>
      <p class="mb-6 leading-relaxed">Bahkan dengan kursi terbaik sekalipun, duduk diam terlalu lama tetaplah berisiko. Para ahli spesialis orthopedi merekomendasikan metode <strong>"Micro-breaks"</strong> di mana setiap 30 menit, Anda disarankan untuk berdiri selama 2 menit untuk melakukan peregangan ringan pada leher, bahu, dan pinggang.</p>
      
      <p class="mb-6 leading-relaxed">Gunakan alat seperti <strong>Inclinometer AI</strong> kami untuk memantau kemiringan tulang belakang Anda secara berkala. Kesadaran akan posisi tubuh adalah langkah pertama menuju pemulihan dan pencegahan cedera permanen.</p>

      <div class="bg-primary/10 border-l-4 border-primary p-6 my-10 italic text-foreground/80">
        "Kesehatan tulang belakang Anda adalah investasi jangka panjang. Jangan menunggu sampai muncul rasa nyeri untuk mulai mempedulikan postur tubuh Anda."
      </div>
    `
  },
  "2": {
    title: "Mengatasi Nyeri Punggung di Usia Produktif: Panduan Pencegahan Saraf Kejepit (HNP)",
    category: "Kesehatan Spine",
    date: "5 Mei 2026",
    readTime: "10 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/article_exercise.webp",
    content: `
      <p class="mb-6 leading-relaxed">Nyeri punggung bukan lagi masalah yang hanya dialami oleh lansia. Di era modern, semakin banyak pasien di usia produktif (30-an dan 40-an) yang datang dengan keluhan kaku pada pinggang, nyeri leher menjalar, hingga mati rasa pada kaki. Gaya hidup sedenter dan postur duduk yang salah saat bekerja menjadi pemicu utama saraf kejepit.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Mengenal Hernia Nukleus Pulposus (Saraf Kejepit)</h2>
      <p class="mb-6 leading-relaxed">Hernia Nukleus Pulposus (HNP) atau saraf kejepit terjadi ketika bantalan lunak (diskus intervertebralis) di antara ruas tulang belakang Anda menonjol keluar dan menekan serabut saraf di sekitarnya. Bantalan ini berfungsi sebagai peredam kejut; jika mengalami kerusakan, ia dapat memicu nyeri hebat dan gangguan motorik.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Gejala Awal HNP yang Wajib Diwaspadai</h2>
      <ul class="list-disc pl-6 mb-6 space-y-3 leading-relaxed">
        <li><strong>Nyeri Menjalar (Radikulopati)</strong> berupa rasa sakit yang menjalar dari pinggang bawah ke bokong hingga ujung kaki (skiatika), atau dari leher menjalar ke lengan.</li>
        <li><strong>Kesemutan dan Mati Rasa</strong> yang ditandai dengan kebas atau hilangnya sensasi sensorik di area kaki atau jari-jari tangan.</li>
        <li><strong>Kelemahan Motorik</strong> seperti kesulitan mengangkat telapak kaki saat melangkah (foot drop) atau melemahnya kekuatan genggaman tangan.</li>
        <li><strong>Nyeri saat Duduk atau Membungkuk</strong> yang bertambah hebat saat Anda mempertahankan posisi statis.</li>
      </ul>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Strategi Pelestarian Tulang Belakang (Spine Preservation)</h2>
      <p class="mb-6 leading-relaxed">Proses kerusakan bantalan tulang belakang dapat dihambat dan dicegah melalui pencegahan aktif:</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div class="p-5 bg-white/5 rounded-2xl border border-white/5">
          <h4 class="font-bold text-emerald-400 mb-2">Ergonomi Postur & Rehat</h4>
          <p class="text-xs text-foreground/60">Gunakan kursi ergonomis dengan dukungan lumbar. Terapkan aturan rehat peregangan punggung setiap 50 menit bekerja.</p>
        </div>
        <div class="p-5 bg-white/5 rounded-2xl border border-white/5">
          <h4 class="font-bold text-emerald-400 mb-2">Penguatan Otot Inti (Core Muscle)</h4>
          <p class="text-xs text-foreground/60">Lakukan latihan beban ringan, yoga, atau berenang untuk melatih otot perut dan punggung bawah yang menopang tulang belakang.</p>
        </div>
      </div>

      <p class="mb-6 leading-relaxed">Pemantauan gerak leher dan punggung menggunakan teknologi seperti <strong>Cervical & Lumbar ROM</strong> sangat membantu untuk memantau apakah rentang gerak Anda (Range of Motion) masih dalam batas aman pasca-operasi atau membutuhkan fisioterapi intensif.</p>
    `
  },
  "3": {
    title: "Kapan Harus Menjalani Operasi Saraf Kejepit? Memahami Indikasi Absolut Tindakan Bedah",
    category: "Kesehatan Spine",
    date: "4 Mei 2026",
    readTime: "9 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/articles/lumbar_compression.webp",
    content: `
      <p class="mb-6 leading-relaxed">Diagnosis saraf kejepit atau Hernia Nukleus Pulposus (HNP) sering kali membuat pasien merasa cemas dan membayangkan meja operasi. Namun, ada fakta penting yang perlu diketahui dari sudut pandang spesialis orthopedi: lebih dari 85 hingga 90 persen pasien HNP dapat pulih sepenuhnya melalui penanganan konservatif tanpa operasi, seperti fisioterapi, obat anti-inflamasi saraf, dan perbaikan postur tubuh.</p>
      <p class="mb-6 leading-relaxed">Meskipun demikian, ada kondisi-kondisi khusus di mana penundaan operasi dapat berisiko menyebabkan kerusakan saraf permanen. Kondisi ini disebut sebagai <strong>Indikasi Absolut Operasi</strong>, di mana tindakan spesialis orthopedi dekompresi mikro menjadi opsi tunggal yang wajib dilakukan segera.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">3 Indikasi Absolut Kapan Operasi HNP Menjadi Wajib</h2>
      <div class="space-y-6 mb-10">
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">1. Sindrom Cauda Equina (Cauda Equina Syndrome)</h3>
          <p class="text-sm text-foreground/70 leading-relaxed">Ini adalah kondisi darurat spesialis orthopedi utama. Terjadi ketika jepitan bantalan tulang belakang sangat besar sehingga menekan kumpulan serabut saraf di ujung bawah sumsum tulang belakang (cauda equina). Gejalanya meliputi hilangnya kontrol berkemih atau buang air besar (inkontinensia), serta mati rasa pada area selangkangan dan bokong (saddle anesthesia). Kondisi ini membutuhkan operasi dekompresi darurat dalam waktu 24-48 jam untuk mencegah kelumpuhan dan disfungsi permanen.</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">2. Defisit Motorik Progresif (Kelemahan Saraf yang Memburuk)</h3>
          <p class="text-sm text-foreground/70 leading-relaxed">Operasi harus segera dilakukan jika Anda mengalami kelemahan otot yang memburuk dari hari ke hari. Contoh klinis yang paling sering adalah <strong>foot drop</strong>, yaitu ketidakmampuan untuk mengangkat telapak kaki bagian depan saat melangkah, sehingga ujung kaki terseret ketika berjalan. Ini menandakan kerusakan serabut saraf motorik yang mengendalikan otot kaki sedang berlangsung aktif.</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">3. Nyeri Hebat yang Keras Kepala (Intractable Pain)</h3>
          <p class="text-sm text-foreground/70 leading-relaxed">Jika rasa nyeri menjalar sangat hebat, menyiksa, dan tidak menunjukkan perbaikan sedikit pun setelah menjalani terapi konservatif maksimal selama 6 hingga 12 minggu. Ketika nyeri tersebut membuat pasien tidak mampu beraktivitas dasar, tidak bisa tidur, dan merusak kualitas hidup secara ekstrem, bedah minimal invasif seperti endoskopi BESS menjadi solusi logis.</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Konsultasi yang Adil dan Terarah</h2>
      <p class="mb-6 leading-relaxed">Keputusan untuk menjalani operasi harus diambil berdasarkan pemeriksaan fisik neurologis yang teliti oleh dokter spesialis orthopedi serta konfirmasi pencitraan MRI tulang belakang. Dokter spesialis orthopedi yang etis akan selalu mengutamakan terapi tanpa operasi terlebih dahulu, kecuali jika Anda telah memenuhi salah satu dari tiga indikasi absolut di atas.</p>
    `
  },
  "4": {
    title: "Radiofrekuensi Ablasi (RFA) Saraf: Solusi Nyeri Sendi Facet Tulang Belakang Tanpa Operasi",
    category: "Kesehatan Spine",
    date: "3 Mei 2026",
    readTime: "7 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/articles/lumbar_compression.webp",
    content: `
      <p class="mb-6 leading-relaxed">Nyeri pinggang bawah kronis (chronic low back pain) sering kali disebabkan oleh peradangan pada sendi facet—yaitu sendi-sendi kecil yang menghubungkan ruas-ruas tulang belakang Anda. Ketika obat pereda nyeri dan fisioterapi tidak mempan, tindakan minimal invasif <strong>Radiofrequency Ablation (RFA)</strong> menjadi pilihan populer untuk menghentikan nyeri secara jangka panjang tanpa operasi.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Bagaimana RFA Bekerja?</h2>
      <p class="mb-6 leading-relaxed">RFA adalah prosedur rawat jalan menggunakan jarum khusus yang menyalurkan gelombang radiofrekuensi untuk memanaskan saraf sensorik kecil (medial branch nerve) yang mengirimkan sinyal nyeri dari sendi facet ke otak. Dengan memblokir sinyal nyeri ini, pasien dapat mengalami pereda nyeri yang signifikan selama 6 hingga 18 bulan.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Keuntungan Utama Prosedur RFA</h2>
      <ul class="list-disc pl-6 mb-6 space-y-3 leading-relaxed">
        <li><strong>Tanpa Sayatan Bedah:</strong> Hanya menggunakan jarum mikro dengan anestesi lokal dan bantuan C-arm Fluoroscopy untuk akurasi posisi jarum.</li>
        <li><strong>Pemulihan Cepat:</strong> Pasien umumnya dapat langsung pulang pada hari yang sama dan kembali beraktivitas normal dalam 24 jam.</li>
        <li><strong>Mengurangi Kebutuhan Obat:</strong> Membantu pasien terlepas dari ketergantungan obat pereda nyeri minum jangka panjang yang berisiko merusak lambung dan ginjal.</li>
      </ul>
    `
  },
  "5": {
    title: "Masa Depan Bedah Spine: Bagaimana AI dan Robotik Mengubah Segalanya",
    category: "Teknologi",
    date: "2 Mei 2026",
    readTime: "11 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/articles/ai_robotic_surgery.webp",
    content: `
      <p class="mb-6 leading-relaxed">Dunia spesialis orthopedi tulang belakang (Spine Surgery) sedang berada di ambang revolusi besar. Integrasi Kecerdasan Buatan (AI) dan asisten robotik bukan lagi tentang menggantikan peran dokter, melainkan memberikan "mata" dan "tangan" yang jauh lebih presisi untuk dekompresi saraf dan stabilisasi vertebra demi hasil pasien yang lebih baik.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Presisi Sub-Milimeter dalam Operasi Stabilisasi Tulang Belakang</h2>
      <p class="mb-6 leading-relaxed">Pada operasi dekompresi atau stabilisasi tulang belakang konvensional, penempatan komponen implan atau sekrup pedicle screw sangat bergantung pada pengalaman visual dokter. Dengan bantuan AI, kami dapat melakukan pemetaan 3D secara real-time. Robot tidak melakukan operasi secara mandiri, tetapi ia bertindak sebagai pembatas yang memastikan instrumen bedah hanya bergerak pada area aman di sekitar sumsum tulang belakang dengan akurasi sub-milimeter.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Analisis Data untuk Prediksi Pemulihan</h2>
      <p class="mb-6 leading-relaxed">AI juga berperan besar sebelum dan sesudah operasi. Dengan menganalisis jutaan data klinis serupa, AI dapat memprediksi risiko komplikasi pasien tertentu dan memberikan rekomendasi protokol rehabilitasi yang dipersonalisasi.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Kesimpulan: Kolaborasi Manusia dan Mesin</h2>
      <p class="mb-6 leading-relaxed">Tujuan akhir dari semua teknologi ini adalah mempercepat pemulihan pasien. Pasien yang dahulu membutuhkan waktu berminggu-minggu untuk bisa berjalan setelah operasi, kini seringkali diizinkan untuk mobilisasi dalam hitungan jam pasca-prosedur.</p>
      
      <p class="mb-6 leading-relaxed">Platform <strong>Nama Dokter</strong> adalah wujud dari visi ini, di mana setiap modul yang kami sediakan bertujuan untuk memberikan transparansi dan akurasi medis yang tertinggi bagi setiap pasien.</p>
    `
  },
  "6": {
    title: "Terapi PRP (Platelet-Rich Plasma) untuk Degenerasi Bantalan Tulang Belakang: Harapan Baru Regenerasi Sendi",
    category: "Kesehatan Spine",
    date: "1 Mei 2026",
    readTime: "9 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/spine_scan.webp",
    content: `
      <p class="mb-6 leading-relaxed">Degenerasi diskus intervertebralis (ausnya bantalan tulang belakang) merupakan penyebab utama nyeri punggung kronis pada kelompok usia produktif dan lansia. Salah satu terobosan terbaru dalam kedokteran regeneratif spesialis orthopedi tulang belakang adalah penggunaan <strong>Terapi Platelet-Rich Plasma (PRP)</strong> untuk merangsang penyembuhan alami diskus dari dalam.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Mekanisme Terapi Biologis PRP</h2>
      <p class="mb-6 leading-relaxed">Terapi PRP dilakukan dengan mengambil sampel darah pasien sendiri, kemudian memutarnya dalam mesin sentrifugasi khusus untuk memisahkan dan memekatkan plasma yang kaya akan trombosit. Plasma kaya trombosit ini mengandung konsentrasi faktor pertumbuhan (growth factors) yang sangat tinggi yang disuntikkan secara presisi ke dalam sendi facet atau diskus yang mengalami robekan mikro (annular tear).</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Manfaat & Proses Regenerasi</h2>
      <p class="mb-6 leading-relaxed">Faktor pertumbuhan dalam PRP membantu mengurangi peradangan lokal secara signifikan, memicu pembelahan sel kolagen baru, dan merangsang matriks ekstraseluler untuk meregenerasi bantalan sendi yang aus. Karena menggunakan darah pasien sendiri, prosedur ini sangat aman dengan risiko reaksi alergi atau penolakan tubuh yang hampir nol.</p>
    `
  },
  "7": {
    title: "Bebas Saraf Kejepit dengan Sayatan 5mm: Mengenal Endoskopi Tulang Belakang (BESS)",
    category: "Kesehatan Spine",
    date: "30 April 2026",
    readTime: "8 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/articles/endoscopic_spine.webp",
    content: `
      <p class="mb-6 leading-relaxed">Selama berdekade-dekade, diagnosis saraf kejepit (HNP) seringkali menakutkan bagi pasien karena bayang-bayang operasi terbuka dengan sayatan besar, nyeri pasca-operasi yang hebat, dan masa pemulihan berminggu-minggu di tempat tidur. Namun, era bedah modern telah bergeser ke arah Minimal Invasif.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Mengenal Teknologi BESS (Biportal Endoscopic Spinal Decompression)</h2>
      <p class="mb-6 leading-relaxed">Endoskopi Tulang Belakang dengan metode BESS adalah salah satu teknik bedah minimal invasif paling mutakhir di dunia untuk membebaskan jepitan saraf secara presisi. Melalui dua sayatan sangat kecil berukuran kurang dari 5 milimeter, dokter spesialis orthopedi memasukkan kamera endoskopi definisi tinggi dan instrumen mikro khusus secara bersamaan.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Mengapa BESS Lebih Unggul daripada Operasi Terbuka?</h2>
      <div class="space-y-6 mb-10">
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">1. Kerusakan Otot Sangat Minimal (Muscle-Sparing)</h3>
          <p class="text-sm text-foreground/70">Pada operasi terbuka, otot punggung harus dikelupas dari tulang belakang. Pada metode BESS, instrumen masuk membelah serat otot tanpa merusaknya, meminimalkan nyeri pasca-operasi secara drastis.</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">2. Sayatan Kecil & Kosmetik Lebih Baik</h3>
          <p class="text-sm text-foreground/70">Hanya membutuhkan 2 sayatan kecil masing-masing 5mm yang cukup ditutup dengan plester atau 1 jahitan saja.</p>
        </div>
        <div class="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 class="text-lg font-bold text-primary mb-2">3. Visualisasi HD & Presisi Tinggi</h3>
          <p class="text-sm text-foreground/70">Kamera endoskopi memberikan pembesaran gambar yang sangat jernih di layar monitor, memungkinkan dokter spesialis orthopedi mengangkat serpihan diskus yang menjepit tanpa mencederai sumsum tulang belakang.</p>
        </div>
      </div>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Mobilisasi Instan Pasca-Operasi</h2>
      <p class="mb-6 leading-relaxed">Karena perdarahan sangat minimal dan struktur tulang belakang tetap stabil, sebagian besar pasien BESS diizinkan untuk berdiri dan berjalan dalam hitungan jam pasca-operasi. Pemulihan total untuk kembali bekerja umumnya dicapai dalam beberapa hari saja.</p>
      
      <p class="mb-6 leading-relaxed">Untuk memastikan pemulihan Anda berjalan aman, pantau kemiringan tubuh Anda menggunakan <strong>Cervical & Lumbar ROM</strong> serta ikuti petunjuk latihan beban bertahap pada <strong>Weight-Bear Guide</strong> untuk melindungi fiksasi tulang belakang selama masa pemulihan awal.</p>
    `
  },
  "8": {
    title: "Mielopati Cervical: Gejala Jepitan Saraf Leher yang Mempengaruhi Ketangkasan Jari dan Keseimbangan Berjalan",
    category: "Kesehatan Spine",
    date: "29 April 2026",
    readTime: "9 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/articles/lumbar_compression.webp",
    content: `
      <p class="mb-6 leading-relaxed">Banyak pasien mengira gangguan saraf leher hanya memicu nyeri leher lokal atau pegal bahu biasa. Namun, jika jepitan terjadi pada sumsum tulang belakang pusat (spinal cord) di area leher, kondisi ini dapat berkembang menjadi <strong>Mielopati Cervical (Cervical Spondylotic Myelopathy)</strong> yang berisiko memicu kecacatan motorik berat.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Gejala Khas Mielopati Servikal</h2>
      <p class="mb-6 leading-relaxed">Berbeda dengan radikulopati biasa, mielopati servikal menekan jalur motorik pusat sehingga menimbulkan gejala yang khas:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-3 leading-relaxed">
        <li><strong>Hilangnya Ketangkasan Tangan (Clumsiness):</strong> Kesulitan melakukan aktivitas motorik halus seperti mengancingkan kemeja, menulis dengan pulpen, memegang sendok, atau sering menjatuhkan barang secara tidak sengaja.</li>
        <li><strong>Gangguan Keseimbangan Berjalan:</strong> Langkah kaki terasa goyah, kaku, berjarak lebar, atau terasa seperti melayang saat berjalan di kegelapan.</li>
        <li><strong>Refleks yang Hiperaktif:</strong> Peningkatan refleks tendon pada lengan dan tungkai kaki saat diperiksa secara klinis.</li>
      </ul>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Pentingnya Pemantauan Motorik Dini</h2>
      <p class="mb-6 leading-relaxed">Mielopati bersifat progresif dan tidak dapat membaik secara signifikan hanya dengan obat-obatan. Pemantauan ketangkasan jari menggunakan modul <strong>Dexterity Pulse</strong> secara berkala sangat direkomendasikan untuk menilai kecepatan ketukan jari tangan kiri dan kanan guna mendeteksi penurunan fungsional saraf leher sedini mungkin sebelum dianjurkan bedah fusi ACDF.</p>
    `
  },
  "9": {
    title: "Cedera Saraf Tulang Belakang (Spinal Cord Injury): Detik-Detik Emas 'Golden Hour' untuk Mencegah Kelumpuhan",
    category: "Kesehatan Spine",
    date: "28 April 2026",
    readTime: "10 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/spine_scan.webp",
    content: `
      <p class="mb-6 leading-relaxed">Kecelakaan lalu lintas, jatuh dari ketinggian, atau cedera olahraga berat dapat menyebabkan trauma hebat pada tulang belakang. Ketika ruas tulang belakang patah atau bergeser, serpihan tulang dapat menekan sumsum tulang belakang (spinal cord), pusat transmisi sinyal gerak dari otak ke seluruh tubuh. Keadaan darurat ini memerlukan penanganan medis spesialis orthopedi instan untuk mencegah kelumpuhan permanen.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Mengenal Konsep Golden Hour (Waktu Emas)</h2>
      <p class="mb-6 leading-relaxed">Dalam kedokteran darurat spesialis orthopedi, 8 jam pertama pasca-trauma tulang belakang adalah <strong>Golden Hour (Waktu Emas)</strong>. Selama jendela waktu yang sangat sempit ini, kerusakan sel saraf akibat jepitan atau pembengkakan masih bersifat reversibel (dapat dipulihkan). Jika dekompresi spesialis orthopedi terlambat dilakukan melebihi batas waktu tersebut, risiko kelumpuhan total di bawah tingkat cedera menjadi sangat tinggi dan permanen.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Langkah Pertolongan Pertama yang Krusial</h2>
      <p class="mb-6 leading-relaxed">Sebelum tim medis tiba, kesalahan penanganan korban trauma dapat memperparah cedera saraf:</p>
      <ul class="list-disc pl-6 mb-6 space-y-3 leading-relaxed">
        <li><strong>Imobilisasi Total</strong> dengan tidak pernah memindahkan atau mengubah posisi tubuh korban, terutama kepala dan leher, tanpa penyangga leher dan papan spinal.</li>
        <li><strong>Log-Roll Method</strong> jika korban terpaksa harus dimiringkan seperti saat muntah agar tidak tersedak, seluruh tubuh harus dimiringkan secara bersamaan seperti satu batang kayu bulat untuk mencegah pergeseran tulang belakang.</li>
      </ul>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Tindakan Stabilisasi Spesialis Orthopedi</h2>
      <p class="mb-6 leading-relaxed">Di rumah sakit, penanganan bedah darurat oleh dr. Nama Dokter melibatkan dekompresi mikro untuk membebaskan saraf yang terjepit serta pemasangan instrumen stabilisasi sekrup titanium untuk menyatukan kembali ruas tulang belakang yang patah. Pemulihan gerak motorik pasca-tindakan sangat bergantung pada seberapa cepat kompresi saraf dibebaskan selama Golden Hour.</p>
    `
  },
  "10": {
    title: "Terapi Injeksi Epidural Steroid (ESI): Mengatasi Peradangan Akut pada Saraf Kejepit Lumbar",
    category: "Kesehatan Spine",
    date: "27 April 2026",
    readTime: "9 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/articles/endoscopic_spine.webp",
    content: `
      <p class="mb-6 leading-relaxed">Ketika bantalan sendi menonjol parah (HNP akut) dan menekan saraf sciatica pinggang, rasa nyeri menjalar ke kaki (sciatica) bisa sangat menyiksa hingga membuat pasien tidak sanggup berdiri atau tidur. Dalam kondisi peradangan akut ini, <strong>Epidural Steroid Injection (ESI)</strong> merupakan salah satu terapi intervensi nyeri terpopuler untuk memadamkan badai inflamasi secara instan.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Bagaimana ESI Menghentikan Nyeri Saraf?</h2>
      <p class="mb-6 leading-relaxed">ESI menyalurkan obat anti-inflamasi steroid kuat dan anestesi lokal secara langsung ke dalam ruang epidural—yaitu ruang di sekitar kantong saraf spinal yang mengalami penyempitan. Berbeda dengan obat anti-inflamasi minum yang harus dicerna dan diedarkan ke seluruh tubuh, ESI bekerja tepat di titik radang saraf, sehingga menghasilkan efek dramatis dalam waktu singkat.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Peran ESI dalam Jendela Terapi Fisioterapi</h2>
      <p class="mb-6 leading-relaxed">ESI sering kali digunakan untuk meredakan nyeri hebat sementara agar pasien memiliki jendela kenyamanan yang cukup untuk memulai program fisioterapi dan latihan penguatan otot inti. Pemantauan harian progress pemulihan sensorik dan motorik menggunakan <strong>VAS & Neuro-Deficit Diary</strong> pasca-tindakan ESI sangat membantu dr. Wisnu menilai respon penyembuhan saraf Anda secara objektif.</p>
    `
  },
  "11": {
    title: "Pilihan Terapi Tanpa Operasi Saraf Kejepit: Mengapa Blok Saraf dan PLDD Menjadi Solusi Populer",
    category: "Kesehatan Spine",
    date: "26 April 2026",
    readTime: "8 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/articles/lumbar_compression.webp",
    content: `
      <p class="mb-6 leading-relaxed">Ketakutan akan operasi besar dengan bius total dan risiko kelumpuhan sering kali membuat penderita saraf kejepit (HNP) menunda pengobatan ke dokter spesialis spesialis orthopedi. Akibatnya, kondisi jepitan saraf dapat memburuk hingga memicu kerusakan motorik permanen. Padahal, teknologi medis modern saat ini menawarkan pilihan <strong>Tindakan Intervensi Nyeri Minimal Invasif (Pain Interventions)</strong> tanpa operasi besar, tanpa rawat inap, dan hanya menggunakan anestesi lokal.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">1. Selective Nerve Root Block (Injeksi Blok Saraf)</h2>
      <p class="mb-6 leading-relaxed">Blok saraf selektif adalah prosedur di mana obat anestesi lokal dikombinasikan dengan zat anti-inflamasi steroid disuntikkan secara presisi langsung ke akar saraf yang meradang akibat jepitan bantalan tulang belakang. Tindakan ini dilakukan menggunakan panduan sinar-X real-time (C-arm fluoroscopy) untuk menjamin akurasi jarum suntik mikro.</p>
      <p class="mb-6 leading-relaxed"><strong>Mengapa ini sangat efektif?</strong> Dengan menargetkan langsung pusat peradangan saraf, rasa nyeri menjalar hebat (skiatika) dapat diredakan secara instan. Blok saraf ini juga berfungsi sebagai alat diagnostik untuk memastikan akar saraf mana yang memicu keluhan pasien.</p>
      
      <div class="p-6 bg-white/5 border border-white/5 rounded-2xl mb-8">
        <h4 class="font-bold text-indigo-400 mb-2">Edukasi Kelemahan Sementara (Transient Block)</h4>
        <p class="text-xs text-foreground/60 leading-relaxed">Sangat wajar jika pasien merasakan kaki terasa tebal, kebas, atau agak lemas dalam 4 hingga 6 jam pertama pasca-injeksi. Ini adalah efek normal dari anestesi lokal pada saraf motorik yang akan hilang sepenuhnya secara alami seiring habisnya masa kerja obat bius.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">2. PLDD (Percutaneous Laser Disc Decompression)</h2>
      <p class="mb-6 leading-relaxed">PLDD adalah terapi dekompresi bantalan sendi menggunakan energi serat laser mikro. Melalui jarum kecil berukuran sekitar 1mm yang dimasukkan ke dalam pusat diskus intervertebralis (nukleus pulposus), serat laser dialirkan untuk menguapkan sebagian kecil cairan di dalam diskus.</p>
      <p class="mb-6 leading-relaxed">Penguapan ini secara drastis menurunkan tekanan intradiskal, menciptakan efek vakum yang menarik kembali tonjolan HNP yang menjepit saraf ke posisi semula. Tindakan ini hanya memakan waktu 30-45 menit dengan tingkat keberhasilan pemulihan yang sangat tinggi.</p>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Pentingnya Pemantauan Pemulihan Mandiri</h2>
      <p class="mb-6 leading-relaxed">Pasca-tindakan blok saraf atau PLDD, pasien sangat dianjurkan untuk memantau perkembangan skala nyeri secara berkala untuk mengevaluasi keberhasilan terapi. Gunakan alat <strong>VAS & Neuro-Deficit Diary</strong> kami untuk mencatat skala nyeri harian Anda, durasi jalan tanpa keluhan, serta mengonfirmasi jika ada tanda bahaya darurat.</p>
    `
  },
  "12": {
    title: "Mengenal Operasi ACDF dan MISS TLIF: Kapan Stabilisasi Tulang Belakang dengan Pen/Sekrup Diperlukan?",
    category: "Kesehatan Spine",
    date: "25 April 2026",
    readTime: "9 menit",
    author: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
    image: "/images/spine_scan.webp",
    content: `
      <p class="mb-6 leading-relaxed">Pada kasus kelainan tulang belakang yang berat—seperti ketidakstabilan ruas tulang (spondilolistesis), penyempitan kanal saraf parah (stenosis), atau kerusakan diskus parah—terapi konservatif maupun suntikan blok saraf terkadang tidak lagi memadai. Di fase ini, dokter spesialis orthopedi akan menganjurkan tindakan fusi dan stabilisasi menggunakan implan khusus untuk mengenangkan kembali arsitektur kokoh tulang belakang Anda.</p>
      
      <h2 class="text-2xl font-bold text-white mt-10 mb-6">1. ACDF (Anterior Cervical Discectomy and Fusion)</h2>
      <p class="mb-6 leading-relaxed">ACDF adalah standar emas pembedahan untuk saraf kejepit di area leher (cervical HNP/Mielopati). Operasi ini dilakukan secara mikroskopis melalui sayatan kecil di lipatan kulit depan leher. Mengapa dari depan? Jalur ini meminimalkan cedera pada otot leher belakang yang tebal dan memberikan akses langsung ke diskus leher yang rusak tanpa menekan sumsum tulang belakang.</p>
      <p class="mb-6 leading-relaxed">Dokter spesialis orthopedi akan mengangkat bantalan leher yang rusak secara menyeluruh, membebaskan jepitan sumsum saraf, lalu memasang implan penyangga (cage) untuk memfusi dua ruas tulang leher menjadi satu kesatuan yang stabil.</p>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">2. MISS TLIF (Minimally Invasive Transforaminal Lumbar Interbody Fusion)</h2>
      <p class="mb-6 leading-relaxed">MISS TLIF adalah teknologi fusi tulang belakang pinggang modern menggunakan teknik bedah minimal invasif. Dibandingkan operasi fusi terbuka tradisional yang memotong otot punggung secara luas, MISS TLIF menggunakan tabung dilator khusus berukuran milimeter untuk membelah serat otot dengan lembut.</p>
      <p class="mb-6 leading-relaxed">Melalui tabung mikro ini, bantalan sendi pinggang yang rusak diangkat, dipasang cage penyangga berisi cangkok tulang untuk menyatukan ruas sendi belakang, lalu distabilkan menggunakan sekrup pedikel kulit (percutaneous pedicle screws). Teknik ini meminimalkan perdarahan, mengurangi nyeri pasca-operasi secara dramatis, dan mempercepat mobilisasi pasien lansia.</p>

      <h2 class="text-2xl font-bold text-white mt-10 mb-6">Protokol Pemulihan Ketat: Patuhi Aturan BLT</h2>
      <p class="mb-6 leading-relaxed">Meskipun teknik spesialis orthopedi MISS TLIF dan ACDF sangat presisi, stabilitas awal implan dan proses penyatuan tulang (fusion) membutuhkan waktu beberapa minggu. Selama masa pemulihan awal ini, pasien wajib mematuhi protokol mobilitas <strong>BLT</strong>:</p>
      <ul class="list-disc pl-6 mb-6 space-y-3 leading-relaxed">
        <li><strong>No Bending:</strong> Dilarang keras membungkukkan pinggang saat mengambil barang di lantai atau saat memakai sepatu.</li>
        <li><strong>No Twisting:</strong> Dilarang meliuk atau memutar tubuh ekstrem dari satu sisi ke sisi lain secara mendadak.</li>
        <li><strong>No Heavy Lifting:</strong> Dilarang mengangkat beban berat (lebih dari 2 kg pada 6 minggu pertama).</li>
      </ul>

      <p class="mb-6 leading-relaxed">Gunakan sensor gyroskop dari <strong>Inclinometer AI (Cervical & Lumbar ROM)</strong> kami untuk mengevaluasi secara visual apakah sudut tunduk/dongak leher atau pinggang Anda berada dalam batas aman pemulihan (maksimal 20° leher untuk ACDF dan 25° pinggang untuk TLIF), serta ikuti target beban kaki pada modul <strong>Weight-Bear Guide</strong> untuk mobilisasi jalan yang aman.</p>
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
    { id: "6" },
    { id: "7" },
    { id: "8" },
    { id: "9" },
    { id: "10" },
    { id: "11" },
    { id: "12" }
  ];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const article = articlesData[params.id] || articlesData["1"];
  
  return <ArticleClient article={article} />;
}
