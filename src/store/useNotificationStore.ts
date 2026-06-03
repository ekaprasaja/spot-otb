import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: "success" | "warning" | "info" | "critical";
  read: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  isPanelOpen: boolean;
  addNotification: (title: string, content: string, category: NotificationItem["category"]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  togglePanel: () => void;
  setPanelOpen: (isOpen: boolean) => void;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Skrining Jepitan Saraf Berhasil",
    content: "Uji Sciatica & Radiculopathy Mapper Anda berhasil disimpan dengan status sensorik-motorik stabil normal.",
    date: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
    category: "success",
    read: false,
  },
  {
    id: "notif-2",
    title: "Tips Pemulihan Leher & Spine",
    content: "Hindari posisi leher statis menunduk lebih dari 30 menit. Lakukan peregangan peregangan servikal aktif secara lembut.",
    date: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
    category: "info",
    read: false,
  },
  {
    id: "notif-3",
    title: "Latihan Spine ROM Terdeteksi Aman",
    content: "Kemiringan Cervical Flexion stabil pada 38 derajat (Zona Hijau). Kedudukan sekrup titanium pen penyangga aman.",
    date: new Date(Date.now() - 1 * 86400000).toISOString(), // 1 day ago
    category: "success",
    read: true,
  },
  {
    id: "notif-4",
    title: "Wound and CSF Tracker Aktif",
    content: "Pemantauan visual stateless perban pasca-operasi siap digunakan secara berkala untuk menjaga kebersihan luka.",
    date: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    category: "info",
    read: true,
  }
];

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: initialNotifications,
      isPanelOpen: false,
      addNotification: (title, content, category) => set((state) => ({
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title,
            content,
            date: new Date().toISOString(),
            category,
            read: false,
          },
          ...state.notifications
        ]
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
      })),
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      })),
      clearAll: () => set({ notifications: [] }),
      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setPanelOpen: (isOpen) => set({ isPanelOpen: isOpen })
    }),
    {
      name: "spinecare-notification-storage",
    }
  )
);
