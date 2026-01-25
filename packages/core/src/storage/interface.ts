/**
 * STORAGE ADAPTER INTERFACE
 *
 * Defines the contract for all storage backends.
 * Implementations: Memory, JSON File, SQLite, PostgreSQL
 */

import type { MaterialDNA } from '@construction-dna/kernel';

/**
 * Storage adapter interface
 * All storage backends must implement this interface
 */
export interface StorageAdapter {
  /**
   * Get a single DNA record by ID
   */
  get(id: string): Promise<MaterialDNA | null>;

  /**
   * Store a DNA record
   */
  set(id: string, dna: MaterialDNA): Promise<void>;

  /**
   * Delete a DNA record by ID
   */
  delete(id: string): Promise<boolean>;

  /**
   * Get all DNA records
   */
  getAll(): Promise<MaterialDNA[]>;

  /**
   * Set an index entry (for fast lookups by taxonomy code, etc.)
   */
  setIndex(indexName: string, key: string, value: string): Promise<void>;

  /**
   * Get an index entry
   */
  getIndex(indexName: string, key: string): Promise<string | null>;

  /**
   * Delete an index entry
   */
  deleteIndex(indexName: string, key: string): Promise<boolean>;

  /**
   * Count total records
   */
  count(): Promise<number>;

  /**
   * Clear all data
   */
  clear(): Promise<void>;

  /**
   * Check if storage is ready/connected
   */
  isReady(): Promise<boolean>;
}

/**
 * Base class with common functionality
 */
export abstract class BaseStorageAdapter implements StorageAdapter {
  abstract get(id: string): Promise<MaterialDNA | null>;
  abstract set(id: string, dna: MaterialDNA): Promise<void>;
  abstract delete(id: string): Promise<boolean>;
  abstract getAll(): Promise<MaterialDNA[]>;
  abstract setIndex(indexName: string, key: string, value: string): Promise<void>;
  abstract getIndex(indexName: string, key: string): Promise<string | null>;
  abstract deleteIndex(indexName: string, key: string): Promise<boolean>;
  abstract count(): Promise<number>;
  abstract clear(): Promise<void>;

  async isReady(): Promise<boolean> {
    return true;
  }

  /**
   * Check if a record exists
   */
  async exists(id: string): Promise<boolean> {
    const record = await this.get(id);
    return record !== null;
  }

  /**
   * Get multiple records by IDs
   */
  async getMany(ids: string[]): Promise<(MaterialDNA | null)[]> {
    return Promise.all(ids.map((id) => this.get(id)));
  }

  /**
   * Set multiple records
   */
  async setMany(records: Array<{ id: string; dna: MaterialDNA }>): Promise<void> {
    await Promise.all(records.map(({ id, dna }) => this.set(id, dna)));
  }

  /**
   * Delete multiple records
   */
  async deleteMany(ids: string[]): Promise<number> {
    const results = await Promise.all(ids.map((id) => this.delete(id)));
    return results.filter(Boolean).length;
  }
}
