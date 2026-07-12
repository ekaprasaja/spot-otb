import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Kalkulator Medis & Skrining Mandiri Tulang Belakang — dr. Prahesta Adi Wibowo, Sp.OT",
    description: "Gunakan alat kesehatan digital dan kalkulator medis saraf & tulang belakang terpercaya dari dr. Prahesta Adi Wibowo, Sp.OT.",
  };
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
