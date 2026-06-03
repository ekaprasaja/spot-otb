"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CVItem {
  year: string;
  title: string;
  institution: string;
}

export interface DoctorConfig {
  id: string;
  doctorId: string;
  name: string;
  specialty: string;
  clinic: string;
  location: string;
  whatsapp: string;
  image: string;
  bio: string;
  accentColor: string;
  chatbotToken: string;
  wordpressApiUrl: string;
  wordpressCategoryFilter: string;
  cvTimeline: CVItem[];
  whitelabelType?: string;
}

const DoctorConfigContext = createContext<DoctorConfig | null>(null);

export function DoctorConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DoctorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function resolveConfig() {
      try {
        const hostname = window.location.hostname;
        const res = await fetch(
          `https://newsletter-api.eka-prasaja.workers.dev/v1/tenant/resolve?hostname=${hostname}`
        );

        // Tenant tidak ditemukan di database
        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const rawData = await res.json();

        // Normalize fields – support both camelCase & snake_case dari API D1
        const normalizedConfig: DoctorConfig = {
          id: rawData.id || hostname.split(".")[0],
          doctorId: rawData.id || hostname.split(".")[0],
          name: rawData.doctorName || rawData.doctor_name || rawData.name || "",
          specialty: rawData.doctorSpecialty || rawData.doctor_specialty || rawData.specialty || "",
          clinic: rawData.clinicName || rawData.clinic_name || rawData.clinic || "",
          location: rawData.clinicAddress || rawData.clinic_address || rawData.location || "",
          whatsapp: rawData.whatsapp || rawData.reply_to || "",
          image: rawData.logoUrl || rawData.logo_url || rawData.image || "/images/doctor_profile.webp",
          bio: rawData.doctorBio || rawData.doctor_bio || rawData.bio || "",
          accentColor: rawData.accentColor || rawData.accent_color || "#3b82f6", // Default primary blue
          chatbotToken: rawData.chatbotToken || rawData.chatbot_token || "",
          wordpressApiUrl: rawData.wordpressApiUrl || rawData.wordpress_api_url || "",
          wordpressCategoryFilter: rawData.wordpressCategoryFilter || rawData.wordpress_category_filter || "",
          cvTimeline: [],
          whitelabelType: rawData.whitelabelType || "spog",
        };

        // 1. Inject Dynamic CSS accent color
        if (normalizedConfig.accentColor) {
          document.documentElement.style.setProperty("--primary", normalizedConfig.accentColor);
        }

        // 2. Parse CV Timeline JSON safely
        try {
          const cvJson = rawData.doctorCvJson || rawData.doctor_cv_json || "[]";
          normalizedConfig.cvTimeline = typeof cvJson === "string" ? JSON.parse(cvJson) : cvJson;
        } catch (e) {
          normalizedConfig.cvTimeline = [];
        }

        // 3. Inject Chatbot Widget secara dinamis (menggunakan script chat-widget.js)
        if (normalizedConfig.chatbotToken) {
          const existingScript = document.getElementById("incodebot-chat-script");
          if (existingScript) existingScript.remove();

          const script = document.createElement("script");
          script.id = "incodebot-chat-script";
          script.src = "/chat-widget.js?v=20260525_gdpr";
          script.defer = true;
          script.setAttribute("data-tenant-id", normalizedConfig.chatbotToken);
          script.setAttribute("data-api-url", "https://api.incodebot.com");
          script.setAttribute("data-bottom", "100px");
          document.body.appendChild(script);
        }

        setConfig(normalizedConfig);
      } catch (e) {
        console.error("Gagal memuat konfigurasi dokter dari server:", e);
        // Fallback saat koneksi offline / gagal
        const hostname = window.location.hostname;
        setConfig({
          id: hostname.split(".")[0] || "unknown",
          doctorId: hostname.split(".")[0] || "unknown",
          name: "dr. Nama Dokter, Sp.OT, Subsp. OTB (K)",
          specialty: "Spesialis Orthopedi & Traumatologi, Konsultan Tulang Belakang (Spine Surgeon)",
          clinic: "Spine & Pain Clinic",
          location: "Kota, Indonesia",
          whatsapp: "62812345678",
          image: "/images/doctor_profile.webp",
          bio: "Spesialis Orthopedi & Traumatologi — Konsultan Bedah Tulang Belakang & Intervensi Nyeri.",
          accentColor: "#3b82f6",
          chatbotToken: "spot-otb",
          wordpressApiUrl: "",
          wordpressCategoryFilter: "",
          cvTimeline: [],
          whitelabelType: "spot-otb",
        });
      } finally {
        setLoading(false);
      }
    }

    resolveConfig();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Memuat portal kesehatan Anda...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-amber-400">⚠️</span>
          </div>
          <h2 className="text-xl font-black text-white mb-2">Domain Belum Terdaftar</h2>
          <p className="text-sm text-white/50 leading-relaxed mb-6">
            Domain <code className="text-amber-400 font-mono">{window.location.hostname}</code> belum terdaftar di sistem.
            Silakan daftarkan melalui dashboard admin.
          </p>
          <a
            href="https://dashboard.incodepanel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all"
          >
            Daftarkan Domain
          </a>
        </div>
      </div>
    );
  }

  return (
    <DoctorConfigContext.Provider value={config}>
      {children}
    </DoctorConfigContext.Provider>
  );
}

export function useDoctorConfig() {
  const context = useContext(DoctorConfigContext);
  if (!context) {
    throw new Error("useDoctorConfig must be used within a DoctorConfigProvider");
  }
  return context;
}
