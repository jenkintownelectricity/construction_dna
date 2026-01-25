/**
 * CONSTRUCTION DNA KERNEL - UTILITIES
 *
 * Utility functions for working with Material DNA
 *
 * @module @construction-dna/kernel/utils
 */

// ============================================
// TAXONOMY CODE UTILITIES
// ============================================

export {
  // Code generation
  generateTaxonomyCode,
  hashFailureModes,
  hashCompatibility,
  hashConstraints,
  hashCodes,

  // Code parsing
  parseTaxonomyCode,
  type ParsedTaxonomyCode,

  // Code comparison
  isSameProduct,
  isSameCategory,
  isSameChemistry,

  // Code search
  createSearchPattern,
  matchesTaxonomyPattern,

  // Tier info
  getTierName,
  getTierGroup,
} from './taxonomy-code';

// ============================================
// VALIDATION UTILITIES
// ============================================

export {
  // Types
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,

  // Main validation
  validateMaterialDNA,

  // Completeness
  calculateCompleteness,

  // Quick checks
  hasMinimumFields,
  isExpertValidated,
  hasCompleteEngineering,
} from './validation';
