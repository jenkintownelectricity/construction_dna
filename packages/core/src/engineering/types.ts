/**
 * ENGINEERING Q&A TYPES
 */

import type {
  MaterialDNA,
  FailureMode,
  CompatibilityEntry,
  ApplicationConstraint,
} from '@construction-dna/kernel';

/**
 * Question intent types
 */
export type QuestionIntent =
  | 'failure-prediction'    // What happens if...
  | 'compatibility-check'   // Can I use A with B
  | 'temperature-check'     // Can I apply at X°F
  | 'application-guidance'  // How do I install
  | 'material-properties'   // What are the specs
  | 'code-compliance'       // Does it meet code
  | 'troubleshooting'       // Why did it fail
  | 'material-selection'    // What should I use
  | 'comparison'            // Compare A vs B
  | 'general';              // General question

/**
 * Parsed question
 */
export interface ParsedQuestion {
  /** Original question text */
  original: string;
  /** Detected intent */
  intent: QuestionIntent;
  /** Extracted keywords */
  keywords: string[];
  /** Extracted entities */
  entities: QuestionEntities;
  /** Confidence in intent detection (0-1) */
  confidence: number;
}

/**
 * Entities extracted from question
 */
export interface QuestionEntities {
  /** Material names/codes mentioned */
  materials: string[];
  /** Chemistry types mentioned */
  chemistries: string[];
  /** Temperature values mentioned */
  temperatures: Array<{ value: number; unit: 'F' | 'C' }>;
  /** Conditions mentioned (water, cold, UV, etc.) */
  conditions: string[];
  /** Failure types mentioned */
  failures: string[];
}

/**
 * Question context
 */
export interface QuestionContext {
  /** Specific material code */
  materialCode?: string;
  /** Multiple material codes */
  materialCodes?: string[];
  /** Environment conditions */
  conditions?: EnvironmentConditions;
  /** Assembly context */
  assemblyContext?: string;
}

/**
 * Environment conditions
 */
export interface EnvironmentConditions {
  /** Temperature in Fahrenheit */
  temperature?: number;
  /** Relative humidity percent */
  humidity?: number;
  /** Moisture condition */
  moisture?: 'dry' | 'damp' | 'wet' | 'submerged';
  /** UV exposure */
  exposure?: 'none' | 'partial' | 'full';
  /** Climate zone */
  climateZone?: string;
}

/**
 * Engineering answer
 */
export interface EngineeringAnswer {
  /** Original question */
  question: string;
  /** Detected intent */
  intent: QuestionIntent;
  /** Short answer */
  answer: string;
  /** Detailed explanation */
  explanation: string;

  // Supporting data
  /** Relevant materials */
  materials: MaterialDNA[];
  /** Related failure modes */
  failureModes: FailureMode[];
  /** Compatibility issues found */
  compatibilityIssues: CompatibilityEntry[];
  /** Constraint violations */
  constraintViolations: ConstraintViolation[];

  // Actionable items
  /** Recommendations */
  recommendations: string[];
  /** Warnings */
  warnings: string[];

  // Confidence
  /** Confidence score (0-1) */
  confidence: number;
  /** Source material taxonomy codes */
  sources: string[];
}

/**
 * Constraint violation
 */
export interface ConstraintViolation {
  /** The constraint that was violated */
  constraint: ApplicationConstraint;
  /** Actual value */
  actualValue: unknown;
  /** Required value */
  requiredValue: unknown;
  /** Severity */
  severity: 'warning' | 'error';
  /** Explanation */
  explanation: string;
}

/**
 * Failure prediction
 */
export interface FailurePrediction {
  /** Failure mode */
  failureMode: FailureMode;
  /** Probability (0-1) */
  probability: number;
  /** Risk factors present */
  riskFactors: string[];
  /** Recommended prevention */
  prevention: string[];
}

/**
 * Compatibility result
 */
export interface CompatibilityResult {
  /** Are materials compatible */
  compatible: boolean;
  /** Compatibility status */
  status: 'compatible' | 'incompatible' | 'conditional';
  /** Materials checked */
  materials: string[];
  /** Issues found */
  issues: CompatibilityEntry[];
  /** Requirements if conditional */
  requirements: string[];
  /** Explanation */
  explanation: string;
}
