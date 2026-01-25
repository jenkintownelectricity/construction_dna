/**
 * JSON FILE STORAGE ADAPTER
 *
 * Persistent storage using a JSON file.
 * Good for development and small deployments.
 */

import type { MaterialDNA } from '@construction-dna/kernel';
import { BaseStorageAdapter } from './interface';
import * as fs from 'fs/promises';
import * as path from 'path';

interface StorageData {
  version: string;
  data: Record<string, MaterialDNA>;
  indexes: Record<string, Record<string, string>>;
  metadata: {
    created: string;
    updated: string;
    count: number;
  };
}

/**
 * JSON file storage implementation
 */
export class JSONFileStorage extends BaseStorageAdapter {
  private filePath: string;
  private data: Map<string, MaterialDNA> = new Map();
  private indexes: Map<string, Map<string, string>> = new Map();
  private loaded = false;
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;
  private debounceMs: number;

  constructor(filePath: string, options?: { debounceMs?: number }) {
    super();
    this.filePath = filePath;
    this.debounceMs = options?.debounceMs ?? 100;
  }

  /**
   * Ensure data is loaded from file
   */
  private async ensureLoaded(): Promise<void> {
    if (this.loaded) return;

    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      const parsed: StorageData = JSON.parse(content);

      this.data = new Map(Object.entries(parsed.data || {}));
      this.indexes = new Map(
        Object.entries(parsed.indexes || {}).map(([k, v]) => [
          k,
          new Map(Object.entries(v)),
        ]),
      );
    } catch {
      // File doesn't exist or is invalid, start fresh
      this.data = new Map();
      this.indexes = new Map();
    }

    this.loaded = true;
  }

  /**
   * Save data to file (debounced)
   */
  private scheduleSave(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = setTimeout(() => {
      this.saveNow().catch(console.error);
    }, this.debounceMs);
  }

  /**
   * Save immediately
   */
  private async saveNow(): Promise<void> {
    const storageData: StorageData = {
      version: '1.0',
      data: Object.fromEntries(this.data),
      indexes: Object.fromEntries(
        Array.from(this.indexes.entries()).map(([k, v]) => [
          k,
          Object.fromEntries(v),
        ]),
      ),
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        count: this.data.size,
      },
    };

    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(storageData, null, 2));
  }

  async get(id: string): Promise<MaterialDNA | null> {
    await this.ensureLoaded();
    return this.data.get(id) ?? null;
  }

  async set(id: string, dna: MaterialDNA): Promise<void> {
    await this.ensureLoaded();
    this.data.set(id, dna);
    this.scheduleSave();
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureLoaded();
    const result = this.data.delete(id);
    if (result) this.scheduleSave();
    return result;
  }

  async getAll(): Promise<MaterialDNA[]> {
    await this.ensureLoaded();
    return Array.from(this.data.values());
  }

  async setIndex(indexName: string, key: string, value: string): Promise<void> {
    await this.ensureLoaded();
    if (!this.indexes.has(indexName)) {
      this.indexes.set(indexName, new Map());
    }
    this.indexes.get(indexName)!.set(key, value);
    this.scheduleSave();
  }

  async getIndex(indexName: string, key: string): Promise<string | null> {
    await this.ensureLoaded();
    return this.indexes.get(indexName)?.get(key) ?? null;
  }

  async deleteIndex(indexName: string, key: string): Promise<boolean> {
    await this.ensureLoaded();
    const index = this.indexes.get(indexName);
    if (!index) return false;
    const result = index.delete(key);
    if (result) this.scheduleSave();
    return result;
  }

  async count(): Promise<number> {
    await this.ensureLoaded();
    return this.data.size;
  }

  async clear(): Promise<void> {
    this.data.clear();
    this.indexes.clear();
    this.scheduleSave();
  }

  /**
   * Force immediate save
   */
  async flush(): Promise<void> {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    await this.saveNow();
  }

  /**
   * Reload from file (discards unsaved changes)
   */
  async reload(): Promise<void> {
    this.loaded = false;
    await this.ensureLoaded();
  }
}
