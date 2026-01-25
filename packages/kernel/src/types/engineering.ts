/**
 * TIER 17-20: ENGINEERING DNA TYPES
 *
 * These tiers answer: "HOW does it behave?"
 *
 * Tier 17: Failure Modes (What kills it?)
 * Tier 18: Compatibility Matrix (What can touch it?)
 * Tier 19: Application Constraints (When NOT to use)
 * Tier 20: Code References (IBC, IECC, ASTM)
 *
 * This is the "brain" of the DNA - the engineering intelligence
 * that enables failure prediction and problem solving.
 */

import type { ChemistryType } from './physical';

// ============================================
// TIER 17: FAILURE MODES
// ============================================

/**
 * Material failure mode
 * Captures HOW and WHY materials fail
 */
export interface FailureMode {
  /** Unique failure mode ID (e.g., "FM-001") */
  id: string;
  /** Failure mode name (e.g., "Adhesion Loss - Fish Mouths") */
  name: string;
  /** Failure category */
  category: FailureCategory;

  // Cause and effect
  /** What causes this failure */
  causes: string[];
  /** Visible symptoms of failure */
  symptoms: string[];
  /** Typical time to failure after cause */
  timeToFailure: TimeToFailure;

  // Severity assessment
  /** How severe is this failure */
  severity: FailureSeverity;
  /** How easy to repair */
  repairability: Repairability;
  /** Estimated repair cost level */
  repairCost?: CostLevel;

  // Prevention and detection
  /** How to prevent this failure */
  prevention: string[];
  /** How to inspect for this failure */
  inspection: string[];
  /** Early warning signs */
  earlyWarnings?: string[];

  // Related information
  /** Chemistry types prone to this failure */
  affectedChemistries?: ChemistryType[];
  /** Conditions that increase risk */
  riskFactors?: string[];
  /** Real-world case studies */
  caseStudies?: CaseStudy[];

  /** Additional notes */
  notes?: string;
}

/** Failure category classification */
export type FailureCategory =
  | 'adhesion'       // Delamination, disbonding
  | 'cohesion'       // Material splitting, cracking
  | 'mechanical'     // Puncture, tear, abrasion
  | 'thermal'        // Shrinkage, expansion, embrittlement
  | 'moisture'       // Blistering, water intrusion
  | 'chemical'       // Attack, degradation, incompatibility
  | 'uv'             // Photodegradation, chalking
  | 'biological'     // Mold, root penetration
  | 'installation'   // Workmanship defects
  | 'design';        // Improper detailing

/** Time to failure classification */
export type TimeToFailure =
  | 'immediate'    // Within hours/days
  | 'weeks'        // Within weeks
  | 'months'       // Within months
  | 'years'        // Within years
  | 'decades';     // Long-term degradation

/** Failure severity levels */
export type FailureSeverity =
  | 'cosmetic'       // Appearance only
  | 'functional'     // Affects performance
  | 'structural'     // Compromises structure
  | 'catastrophic';  // Complete system failure

/** Repairability classification */
export type Repairability =
  | 'easy'           // Simple patch/repair
  | 'moderate'       // Skilled repair needed
  | 'difficult'      // Major repair
  | 'replace-only';  // Must replace

/** Cost level classification */
export type CostLevel = 'low' | 'moderate' | 'high' | 'very-high';

/** Case study reference */
export interface CaseStudy {
  /** Case study ID */
  id: string;
  /** Brief title */
  title: string;
  /** Description of what happened */
  description: string;
  /** Location (anonymized if needed) */
  location?: string;
  /** Year of occurrence */
  year?: number;
  /** Lessons learned */
  lessons: string[];
  /** Reference/source */
  source?: string;
}

// ============================================
// TIER 18: COMPATIBILITY MATRIX
// ============================================

/**
 * Material compatibility matrix
 * Defines what can and cannot touch this material
 */
export interface CompatibilityMatrix {
  /** Materials this is COMPATIBLE with */
  compatible: CompatibilityEntry[];
  /** Materials this is INCOMPATIBLE with */
  incompatible: CompatibilityEntry[];
  /** Materials requiring primer/separator */
  conditional: CompatibilityEntry[];
}

/**
 * Individual compatibility entry
 */
export interface CompatibilityEntry {
  /** Material type or category */
  materialType: string;
  /** Chemistry type if applicable */
  chemistryType?: ChemistryType | string;

  // Compatibility details
  /** Compatibility status */
  status: CompatibilityStatus;
  /** Reason for this status */
  reason: string;

  // If conditional, what's required
  /** Requirement description */
  requirement?: string;
  /** Specific primer required */
  primerRequired?: string;
  /** Separator sheet required */
  separatorRequired?: string;
  /** Minimum wait time before contact */
  cureTimeRequired?: string;

  // Source and verification
  /** Source of this information */
  source: CompatibilitySource;
  /** Reference document/number */
  reference?: string;
  /** Has been verified */
  verified?: boolean;
  /** Date verified */
  verifiedDate?: string;

  /** Additional notes */
  notes?: string;
}

/** Compatibility status */
export type CompatibilityStatus =
  | 'compatible'     // Safe to use together
  | 'incompatible'   // NEVER use together
  | 'conditional';   // OK with precautions

/** Source of compatibility information */
export type CompatibilitySource =
  | 'manufacturer'   // From manufacturer tech data
  | 'astm'           // ASTM standard
  | 'experience'     // Field experience
  | 'testing'        // Independent testing
  | 'industry';      // Industry best practice

// ============================================
// TIER 19: APPLICATION CONSTRAINTS
// ============================================

/**
 * Application constraint
 * Defines when NOT to use this material
 */
export interface ApplicationConstraint {
  /** Constraint ID (e.g., "AC-001") */
  id: string;
  /** Constraint type */
  type: ConstraintType;
  /** Description of constraint */
  description: string;

  // Specific values
  /** Minimum value (if applicable) */
  minValue?: number;
  /** Maximum value (if applicable) */
  maxValue?: number;
  /** Unit of measurement */
  unit?: string;

  // Consequence
  /** What happens if violated */
  consequence: string;
  /** Severity of violation */
  violationSeverity: FailureSeverity;

  // Source
  /** Source of this constraint */
  source: ConstraintSource;
  /** Reference document */
  reference?: string;

  /** Workarounds if any */
  workarounds?: string[];
  /** Additional notes */
  notes?: string;
}

/** Constraint type classification */
export type ConstraintType =
  | 'temperature'         // Min/max application temp
  | 'humidity'            // Max humidity for application
  | 'moisture-content'    // Substrate moisture limits
  | 'slope'               // Min/max roof slope
  | 'substrate'           // Acceptable substrate types
  | 'substrate-prep'      // Surface preparation requirements
  | 'primer'              // Primer requirements
  | 'coverage'            // Application rate (sq ft/gal, etc.)
  | 'overlap'             // Lap/overlap requirements
  | 'cure-time'           // Time before next step/traffic
  | 'traffic'             // When can be walked on
  | 'exposure'            // Max exposure time before covering
  | 'thickness'           // Min/max wet or dry thickness
  | 'environmental'       // Wind, rain, dust conditions
  | 'storage'             // Storage temperature/conditions
  | 'shelf-life'          // Product shelf life
  | 'pot-life'            // Mixed product working time
  | 'flash-time'          // Time for solvents to evaporate
  | 'overcoat-window'     // Time window for additional coats
  | 'height'              // Maximum application height
  | 'fire-separation';    // Fire separation requirements

/** Constraint source */
export type ConstraintSource =
  | 'manufacturer'     // Manufacturer data sheet
  | 'code'             // Building code requirement
  | 'astm'             // ASTM standard
  | 'best-practice'    // Industry best practice
  | 'warranty';        // Warranty requirement

// ============================================
// TIER 20: CODE REFERENCES
// ============================================

/**
 * Building code and standard reference
 */
export interface CodeReference {
  /** Code or standard name (e.g., "IBC", "IECC", "ASTM E96") */
  code: string;
  /** Full name of code/standard */
  fullName: string;
  /** Section or clause number */
  section: string;
  /** What the code requires */
  requirement: string;
  /** Code edition/year */
  edition: string;

  // Compliance
  /** Does material comply */
  compliant: boolean;
  /** Compliance notes */
  notes?: string;

  // Test methods
  /** Test method reference */
  testMethod?: string;
  /** Test result */
  testResult?: string;
  /** Test date */
  testDate?: string;
  /** Testing lab */
  testLab?: string;

  /** URL to code/standard */
  url?: string;
}

/** Common code/standard types */
export type CodeStandard =
  | 'IBC'           // International Building Code
  | 'IRC'           // International Residential Code
  | 'IECC'          // International Energy Conservation Code
  | 'ASCE7'         // ASCE 7 (wind, seismic, etc.)
  | 'NFPA'          // NFPA fire codes
  | 'FM'            // FM Global standards
  | 'UL'            // UL standards
  | 'ASTM'          // ASTM standards
  | 'ANSI'          // ANSI standards
  | 'CRRC'          // Cool Roof Rating Council
  | 'SPRI'          // Single Ply Roofing Industry
  | 'NRCA'          // National Roofing Contractors Association
  | 'SMACNA'        // Sheet Metal and Air Conditioning Contractors
  | 'ASHRAE'        // ASHRAE standards
  | 'State'         // State-specific codes
  | 'Local';        // Local jurisdiction codes

// ============================================
// ENGINEERING DNA COMBINED TYPE
// ============================================

/**
 * Complete engineering DNA tiers (17-20)
 */
export interface EngineeringDNA {
  /** Tier 17: Failure Modes */
  tier17_failureModes: FailureMode[];
  /** Tier 18: Compatibility Matrix */
  tier18_compatibilityMatrix: CompatibilityMatrix;
  /** Tier 19: Application Constraints */
  tier19_applicationConstraints: ApplicationConstraint[];
  /** Tier 20: Code References */
  tier20_codeReferences: CodeReference[];
}

// ============================================
// ENGINEERING QUERY TYPES
// ============================================

/**
 * Engineering question/intent types
 * For the Q&A system to understand what's being asked
 */
export type EngineeringIntentType =
  | 'failure-prediction'      // What will fail?
  | 'compatibility-check'     // Can A touch B?
  | 'temperature-check'       // Can I use at X°F?
  | 'application-guidance'    // How do I install?
  | 'code-compliance'         // Does it meet code?
  | 'troubleshooting'         // Why did it fail?
  | 'material-selection'      // What should I use?
  | 'comparison'              // Compare A vs B
  | 'general';                // General question

/**
 * Engineering answer structure
 */
export interface EngineeringAnswer {
  /** Original question */
  question: string;
  /** Intent detected */
  intent: EngineeringIntentType;
  /** Main explanation */
  explanation: string;
  /** Related failure modes */
  failureModes: FailureMode[];
  /** Recommendations */
  recommendations: string[];
  /** Warnings */
  warnings?: string[];
  /** Confidence score (0-1) */
  confidence: number;
  /** Source material DNA codes */
  sources: string[];
}
