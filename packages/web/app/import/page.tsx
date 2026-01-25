'use client';

import { useState } from 'react';
import { Upload, FileJson, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImportPage() {
  const [jsonContent, setJsonContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    imported: number;
    failed: number;
    errors?: string[];
  } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonContent(content);
      setResult(null);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonContent.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const data = JSON.parse(jsonContent);
      const materials = Array.isArray(data) ? data : [data];

      let imported = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const material of materials) {
        try {
          const response = await fetch('/api/materials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(material),
          });

          if (response.ok) {
            imported++;
          } else {
            failed++;
            errors.push(`Failed to import: ${material.classification?.tier6_productVariant?.name || 'Unknown'}`);
          }
        } catch {
          failed++;
        }
      }

      setResult({
        success: failed === 0,
        imported,
        failed,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        failed: 1,
        errors: ['Invalid JSON format'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Import Materials</h1>
        <p className="text-muted-foreground">
          Import material DNA records from JSON
        </p>
      </div>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Upload JSON File</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FileJson className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">JSON file only</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleFileUpload}
            />
          </label>
        </CardContent>
      </Card>

      {/* JSON Preview */}
      {jsonContent && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              className="w-full h-64 p-4 rounded-md border border-input bg-background font-mono text-sm"
              placeholder="Paste JSON here..."
            />
          </CardContent>
        </Card>
      )}

      {/* Import Button */}
      <Button
        onClick={handleImport}
        disabled={!jsonContent.trim() || isLoading}
        className="w-full mb-6"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Importing...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Import Materials
          </>
        )}
      </Button>

      {/* Result */}
      {result && (
        <Card className={result.success ? 'border-green-500/20' : 'border-red-500/20'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              {result.success ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <AlertCircle className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className="font-semibold">
                  {result.success ? 'Import Successful' : 'Import Completed with Errors'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.imported} imported, {result.failed} failed
                </p>
              </div>
            </div>
            {result.errors && result.errors.length > 0 && (
              <ul className="mt-4 text-sm text-red-400 list-disc list-inside">
                {result.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      )}

      {/* Example JSON */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Example JSON Format</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-4 rounded-md bg-muted text-xs overflow-x-auto">
{`[
  {
    "classification": {
      "tier1_division": { "code": "07" },
      "tier2_category": { "code": "WP" },
      "tier5_manufacturer": {
        "code": "GCP",
        "name": "GCP Applied Technologies"
      },
      "tier6_productVariant": {
        "code": "B3K",
        "name": "BITUTHENE 3000"
      }
    },
    "physical": {
      "tier7_baseChemistry": {
        "type": "SBS",
        "code": "SBS",
        "name": "Styrene-Butadiene-Styrene"
      }
    }
  }
]`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
