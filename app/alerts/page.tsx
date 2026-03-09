import type { Metadata } from 'next';
import { AppShell } from '@/components/dashboard/app-shell';
import { Card } from '@/components/ui/card';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { getDisruptionAlerts } from '@/lib/providers/disruptionProvider';
import { getWeatherAlerts } from '@/lib/providers/weatherProvider';

export const metadata: Metadata = {
  title: 'Disruption Alerts | Supply Chain Pulse',
  description: 'Operational and weather disruptions impacting global trade lanes right now.'
};

export default async function AlertsPage() {
  const [disruptions, weather] = await Promise.all([getDisruptionAlerts(), getWeatherAlerts()]);

  return (
    <AppShell>
      <section>
        <h1 className="text-3xl font-semibold text-cyan-100">Top Disruptions Right Now</h1>
        <p className="mt-2 text-sm text-slate-300">A combined operational and weather risk stream with supply chain impact context.</p>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {disruptions.alerts.map((alert) => (
          <Card key={alert.id} className="p-4">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-slate-100">{alert.title}</h2>
              <SeverityBadge severity={alert.severity} />
            </div>
            <p className="mt-2 text-sm text-slate-300">{alert.detail}</p>
            <p className="mt-3 text-xs text-cyan-200">Impacted lanes: {alert.impactedLanes.join(', ')}</p>
          </Card>
        ))}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        {weather.alerts.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-slate-100">{item.location}</h2>
              <SeverityBadge severity={item.severity} />
            </div>
            <p className="mt-2 text-sm text-slate-300">{item.condition}</p>
            <p className="mt-2 text-sm text-slate-300">{item.likelyImpact}</p>
            <p className="mt-3 text-xs text-cyan-200">Why this matters: {item.advisory}</p>
          </Card>
        ))}
      </section>
    </AppShell>
  );
}
