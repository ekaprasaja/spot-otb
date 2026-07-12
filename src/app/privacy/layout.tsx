import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Kebijakan Privasi — Portal Dokter dr. Prahesta Adi Wibowo, Sp.OT",
    description: "Kebijakan privasi portal digital dan asisten monitoring kesehatan dr. Prahesta Adi Wibowo, Sp.OT.",
  };
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
