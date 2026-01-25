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
│   ├── kernel/                 # Core DNA taxonomy engine
│   │   ├── src/
│   │   │   ├── types/          # 20-tier TypeScript interfaces
│   │   │   ├── data/           # Predefined chemistries, failures, compatibility
│   │   │   ├── utils/          # Taxonomy codes, validation
│   │   │   └── schemas/        # Zod validation schemas
│   │   └── package.json
│   │
│   └── web/                    # Next.js Web Dashboard
│       ├── app/                # App router pages
│       │   ├── materials/      # Material browser & detail pages
│       │   ├── import/         # Import JSON/ZIP files
│       │   ├── ask/            # Engineering Q&A
│       │   ├── compatibility/  # Material compatibility checker
│       │   └── taxonomy/       # Taxonomy explorer
│       ├── components/         # UI components (shadcn/ui)
│       └── lib/                # Store, utilities, migrations
│
├── package.json                # Monorepo root
└── pnpm-workspace.yaml
```

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@construction-dna/kernel` | Core taxonomy types, data, and utilities | **Ready** |
| `@construction-dna/web` | Next.js dashboard with Material Browser | **Ready** |
| `@construction-dna/assemblies` | Assembly definitions (layer stacks) | Planned |
| `@construction-dna/cli` | CLI tool (`cdna`) | Planned |

## Web Dashboard Features

- **Material Browser** - View all imported materials with search/filter
- **Material Detail Page** - All 20 DNA tiers with spec sheet links
- **Import/Export** - JSON and ZIP file support with garbage filtering
- **Engineering Q&A** - Ask questions about materials
- **Compatibility Checker** - Check material compatibility
- **Taxonomy Explorer** - Browse the 20-tier structure
- **localStorage Persistence** - Data survives browser refresh

## 20-Tier DNA Taxonomy

```
TIER 1-6: CLASSIFICATION (What is it?)
├── Tier 1:  Division (CSI MasterFormat)
├── Tier 2:  Category (Roofing, Waterproofing, etc.)
├── Tier 3:  Assembly Type (Edge, Penetration, etc.)
├── Tier 4:  Condition (Parapet, Curb, etc.)
├── Tier 5:  Manufacturer (GCP, Carlisle, etc.)
├── Tier 6:  Product Variant (Specific SKU + Spec Sheet URL)

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

### Install Dependencies

```bash
pnpm install
```

### Run Web Dashboard

```bash
cd packages/web
pnpm dev
# Open http://localhost:3001
```

### Import Materials

1. Navigate to `/import`
2. Drag & drop JSON or ZIP files
3. Review preview and click "Import"
4. View materials at `/materials`

### Use Kernel Package

```typescript
import {
  MaterialDNA,
  BASE_CHEMISTRIES,
  COMMON_FAILURE_MODES,
  checkCompatibility,
  generateTaxonomyCode,
  validateMaterialDNA,
} from '@construction-dna/kernel';

// Check compatibility
const result = checkCompatibility('EPDM', 'asphalt');
// { status: 'incompatible', reason: 'Asphalt oils migrate into EPDM...' }

// Validate DNA
const validation = validateMaterialDNA(unknownData);
// { valid: true, errors: [], warnings: [], completeness: 85 }
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run web dashboard in development
pnpm --filter @construction-dna/web dev

# Run kernel tests
pnpm --filter @construction-dna/kernel test
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

## License

MIT for open-source use. Commercial license available for enterprise features.

---

Built by [BuildingSystems.ai](https://buildingsystems.ai) | Designed by Armand Lefebvre
