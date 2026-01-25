import { create } from 'zustand';
import type { MaterialDNA } from '@construction-dna/kernel';

interface MaterialsStore {
  materials: Map<string, MaterialDNA>;

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

export const useMaterialsStore = create<MaterialsStore>((set, get) => ({
  materials: new Map(),

  addMaterial: (m) =>
    set((state) => {
      const newMap = new Map(state.materials);
      newMap.set(m.id, m);
      return { materials: newMap };
    }),

  addMaterials: (ms) =>
    set((state) => {
      const newMap = new Map(state.materials);
      ms.forEach((m) => newMap.set(m.id, m));
      return { materials: newMap };
    }),

  removeMaterial: (id) =>
    set((state) => {
      const newMap = new Map(state.materials);
      newMap.delete(id);
      return { materials: newMap };
    }),

  clearMaterials: () => set({ materials: new Map() }),

  updateMaterial: (id, updates) =>
    set((state) => {
      const newMap = new Map(state.materials);
      const existing = newMap.get(id);
      if (existing) {
        newMap.set(id, { ...existing, ...updates });
      }
      return { materials: newMap };
    }),

  getMaterial: (id) => get().materials.get(id),
  getAllMaterials: () => Array.from(get().materials.values()),
  getMaterialCount: () => get().materials.size,
}));
