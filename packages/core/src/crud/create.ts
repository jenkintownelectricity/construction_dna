/**
 * DNA CREATE OPERATIONS
 */

import type { MaterialDNA } from '@construction-dna/kernel';
import {
  generateTaxonomyCode,
  validateMaterialDNA,
  calculateCompleteness,
} from '@construction-dna/kernel';
import type { StorageAdapter } from '../storage';
import type { CreateOptions, ImportResult } from './types';

/**
 * DNA Validation Error
 */
export class DNAValidationError extends Error {
  constructor(public errors: Array<{ path: string; message: string }>) {
    super(`DNA validation failed: ${errors.map((e) => e.message).join(', ')}`);
    this.name = 'DNAValidationError';
  }
}

/**
 * DNA Create Operations
 */
export class DNACreate {
  constructor(
    private storage: StorageAdapter,
    private options: CreateOptions = {},
  ) {}

  /**
   * Create a new material DNA record
   */
  async create(partial: Partial<MaterialDNA>): Promise<MaterialDNA> {
    // Generate ID if not provided
    const id = partial.id || this.generateId();

    // Build the DNA record
    const now = new Date().toISOString();
    const dna: MaterialDNA = {
      ...this.createEmptyDNA(),
      ...partial,
      id,
      metadata: {
        ...this.createEmptyMetadata(),
        ...partial.metadata,
        created: partial.metadata?.created || now,
        updated: now,
        version: partial.metadata?.version || 1,
        completeness: 0,
        confidence: 0,
      },
    } as MaterialDNA;

    // Generate taxonomy code if we have enough data
    if (this.options.generateTaxonomyCode !== false) {
      try {
        dna.taxonomyCode = generateTaxonomyCode(dna);
      } catch {
        // Not enough data to generate code, use placeholder
        dna.taxonomyCode = dna.taxonomyCode || `DRAFT-${id}`;
      }
    }

    // Calculate completeness
    dna.metadata.completeness = calculateCompleteness(dna);

    // Validate if enabled
    if (this.options.validateOnWrite) {
      const validation = validateMaterialDNA(dna);
      if (!validation.valid) {
        throw new DNAValidationError(validation.errors);
      }
    }

    // Save to storage
    await this.storage.set(id, dna);

    // Index by taxonomy code for fast lookup
    if (dna.taxonomyCode && !dna.taxonomyCode.startsWith('DRAFT-')) {
      await this.storage.setIndex('taxonomyCode', dna.taxonomyCode, id);
    }

    return dna;
  }

  /**
   * Create multiple DNA records in batch
   */
  async batchCreate(records: Array<Partial<MaterialDNA>>): Promise<ImportResult> {
    const startTime = Date.now();
    const result: ImportResult = {
      success: [],
      failed: [],
      total: records.length,
      durationMs: 0,
    };

    for (const record of records) {
      try {
        const dna = await this.create(record);
        result.success.push(dna.id);
      } catch (error) {
        result.failed.push({
          record,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    result.durationMs = Date.now() - startTime;
    return result;
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return `dna_${timestamp}_${random}`;
  }

  /**
   * Create empty DNA structure
   */
  private createEmptyDNA(): Partial<MaterialDNA> {
    return {
      id: '',
      taxonomyCode: '',
      classification: {
        tier1_division: { code: '', name: '', masterFormatRef: '' },
        tier2_category: { code: '', name: '', subcategories: [], divisionCode: '' },
        tier3_assemblyType: {
          code: '',
          name: '',
          typicalLayers: 1,
          commonConditions: [],
          geometryType: 'planar',
        },
        tier4_condition: { code: '', name: '', geometryType: '2D', criticalDimensions: [] },
        tier5_manufacturer: {
          code: '',
          name: '',
          fullName: '',
          website: '',
          techSupport: '',
          warranties: [],
          active: true,
        },
        tier6_productVariant: {
          code: '',
          name: '',
          fullName: '',
          sku: '',
          sizes: [],
          specSheetUrl: '',
          sdsUrl: '',
          active: true,
        },
      },
      physical: {
        tier7_baseChemistry: {
          code: '',
          name: '',
          type: 'Hybrid',
          primaryPolymer: '',
          modifiers: [],
          isThermoplastic: false,
          isThermoset: false,
          isElastomeric: false,
          uvStability: 'fair',
          chemicalResistance: {
            acids: 'fair',
            alkalis: 'fair',
            solvents: 'fair',
            oils: 'fair',
            ozone: 'fair',
          },
          agingCharacteristics: '',
          joiningMethod: 'adhesive',
        },
        tier8_reinforcement: {
          code: '',
          type: 'none',
          orientation: 'none',
          addsTensileStrength: false,
          addsPunctureResistance: false,
          addsDimensionalStability: false,
          addsFireResistance: false,
        },
        tier9_surfaceTreatment: {
          code: '',
          type: 'untreated',
          color: '',
          texture: 'smooth',
          walkable: false,
          exposureRated: false,
          requiresCovering: true,
        },
        tier10_thicknessClass: {
          code: '',
          nominalMils: 0,
          nominalMM: 0,
          tolerancePlus: 0,
          toleranceMinus: 0,
          punctureResistance: 'low',
          installationDifficulty: 'easy',
        },
        tier11_colorReflectivity: {
          code: '',
          colorName: '',
          hexColor: '#000000',
          sri: 0,
          reflectance: 0,
          emittance: 0,
          meetsEnergyStar: false,
          meetsCoolRoof: false,
          meetsTitle24: false,
        },
        tier12_fireRating: {
          code: '',
          class: 'Unrated',
          ul790: false,
          astmE108: false,
          ul263: false,
          requiresFireBarrier: false,
          requiresGypsum: false,
        },
      },
      performance: {
        tier13_permRating: {
          code: '',
          class: 'III',
          perms: 0,
          permMetric: 0,
          vaporBarrier: false,
          vaporRetarder: false,
          vaporPermeable: true,
          requiresVentilation: false,
          canTrapMoisture: false,
          dryingPotential: 'high',
        },
        tier14_tensileStrength: {
          code: '',
          psiMD: 0,
          psiCD: 0,
          mpaMD: 0,
          mpaCD: 0,
          strengthClass: 'low',
          canBeStretched: false,
          requiresMechanicalFastening: false,
          selfSupportingSpan: 0,
        },
        tier15_elongation: {
          code: '',
          percentMD: 0,
          percentCD: 0,
          elongationClass: 'rigid',
          accommodatesMovement: false,
          bridgesCracks: false,
          maxCrackBridging: 0,
          elongationAt0F: 0,
          elongationAt70F: 0,
          elongationAt150F: 0,
        },
        tier16_temperatureRange: {
          code: '',
          minServiceF: 0,
          maxServiceF: 0,
          minServiceC: 0,
          maxServiceC: 0,
          minApplicationF: 0,
          maxApplicationF: 0,
          minApplicationC: 0,
          maxApplicationC: 0,
          brittlePointF: 0,
          brittlePointC: 0,
          softPointF: 0,
          softPointC: 0,
          coldWeatherProduct: false,
          hotWeatherProduct: false,
          allSeasonProduct: false,
        },
      },
      engineering: {
        tier17_failureModes: [],
        tier18_compatibilityMatrix: {
          compatible: [],
          incompatible: [],
          conditional: [],
        },
        tier19_applicationConstraints: [],
        tier20_codeReferences: [],
      },
    };
  }

  /**
   * Create empty metadata
   */
  private createEmptyMetadata() {
    return {
      created: '',
      updated: '',
      version: 1,
      expertValidated: false,
      completeness: 0,
      confidence: 0,
      dataSources: [],
    };
  }
}
