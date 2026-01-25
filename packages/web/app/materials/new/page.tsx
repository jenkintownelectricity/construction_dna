'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const chemistryOptions = [
  { code: 'SBS', name: 'Styrene-Butadiene-Styrene' },
  { code: 'APP', name: 'Atactic Polypropylene' },
  { code: 'TPO', name: 'Thermoplastic Polyolefin' },
  { code: 'PVC', name: 'Polyvinyl Chloride' },
  { code: 'EPDM', name: 'Ethylene Propylene Diene Monomer' },
  { code: 'HDPE', name: 'High Density Polyethylene' },
  { code: 'PU', name: 'Polyurethane' },
];

const divisionOptions = [
  { code: '07', name: 'Thermal & Moisture Protection' },
  { code: '08', name: 'Openings' },
  { code: '09', name: 'Finishes' },
];

const categoryOptions = [
  { code: 'WP', name: 'Waterproofing' },
  { code: 'RF', name: 'Roofing' },
  { code: 'AB', name: 'Air Barriers' },
  { code: 'IN', name: 'Insulation' },
];

export default function NewMaterialPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    manufacturerCode: '',
    manufacturerName: '',
    division: '07',
    category: 'WP',
    chemistry: 'SBS',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const chemistry = chemistryOptions.find((c) => c.code === formData.chemistry);

      const material = {
        classification: {
          tier1_division: { code: formData.division },
          tier2_category: { code: formData.category },
          tier5_manufacturer: {
            code: formData.manufacturerCode,
            name: formData.manufacturerName,
          },
          tier6_productVariant: {
            code: formData.productName.substring(0, 4).toUpperCase(),
            name: formData.productName,
          },
        },
        physical: {
          tier7_baseChemistry: {
            type: chemistry?.code,
            code: chemistry?.code,
            name: chemistry?.name,
          },
        },
      };

      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material),
      });

      if (response.ok) {
        router.push('/materials');
      }
    } catch (error) {
      console.error('Error creating material:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/materials"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Materials
        </Link>
        <h1 className="text-3xl font-bold">New Material</h1>
        <p className="text-muted-foreground">
          Create a new material DNA record
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Classification */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Division
                </label>
                <select
                  value={formData.division}
                  onChange={(e) =>
                    setFormData({ ...formData, division: e.target.value })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                >
                  {divisionOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.code} - {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.code} - {opt.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manufacturer */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Manufacturer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Manufacturer Code
                </label>
                <Input
                  value={formData.manufacturerCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      manufacturerCode: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="e.g., GCP"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Manufacturer Name
                </label>
                <Input
                  value={formData.manufacturerName}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturerName: e.target.value })
                  }
                  placeholder="e.g., GCP Applied Technologies"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Product</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name
              </label>
              <Input
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                placeholder="e.g., BITUTHENE 3000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Base Chemistry
              </label>
              <div className="flex flex-wrap gap-2">
                {chemistryOptions.map((chem) => (
                  <Badge
                    key={chem.code}
                    variant={formData.chemistry === chem.code ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() =>
                      setFormData({ ...formData, chemistry: chem.code })
                    }
                  >
                    {chem.code}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {chemistryOptions.find((c) => c.code === formData.chemistry)?.name}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={
              isLoading ||
              !formData.productName ||
              !formData.manufacturerCode ||
              !formData.manufacturerName
            }
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Material
              </>
            )}
          </Button>
          <Link href="/materials">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
