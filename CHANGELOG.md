# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - 2026-02-14

#### Song Kernel (`@construction-dna/song-kernel`)

- **Song Kernel v1.1 Schema** — Complete TypeScript types and Zod validation for song production briefs
  - Artist identity (name, vocal style, influences)
  - Song metadata (title, genre, BPM, key, mood tags, structure)
  - Emotional arc (opening, midpoint, climax, resolution)
  - Cultural DNA (city/setting, cultural references)
  - Beat kernel cross-reference support
- **Beat Kernel v1 Schema** — Full beat pattern DNA encoding
  - Transport config (BPM, swing, time signature, key, scale)
  - Drum channel definitions (8 channels, 16-step patterns with per-step velocities)
  - Instrument channel definitions (bass, piano, strings, lead, pluck with MIDI note sequences)
  - Master effects chain (reverb, delay, compressor, EQ)
  - Arrangement metadata
- **Zod Validation** — Runtime validation schemas for both Song Kernel and Beat Kernel
- **Default Factories** — `createDefaultSongKernel()` and `createDefaultBeatKernel()` for quick instantiation
- **Public API** — Clean barrel exports via `index.ts`

### Added - 2026-01-25

#### Web Dashboard (`@construction-dna/web`)

- **Material Detail Page** (`/materials/[id]`)
  - Displays all 20 DNA tiers in organized sections
  - Classification (Tiers 1-6)
  - Physical Properties (Tiers 7-12)
  - Performance Metrics (Tiers 13-16)
  - Failure Modes (Tier 17) with severity badges
  - Compatibility Matrix (Tier 18)
  - Application Constraints (Tier 19)
  - Code References (Tier 20)
  - "View Spec Sheet" and "Manufacturer Page" buttons
  - Raw JSON data toggle for debugging

- **Spec Sheet URL Migration**
  - Added URLs for all 30 seed materials
  - Auto-migration runs on app load
  - Idempotent (safe to run multiple times)
  - Stored in `tier6_productVariant.specSheetUrl`

- **Import/Export Improvements**
  - ZIP file support via jszip
  - Multi-file drag & drop upload
  - Garbage file filtering (__MACOSX, .DS_Store, Thumbs.db, etc.)
  - Preview table before import
  - Progress indicator
  - Error and warning display

- **Zustand Store with Persistence**
  - Changed from Map to Record for JSON serialization
  - Added localStorage persistence via zustand/middleware
  - Migration system for data upgrades
  - Key: `construction-dna-materials`

- **Materials Browser**
  - Reads from Zustand store
  - Search and filter functionality
  - Export to JSON and ZIP
  - Clear all button
  - Material count badge

- **Initial Web Dashboard**
  - Next.js 14 App Router
  - Tailwind CSS + shadcn/ui components
  - Dark mode by default
  - Sidebar navigation
  - Pages: Dashboard, Materials, Ask, Compatibility, Taxonomy, Import

#### Kernel (`@construction-dna/kernel`)

- **Engineering Q&A Engine**
  - Intent classification (failure, compatibility, temperature, etc.)
  - Question answering with recommendations
  - Material-specific context

- **Taxonomy Navigation**
  - Tree structure for 20 tiers
  - Navigation utilities
  - Code generation and parsing

- **CRUD Operations**
  - Create, read, update, delete materials
  - Memory and JSON file storage adapters
  - Validation on write

- **Type Definitions**
  - Complete 20-tier TypeScript interfaces
  - Classification types (Tiers 1-6)
  - Physical properties types (Tiers 7-12)
  - Performance types (Tiers 13-16)
  - Engineering types (Tiers 17-20)

- **Zod Validation Schemas**
  - Full schema for MaterialDNA
  - Partial schemas for each tier group
  - Validation utilities

- **Predefined Data**
  - Base chemistries (SBS, APP, TPO, EPDM, PVC, etc.)
  - Common failure modes
  - Compatibility rules

### Fixed

- Materials Browser showing empty after import (Map serialization issue)
- Google Fonts network error (switched to system fonts)
- TypeScript errors in detail page (correct property names)

## [0.1.0] - 2026-01-25

### Added

- Initial repository setup
- Monorepo structure with pnpm workspaces
- `@construction-dna/kernel` package
- `@construction-dna/web` package
- 20-tier Material DNA taxonomy system
- Basic documentation

---

## Session Log

### L0 Commands Executed

| Command ID | Description | Status |
|------------|-------------|--------|
| L0-CMD-2026-0125-001 | Create Construction DNA Kernel | Complete |
| L0-CMD-2026-0125-002 | Create @construction-dna/core package | Complete |
| L0-CMD-2026-0125-003 | Build 30 seed materials | Complete |
| L0-CMD-2026-0125-004 | Build Next.js Web Dashboard | Complete |
| L0-CMD-2026-0125-005 | Fix Import/Export with ZIP support | Complete |
| L0-CMD-2026-0125-006 | Fix Materials Browser not reading from store | Complete |
| L0-CMD-2026-0125-007 | Add Material Detail page with spec sheets | Complete |
| L0-CMD-2026-0214-005 | Song Kernel v1.1 + Beat Kernel v1 schemas | Complete |

### Commits (claude/lightning-studio-music-kernel-MKeUe)

```
3eff9a4 feat: add Song Kernel v1.1 + Beat Kernel v1 schemas with types, Zod validation, and defaults
```

### Commits (claude/create-dna-kernel-JpijI)

```
bb89b07 feat(web): add spec sheet URL migration for seed materials
0baeedf feat(web): add Material Detail page with all 20 DNA tiers
2f30fda fix(web): use Record instead of Map and add localStorage persistence
2f421c7 fix(web): add robust import/export with ZIP support and Zustand store
ba3208f feat(web): add Next.js dashboard for Construction DNA
48f9e0a chore: add .gitignore for node_modules and build artifacts
2745b9c feat(core): add engineering Q&A and main engine
58141b4 feat(core): add taxonomy tree and navigation
69b3fbe feat(core): add CRUD operations for DNA records
7fa02d4 feat(core): add storage adapters (memory, JSON file)
d3d1dbc feat(kernel): add Zod validation schemas
4093d6d feat(kernel): add predefined chemistries and failure modes
b314929 feat(kernel): add engineering types (failure modes, compatibility)
96ad65e feat(kernel): add performance types (perm, tensile, elongation, temp)
13d24d1 feat(kernel): add physical properties types (chemistry, thickness, etc)
96f8b52 feat(kernel): add classification types (6 tiers)
cad97e5 feat(kernel): add 20-tier Material DNA taxonomy type definitions
```

---

Built with Claude Code | Sessions: 2026-01-25, 2026-02-14
