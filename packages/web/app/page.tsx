import Link from 'next/link';
import { Package, Dna, CheckCircle, Plus, MessageSquare, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Stats component
function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Quick action button
function QuickAction({
  title,
  href,
  icon: Icon,
}: {
  title: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <Button variant="outline" className="h-24 w-full flex-col gap-2">
        <Icon className="h-6 w-6" />
        <span>{title}</span>
      </Button>
    </Link>
  );
}

export default function DashboardPage() {
  // In a real app, these would come from the API
  const stats = {
    materials: 0,
    chemistries: 16,
    validated: 0,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Construction DNA</h1>
        <p className="text-muted-foreground">
          20-Tier Material DNA Taxonomy System
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <StatCard
          title="Materials"
          value={stats.materials}
          description="Total DNA records"
          icon={Package}
        />
        <StatCard
          title="Chemistries"
          value={stats.chemistries}
          description="Base types defined"
          icon={Dna}
        />
        <StatCard
          title="Validated"
          value={stats.validated}
          description="Expert approved"
          icon={CheckCircle}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <QuickAction
            title="Add New Material"
            href="/materials/new"
            icon={Plus}
          />
          <QuickAction
            title="Ask AI Question"
            href="/ask"
            icon={MessageSquare}
          />
          <QuickAction
            title="Check Compatibility"
            href="/compatibility"
            icon={Zap}
          />
        </div>
      </div>

      {/* Recent Materials */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Materials</h2>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-muted-foreground py-8">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No materials yet</p>
              <p className="text-sm">
                <Link href="/materials/new" className="text-primary hover:underline">
                  Add your first material
                </Link>{' '}
                or{' '}
                <Link href="/import" className="text-primary hover:underline">
                  import from JSON
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
