/**
 * PREDEFINED CONSTANTS
 *
 * Standard values for divisions, categories, manufacturers, and other
 * common reference data used throughout the DNA taxonomy system.
 */

import type {
  Division,
  Category,
  Manufacturer,
  Reinforcement,
  ThicknessClass,
  FireRating,
  PermRating,
} from '../types';

// ============================================
// CSI DIVISIONS (TIER 1)
// ============================================

export const DIVISIONS: Record<string, Division> = {
  '03': {
    code: '03',
    name: 'Concrete',
    masterFormatRef: '03 00 00',
    description: 'Cast-in-place and precast concrete',
  },
  '04': {
    code: '04',
    name: 'Masonry',
    masterFormatRef: '04 00 00',
    description: 'Unit masonry, stone, and assemblies',
  },
  '05': {
    code: '05',
    name: 'Metals',
    masterFormatRef: '05 00 00',
    description: 'Structural and miscellaneous metals',
  },
  '06': {
    code: '06',
    name: 'Wood, Plastics, and Composites',
    masterFormatRef: '06 00 00',
    description: 'Rough and finish carpentry, composites',
  },
  '07': {
    code: '07',
    name: 'Thermal & Moisture Protection',
    masterFormatRef: '07 00 00',
    description:
      'Waterproofing, dampproofing, insulation, roofing, siding, flashing',
  },
  '08': {
    code: '08',
    name: 'Openings',
    masterFormatRef: '08 00 00',
    description: 'Doors, windows, entrances, storefronts, glazing',
  },
  '09': {
    code: '09',
    name: 'Finishes',
    masterFormatRef: '09 00 00',
    description: 'Plaster, gypsum, tile, flooring, ceilings, painting',
  },
  '32': {
    code: '32',
    name: 'Exterior Improvements',
    masterFormatRef: '32 00 00',
    description: 'Paving, site improvements, planting',
  },
};

// ============================================
// CATEGORIES (TIER 2)
// ============================================

export const CATEGORIES: Record<string, Category> = {
  WP: {
    code: 'WP',
    name: 'Waterproofing',
    divisionCode: '07',
    subcategories: [
      'Below Grade',
      'Above Grade',
      'Plaza Deck',
      'Parking',
      'Tunnel',
      'Foundation',
    ],
    description: 'Materials to prevent water intrusion',
  },
  AB: {
    code: 'AB',
    name: 'Air Barriers',
    divisionCode: '07',
    subcategories: [
      'Self-Adhered',
      'Fluid-Applied',
      'Mechanically Fastened',
      'Spray-Applied',
    ],
    description: 'Materials to control air infiltration',
  },
  RF: {
    code: 'RF',
    name: 'Roofing',
    divisionCode: '07',
    subcategories: [
      'Single-Ply',
      'Modified Bitumen',
      'Built-Up',
      'Metal',
      'Shingles',
      'Liquid-Applied',
    ],
    description: 'Roof covering and weatherproofing',
  },
  IN: {
    code: 'IN',
    name: 'Insulation',
    divisionCode: '07',
    subcategories: [
      'Board Stock',
      'Spray Foam',
      'Batt',
      'Loose Fill',
      'Reflective',
    ],
    description: 'Thermal and acoustic insulation',
  },
  FL: {
    code: 'FL',
    name: 'Flashing',
    divisionCode: '07',
    subcategories: [
      'Sheet Metal',
      'Membrane',
      'Composite',
      'Self-Adhered',
    ],
    description: 'Flashing and sheet metal',
  },
  SE: {
    code: 'SE',
    name: 'Sealants',
    divisionCode: '07',
    subcategories: [
      'Silicone',
      'Polyurethane',
      'Acrylic',
      'Butyl',
      'Hybrid',
    ],
    description: 'Joint sealants and caulking',
  },
  VP: {
    code: 'VP',
    name: 'Vapor Retarders',
    divisionCode: '07',
    subcategories: ['Class I', 'Class II', 'Class III', 'Smart'],
    description: 'Vapor retarders and barriers',
  },
  DR: {
    code: 'DR',
    name: 'Drainage',
    divisionCode: '07',
    subcategories: [
      'Sheet Drain',
      'Geocomposite',
      'Drainage Mat',
      'Roof Drain',
    ],
    description: 'Drainage products and assemblies',
  },
  PT: {
    code: 'PT',
    name: 'Protection Board',
    divisionCode: '07',
    subcategories: ['Root Barrier', 'Impact Protection', 'Drainage Board'],
    description: 'Protection and accessory products',
  },
};

// ============================================
// MANUFACTURERS (TIER 5)
// ============================================

export const MANUFACTURERS: Record<string, Manufacturer> = {
  GCP: {
    code: 'GCP',
    name: 'GCP',
    fullName: 'GCP Applied Technologies (now Sika)',
    website: 'https://gcpat.com',
    techSupport: '1-866-333-3SBM',
    warranties: [
      {
        name: 'BITUTHENE 20-Year',
        durationYears: 20,
        coverage: ['Waterproofing membrane', 'Material defects'],
        requirements: ['Certified installer', 'Pre-construction meeting'],
        isNDL: true,
      },
    ],
    regions: ['North America', 'Europe', 'Asia'],
    active: true,
    parentCompany: 'Sika AG',
  },
  SIK: {
    code: 'SIK',
    name: 'Sika',
    fullName: 'Sika Corporation',
    website: 'https://usa.sika.com',
    techSupport: '1-800-933-7452',
    warranties: [],
    regions: ['Global'],
    active: true,
  },
  CAR: {
    code: 'CAR',
    name: 'Carlisle',
    fullName: 'Carlisle Construction Materials',
    website: 'https://www.carlislesyntec.com',
    techSupport: '1-800-479-6832',
    warranties: [
      {
        name: 'Platinum NDL',
        durationYears: 30,
        coverage: ['Membrane', 'Flashing', 'Labor'],
        requirements: ['Certified installer', 'Inspection'],
        isNDL: true,
      },
    ],
    regions: ['North America'],
    active: true,
  },
  FIR: {
    code: 'FIR',
    name: 'Firestone',
    fullName: 'Firestone Building Products',
    website: 'https://www.firestonebpco.com',
    techSupport: '1-800-428-4442',
    warranties: [],
    regions: ['North America', 'Europe'],
    active: true,
  },
  JMF: {
    code: 'JMF',
    name: 'Johns Manville',
    fullName: 'Johns Manville',
    website: 'https://www.jm.com',
    techSupport: '1-800-922-5922',
    warranties: [],
    regions: ['North America'],
    active: true,
    parentCompany: 'Berkshire Hathaway',
  },
  GAF: {
    code: 'GAF',
    name: 'GAF',
    fullName: 'GAF Materials Corporation',
    website: 'https://www.gaf.com',
    techSupport: '1-800-766-3411',
    warranties: [],
    regions: ['North America'],
    active: true,
  },
  TRM: {
    code: 'TRM',
    name: 'Tremco',
    fullName: 'Tremco Incorporated',
    website: 'https://www.tremcoinc.com',
    techSupport: '1-800-321-7906',
    warranties: [],
    regions: ['North America'],
    active: true,
    parentCompany: 'RPM International',
  },
  HNR: {
    code: 'HNR',
    name: 'Henry',
    fullName: 'Henry Company',
    website: 'https://www.henry.com',
    techSupport: '1-800-486-1278',
    warranties: [],
    regions: ['North America'],
    active: true,
  },
  POL: {
    code: 'POL',
    name: 'Polyguard',
    fullName: 'Polyguard Products, Inc.',
    website: 'https://www.polyguard.com',
    techSupport: '1-214-515-5000',
    warranties: [],
    regions: ['North America'],
    active: true,
  },
  WRM: {
    code: 'WRM',
    name: 'W.R. Meadows',
    fullName: 'W.R. Meadows, Inc.',
    website: 'https://www.wrmeadows.com',
    techSupport: '1-800-342-5976',
    warranties: [],
    regions: ['North America'],
    active: true,
  },
  CET: {
    code: 'CET',
    name: 'Cetco',
    fullName: 'CETCO (Minerals Technologies)',
    website: 'https://www.cetco.com',
    techSupport: '1-800-527-9948',
    warranties: [],
    regions: ['Global'],
    active: true,
  },
  SOF: {
    code: 'SOF',
    name: 'Soprema',
    fullName: 'Soprema, Inc.',
    website: 'https://www.soprema.us',
    techSupport: '1-800-356-3521',
    warranties: [],
    regions: ['North America', 'Europe'],
    active: true,
  },
};

// ============================================
// REINFORCEMENT TYPES (TIER 8)
// ============================================

export const REINFORCEMENTS: Record<string, Reinforcement> = {
  PF: {
    code: 'PF',
    type: 'polyester',
    weight: 180,
    weightUnit: 'g/sqm',
    orientation: 'random',
    addsTensileStrength: true,
    addsPunctureResistance: true,
    addsDimensionalStability: false,
    addsFireResistance: false,
    description: 'Non-woven polyester fabric for tensile strength and puncture resistance',
  },
  FG: {
    code: 'FG',
    type: 'fiberglass',
    weight: 160,
    weightUnit: 'g/sqm',
    orientation: 'woven',
    addsTensileStrength: true,
    addsPunctureResistance: false,
    addsDimensionalStability: true,
    addsFireResistance: true,
    description: 'Fiberglass mat for dimensional stability and fire resistance',
  },
  PG: {
    code: 'PG',
    type: 'polyester-glass',
    weight: 250,
    weightUnit: 'g/sqm',
    orientation: 'cross-laminated',
    addsTensileStrength: true,
    addsPunctureResistance: true,
    addsDimensionalStability: true,
    addsFireResistance: true,
    description: 'Combination reinforcement for all-around performance',
  },
  SC: {
    code: 'SC',
    type: 'scrim',
    weight: 40,
    weightUnit: 'g/sqm',
    orientation: 'woven',
    addsTensileStrength: false,
    addsPunctureResistance: false,
    addsDimensionalStability: true,
    addsFireResistance: false,
    description: 'Light scrim for dimensional stability',
  },
  FL: {
    code: 'FL',
    type: 'fleece',
    weight: 200,
    weightUnit: 'g/sqm',
    orientation: 'random',
    addsTensileStrength: false,
    addsPunctureResistance: false,
    addsDimensionalStability: false,
    addsFireResistance: false,
    description: 'Fleece back for adhered systems',
  },
  NN: {
    code: 'NN',
    type: 'none',
    orientation: 'none',
    addsTensileStrength: false,
    addsPunctureResistance: false,
    addsDimensionalStability: false,
    addsFireResistance: false,
    description: 'Unreinforced membrane',
  },
};

// ============================================
// THICKNESS CLASSES (TIER 10)
// ============================================

export const THICKNESS_CLASSES: Record<string, ThicknessClass> = {
  T40: {
    code: 'T40',
    nominalMils: 40,
    nominalMM: 1.0,
    tolerancePlus: 5,
    toleranceMinus: 3,
    punctureResistance: 'low',
    installationDifficulty: 'easy',
    weightClass: 'light',
    description: 'Standard self-adhered membrane thickness',
  },
  T45: {
    code: 'T45',
    nominalMils: 45,
    nominalMM: 1.14,
    tolerancePlus: 5,
    toleranceMinus: 3,
    punctureResistance: 'medium',
    installationDifficulty: 'easy',
    weightClass: 'light',
  },
  T60: {
    code: 'T60',
    nominalMils: 60,
    nominalMM: 1.5,
    tolerancePlus: 5,
    toleranceMinus: 5,
    punctureResistance: 'medium',
    installationDifficulty: 'easy',
    weightClass: 'medium',
    description: 'Heavy-duty self-adhered or single-ply',
  },
  T80: {
    code: 'T80',
    nominalMils: 80,
    nominalMM: 2.0,
    tolerancePlus: 5,
    toleranceMinus: 5,
    punctureResistance: 'high',
    installationDifficulty: 'moderate',
    weightClass: 'medium',
  },
  T90: {
    code: 'T90',
    nominalMils: 90,
    nominalMM: 2.3,
    tolerancePlus: 5,
    toleranceMinus: 5,
    punctureResistance: 'high',
    installationDifficulty: 'moderate',
    weightClass: 'heavy',
    description: 'Premium single-ply roofing',
  },
  T115: {
    code: 'T115',
    nominalMils: 115,
    nominalMM: 2.9,
    tolerancePlus: 10,
    toleranceMinus: 10,
    punctureResistance: 'very-high',
    installationDifficulty: 'difficult',
    weightClass: 'heavy',
    description: 'Heavy-duty HDPE or specialty membrane',
  },
};

// ============================================
// FIRE RATINGS (TIER 12)
// ============================================

export const FIRE_RATINGS: Record<string, FireRating> = {
  FA: {
    code: 'FA',
    class: 'A',
    ul790: true,
    astmE108: true,
    ul263: false,
    requiresFireBarrier: false,
    requiresGypsum: false,
    notes: 'Highest fire rating, suitable for most applications',
  },
  FB: {
    code: 'FB',
    class: 'B',
    ul790: true,
    astmE108: true,
    ul263: false,
    requiresFireBarrier: false,
    requiresGypsum: false,
    notes: 'Good fire rating for most commercial applications',
  },
  FC: {
    code: 'FC',
    class: 'C',
    ul790: true,
    astmE108: true,
    ul263: false,
    requiresFireBarrier: false,
    requiresGypsum: false,
    notes: 'Minimum acceptable fire rating',
  },
  FU: {
    code: 'FU',
    class: 'Unrated',
    ul790: false,
    astmE108: false,
    ul263: false,
    requiresFireBarrier: true,
    requiresGypsum: false,
    notes: 'Requires additional fire protection measures',
  },
};

// ============================================
// PERM RATINGS (TIER 13)
// ============================================

export const PERM_RATINGS: Record<string, PermRating> = {
  PI: {
    code: 'PI',
    class: 'I',
    perms: 0.05,
    permMetric: 2.9,
    vaporBarrier: true,
    vaporRetarder: false,
    vaporPermeable: false,
    requiresVentilation: true,
    canTrapMoisture: true,
    dryingPotential: 'none',
    testMethod: 'ASTM E96 A',
    notes: 'Vapor barrier - prevents moisture movement',
  },
  PII: {
    code: 'PII',
    class: 'II',
    perms: 0.5,
    permMetric: 29,
    vaporBarrier: false,
    vaporRetarder: true,
    vaporPermeable: false,
    requiresVentilation: false,
    canTrapMoisture: true,
    dryingPotential: 'low',
    testMethod: 'ASTM E96 A',
    notes: 'Vapor retarder - limits moisture movement',
  },
  PIII: {
    code: 'PIII',
    class: 'III',
    perms: 5.0,
    permMetric: 290,
    vaporBarrier: false,
    vaporRetarder: false,
    vaporPermeable: true,
    requiresVentilation: false,
    canTrapMoisture: false,
    dryingPotential: 'high',
    testMethod: 'ASTM E96 B',
    notes: 'Vapor permeable - allows moisture drying',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getDivision(code: string): Division | undefined {
  return DIVISIONS[code];
}

export function getCategory(code: string): Category | undefined {
  return CATEGORIES[code];
}

export function getManufacturer(code: string): Manufacturer | undefined {
  return MANUFACTURERS[code];
}

export function getReinforcement(code: string): Reinforcement | undefined {
  return REINFORCEMENTS[code];
}

export function getThicknessClass(code: string): ThicknessClass | undefined {
  return THICKNESS_CLASSES[code];
}

export function getFireRating(code: string): FireRating | undefined {
  return FIRE_RATINGS[code];
}

export function getPermRating(code: string): PermRating | undefined {
  return PERM_RATINGS[code];
}
