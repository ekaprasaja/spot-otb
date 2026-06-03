import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dr. Nama Dokter, Sp.OT, Subsp. OTB (K) — Spine & Pain Care</title>
    <link>https://spot-otb.incodepanel.com</link>
    <description>Portal wawasan medis, tips pemulihan, dan panduan latihan rehabilitasi ortopedi interaktif</description>
    <language>id-ID</language>
    <atom:link href="https://spot-otb.incodepanel.com/feed.xml" rel="self" type="application/rss+xml" />
    
    <item>
      <title>Panduan Pemulihan Pasca Operasi Cedera Tulang Belakang</title>
      <link>https://spot-otb.incodepanel.com/articles/spinal-recovery-guide</link>
      <description>Panduan lengkap latihan mobilitas awal, manajemen nyeri, dan tips menjaga postur tubuh pasca operasi tulang belakang.</description>
      <pubDate>${new Date('2026-05-28T09:00:00Z').toUTCString()}</pubDate>
      <guid>https://spot-otb.incodepanel.com/articles/spinal-recovery-guide</guid>
    </item>

    <item>
      <title>Latihan Efektif Meningkatkan Deksteritas Tangan</title>
      <link>https://spot-otb.incodepanel.com/articles/hand-dexterity-exercises</link>
      <description>Latihan motorik halus sederhana menggunakan terapi bola karet dan plastisin untuk memulihkan kekuatan jari-jemari Anda.</description>
      <pubDate>${new Date('2026-05-25T14:30:00Z').toUTCString()}</pubDate>
      <guid>https://spot-otb.incodepanel.com/articles/hand-dexterity-exercises</guid>
    </item>

    <item>
      <title>Mengenal Edema Monitor & Cara Mengatasi Pembengkakan Sendi</title>
      <link>https://spot-otb.incodepanel.com/articles/edema-management</link>
      <description>Bagaimana cara melacak tingkat pembengkakan sendi lutut dan pergelangan kaki serta penanganan pertama dengan metode R.I.C.E.</description>
      <pubDate>${new Date('2026-05-20T08:15:00Z').toUTCString()}</pubDate>
      <guid>https://spot-otb.incodepanel.com/articles/edema-management</guid>
    </item>
  </channel>
</rss>`;

  return new NextResponse(feed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=18000',
    },
  });
}
