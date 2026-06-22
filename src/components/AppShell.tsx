"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import MobileHeader from "./MobileHeader";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import NotificationCenter from "./shared/NotificationCenter";
import PWAInstallPrompt from "./shared/PWAInstallPrompt";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      let canonicalUrl = `https://prahesta.id${pathname}`;
      
      // Dynamic article route is handled explicitly by its Server Component metadata
      if (!pathname.startsWith("/articles/")) {
        let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
        if (!link) {
          link = document.createElement("link");
          link.setAttribute("rel", "canonical");
          document.head.appendChild(link);
        }
        link.setAttribute("href", canonicalUrl);
      }
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Global PWA Install Dialog */}
      <PWAInstallPrompt />
      {/* Global Notifications Drawer */}
      <NotificationCenter />
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Desktop TopBar */}
        <TopBar />

        {/* Mobile Header */}
        <div className="md:hidden">
          <MobileHeader />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0 relative">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
