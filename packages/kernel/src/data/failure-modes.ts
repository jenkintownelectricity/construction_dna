/**
 * PREDEFINED FAILURE MODES
 *
 * Common failure modes for waterproofing and roofing materials
 * Based on real-world experience and industry knowledge
 */

import type { FailureMode, ChemistryType } from '../types';

/**
 * Common failure modes database
 */
export const COMMON_FAILURE_MODES: FailureMode[] = [
  // ============================================
  // ADHESION FAILURES
  // ============================================
  {
    id: 'FM-001',
    name: 'Adhesion Loss - Fish Mouths',
    category: 'adhesion',
    causes: [
      'Substrate not primed or primer not dry',
      'Application below minimum temperature',
      'Contaminated substrate (dust, oil, water, frost)',
      'Membrane applied over incompatible material',
      'Improper roller pressure during installation',
      'Membrane stretched during application',
    ],
    symptoms: [
      'Membrane lifting at edges and laps',
      'Visible gap between membrane and substrate',
      'Water tracking under membrane',
      'Bubbles or wrinkles at transitions',
    ],
    timeToFailure: 'weeks',
    severity: 'functional',
    repairability: 'moderate',
    repairCost: 'moderate',
    prevention: [
      'Always use manufacturer-specified primer',
      'Wait for primer to flash off until tacky (not wet, not dry)',
      'Clean substrate thoroughly - broom, air blow, or vacuum',
      'Check application temperature before starting',
      'Roll membrane firmly with appropriate roller weight',
      'Do not stretch membrane during installation',
    ],
    inspection: [
      'Run hand along membrane edges feeling for lift',
      'Press on membrane to check bond (should not move)',
      'Look for bubbles, wrinkles, or displaced membrane',
      'Check laps by trying to lift edge with putty knife',
    ],
    earlyWarnings: [
      'Membrane feels loose when walked on',
      'Edge lifting visible',
      'Membrane moves when pressed',
    ],
    affectedChemistries: ['SBS', 'Bitumen', 'PU', 'Acrylic'],
    riskFactors: [
      'Cold weather application',
      'Wet or damp substrate',
      'Dusty construction environment',
      'Inexperienced installer',
    ],
  },

  {
    id: 'FM-002',
    name: 'Delamination from Substrate',
    category: 'adhesion',
    causes: [
      'Moisture vapor drive pushing membrane off substrate',
      'Incompatible substrate surface (laitance, curing compound)',
      'Substrate movement (expansion/contraction)',
      'Improper surface preparation',
      'Wrong adhesive for substrate type',
    ],
    symptoms: [
      'Large areas of membrane unbonded',
      'Membrane billowing in wind',
      'Water pooling under membrane',
      'Hollow sound when membrane is tapped',
    ],
    timeToFailure: 'months',
    severity: 'structural',
    repairability: 'difficult',
    repairCost: 'high',
    prevention: [
      'Test substrate moisture before application (ASTM F2170 or F1869)',
      'Shot-blast or grind concrete to remove laitance',
      'Use appropriate primer for substrate type',
      'Install vapor relief vents where needed',
      'Allow new concrete to cure adequately (28 days typical)',
    ],
    inspection: [
      'Tap membrane and listen for hollow sound',
      'Check for billowing during windy conditions',
      'Core sample to verify bond at substrate interface',
    ],
    affectedChemistries: ['TPO', 'PVC', 'EPDM', 'SBS'],
    riskFactors: [
      'High moisture content substrate',
      'Green concrete',
      'Solar exposure heating membrane',
      'Lightweight insulating concrete',
    ],
  },

  // ============================================
  // THERMAL FAILURES
  // ============================================
  {
    id: 'FM-003',
    name: 'Thermal Splitting',
    category: 'thermal',
    causes: [
      'Membrane not rated for temperature extremes',
      'Excessive movement at expansion joints',
      'Membrane constrained at terminations',
      'Aged membrane with reduced elongation',
      'Membrane too thin for application',
    ],
    symptoms: [
      'Visible cracks perpendicular to direction of stress',
      'Cracks at terminations, curbs, and corners',
      'Cracks at membrane laps',
      'Cracking worse after cold weather',
    ],
    timeToFailure: 'years',
    severity: 'structural',
    repairability: 'difficult',
    repairCost: 'high',
    prevention: [
      'Select membrane with adequate elongation for climate',
      'Install expansion joints where movement expected',
      'Allow membrane to move at terminations (no caulk on face)',
      'Use proper thickness membrane',
      'Consider reinforced membrane at high-stress areas',
    ],
    inspection: [
      'Visual inspection especially in cold weather',
      'Check stress concentrations at penetrations and edges',
      'Document crack patterns and measure crack widths',
    ],
    affectedChemistries: ['PVC', 'TPO', 'Bitumen'],
    riskFactors: [
      'Extreme temperature swings',
      'Large roof areas without expansion joints',
      'Black membrane on high-temperature roof',
      'Aged membrane near end of service life',
    ],
  },

  {
    id: 'FM-004',
    name: 'Cold Weather Embrittlement',
    category: 'thermal',
    causes: [
      'Temperature below membrane brittle point',
      'Impact or foot traffic when cold',
      'Insufficient elongation at low temperature',
      'Plasticizer loss over time (PVC)',
    ],
    symptoms: [
      'Membrane cracking when walked on',
      'Shattering at points of impact',
      'Crack pattern follows foot traffic paths',
    ],
    timeToFailure: 'immediate',
    severity: 'functional',
    repairability: 'moderate',
    repairCost: 'moderate',
    prevention: [
      'Check material brittle point vs. climate',
      'Restrict roof access during extreme cold',
      'Use walk pads in traffic areas',
      'Select cold-weather rated products for cold climates',
    ],
    inspection: [
      'Inspect in cold weather for cracks',
      'Check traffic paths and equipment areas',
    ],
    affectedChemistries: ['PVC', 'Bitumen', 'APP'],
    riskFactors: [
      'Cold climate',
      'High foot traffic',
      'Rooftop equipment requiring maintenance',
    ],
  },

  // ============================================
  // MOISTURE FAILURES
  // ============================================
  {
    id: 'FM-005',
    name: 'Blistering',
    category: 'moisture',
    causes: [
      'Moisture in substrate during application',
      'Insufficient adhesion allowing vapor migration',
      'Solar heating creating vapor pressure',
      'Wet insulation below membrane',
      'Vapor barrier on wrong side of insulation',
    ],
    symptoms: [
      'Raised dome-shaped areas in membrane',
      'Soft spots when walking on roof',
      'Blisters may rupture and expose substrate',
      'Multiple small blisters or few large ones',
    ],
    timeToFailure: 'months',
    severity: 'functional',
    repairability: 'moderate',
    repairCost: 'moderate',
    prevention: [
      'Test substrate moisture before application',
      'Use vapor pressure relief vents (1 per 1000 sf typical)',
      'Ensure proper adhesion',
      'Protect insulation from moisture during construction',
      'Install vapor barrier on warm side of insulation',
    ],
    inspection: [
      'Walk roof feeling for soft spots',
      'Visual inspection for raised areas',
      'Infrared scan for trapped moisture',
      'Core sampling suspect areas',
    ],
    affectedChemistries: ['SBS', 'APP', 'Bitumen', 'PU'],
    riskFactors: [
      'Fully adhered systems',
      'Black membrane over wet deck',
      'No vapor relief provisions',
      'Lightweight concrete decks',
    ],
  },

  {
    id: 'FM-006',
    name: 'Water Intrusion at Penetrations',
    category: 'moisture',
    causes: [
      'Improper flashing details at penetrations',
      'Sealant failure at penetration boots',
      'Pipe movement breaking seal',
      'Insufficient membrane height on curbs',
      'Missing or damaged counter-flashing',
    ],
    symptoms: [
      'Water staining inside building at penetrations',
      'Wet insulation around penetrations',
      'Corrosion on pipe boots',
      'Visible gaps at penetration base',
    ],
    timeToFailure: 'weeks',
    severity: 'functional',
    repairability: 'easy',
    repairCost: 'low',
    prevention: [
      'Flash penetrations per manufacturer details',
      'Minimum 8" height on curbs and walls',
      'Use proper penetration boots rated for membrane',
      'Allow for pipe movement in detail design',
      'Seal all mechanical fasteners',
    ],
    inspection: [
      'Check sealant at penetration boots',
      'Verify flashing height meets minimum',
      'Look for signs of previous repairs',
      'Check counter-flashing terminations',
    ],
    affectedChemistries: ['TPO', 'PVC', 'EPDM', 'SBS', 'APP'],
    riskFactors: [
      'Multiple penetrations',
      'Equipment with vibration',
      'Penetrations added after original installation',
    ],
  },

  // ============================================
  // CHEMICAL FAILURES
  // ============================================
  {
    id: 'FM-007',
    name: 'EPDM/Petroleum Incompatibility',
    category: 'chemical',
    causes: [
      'EPDM contacted with asphalt or bitumen',
      'Petroleum-based roof coatings applied to EPDM',
      'Oil drips from rooftop equipment',
      'Grease exhaust depositing on membrane',
    ],
    symptoms: [
      'Membrane swelling and softening',
      'Loss of tensile strength',
      'Membrane becoming gummy',
      'Dimensional changes causing wrinkles',
    ],
    timeToFailure: 'weeks',
    severity: 'structural',
    repairability: 'replace-only',
    repairCost: 'very-high',
    prevention: [
      'NEVER apply asphalt products to EPDM',
      'Use only EPDM-compatible coatings',
      'Protect EPDM from equipment oil drips',
      'Redirect grease exhaust away from membrane',
    ],
    inspection: [
      'Check for softening near equipment',
      'Look for swelling or dimensional changes',
      'Test membrane hardness in suspect areas',
    ],
    affectedChemistries: ['EPDM'],
    riskFactors: [
      'Rooftop restaurants (grease exhaust)',
      'HVAC equipment with oil',
      'Previous repairs with wrong materials',
    ],
  },

  {
    id: 'FM-008',
    name: 'PVC/Polystyrene Incompatibility',
    category: 'chemical',
    causes: [
      'PVC membrane in direct contact with EPS or XPS insulation',
      'Plasticizer migration from PVC to polystyrene',
      'No separator sheet installed',
    ],
    symptoms: [
      'Membrane shrinkage',
      'Membrane becoming stiff',
      'Insulation dissolution',
      'Loss of membrane flexibility',
    ],
    timeToFailure: 'years',
    severity: 'structural',
    repairability: 'difficult',
    repairCost: 'very-high',
    prevention: [
      'Always use separator sheet between PVC and EPS/XPS',
      'Use polyiso or mineral wool insulation instead',
      'Follow manufacturer requirements exactly',
    ],
    inspection: [
      'Core sample to check for insulation damage',
      'Measure membrane thickness for shrinkage',
      'Check membrane flexibility',
    ],
    affectedChemistries: ['PVC'],
    riskFactors: [
      'Direct application over EPS or XPS',
      'Missing separator sheet',
    ],
  },

  // ============================================
  // UV FAILURES
  // ============================================
  {
    id: 'FM-009',
    name: 'UV Degradation/Chalking',
    category: 'uv',
    causes: [
      'Prolonged UV exposure without protection',
      'Material not rated for exposed application',
      'Depleted UV stabilizers over time',
    ],
    symptoms: [
      'Surface chalking (white powder)',
      'Color fading',
      'Surface cracking/checking',
      'Loss of surface gloss',
      'Increased hardness/brittleness',
    ],
    timeToFailure: 'years',
    severity: 'functional',
    repairability: 'moderate',
    repairCost: 'moderate',
    prevention: [
      'Use UV-stable materials for exposed applications',
      'Apply protective coating when required',
      'Install ballast or paver system over non-UV materials',
      'Re-coat before severe degradation',
    ],
    inspection: [
      'Rub surface to check for chalk',
      'Compare color to original',
      'Check for surface cracking pattern',
    ],
    affectedChemistries: ['PU', 'Bitumen', 'Epoxy', 'SBS'],
    riskFactors: [
      'High UV climate (southern exposure, high altitude)',
      'Unprotected membranes',
      'Reflective adjacent surfaces intensifying UV',
    ],
  },

  // ============================================
  // MECHANICAL FAILURES
  // ============================================
  {
    id: 'FM-010',
    name: 'Puncture Damage',
    category: 'mechanical',
    causes: [
      'Foot traffic with debris (rocks, screws)',
      'Dropped tools during construction/maintenance',
      'Hail damage',
      'Animal damage (birds, rodents)',
      'Insufficient protection over membrane',
    ],
    symptoms: [
      'Visible holes or cuts',
      'Water leaking at specific point',
      'Membrane depression showing damage below',
    ],
    timeToFailure: 'immediate',
    severity: 'functional',
    repairability: 'easy',
    repairCost: 'low',
    prevention: [
      'Install walk pads in traffic areas',
      'Use protection board in vulnerable areas',
      'Clean roof of debris regularly',
      'Use thicker membrane in high-risk areas',
      'Bird deterrents where needed',
    ],
    inspection: [
      'Visual inspection for holes',
      'Flood testing suspect areas',
      'Electronic leak detection',
    ],
    affectedChemistries: ['TPO', 'PVC', 'EPDM', 'SBS', 'APP'],
    riskFactors: [
      'Construction activity above roof',
      'Regular maintenance traffic',
      'Rooftop equipment access',
      'Nearby trees (debris, branches)',
    ],
  },

  {
    id: 'FM-011',
    name: 'Wind Uplift Failure',
    category: 'mechanical',
    causes: [
      'Insufficient attachment at perimeter/corners',
      'Seam or lap failure',
      'Membrane detachment from substrate',
      'Inadequate edge metal securement',
    ],
    symptoms: [
      'Membrane billowing or flapping',
      'Complete membrane blow-off',
      'Edge metal displacement',
      'Seam separations',
    ],
    timeToFailure: 'immediate',
    severity: 'catastrophic',
    repairability: 'replace-only',
    repairCost: 'very-high',
    prevention: [
      'Design to ASCE 7 wind requirements',
      'Increase attachment in corners and perimeter',
      'Ensure adequate seam strength',
      'Install edge metal per FM requirements',
      'Follow manufacturer wind design guidelines',
    ],
    inspection: [
      'Check edge metal attachment',
      'Verify fastener spacing',
      'Inspect seams for integrity',
      'Annual inspection before storm season',
    ],
    affectedChemistries: ['TPO', 'PVC', 'EPDM', 'SBS'],
    riskFactors: [
      'High wind region',
      'Tall building',
      'Corner locations',
      'Inadequate perimeter attachment',
    ],
  },

  // ============================================
  // INSTALLATION FAILURES
  // ============================================
  {
    id: 'FM-012',
    name: 'Seam Failure',
    category: 'installation',
    causes: [
      'Insufficient heat during welding',
      'Contaminated seam interface',
      'Incorrect welding speed',
      'Expired tape adhesive',
      'Improper lap width',
    ],
    symptoms: [
      'Seam separation',
      'Water intrusion at seams',
      'Visible gaps at seam edges',
      'Bubbles under seam tape',
    ],
    timeToFailure: 'weeks',
    severity: 'functional',
    repairability: 'easy',
    repairCost: 'low',
    prevention: [
      'Train welders properly',
      'Use manufacturer-approved equipment',
      'Test welds per manufacturer requirements',
      'Clean seam area before welding/taping',
      'Maintain minimum lap widths',
    ],
    inspection: [
      'Visual inspection of all seams',
      'Probe seams with blunt tool',
      'Destructive seam peel test',
      'Air pressure test on critical seams',
    ],
    affectedChemistries: ['TPO', 'PVC', 'EPDM'],
    riskFactors: [
      'Inexperienced installer',
      'Cold weather installation',
      'Dusty/dirty job site',
      'Rushed installation',
    ],
  },
];

/**
 * Get failure mode by ID
 */
export function getFailureMode(id: string): FailureMode | undefined {
  return COMMON_FAILURE_MODES.find((fm) => fm.id === id);
}

/**
 * Get failure modes by category
 */
export function getFailureModesByCategory(
  category: FailureMode['category'],
): FailureMode[] {
  return COMMON_FAILURE_MODES.filter((fm) => fm.category === category);
}

/**
 * Get failure modes affecting a specific chemistry
 */
export function getFailureModesForChemistry(
  chemistry: ChemistryType,
): FailureMode[] {
  return COMMON_FAILURE_MODES.filter(
    (fm) => fm.affectedChemistries?.includes(chemistry),
  );
}

/**
 * Get failure modes by severity
 */
export function getFailureModesBySeverity(
  severity: FailureMode['severity'],
): FailureMode[] {
  return COMMON_FAILURE_MODES.filter((fm) => fm.severity === severity);
}

/**
 * Get all failure categories
 */
export function getAllFailureCategories(): FailureMode['category'][] {
  return [
    'adhesion',
    'cohesion',
    'mechanical',
    'thermal',
    'moisture',
    'chemical',
    'uv',
    'biological',
    'installation',
    'design',
  ];
}
