'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for now - will be replaced with API calls
const mockMaterials: Array<{
  id: string;
  name: string;
  chemistry: string;
  manufacturer: string;
  category: string;
  validated: boolean;
}> = [];

export default function MaterialsPage() {
  const [search, setSearch] = useState('');
  const [materials] = useState(mockMaterials);

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.chemistry.toLowerCase().includes(search.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Materials</h1>
          <p className="text-muted-foreground">
            Browse and manage material DNA records
          </p>
        </div>
        <Link href="/materials/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Material
          </Button>
        </Link>
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
                  : 'Get started by adding your first material'}
              </p>
              {!search && (
                <Link href="/materials/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Material
                  </Button>
                </Link>
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
