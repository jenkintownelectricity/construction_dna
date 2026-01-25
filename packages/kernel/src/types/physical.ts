/**
 * TIER 7-12: PHYSICAL PROPERTIES TYPES
 *
 * These tiers answer: "WHAT is it made of?"
 *
 * Tier 7:  Base Chemistry (SBS, APP, TPO, EPDM, etc.)
 * Tier 8:  Reinforcement (Polyester, Fiberglass, None)
 * Tier 9:  Surface Treatment (Granule, Smooth, Film)
 * Tier 10: Thickness Class (40 mil, 60 mil, 90 mil)
 * Tier 11: Color/Reflectivity (White, Black, Tan, SRI value)
 * Tier 12: Fire Rating (Class A, B, C, Unrated)
 */

// ============================================
// TIER 7: BASE CHEMISTRY
// ============================================

/**
 * Base chemistry/polymer type
 * This is the fundamental "DNA" of the material
 */
export interface BaseChemistry {
  /** Chemistry code (e.g., "SBS", "TPO", "EPDM") */
  code: string;
  /** Chemistry name (e.g., "Styrene-Butadiene-Styrene") */
  name: string;
  /** Chemistry type category */
  type: ChemistryType;

  // Chemical composition
  /** Primary polymer */
  primaryPolymer: string;
  /** Modifiers and additives */
  modifiers: string[];

  // Behavior characteristics
  /** Is thermoplastic (can be welded with heat) */
  isThermoplastic: boolean;
  /** Is thermoset (cures/crosslinks) */
  isThermoset: boolean;
  /** Is elastomeric (stretches and recovers) */
  isElastomeric: boolean;

  // Key properties derived from chemistry
  /** UV stability rating */
  uvStability: StabilityRating;
  /** Chemical resistance properties */
  chemicalResistance: ChemicalResistance;
  /** How material ages over time */
  agingCharacteristics: string;

  // Joining method
  /** How this material is typically joined/seamed */
  joiningMethod: JoiningMethod;
}

/** Chemistry type classification */
export type ChemistryType =
  | 'SBS'       // Styrene-Butadiene-Styrene (rubber-like, flexible in cold)
  | 'APP'       // Atactic Polypropylene (plastic-like, heat resistant)
  | 'TPO'       // Thermoplastic Polyolefin (weldable, white)
  | 'PVC'       // Polyvinyl Chloride (weldable, flexible)
  | 'EPDM'      // Ethylene Propylene Diene Monomer (rubber, black)
  | 'KEE'       // Ketone Ethylene Ester (high-performance PVC)
  | 'HDPE'      // High-Density Polyethylene (tough, chemical resistant)
  | 'LDPE'      // Low-Density Polyethylene (flexible film)
  | 'PIB'       // Polyisobutylene (self-healing, gas barrier)
  | 'PU'        // Polyurethane (fluid-applied, versatile)
  | 'Acrylic'   // Acrylic (fluid-applied, breathable)
  | 'Silicone'  // Silicone (high temp, UV stable)
  | 'Bitumen'   // Asphalt-based (traditional, proven)
  | 'PMMA'      // Polymethyl methacrylate (liquid-applied)
  | 'Epoxy'     // Epoxy-based systems
  | 'Hybrid';   // Multiple chemistries combined

/** Stability rating levels */
export type StabilityRating = 'excellent' | 'good' | 'fair' | 'poor';

/** Chemical resistance profile */
export interface ChemicalResistance {
  /** Resistance to acids */
  acids: StabilityRating;
  /** Resistance to alkalis/bases */
  alkalis: StabilityRating;
  /** Resistance to solvents */
  solvents: StabilityRating;
  /** Resistance to oils */
  oils: StabilityRating;
  /** Resistance to ozone */
  ozone: StabilityRating;
  /** Resistance to water */
  water?: StabilityRating;
  /** Resistance to salts */
  salts?: StabilityRating;
}

/** How materials are joined/seamed */
export type JoiningMethod =
  | 'heat-weld'      // Hot air welding
  | 'solvent-weld'   // Solvent/chemical welding
  | 'adhesive'       // Adhesive/mastic
  | 'self-adhered'   // Pressure-sensitive adhesive
  | 'tape'           // Seam tape
  | 'torch'          // Torch-applied (heat)
  | 'cold-applied'   // Cold adhesive
  | 'mechanical';    // Mechanical fastening

// ============================================
// TIER 8: REINFORCEMENT
// ============================================

/**
 * Reinforcement layer information
 */
export interface Reinforcement {
  /** Reinforcement code (e.g., "PF", "FG", "NN") */
  code: string;
  /** Reinforcement type */
  type: ReinforcementType;
  /** Weight in oz/sq yd (or g/m² in metric) */
  weight?: number;
  /** Weight unit */
  weightUnit?: 'oz/sqyd' | 'g/sqm';
  /** Fiber orientation */
  orientation: ReinforcementOrientation;

  // What reinforcement provides
  /** Adds tensile strength */
  addsTensileStrength: boolean;
  /** Adds puncture resistance */
  addsPunctureResistance: boolean;
  /** Adds dimensional stability */
  addsDimensionalStability: boolean;
  /** Adds fire resistance */
  addsFireResistance: boolean;

  /** Description of reinforcement benefits */
  description?: string;
}

/** Reinforcement material types */
export type ReinforcementType =
  | 'polyester'         // High tensile, good elongation
  | 'fiberglass'        // Dimensional stability, fire resistance
  | 'polyester-glass'   // Combo - best of both
  | 'scrim'             // Light reinforcement
  | 'film'              // HDPE/LDPE backing
  | 'foil'              // Aluminum facing
  | 'fleece'            // Polyester fleece (for adhered systems)
  | 'fabric'            // Woven fabric
  | 'mesh'              // Open mesh reinforcement
  | 'none';             // Unreinforced

/** Reinforcement fiber orientation */
export type ReinforcementOrientation =
  | 'random'           // Random fiber orientation
  | 'woven'            // Woven pattern
  | 'cross-laminated'  // Cross-laminated layers
  | 'unidirectional'   // Fibers in one direction
  | 'none';            // No reinforcement

// ============================================
// TIER 9: SURFACE TREATMENT
// ============================================

/**
 * Surface treatment/finish
 */
export interface SurfaceTreatment {
  /** Surface treatment code */
  code: string;
  /** Surface type */
  type: SurfaceType;

  // Visual characteristics
  /** Color description */
  color: string;
  /** Surface texture */
  texture: SurfaceTexture;

  // Functional characteristics
  /** Is walkable without additional protection */
  walkable: boolean;
  /** Solar Reflectance Index (0-100+) */
  reflectiveSRI?: number;
  /** Can be left exposed to weather */
  exposureRated: boolean;
  /** Must be covered/protected */
  requiresCovering: boolean;

  /** Description */
  description?: string;
}

/** Surface type classification */
export type SurfaceType =
  | 'mineral-granule'   // Ceramic-coated granules (cap sheets)
  | 'smooth-film'       // HDPE/LDPE film (self-adhered)
  | 'sand-surface'      // Fine sand (base sheets)
  | 'fabric-surface'    // Polyester/fleece face
  | 'foil-face'         // Aluminum foil (radiant barrier)
  | 'coated'            // Factory-applied coating
  | 'textured'          // Textured surface
  | 'embossed'          // Embossed pattern
  | 'untreated';        // Raw material surface

/** Surface texture */
export type SurfaceTexture =
  | 'smooth'
  | 'granular'
  | 'textured'
  | 'fabric'
  | 'film'
  | 'matte'
  | 'glossy';

// ============================================
// TIER 10: THICKNESS CLASS
// ============================================

/**
 * Material thickness classification
 */
export interface ThicknessClass {
  /** Thickness class code (e.g., "T40", "T60", "T90") */
  code: string;
  /** Nominal thickness in mils (thousandths of inch) */
  nominalMils: number;
  /** Nominal thickness in millimeters */
  nominalMM: number;
  /** Plus tolerance in mils */
  tolerancePlus: number;
  /** Minus tolerance in mils */
  toleranceMinus: number;

  // Thickness implications
  /** Puncture resistance level */
  punctureResistance: ResistanceLevel;
  /** Installation difficulty */
  installationDifficulty: DifficultyLevel;
  /** Weight class */
  weightClass?: 'light' | 'medium' | 'heavy';

  /** Description */
  description?: string;
}

/** Resistance level classification */
export type ResistanceLevel = 'low' | 'medium' | 'high' | 'very-high';

/** Difficulty level classification */
export type DifficultyLevel = 'easy' | 'moderate' | 'difficult';

// ============================================
// TIER 11: COLOR/REFLECTIVITY
// ============================================

/**
 * Color and reflectivity properties
 */
export interface ColorReflectivity {
  /** Color code (e.g., "WHT", "BLK", "TAN") */
  code: string;
  /** Color name */
  colorName: string;
  /** Hex color for display */
  hexColor: string;

  // Thermal properties
  /** Solar Reflectance Index (0-100+) */
  sri: number;
  /** Solar reflectance (0-1) */
  reflectance: number;
  /** Thermal emittance (0-1) */
  emittance: number;

  // Code compliance
  /** Meets ENERGY STAR requirements */
  meetsEnergyStar: boolean;
  /** Meets Cool Roof Rating Council standards */
  meetsCoolRoof: boolean;
  /** Meets California Title 24 */
  meetsTitle24: boolean;
  /** Meets LEED credit requirements */
  meetsLEED?: boolean;

  /** Initial vs aged values */
  agedReflectance?: number;
  agedEmittance?: number;
  agedSRI?: number;
}

// ============================================
// TIER 12: FIRE RATING
// ============================================

/**
 * Fire rating and performance
 */
export interface FireRating {
  /** Fire rating code (e.g., "FA", "FB", "FC", "FU") */
  code: string;
  /** Fire class */
  class: FireClass;

  // Test standards compliance
  /** UL 790 tested (roof fire tests) */
  ul790: boolean;
  /** ASTM E108 tested (roof fire) */
  astmE108: boolean;
  /** UL 263 tested (fire resistance) */
  ul263: boolean;
  /** FM Global approval number */
  fmApproval?: string;
  /** UL listing number */
  ulListing?: string;

  // Assembly requirements
  /** Requires fire barrier below */
  requiresFireBarrier: boolean;
  /** Requires gypsum board */
  requiresGypsum: boolean;
  /** Maximum insulation thickness for rating */
  maxInsulationThickness?: number;

  /** Notes on fire testing */
  notes?: string;
}

/** Fire class ratings */
export type FireClass = 'A' | 'B' | 'C' | 'Unrated';

// ============================================
// PHYSICAL PROPERTIES COMBINED TYPE
// ============================================

/**
 * Complete physical properties tiers (7-12)
 */
export interface PhysicalProperties {
  /** Tier 7: Base Chemistry */
  tier7_baseChemistry: BaseChemistry;
  /** Tier 8: Reinforcement */
  tier8_reinforcement: Reinforcement;
  /** Tier 9: Surface Treatment */
  tier9_surfaceTreatment: SurfaceTreatment;
  /** Tier 10: Thickness Class */
  tier10_thicknessClass: ThicknessClass;
  /** Tier 11: Color/Reflectivity */
  tier11_colorReflectivity: ColorReflectivity;
  /** Tier 12: Fire Rating */
  tier12_fireRating: FireRating;
}
