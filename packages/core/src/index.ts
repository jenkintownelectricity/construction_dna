/**
 * CONSTRUCTION DNA CORE
 *
 * Complete DNA management engine with:
 * - CRUD operations
 * - Taxonomy navigation
 * - Engineering Q&A
 * - Search & filter
 * - Storage adapters
 *
 * @packageDocumentation
 * @module @construction-dna/core
 */

// ============================================
// MAIN ENGINE
// ============================================

export { ConstructionDNAEngine, type EngineOptions, type EngineStats } from './engine';

// ============================================
// STORAGE ADAPTERS
// ============================================

export { StorageAdapter, BaseStorageAdapter, MemoryStorage, JSONFileStorage } from './storage';

// ============================================
// CRUD OPERATIONS
// ============================================

export {
  DNACrud,
  DNAValidationError,
  DNANotFoundError,
  type DNAFilters,
  type ImportResult,
  type CreateOptions,
  type UpdateOptions,
  type CrudOptions,
} from './crud';

// ============================================
// TAXONOMY
// ============================================

export {
  TaxonomyTreeBuilder,
  TaxonomyNavigator,
  NavigationError,
  type TaxonomyNode,
  type TaxonomyTree,
  type NavigationResult,
  type TaxonomySearchResult,
  type TaxonomySearchOptions,
  type TaxonomyStats,
} from './taxonomy';

// ============================================
// ENGINEERING Q&A
// ============================================

export {
  QuestionParser,
  EngineeringAnswerEngine,
  type QuestionIntent,
  type ParsedQuestion,
  type QuestionEntities,
  type QuestionContext,
  type EnvironmentConditions,
  type EngineeringAnswer,
  type ConstraintViolation,
  type FailurePrediction,
  type CompatibilityResult,
} from './engineering';

// ============================================
// VERSION
// ============================================

export const VERSION = '1.0.0';
