/**
 * DNA UPDATE OPERATIONS
 */

import type { MaterialDNA } from '@construction-dna/kernel';
import {
  generateTaxonomyCode,
  validateMaterialDNA,
  calculateCompleteness,
} from '@construction-dna/kernel';
import type { StorageAdapter } from '../storage';
import type { UpdateOptions } from './types';
import { DNAValidationError, DNACreate } from './create';

/**
 * DNA not found error
 */
export class DNANotFoundError extends Error {
  constructor(id: string) {
    super(`DNA record not found: ${id}`);
    this.name = 'DNANotFoundError';
  }
}

/**
 * DNA Update Operations
 */
export class DNAUpdate {
  private creator: DNACreate;

  constructor(
    private storage: StorageAdapter,
    private options: UpdateOptions = {},
  ) {
    this.creator = new DNACreate(storage, {
      validateOnWrite: options.validateOnWrite,
      generateTaxonomyCode: true,
    });
  }

  /**
   * Update an existing DNA record
   */
  async update(id: string, updates: Partial<MaterialDNA>): Promise<MaterialDNA> {
    // Get existing record
    const existing = await this.storage.get(id);

    if (!existing) {
      if (this.options.upsert) {
        // Create new record if upsert is enabled
        return this.creator.create({ ...updates, id });
      }
      throw new DNANotFoundError(id);
    }

    // Deep merge updates into existing
    const merged = this.deepMerge(
      existing as unknown as Record<string, unknown>,
      updates as unknown as Record<string, unknown>,
    ) as unknown as MaterialDNA;

    // Update metadata
    const now = new Date().toISOString();
    const existingMetadata = merged.metadata || {};
    merged.metadata = {
      ...existingMetadata,
      updated: now,
      version: ((existingMetadata as { version?: number }).version || 0) + 1,
    };

    // Regenerate taxonomy code
    try {
      const newCode = generateTaxonomyCode(merged);
      const oldCode = existing.taxonomyCode;

      if (newCode !== oldCode) {
        // Update index
        if (oldCode && !oldCode.startsWith('DRAFT-')) {
          await this.storage.deleteIndex('taxonomyCode', oldCode);
        }
        if (newCode && !newCode.startsWith('DRAFT-')) {
          await this.storage.setIndex('taxonomyCode', newCode, id);
        }
        merged.taxonomyCode = newCode;
      }
    } catch {
      // Keep existing code if generation fails
    }

    // Recalculate completeness
    (merged.metadata as { completeness?: number }).completeness = calculateCompleteness(merged);

    // Validate if enabled
    if (this.options.validateOnWrite) {
      const validation = validateMaterialDNA(merged);
      if (!validation.valid) {
        throw new DNAValidationError(validation.errors);
      }
    }

    // Save
    await this.storage.set(id, merged);

    return merged;
  }

  /**
   * Patch specific fields (shallow merge)
   */
  async patch(id: string, fields: Partial<MaterialDNA>): Promise<MaterialDNA> {
    const existing = await this.storage.get(id);

    if (!existing) {
      throw new DNANotFoundError(id);
    }

    // Shallow merge (only top-level fields)
    const patched = { ...existing, ...fields };

    // Ensure ID is preserved
    patched.id = id;

    // Update metadata
    patched.metadata = {
      ...existing.metadata,
      updated: new Date().toISOString(),
      version: (existing.metadata?.version || 0) + 1,
    };

    // Recalculate completeness
    patched.metadata.completeness = calculateCompleteness(patched);

    await this.storage.set(id, patched);

    return patched;
  }

  /**
   * Mark DNA as expert validated
   */
  async markValidated(
    id: string,
    validatedBy: string,
    notes?: string,
  ): Promise<MaterialDNA> {
    const existing = await this.storage.get(id);

    if (!existing) {
      throw new DNANotFoundError(id);
    }

    existing.metadata = {
      ...existing.metadata,
      expertValidated: true,
      validatedBy,
      validatedDate: new Date().toISOString(),
      validationNotes: notes,
      updated: new Date().toISOString(),
    };

    await this.storage.set(id, existing);

    return existing;
  }

  /**
   * Add a failure mode to a DNA record
   */
  async addFailureMode(
    id: string,
    failureMode: MaterialDNA['engineering']['tier17_failureModes'][0],
  ): Promise<MaterialDNA> {
    const existing = await this.storage.get(id);

    if (!existing) {
      throw new DNANotFoundError(id);
    }

    // Check if failure mode already exists
    const existingMode = existing.engineering.tier17_failureModes.find(
      (fm) => fm.id === failureMode.id,
    );

    if (!existingMode) {
      existing.engineering.tier17_failureModes.push(failureMode);
    }

    existing.metadata.updated = new Date().toISOString();
    existing.metadata.completeness = calculateCompleteness(existing);

    await this.storage.set(id, existing);

    return existing;
  }

  /**
   * Add a compatibility entry
   */
  async addCompatibility(
    id: string,
    entry: MaterialDNA['engineering']['tier18_compatibilityMatrix']['compatible'][0],
    type: 'compatible' | 'incompatible' | 'conditional',
  ): Promise<MaterialDNA> {
    const existing = await this.storage.get(id);

    if (!existing) {
      throw new DNANotFoundError(id);
    }

    existing.engineering.tier18_compatibilityMatrix[type].push(entry);
    existing.metadata.updated = new Date().toISOString();
    existing.metadata.completeness = calculateCompleteness(existing);

    await this.storage.set(id, existing);

    return existing;
  }

  /**
   * Deep merge two objects
   */
  private deepMerge(
    target: Record<string, unknown>,
    source: Record<string, unknown>,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = { ...target };

    for (const key in source) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = this.deepMerge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>,
        );
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }

    return result;
  }
}
