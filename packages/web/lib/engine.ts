import { ConstructionDNAEngine } from '@construction-dna/core';

// Singleton instance of the DNA engine
let engineInstance: ConstructionDNAEngine | null = null;

export function getEngine(): ConstructionDNAEngine {
  if (!engineInstance) {
    engineInstance = new ConstructionDNAEngine({
      // Use memory storage for now - can switch to file or database later
      validateOnWrite: false,
      autoRebuildTaxonomy: true,
    });
  }
  return engineInstance;
}

export const engine = getEngine();
