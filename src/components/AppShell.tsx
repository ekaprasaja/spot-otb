"use client";

import MobileHeader from "./MobileHeader";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import NotificationCenter from "./shared/NotificationCenter";
import PWAInstallPrompt from "./shared/PWAInstallPrompt";

export default function AppShell({ children }: { children: React.ReactNode }) {
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
