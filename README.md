# Construction DNA

**20-Tier Material DNA Taxonomy System for Construction Materials**

A standalone, pluggable system that extracts the complete "genetic code" of construction materials, enabling:

- Engineering problem solving ("What happens if water gets behind this?")
- Failure mode prediction (Know WHY details fail before they fail)
- Material compatibility checking (Instantly know what can touch what)
- Performance calculations (R-values, perm ratings, tensile strength on demand)
- Code compliance verification (Auto-check against IBC, IECC, manufacturer specs)

## Repository Structure

```
construction-dna/
├── packages/
│   └── kernel/                 # Core DNA taxonomy engine
│       ├── src/
│       │   ├── types/          # 20-tier TypeScript interfaces
│       │   ├── data/           # Predefined chemistries, failures, compatibility
│       │   ├── utils/          # Taxonomy codes, validation
│       │   └── schemas/        # Zod validation schemas
│       └── package.json
├── package.json                # Monorepo root
└── pnpm-workspace.yaml
```

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@construction-dna/kernel` | Core taxonomy types, data, and utilities | Ready |
| `@construction-dna/core` | DNA CRUD operations, navigation | Planned |
| `@construction-dna/fastbrain` | Fast inference engine (Groq/BitNet) | Planned |
| `@construction-dna/trainer-ui` | Skills Trainer UI (pluggable) | Planned |
| `@construction-dna/cli` | CLI tool (`cdna`) | Planned |

## 20-Tier DNA Taxonomy

```
TIER 1-6: CLASSIFICATION (What is it?)
├── Tier 1:  Division (CSI MasterFormat)
├── Tier 2:  Category (Roofing, Waterproofing, etc.)
├── Tier 3:  Assembly Type (Edge, Penetration, etc.)
├── Tier 4:  Condition (Parapet, Curb, etc.)
├── Tier 5:  Manufacturer (GCP, Carlisle, etc.)
├── Tier 6:  Product Variant (Specific SKU)

TIER 7-12: PHYSICAL PROPERTIES (What is it made of?)
├── Tier 7:  Base Chemistry (SBS, APP, TPO, EPDM, etc.)
├── Tier 8:  Reinforcement (Polyester, Fiberglass, None)
├── Tier 9:  Surface Treatment (Granule, Smooth, Film)
├── Tier 10: Thickness Class (40 mil, 60 mil, 90 mil)
├── Tier 11: Color/Reflectivity (White, Black, Tan, SRI value)
├── Tier 12: Fire Rating (Class A, B, C, Unrated)

TIER 13-16: PERFORMANCE METRICS (How does it perform?)
├── Tier 13: Perm Rating (Vapor permeance class)
├── Tier 14: Tensile Strength (PSI range)
├── Tier 15: Elongation (% stretch before failure)
├── Tier 16: Temperature Range (Service temp limits)

TIER 17-20: ENGINEERING DNA (How does it behave?)
├── Tier 17: Failure Modes (What kills it?)
├── Tier 18: Compatibility Matrix (What can touch it?)
├── Tier 19: Application Constraints (When NOT to use)
├── Tier 20: Code References (IBC, IECC, ASTM)
```

## Quick Start

```bash
# Install
pnpm add @construction-dna/kernel

# Import
import {
  MaterialDNA,
  BASE_CHEMISTRIES,
  COMMON_FAILURE_MODES,
  checkCompatibility,
  generateTaxonomyCode,
  validateMaterialDNA,
} from '@construction-dna/kernel';
```

## Usage Examples

### Check Material Compatibility

```typescript
import { checkCompatibility, getIncompatibilities } from '@construction-dna/kernel';

// Check if EPDM is compatible with asphalt
const result = checkCompatibility('EPDM', 'asphalt');
// { status: 'incompatible', reason: 'Asphalt oils migrate into EPDM...' }

// Get all EPDM incompatibilities
const epdmIncompat = getIncompatibilities('EPDM');
// Returns: petroleum products, asphalt, greases, oils...
```

### Get Failure Modes

```typescript
import { getFailureModesForChemistry, getFailureModesByCategory } from '@construction-dna/kernel';

// Get failure modes affecting TPO
const tpoFailures = getFailureModesForChemistry('TPO');

// Get all moisture-related failures
const moistureFailures = getFailureModesByCategory('moisture');
```

### Generate Taxonomy Code

```typescript
import { generateTaxonomyCode, parseTaxonomyCode } from '@construction-dna/kernel';

// Generate code from DNA
const code = generateTaxonomyCode(materialDNA);
// "07-WP-FW-FT-GCP-B3K-SBS-PF-SF-T60-BLK-FA-PI-TH-EF-TC-AMTW-22-11-IAFU"

// Parse code back to components
const parsed = parseTaxonomyCode(code);
// { tier1: '07', tier2: 'WP', ... }
```

### Validate DNA

```typescript
import { validateMaterialDNA, MaterialDNASchema } from '@construction-dna/kernel';

// Basic validation
const result = validateMaterialDNA(unknownData);
// { valid: true, errors: [], warnings: [], completeness: 85 }

// Zod schema validation
const parsed = MaterialDNASchema.safeParse(unknownData);
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## License

MIT for open-source use. Commercial license available for enterprise features.

---

Built by [BuildingSystems.ai](https://buildingsystems.ai) | Designed by Armand Lefebvre
