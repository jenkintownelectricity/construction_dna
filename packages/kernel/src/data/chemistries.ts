/**
 * PREDEFINED BASE CHEMISTRIES
 *
 * Complete chemistry profiles for common membrane/waterproofing materials
 * Each chemistry defines the fundamental behavior of materials built on it
 */

import type { BaseChemistry, ChemistryType } from '../types';

/**
 * Base chemistry database
 * Keyed by chemistry type code
 */
export const BASE_CHEMISTRIES: Record<ChemistryType, BaseChemistry> = {
  SBS: {
    code: 'SBS',
    name: 'Styrene-Butadiene-Styrene',
    type: 'SBS',
    primaryPolymer: 'SBS block copolymer with asphalt',
    modifiers: ['asphalt', 'plasticizers', 'stabilizers', 'mineral fillers'],
    isThermoplastic: false,
    isThermoset: false,
    isElastomeric: true,
    uvStability: 'fair',
    chemicalResistance: {
      acids: 'good',
      alkalis: 'good',
      solvents: 'fair',
      oils: 'fair',
      ozone: 'good',
      water: 'excellent',
    },
    agingCharacteristics:
      'Maintains flexibility in cold weather down to -20°F. May soften in extreme heat above 160°F. Excellent fatigue resistance. Surface may oxidize if exposed without granules.',
    joiningMethod: 'torch',
  },

  APP: {
    code: 'APP',
    name: 'Atactic Polypropylene',
    type: 'APP',
    primaryPolymer: 'APP modified asphalt',
    modifiers: ['asphalt', 'plasticizers', 'mineral fillers'],
    isThermoplastic: true,
    isThermoset: false,
    isElastomeric: false,
    uvStability: 'good',
    chemicalResistance: {
      acids: 'good',
      alkalis: 'good',
      solvents: 'fair',
      oils: 'fair',
      ozone: 'good',
      water: 'excellent',
    },
    agingCharacteristics:
      'Excellent heat resistance to 300°F+. Less flexible in cold than SBS. Good UV resistance even without granules. Plastic-like behavior.',
    joiningMethod: 'torch',
  },

  TPO: {
    code: 'TPO',
    name: 'Thermoplastic Polyolefin',
    type: 'TPO',
    primaryPolymer: 'Polypropylene/Polyethylene blend with rubber',
    modifiers: ['EPDM rubber', 'fillers', 'UV stabilizers', 'antioxidants'],
    isThermoplastic: true,
    isThermoset: false,
    isElastomeric: false,
    uvStability: 'excellent',
    chemicalResistance: {
      acids: 'excellent',
      alkalis: 'excellent',
      solvents: 'good',
      oils: 'good',
      ozone: 'excellent',
      water: 'excellent',
    },
    agingCharacteristics:
      'Excellent long-term UV stability. Heat-weldable seams. Energy efficient (typically white). Can become brittle if formulation has insufficient rubber content.',
    joiningMethod: 'heat-weld',
  },

  PVC: {
    code: 'PVC',
    name: 'Polyvinyl Chloride',
    type: 'PVC',
    primaryPolymer: 'Polyvinyl chloride',
    modifiers: ['plasticizers', 'stabilizers', 'fillers', 'flame retardants'],
    isThermoplastic: true,
    isThermoset: false,
    isElastomeric: false,
    uvStability: 'good',
    chemicalResistance: {
      acids: 'excellent',
      alkalis: 'excellent',
      solvents: 'fair',
      oils: 'good',
      ozone: 'good',
      water: 'excellent',
    },
    agingCharacteristics:
      'Heat-weldable with strongest seams in single-ply. Plasticizer migration possible over time. Requires separator from polystyrene insulation. Good chemical resistance.',
    joiningMethod: 'heat-weld',
  },

  EPDM: {
    code: 'EPDM',
    name: 'Ethylene Propylene Diene Monomer',
    type: 'EPDM',
    primaryPolymer: 'EPDM synthetic rubber',
    modifiers: ['carbon black', 'process oils', 'curatives', 'fillers'],
    isThermoplastic: false,
    isThermoset: true,
    isElastomeric: true,
    uvStability: 'excellent',
    chemicalResistance: {
      acids: 'excellent',
      alkalis: 'excellent',
      solvents: 'poor',
      oils: 'poor',
      ozone: 'excellent',
      water: 'excellent',
    },
    agingCharacteristics:
      'Excellent weathering and ozone resistance. INCOMPATIBLE with petroleum-based products (roof coatings, asphalt). Seams are the weak point. Typically black.',
    joiningMethod: 'adhesive',
  },

  KEE: {
    code: 'KEE',
    name: 'Ketone Ethylene Ester',
    type: 'KEE',
    primaryPolymer: 'Ketone Ethylene Ester terpolymer',
    modifiers: ['plasticizers', 'stabilizers'],
    isThermoplastic: true,
    isThermoset: false,
    isElastomeric: false,
    uvStability: 'excellent',
    chemicalResistance: {
      acids: 'excellent',
      alkalis: 'excellent',
      solvents: 'good',
      oils: 'excellent',
      ozone: 'excellent',
      water: 'excellent',
    },
    agingCharacteristics:
      'Premium PVC alternative with better plasticizer retention. Excellent chemical and grease resistance. Good for restaurants, industrial. Higher cost.',
    joiningMethod: 'heat-weld',
  },

  HDPE: {
    code: 'HDPE',
    name: 'High-Density Polyethylene',
    type: 'HDPE',
    primaryPolymer: 'High-density polyethylene',
    modifiers: ['carbon black', 'antioxidants'],
    isThermoplastic: true,
    isThermoset: false,
    isElastomeric: false,
    uvStability: 'good',
    chemicalResistance: {
      acids: 'excellent',
      alkalis: 'excellent',
      solvents: 'good',
      oils: 'good',
      ozone: 'excellent',
      water: 'excellent',
    },
    agingCharacteristics:
      'Very tough and puncture resistant. Excellent chemical resistance. Used for landfill liners, tunnels. Limited flexibility. Weldable.',
    joiningMethod: 'heat-weld',
  },

  LDPE: {
    code: 'LDPE',
    name: 'Low-Density Polyethylene',
    type: 'LDPE',
    primaryPolymer: 'Low-density polyethylene',
    modifiers: ['antioxidants', 'UV stabilizers'],
    isThermoplastic: true,
    isThermoset: false,
    isElastomeric: false,
    uvStability: 'fair',
    chemicalResistance: {
      acids: 'excellent',
      alkalis: 'excellent',
      solvents: 'fair',
      oils: 'fair',
      ozone: 'good',
      water: 'excellent',
    },
    agingCharacteristics:
      'More flexible than HDPE. Common as release film on self-adhered products. Not typically used as primary membrane. Low cost.',
    joiningMethod: 'heat-weld',
  },

  PIB: {
    code: 'PIB',
    name: 'Polyisobutylene',
    type: 'PIB',
    primaryPolymer: 'Polyisobutylene rubber',
    modifiers: ['fillers', 'stabilizers'],
    isThermoplastic: false,
    isThermoset: false,
    isElastomeric: true,
    uvStability: 'good',
    chemicalResistance: {
      acids: 'excellent',
      alkalis: 'excellent',
      solvents: 'fair',
      oils: 'fair',
      ozone: 'excellent',
      water: 'excellent',
    },
    agingCharacteristics:
      'Self-healing properties - slow cold flow seals small punctures. Excellent vapor barrier. Gas-tight. Used in curtain wall systems and as vapor barriers.',
    joiningMethod: 'self-adhered',
  },

  PU: {
    code: 'PU',
    name: 'Polyurethane',
    type: 'PU',
    primaryPolymer: 'Polyurethane',
    modifiers: ['catalysts', 'plasticizers', 'fillers'],
    isThermoplastic: false,
    isThermoset: true,
    isElastomeric: true,
    uvStability: 'fair',
    chemicalResistance: {
      acids: 'good',
      alkalis: 'fair',
      solvents: 'fair',
      oils: 'good',
      ozone: 'good',
      water: 'excellent',
    },
    agingCharacteristics:
      'Fluid-applied, seamless installation. Excellent adhesion to most substrates. Requires UV protection (topcoat). Good elongation. Moisture-sensitive during cure.',
    joiningMethod: 'cold-applied',
  },

  Acrylic: {
    code: 'ACR',
    name: 'Acrylic',
    type: 'Acrylic',
    primaryPolymer: 'Acrylic polymer emulsion',
    modifiers: ['fillers', 'thickeners', 'pigments'],
    isThermoplastic: true,
    isThermoset: false,
    isElastomeric: false,
    uvStability: 'excellent',
    chemicalResistance: {
      acids: 'fair',
      alkalis: 'fair',
      solvents: 'poor',
      oils: 'fair',
      ozone: 'excellent',
      water: 'good',
    },
    agingCharacteristics:
      'Water-based, breathable (vapor permeable). Excellent UV resistance. Re-coatable. Not suitable for ponding water. Good for wall coatings.',
    joiningMethod: 'cold-applied',
  },

  Silicone: {
    code: 'SIL',
    name: 'Silicone',
    type: 'Silicone',
    primaryPolymer: 'Silicone rubber (PDMS)',
    modifiers: ['fillers', 'catalysts', 'adhesion promoters'],
    isThermoplastic: false,
    isThermoset: true,
    isElastomeric: true,
    uvStability: 'excellent',
    chemicalResistance: {
      acids: 'good',
      alkalis: 'good',
      solvents: 'fair',
      oils: 'poor',
      ozone: 'excellent',
      water: 'excellent',
    },
    agingCharacteristics:
      'Extreme temperature range (-65°F to 400°F). Excellent UV resistance. Tolerates ponding water. Dirt pick-up possible. Premium cost.',
    joiningMethod: 'cold-applied',
  },

  Bitumen: {
    code: 'BIT',
    name: 'Bitumen/Asphalt',
    type: 'Bitumen',
    primaryPolymer: 'Oxidized or blown asphalt',
    modifiers: ['mineral fillers', 'fibers'],
    isThermoplastic: true,
    isThermoset: false,
    isElastomeric: false,
    uvStability: 'poor',
    chemicalResistance: {
      acids: 'good',
      alkalis: 'good',
      solvents: 'poor',
      oils: 'poor',
      ozone: 'fair',
      water: 'excellent',
    },
    agingCharacteristics:
      'Traditional proven technology. Requires protection from UV. Becomes brittle with age. Temperature sensitive. Low cost. Multiple ply systems.',
    joiningMethod: 'torch',
  },

  PMMA: {
    code: 'PMMA',
    name: 'Polymethyl Methacrylate',
    type: 'PMMA',
    primaryPolymer: 'Methyl methacrylate resin',
    modifiers: ['catalysts', 'fillers', 'reinforcing fibers'],
    isThermoplastic: true,
    isThermoset: false,
    isElastomeric: false,
    uvStability: 'excellent',
    chemicalResistance: {
      acids: 'good',
      alkalis: 'good',
      solvents: 'poor',
      oils: 'good',
      ozone: 'excellent',
      water: 'excellent',
    },
    agingCharacteristics:
      'Fast curing (minutes). Cold weather applicable. Excellent UV. Solvent odor during application. Good for repairs and details.',
    joiningMethod: 'cold-applied',
  },

  Epoxy: {
    code: 'EPX',
    name: 'Epoxy',
    type: 'Epoxy',
    primaryPolymer: 'Epoxy resin',
    modifiers: ['hardeners', 'fillers', 'flexibilizers'],
    isThermoplastic: false,
    isThermoset: true,
    isElastomeric: false,
    uvStability: 'poor',
    chemicalResistance: {
      acids: 'excellent',
      alkalis: 'excellent',
      solvents: 'excellent',
      oils: 'excellent',
      ozone: 'fair',
      water: 'excellent',
    },
    agingCharacteristics:
      'Excellent adhesion and chemical resistance. Hard, not flexible. Requires UV topcoat. Used for tank linings, concrete coatings.',
    joiningMethod: 'cold-applied',
  },

  Hybrid: {
    code: 'HYB',
    name: 'Hybrid/Composite',
    type: 'Hybrid',
    primaryPolymer: 'Multiple polymer combination',
    modifiers: ['varies by formulation'],
    isThermoplastic: false,
    isThermoset: false,
    isElastomeric: true,
    uvStability: 'good',
    chemicalResistance: {
      acids: 'good',
      alkalis: 'good',
      solvents: 'good',
      oils: 'good',
      ozone: 'good',
      water: 'excellent',
    },
    agingCharacteristics:
      'Properties vary by specific formulation. Designed to combine benefits of multiple chemistries. Refer to specific product data.',
    joiningMethod: 'cold-applied',
  },
};

/**
 * Get chemistry by code
 */
export function getChemistry(code: ChemistryType): BaseChemistry | undefined {
  return BASE_CHEMISTRIES[code];
}

/**
 * Get all chemistries as array
 */
export function getAllChemistries(): BaseChemistry[] {
  return Object.values(BASE_CHEMISTRIES);
}

/**
 * Get thermoplastic chemistries (heat-weldable)
 */
export function getThermoplasticChemistries(): BaseChemistry[] {
  return Object.values(BASE_CHEMISTRIES).filter((c) => c.isThermoplastic);
}

/**
 * Get elastomeric chemistries (flexible, stretchy)
 */
export function getElastomericChemistries(): BaseChemistry[] {
  return Object.values(BASE_CHEMISTRIES).filter((c) => c.isElastomeric);
}

/**
 * Get chemistries by UV stability
 */
export function getChemistriesByUVStability(
  minRating: 'excellent' | 'good' | 'fair' | 'poor',
): BaseChemistry[] {
  const ratings = ['excellent', 'good', 'fair', 'poor'];
  const minIndex = ratings.indexOf(minRating);
  return Object.values(BASE_CHEMISTRIES).filter(
    (c) => ratings.indexOf(c.uvStability) <= minIndex,
  );
}
