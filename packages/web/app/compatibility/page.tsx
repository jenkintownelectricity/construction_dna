'use client';

import { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CompatibilityResult {
  compatible: boolean;
  status: 'compatible' | 'conditional' | 'incompatible';
  materials: string[];
  issues: Array<{
    materialType: string;
    status: string;
    reason: string;
    requirement?: string;
  }>;
  requirements: string[];
  explanation: string;
}

const commonChemistries = [
  'SBS',
  'APP',
  'TPO',
  'PVC',
  'EPDM',
  'HDPE',
  'Asphalt',
  'Bitumen',
  'Polyurethane',
  'Acrylic',
];

export default function CompatibilityPage() {
  const [material1, setMaterial1] = useState('');
  const [material2, setMaterial2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const handleCheck = async () => {
    if (!material1.trim() || !material2.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material1, material2 }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking compatibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!result) return null;
    switch (result.status) {
      case 'compatible':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'conditional':
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case 'incompatible':
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    if (!result) return '';
    switch (result.status) {
      case 'compatible':
        return 'bg-green-500/10 border-green-500/20';
      case 'conditional':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'incompatible':
        return 'bg-red-500/10 border-red-500/20';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Compatibility Checker</h1>
        <p className="text-muted-foreground">
          Check if two materials can be used together
        </p>
      </div>

      {/* Input Form */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Material 1 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Material 1
              </label>
              <Input
                value={material1}
                onChange={(e) => setMaterial1(e.target.value)}
                placeholder="Enter chemistry type (e.g., EPDM)"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {commonChemistries.slice(0, 5).map((chem) => (
                  <Badge
                    key={chem}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setMaterial1(chem)}
                  >
                    {chem}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Material 2 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Material 2
              </label>
              <Input
                value={material2}
                onChange={(e) => setMaterial2(e.target.value)}
                placeholder="Enter chemistry type (e.g., Asphalt)"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {commonChemistries.slice(5).map((chem) => (
                  <Badge
                    key={chem}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setMaterial2(chem)}
                  >
                    {chem}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleCheck}
            disabled={!material1.trim() || !material2.trim() || isLoading}
            className="w-full mt-6"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Check Compatibility
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className={getStatusColor()}>
          <CardHeader>
            <div className="flex items-center gap-4">
              {getStatusIcon()}
              <div>
                <CardTitle className="text-2xl">
                  {result.status === 'compatible' && 'Compatible'}
                  {result.status === 'conditional' && 'Conditional'}
                  {result.status === 'incompatible' && 'Incompatible'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {material1} + {material2}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Explanation */}
            <p>{result.explanation}</p>

            {/* Issues */}
            {result.issues?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Issues:</h4>
                <ul className="space-y-2">
                  {result.issues.map((issue, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm"
                    >
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-yellow-500" />
                      <span>
                        <strong>{issue.materialType}:</strong> {issue.reason}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {result.requirements?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
