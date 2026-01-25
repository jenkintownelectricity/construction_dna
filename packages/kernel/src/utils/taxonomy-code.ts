/**
 * TAXONOMY CODE GENERATOR
 *
 * Generates and parses the 20-tier taxonomy codes that uniquely
 * identify materials in the Construction DNA system.
 *
 * Code Format:
 * XX-XX-XX-XX-XXX-XXX-XXX-XX-XX-XX-XX-XX-XX-XX-XX-XX-XXXX-XX-XX-XXXX
 * |  |  |  |  |   |   |   |  |  |  |  |  |  |  |  |  |    |  |  |
 * T1 T2 T3 T4 T5  T6  T7  T8 T9 T10T11T12T13T14T15T16 T17  T18T19 T20
 */

import type {
  MaterialDNA,
  FailureMode,
  CompatibilityMatrix,
  ApplicationConstraint,
  CodeReference,
} from '../types';

// ============================================
// CODE GENERATION
// ============================================

/**
 * Generate a full 20-tier taxonomy code from MaterialDNA
 */
export function generateTaxonomyCode(dna: MaterialDNA): string {
  const parts = [
    // Classification (Tiers 1-6)
    dna.classification.tier1_division.code.padStart(2, '0'),
    dna.classification.tier2_category.code.padEnd(2, '-'),
    dna.classification.tier3_assemblyType.code.padEnd(2, '-'),
    dna.classification.tier4_condition.code.padEnd(2, '-'),
    dna.classification.tier5_manufacturer.code.padEnd(3, '-'),
    dna.classification.tier6_productVariant.code.padEnd(3, '-'),

    // Physical Properties (Tiers 7-12)
    dna.physical.tier7_baseChemistry.code.padEnd(3, '-'),
    dna.physical.tier8_reinforcement.code.padEnd(2, '-'),
    dna.physical.tier9_surfaceTreatment.code.padEnd(2, '-'),
    dna.physical.tier10_thicknessClass.code.padEnd(3, '-'),
    dna.physical.tier11_colorReflectivity.code.padEnd(3, '-'),
    dna.physical.tier12_fireRating.code.padEnd(2, '-'),

    // Performance Metrics (Tiers 13-16)
    dna.performance.tier13_permRating.code.padEnd(3, '-'),
    dna.performance.tier14_tensileStrength.code.padEnd(3, '-'),
    dna.performance.tier15_elongation.code.padEnd(3, '-'),
    dna.performance.tier16_temperatureRange.code.padEnd(3, '-'),

    // Engineering DNA (Tiers 17-20) - hashed/abbreviated
    hashFailureModes(dna.engineering.tier17_failureModes),
    hashCompatibility(dna.engineering.tier18_compatibilityMatrix),
    hashConstraints(dna.engineering.tier19_applicationConstraints),
    hashCodes(dna.engineering.tier20_codeReferences),
  ];

  return parts.join('-');
}

/**
 * Hash failure modes array to a 4-character code
 */
export function hashFailureModes(modes: FailureMode[]): string {
  if (!modes || modes.length === 0) return '----';

  // Create a hash based on the categories present
  const categories = [...new Set(modes.map((m) => m.category))];
  const categoryMap: Record<string, string> = {
    adhesion: 'A',
    cohesion: 'C',
    mechanical: 'M',
    thermal: 'T',
    moisture: 'W', // Water
    chemical: 'H', // cHemical
    uv: 'U',
    biological: 'B',
    installation: 'I',
    design: 'D',
  };

  const hash = categories
    .map((c) => categoryMap[c] || 'X')
    .sort()
    .join('')
    .substring(0, 4)
    .padEnd(4, '-');

  return hash;
}

/**
 * Hash compatibility matrix to a 2-character code
 */
export function hashCompatibility(matrix: CompatibilityMatrix): string {
  if (!matrix) return '--';

  // Generate a code based on compatibility profile
  const incompatCount = matrix.incompatible?.length || 0;
  const conditionalCount = matrix.conditional?.length || 0;

  // First char: incompatibility level (0-9 or A-Z for >9)
  const incompatChar =
    incompatCount > 9
      ? String.fromCharCode(55 + incompatCount) // A=10, B=11, etc.
      : incompatCount.toString();

  // Second char: conditional level
  const conditionalChar =
    conditionalCount > 9
      ? String.fromCharCode(55 + conditionalCount)
      : conditionalCount.toString();

  return incompatChar + conditionalChar;
}

/**
 * Hash application constraints to a 2-character code
 */
export function hashConstraints(constraints: ApplicationConstraint[]): string {
  if (!constraints || constraints.length === 0) return '--';

  // Count constraints by severity
  const criticalCount = constraints.filter(
    (c) => c.violationSeverity === 'catastrophic',
  ).length;
  const majorCount = constraints.filter(
    (c) => c.violationSeverity === 'structural',
  ).length;

  return (
    Math.min(criticalCount, 9).toString() +
    Math.min(majorCount, 9).toString()
  );
}

/**
 * Hash code references to a 4-character code
 */
export function hashCodes(refs: CodeReference[]): string {
  if (!refs || refs.length === 0) return '----';

  // Create a code based on which standards are referenced
  const standardMap: Record<string, string> = {
    IBC: 'I',
    IRC: 'R',
    IECC: 'E',
    ASTM: 'A',
    FM: 'F',
    UL: 'U',
    NFPA: 'N',
    SPRI: 'S',
    NRCA: 'C',
    ASHRAE: 'H',
  };

  const codes = refs.map((r) => {
    const standard = r.code.split(' ')[0].toUpperCase();
    return standardMap[standard] || 'X';
  });

  return [...new Set(codes)]
    .sort()
    .join('')
    .substring(0, 4)
    .padEnd(4, '-');
}

// ============================================
// CODE PARSING
// ============================================

/**
 * Parsed taxonomy code structure
 */
export interface ParsedTaxonomyCode {
  raw: string;
  valid: boolean;

  // Tier codes (raw)
  tier1: string;
  tier2: string;
  tier3: string;
  tier4: string;
  tier5: string;
  tier6: string;
  tier7: string;
  tier8: string;
  tier9: string;
  tier10: string;
  tier11: string;
  tier12: string;
  tier13: string;
  tier14: string;
  tier15: string;
  tier16: string;
  tier17: string;
  tier18: string;
  tier19: string;
  tier20: string;

  // Grouped codes
  classification: string;
  physical: string;
  performance: string;
  engineering: string;
}

/**
 * Parse a taxonomy code into its component parts
 */
export function parseTaxonomyCode(code: string): ParsedTaxonomyCode {
  const parts = code.split('-');

  // Expected: 20 parts
  const valid = parts.length >= 20;

  return {
    raw: code,
    valid,

    // Individual tiers
    tier1: parts[0] || '',
    tier2: parts[1] || '',
    tier3: parts[2] || '',
    tier4: parts[3] || '',
    tier5: parts[4] || '',
    tier6: parts[5] || '',
    tier7: parts[6] || '',
    tier8: parts[7] || '',
    tier9: parts[8] || '',
    tier10: parts[9] || '',
    tier11: parts[10] || '',
    tier12: parts[11] || '',
    tier13: parts[12] || '',
    tier14: parts[13] || '',
    tier15: parts[14] || '',
    tier16: parts[15] || '',
    tier17: parts[16] || '',
    tier18: parts[17] || '',
    tier19: parts[18] || '',
    tier20: parts[19] || '',

    // Grouped
    classification: parts.slice(0, 6).join('-'),
    physical: parts.slice(6, 12).join('-'),
    performance: parts.slice(12, 16).join('-'),
    engineering: parts.slice(16, 20).join('-'),
  };
}

/**
 * Check if two taxonomy codes refer to the same product
 * (same tiers 1-6)
 */
export function isSameProduct(code1: string, code2: string): boolean {
  const parsed1 = parseTaxonomyCode(code1);
  const parsed2 = parseTaxonomyCode(code2);
  return parsed1.classification === parsed2.classification;
}

/**
 * Check if two taxonomy codes are in the same category
 * (same tiers 1-2)
 */
export function isSameCategory(code1: string, code2: string): boolean {
  const parsed1 = parseTaxonomyCode(code1);
  const parsed2 = parseTaxonomyCode(code2);
  return (
    parsed1.tier1 === parsed2.tier1 && parsed1.tier2 === parsed2.tier2
  );
}

/**
 * Check if two taxonomy codes use the same chemistry
 * (same tier 7)
 */
export function isSameChemistry(code1: string, code2: string): boolean {
  const parsed1 = parseTaxonomyCode(code1);
  const parsed2 = parseTaxonomyCode(code2);
  return parsed1.tier7 === parsed2.tier7;
}

// ============================================
// CODE SEARCH & MATCHING
// ============================================

/**
 * Create a search pattern from partial code
 * Supports wildcards: * = any characters, ? = single character
 */
export function createSearchPattern(partialCode: string): RegExp {
  const escaped = partialCode
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
}

/**
 * Match a taxonomy code against a pattern
 */
export function matchesTaxonomyPattern(
  code: string,
  pattern: string,
): boolean {
  const regex = createSearchPattern(pattern);
  return regex.test(code);
}

/**
 * Get human-readable tier names
 */
export function getTierName(tierNumber: number): string {
  const names: Record<number, string> = {
    1: 'Division',
    2: 'Category',
    3: 'Assembly Type',
    4: 'Condition',
    5: 'Manufacturer',
    6: 'Product Variant',
    7: 'Base Chemistry',
    8: 'Reinforcement',
    9: 'Surface Treatment',
    10: 'Thickness Class',
    11: 'Color/Reflectivity',
    12: 'Fire Rating',
    13: 'Perm Rating',
    14: 'Tensile Strength',
    15: 'Elongation',
    16: 'Temperature Range',
    17: 'Failure Modes',
    18: 'Compatibility',
    19: 'Constraints',
    20: 'Code References',
  };
  return names[tierNumber] || `Tier ${tierNumber}`;
}

/**
 * Get tier group name
 */
export function getTierGroup(tierNumber: number): string {
  if (tierNumber >= 1 && tierNumber <= 6) return 'Classification';
  if (tierNumber >= 7 && tierNumber <= 12) return 'Physical Properties';
  if (tierNumber >= 13 && tierNumber <= 16) return 'Performance Metrics';
  if (tierNumber >= 17 && tierNumber <= 20) return 'Engineering DNA';
  return 'Unknown';
}
