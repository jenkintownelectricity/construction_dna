/**
 * MATERIAL DNA - MAIN INTERFACE
 *
 * The complete 20-Tier Material DNA structure
 * This is the "genetic code" of a construction material
 *
 * Structure:
 * - Tiers 1-6:   Classification (WHAT is it?)
 * - Tiers 7-12:  Physical Properties (WHAT is it made of?)
 * - Tiers 13-16: Performance Metrics (HOW does it perform?)
 * - Tiers 17-20: Engineering DNA (HOW does it behave?)
 */

import type { Classification } from './classification';
import type { PhysicalProperties } from './physical';
import type { PerformanceMetrics, ExtendedPerformance } from './performance';
import type { EngineeringDNA } from './engineering';

// ============================================
// MATERIAL DNA - CORE INTERFACE
// ============================================

/**
 * Complete 20-Tier Material DNA
 *
 * This interface represents the complete genetic code of a construction
 * material, enabling:
 * - Engineering problem solving
 * - Failure mode prediction
 * - Material compatibility checking
 * - Performance calculations
 * - Code compliance verification
 *
 * @example
 * ```typescript
 * const bituthene3000: MaterialDNA = {
 *   id: 'GCP-B3K-001',
 *   taxonomyCode: '07-WP-FW-FT-GCP-B3K-SBS-PF-SF-T60-BLK-FA-PI-TH-EF-TC-...',
 *   classification: { ... },
 *   physical: { ... },
 *   performance: { ... },
 *   engineering: { ... },
 *   metadata: { ... }
 * };
 * ```
 */
export interface MaterialDNA {
  // ----------------------------------------
  // IDENTITY
  // ----------------------------------------

  /** Unique identifier for this DNA record */
  id: string;

  /**
   * Full 20-tier taxonomy code
   * Format: XX-XX-XX-XX-XXX-XXX-XX-XX-XX-XX-XX-XX-XX-XX-XX-XX-XXXX-XX-XX-XXXX
   */
  taxonomyCode: string;

  // ----------------------------------------
  // TIERS 1-6: CLASSIFICATION
  // ----------------------------------------

  /** Classification tiers (1-6): WHAT is this material? */
  classification: Classification;

  // ----------------------------------------
  // TIERS 7-12: PHYSICAL PROPERTIES
  // ----------------------------------------

  /** Physical property tiers (7-12): WHAT is it made of? */
  physical: PhysicalProperties;

  // ----------------------------------------
  // TIERS 13-16: PERFORMANCE METRICS
  // ----------------------------------------

  /** Performance metric tiers (13-16): HOW does it perform? */
  performance: PerformanceMetrics;

  // ----------------------------------------
  // TIERS 17-20: ENGINEERING DNA
  // ----------------------------------------

  /** Engineering DNA tiers (17-20): HOW does it behave? */
  engineering: EngineeringDNA;

  // ----------------------------------------
  // METADATA
  // ----------------------------------------

  /** DNA record metadata */
  metadata: MaterialDNAMetadata;

  // ----------------------------------------
  // OPTIONAL EXTENSIONS
  // ----------------------------------------

  /** Extended performance data (optional additional metrics) */
  extendedPerformance?: ExtendedPerformance;

  /** Related materials (alternatives, accessories) */
  relatedMaterials?: RelatedMaterial[];

  /** Installation instructions reference */
  installationRef?: InstallationReference;

  /** Custom/user-defined fields */
  custom?: Record<string, unknown>;
}

// ============================================
// METADATA
// ============================================

/**
 * Material DNA metadata
 */
export interface MaterialDNAMetadata {
  /** Creation timestamp (ISO 8601) */
  created: string;
  /** Last update timestamp (ISO 8601) */
  updated: string;
  /** Version number */
  version: number;

  // Validation status
  /** Has been validated by expert */
  expertValidated: boolean;
  /** Expert who validated */
  validatedBy?: string;
  /** Validation date */
  validatedDate?: string;
  /** Validation notes */
  validationNotes?: string;

  // Data quality
  /** Data completeness score (0-100) */
  completeness: number;
  /** Data confidence score (0-100) */
  confidence: number;
  /** Data sources used */
  dataSources: DataSource[];

  // Tracking
  /** Who created this record */
  createdBy?: string;
  /** Who last updated */
  updatedBy?: string;
  /** Change log */
  changeLog?: ChangeLogEntry[];

  /** Tags for organization */
  tags?: string[];
}

/**
 * Data source reference
 */
export interface DataSource {
  /** Source type */
  type: 'manufacturer' | 'testing' | 'literature' | 'experience' | 'ai-extracted';
  /** Source name/description */
  name: string;
  /** URL if available */
  url?: string;
  /** Date accessed/retrieved */
  date?: string;
  /** Reliability score (0-100) */
  reliability?: number;
}

/**
 * Change log entry
 */
export interface ChangeLogEntry {
  /** Change timestamp */
  timestamp: string;
  /** Who made the change */
  user: string;
  /** What was changed */
  field: string;
  /** Previous value (as string) */
  oldValue?: string;
  /** New value (as string) */
  newValue?: string;
  /** Reason for change */
  reason?: string;
}

// ============================================
// RELATED MATERIALS
// ============================================

/**
 * Related material reference
 */
export interface RelatedMaterial {
  /** Related material DNA ID */
  id: string;
  /** Relationship type */
  relationship: MaterialRelationship;
  /** Notes on relationship */
  notes?: string;
}

/** Material relationship types */
export type MaterialRelationship =
  | 'primer'           // Required primer
  | 'adhesive'         // Compatible adhesive
  | 'accessory'        // Accessory product
  | 'alternative'      // Alternative product
  | 'successor'        // Newer version
  | 'predecessor'      // Older version
  | 'complementary'    // Used together
  | 'system-component' // Part of a system
  | 'compatible';      // Generally compatible

// ============================================
// INSTALLATION REFERENCE
// ============================================

/**
 * Installation instructions reference
 */
export interface InstallationReference {
  /** Installation guide URL */
  guideUrl?: string;
  /** Video instruction URL */
  videoUrl?: string;
  /** CAD detail URL */
  cadUrl?: string;
  /** BIM object URL */
  bimUrl?: string;
  /** Spec section text */
  specSection?: string;
  /** Quick reference steps */
  quickSteps?: string[];
  /** Required tools */
  requiredTools?: string[];
  /** Safety requirements */
  safetyRequirements?: string[];
}

// ============================================
// DNA SUMMARY (For Quick Access)
// ============================================

/**
 * Abbreviated DNA summary for quick reference
 */
export interface MaterialDNASummary {
  /** DNA ID */
  id: string;
  /** Taxonomy code */
  taxonomyCode: string;
  /** Product name */
  name: string;
  /** Manufacturer code */
  manufacturer: string;
  /** Chemistry type */
  chemistry: string;
  /** Primary category */
  category: string;
  /** Is vapor barrier */
  isVaporBarrier: boolean;
  /** Fire class */
  fireClass: string;
  /** Completeness score */
  completeness: number;
}

/**
 * Extract summary from full DNA
 */
export function extractDNASummary(dna: MaterialDNA): MaterialDNASummary {
  return {
    id: dna.id,
    taxonomyCode: dna.taxonomyCode,
    name: dna.classification.tier6_productVariant.name,
    manufacturer: dna.classification.tier5_manufacturer.code,
    chemistry: dna.physical.tier7_baseChemistry.code,
    category: dna.classification.tier2_category.code,
    isVaporBarrier: dna.performance.tier13_permRating.vaporBarrier,
    fireClass: dna.physical.tier12_fireRating.class,
    completeness: dna.metadata.completeness,
  };
}

// ============================================
// DNA COLLECTION TYPES
// ============================================

/**
 * Collection of Material DNAs (DNA Library)
 */
export interface DNALibrary {
  /** Library ID */
  id: string;
  /** Library name */
  name: string;
  /** Library description */
  description?: string;
  /** Library version */
  version: string;
  /** All DNA records */
  materials: MaterialDNA[];
  /** Created timestamp */
  created: string;
  /** Updated timestamp */
  updated: string;
  /** Library metadata */
  metadata?: Record<string, unknown>;
}

/**
 * DNA query/filter options
 */
export interface DNAQueryOptions {
  /** Filter by manufacturer code */
  manufacturer?: string;
  /** Filter by category code */
  category?: string;
  /** Filter by chemistry type */
  chemistry?: string;
  /** Filter by fire class */
  fireClass?: string;
  /** Filter vapor barriers only */
  vaporBarrierOnly?: boolean;
  /** Minimum completeness score */
  minCompleteness?: number;
  /** Expert validated only */
  validatedOnly?: boolean;
  /** Search in name/description */
  search?: string;
  /** Maximum results */
  limit?: number;
  /** Result offset */
  offset?: number;
  /** Sort field */
  sortBy?: keyof MaterialDNA | 'name' | 'manufacturer' | 'updated';
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}
