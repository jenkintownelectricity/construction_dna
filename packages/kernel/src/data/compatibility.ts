/**
 * PREDEFINED COMPATIBILITY RULES
 *
 * Material compatibility database for construction materials
 * Critical for preventing chemical incompatibility failures
 */

import type { CompatibilityEntry, CompatibilityMatrix, ChemistryType } from '../types';

/**
 * Master compatibility rules database
 */
export const COMPATIBILITY_RULES: CompatibilityEntry[] = [
  // ============================================
  // EPDM INCOMPATIBILITIES (Critical!)
  // ============================================
  {
    materialType: 'Petroleum-based products',
    chemistryType: 'EPDM',
    status: 'incompatible',
    reason:
      'Petroleum solvents attack EPDM rubber, causing swelling, softening, and degradation. This is irreversible.',
    source: 'manufacturer',
    reference: 'All EPDM manufacturer tech bulletins',
    verified: true,
  },
  {
    materialType: 'Asphalt/Bitumen',
    chemistryType: 'EPDM',
    status: 'incompatible',
    reason:
      'Asphalt oils migrate into EPDM causing permanent swelling and loss of physical properties.',
    source: 'manufacturer',
    reference: 'SPRI EPDM Technical Guidelines',
    verified: true,
  },
  {
    materialType: 'Coal tar coatings',
    chemistryType: 'EPDM',
    status: 'incompatible',
    reason:
      'Coal tar contains petroleum solvents that degrade EPDM rubber.',
    source: 'manufacturer',
    verified: true,
  },
  {
    materialType: 'Greases and oils',
    chemistryType: 'EPDM',
    status: 'incompatible',
    reason:
      'Animal fats, vegetable oils, and petroleum greases attack EPDM.',
    source: 'manufacturer',
    notes: 'Common issue near restaurant exhaust vents',
    verified: true,
  },
  {
    materialType: 'EPDM-compatible coatings',
    chemistryType: 'EPDM',
    status: 'compatible',
    reason: 'Acrylic and water-based coatings designed for EPDM are safe.',
    source: 'manufacturer',
    notes: 'Must be specifically rated for EPDM use',
    verified: true,
  },

  // ============================================
  // PVC INCOMPATIBILITIES
  // ============================================
  {
    materialType: 'Polystyrene insulation (EPS)',
    chemistryType: 'PVC',
    status: 'conditional',
    reason:
      'Plasticizers in PVC can migrate into expanded polystyrene, causing damage to both materials.',
    requirement: 'Requires separator sheet between PVC and EPS',
    separatorRequired: 'Polyester fabric slip sheet, minimum 10 mil polyethylene, or other approved separator',
    source: 'manufacturer',
    reference: 'PVC membrane manufacturer data sheets',
    verified: true,
  },
  {
    materialType: 'Polystyrene insulation (XPS)',
    chemistryType: 'PVC',
    status: 'conditional',
    reason:
      'Plasticizers in PVC can migrate into extruded polystyrene.',
    requirement: 'Requires separator sheet between PVC and XPS',
    separatorRequired: 'Polyester fabric slip sheet or polyethylene sheet',
    source: 'manufacturer',
    verified: true,
  },
  {
    materialType: 'Asphalt/Bitumen',
    chemistryType: 'PVC',
    status: 'incompatible',
    reason: 'Asphalt plasticizes and degrades PVC over time.',
    source: 'manufacturer',
    notes: 'Keep PVC away from any asphalt-based products',
    verified: true,
  },
  {
    materialType: 'Polyisocyanurate insulation',
    chemistryType: 'PVC',
    status: 'compatible',
    reason: 'No chemical interaction between PVC and polyiso.',
    source: 'manufacturer',
    verified: true,
  },
  {
    materialType: 'Mineral wool insulation',
    chemistryType: 'PVC',
    status: 'compatible',
    reason: 'Mineral wool is chemically inert.',
    source: 'manufacturer',
    verified: true,
  },
  {
    materialType: 'Pressure-treated wood',
    chemistryType: 'PVC',
    status: 'conditional',
    reason:
      'Some wood preservatives can attack PVC. Copper-based treatments may cause discoloration.',
    requirement: 'Use slip sheet or membrane-specific flashing',
    source: 'experience',
    verified: true,
  },

  // ============================================
  // TPO COMPATIBILITIES
  // ============================================
  {
    materialType: 'Polystyrene insulation (EPS)',
    chemistryType: 'TPO',
    status: 'compatible',
    reason: 'TPO is chemically inert to polystyrene. No plasticizers to migrate.',
    source: 'manufacturer',
    verified: true,
  },
  {
    materialType: 'Polystyrene insulation (XPS)',
    chemistryType: 'TPO',
    status: 'compatible',
    reason: 'TPO is chemically inert to polystyrene.',
    source: 'manufacturer',
    verified: true,
  },
  {
    materialType: 'Polyisocyanurate insulation',
    chemistryType: 'TPO',
    status: 'compatible',
    reason: 'No chemical interaction.',
    source: 'manufacturer',
    verified: true,
  },
  {
    materialType: 'Asphalt/Bitumen',
    chemistryType: 'TPO',
    status: 'conditional',
    reason: 'Not recommended but not immediately damaging.',
    requirement: 'Avoid if possible, use slip sheet if contact unavoidable',
    source: 'experience',
    verified: true,
  },
  {
    materialType: 'Mineral wool insulation',
    chemistryType: 'TPO',
    status: 'compatible',
    reason: 'Mineral wool is chemically inert.',
    source: 'manufacturer',
    verified: true,
  },

  // ============================================
  // SBS/APP/BITUMEN COMPATIBILITIES
  // ============================================
  {
    materialType: 'EPDM',
    chemistryType: 'SBS',
    status: 'incompatible',
    reason: 'Asphalt in SBS will damage EPDM if they come in contact.',
    source: 'industry',
    verified: true,
  },
  {
    materialType: 'EPDM',
    chemistryType: 'APP',
    status: 'incompatible',
    reason: 'Asphalt in APP will damage EPDM if they come in contact.',
    source: 'industry',
    verified: true,
  },
  {
    materialType: 'Polystyrene insulation (EPS)',
    chemistryType: 'SBS',
    status: 'conditional',
    reason: 'Hot asphalt can melt EPS. Cold-applied is acceptable.',
    requirement: 'Use thermal barrier or cold adhesive only',
    source: 'manufacturer',
    verified: true,
  },
  {
    materialType: 'Polyisocyanurate insulation',
    chemistryType: 'SBS',
    status: 'compatible',
    reason: 'Polyiso is heat-resistant and compatible with asphalt.',
    source: 'manufacturer',
    notes: 'Standard practice for mod-bit roofing',
    verified: true,
  },
  {
    materialType: 'Concrete',
    chemistryType: 'SBS',
    status: 'conditional',
    reason: 'Requires proper primer for adhesion.',
    requirement: 'Use asphalt primer or approved concrete primer',
    primerRequired: 'Asphalt primer per manufacturer spec',
    source: 'manufacturer',
    verified: true,
  },

  // ============================================
  // SILICONE COMPATIBILITIES
  // ============================================
  {
    materialType: 'Acrylic coatings',
    chemistryType: 'Silicone',
    status: 'incompatible',
    reason: 'Silicone releases oils that prevent acrylic adhesion.',
    source: 'manufacturer',
    notes: 'Cannot topcoat silicone with acrylic',
    verified: true,
  },
  {
    materialType: 'Most substrates',
    chemistryType: 'Silicone',
    status: 'compatible',
    reason: 'Silicone adheres to most clean, dry substrates.',
    source: 'manufacturer',
    verified: true,
  },
  {
    materialType: 'Dirty/contaminated surfaces',
    chemistryType: 'Silicone',
    status: 'conditional',
    reason: 'Silicone requires clean surface for adhesion.',
    requirement: 'Surface must be cleaned and may require primer',
    source: 'manufacturer',
    verified: true,
  },

  // ============================================
  // POLYURETHANE COMPATIBILITIES
  // ============================================
  {
    materialType: 'Wet/damp substrates',
    chemistryType: 'PU',
    status: 'conditional',
    reason:
      'Moisture reacts with isocyanates causing bubbling and adhesion issues.',
    requirement: 'Substrate must be dry. Test per ASTM F2170.',
    source: 'manufacturer',
    notes: 'Maximum 75% RH in substrate typically',
    verified: true,
  },
  {
    materialType: 'Concrete',
    chemistryType: 'PU',
    status: 'compatible',
    reason: 'Excellent adhesion to properly prepared concrete.',
    source: 'manufacturer',
    notes: 'Concrete must be cured and dry',
    verified: true,
  },
  {
    materialType: 'Metal',
    chemistryType: 'PU',
    status: 'conditional',
    reason: 'PU adheres well but may require primer on certain metals.',
    requirement: 'Clean and prime metal per manufacturer specs',
    primerRequired: 'Manufacturer-specified metal primer',
    source: 'manufacturer',
    verified: true,
  },

  // ============================================
  // GENERAL SUBSTRATE RULES
  // ============================================
  {
    materialType: 'Green (uncured) concrete',
    chemistryType: 'Bitumen',
    status: 'conditional',
    reason: 'Concrete must cure to allow moisture escape.',
    requirement: 'Wait minimum 28 days for concrete cure',
    source: 'industry',
    verified: true,
  },
  {
    materialType: 'CMU (concrete masonry)',
    chemistryType: 'Bitumen',
    status: 'conditional',
    reason: 'CMU is porous and may have high moisture.',
    requirement: 'Prime CMU with appropriate primer, parge if needed',
    primerRequired: 'Block filler or masonry primer',
    source: 'manufacturer',
    verified: true,
  },
];

/**
 * Get compatibility matrix for a specific chemistry
 */
export function getCompatibilityMatrix(chemistry: ChemistryType): CompatibilityMatrix {
  const rules = COMPATIBILITY_RULES.filter(
    (r) => r.chemistryType === chemistry,
  );

  return {
    compatible: rules.filter((r) => r.status === 'compatible'),
    incompatible: rules.filter((r) => r.status === 'incompatible'),
    conditional: rules.filter((r) => r.status === 'conditional'),
  };
}

/**
 * Check compatibility between two materials
 */
export function checkCompatibility(
  chemistry: ChemistryType,
  materialType: string,
): CompatibilityEntry | null {
  const rule = COMPATIBILITY_RULES.find(
    (r) =>
      r.chemistryType === chemistry &&
      r.materialType.toLowerCase().includes(materialType.toLowerCase()),
  );
  return rule || null;
}

/**
 * Get all incompatibilities for a chemistry
 */
export function getIncompatibilities(chemistry: ChemistryType): CompatibilityEntry[] {
  return COMPATIBILITY_RULES.filter(
    (r) => r.chemistryType === chemistry && r.status === 'incompatible',
  );
}

/**
 * Get all conditional compatibilities (require precautions)
 */
export function getConditionalCompatibilities(
  chemistry: ChemistryType,
): CompatibilityEntry[] {
  return COMPATIBILITY_RULES.filter(
    (r) => r.chemistryType === chemistry && r.status === 'conditional',
  );
}

/**
 * Search compatibility rules
 */
export function searchCompatibilityRules(query: string): CompatibilityEntry[] {
  const lowerQuery = query.toLowerCase();
  return COMPATIBILITY_RULES.filter(
    (r) =>
      r.materialType.toLowerCase().includes(lowerQuery) ||
      r.reason.toLowerCase().includes(lowerQuery) ||
      r.chemistryType?.toLowerCase().includes(lowerQuery),
  );
}
