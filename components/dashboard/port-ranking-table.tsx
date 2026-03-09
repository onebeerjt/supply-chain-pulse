'use client';

import { useMemo, useState } from 'react';
import { Port, Region } from '@/lib/types/domain';
import { Card } from '@/components/ui/card';
import { TrendIndicator } from '@/components/ui/trend-indicator';
import { LastUpdatedBadge } from '@/components/ui/last-updated-badge';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

type SortKey = 'congestionScore' | 'shipsWaiting' | 'avgDelayHours' | 'trendDeltaPct';

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'congestionScore', label: 'Score' },
  { key: 'shipsWaiting', label: 'Queue' },
  { key: 'avgDelayHours', label: 'Delay' },
  { key: 'trendDeltaPct', label: 'Trend' }
];

export function PortRankingTable({ ports, regionFilter }: { ports: Port[]; regionFilter?: Region | 'All' }) {
  const [sortKey, setSortKey] = useState<SortKey>('congestionScore');

  const data = useMemo(() => {
    const filtered = regionFilter && regionFilter !== 'All' ? ports.filter((p) => p.region === regionFilter) : ports;
    return [...filtered].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [ports, regionFilter, sortKey]);

  return (
    <Card className="p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-cyan-100">Port Congestion Ranking</h3>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setSortKey(option.key)}
              className={`rounded-full border px-2 py-1 ${sortKey === option.key ? 'border-cyan-300 bg-cyan-400/15 text-cyan-100' : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">No ports available for this region filter.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="py-2 pr-2">#</th>
                <th className="py-2">Port</th>
                <th>Score</th>
                <th>Waiting</th>
                <th>Avg Delay</th>
                <th>Trend</th>
                <th>Spark</th>
              </tr>
            </thead>
            <tbody>
              {data.map((port, index) => (
                <tr key={port.id} className="border-t border-white/10 text-slate-200">
                  <td className="py-3 pr-2 font-mono text-xs text-cyan-200">{String(index + 1).padStart(2, '0')}</td>
                  <td className="py-3">
                    <Link href={`/ports/${port.slug}`} className="font-medium text-cyan-100 hover:underline">
                      {port.name}
                    </Link>
                    <p className="text-xs text-slate-400">{port.country}</p>
                  </td>
                  <td className="font-semibold text-white">{port.congestionScore}</td>
                  <td>{port.shipsWaiting}</td>
                  <td>{port.avgDelayHours}h</td>
                  <td>
                    <TrendIndicator value={port.trendDeltaPct} />
                  </td>
                  <td className="h-10 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={port.sparkline.map((v, i) => ({ i, v }))}>
                        <Line type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3">
        <LastUpdatedBadge iso={data[0]?.updatedAt ?? new Date().toISOString()} />
      </div>
    </Card>
  );
}
