/**
 * DNA CRUD OPERATIONS
 *
 * Create, Read, Update, Delete operations for Material DNA records
 */

import type { MaterialDNA } from '@construction-dna/kernel';
import type { StorageAdapter } from '../storage';
import { DNACreate, DNAValidationError } from './create';
import { DNARead } from './read';
import { DNAUpdate, DNANotFoundError } from './update';
import { DNADelete } from './delete';
import type { DNAFilters, ImportResult, CreateOptions, UpdateOptions } from './types';

export { DNAValidationError } from './create';
export { DNANotFoundError } from './update';
export type { DNAFilters, ImportResult, CreateOptions, UpdateOptions } from './types';

export interface CrudOptions {
  validateOnWrite?: boolean;
}

/**
 * Combined CRUD operations
 */
export class DNACrud {
  private createOps: DNACreate;
  private readOps: DNARead;
  private updateOps: DNAUpdate;
  private deleteOps: DNADelete;

  constructor(
    private storage: StorageAdapter,
    options: CrudOptions = {},
  ) {
    const createOptions: CreateOptions = {
      validateOnWrite: options.validateOnWrite ?? false,
      generateId: true,
      generateTaxonomyCode: true,
    };

    const updateOptions: UpdateOptions = {
      validateOnWrite: options.validateOnWrite ?? false,
      upsert: false,
    };

    this.createOps = new DNACreate(storage, createOptions);
    this.readOps = new DNARead(storage);
    this.updateOps = new DNAUpdate(storage, updateOptions);
    this.deleteOps = new DNADelete(storage);
  }

  // ============================================
  // CREATE OPERATIONS
  // ============================================

  /**
   * Create a new DNA record
   */
  async create(dna: Partial<MaterialDNA>): Promise<MaterialDNA> {
    return this.createOps.create(dna);
  }

  /**
   * Create multiple DNA records
   */
  async batchCreate(records: Array<Partial<MaterialDNA>>): Promise<ImportResult> {
    return this.createOps.batchCreate(records);
  }

  // ============================================
  // READ OPERATIONS
  // ============================================

  /**
   * Get a DNA record by ID or taxonomy code
   */
  async read(idOrCode: string): Promise<MaterialDNA | null> {
    return this.readOps.get(idOrCode);
  }

  /**
   * Get a DNA record by ID
   */
  async getById(id: string): Promise<MaterialDNA | null> {
    return this.readOps.getById(id);
  }

  /**
   * Get a DNA record by taxonomy code
   */
  async getByTaxonomyCode(code: string): Promise<MaterialDNA | null> {
    return this.readOps.getByTaxonomyCode(code);
  }

  /**
   * List DNA records with optional filters
   */
  async list(filters?: DNAFilters): Promise<MaterialDNA[]> {
    return this.readOps.list(filters);
  }

  /**
   * Count DNA records matching filters
   */
  async count(filters?: DNAFilters): Promise<number> {
    return this.readOps.count(filters);
  }

  /**
   * Check if a DNA record exists
   */
  async exists(idOrCode: string): Promise<boolean> {
    return this.readOps.exists(idOrCode);
  }

  /**
   * Get multiple records by IDs
   */
  async getMany(ids: string[]): Promise<Array<MaterialDNA | null>> {
    return this.readOps.getMany(ids);
  }

  // ============================================
  // UPDATE OPERATIONS
  // ============================================

  /**
   * Update an existing DNA record
   */
  async update(id: string, updates: Partial<MaterialDNA>): Promise<MaterialDNA> {
    return this.updateOps.update(id, updates);
  }

  /**
   * Patch specific fields
   */
  async patch(id: string, fields: Partial<MaterialDNA>): Promise<MaterialDNA> {
    return this.updateOps.patch(id, fields);
  }

  /**
   * Mark a DNA record as expert validated
   */
  async markValidated(id: string, validatedBy: string, notes?: string): Promise<MaterialDNA> {
    return this.updateOps.markValidated(id, validatedBy, notes);
  }

  /**
   * Add a failure mode to a DNA record
   */
  async addFailureMode(
    id: string,
    failureMode: MaterialDNA['engineering']['tier17_failureModes'][0],
  ): Promise<MaterialDNA> {
    return this.updateOps.addFailureMode(id, failureMode);
  }

  // ============================================
  // DELETE OPERATIONS
  // ============================================

  /**
   * Delete a DNA record
   */
  async delete(id: string): Promise<boolean> {
    return this.deleteOps.delete(id);
  }

  /**
   * Delete multiple DNA records
   */
  async deleteMany(ids: string[]): Promise<number> {
    return this.deleteOps.deleteMany(ids);
  }

  /**
   * Delete all DNA records (use with caution!)
   */
  async deleteAll(): Promise<number> {
    return this.deleteOps.deleteAll();
  }
}
