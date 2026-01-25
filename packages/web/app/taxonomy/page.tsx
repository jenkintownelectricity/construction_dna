'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sample taxonomy structure - will be loaded from API
const sampleTaxonomy = {
  name: 'Construction Materials',
  code: 'ROOT',
  children: [
    {
      name: '07 - Thermal & Moisture Protection',
      code: '07',
      children: [
        {
          name: 'WP - Waterproofing',
          code: 'WP',
          children: [
            { name: 'FW - Fluid/Sheet', code: 'FW', children: [], materialCount: 32 },
            { name: 'SP - Spray Applied', code: 'SP', children: [], materialCount: 8 },
          ],
          materialCount: 40,
        },
        {
          name: 'RF - Roofing',
          code: 'RF',
          children: [
            { name: 'SM - Single-Ply Membrane', code: 'SM', children: [], materialCount: 25 },
            { name: 'BU - Built-Up', code: 'BU', children: [], materialCount: 15 },
          ],
          materialCount: 40,
        },
        {
          name: 'AB - Air Barriers',
          code: 'AB',
          children: [],
          materialCount: 18,
        },
      ],
      materialCount: 98,
    },
  ],
  materialCount: 98,
};

interface TreeNode {
  name: string;
  code: string;
  children: TreeNode[];
  materialCount?: number;
}

function TreeNodeComponent({
  node,
  level = 0,
  path = [],
}: {
  node: TreeNode;
  level?: number;
  path?: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;
  const currentPath = [...path, node.code];

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer hover:bg-accent',
          level === 0 && 'font-semibold'
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-primary" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
        <span className="flex-1 truncate">{node.name}</span>
        {node.materialCount !== undefined && (
          <Badge variant="secondary" className="ml-2">
            {node.materialCount}
          </Badge>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.code}
              node={child}
              level={level + 1}
              path={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaxonomyPage() {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Taxonomy Explorer</h1>
        <p className="text-muted-foreground">
          Navigate the 20-tier material classification system
        </p>
      </div>

      {/* Breadcrumb */}
      {selectedPath.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="text-muted-foreground">Path:</span>
          {selectedPath.map((code, i) => (
            <span key={code} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <Badge variant="outline">{code}</Badge>
            </span>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* Tree */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Classification Tree</CardTitle>
          </CardHeader>
          <CardContent>
            <TreeNodeComponent node={sampleTaxonomy} />
          </CardContent>
        </Card>

        {/* Tier Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">20-Tier System</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <div>
              <h4 className="font-semibold text-primary">Classification (1-6)</h4>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>1. Division</li>
                <li>2. Category</li>
                <li>3. Assembly Type</li>
                <li>4. Condition</li>
                <li>5. Manufacturer</li>
                <li>6. Product Variant</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Physical (7-12)</h4>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>7. Base Chemistry</li>
                <li>8. Reinforcement</li>
                <li>9. Surface Treatment</li>
                <li>10. Thickness</li>
                <li>11. Color/Reflectivity</li>
                <li>12. Fire Rating</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Performance (13-16)</h4>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>13. Permeance</li>
                <li>14. Tensile Strength</li>
                <li>15. Elongation</li>
                <li>16. Temperature Range</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Engineering (17-20)</h4>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                <li>17. Failure Modes</li>
                <li>18. Compatibility</li>
                <li>19. Constraints</li>
                <li>20. Code References</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
