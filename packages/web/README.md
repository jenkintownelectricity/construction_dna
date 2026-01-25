# @construction-dna/web

**Next.js Web Dashboard for Construction DNA**

A modern web interface for browsing, importing, and analyzing construction materials using the 20-tier DNA taxonomy system.

## Features

- **Material Browser** - Search, filter, and view all materials
- **Material Detail Page** - Complete 20-tier DNA view with spec sheet links
- **Import/Export** - JSON and ZIP support with drag & drop
- **Engineering Q&A** - Ask questions about materials
- **Compatibility Checker** - Check material compatibility
- **Taxonomy Explorer** - Browse the tier structure
- **Persistent Storage** - localStorage with auto-migration

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **State:** Zustand with persist middleware
- **Icons:** Lucide React
- **Types:** TypeScript

## Getting Started

```bash
# From monorepo root
pnpm install

# Start development server
cd packages/web
pnpm dev

# Open http://localhost:3001
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard overview |
| `/materials` | Material browser with search/filter |
| `/materials/[id]` | Material detail with all 20 tiers |
| `/materials/new` | Create new material |
| `/import` | Import JSON/ZIP files |
| `/ask` | Engineering Q&A chat |
| `/compatibility` | Material compatibility checker |
| `/taxonomy` | Taxonomy structure explorer |

## Material Detail Page

The detail page shows all 20 DNA tiers:

```
┌─────────────────────────────────────────────────────────┐
│  BITUTHENE 3000                                   [WP]  │
│  GCP Applied Technologies                               │
│  [View Spec Sheet]  [Manufacturer Page]                 │
├─────────────────────────────────────────────────────────┤
│  Classification (Tiers 1-6)                             │
│  Physical Properties (Tiers 7-12)                       │
│  Performance (Tiers 13-16)                              │
│  Failure Modes (Tier 17)                                │
│  Compatibility Matrix (Tier 18)                         │
│  Application Constraints (Tier 19)                      │
│  Code References (Tier 20)                              │
└─────────────────────────────────────────────────────────┘
```

## Import/Export

### Supported Formats

- **JSON** - Single material or array of materials
- **ZIP** - Multiple JSON files (nested folders OK)

### Garbage File Filtering

Automatically ignores:
- `__MACOSX/` folders
- `.DS_Store` files
- `Thumbs.db`
- `.git/` folders
- `node_modules/`
- Hidden files (`._*`)

## State Management

Uses Zustand with localStorage persistence:

```typescript
import { useMaterialsStore } from '@/lib/store';

// In components
const materials = useMaterialsStore((s) => s.getAllMaterials());
const addMaterial = useMaterialsStore((s) => s.addMaterial);
```

### Migrations

The store runs migrations automatically on hydration:

- `add-spec-urls-v1` - Adds manufacturer spec sheet URLs to seed materials

## Project Structure

```
packages/web/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Dashboard
│   ├── materials/
│   │   ├── page.tsx        # Material browser
│   │   ├── [id]/page.tsx   # Material detail
│   │   └── new/page.tsx    # Create material
│   ├── import/page.tsx     # Import page
│   ├── ask/page.tsx        # Q&A chat
│   ├── compatibility/page.tsx
│   ├── taxonomy/page.tsx
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── layout/             # Sidebar, etc.
├── lib/
│   ├── store.ts            # Zustand store
│   ├── file-processor.ts   # ZIP/JSON processing
│   └── migrations/         # Data migrations
└── public/
```

## Development

```bash
# Development
pnpm dev

# Build
pnpm build

# Start production
pnpm start

# Type check
pnpm type-check
```

## Environment Variables

None required for basic operation. The app uses localStorage for data persistence.

## Browser Support

Modern browsers with localStorage support:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

Part of the [Construction DNA](../../README.md) monorepo.
