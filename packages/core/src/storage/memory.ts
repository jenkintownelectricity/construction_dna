/**
 * IN-MEMORY STORAGE ADAPTER
 *
 * Fast, ephemeral storage for development and testing.
 * Data is lost when the process ends.
 */

import type { MaterialDNA } from '@construction-dna/kernel';
import { BaseStorageAdapter } from './interface';

/**
 * In-memory storage implementation
 */
export class MemoryStorage extends BaseStorageAdapter {
  private data: Map<string, MaterialDNA> = new Map();
  private indexes: Map<string, Map<string, string>> = new Map();

  async get(id: string): Promise<MaterialDNA | null> {
    return this.data.get(id) ?? null;
  }

  async set(id: string, dna: MaterialDNA): Promise<void> {
    this.data.set(id, dna);
  }

  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  async getAll(): Promise<MaterialDNA[]> {
    return Array.from(this.data.values());
  }

  async setIndex(indexName: string, key: string, value: string): Promise<void> {
    if (!this.indexes.has(indexName)) {
      this.indexes.set(indexName, new Map());
    }
    this.indexes.get(indexName)!.set(key, value);
  }

  async getIndex(indexName: string, key: string): Promise<string | null> {
    return this.indexes.get(indexName)?.get(key) ?? null;
  }

  async deleteIndex(indexName: string, key: string): Promise<boolean> {
    const index = this.indexes.get(indexName);
    if (!index) return false;
    return index.delete(key);
  }

  async count(): Promise<number> {
    return this.data.size;
  }

  async clear(): Promise<void> {
    this.data.clear();
    this.indexes.clear();
  }

  /**
   * Get all IDs (useful for iteration)
   */
  async getAllIds(): Promise<string[]> {
    return Array.from(this.data.keys());
  }

  /**
   * Get index keys (useful for debugging)
   */
  async getIndexKeys(indexName: string): Promise<string[]> {
    const index = this.indexes.get(indexName);
    return index ? Array.from(index.keys()) : [];
  }
}
