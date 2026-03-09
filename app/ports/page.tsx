import type { Metadata } from 'next';
import Link from 'next/link';
import { AppShell } from '@/components/dashboard/app-shell';
import { Card } from '@/components/ui/card';
import { TrendIndicator } from '@/components/ui/trend-indicator';
import { getCongestionSnapshot } from '@/lib/providers/portCongestionProvider';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ports Overview | Supply Chain Pulse',
  description: 'Global port congestion ranking with queue depth, average delays, and trend velocity.'
};

export default async function PortsPage() {
  const snapshot = await getCongestionSnapshot();
  return (
    <AppShell>
      <section>
        <h1 className="text-3xl font-semibold text-cyan-100">Ports Overview</h1>
        <p className="mt-2 text-sm text-slate-300">Compare congestion score, queue depth, and delay trend across major gateways.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {snapshot.ports.map((port) => (
          <Card key={port.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-100">{port.name}</p>
                <p className="text-xs text-slate-400">{port.country} • {port.region}</p>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-200">{port.status}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-300">
              <div>
                <p className="text-xs text-slate-400">Congestion</p>
                <p className="text-xl font-semibold text-white">{port.congestionScore}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Ships waiting</p>
                <p>{port.shipsWaiting}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Avg delay</p>
                <p>{port.avgDelayHours}h</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Trend</p>
                <TrendIndicator value={port.trendDeltaPct} />
              </div>
            </div>
            <p className="mt-3 text-xs text-cyan-200">Trade lane exposure: {port.tradeLaneExposure}</p>
            <Link href={`/ports/${port.slug}`} className="mt-4 inline-flex text-sm text-cyan-300 hover:underline">View detail</Link>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
