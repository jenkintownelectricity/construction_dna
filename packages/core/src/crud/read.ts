/**
 * DNA READ OPERATIONS
 */

import type { MaterialDNA } from '@construction-dna/kernel';
import type { StorageAdapter } from '../storage';
import type { DNAFilters } from './types';

/**
 * DNA Read Operations
 */
export class DNARead {
  constructor(private storage: StorageAdapter) {}

  /**
   * Get a single DNA record by ID
   */
  async getById(id: string): Promise<MaterialDNA | null> {
    return this.storage.get(id);
  }

  /**
   * Get a single DNA record by taxonomy code
   */
  async getByTaxonomyCode(code: string): Promise<MaterialDNA | null> {
    const id = await this.storage.getIndex('taxonomyCode', code);
    if (!id) return null;
    return this.storage.get(id);
  }

  /**
   * Get by ID or taxonomy code (auto-detect)
   */
  async get(idOrCode: string): Promise<MaterialDNA | null> {
    // If it looks like an ID (starts with 'dna_'), use ID lookup
    if (idOrCode.startsWith('dna_')) {
      return this.getById(idOrCode);
    }

    // Try taxonomy code first
    const byCode = await this.getByTaxonomyCode(idOrCode);
    if (byCode) return byCode;

    // Fall back to ID lookup
    return this.getById(idOrCode);
  }

  /**
   * List all DNA records with optional filters
   */
  async list(filters?: DNAFilters): Promise<MaterialDNA[]> {
    let results = await this.storage.getAll();

    if (filters) {
      results = this.applyFilters(results, filters);
    }

    return results;
  }

  /**
   * Count records matching filters
   */
  async count(filters?: DNAFilters): Promise<number> {
    if (!filters) {
      return this.storage.count();
    }
    const results = await this.list(filters);
    return results.length;
  }

  /**
   * Check if a record exists
   */
  async exists(idOrCode: string): Promise<boolean> {
    const record = await this.get(idOrCode);
    return record !== null;
  }

  /**
   * Get multiple records by IDs
   */
  async getMany(ids: string[]): Promise<Array<MaterialDNA | null>> {
    return Promise.all(ids.map((id) => this.get(id)));
  }

  /**
   * Apply filters to a list of DNA records
   */
  private applyFilters(records: MaterialDNA[], filters: DNAFilters): MaterialDNA[] {
    let filtered = [...records];

    // Text search (searches across multiple fields)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((r) => {
        const searchable = [
          r.classification.tier6_productVariant?.name,
          r.classification.tier6_productVariant?.fullName,
          r.classification.tier5_manufacturer?.name,
          r.physical.tier7_baseChemistry?.name,
          r.physical.tier7_baseChemistry?.code,
          r.taxonomyCode,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchable.includes(searchLower);
      });
    }

    // Classification filters (Tiers 1-6)
    if (filters.division) {
      filtered = filtered.filter(
        (r) => r.classification.tier1_division?.code === filters.division,
      );
    }
    if (filters.category) {
      filtered = filtered.filter(
        (r) => r.classification.tier2_category?.code === filters.category,
      );
    }
    if (filters.assemblyType) {
      filtered = filtered.filter(
        (r) => r.classification.tier3_assemblyType?.code === filters.assemblyType,
      );
    }
    if (filters.condition) {
      filtered = filtered.filter(
        (r) => r.classification.tier4_condition?.code === filters.condition,
      );
    }
    if (filters.manufacturer) {
      filtered = filtered.filter(
        (r) => r.classification.tier5_manufacturer?.code === filters.manufacturer,
      );
    }
    if (filters.productVariant) {
      filtered = filtered.filter(
        (r) => r.classification.tier6_productVariant?.code === filters.productVariant,
      );
    }

    // Physical filters (Tiers 7-12)
    if (filters.chemistry) {
      filtered = filtered.filter(
        (r) => r.physical.tier7_baseChemistry?.code === filters.chemistry,
      );
    }
    if (filters.reinforcement) {
      filtered = filtered.filter(
        (r) => r.physical.tier8_reinforcement?.code === filters.reinforcement,
      );
    }
    if (filters.fireRating) {
      filtered = filtered.filter(
        (r) => r.physical.tier12_fireRating?.class === filters.fireRating,
      );
    }
    if (filters.thicknessMin !== undefined) {
      filtered = filtered.filter(
        (r) => (r.physical.tier10_thicknessClass?.nominalMils || 0) >= filters.thicknessMin!,
      );
    }
    if (filters.thicknessMax !== undefined) {
      filtered = filtered.filter(
        (r) => (r.physical.tier10_thicknessClass?.nominalMils || 0) <= filters.thicknessMax!,
      );
    }

    // Performance filters (Tiers 13-16)
    if (filters.permClass) {
      filtered = filtered.filter(
        (r) => r.performance.tier13_permRating?.class === filters.permClass,
      );
    }
    if (filters.tensileStrengthMin !== undefined) {
      filtered = filtered.filter(
        (r) => (r.performance.tier14_tensileStrength?.psiMD || 0) >= filters.tensileStrengthMin!,
      );
    }
    if (filters.elongationMin !== undefined) {
      filtered = filtered.filter(
        (r) => (r.performance.tier15_elongation?.percentMD || 0) >= filters.elongationMin!,
      );
    }
    if (filters.tempRangeMin !== undefined) {
      filtered = filtered.filter(
        (r) =>
          (r.performance.tier16_temperatureRange?.minApplicationF || 0) <= filters.tempRangeMin!,
      );
    }
    if (filters.tempRangeMax !== undefined) {
      filtered = filtered.filter(
        (r) =>
          (r.performance.tier16_temperatureRange?.maxApplicationF || 999) >= filters.tempRangeMax!,
      );
    }

    // Engineering filters (Tiers 17-20)
    if (filters.hasFailureMode) {
      filtered = filtered.filter((r) =>
        r.engineering.tier17_failureModes?.some(
          (fm) => fm.id === filters.hasFailureMode || fm.category === filters.hasFailureMode,
        ),
      );
    }
    if (filters.compatibleWith) {
      filtered = filtered.filter((r) =>
        r.engineering.tier18_compatibilityMatrix?.compatible?.some(
          (c) => c.chemistryType === filters.compatibleWith,
        ),
      );
    }
    if (filters.incompatibleWith) {
      filtered = filtered.filter((r) =>
        r.engineering.tier18_compatibilityMatrix?.incompatible?.some(
          (c) => c.chemistryType === filters.incompatibleWith,
        ),
      );
    }

    // Metadata filters
    if (filters.expertValidated !== undefined) {
      filtered = filtered.filter(
        (r) => r.metadata?.expertValidated === filters.expertValidated,
      );
    }
    if (filters.minCompleteness !== undefined) {
      filtered = filtered.filter(
        (r) => (r.metadata?.completeness || 0) >= filters.minCompleteness!,
      );
    }
    if (filters.createdAfter) {
      const afterDate = new Date(filters.createdAfter).getTime();
      filtered = filtered.filter(
        (r) => new Date(r.metadata?.created || 0).getTime() >= afterDate,
      );
    }
    if (filters.updatedAfter) {
      const afterDate = new Date(filters.updatedAfter).getTime();
      filtered = filtered.filter(
        (r) => new Date(r.metadata?.updated || 0).getTime() >= afterDate,
      );
    }

    // Sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = this.getNestedValue(a, filters.sortBy!);
        const bVal = this.getNestedValue(b, filters.sortBy!);
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;
        if (aVal < bVal) return -sortOrder;
        if (aVal > bVal) return sortOrder;
        return 0;
      });
    }

    // Pagination
    if (filters.offset) {
      filtered = filtered.slice(filters.offset);
    }
    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((o: unknown, k) => {
      if (o && typeof o === 'object' && k in o) {
        return (o as Record<string, unknown>)[k];
      }
      return undefined;
    }, obj);
  }
}
