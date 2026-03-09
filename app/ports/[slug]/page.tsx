import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { AppShell } from '@/components/dashboard/app-shell';
import { DailyBriefCard } from '@/components/dashboard/daily-brief-card';
import { PortDetailHeader } from '@/components/dashboard/port-detail-header';
import { WeatherAlertPanel } from '@/components/dashboard/weather-alert-panel';
import { WebcamGrid } from '@/components/dashboard/webcam-grid';
import { Card } from '@/components/ui/card';
import { getPortBySlug } from '@/lib/providers/portCongestionProvider';
import { getVessels } from '@/lib/providers/vesselProvider';
import { getWebcams } from '@/lib/providers/webcamProvider';
import { getWeatherAlerts } from '@/lib/providers/weatherProvider';
import { getDailyBrief } from '@/lib/providers/summaryProvider';

const PortMiniMap = dynamic(() => import('@/components/maps/port-mini-map').then((m) => m.PortMiniMap), {
  ssr: false,
  loading: () => <div className="shimmer h-72 rounded-2xl bg-white/5" />
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const port = await getPortBySlug(params.slug);
  if (!port) return { title: 'Port not found | Supply Chain Pulse' };
  return {
    title: `${port.name} | Supply Chain Pulse`,
    description: `Live congestion, queue depth, weather risk, and webcam intelligence for ${port.name}.`
  };
}

export default async function PortDetailPage({ params }: { params: { slug: string } }) {
  const port = await getPortBySlug(params.slug);
  if (!port) notFound();

  const [vessels, webcams, weather, brief] = await Promise.all([getVessels(), getWebcams(), getWeatherAlerts(), getDailyBrief()]);
  const localVessels = vessels.vessels.filter((v) => v.destinationPortSlug === port.slug).slice(0, 10);
  const localWebcams = webcams.webcams.filter((w) => w.portSlug === port.slug);
  const localWeather = weather.alerts.filter((alert) => alert.region === port.region).slice(0, 3);

  return (
    <AppShell>
      <PortDetailHeader port={port} />
      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="p-4">
          <h2 className="mb-3 text-lg font-semibold text-cyan-100">Local Traffic View</h2>
          <PortMiniMap port={port} vessels={localVessels} />
        </Card>
        <Card className="space-y-2 p-4 text-sm text-slate-300">
          <h2 className="text-lg font-semibold text-cyan-100">Operational Context</h2>
          <p>Berth utilization: {port.berthUtilizationPct}%</p>
          <p>Dwell time: {port.dwellTimeHours}h</p>
          <p>Queue depth: {port.shipsWaiting} vessels</p>
          <p>Trade lane exposure: {port.tradeLaneExposure}</p>
        </Card>
      </section>
      {localWebcams.length > 0 ? <WebcamGrid webcams={localWebcams} /> : <Card className="p-4 text-sm text-slate-300">No dedicated public webcam currently listed for this port.</Card>}
      <WeatherAlertPanel alerts={localWeather} />
      <DailyBriefCard brief={brief} />
    </AppShell>
  );
}
