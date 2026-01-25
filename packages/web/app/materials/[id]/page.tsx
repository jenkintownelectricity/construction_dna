'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMaterialsStore } from '@/lib/store';

export default function MaterialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const material = useMaterialsStore((state) => state.getMaterial(id));

  if (!material) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/materials')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Materials
        </Button>
        <Card>
          <CardContent className="p-12">
            <div className="text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Material not found</p>
              <p className="text-sm">ID: {id}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { classification, physical, performance, engineering } = material;

  // Get display name
  const displayName =
    classification?.tier6_productVariant?.name ||
    material.id ||
    'Unknown Material';

  // Get spec sheet URLs
  const specSheetUrl = (classification?.tier6_productVariant as any)?.specSheetUrl;
  const productPageUrl = (classification?.tier6_productVariant as any)?.productPageUrl;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/materials')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Materials
      </Button>

      {/* Header Card */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
              <p className="text-lg text-muted-foreground">
                {classification?.tier5_manufacturer?.name ||
                  classification?.tier5_manufacturer?.code ||
                  'Unknown Manufacturer'}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {classification?.tier2_category?.name ||
                classification?.tier2_category?.code ||
                'Uncategorized'}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {specSheetUrl && (
              <a
                href={specSheetUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="gap-2">
                  <FileText className="h-4 w-4" />
                  View Spec Sheet
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}
            {productPageUrl && (
              <a
                href={productPageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Manufacturer Page
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            )}
            <Link href="/compatibility">
              <Button variant="outline" className="gap-2">
                Check Compatibility
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Classification Section - Tiers 1-6 */}
      <Section title="Classification" subtitle="Tiers 1-6">
        <DataRow
          label="Division"
          value={
            classification?.tier1_division
              ? `${classification.tier1_division.code} - ${classification.tier1_division.name}`
              : undefined
          }
        />
        <DataRow
          label="Category"
          value={
            classification?.tier2_category
              ? `${classification.tier2_category.code} - ${classification.tier2_category.name}`
              : undefined
          }
        />
        <DataRow
          label="Assembly Type"
          value={
            classification?.tier3_assemblyType
              ? `${classification.tier3_assemblyType.code} - ${classification.tier3_assemblyType.name}`
              : undefined
          }
        />
        <DataRow
          label="Condition"
          value={
            classification?.tier4_condition
              ? `${classification.tier4_condition.code} - ${classification.tier4_condition.name}`
              : undefined
          }
        />
        <DataRow
          label="Manufacturer"
          value={
            classification?.tier5_manufacturer
              ? `${classification.tier5_manufacturer.code} - ${classification.tier5_manufacturer.name}`
              : undefined
          }
        />
        <DataRow
          label="Product Variant"
          value={
            classification?.tier6_productVariant
              ? `${classification.tier6_productVariant.code} - ${classification.tier6_productVariant.name}`
              : undefined
          }
        />
      </Section>

      {/* Physical Properties Section - Tiers 7-12 */}
      <Section title="Physical Properties" subtitle="Tiers 7-12">
        <DataRow
          label="Base Chemistry"
          value={
            physical?.tier7_baseChemistry
              ? `${physical.tier7_baseChemistry.code} - ${physical.tier7_baseChemistry.name}${
                  physical.tier7_baseChemistry.type
                    ? ` (${physical.tier7_baseChemistry.type})`
                    : ''
                }`
              : undefined
          }
        />
        <DataRow
          label="Reinforcement"
          value={
            physical?.tier8_reinforcement
              ? `${physical.tier8_reinforcement.code} - ${physical.tier8_reinforcement.type}${
                  physical.tier8_reinforcement.description
                    ? ` (${physical.tier8_reinforcement.description})`
                    : ''
                }`
              : undefined
          }
        />
        <DataRow
          label="Surface Treatment"
          value={
            physical?.tier9_surfaceTreatment
              ? `${physical.tier9_surfaceTreatment.code} - ${physical.tier9_surfaceTreatment.type}${
                  physical.tier9_surfaceTreatment.description
                    ? ` (${physical.tier9_surfaceTreatment.description})`
                    : ''
                }`
              : undefined
          }
        />
        <DataRow
          label="Thickness"
          value={
            physical?.tier10_thicknessClass
              ? `${physical.tier10_thicknessClass.nominalMils} mil (${physical.tier10_thicknessClass.code})${
                  physical.tier10_thicknessClass.tolerancePlus
                    ? ` +${physical.tier10_thicknessClass.tolerancePlus}/-${physical.tier10_thicknessClass.toleranceMinus} mil`
                    : ''
                }`
              : undefined
          }
        />
        <DataRow
          label="Color / Reflectivity"
          value={
            physical?.tier11_colorReflectivity
              ? `${physical.tier11_colorReflectivity.code} - ${physical.tier11_colorReflectivity.colorName}${
                  physical.tier11_colorReflectivity.sri
                    ? ` (SRI: ${physical.tier11_colorReflectivity.sri})`
                    : ''
                }`
              : undefined
          }
        />
        <DataRow
          label="Fire Rating"
          value={
            physical?.tier12_fireRating
              ? `Class ${physical.tier12_fireRating.class}${
                  physical.tier12_fireRating.ul790 || physical.tier12_fireRating.astmE108
                    ? ` (${[
                        physical.tier12_fireRating.ul790 ? 'UL 790' : '',
                        physical.tier12_fireRating.astmE108 ? 'ASTM E108' : '',
                      ]
                        .filter(Boolean)
                        .join(', ')})`
                    : ''
                }`
              : undefined
          }
        />
      </Section>

      {/* Performance Section - Tiers 13-16 */}
      <Section title="Performance" subtitle="Tiers 13-16">
        <DataRow
          label="Perm Rating"
          value={
            performance?.tier13_permRating
              ? `Class ${performance.tier13_permRating.class} (${performance.tier13_permRating.perms} perms)`
              : undefined
          }
        />
        <DataRow
          label="Tensile Strength"
          value={
            performance?.tier14_tensileStrength
              ? `${performance.tier14_tensileStrength.psiMD} psi MD / ${performance.tier14_tensileStrength.psiCD} psi CD`
              : undefined
          }
        />
        <DataRow
          label="Elongation"
          value={
            performance?.tier15_elongation
              ? `${performance.tier15_elongation.percentMD}% MD / ${performance.tier15_elongation.percentCD}% CD${
                  performance.tier15_elongation.bridgesCracks !== undefined
                    ? ` (Crack bridging: ${performance.tier15_elongation.bridgesCracks ? 'Yes' : 'No'})`
                    : ''
                }`
              : undefined
          }
        />
        {performance?.tier16_temperatureRange && (
          <>
            <DataRow
              label="Service Temp Range"
              value={`${performance.tier16_temperatureRange.minServiceF}°F to ${performance.tier16_temperatureRange.maxServiceF}°F`}
            />
            <DataRow
              label="Application Temp Range"
              value={`${performance.tier16_temperatureRange.minApplicationF}°F to ${performance.tier16_temperatureRange.maxApplicationF}°F`}
            />
          </>
        )}
      </Section>

      {/* Failure Modes Section - Tier 17 */}
      {engineering?.tier17_failureModes &&
        engineering.tier17_failureModes.length > 0 && (
          <Section title="Failure Modes" subtitle="Tier 17">
            {engineering.tier17_failureModes.map((failure: any, idx: number) => (
              <Card
                key={idx}
                className="mb-3 border-yellow-500/30 bg-yellow-500/5"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      {failure.name}
                    </span>
                    <Badge
                      variant={
                        failure.severity === 'high'
                          ? 'destructive'
                          : failure.severity === 'medium'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {failure.severity?.toUpperCase() || 'UNKNOWN'}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-2">
                    {failure.causes?.length > 0 && (
                      <p>
                        <strong>Causes:</strong> {failure.causes.join(', ')}
                      </p>
                    )}
                    {failure.symptoms?.length > 0 && (
                      <p>
                        <strong>Symptoms:</strong> {failure.symptoms.join(', ')}
                      </p>
                    )}
                    {failure.timeToFailure && (
                      <p>
                        <strong>Time to Failure:</strong> {failure.timeToFailure}
                      </p>
                    )}
                    {failure.prevention?.length > 0 && (
                      <p>
                        <strong>Prevention:</strong>{' '}
                        {failure.prevention.join(', ')}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </Section>
        )}

      {/* Compatibility Matrix Section - Tier 18 */}
      {engineering?.tier18_compatibilityMatrix && (
        <Section title="Compatibility Matrix" subtitle="Tier 18">
          {/* Compatible */}
          {engineering.tier18_compatibilityMatrix.compatible?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-green-500 flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4" /> Compatible
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                {engineering.tier18_compatibilityMatrix.compatible.map(
                  (item: any, idx: number) => (
                    <li key={idx}>
                      <strong>{item.chemistryType}</strong>
                      {item.reason && ` - ${item.reason}`}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Incompatible */}
          {engineering.tier18_compatibilityMatrix.incompatible?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-red-500 flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4" /> Incompatible
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                {engineering.tier18_compatibilityMatrix.incompatible.map(
                  (item: any, idx: number) => (
                    <li key={idx}>
                      <strong>{item.chemistryType}</strong>
                      {item.reason && ` - ${item.reason}`}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Conditional */}
          {engineering.tier18_compatibilityMatrix.conditional?.length > 0 && (
            <div>
              <h4 className="font-semibold text-yellow-500 flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4" /> Conditional
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                {engineering.tier18_compatibilityMatrix.conditional.map(
                  (item: any, idx: number) => (
                    <li key={idx}>
                      <strong>{item.chemistryType}</strong>
                      {item.requirement && ` - ${item.requirement}`}
                      {item.reason && ` (${item.reason})`}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {/* Empty state */}
          {!engineering.tier18_compatibilityMatrix.compatible?.length &&
            !engineering.tier18_compatibilityMatrix.incompatible?.length &&
            !engineering.tier18_compatibilityMatrix.conditional?.length && (
              <p className="text-muted-foreground text-sm">
                No compatibility data available
              </p>
            )}
        </Section>
      )}

      {/* Application Constraints Section - Tier 19 */}
      {engineering?.tier19_applicationConstraints &&
        engineering.tier19_applicationConstraints.length > 0 && (
          <Section title="Application Constraints" subtitle="Tier 19">
            {engineering.tier19_applicationConstraints.map((constraint: any, idx: number) => (
              <Card
                key={idx}
                className="mb-3 border-blue-500/30 bg-blue-500/5"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">
                      {constraint.type || 'Constraint'}
                    </span>
                    {constraint.violationSeverity && (
                      <Badge
                        variant={
                          constraint.violationSeverity === 'high' ||
                          constraint.violationSeverity === 'critical'
                            ? 'destructive'
                            : constraint.violationSeverity === 'medium'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {constraint.violationSeverity?.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm mb-2">{constraint.description}</p>
                  {(constraint.minValue !== undefined ||
                    constraint.maxValue !== undefined) && (
                    <p className="text-sm text-muted-foreground">
                      Range: {constraint.minValue ?? '—'} to{' '}
                      {constraint.maxValue ?? '—'} {constraint.unit || ''}
                    </p>
                  )}
                  {constraint.consequence && (
                    <p className="text-sm mt-2">
                      <strong>If violated:</strong> {constraint.consequence}
                    </p>
                  )}
                  {constraint.workarounds?.length > 0 && (
                    <p className="text-sm mt-1">
                      <strong>Workarounds:</strong>{' '}
                      {constraint.workarounds.join(', ')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </Section>
        )}

      {/* Code References Section - Tier 20 */}
      {engineering?.tier20_codeReferences &&
        engineering.tier20_codeReferences.length > 0 && (
          <Section title="Code References" subtitle="Tier 20">
            <div className="space-y-3">
              {engineering.tier20_codeReferences.map((ref: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0"
                >
                  <Badge
                    variant={ref.compliant ? 'success' : 'secondary'}
                    className="shrink-0 mt-0.5"
                  >
                    {ref.code}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">
                      {ref.fullName || ref.code}
                      {ref.section && ` - ${ref.section}`}
                    </p>
                    {ref.requirement && (
                      <p className="text-sm text-muted-foreground">
                        {ref.requirement}
                      </p>
                    )}
                    {ref.edition && (
                      <p className="text-xs text-muted-foreground">
                        Edition: {ref.edition}
                      </p>
                    )}
                    {ref.url && (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        View Standard
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

      {/* Validation Badge */}
      {(material as any).expertValidated && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-4">
            <p className="text-green-500 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>
                Expert Validated by {(material as any).validatedBy || 'Unknown'}{' '}
                on {(material as any).validatedDate || 'Unknown date'}
              </span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Raw Data Debug (collapsed) */}
      <details className="mt-8">
        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
          View Raw JSON Data
        </summary>
        <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-x-auto">
          {JSON.stringify(material, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// Helper Components
function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          {title}
          {subtitle && (
            <span className="text-sm font-normal text-muted-foreground">
              ({subtitle})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return (
    <div className="flex py-2 border-b border-border/50 last:border-0">
      <span className="w-44 text-muted-foreground font-medium shrink-0">
        {label}
      </span>
      <span className="flex-1">{value}</span>
    </div>
  );
}
