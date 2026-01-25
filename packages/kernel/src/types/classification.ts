/**
 * TIER 1-6: CLASSIFICATION TYPES
 *
 * These tiers answer: "WHAT is this material?"
 *
 * Tier 1: Division (CSI MasterFormat)
 * Tier 2: Category (Roofing, Waterproofing, etc.)
 * Tier 3: Assembly Type (Edge, Penetration, etc.)
 * Tier 4: Condition (Parapet, Curb, etc.)
 * Tier 5: Manufacturer (GCP, Carlisle, etc.)
 * Tier 6: Product Variant (Specific SKU)
 */

// ============================================
// TIER 1: DIVISION (CSI MasterFormat)
// ============================================

/**
 * CSI MasterFormat Division
 * Standard construction specification divisions
 */
export interface Division {
  /** Division code (e.g., "07") */
  code: string;
  /** Division name (e.g., "Thermal & Moisture Protection") */
  name: string;
  /** MasterFormat reference number */
  masterFormatRef: string;
  /** Optional description */
  description?: string;
}

/** Pre-defined CSI MasterFormat divisions relevant to building envelope */
export type DivisionCode =
  | '03'  // Concrete
  | '04'  // Masonry
  | '05'  // Metals
  | '06'  // Wood, Plastics, and Composites
  | '07'  // Thermal & Moisture Protection
  | '08'  // Openings
  | '09'  // Finishes
  | '32'; // Exterior Improvements

// ============================================
// TIER 2: CATEGORY
// ============================================

/**
 * Material category within a division
 */
export interface Category {
  /** Category code (e.g., "WP", "AB", "RF", "IN", "FL") */
  code: string;
  /** Category name (e.g., "Waterproofing") */
  name: string;
  /** List of subcategories */
  subcategories: string[];
  /** Parent division code */
  divisionCode: string;
  /** Description of the category */
  description?: string;
}

/** Standard category codes */
export type CategoryCode =
  | 'WP'   // Waterproofing
  | 'AB'   // Air Barriers
  | 'RF'   // Roofing
  | 'IN'   // Insulation
  | 'FL'   // Flashing
  | 'SE'   // Sealants
  | 'VP'   // Vapor Retarders
  | 'FP'   // Fireproofing
  | 'AC'   // Acoustical
  | 'CL'   // Cladding
  | 'DR'   // Drainage
  | 'PT'   // Protection Board;

// ============================================
// TIER 3: ASSEMBLY TYPE
// ============================================

/**
 * Type of assembly or application
 */
export interface AssemblyType {
  /** Assembly type code (e.g., "FW", "ET", "PN", "DR") */
  code: string;
  /** Assembly type name (e.g., "Foundation Wall", "Edge Termination") */
  name: string;
  /** Typical number of layers in this assembly */
  typicalLayers: number;
  /** Common conditions this assembly type applies to */
  commonConditions: string[];
  /** Geometry type for this assembly */
  geometryType: AssemblyGeometryType;
  /** Description */
  description?: string;
}

/** Assembly geometry classification */
export type AssemblyGeometryType =
  | 'planar'      // Flat surfaces (walls, roofs)
  | 'linear'      // Linear details (edges, joints)
  | 'point'       // Point details (penetrations, corners)
  | 'transition'; // Transitions between planes

/** Standard assembly type codes */
export type AssemblyTypeCode =
  | 'FW'   // Foundation Wall
  | 'BG'   // Below Grade
  | 'AG'   // Above Grade Wall
  | 'RF'   // Roof Field
  | 'ET'   // Edge Termination
  | 'PN'   // Penetration
  | 'EJ'   // Expansion Joint
  | 'TR'   // Transition
  | 'DR'   // Drain
  | 'FL'   // Flashing
  | 'CP'   // Cap/Coping
  | 'CR'   // Corner
  | 'PZ'   // Plaza/Deck
  | 'PK'   // Parking
  | 'GR'   // Green Roof;

// ============================================
// TIER 4: CONDITION
// ============================================

/**
 * Specific condition or detail type
 */
export interface Condition {
  /** Condition code (e.g., "PW", "GR", "CB", "EJ") */
  code: string;
  /** Condition name (e.g., "Parapet Wall", "Gravel Stop", "Curb") */
  name: string;
  /** Geometry type */
  geometryType: '2D' | '3D' | 'linear' | 'point';
  /** Critical dimensions to track */
  criticalDimensions: string[];
  /** Common failure points at this condition */
  failurePoints?: string[];
  /** Description */
  description?: string;
}

/** Standard condition codes */
export type ConditionCode =
  | 'PW'   // Parapet Wall
  | 'GS'   // Gravel Stop
  | 'CB'   // Curb
  | 'EJ'   // Expansion Joint
  | 'SJ'   // Control/Saw Joint
  | 'DP'   // Drain/Penetration
  | 'PP'   // Pipe Penetration
  | 'RD'   // Roof Drain
  | 'SK'   // Skylight
  | 'EQ'   // Equipment Support
  | 'AC'   // A/C Unit
  | 'VT'   // Vent
  | 'SC'   // Scupper
  | 'WW'   // Window/Wall Transition
  | 'DW'   // Door/Wall Transition
  | 'IC'   // Inside Corner
  | 'OC'   // Outside Corner
  | 'FT'   // Footing
  | 'WS'   // Water Stop
  | 'LD'   // Lagging/Dirt Side
  | 'TW'   // Tie-back/Waler;

// ============================================
// TIER 5: MANUFACTURER
// ============================================

/**
 * Manufacturer information
 */
export interface Manufacturer {
  /** Manufacturer code (e.g., "GCP", "CAR", "SIK") */
  code: string;
  /** Short name (e.g., "GCP") */
  name: string;
  /** Full legal name (e.g., "GCP Applied Technologies (now Sika)") */
  fullName: string;
  /** Website URL */
  website: string;
  /** Technical support contact */
  techSupport: string;
  /** Available warranties */
  warranties: WarrantyInfo[];
  /** Countries where available */
  regions?: string[];
  /** Active status */
  active: boolean;
  /** Parent company if acquired */
  parentCompany?: string;
}

/**
 * Warranty information
 */
export interface WarrantyInfo {
  /** Warranty name */
  name: string;
  /** Duration in years */
  durationYears: number;
  /** What's covered */
  coverage: string[];
  /** Requirements to maintain warranty */
  requirements: string[];
  /** Is NDL (No Dollar Limit) */
  isNDL: boolean;
}

/** Standard manufacturer codes */
export type ManufacturerCode =
  | 'GCP'   // GCP Applied Technologies (now Sika)
  | 'SIK'   // Sika
  | 'CAR'   // Carlisle
  | 'FIR'   // Firestone
  | 'JMF'   // Johns Manville
  | 'GAF'   // GAF
  | 'TRM'   // Tremco
  | 'HNR'   // Henry
  | 'POL'   // Polyguard
  | 'WRM'   // W.R. Meadows
  | 'CET'   // Cetco
  | 'GEN'   // Generics/Multiple
  | 'PRO'   // Protecto Wrap
  | 'VYC'   // Vycom/Versico
  | 'MUL'   // Mulehide
  | 'SOF'   // Soprema
  | 'IKO'   // IKO
  | 'DOW'   // Dow
  | 'BSF'   // BASF
  | 'RPL';  // Repaline

// ============================================
// TIER 6: PRODUCT VARIANT
// ============================================

/**
 * Specific product/SKU
 */
export interface ProductVariant {
  /** Product code (e.g., "B3K" for BITUTHENE 3000) */
  code: string;
  /** Product name (e.g., "BITUTHENE 3000") */
  name: string;
  /** Full product name with trademark (e.g., "BITUTHENE® 3000 Self-Adhered Membrane") */
  fullName: string;
  /** SKU or product number */
  sku: string;
  /** Available sizes */
  sizes: ProductSize[];
  /** Spec sheet URL */
  specSheetUrl: string;
  /** SDS (Safety Data Sheet) URL */
  sdsUrl: string;
  /** Installation guide URL */
  installGuideUrl?: string;
  /** CAD details URL */
  cadDetailsUrl?: string;
  /** When product was introduced */
  introduced?: string;
  /** Is product still available */
  active: boolean;
  /** Replacement product if discontinued */
  replacedBy?: string;
}

/**
 * Product size/packaging
 */
export interface ProductSize {
  /** Width in inches */
  widthIn: number;
  /** Width in mm */
  widthMm: number;
  /** Length in feet */
  lengthFt: number;
  /** Length in meters */
  lengthM: number;
  /** Coverage per roll in sq ft */
  coverageSqFt: number;
  /** Coverage per roll in sq m */
  coverageSqM: number;
  /** Weight per roll in lbs */
  weightLbs: number;
  /** Weight per roll in kg */
  weightKg: number;
  /** Rolls per pallet */
  rollsPerPallet?: number;
  /** UPC code */
  upc?: string;
}

// ============================================
// CLASSIFICATION COMBINED TYPE
// ============================================

/**
 * Complete classification tiers (1-6)
 */
export interface Classification {
  /** Tier 1: CSI Division */
  tier1_division: Division;
  /** Tier 2: Category */
  tier2_category: Category;
  /** Tier 3: Assembly Type */
  tier3_assemblyType: AssemblyType;
  /** Tier 4: Condition */
  tier4_condition: Condition;
  /** Tier 5: Manufacturer */
  tier5_manufacturer: Manufacturer;
  /** Tier 6: Product Variant */
  tier6_productVariant: ProductVariant;
}
