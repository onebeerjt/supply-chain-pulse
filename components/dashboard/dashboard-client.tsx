'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { AlertTicker } from '@/components/dashboard/alert-ticker';
import { DailyBriefCard } from '@/components/dashboard/daily-brief-card';
import { PortRankingTable } from '@/components/dashboard/port-ranking-table';
import { PortStatusCard } from '@/components/dashboard/port-status-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { WeatherAlertPanel } from '@/components/dashboard/weather-alert-panel';
import { WebcamGrid } from '@/components/dashboard/webcam-grid';
import { Card } from '@/components/ui/card';
import { DailyBrief, Port, Region, SupplyChainAlert, Vessel, WeatherAlert, Webcam } from '@/lib/types/domain';

const VesselMap = dynamic(() => import('@/components/maps/vessel-map').then((m) => m.VesselMap), {
  ssr: false,
  loading: () => <div className="shimmer h-[520px] rounded-2xl border border-white/10 bg-card/60" />
});

export function DashboardClient({
  metrics,
  brief,
  ports,
  vessels,
  disruptions,
  weather,
  webcams,
  sourceModes
}: {
  metrics: { vesselsTracked: number; congestedPorts: number; activeAlerts: number; liveWebcams: number };
  brief: DailyBrief;
  ports: Port[];
  vessels: Vessel[];
  disruptions: SupplyChainAlert[];
  weather: WeatherAlert[];
  webcams: Webcam[];
  sourceModes: Record<string, string>;
}) {
  const [region, setRegion] = useState<Region | 'All'>('All');

  const filtered = useMemo(
    () => ({
      ports: region === 'All' ? ports : ports.filter((p) => p.region === region),
      vessels: region === 'All' ? vessels : vessels.filter((v) => v.region === region),
      weather: region === 'All' ? weather : weather.filter((w) => w.region === region),
      disruptions: region === 'All' ? disruptions : disruptions.filter((d) => d.region === region)
    }),
    [region, ports, vessels, weather, disruptions]
  );

  const sampleSources = Object.entries(sourceModes)
    .filter(([, mode]) => mode === 'sample')
    .map(([key]) => key);

  return (
    <>
      <section className="grid gap-3 md:grid-cols-4">
        <StatCard label="Vessels Tracked" value={metrics.vesselsTracked} accent="Global lane coverage" />
        <StatCard label="Congested Ports" value={metrics.congestedPorts} accent="Elevated + severe status" />
        <StatCard label="Active Alerts" value={metrics.activeAlerts} accent="Weather + operational risk" />
        <StatCard label="Live Webcams" value={metrics.liveWebcams} accent="Public source links" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Card className="relative overflow-hidden p-5">
          <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">Supply Chain Pulse Terminal</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Live global logistics intelligence.</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            Track vessel congestion, weather disruptions, and live port activity across the world&apos;s most important trade hubs.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(['All', 'Americas', 'Europe', 'Asia'] as const).map((entry) => (
              <button
                key={entry}
                onClick={() => setRegion(entry)}
                className={`rounded-full border px-3 py-1 text-xs ${region === entry ? 'border-cyan-300 bg-cyan-400/15 text-cyan-100' : 'border-white/20 bg-white/5 text-slate-300'}`}
              >
                {entry}
              </button>
            ))}
            {sampleSources.length > 0 && (
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
                Demo Mode: {sampleSources.join(', ')}
              </span>
            )}
          </div>
        </Card>

        <DailyBriefCard brief={brief} />
      </section>

      <AlertTicker alerts={filtered.disruptions} />
      <VesselMap vessels={filtered.vessels} ports={filtered.ports} />

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <PortRankingTable ports={filtered.ports} regionFilter={region} />
        <div className="space-y-4">
          {filtered.ports.length === 0 ? (
            <Card className="p-4 text-sm text-slate-300">No port metrics currently available for this filter.</Card>
          ) : (
            filtered.ports.slice(0, 4).map((port) => <PortStatusCard key={port.id} port={port} />)
          )}
        </div>
      </section>

      <WebcamGrid webcams={webcams} />
      <WeatherAlertPanel alerts={filtered.weather} />
    </>
  );
}
