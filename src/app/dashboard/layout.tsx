import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Dashboard Monitoring Pasien — dr. Prahesta Adi Wibowo, Sp.OT",
    description: "Layanan asisten monitoring pemulihan pasca tindakan medis secara digital oleh dr. Prahesta Adi Wibowo, Sp.OT.",
  };
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
