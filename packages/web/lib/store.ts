import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MaterialDNA } from '@construction-dna/kernel';

interface MaterialsStore {
  // Use Record instead of Map for JSON serialization compatibility
  materials: Record<string, MaterialDNA>;

  // Actions
  addMaterial: (m: MaterialDNA) => void;
  addMaterials: (ms: MaterialDNA[]) => void;
  removeMaterial: (id: string) => void;
  clearMaterials: () => void;
  updateMaterial: (id: string, updates: Partial<MaterialDNA>) => void;

  // Getters
  getMaterial: (id: string) => MaterialDNA | undefined;
  getAllMaterials: () => MaterialDNA[];
  getMaterialCount: () => number;
}

export const useMaterialsStore = create<MaterialsStore>()(
  persist(
    (set, get) => ({
      materials: {},

      addMaterial: (m) =>
        set((state) => ({
          materials: { ...state.materials, [m.id]: m },
        })),

      addMaterials: (ms) =>
        set((state) => {
          const updated = { ...state.materials };
          ms.forEach((m) => {
            updated[m.id] = m;
          });
          return { materials: updated };
        }),

      removeMaterial: (id) =>
        set((state) => {
          const updated = { ...state.materials };
          delete updated[id];
          return { materials: updated };
        }),

      clearMaterials: () => set({ materials: {} }),

      updateMaterial: (id, updates) =>
        set((state) => {
          const existing = state.materials[id];
          if (!existing) return state;
          return {
            materials: {
              ...state.materials,
              [id]: { ...existing, ...updates },
            },
          };
        }),

      getMaterial: (id) => get().materials[id],
      getAllMaterials: () => Object.values(get().materials),
      getMaterialCount: () => Object.keys(get().materials).length,
    }),
    {
      name: 'construction-dna-materials', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
