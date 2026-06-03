import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PatientProfile {
  name: string;
  patientId: string;
  bloodType: string;
  age: number;
  gender: string;
  avatar: string;
}

interface PatientState {
  profile: PatientProfile;
  updateProfile: (profile: Partial<PatientProfile>) => void;
}

const defaultProfile: PatientProfile = {
  name: "Budi Santoso",
  patientId: "88291",
  bloodType: "O+",
  age: 42,
  gender: "Laki-laki",
  avatar: "/images/patient_avatar.webp",
};

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      }))
    }),
    {
      name: "spinecare-patient-storage",
    }
  )
);
