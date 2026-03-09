import { Port } from '@/lib/types/domain';
import { TrendIndicator } from '@/components/ui/trend-indicator';

export function PortDetailHeader({ port }: { port: Port }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-card/70 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{port.country} • {port.region}</p>
      <h1 className="mt-1 text-3xl font-semibold text-cyan-50">{port.name}</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-400">Congestion Score</p>
          <p className="text-2xl font-bold text-white">{port.congestionScore}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Ships Waiting</p>
          <p className="text-2xl font-bold text-white">{port.shipsWaiting}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Average Delay</p>
          <p className="text-2xl font-bold text-white">{port.avgDelayHours}h</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Trend</p>
          <TrendIndicator value={port.trendDeltaPct} />
        </div>
      </div>
    </section>
  );
}
