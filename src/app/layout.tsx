import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { DoctorConfigProvider } from "@/context/DoctorConfigContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0A0A0C",
};

export const metadata: Metadata = {
  title: "Dokter Tulang Belakang Klaten | dr. Prahesta Adi Wibowo, Sp.OT",
  description: "Konsultasi dr. Prahesta Adi Wibowo, Sp.OT, spesialis ortopedi tulang belakang di RSUP Soeradji Tirtonegoro Klaten.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <head>
        <meta charSet="utf-8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.ready.then(function(reg) {
                    reg.update();
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-inter overscroll-none">
        <ErrorBoundary>
          <DoctorConfigProvider>
            <AppShell>{children}</AppShell>
          </DoctorConfigProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
