import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import Script from "next/script";

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
  title: "SPOT-OTB | Portal Dokter Spesialis",
  description: "Portal Digital Dokter Spesialis — SPOT-OTB",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SPOT-OTB",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-inter overscroll-none">
        <ErrorBoundary>
          <AppShell>{children}</AppShell>
        </ErrorBoundary>

        {/* Incodebot AI Chat Widget */}
        {/* TODO: Ganti data-tenant-id dengan tenant ID dari dashboard.incodepanel.com */}
        <Script 
          src="/chat-widget.js?v=20260525_gdpr" 
          data-tenant-id="spot-otb"
          data-api-url="https://api.incodebot.com"
          data-site-key="0x4AAAAAADLH-shsyjvDfhj8"
          data-bottom="100px"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
