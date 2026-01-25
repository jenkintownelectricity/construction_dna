'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  FileJson,
  FileArchive,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { processFiles } from '@/lib/file-processor';
import { useMaterialsStore } from '@/lib/store';
import type { MaterialDNA } from '@construction-dna/kernel';

interface PreviewMaterial {
  material: MaterialDNA;
  valid: boolean;
  warnings: string[];
}

export default function ImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, fileName: '' });
  const [preview, setPreview] = useState<PreviewMaterial[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [ignored, setIgnored] = useState<string[]>([]);
  const [showIgnored, setShowIgnored] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const addMaterials = useMaterialsStore((s) => s.addMaterials);
  const materialCount = useMaterialsStore((s) => s.getMaterialCount());

  const validateMaterial = (m: MaterialDNA): { valid: boolean; warnings: string[] } => {
    const warnings: string[] = [];

    if (!m.id) warnings.push('Missing ID');
    if (!m.classification) warnings.push('Missing classification');
    if (!m.classification?.tier6_productVariant?.name) warnings.push('Missing product name');
    if (!m.physical?.tier7_baseChemistry) warnings.push('Missing chemistry');

    return { valid: warnings.length === 0, warnings };
  };

  const handleFiles = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setPreview([]);
    setErrors([]);
    setIgnored([]);
    setImportComplete(false);

    try {
      const result = await processFiles(files, (current, total, fileName) => {
        setProgress({ current, total, fileName });
      });

      // Validate each material
      const previewItems: PreviewMaterial[] = result.materials.map((m) => ({
        material: m,
        ...validateMaterial(m),
      }));

      setPreview(previewItems);
      setErrors(result.errors);
      setIgnored(result.ignored);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      setErrors([msg]);
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0, fileName: '' });
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFiles]
  );

  const handleImport = () => {
    const validMaterials = preview.filter((p) => p.valid).map((p) => p.material);

    if (validMaterials.length === 0) {
      setErrors(['No valid materials to import']);
      return;
    }

    addMaterials(validMaterials);
    setImportComplete(true);
  };

  const handleClear = () => {
    setPreview([]);
    setErrors([]);
    setIgnored([]);
    setImportComplete(false);
  };

  const handleViewMaterials = () => {
    router.push('/materials');
  };

  const validCount = preview.filter((p) => p.valid).length;
  const warningCount = preview.filter((p) => !p.valid && p.warnings.length > 0).length;
  const errorCount = errors.length;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Import Materials</h1>
        <p className="text-muted-foreground">
          Import material DNA records from JSON or ZIP files
        </p>
        {materialCount > 0 && (
          <Badge variant="secondary" className="mt-2">
            {materialCount} materials in library
          </Badge>
        )}
      </div>

      {/* Drop Zone */}
      {!importComplete && (
        <Card className="mb-6">
          <CardContent className="p-0">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                flex flex-col items-center justify-center w-full h-48
                border-2 border-dashed rounded-lg cursor-pointer
                transition-colors
                ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent/50'}
              `}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Processing {progress.current} of {progress.total} files...
                  </p>
                  <p className="text-xs text-muted-foreground">{progress.fileName}</p>
                </div>
              ) : (
                <>
                  <div className="flex gap-4 mb-4">
                    <FileJson className="h-10 w-10 text-muted-foreground" />
                    <FileArchive className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JSON or ZIP files (multiple files OK)
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".json,.zip"
              multiple
              onChange={handleFileInput}
            />
          </CardContent>
        </Card>
      )}

      {/* Import Complete */}
      {importComplete && (
        <Card className="mb-6 border-green-500/20 bg-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Import Successful!</h3>
                <p className="text-muted-foreground">
                  {validCount} materials have been added to your library.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClear}>
                  Import More
                </Button>
                <Button onClick={handleViewMaterials}>
                  View Materials
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {preview.length > 0 && !importComplete && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">
              Preview ({preview.length} materials found)
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </CardHeader>
          <CardContent>
            {/* Stats */}
            <div className="flex gap-4 mb-4">
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                {validCount} valid
              </Badge>
              {warningCount > 0 && (
                <Badge variant="warning" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {warningCount} warnings
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  {errorCount} errors
                </Badge>
              )}
            </div>

            {/* Materials Table */}
            <div className="max-h-64 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card border-b">
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Chemistry</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((item, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-2 font-medium">
                        {item.material.classification?.tier6_productVariant?.name ||
                          item.material.id ||
                          'Unknown'}
                      </td>
                      <td className="p-2">
                        {item.material.classification?.tier2_category?.code || '-'}
                      </td>
                      <td className="p-2">
                        {item.material.physical?.tier7_baseChemistry?.code || '-'}
                      </td>
                      <td className="p-2">
                        {item.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <span title={item.warnings.join(', ')}>
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-500/10 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2">Errors:</h4>
                <ul className="text-sm text-red-400 space-y-1">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ignored Files */}
            {ignored.length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowIgnored(!showIgnored)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  {showIgnored ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {ignored.length} files ignored
                </button>
                {showIgnored && (
                  <ul className="mt-2 text-xs text-muted-foreground max-h-32 overflow-y-auto">
                    {ignored.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Button */}
      {preview.length > 0 && !importComplete && (
        <div className="flex gap-4">
          <Button
            onClick={handleImport}
            disabled={validCount === 0}
            className="flex-1"
            size="lg"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import {validCount} Materials
          </Button>
          <Button variant="outline" size="lg" onClick={handleClear}>
            Cancel
          </Button>
        </div>
      )}

      {/* Example JSON */}
      {preview.length === 0 && !importComplete && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Supported Formats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Single Material</h4>
              <pre className="p-3 rounded-md bg-muted text-xs overflow-x-auto">
                {`{
  "id": "dna_001",
  "classification": {
    "tier6_productVariant": { "name": "BITUTHENE 3000" }
  },
  "physical": {
    "tier7_baseChemistry": { "code": "SBS" }
  }
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">Array of Materials</h4>
              <pre className="p-3 rounded-md bg-muted text-xs overflow-x-auto">
                {`[
  { "id": "dna_001", "classification": {...}, "physical": {...} },
  { "id": "dna_002", "classification": {...}, "physical": {...} }
]`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">ZIP File</h4>
              <p className="text-sm text-muted-foreground">
                ZIP containing multiple JSON files. Nested folders are flattened.
                Garbage files (__MACOSX, .DS_Store, etc.) are automatically ignored.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
