import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { TrendIndicator } from '@/components/ui/trend-indicator';
import { Port } from '@/lib/types/domain';

export function PortStatusCard({ port }: { port: Port }) {
  const statusClass = port.status === 'severe' ? 'text-red-300' : port.status === 'elevated' ? 'text-amber-300' : 'text-emerald-300';
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-100">{port.name}</p>
        <span className={`text-xs uppercase ${statusClass}`}>{port.status}</span>
      </div>
      <p className="mt-2 text-3xl font-bold text-white">{port.congestionScore}</p>
      <p className="text-xs uppercase tracking-wider text-slate-400">Congestion Index</p>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-300">
        <span>{port.shipsWaiting} waiting</span>
        <TrendIndicator value={port.trendDeltaPct} />
      </div>
      <Link href={`/ports/${port.slug}`} className="mt-3 inline-flex text-xs text-cyan-300 hover:underline">Open Port Detail</Link>
    </Card>
  );
}
