import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Artikel & Edukasi Kesehatan Tulang Belakang Klaten — dr. Prahesta Adi Wibowo, Sp.OT",
    description: "Kumpulan informasi medis, tips kesehatan, dan edukasi tulang belakang terpercaya yang ditulis oleh dr. Prahesta Adi Wibowo, Sp.OT.",
  };
}

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
