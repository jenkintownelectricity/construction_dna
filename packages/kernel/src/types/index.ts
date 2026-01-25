/**
 * CONSTRUCTION DNA KERNEL - TYPE DEFINITIONS
 *
 * 20-Tier Material DNA Taxonomy Types
 *
 * @module @construction-dna/kernel/types
 */

// ============================================
// TIER 1-6: CLASSIFICATION TYPES
// ============================================

export type {
  // Core interfaces
  Division,
  Category,
  AssemblyType,
  Condition,
  Manufacturer,
  ProductVariant,
  Classification,

  // Supporting types
  WarrantyInfo,
  ProductSize,

  // Type unions
  DivisionCode,
  CategoryCode,
  AssemblyTypeCode,
  ConditionCode,
  ManufacturerCode,
  AssemblyGeometryType,
} from './classification';

// ============================================
// TIER 7-12: PHYSICAL PROPERTIES TYPES
// ============================================

export type {
  // Core interfaces
  BaseChemistry,
  Reinforcement,
  SurfaceTreatment,
  ThicknessClass,
  ColorReflectivity,
  FireRating,
  PhysicalProperties,

  // Supporting types
  ChemicalResistance,

  // Type unions
  ChemistryType,
  StabilityRating,
  JoiningMethod,
  ReinforcementType,
  ReinforcementOrientation,
  SurfaceType,
  SurfaceTexture,
  ResistanceLevel,
  DifficultyLevel,
  FireClass,
} from './physical';

// ============================================
// TIER 13-16: PERFORMANCE METRICS TYPES
// ============================================

export type {
  // Core interfaces
  PermRating,
  TensileStrength,
  Elongation,
  TemperatureRange,
  PerformanceMetrics,
  ExtendedPerformance,

  // Type unions
  PermClass,
  DryingPotential,
  PermTestMethod,
  StrengthClass,
  ElongationClass,
  ClimateZone,
} from './performance';

// ============================================
// TIER 17-20: ENGINEERING DNA TYPES
// ============================================

export type {
  // Core interfaces
  FailureMode,
  CompatibilityMatrix,
  CompatibilityEntry,
  ApplicationConstraint,
  CodeReference,
  EngineeringDNA,

  // Supporting types
  CaseStudy,
  EngineeringAnswer,

  // Type unions
  FailureCategory,
  TimeToFailure,
  FailureSeverity,
  Repairability,
  CostLevel,
  CompatibilityStatus,
  CompatibilitySource,
  ConstraintType,
  ConstraintSource,
  CodeStandard,
  EngineeringIntentType,
} from './engineering';

// ============================================
// MAIN MATERIAL DNA INTERFACE
// ============================================

export type {
  // Core interface
  MaterialDNA,
  MaterialDNASummary,

  // Metadata types
  MaterialDNAMetadata,
  DataSource,
  ChangeLogEntry,

  // Related types
  RelatedMaterial,
  MaterialRelationship,
  InstallationReference,

  // Collection types
  DNALibrary,
  DNAQueryOptions,
} from './material-dna';

// Export the summary extraction function
export { extractDNASummary } from './material-dna';
