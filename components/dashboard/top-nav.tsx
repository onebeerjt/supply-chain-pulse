'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radar } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/ports', label: 'Ports' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/about', label: 'About' }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050b17]/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2 text-sm font-semibold tracking-wide text-cyan-100">
          <Radar className="h-4 w-4 text-cyan-300 transition group-hover:rotate-12" />
          <span>Supply Chain Pulse</span>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {links.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs transition',
                  isActive ? 'bg-cyan-400/15 text-cyan-100' : 'text-slate-200 hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
