import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RecordValue = 
  | { totalScore: number; zone: string; answers: number[] }
  | { bodyWeight: number; percentage: number; targetWeightKg: number; painScale: number; suddenWeakness: boolean; zone: string }
  | { totalTaps: number; speedTps: number; accuracy: number; avgDelayMs: number; consistency: number; zone: string; hand: "left" | "right" }
  | { movementType: string; angleDegrees: number; painLevel: number; lockedOrSeverePain: boolean; zone: string }
  | { simulationType: string; zone: string }
  | { eyeMovementNormal: boolean; facialAsymmetryPercentage: number; speechClear: boolean; tongueDeviated: boolean; zone: string }
  | { vasPainScore: number; walkingDurationMins: number; claudicationLimitMeters: number; transientNumbnessConfirmed: boolean; zone: string }
  | { primaryLocation: string; sensationType: string; aggravatingFactor: string; painScale: number; motorWeakness: boolean; zone: string }
  | { activeDermatome: string; tappedCount: number; sensationLevel: "normal" | "hypoesthesia" | "hyperesthesia" | "anesthesia"; zone: string };

export interface PatientRecord {
  id: string;
  type: "Spine" | "Edema" | "WeightBear" | "NeuroTrauma" | "Dexterity" | "CranialNerve" | "Recovery" | "Sciatica" | "Dermatome";
  date: string;
  value: RecordValue;
  status: "normal" | "warning" | "critical";
  notes?: string;
}

interface OrthoState {
  records: PatientRecord[];
  addRecord: (record: Omit<PatientRecord, "id" | "date">) => void;
  deleteRecord: (id: string) => void;
  clearRecords: () => void;
}

export const useOrthoStore = create<OrthoState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) => set((state) => ({
        records: [
          {
            ...record,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
          },
          ...state.records,
        ],
      })),
      deleteRecord: (id) => set((state) => ({
        records: state.records.filter((r) => r.id !== id),
      })),
      clearRecords: () => set({ records: [] }),
    }),
    {
      name: "spinecare-brand-storage",
    }
  )
);
