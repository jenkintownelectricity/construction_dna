/**
 * DNA DELETE OPERATIONS
 */

import type { StorageAdapter } from '../storage';

/**
 * DNA Delete Operations
 */
export class DNADelete {
  constructor(private storage: StorageAdapter) {}

  /**
   * Delete a DNA record by ID
   */
  async delete(id: string): Promise<boolean> {
    // Get the record first to clean up indexes
    const existing = await this.storage.get(id);

    if (!existing) {
      return false;
    }

    // Delete taxonomy code index
    if (existing.taxonomyCode && !existing.taxonomyCode.startsWith('DRAFT-')) {
      await this.storage.deleteIndex('taxonomyCode', existing.taxonomyCode);
    }

    // Delete the record
    return this.storage.delete(id);
  }

  /**
   * Delete multiple DNA records
   */
  async deleteMany(ids: string[]): Promise<number> {
    let deleted = 0;

    for (const id of ids) {
      const success = await this.delete(id);
      if (success) deleted++;
    }

    return deleted;
  }

  /**
   * Delete all records (use with caution!)
   */
  async deleteAll(): Promise<number> {
    const count = await this.storage.count();
    await this.storage.clear();
    return count;
  }
}
