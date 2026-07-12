import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Syarat & Ketentuan — Portal Dokter dr. Prahesta Adi Wibowo, Sp.OT",
    description: "Syarat dan ketentuan penggunaan layanan portal digital dr. Prahesta Adi Wibowo, Sp.OT.",
  };
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
