'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  GitBranch,
  MessageSquare,
  GitCompare,
  Upload,
  Dna,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Materials', href: '/materials', icon: Package },
  { name: 'Taxonomy', href: '/taxonomy', icon: GitBranch },
  { name: 'Ask AI', href: '/ask', icon: MessageSquare },
  { name: 'Compatibility', href: '/compatibility', icon: GitCompare },
  { name: 'Import', href: '/import', icon: Upload },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Dna className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-lg font-bold">Construction</h1>
          <p className="text-xs text-muted-foreground">DNA System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          Construction DNA v0.1.0
        </p>
      </div>
    </div>
  );
}
