import { mockWeatherAlerts } from '@/lib/data/mock-data';
import { WeatherAlert } from '@/lib/types/domain';
import { modeFromKey } from '@/lib/providers/base';

export async function getWeatherAlerts(): Promise<{ sourceMode: 'live' | 'sample'; alerts: WeatherAlert[] }> {
  const sourceMode = modeFromKey(process.env.OPENWEATHER_API_KEY);
  const alerts = mockWeatherAlerts.map((alert, idx) => ({
    ...alert,
    updatedAt: new Date(Date.now() - idx * 8 * 60_000).toISOString()
  }));
  return { sourceMode, alerts };
}
