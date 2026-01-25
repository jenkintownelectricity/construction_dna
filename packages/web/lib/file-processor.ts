import JSZip from 'jszip';
import type { MaterialDNA } from '@construction-dna/kernel';

// Patterns for garbage files to ignore
const GARBAGE_PATTERNS = [
  /^__MACOSX\//i,
  /\/__MACOSX\//i,
  /\.DS_Store$/i,
  /^\._/,
  /\/\._/,
  /Thumbs\.db$/i,
  /desktop\.ini$/i,
  /\.git\//i,
  /node_modules\//i,
  /\.vscode\//i,
  /\.idea\//i,
  /\.swp$/i,
  /\.swo$/i,
  /\.tmp$/i,
  /\.temp$/i,
  /\.bak$/i,
  /\.backup$/i,
  /\.log$/i,
  /~$/,
  /^~\$/,
];

export interface ProcessResult {
  materials: MaterialDNA[];
  errors: string[];
  ignored: string[];
  totalFiles: number;
  validFiles: number;
}

export interface ExtractedFile {
  name: string;
  content: unknown;
}

/**
 * Check if a file path is garbage that should be ignored
 */
function isGarbage(path: string): boolean {
  return GARBAGE_PATTERNS.some((p) => p.test(path));
}

/**
 * Get the filename from a path (flatten nested folders)
 */
function getFileName(path: string): string {
  return path.split('/').pop() || path;
}

/**
 * Generate a unique ID for a material if it doesn't have one
 */
function generateId(): string {
  return `dna_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Extract JSON files from a ZIP
 */
export async function extractZip(file: File): Promise<{
  jsonFiles: ExtractedFile[];
  ignored: string[];
  errors: string[];
}> {
  const result: {
    jsonFiles: ExtractedFile[];
    ignored: string[];
    errors: string[];
  } = {
    jsonFiles: [],
    ignored: [],
    errors: [],
  };

  try {
    const zip = await JSZip.loadAsync(file);

    for (const [path, entry] of Object.entries(zip.files)) {
      // Skip directories
      if (entry.dir) continue;

      // Skip garbage
      if (isGarbage(path)) {
        result.ignored.push(path);
        continue;
      }

      // Only process .json files
      if (!path.toLowerCase().endsWith('.json')) {
        result.ignored.push(path);
        continue;
      }

      try {
        const text = await entry.async('string');
        const content = JSON.parse(text);
        result.jsonFiles.push({
          name: getFileName(path),
          content,
        });
      } catch (e) {
        const error = e instanceof Error ? e.message : 'Unknown error';
        result.errors.push(`${path}: ${error}`);
      }
    }
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    result.errors.push(`Failed to read ZIP "${file.name}": ${error}`);
  }

  return result;
}

/**
 * Parse a JSON content into material(s)
 */
function parseMaterialJson(content: unknown, sourceName: string): MaterialDNA[] {
  const materials: MaterialDNA[] = [];

  try {
    // Handle null/undefined
    if (!content || typeof content !== 'object') {
      return materials;
    }

    const obj = content as Record<string, unknown>;

    // Single material with id and classification
    if (obj.id && obj.classification) {
      const material = obj as unknown as MaterialDNA;
      if (!material.id) {
        material.id = generateId();
      }
      materials.push(material);
      return materials;
    }

    // Array of materials
    if (Array.isArray(content)) {
      for (const item of content) {
        if (item && typeof item === 'object') {
          const mat = item as Record<string, unknown>;
          if (mat.classification) {
            const material = mat as unknown as MaterialDNA;
            if (!material.id) {
              material.id = generateId();
            }
            materials.push(material);
          }
        }
      }
      return materials;
    }

    // Object with "materials" array
    if (obj.materials && Array.isArray(obj.materials)) {
      for (const item of obj.materials) {
        if (item && typeof item === 'object') {
          const mat = item as Record<string, unknown>;
          if (mat.classification) {
            const material = mat as unknown as MaterialDNA;
            if (!material.id) {
              material.id = generateId();
            }
            materials.push(material);
          }
        }
      }
      return materials;
    }

    // Index file or metadata - skip but don't error
    if (obj.name || obj.description || obj.version || obj.count) {
      // This looks like an index/metadata file, ignore it
      return materials;
    }

    // Object with classification but no id (create one)
    if (obj.classification) {
      const material = obj as unknown as MaterialDNA;
      material.id = generateId();
      materials.push(material);
      return materials;
    }
  } catch (e) {
    console.error(`Error parsing ${sourceName}:`, e);
  }

  return materials;
}

/**
 * Process multiple files (JSON and/or ZIP)
 */
export async function processFiles(
  files: File[],
  onProgress?: (current: number, total: number, fileName: string) => void
): Promise<ProcessResult> {
  const result: ProcessResult = {
    materials: [],
    errors: [],
    ignored: [],
    totalFiles: files.length,
    validFiles: 0,
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    onProgress?.(i + 1, files.length, file.name);

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.zip')) {
      // Extract and process ZIP
      const { jsonFiles, ignored, errors } = await extractZip(file);
      result.ignored.push(...ignored.map((p) => `${file.name}/${p}`));
      result.errors.push(...errors);

      for (const { name, content } of jsonFiles) {
        const materials = parseMaterialJson(content, `${file.name}/${name}`);
        if (materials.length > 0) {
          result.materials.push(...materials);
          result.validFiles++;
        }
      }
    } else if (fileName.endsWith('.json')) {
      // Process JSON directly
      try {
        const text = await file.text();
        const content = JSON.parse(text);
        const materials = parseMaterialJson(content, file.name);
        if (materials.length > 0) {
          result.materials.push(...materials);
          result.validFiles++;
        }
      } catch (e) {
        const error = e instanceof Error ? e.message : 'Unknown error';
        result.errors.push(`${file.name}: ${error}`);
      }
    } else {
      result.ignored.push(file.name);
    }
  }

  // Deduplicate materials by ID
  const seen = new Set<string>();
  result.materials = result.materials.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });

  return result;
}

/**
 * Export materials to JSON
 */
export function exportToJson(materials: MaterialDNA[], pretty = true): string {
  return JSON.stringify(materials, null, pretty ? 2 : undefined);
}

/**
 * Export materials to ZIP (one file per material)
 */
export async function exportToZip(materials: MaterialDNA[]): Promise<Blob> {
  const zip = new JSZip();

  for (const material of materials) {
    const name = material.classification?.tier6_productVariant?.name || material.id;
    const safeName = name.replace(/[^a-zA-Z0-9-_]/g, '_');
    zip.file(`${safeName}.json`, JSON.stringify(material, null, 2));
  }

  return zip.generateAsync({ type: 'blob' });
}

/**
 * Trigger a file download
 */
export function downloadFile(content: Blob | string, filename: string): void {
  const blob = typeof content === 'string' ? new Blob([content], { type: 'application/json' }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
