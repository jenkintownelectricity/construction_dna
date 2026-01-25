/**
 * CONSTRUCTION DNA KERNEL - ZOD SCHEMAS
 *
 * Runtime validation schemas for Material DNA structures.
 * Use these for validating user input, API responses, and imports.
 *
 * @module @construction-dna/kernel/schemas
 */

import { z } from 'zod';

// ============================================
// TIER 1-6: CLASSIFICATION SCHEMAS
// ============================================

export const DivisionSchema = z.object({
  code: z.string().min(1).max(3),
  name: z.string().min(1),
  masterFormatRef: z.string(),
  description: z.string().optional(),
});

export const CategorySchema = z.object({
  code: z.string().min(1).max(3),
  name: z.string().min(1),
  subcategories: z.array(z.string()),
  divisionCode: z.string(),
  description: z.string().optional(),
});

export const AssemblyTypeSchema = z.object({
  code: z.string().min(1).max(3),
  name: z.string().min(1),
  typicalLayers: z.number().int().min(1),
  commonConditions: z.array(z.string()),
  geometryType: z.enum(['planar', 'linear', 'point', 'transition']),
  description: z.string().optional(),
});

export const ConditionSchema = z.object({
  code: z.string().min(1).max(3),
  name: z.string().min(1),
  geometryType: z.enum(['2D', '3D', 'linear', 'point']),
  criticalDimensions: z.array(z.string()),
  failurePoints: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export const WarrantyInfoSchema = z.object({
  name: z.string(),
  durationYears: z.number().int().min(0),
  coverage: z.array(z.string()),
  requirements: z.array(z.string()),
  isNDL: z.boolean(),
});

export const ManufacturerSchema = z.object({
  code: z.string().min(1).max(4),
  name: z.string().min(1),
  fullName: z.string(),
  website: z.string().url(),
  techSupport: z.string(),
  warranties: z.array(WarrantyInfoSchema),
  regions: z.array(z.string()).optional(),
  active: z.boolean(),
  parentCompany: z.string().optional(),
});

export const ProductSizeSchema = z.object({
  widthIn: z.number().positive(),
  widthMm: z.number().positive(),
  lengthFt: z.number().positive(),
  lengthM: z.number().positive(),
  coverageSqFt: z.number().positive(),
  coverageSqM: z.number().positive(),
  weightLbs: z.number().positive(),
  weightKg: z.number().positive(),
  rollsPerPallet: z.number().int().positive().optional(),
  upc: z.string().optional(),
});

export const ProductVariantSchema = z.object({
  code: z.string().min(1).max(6),
  name: z.string().min(1),
  fullName: z.string(),
  sku: z.string(),
  sizes: z.array(ProductSizeSchema),
  specSheetUrl: z.string().url(),
  sdsUrl: z.string().url(),
  installGuideUrl: z.string().url().optional(),
  cadDetailsUrl: z.string().url().optional(),
  introduced: z.string().optional(),
  active: z.boolean(),
  replacedBy: z.string().optional(),
});

export const ClassificationSchema = z.object({
  tier1_division: DivisionSchema,
  tier2_category: CategorySchema,
  tier3_assemblyType: AssemblyTypeSchema,
  tier4_condition: ConditionSchema,
  tier5_manufacturer: ManufacturerSchema,
  tier6_productVariant: ProductVariantSchema,
});

// ============================================
// TIER 7-12: PHYSICAL PROPERTIES SCHEMAS
// ============================================

export const StabilityRatingSchema = z.enum(['excellent', 'good', 'fair', 'poor']);

export const ChemicalResistanceSchema = z.object({
  acids: StabilityRatingSchema,
  alkalis: StabilityRatingSchema,
  solvents: StabilityRatingSchema,
  oils: StabilityRatingSchema,
  ozone: StabilityRatingSchema,
  water: StabilityRatingSchema.optional(),
  salts: StabilityRatingSchema.optional(),
});

export const ChemistryTypeSchema = z.enum([
  'SBS', 'APP', 'TPO', 'PVC', 'EPDM', 'KEE', 'HDPE', 'LDPE',
  'PIB', 'PU', 'Acrylic', 'Silicone', 'Bitumen', 'PMMA', 'Epoxy', 'Hybrid',
]);

export const JoiningMethodSchema = z.enum([
  'heat-weld', 'solvent-weld', 'adhesive', 'self-adhered',
  'tape', 'torch', 'cold-applied', 'mechanical',
]);

export const BaseChemistrySchema = z.object({
  code: z.string().min(1).max(4),
  name: z.string().min(1),
  type: ChemistryTypeSchema,
  primaryPolymer: z.string(),
  modifiers: z.array(z.string()),
  isThermoplastic: z.boolean(),
  isThermoset: z.boolean(),
  isElastomeric: z.boolean(),
  uvStability: StabilityRatingSchema,
  chemicalResistance: ChemicalResistanceSchema,
  agingCharacteristics: z.string(),
  joiningMethod: JoiningMethodSchema,
});

export const ReinforcementTypeSchema = z.enum([
  'polyester', 'fiberglass', 'polyester-glass', 'scrim',
  'film', 'foil', 'fleece', 'fabric', 'mesh', 'none',
]);

export const ReinforcementSchema = z.object({
  code: z.string().min(1).max(3),
  type: ReinforcementTypeSchema,
  weight: z.number().optional(),
  weightUnit: z.enum(['oz/sqyd', 'g/sqm']).optional(),
  orientation: z.enum(['random', 'woven', 'cross-laminated', 'unidirectional', 'none']),
  addsTensileStrength: z.boolean(),
  addsPunctureResistance: z.boolean(),
  addsDimensionalStability: z.boolean(),
  addsFireResistance: z.boolean(),
  description: z.string().optional(),
});

export const SurfaceTypeSchema = z.enum([
  'mineral-granule', 'smooth-film', 'sand-surface', 'fabric-surface',
  'foil-face', 'coated', 'textured', 'embossed', 'untreated',
]);

export const SurfaceTreatmentSchema = z.object({
  code: z.string().min(1).max(3),
  type: SurfaceTypeSchema,
  color: z.string(),
  texture: z.enum(['smooth', 'granular', 'textured', 'fabric', 'film', 'matte', 'glossy']),
  walkable: z.boolean(),
  reflectiveSRI: z.number().optional(),
  exposureRated: z.boolean(),
  requiresCovering: z.boolean(),
  description: z.string().optional(),
});

export const ThicknessClassSchema = z.object({
  code: z.string().min(1).max(4),
  nominalMils: z.number().positive(),
  nominalMM: z.number().positive(),
  tolerancePlus: z.number(),
  toleranceMinus: z.number(),
  punctureResistance: z.enum(['low', 'medium', 'high', 'very-high']),
  installationDifficulty: z.enum(['easy', 'moderate', 'difficult']),
  weightClass: z.enum(['light', 'medium', 'heavy']).optional(),
  description: z.string().optional(),
});

export const ColorReflectivitySchema = z.object({
  code: z.string().min(1).max(4),
  colorName: z.string(),
  hexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  sri: z.number().min(0),
  reflectance: z.number().min(0).max(1),
  emittance: z.number().min(0).max(1),
  meetsEnergyStar: z.boolean(),
  meetsCoolRoof: z.boolean(),
  meetsTitle24: z.boolean(),
  meetsLEED: z.boolean().optional(),
  agedReflectance: z.number().optional(),
  agedEmittance: z.number().optional(),
  agedSRI: z.number().optional(),
});

export const FireRatingSchema = z.object({
  code: z.string().min(1).max(3),
  class: z.enum(['A', 'B', 'C', 'Unrated']),
  ul790: z.boolean(),
  astmE108: z.boolean(),
  ul263: z.boolean(),
  fmApproval: z.string().optional(),
  ulListing: z.string().optional(),
  requiresFireBarrier: z.boolean(),
  requiresGypsum: z.boolean(),
  maxInsulationThickness: z.number().optional(),
  notes: z.string().optional(),
});

export const PhysicalPropertiesSchema = z.object({
  tier7_baseChemistry: BaseChemistrySchema,
  tier8_reinforcement: ReinforcementSchema,
  tier9_surfaceTreatment: SurfaceTreatmentSchema,
  tier10_thicknessClass: ThicknessClassSchema,
  tier11_colorReflectivity: ColorReflectivitySchema,
  tier12_fireRating: FireRatingSchema,
});

// ============================================
// TIER 13-16: PERFORMANCE METRICS SCHEMAS
// ============================================

export const PermClassSchema = z.enum(['I', 'II', 'III']);

export const PermRatingSchema = z.object({
  code: z.string().min(1).max(4),
  class: PermClassSchema,
  perms: z.number().min(0),
  permMetric: z.number().min(0),
  vaporBarrier: z.boolean(),
  vaporRetarder: z.boolean(),
  vaporPermeable: z.boolean(),
  requiresVentilation: z.boolean(),
  canTrapMoisture: z.boolean(),
  dryingPotential: z.enum(['none', 'low', 'moderate', 'high']),
  testMethod: z.enum(['ASTM E96 A', 'ASTM E96 B', 'ASTM E96 BW', 'ASTM F1249', 'other']).optional(),
  notes: z.string().optional(),
});

export const TensileStrengthSchema = z.object({
  code: z.string().min(1).max(4),
  psiMD: z.number().min(0),
  psiCD: z.number().min(0),
  mpaMD: z.number().min(0),
  mpaCD: z.number().min(0),
  strengthClass: z.enum(['low', 'medium', 'high', 'very-high']),
  canBeStretched: z.boolean(),
  requiresMechanicalFastening: z.boolean(),
  selfSupportingSpan: z.number().min(0),
  testMethod: z.enum(['ASTM D412', 'ASTM D638', 'ASTM D882', 'ASTM D751']).optional(),
  notes: z.string().optional(),
});

export const ElongationSchema = z.object({
  code: z.string().min(1).max(4),
  percentMD: z.number().min(0),
  percentCD: z.number().min(0),
  elongationClass: z.enum(['rigid', 'semi-flexible', 'flexible', 'elastic']),
  accommodatesMovement: z.boolean(),
  bridgesCracks: z.boolean(),
  maxCrackBridging: z.number().min(0),
  elongationAt0F: z.number().min(0),
  elongationAt70F: z.number().min(0),
  elongationAt150F: z.number().min(0),
  recoveryPercent: z.number().optional(),
  testMethod: z.enum(['ASTM D412', 'ASTM D638', 'ASTM D882', 'ASTM D751']).optional(),
  notes: z.string().optional(),
});

export const TemperatureRangeSchema = z.object({
  code: z.string().min(1).max(4),
  minServiceF: z.number(),
  maxServiceF: z.number(),
  minServiceC: z.number(),
  maxServiceC: z.number(),
  minApplicationF: z.number(),
  maxApplicationF: z.number(),
  minApplicationC: z.number(),
  maxApplicationC: z.number(),
  brittlePointF: z.number(),
  brittlePointC: z.number(),
  softPointF: z.number(),
  softPointC: z.number(),
  flashPointF: z.number().optional(),
  flashPointC: z.number().optional(),
  coldWeatherProduct: z.boolean(),
  hotWeatherProduct: z.boolean(),
  allSeasonProduct: z.boolean(),
  recommendedClimateZones: z.array(z.enum(['1', '2', '3', '4', '5', '6', '7', '8'])).optional(),
  notes: z.string().optional(),
});

export const PerformanceMetricsSchema = z.object({
  tier13_permRating: PermRatingSchema,
  tier14_tensileStrength: TensileStrengthSchema,
  tier15_elongation: ElongationSchema,
  tier16_temperatureRange: TemperatureRangeSchema,
});

// ============================================
// TIER 17-20: ENGINEERING DNA SCHEMAS
// ============================================

export const FailureCategorySchema = z.enum([
  'adhesion', 'cohesion', 'mechanical', 'thermal', 'moisture',
  'chemical', 'uv', 'biological', 'installation', 'design',
]);

export const FailureSeveritySchema = z.enum([
  'cosmetic', 'functional', 'structural', 'catastrophic',
]);

export const CaseStudySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string().optional(),
  year: z.number().int().optional(),
  lessons: z.array(z.string()),
  source: z.string().optional(),
});

export const FailureModeSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: FailureCategorySchema,
  causes: z.array(z.string()),
  symptoms: z.array(z.string()),
  timeToFailure: z.enum(['immediate', 'weeks', 'months', 'years', 'decades']),
  severity: FailureSeveritySchema,
  repairability: z.enum(['easy', 'moderate', 'difficult', 'replace-only']),
  repairCost: z.enum(['low', 'moderate', 'high', 'very-high']).optional(),
  prevention: z.array(z.string()),
  inspection: z.array(z.string()),
  earlyWarnings: z.array(z.string()).optional(),
  affectedChemistries: z.array(ChemistryTypeSchema).optional(),
  riskFactors: z.array(z.string()).optional(),
  caseStudies: z.array(CaseStudySchema).optional(),
  notes: z.string().optional(),
});

export const CompatibilityStatusSchema = z.enum(['compatible', 'incompatible', 'conditional']);

export const CompatibilityEntrySchema = z.object({
  materialType: z.string(),
  chemistryType: z.string().optional(),
  status: CompatibilityStatusSchema,
  reason: z.string(),
  requirement: z.string().optional(),
  primerRequired: z.string().optional(),
  separatorRequired: z.string().optional(),
  cureTimeRequired: z.string().optional(),
  source: z.enum(['manufacturer', 'astm', 'experience', 'testing', 'industry']),
  reference: z.string().optional(),
  verified: z.boolean().optional(),
  verifiedDate: z.string().optional(),
  notes: z.string().optional(),
});

export const CompatibilityMatrixSchema = z.object({
  compatible: z.array(CompatibilityEntrySchema),
  incompatible: z.array(CompatibilityEntrySchema),
  conditional: z.array(CompatibilityEntrySchema),
});

export const ApplicationConstraintSchema = z.object({
  id: z.string(),
  type: z.enum([
    'temperature', 'humidity', 'moisture-content', 'slope', 'substrate',
    'substrate-prep', 'primer', 'coverage', 'overlap', 'cure-time',
    'traffic', 'exposure', 'thickness', 'environmental', 'storage',
    'shelf-life', 'pot-life', 'flash-time', 'overcoat-window', 'height',
    'fire-separation',
  ]),
  description: z.string(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
  unit: z.string().optional(),
  consequence: z.string(),
  violationSeverity: FailureSeveritySchema,
  source: z.enum(['manufacturer', 'code', 'astm', 'best-practice', 'warranty']),
  reference: z.string().optional(),
  workarounds: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const CodeReferenceSchema = z.object({
  code: z.string(),
  fullName: z.string(),
  section: z.string(),
  requirement: z.string(),
  edition: z.string(),
  compliant: z.boolean(),
  notes: z.string().optional(),
  testMethod: z.string().optional(),
  testResult: z.string().optional(),
  testDate: z.string().optional(),
  testLab: z.string().optional(),
  url: z.string().url().optional(),
});

export const EngineeringDNASchema = z.object({
  tier17_failureModes: z.array(FailureModeSchema),
  tier18_compatibilityMatrix: CompatibilityMatrixSchema,
  tier19_applicationConstraints: z.array(ApplicationConstraintSchema),
  tier20_codeReferences: z.array(CodeReferenceSchema),
});

// ============================================
// METADATA SCHEMA
// ============================================

export const DataSourceSchema = z.object({
  type: z.enum(['manufacturer', 'testing', 'literature', 'experience', 'ai-extracted']),
  name: z.string(),
  url: z.string().url().optional(),
  date: z.string().optional(),
  reliability: z.number().min(0).max(100).optional(),
});

export const ChangeLogEntrySchema = z.object({
  timestamp: z.string(),
  user: z.string(),
  field: z.string(),
  oldValue: z.string().optional(),
  newValue: z.string().optional(),
  reason: z.string().optional(),
});

export const MaterialDNAMetadataSchema = z.object({
  created: z.string(),
  updated: z.string(),
  version: z.number().int().min(1),
  expertValidated: z.boolean(),
  validatedBy: z.string().optional(),
  validatedDate: z.string().optional(),
  validationNotes: z.string().optional(),
  completeness: z.number().min(0).max(100),
  confidence: z.number().min(0).max(100),
  dataSources: z.array(DataSourceSchema),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  changeLog: z.array(ChangeLogEntrySchema).optional(),
  tags: z.array(z.string()).optional(),
});

// ============================================
// MAIN MATERIAL DNA SCHEMA
// ============================================

export const MaterialDNASchema = z.object({
  id: z.string(),
  taxonomyCode: z.string(),
  classification: ClassificationSchema,
  physical: PhysicalPropertiesSchema,
  performance: PerformanceMetricsSchema,
  engineering: EngineeringDNASchema,
  metadata: MaterialDNAMetadataSchema,
  custom: z.record(z.unknown()).optional(),
});

// ============================================
// PARTIAL SCHEMAS (for updates/patches)
// ============================================

export const PartialMaterialDNASchema = MaterialDNASchema.partial();
export const MaterialDNACreateSchema = MaterialDNASchema.omit({
  metadata: true,
}).extend({
  metadata: MaterialDNAMetadataSchema.partial(),
});

// ============================================
// TYPE EXPORTS (inferred from schemas)
// ============================================

export type MaterialDNASchemaType = z.infer<typeof MaterialDNASchema>;
export type ClassificationSchemaType = z.infer<typeof ClassificationSchema>;
export type PhysicalPropertiesSchemaType = z.infer<typeof PhysicalPropertiesSchema>;
export type PerformanceMetricsSchemaType = z.infer<typeof PerformanceMetricsSchema>;
export type EngineeringDNASchemaType = z.infer<typeof EngineeringDNASchema>;
