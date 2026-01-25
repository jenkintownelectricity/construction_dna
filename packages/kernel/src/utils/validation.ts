/**
 * VALIDATION UTILITIES
 *
 * Basic validation functions for Material DNA structures.
 * For full schema validation, use the Zod schemas in ../schemas
 */

import type {
  MaterialDNA,
  MaterialDNAMetadata,
  Classification,
  PhysicalProperties,
  PerformanceMetrics,
  EngineeringDNA,
} from '../types';

// ============================================
// VALIDATION RESULT TYPES
// ============================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  completeness: number;
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}

// ============================================
// MAIN VALIDATION FUNCTION
// ============================================

/**
 * Validate a complete MaterialDNA structure
 */
export function validateMaterialDNA(dna: unknown): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!dna || typeof dna !== 'object') {
    return {
      valid: false,
      errors: [{ path: '', message: 'DNA must be an object', code: 'INVALID_TYPE' }],
      warnings: [],
      completeness: 0,
    };
  }

  const d = dna as Record<string, unknown>;

  // Required fields
  if (!d.id || typeof d.id !== 'string') {
    errors.push({ path: 'id', message: 'ID is required', code: 'MISSING_ID' });
  }

  if (!d.taxonomyCode || typeof d.taxonomyCode !== 'string') {
    errors.push({
      path: 'taxonomyCode',
      message: 'Taxonomy code is required',
      code: 'MISSING_TAXONOMY_CODE',
    });
  }

  // Validate classification
  if (!d.classification || typeof d.classification !== 'object') {
    errors.push({
      path: 'classification',
      message: 'Classification is required',
      code: 'MISSING_CLASSIFICATION',
    });
  } else {
    const classErrors = validateClassification(d.classification);
    errors.push(...classErrors.map((e) => ({ ...e, path: `classification.${e.path}` })));
  }

  // Validate physical properties
  if (!d.physical || typeof d.physical !== 'object') {
    errors.push({
      path: 'physical',
      message: 'Physical properties are required',
      code: 'MISSING_PHYSICAL',
    });
  } else {
    const physErrors = validatePhysicalProperties(d.physical);
    errors.push(...physErrors.map((e) => ({ ...e, path: `physical.${e.path}` })));
  }

  // Validate performance metrics
  if (!d.performance || typeof d.performance !== 'object') {
    errors.push({
      path: 'performance',
      message: 'Performance metrics are required',
      code: 'MISSING_PERFORMANCE',
    });
  } else {
    const perfErrors = validatePerformanceMetrics(d.performance);
    errors.push(...perfErrors.map((e) => ({ ...e, path: `performance.${e.path}` })));
  }

  // Validate engineering DNA
  if (!d.engineering || typeof d.engineering !== 'object') {
    errors.push({
      path: 'engineering',
      message: 'Engineering DNA is required',
      code: 'MISSING_ENGINEERING',
    });
  } else {
    const engErrors = validateEngineeringDNA(d.engineering);
    errors.push(...engErrors.map((e) => ({ ...e, path: `engineering.${e.path}` })));
  }

  // Validate metadata
  if (!d.metadata || typeof d.metadata !== 'object') {
    warnings.push({
      path: 'metadata',
      message: 'Metadata is recommended',
      code: 'MISSING_METADATA',
    });
  }

  // Calculate completeness
  const completeness = calculateCompleteness(dna as MaterialDNA);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    completeness,
  };
}

// ============================================
// SECTION VALIDATORS
// ============================================

function validateClassification(
  classification: unknown,
): Omit<ValidationError, 'path'>[] {
  const errors: Omit<ValidationError, 'path'>[] = [];
  const c = classification as Record<string, unknown>;

  const requiredTiers = [
    'tier1_division',
    'tier2_category',
    'tier3_assemblyType',
    'tier4_condition',
    'tier5_manufacturer',
    'tier6_productVariant',
  ];

  for (const tier of requiredTiers) {
    if (!c[tier] || typeof c[tier] !== 'object') {
      errors.push({
        path: tier,
        message: `${tier} is required`,
        code: `MISSING_${tier.toUpperCase()}`,
      });
    } else {
      const t = c[tier] as Record<string, unknown>;
      if (!t.code || typeof t.code !== 'string') {
        errors.push({
          path: `${tier}.code`,
          message: `${tier}.code is required`,
          code: `MISSING_${tier.toUpperCase()}_CODE`,
        });
      }
    }
  }

  return errors;
}

function validatePhysicalProperties(
  physical: unknown,
): Omit<ValidationError, 'path'>[] {
  const errors: Omit<ValidationError, 'path'>[] = [];
  const p = physical as Record<string, unknown>;

  const requiredTiers = [
    'tier7_baseChemistry',
    'tier8_reinforcement',
    'tier9_surfaceTreatment',
    'tier10_thicknessClass',
    'tier11_colorReflectivity',
    'tier12_fireRating',
  ];

  for (const tier of requiredTiers) {
    if (!p[tier] || typeof p[tier] !== 'object') {
      errors.push({
        path: tier,
        message: `${tier} is required`,
        code: `MISSING_${tier.toUpperCase()}`,
      });
    }
  }

  return errors;
}

function validatePerformanceMetrics(
  performance: unknown,
): Omit<ValidationError, 'path'>[] {
  const errors: Omit<ValidationError, 'path'>[] = [];
  const p = performance as Record<string, unknown>;

  const requiredTiers = [
    'tier13_permRating',
    'tier14_tensileStrength',
    'tier15_elongation',
    'tier16_temperatureRange',
  ];

  for (const tier of requiredTiers) {
    if (!p[tier] || typeof p[tier] !== 'object') {
      errors.push({
        path: tier,
        message: `${tier} is required`,
        code: `MISSING_${tier.toUpperCase()}`,
      });
    }
  }

  return errors;
}

function validateEngineeringDNA(
  engineering: unknown,
): Omit<ValidationError, 'path'>[] {
  const errors: Omit<ValidationError, 'path'>[] = [];
  const e = engineering as Record<string, unknown>;

  if (!Array.isArray(e.tier17_failureModes)) {
    errors.push({
      path: 'tier17_failureModes',
      message: 'Failure modes must be an array',
      code: 'INVALID_FAILURE_MODES',
    });
  }

  if (!e.tier18_compatibilityMatrix || typeof e.tier18_compatibilityMatrix !== 'object') {
    errors.push({
      path: 'tier18_compatibilityMatrix',
      message: 'Compatibility matrix is required',
      code: 'MISSING_COMPATIBILITY',
    });
  }

  if (!Array.isArray(e.tier19_applicationConstraints)) {
    errors.push({
      path: 'tier19_applicationConstraints',
      message: 'Application constraints must be an array',
      code: 'INVALID_CONSTRAINTS',
    });
  }

  if (!Array.isArray(e.tier20_codeReferences)) {
    errors.push({
      path: 'tier20_codeReferences',
      message: 'Code references must be an array',
      code: 'INVALID_CODE_REFS',
    });
  }

  return errors;
}

// ============================================
// COMPLETENESS CALCULATION
// ============================================

/**
 * Calculate DNA completeness score (0-100)
 */
export function calculateCompleteness(dna: MaterialDNA): number {
  let score = 0;
  let maxScore = 0;

  // Classification (20 points)
  maxScore += 20;
  if (dna.classification) {
    if (dna.classification.tier1_division?.code) score += 3;
    if (dna.classification.tier2_category?.code) score += 3;
    if (dna.classification.tier3_assemblyType?.code) score += 3;
    if (dna.classification.tier4_condition?.code) score += 3;
    if (dna.classification.tier5_manufacturer?.code) score += 4;
    if (dna.classification.tier6_productVariant?.code) score += 4;
  }

  // Physical properties (20 points)
  maxScore += 20;
  if (dna.physical) {
    if (dna.physical.tier7_baseChemistry?.code) score += 4;
    if (dna.physical.tier8_reinforcement?.code) score += 3;
    if (dna.physical.tier9_surfaceTreatment?.code) score += 3;
    if (dna.physical.tier10_thicknessClass?.code) score += 3;
    if (dna.physical.tier11_colorReflectivity?.code) score += 3;
    if (dna.physical.tier12_fireRating?.code) score += 4;
  }

  // Performance metrics (20 points)
  maxScore += 20;
  if (dna.performance) {
    if (dna.performance.tier13_permRating?.code) score += 5;
    if (dna.performance.tier14_tensileStrength?.code) score += 5;
    if (dna.performance.tier15_elongation?.code) score += 5;
    if (dna.performance.tier16_temperatureRange?.code) score += 5;
  }

  // Engineering DNA (30 points - most valuable)
  maxScore += 30;
  if (dna.engineering) {
    const failureModes = dna.engineering.tier17_failureModes;
    if (Array.isArray(failureModes) && failureModes.length > 0) {
      score += Math.min(failureModes.length * 2, 10);
    }

    const matrix = dna.engineering.tier18_compatibilityMatrix;
    if (matrix) {
      if (Array.isArray(matrix.incompatible) && matrix.incompatible.length > 0) score += 3;
      if (Array.isArray(matrix.compatible) && matrix.compatible.length > 0) score += 3;
      if (Array.isArray(matrix.conditional) && matrix.conditional.length > 0) score += 2;
    }

    const constraints = dna.engineering.tier19_applicationConstraints;
    if (Array.isArray(constraints) && constraints.length > 0) {
      score += Math.min(constraints.length, 6);
    }

    const codes = dna.engineering.tier20_codeReferences;
    if (Array.isArray(codes) && codes.length > 0) {
      score += Math.min(codes.length * 2, 6);
    }
  }

  // Metadata (10 points)
  maxScore += 10;
  if (dna.metadata) {
    if (dna.metadata.created) score += 2;
    if (dna.metadata.expertValidated) score += 4;
    if (dna.metadata.dataSources && dna.metadata.dataSources.length > 0) score += 4;
  }

  return Math.round((score / maxScore) * 100);
}

// ============================================
// QUICK VALIDATORS
// ============================================

/**
 * Check if DNA has minimum required fields
 */
export function hasMinimumFields(dna: unknown): boolean {
  if (!dna || typeof dna !== 'object') return false;
  const d = dna as Record<string, unknown>;
  return !!(d.id && d.taxonomyCode && d.classification && d.physical);
}

/**
 * Check if DNA is expert validated
 */
export function isExpertValidated(dna: MaterialDNA): boolean {
  return dna.metadata?.expertValidated === true;
}

/**
 * Check if DNA has complete engineering data
 */
export function hasCompleteEngineering(dna: MaterialDNA): boolean {
  if (!dna.engineering) return false;
  const e = dna.engineering;

  return (
    Array.isArray(e.tier17_failureModes) &&
    e.tier17_failureModes.length > 0 &&
    e.tier18_compatibilityMatrix != null &&
    Array.isArray(e.tier19_applicationConstraints) &&
    e.tier19_applicationConstraints.length > 0 &&
    Array.isArray(e.tier20_codeReferences) &&
    e.tier20_codeReferences.length > 0
  );
}
