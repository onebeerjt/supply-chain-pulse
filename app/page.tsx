import { AppShell } from '@/components/dashboard/app-shell';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import { getDashboardData } from '@/lib/providers/dashboardProvider';

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <AppShell>
      <DashboardClient
        metrics={data.metrics}
        brief={data.brief}
        ports={data.congestion.ports}
        vessels={data.vessels.vessels}
        disruptions={data.disruptions.alerts}
        weather={data.weather.alerts}
        webcams={data.webcams.webcams}
        sourceModes={data.sourceModes}
      />
    </AppShell>
  );
}
