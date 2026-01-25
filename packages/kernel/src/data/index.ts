/**
 * CONSTRUCTION DNA KERNEL - PREDEFINED DATA
 *
 * Ready-to-use data for the 20-Tier Material DNA Taxonomy
 *
 * @module @construction-dna/kernel/data
 */

// ============================================
// BASE CHEMISTRIES (TIER 7)
// ============================================

export {
  BASE_CHEMISTRIES,
  getChemistry,
  getAllChemistries,
  getThermoplasticChemistries,
  getElastomericChemistries,
  getChemistriesByUVStability,
} from './chemistries';

// ============================================
// FAILURE MODES (TIER 17)
// ============================================

export {
  COMMON_FAILURE_MODES,
  getFailureMode,
  getFailureModesByCategory,
  getFailureModesForChemistry,
  getFailureModesBySeverity,
  getAllFailureCategories,
} from './failure-modes';

// ============================================
// COMPATIBILITY RULES (TIER 18)
// ============================================

export {
  COMPATIBILITY_RULES,
  getCompatibilityMatrix,
  checkCompatibility,
  getIncompatibilities,
  getConditionalCompatibilities,
  searchCompatibilityRules,
} from './compatibility';

// ============================================
// CONSTANTS & REFERENCE DATA
// ============================================

export {
  // Tier 1: Divisions
  DIVISIONS,
  getDivision,

  // Tier 2: Categories
  CATEGORIES,
  getCategory,

  // Tier 5: Manufacturers
  MANUFACTURERS,
  getManufacturer,

  // Tier 8: Reinforcements
  REINFORCEMENTS,
  getReinforcement,

  // Tier 10: Thickness Classes
  THICKNESS_CLASSES,
  getThicknessClass,

  // Tier 12: Fire Ratings
  FIRE_RATINGS,
  getFireRating,

  // Tier 13: Perm Ratings
  PERM_RATINGS,
  getPermRating,
} from './constants';
