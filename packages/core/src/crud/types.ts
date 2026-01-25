/**
 * CRUD TYPES
 *
 * Type definitions for CRUD operations
 */

import type { MaterialDNA } from '@construction-dna/kernel';

/**
 * Filters for querying DNA records
 */
export interface DNAFilters {
  // Classification filters (Tiers 1-6)
  division?: string;
  category?: string;
  assemblyType?: string;
  condition?: string;
  manufacturer?: string;
  productVariant?: string;

  // Physical filters (Tiers 7-12)
  chemistry?: string;
  reinforcement?: string;
  surfaceTreatment?: string;
  thicknessMin?: number;
  thicknessMax?: number;
  fireRating?: string;

  // Performance filters (Tiers 13-16)
  permClass?: string;
  tensileStrengthMin?: number;
  elongationMin?: number;
  tempRangeMin?: number;
  tempRangeMax?: number;

  // Engineering filters (Tiers 17-20)
  hasFailureMode?: string;
  compatibleWith?: string;
  incompatibleWith?: string;

  // Metadata filters
  expertValidated?: boolean;
  minCompleteness?: number;
  createdAfter?: string;
  updatedAfter?: string;

  // Text search
  search?: string;

  // Pagination
  limit?: number;
  offset?: number;

  // Sorting
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Result of a batch import operation
 */
export interface ImportResult {
  /** Successfully imported IDs */
  success: string[];
  /** Failed imports with error details */
  failed: Array<{
    record: Partial<MaterialDNA>;
    error: string;
  }>;
  /** Total records attempted */
  total: number;
  /** Duration in milliseconds */
  durationMs: number;
}

/**
 * Options for create operations
 */
export interface CreateOptions {
  /** Validate DNA before writing */
  validateOnWrite?: boolean;
  /** Generate ID if not provided */
  generateId?: boolean;
  /** Generate taxonomy code */
  generateTaxonomyCode?: boolean;
}

/**
 * Options for update operations
 */
export interface UpdateOptions {
  /** Validate after merge */
  validateOnWrite?: boolean;
  /** Create if not exists */
  upsert?: boolean;
}

/**
 * Options for list/query operations
 */
export interface ListOptions {
  /** Include full DNA or just summary */
  fullDna?: boolean;
}
