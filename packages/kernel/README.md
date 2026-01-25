# @construction-dna/kernel

The core kernel for the Construction DNA 20-Tier Material Taxonomy System.

## Installation

```bash
npm install @construction-dna/kernel
# or
pnpm add @construction-dna/kernel
# or
yarn add @construction-dna/kernel
```

## What's Included

### Type Definitions

Complete TypeScript interfaces for all 20 tiers:

```typescript
import type {
  // Main interface
  MaterialDNA,

  // Classification (Tiers 1-6)
  Division,
  Category,
  AssemblyType,
  Condition,
  Manufacturer,
  ProductVariant,

  // Physical Properties (Tiers 7-12)
  BaseChemistry,
  Reinforcement,
  SurfaceTreatment,
  ThicknessClass,
  ColorReflectivity,
  FireRating,

  // Performance Metrics (Tiers 13-16)
  PermRating,
  TensileStrength,
  Elongation,
  TemperatureRange,

  // Engineering DNA (Tiers 17-20)
  FailureMode,
  CompatibilityMatrix,
  ApplicationConstraint,
  CodeReference,
} from '@construction-dna/kernel';
```

### Predefined Data

Ready-to-use reference data:

```typescript
import {
  // Base chemistries (TPO, PVC, EPDM, SBS, etc.)
  BASE_CHEMISTRIES,
  getChemistry,
  getAllChemistries,

  // Failure modes database
  COMMON_FAILURE_MODES,
  getFailureMode,
  getFailureModesByCategory,
  getFailureModesForChemistry,

  // Compatibility rules
  COMPATIBILITY_RULES,
  checkCompatibility,
  getIncompatibilities,
  getCompatibilityMatrix,

  // Reference constants
  DIVISIONS,
  CATEGORIES,
  MANUFACTURERS,
  REINFORCEMENTS,
  THICKNESS_CLASSES,
  FIRE_RATINGS,
  PERM_RATINGS,
} from '@construction-dna/kernel';
```

### Utilities

Helpful functions for working with DNA:

```typescript
import {
  // Taxonomy codes
  generateTaxonomyCode,
  parseTaxonomyCode,
  isSameProduct,
  isSameChemistry,
  getTierName,

  // Validation
  validateMaterialDNA,
  calculateCompleteness,
  hasMinimumFields,
  isExpertValidated,
} from '@construction-dna/kernel';
```

### Zod Schemas

Runtime validation with Zod:

```typescript
import {
  MaterialDNASchema,
  ClassificationSchema,
  PhysicalPropertiesSchema,
  PerformanceMetricsSchema,
  EngineeringDNASchema,
  FailureModeSchema,
  CompatibilityEntrySchema,
} from '@construction-dna/kernel/schemas';

// Validate unknown data
const result = MaterialDNASchema.safeParse(data);
if (result.success) {
  const dna = result.data; // Typed as MaterialDNA
}
```

## Examples

### Create Material DNA

```typescript
import type { MaterialDNA } from '@construction-dna/kernel';
import {
  BASE_CHEMISTRIES,
  COMMON_FAILURE_MODES,
  getCompatibilityMatrix,
} from '@construction-dna/kernel';

const bituthene3000: MaterialDNA = {
  id: 'GCP-B3K-001',
  taxonomyCode: '07-WP-FW-FT-GCP-B3K-SBS-PF-SF-T60-BLK-FA-PI-TH-EF-TC-AMTW-22-11-IAFU',

  classification: {
    tier1_division: { code: '07', name: 'Thermal & Moisture Protection', masterFormatRef: '07 00 00' },
    tier2_category: { code: 'WP', name: 'Waterproofing', subcategories: ['Below Grade'], divisionCode: '07' },
    // ... etc
  },

  physical: {
    tier7_baseChemistry: BASE_CHEMISTRIES.SBS,
    // ... etc
  },

  performance: {
    tier13_permRating: { code: 'PI', class: 'I', perms: 0.05, /* ... */ },
    // ... etc
  },

  engineering: {
    tier17_failureModes: COMMON_FAILURE_MODES.filter(fm => fm.affectedChemistries?.includes('SBS')),
    tier18_compatibilityMatrix: getCompatibilityMatrix('SBS'),
    tier19_applicationConstraints: [/* ... */],
    tier20_codeReferences: [/* ... */],
  },

  metadata: {
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    version: 1,
    expertValidated: false,
    completeness: 0,
    confidence: 0,
    dataSources: [],
  },
};
```

### Check Compatibility

```typescript
import { checkCompatibility, getIncompatibilities } from '@construction-dna/kernel';

// Is EPDM compatible with asphalt?
const check = checkCompatibility('EPDM', 'asphalt');
console.log(check);
// {
//   status: 'incompatible',
//   reason: 'Asphalt oils migrate into EPDM causing permanent swelling...',
//   source: 'manufacturer'
// }

// What is PVC incompatible with?
const pvcIncompat = getIncompatibilities('PVC');
// Returns entries for polystyrene (without separator), asphalt, etc.
```

### Find Failure Modes

```typescript
import {
  getFailureModesForChemistry,
  getFailureModesByCategory,
  getFailureModesBySeverity,
} from '@construction-dna/kernel';

// What can go wrong with TPO?
const tpoFailures = getFailureModesForChemistry('TPO');

// All moisture-related failures
const moistureFailures = getFailureModesByCategory('moisture');
// Returns: Blistering, Water Intrusion at Penetrations, etc.

// All catastrophic failures
const criticalFailures = getFailureModesBySeverity('catastrophic');
// Returns: Wind Uplift Failure, etc.
```

## API Reference

### Types

See `/src/types/` for complete interface definitions.

### Data Functions

| Function | Description |
|----------|-------------|
| `getChemistry(code)` | Get chemistry by type code |
| `getAllChemistries()` | Get all base chemistries |
| `getFailureMode(id)` | Get failure mode by ID |
| `getFailureModesByCategory(category)` | Filter failures by category |
| `getFailureModesForChemistry(chemistry)` | Get failures affecting a chemistry |
| `checkCompatibility(chemistry, material)` | Check material compatibility |
| `getCompatibilityMatrix(chemistry)` | Get full compatibility matrix |
| `getIncompatibilities(chemistry)` | Get all incompatible materials |

### Utility Functions

| Function | Description |
|----------|-------------|
| `generateTaxonomyCode(dna)` | Generate 20-tier code from DNA |
| `parseTaxonomyCode(code)` | Parse code into components |
| `validateMaterialDNA(dna)` | Validate DNA structure |
| `calculateCompleteness(dna)` | Calculate completeness score (0-100) |

## License

MIT
