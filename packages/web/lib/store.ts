import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MaterialDNA } from '@construction-dna/kernel';
import { migrateAddSpecUrls, needsMigration } from './migrations/add-spec-urls';

interface MaterialsStore {
  // Use Record instead of Map for JSON serialization compatibility
  materials: Record<string, MaterialDNA>;

  // Migration tracking
  _migrationsRun: string[];

  // Actions
  addMaterial: (m: MaterialDNA) => void;
  addMaterials: (ms: MaterialDNA[]) => void;
  removeMaterial: (id: string) => void;
  clearMaterials: () => void;
  updateMaterial: (id: string, updates: Partial<MaterialDNA>) => void;
  runMigrations: () => { migrated: boolean; updatedCount: number };

  // Getters
  getMaterial: (id: string) => MaterialDNA | undefined;
  getAllMaterials: () => MaterialDNA[];
  getMaterialCount: () => number;
}

export const useMaterialsStore = create<MaterialsStore>()(
  persist(
    (set, get) => ({
      materials: {},
      _migrationsRun: [],

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

      runMigrations: () => {
        const state = get();

        // Check if spec URL migration is needed
        if (!state._migrationsRun.includes('add-spec-urls-v1')) {
          if (needsMigration(state.materials)) {
            const result = migrateAddSpecUrls(state.materials);
            set({
              materials: result.materials,
              _migrationsRun: [...state._migrationsRun, 'add-spec-urls-v1'],
            });
            console.log(`[Migration] Added spec URLs to ${result.updatedCount} materials`);
            return { migrated: true, updatedCount: result.updatedCount };
          } else {
            // Mark as run even if no updates needed
            set({
              _migrationsRun: [...state._migrationsRun, 'add-spec-urls-v1'],
            });
          }
        }

        return { migrated: false, updatedCount: 0 };
      },

      getMaterial: (id) => get().materials[id],
      getAllMaterials: () => Object.values(get().materials),
      getMaterialCount: () => Object.keys(get().materials).length,
    }),
    {
      name: 'construction-dna-materials', // localStorage key
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Run migrations after store is rehydrated from localStorage
        if (state) {
          // Use setTimeout to ensure store is fully initialized
          setTimeout(() => {
            state.runMigrations();
          }, 0);
        }
      },
    }
  )
);
