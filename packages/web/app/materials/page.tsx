'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Package, Download, FileJson, FileArchive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMaterialsStore } from '@/lib/store';
import { exportToJson, exportToZip, downloadFile } from '@/lib/file-processor';
import type { MaterialDNA } from '@construction-dna/kernel';

interface DisplayMaterial {
  id: string;
  name: string;
  chemistry: string;
  manufacturer: string;
  category: string;
  validated: boolean;
}

function transformMaterial(m: MaterialDNA): DisplayMaterial {
  return {
    id: m.id,
    name: m.classification?.tier6_productVariant?.name || m.id || 'Unknown',
    chemistry: m.physical?.tier7_baseChemistry?.code || '-',
    manufacturer: m.classification?.tier5_manufacturer?.name ||
                  m.classification?.tier5_manufacturer?.code || '-',
    category: m.classification?.tier2_category?.code || '-',
    validated: !!(m.classification?.tier6_productVariant?.name &&
                  m.physical?.tier7_baseChemistry?.code),
  };
}

export default function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const allMaterials = useMaterialsStore((s) => s.getAllMaterials());
  const materialCount = useMaterialsStore((s) => s.getMaterialCount());
  const clearMaterials = useMaterialsStore((s) => s.clearMaterials);

  const displayMaterials = useMemo(
    () => allMaterials.map(transformMaterial),
    [allMaterials]
  );

  const filteredMaterials = useMemo(
    () =>
      displayMaterials.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.chemistry.toLowerCase().includes(search.toLowerCase()) ||
          m.manufacturer.toLowerCase().includes(search.toLowerCase())
      ),
    [displayMaterials, search]
  );

  const handleExportJson = () => {
    if (allMaterials.length === 0) return;
    const json = exportToJson(allMaterials);
    downloadFile(json, `materials-${Date.now()}.json`);
  };

  const handleExportZip = async () => {
    if (allMaterials.length === 0) return;
    setIsExporting(true);
    try {
      const blob = await exportToZip(allMaterials);
      downloadFile(blob, `materials-${Date.now()}.zip`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all materials? This cannot be undone.')) {
      clearMaterials();
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Materials</h1>
          <p className="text-muted-foreground">
            Browse and manage material DNA records
          </p>
          {materialCount > 0 && (
            <Badge variant="secondary" className="mt-2">
              {materialCount} materials in library
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {materialCount > 0 && (
            <>
              <Button variant="outline" onClick={handleExportJson} title="Export as JSON">
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button
                variant="outline"
                onClick={handleExportZip}
                disabled={isExporting}
                title="Export as ZIP"
              >
                <FileArchive className="h-4 w-4 mr-2" />
                ZIP
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive"
                title="Clear all materials"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          <Link href="/import">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Import
            </Button>
          </Link>
          <Link href="/materials/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Material
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Materials Table/List */}
      {filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No materials found</p>
              <p className="text-sm mb-4">
                {search
                  ? 'Try adjusting your search'
                  : 'Get started by importing or adding your first material'}
              </p>
              {!search && (
                <div className="flex gap-2 justify-center">
                  <Link href="/import">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Import Materials
                    </Button>
                  </Link>
                  <Link href="/materials/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Material
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Chemistry</th>
                  <th className="text-left p-4 font-medium">Manufacturer</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMaterials.map((material) => (
                  <tr
                    key={material.id}
                    className="border-b hover:bg-accent/50 cursor-pointer"
                  >
                    <td className="p-4">
                      <Link
                        href={`/materials/${material.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {material.name}
                      </Link>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{material.chemistry}</Badge>
                    </td>
                    <td className="p-4">{material.manufacturer}</td>
                    <td className="p-4">{material.category}</td>
                    <td className="p-4">
                      <Badge variant={material.validated ? 'success' : 'outline'}>
                        {material.validated ? 'Validated' : 'Draft'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
