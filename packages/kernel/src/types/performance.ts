/**
 * TIER 13-16: PERFORMANCE METRICS TYPES
 *
 * These tiers answer: "HOW does it perform?"
 *
 * Tier 13: Perm Rating (Vapor permeance class)
 * Tier 14: Tensile Strength (PSI range)
 * Tier 15: Elongation (% stretch before failure)
 * Tier 16: Temperature Range (Service temp limits)
 */

// ============================================
// TIER 13: PERM RATING
// ============================================

/**
 * Vapor permeance rating
 * Critical for moisture management in assemblies
 */
export interface PermRating {
  /** Perm class code (e.g., "PI", "PII", "PIII") */
  code: string;
  /** Perm class designation */
  class: PermClass;

  // Values
  /** Perms (grains/hr*ft²*inHg) - US units */
  perms: number;
  /** ng/(Pa*s*m²) - SI units */
  permMetric: number;

  // What this means for moisture
  /** Is a vapor barrier (<0.1 perm) */
  vaporBarrier: boolean;
  /** Is a vapor retarder (0.1-1.0 perm) */
  vaporRetarder: boolean;
  /** Is vapor permeable (>1.0 perm) */
  vaporPermeable: boolean;

  // Application implications
  /** Requires ventilation when used */
  requiresVentilation: boolean;
  /** Can trap moisture in assembly */
  canTrapMoisture: boolean;
  /** Drying potential allowed */
  dryingPotential: DryingPotential;

  /** Test method used */
  testMethod?: PermTestMethod;
  /** Notes on vapor behavior */
  notes?: string;
}

/** Vapor permeance class per 2021 IBC */
export type PermClass =
  | 'I'     // Vapor impermeable (<0.1 perm) - Class I vapor retarder
  | 'II'    // Vapor semi-impermeable (0.1-1.0 perm) - Class II vapor retarder
  | 'III';  // Vapor permeable (>1.0 perm) - Class III vapor retarder

/** Drying potential classification */
export type DryingPotential = 'none' | 'low' | 'moderate' | 'high';

/** Perm test methods */
export type PermTestMethod =
  | 'ASTM E96 A'    // Desiccant method (dry cup)
  | 'ASTM E96 B'    // Water method (wet cup)
  | 'ASTM E96 BW'   // Water method, inverted
  | 'ASTM F1249'    // Mocon method
  | 'other';

// ============================================
// TIER 14: TENSILE STRENGTH
// ============================================

/**
 * Tensile strength properties
 * How much force it takes to break the material
 */
export interface TensileStrength {
  /** Tensile strength code (e.g., "TL", "TM", "TH", "TVH") */
  code: string;

  // Values - US Units (PSI)
  /** Machine direction tensile (PSI) */
  psiMD: number;
  /** Cross direction tensile (PSI) */
  psiCD: number;

  // Values - SI Units (MPa)
  /** Machine direction tensile (MPa) */
  mpaMD: number;
  /** Cross direction tensile (MPa) */
  mpaCD: number;

  // Classification
  /** Strength classification */
  strengthClass: StrengthClass;

  // What this means for installation
  /** Can be stretched during installation */
  canBeStretched: boolean;
  /** Requires mechanical fastening */
  requiresMechanicalFastening: boolean;
  /** Maximum unsupported span in mm */
  selfSupportingSpan: number;

  /** Test method */
  testMethod?: 'ASTM D412' | 'ASTM D638' | 'ASTM D882' | 'ASTM D751';
  /** Notes */
  notes?: string;
}

/** Strength classification */
export type StrengthClass = 'low' | 'medium' | 'high' | 'very-high';

// ============================================
// TIER 15: ELONGATION
// ============================================

/**
 * Elongation properties
 * How much a material stretches before breaking
 */
export interface Elongation {
  /** Elongation code (e.g., "ER", "ES", "EF", "EE") */
  code: string;

  // Values at room temperature
  /** % elongation at break (Machine Direction) */
  percentMD: number;
  /** % elongation at break (Cross Direction) */
  percentCD: number;

  // Classification
  /** Flexibility classification */
  elongationClass: ElongationClass;

  // What this means for movement
  /** Can accommodate building movement */
  accommodatesMovement: boolean;
  /** Can bridge cracks */
  bridgesCracks: boolean;
  /** Maximum crack width that can be bridged (mm) */
  maxCrackBridging: number;

  // Temperature effects on elongation
  /** Elongation at 0°F / -18°C */
  elongationAt0F: number;
  /** Elongation at 70°F / 21°C (room temp) */
  elongationAt70F: number;
  /** Elongation at 150°F / 65°C */
  elongationAt150F: number;

  /** Recovery percentage (for elastic materials) */
  recoveryPercent?: number;
  /** Test method */
  testMethod?: 'ASTM D412' | 'ASTM D638' | 'ASTM D882' | 'ASTM D751';
  /** Notes */
  notes?: string;
}

/** Elongation/flexibility classification */
export type ElongationClass =
  | 'rigid'          // <50% elongation
  | 'semi-flexible'  // 50-200% elongation
  | 'flexible'       // 200-500% elongation
  | 'elastic';       // >500% elongation

// ============================================
// TIER 16: TEMPERATURE RANGE
// ============================================

/**
 * Operating temperature range
 * Critical for material selection in different climates
 */
export interface TemperatureRange {
  /** Temperature range code (e.g., "TC", "TW", "TA", "TH") */
  code: string;

  // Service temperatures (in-place, long-term)
  /** Minimum service temperature (°F) */
  minServiceF: number;
  /** Maximum service temperature (°F) */
  maxServiceF: number;
  /** Minimum service temperature (°C) */
  minServiceC: number;
  /** Maximum service temperature (°C) */
  maxServiceC: number;

  // Application temperatures (during installation)
  /** Minimum application temperature (°F) */
  minApplicationF: number;
  /** Maximum application temperature (°F) */
  maxApplicationF: number;
  /** Minimum application temperature (°C) */
  minApplicationC: number;
  /** Maximum application temperature (°C) */
  maxApplicationC: number;

  // Critical temperatures
  /** Brittle point - material becomes brittle below this (°F) */
  brittlePointF: number;
  /** Brittle point (°C) */
  brittlePointC: number;
  /** Soft point - material softens above this (°F) */
  softPointF: number;
  /** Soft point (°C) */
  softPointC: number;
  /** Flash point - ignition risk for torch-applied (°F) */
  flashPointF?: number;
  /** Flash point (°C) */
  flashPointC?: number;

  // Behavior classification
  /** Suitable for cold weather application (<40°F) */
  coldWeatherProduct: boolean;
  /** Suitable for hot weather application (>90°F) */
  hotWeatherProduct: boolean;
  /** Suitable for all-season application */
  allSeasonProduct: boolean;

  /** Climate zone recommendations */
  recommendedClimateZones?: ClimateZone[];
  /** Notes */
  notes?: string;
}

/** ASHRAE Climate Zones */
export type ClimateZone =
  | '1'   // Very Hot - Humid (1A) or Dry (1B)
  | '2'   // Hot - Humid (2A) or Dry (2B)
  | '3'   // Warm - Humid (3A), Dry (3B), or Marine (3C)
  | '4'   // Mixed - Humid (4A), Dry (4B), or Marine (4C)
  | '5'   // Cool - Humid (5A), Dry (5B), or Marine (5C)
  | '6'   // Cold - Humid (6A) or Dry (6B)
  | '7'   // Very Cold
  | '8';  // Subarctic/Arctic

// ============================================
// PERFORMANCE METRICS COMBINED TYPE
// ============================================

/**
 * Complete performance metrics tiers (13-16)
 */
export interface PerformanceMetrics {
  /** Tier 13: Vapor Permeance Rating */
  tier13_permRating: PermRating;
  /** Tier 14: Tensile Strength */
  tier14_tensileStrength: TensileStrength;
  /** Tier 15: Elongation */
  tier15_elongation: Elongation;
  /** Tier 16: Temperature Range */
  tier16_temperatureRange: TemperatureRange;
}

// ============================================
// ADDITIONAL PERFORMANCE TYPES
// ============================================

/**
 * Extended performance data (optional additional metrics)
 */
export interface ExtendedPerformance {
  /** Tear strength (lbf or N) */
  tearStrength?: {
    valueLbf: number;
    valueN: number;
    testMethod: string;
  };

  /** Puncture resistance */
  punctureResistance?: {
    valueLbf: number;
    valueN: number;
    testMethod: string;
  };

  /** Peel adhesion */
  peelAdhesion?: {
    valuePli: number;  // pounds per linear inch
    valueNmm: number;  // N/mm
    substrate: string;
    testMethod: string;
  };

  /** Lap shear strength */
  lapShear?: {
    valuePsi: number;
    valueMPa: number;
    testMethod: string;
  };

  /** Hydrostatic head pressure */
  hydrostaticHead?: {
    valueFtH2O: number;
    valueMH2O: number;
    valuePsi: number;
    testMethod: string;
  };

  /** Dimensional stability */
  dimensionalStability?: {
    mdPercent: number;
    cdPercent: number;
    testMethod: string;
    condition: string;  // e.g., "158°F for 6 hours"
  };

  /** Water absorption */
  waterAbsorption?: {
    percent: number;
    testMethod: string;
    duration: string;
  };

  /** R-value (for insulating materials) */
  rValue?: {
    perInch: number;
    total?: number;
    testMethod: string;
  };
}
