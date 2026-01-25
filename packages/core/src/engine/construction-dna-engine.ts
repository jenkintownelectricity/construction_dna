/**
 * CONSTRUCTION DNA ENGINE
 *
 * Main engine class that combines all DNA operations:
 * - CRUD operations
 * - Taxonomy navigation
 * - Engineering Q&A
 * - Search & filter
 */

import type { MaterialDNA } from '@construction-dna/kernel';
import { VERSION as KERNEL_VERSION } from '@construction-dna/kernel';
import type { StorageAdapter } from '../storage';
import { MemoryStorage, JSONFileStorage } from '../storage';
import { DNACrud, type DNAFilters, type CrudOptions } from '../crud';
import { TaxonomyTreeBuilder, TaxonomyNavigator, type TaxonomyTree } from '../taxonomy';
import {
  QuestionParser,
  EngineeringAnswerEngine,
  type EngineeringAnswer,
  type QuestionContext,
  type FailurePrediction,
  type CompatibilityResult,
  type EnvironmentConditions,
} from '../engineering';

/**
 * Engine configuration options
 */
export interface EngineOptions {
  /** Storage adapter to use */
  storage?: StorageAdapter;
  /** Path to JSON file (if using JSONFileStorage) */
  storagePath?: string;
  /** Validate DNA on write operations */
  validateOnWrite?: boolean;
  /** Auto-build taxonomy tree on changes */
  autoRebuildTaxonomy?: boolean;
}

/**
 * Engine statistics
 */
export interface EngineStats {
  /** Total materials in database */
  materialCount: number;
  /** Unique chemistries */
  chemistryCount: number;
  /** Unique manufacturers */
  manufacturerCount: number;
  /** Validated materials count */
  validatedCount: number;
  /** Kernel version */
  kernelVersion: string;
  /** Engine version */
  engineVersion: string;
}

/**
 * Construction DNA Engine
 *
 * The main entry point for working with Material DNA.
 *
 * @example
 * ```typescript
 * // Create engine with in-memory storage
 * const engine = new ConstructionDNAEngine();
 *
 * // Create engine with JSON file storage
 * const engine = new ConstructionDNAEngine({
 *   storagePath: './materials.json'
 * });
 *
 * // Create a material
 * const material = await engine.create({
 *   classification: { tier2_category: 'WP' },
 *   physical: { tier7_baseChemistry: { type: 'SBS', ... } }
 * });
 *
 * // Ask an engineering question
 * const answer = await engine.ask("What happens if water gets behind EPDM?");
 *
 * // Check compatibility
 * const result = await engine.checkCompatibility(material1Id, material2Id);
 * ```
 */
export class ConstructionDNAEngine {
  public readonly storage: StorageAdapter;
  public readonly crud: DNACrud;
  public readonly navigator: TaxonomyNavigator;
  public readonly questionParser: QuestionParser;
  public readonly answerEngine: EngineeringAnswerEngine;

  private treeBuilder: TaxonomyTreeBuilder;
  private taxonomyTree: TaxonomyTree | null = null;
  private autoRebuildTaxonomy: boolean;

  constructor(options: EngineOptions = {}) {
    // Initialize storage
    if (options.storage) {
      this.storage = options.storage;
    } else if (options.storagePath) {
      this.storage = new JSONFileStorage(options.storagePath);
    } else {
      this.storage = new MemoryStorage();
    }

    // Initialize modules
    const crudOptions: CrudOptions = {
      validateOnWrite: options.validateOnWrite ?? false,
    };

    this.crud = new DNACrud(this.storage, crudOptions);
    this.treeBuilder = new TaxonomyTreeBuilder(this.storage);
    this.navigator = new TaxonomyNavigator(this.storage);
    this.questionParser = new QuestionParser();
    this.answerEngine = new EngineeringAnswerEngine(this.storage);

    this.autoRebuildTaxonomy = options.autoRebuildTaxonomy ?? false;
  }

  // ============================================
  // CRUD SHORTCUTS
  // ============================================

  /**
   * Create a new Material DNA record
   */
  async create(dna: Partial<MaterialDNA>): Promise<MaterialDNA> {
    const result = await this.crud.create(dna);
    if (this.autoRebuildTaxonomy) {
      await this.rebuildTaxonomy();
    }
    return result;
  }

  /**
   * Get a Material DNA record by ID or taxonomy code
   */
  async get(idOrCode: string): Promise<MaterialDNA | null> {
    return this.crud.read(idOrCode);
  }

  /**
   * Update a Material DNA record
   */
  async update(id: string, updates: Partial<MaterialDNA>): Promise<MaterialDNA> {
    const result = await this.crud.update(id, updates);
    if (this.autoRebuildTaxonomy) {
      await this.rebuildTaxonomy();
    }
    return result;
  }

  /**
   * Delete a Material DNA record
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.crud.delete(id);
    if (this.autoRebuildTaxonomy && result) {
      await this.rebuildTaxonomy();
    }
    return result;
  }

  /**
   * List all materials, optionally filtered
   */
  async list(filters?: DNAFilters): Promise<MaterialDNA[]> {
    return this.crud.list(filters);
  }

  /**
   * Count materials matching filters
   */
  async count(filters?: DNAFilters): Promise<number> {
    return this.crud.count(filters);
  }

  // ============================================
  // SEARCH
  // ============================================

  /**
   * Search materials by text query
   */
  async search(
    query: string,
    options?: { limit?: number; filters?: DNAFilters },
  ): Promise<MaterialDNA[]> {
    // Parse keywords from query
    const keywords = query
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    // Get all materials (with optional pre-filters)
    const materials = await this.crud.list(options?.filters);

    // Score each material
    const scored = materials.map((m) => ({
      material: m,
      score: this.scoreForSearch(m, keywords),
    }));

    // Sort by score and apply limit
    scored.sort((a, b) => b.score - a.score);
    const limit = options?.limit ?? 20;

    return scored
      .filter((s) => s.score > 0)
      .slice(0, limit)
      .map((s) => s.material);
  }

  /**
   * Find materials by chemistry type
   */
  async findByChemistry(chemistryType: string): Promise<MaterialDNA[]> {
    return this.crud.list({ chemistry: chemistryType });
  }

  /**
   * Find materials by manufacturer
   */
  async findByManufacturer(manufacturerCode: string): Promise<MaterialDNA[]> {
    return this.crud.list({ manufacturer: manufacturerCode });
  }

  /**
   * Find materials by category
   */
  async findByCategory(category: string): Promise<MaterialDNA[]> {
    return this.crud.list({ category });
  }

  // ============================================
  // ENGINEERING Q&A
  // ============================================

  /**
   * Ask an engineering question in natural language
   *
   * @example
   * ```typescript
   * const answer = await engine.ask("What happens if water gets behind EPDM?");
   * console.log(answer.explanation);
   * ```
   */
  async ask(question: string, context?: QuestionContext): Promise<EngineeringAnswer> {
    return this.answerEngine.answer(question, context);
  }

  /**
   * Parse a question to understand intent and entities
   */
  parseQuestion(question: string) {
    return this.questionParser.parse(question);
  }

  /**
   * Predict failure modes for a material under given conditions
   */
  async predictFailures(
    materialId: string,
    conditions?: EnvironmentConditions,
  ): Promise<FailurePrediction[]> {
    return this.answerEngine.predictFailures(materialId, conditions);
  }

  /**
   * Check compatibility between two materials
   */
  async checkCompatibility(material1Id: string, material2Id: string): Promise<CompatibilityResult> {
    return this.answerEngine.checkCompatibility(material1Id, material2Id);
  }

  // ============================================
  // TAXONOMY
  // ============================================

  /**
   * Build/rebuild the taxonomy tree from current materials
   */
  async rebuildTaxonomy(): Promise<TaxonomyTree> {
    const materials = await this.storage.getAll();
    this.taxonomyTree = this.treeBuilder.buildFromMaterials(materials);
    return this.taxonomyTree;
  }

  /**
   * Get the current taxonomy tree (builds if not cached)
   */
  async getTaxonomyTree(): Promise<TaxonomyTree> {
    if (!this.taxonomyTree) {
      await this.rebuildTaxonomy();
    }
    return this.taxonomyTree!;
  }

  /**
   * Navigate to a taxonomy node by path
   */
  async navigateTo(path: string[]) {
    return this.navigator.navigateTo(path);
  }

  /**
   * Search taxonomy tree
   */
  async searchTaxonomy(query: string, options?: { limit?: number }) {
    return this.navigator.search(query, options);
  }

  // ============================================
  // STATISTICS
  // ============================================

  /**
   * Get engine statistics
   */
  async getStats(): Promise<EngineStats> {
    const materials = await this.storage.getAll();

    const chemistries = new Set<string>();
    const manufacturers = new Set<string>();
    let validatedCount = 0;

    for (const m of materials) {
      if (m.physical.tier7_baseChemistry?.type) {
        chemistries.add(m.physical.tier7_baseChemistry.type);
      }
      if (m.classification.tier5_manufacturer?.code) {
        manufacturers.add(m.classification.tier5_manufacturer.code);
      }
      if (m.metadata?.expertValidated) {
        validatedCount++;
      }
    }

    return {
      materialCount: materials.length,
      chemistryCount: chemistries.size,
      manufacturerCount: manufacturers.size,
      validatedCount,
      kernelVersion: KERNEL_VERSION,
      engineVersion: '1.0.0',
    };
  }

  // ============================================
  // IMPORT/EXPORT
  // ============================================

  /**
   * Import materials from array
   */
  async import(materials: Array<Partial<MaterialDNA>>) {
    const result = await this.crud.batchCreate(materials);
    if (this.autoRebuildTaxonomy && result.success.length > 0) {
      await this.rebuildTaxonomy();
    }
    return result;
  }

  /**
   * Export all materials
   */
  async export(): Promise<MaterialDNA[]> {
    return this.storage.getAll();
  }

  /**
   * Export to JSON string
   */
  async exportJSON(pretty = false): Promise<string> {
    const materials = await this.export();
    return JSON.stringify(materials, null, pretty ? 2 : undefined);
  }

  // ============================================
  // PRIVATE HELPERS
  // ============================================

  /**
   * Score a material for search relevance
   */
  private scoreForSearch(material: MaterialDNA, keywords: string[]): number {
    const searchable = [
      material.classification.tier6_productVariant?.name,
      material.classification.tier6_productVariant?.fullName,
      material.classification.tier5_manufacturer?.name,
      material.classification.tier5_manufacturer?.code,
      material.classification.tier2_category,
      material.physical.tier7_baseChemistry?.name,
      material.physical.tier7_baseChemistry?.code,
      material.physical.tier7_baseChemistry?.type,
      material.taxonomyCode,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    let score = 0;
    for (const keyword of keywords) {
      if (searchable.includes(keyword)) {
        score += 1;
        // Bonus for exact match on key fields
        if (material.physical.tier7_baseChemistry?.code?.toLowerCase() === keyword) {
          score += 2;
        }
        if (material.classification.tier5_manufacturer?.code?.toLowerCase() === keyword) {
          score += 2;
        }
      }
    }

    return score;
  }
}
