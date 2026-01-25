# @construction-dna/core

Core engine for Construction DNA - complete material management with CRUD operations, taxonomy navigation, and engineering Q&A.

## Installation

```bash
pnpm add @construction-dna/core
```

## Quick Start

```typescript
import { ConstructionDNAEngine } from '@construction-dna/core';

// Create engine with in-memory storage
const engine = new ConstructionDNAEngine();

// Or with JSON file persistence
const engine = new ConstructionDNAEngine({
  storagePath: './materials.json'
});

// Create a material
const material = await engine.create({
  classification: {
    tier1_division: '07',
    tier2_category: 'WP',
    tier5_manufacturer: { code: 'GCP', name: 'GCP Applied Technologies' }
  },
  physical: {
    tier7_baseChemistry: {
      type: 'SBS',
      code: 'SBS',
      name: 'Styrene-Butadiene-Styrene',
      isThermoplastic: false,
      isElastomeric: true,
      joiningMethod: 'torch'
    }
  }
});

// Ask an engineering question
const answer = await engine.ask("What happens if water gets behind SBS membrane?");
console.log(answer.explanation);
console.log(answer.recommendations);

// Check material compatibility
const result = await engine.checkCompatibility(material1.id, material2.id);
console.log(result.compatible); // true/false
console.log(result.explanation);
```

## Features

### CRUD Operations

```typescript
// Create
const material = await engine.create({ ... });

// Read
const material = await engine.get('material-id');
const materials = await engine.list({ chemistry: 'SBS' });

// Update
await engine.update('material-id', { ... });

// Delete
await engine.delete('material-id');
```

### Search

```typescript
// Full-text search
const results = await engine.search('EPDM membrane waterproofing');

// Find by chemistry
const sbsMaterials = await engine.findByChemistry('SBS');

// Find by manufacturer
const gcpMaterials = await engine.findByManufacturer('GCP');

// Find by category
const waterproofing = await engine.findByCategory('WP');
```

### Engineering Q&A

```typescript
// Natural language questions
const answer = await engine.ask("Can I use TPO with asphalt?");
// Returns: compatibility information, warnings, recommendations

const answer = await engine.ask("What is the minimum application temperature for EPDM?");
// Returns: temperature constraints, application guidance

const answer = await engine.ask("What happens if water gets behind the membrane?");
// Returns: failure mode predictions, prevention steps
```

### Failure Prediction

```typescript
// Predict failures under specific conditions
const predictions = await engine.predictFailures('material-id', {
  temperature: 25, // 25°F
  moisture: 'wet',
  exposure: 'full'
});

for (const pred of predictions) {
  console.log(`${pred.failureMode.name}: ${pred.probability * 100}% probability`);
  console.log(`Risk factors: ${pred.riskFactors.join(', ')}`);
  console.log(`Prevention: ${pred.prevention.join(', ')}`);
}
```

### Compatibility Checking

```typescript
const result = await engine.checkCompatibility(material1Id, material2Id);

if (!result.compatible) {
  console.log(`Incompatible: ${result.explanation}`);
  console.log(`Issues: ${result.issues.map(i => i.reason).join(', ')}`);
} else if (result.status === 'conditional') {
  console.log(`Compatible with requirements:`);
  console.log(result.requirements.join('\n'));
}
```

### Taxonomy Navigation

```typescript
// Build taxonomy tree
const tree = await engine.getTaxonomyTree();

// Navigate to node
const result = await engine.navigateTo(['07', 'WP', 'FW']);

// Search taxonomy
const matches = await engine.searchTaxonomy('waterproofing');
```

### Statistics

```typescript
const stats = await engine.getStats();
console.log(`Materials: ${stats.materialCount}`);
console.log(`Chemistries: ${stats.chemistryCount}`);
console.log(`Manufacturers: ${stats.manufacturerCount}`);
console.log(`Validated: ${stats.validatedCount}`);
```

## Storage Adapters

### Memory Storage (Default)

```typescript
import { ConstructionDNAEngine, MemoryStorage } from '@construction-dna/core';

const engine = new ConstructionDNAEngine({
  storage: new MemoryStorage()
});
```

### JSON File Storage

```typescript
import { ConstructionDNAEngine, JSONFileStorage } from '@construction-dna/core';

// Simple path
const engine = new ConstructionDNAEngine({
  storagePath: './materials.json'
});

// Or with custom options
const storage = new JSONFileStorage('./materials.json', {
  debounceMs: 500,  // Debounce writes
  pretty: true      // Pretty print JSON
});

const engine = new ConstructionDNAEngine({ storage });
```

### Custom Storage Adapter

```typescript
import { StorageAdapter, MaterialDNA } from '@construction-dna/core';

class MyDatabaseStorage implements StorageAdapter {
  async get(id: string): Promise<MaterialDNA | null> { ... }
  async getAll(): Promise<MaterialDNA[]> { ... }
  async set(id: string, data: MaterialDNA): Promise<void> { ... }
  async delete(id: string): Promise<boolean> { ... }
  async has(id: string): Promise<boolean> { ... }
  async clear(): Promise<void> { ... }
  async keys(): Promise<string[]> { ... }
  async count(): Promise<number> { ... }
}

const engine = new ConstructionDNAEngine({
  storage: new MyDatabaseStorage()
});
```

## API Reference

### ConstructionDNAEngine

| Method | Description |
|--------|-------------|
| `create(dna)` | Create new material |
| `get(id)` | Get material by ID |
| `update(id, updates)` | Update material |
| `delete(id)` | Delete material |
| `list(filters?)` | List materials |
| `count(filters?)` | Count materials |
| `search(query)` | Search materials |
| `ask(question, context?)` | Ask engineering question |
| `predictFailures(id, conditions?)` | Predict failure modes |
| `checkCompatibility(id1, id2)` | Check compatibility |
| `getTaxonomyTree()` | Get taxonomy tree |
| `navigateTo(path)` | Navigate taxonomy |
| `getStats()` | Get statistics |
| `import(materials)` | Batch import |
| `export()` | Export all |

## License

MIT
