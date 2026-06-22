import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, ChevronRight, Shield, Activity, Zap, Stethoscope } from "lucide-react";

const articlesData: Record<string, any> = {
  "1": {
    title: "Deteksi Dini Osteosarcoma: Waspadai Nyeri Tulang pada Anak dan Remaja",
    category: "Kanker Tulang",
    date: "12 Juni 2026",
    readTime: "8 menit",
    author: "dr. Prahesta Adi Wibowo, Sp.OT",
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
    author: "dr. Prahesta Adi Wibowo, Sp.OT",
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
    author: "dr. Prahesta Adi Wibowo, Sp.OT",
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
      <p class="mb-6 leading-relaxed">Selain mempertahankan ekstremitas fisik, pasien terhindar dari dampak psikologis amputasi. Fungsi motorik tungkai bawah atau lengan atas dapat dipertahaman secara optimal sehingga pasien dapat kembali berjalan dan beraktivitas secara mandiri setelah menjalani rehabilitasi medis pasca-operasi.</p>
    `
  },
  "4": {
    title: "Metastasis Tulang: Strategi Paliatif & Paliasi Nyeri untuk Mempertahankan Kualitas Hidup",
    category: "Kanker Tulang",
    date: "6 Juni 2026",
    readTime: "7 menit",
    author: "dr. Prahesta Adi Wibowo, Sp.OT",
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
    author: "dr. Prahesta Adi Wibowo, Sp.OT",
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
    author: "dr. Prahesta Adi Wibowo, Sp.OT",
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

const defaultDoctor = {
  name: "dr. Prahesta Adi Wibowo, Sp.OT, Subsp. Onk.Ort (K)",
  clinic: "Specialist Care",
  doctorId: "spot-otb"
};

function getFallbackImage(slug: string): string {
  const s = slug.toLowerCase();
  if (s.includes('osteosarcoma') || s.includes('kanker') || s.includes('tulang')) return '/images/articles/osteosarcoma.png';
  if (s.includes('sarcoma') || s.includes('sarkoma') || s.includes('jaringan-lunak')) return '/images/articles/soft_tissue_sarcoma.png';
  if (s.includes('limb-salvage') || s.includes('amputasi') || s.includes('bedah')) return '/images/articles/limb_salvage.png';
  return '/images/articles/osteosarcoma.png';
}

function replacePlaceholders(text: string) {
  if (!text) return "";
  const name = defaultDoctor.name;
  const clinic = defaultDoctor.clinic;
  
  let result = text
    .replace(/dr\. Nama Dokter, Sp\.OT, Subsp\. Onk\.Ort \(K\)/gi, name)
    .replace(/dr\. Nama Dokter, Sp\.OT, Subsp\. OTB \(K\)/gi, name)
    .replace(/dr\. Nama Dokter/gi, name)
    .replace(/Nama Dokter/gi, name);

  return result
    .replace(/Wisnu SpineCare/gi, clinic)
    .replace(/wisnubaskoro\.id/gi, "prahesta.id");
}

async function fetchArticleData(slug: string) {
  if (articlesData[slug]) {
    return articlesData[slug];
  }

  try {
    const tenantId = defaultDoctor.doctorId;
    const cfRes = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles/${slug}`);
    if (cfRes.ok) {
      const matched = await cfRes.json();
      if (matched && !matched.error) {
        return {
          id: matched.slug || matched.id,
          title: matched.title,
          date: new Date(matched.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          category: "EDUKASI",
          image: matched.cover_image || getFallbackImage(matched.slug || matched.id || ""),
          content: matched.content || matched.excerpt || '',
          author: 'Tim Medis',
          readTime: '5 menit'
        };
      }
    }

    const cfListRes = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles`);
    if (cfListRes.ok) {
      const data = await cfListRes.json();
      if (data?.articles && Array.isArray(data.articles)) {
        const matchedFromList = data.articles.find((art: any) => (art.slug === slug || String(art.id) === String(slug)));
        if (matchedFromList) {
          const slugToFetch = matchedFromList.slug || matchedFromList.id;
          const cfDetailRes = await fetch(`https://newsletter-api.eka-prasaja.workers.dev/v1/${tenantId}/articles/${slugToFetch}`);
          if (cfDetailRes.ok) {
            const matched = await cfDetailRes.json();
            if (matched && !matched.error) {
              return {
                id: matched.slug || matched.id,
                title: matched.title,
                date: new Date(matched.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                category: "EDUKASI",
                image: matched.cover_image || getFallbackImage(matched.slug || matched.id || ""),
                content: matched.content || matched.excerpt || '',
                author: 'Tim Medis',
                readTime: '5 menit'
              };
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error fetching article in server component:", err);
  }

  return articlesData["1"];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const article = await fetchArticleData(params.slug);
  const displayTitle = replacePlaceholders(article.title);

  return {
    title: `${displayTitle} — dr. Prahesta Adi Wibowo`,
    description: replacePlaceholders(article.title) + " - Dapatkan informasi kesehatan tumor dan kanker tulang langsung dari dr. Prahesta Adi Wibowo, Sp.OT.",
    alternates: {
      canonical: `https://prahesta.id/articles/${params.slug}`,
    }
  };
}

export default async function ArticleDetailPage(props: PageProps) {
  const params = await props.params;
  const article = await fetchArticleData(params.slug);
  
  const displayTitle = replacePlaceholders(article.title);
  const displayAuthor = defaultDoctor.name;
  const displayContent = replacePlaceholders(article.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": displayTitle,
    "image": [
      article.image.startsWith("http") ? article.image : `https://prahesta.id${article.image}`
    ],
    "datePublished": "2026-06-22T10:00:00+07:00",
    "author": [{
      "@type": "Person",
      "name": displayAuthor,
      "url": "https://prahesta.id"
    }],
    "publisher": {
      "@type": "Physician",
      "name": "dr. Prahesta Adi Wibowo, Sp.OT",
      "logo": {
        "@type": "ImageObject",
        "url": "https://prahesta.id/images/doctor_profile.webp"
      }
    },
    "description": displayTitle
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#0A0A0B]">
        {/* Article Hero */}
        <div className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
          <img 
            src={article.image || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=60&w=400"} 
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent" />
          
          <div className="absolute top-8 left-5 md:left-12 hidden md:block">
            <Link href="/articles" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/70 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <article className="px-5 md:px-12 -mt-20 relative z-10 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-white/5 rounded-[3rem] p-8 md:p-16 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="px-4 py-2 bg-primary/15 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/10">
                  {article.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-outfit font-bold text-white mb-8 leading-tight">
                {displayTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-6 mb-12 py-6 border-y border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {displayAuthor?.charAt(0) || "T"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{displayAuthor || "Tim Medis"}</p>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-tighter">Dokter Spesialis</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/5 hidden md:block" />
                <div className="flex items-center gap-2 text-xs font-bold text-foreground/40">
                  <Calendar className="w-4 h-4 text-primary" />
                  {article.date}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-foreground/40">
                  <Clock className="w-4 h-4 text-primary" />
                  {article.readTime || "5 menit"} Bacaan
                </div>
                <div className="flex gap-2 ml-auto">
                  <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:text-primary transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div 
                className="prose prose-invert prose-lg max-w-none text-foreground/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />

              {/* Surgeon Note */}
              <div className="mt-16 p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center">
                <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Pesan dari Spesialis</h4>
                  <p className="text-sm text-foreground/50 leading-relaxed italic">
                    "Artikel ini bertujuan untuk edukasi umum. Jika Anda mengalami keluhan yang persisten, silakan gunakan alat diagnostik kami atau segera jadwalkan konsultasi klinis untuk penanganan yang tepat."
                  </p>
                </div>
              </div>
            </div>

            {/* Related Articles CTA */}
            <div className="mt-20 flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold text-white mb-8">Lanjutkan Membaca</h3>
              <Link href="/articles" className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white hover:bg-white/10 transition-all">
                Kembali ke Semua Artikel <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
