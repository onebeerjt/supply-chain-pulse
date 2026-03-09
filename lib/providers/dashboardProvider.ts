import { getCongestionSnapshot } from '@/lib/providers/portCongestionProvider';
import { getDailyBrief } from '@/lib/providers/summaryProvider';
import { getDisruptionAlerts } from '@/lib/providers/disruptionProvider';
import { getVessels } from '@/lib/providers/vesselProvider';
import { getWeatherAlerts } from '@/lib/providers/weatherProvider';
import { getWebcams } from '@/lib/providers/webcamProvider';

export async function getDashboardData() {
  const [congestion, vessels, disruptions, webcams, weather, brief] = await Promise.all([
    getCongestionSnapshot(),
    getVessels(),
    getDisruptionAlerts(),
    getWebcams(),
    getWeatherAlerts(),
    getDailyBrief()
  ]);

  return {
    congestion,
    vessels,
    disruptions,
    webcams,
    weather,
    brief,
    metrics: {
      vesselsTracked: vessels.vessels.length,
      congestedPorts: congestion.ports.filter((p) => p.status !== 'normal').length,
      activeAlerts: disruptions.alerts.length + weather.alerts.filter((a) => a.severity !== 'low').length,
      liveWebcams: webcams.webcams.length
    },
    sourceModes: {
      congestion: congestion.sourceMode,
      vessels: vessels.sourceMode,
      weather: weather.sourceMode,
      webcams: webcams.sourceMode,
      brief: brief.sourceMode === 'live-llm' ? 'live' : 'sample'
    },
    feedMessages: {
      vessels: vessels.message
    }
  };
}
