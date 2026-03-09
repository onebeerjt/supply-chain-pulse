import { Card } from '@/components/ui/card';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { WeatherAlert } from '@/lib/types/domain';

const rank = { low: 1, medium: 2, high: 3, critical: 4 } as const;

export function WeatherAlertPanel({ alerts }: { alerts: WeatherAlert[] }) {
  const sorted = [...alerts].sort((a, b) => rank[b.severity] - rank[a.severity]);

  return (
    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-cyan-100">Weather Disruption Alerts</h3>
      {sorted.length === 0 ? (
        <Card className="p-4 text-sm text-slate-300">No weather disruption advisories in the selected region.</Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {sorted.map((alert) => (
            <Card key={alert.id} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-100">{alert.location}</p>
                <SeverityBadge severity={alert.severity} />
              </div>
              <p className="mt-2 text-sm text-slate-300">{alert.condition}</p>
              <p className="mt-2 text-sm text-slate-300">{alert.likelyImpact}</p>
              <p className="mt-2 text-xs text-cyan-200">Why this matters: {alert.advisory}</p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
