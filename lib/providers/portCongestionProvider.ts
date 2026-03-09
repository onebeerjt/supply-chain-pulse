import { mockPorts } from '@/lib/data/mock-data';
import { CongestionSnapshot, Port } from '@/lib/types/domain';
import { modeFromKey } from '@/lib/providers/base';

export async function getCongestionSnapshot(): Promise<CongestionSnapshot> {
  const sourceMode = modeFromKey(process.env.PORT_DATA_API_KEY);
  const minuteBucket = Math.floor(Date.now() / 60000) % 12;
  const ports = mockPorts
    .map((port, idx) => {
      const wave = Math.round(Math.sin((minuteBucket + idx) / 2) * 2);
      const congestionScore = Math.min(98, Math.max(30, port.congestionScore + wave));
      const shipsWaiting = Math.max(0, port.shipsWaiting + wave);
      const avgDelayHours = Math.max(2, port.avgDelayHours + Math.round(wave / 2));
      const updatedAt = new Date(Date.now() - idx * 6 * 60_000).toISOString();

      return {
        ...port,
        congestionScore,
        shipsWaiting,
        avgDelayHours,
        sparkline: [...port.sparkline.slice(1), congestionScore],
        updatedAt
      };
    })
    .sort((a, b) => b.congestionScore - a.congestionScore);
  return { generatedAt: new Date().toISOString(), ports, sourceMode };
}

export async function getPortBySlug(slug: string): Promise<Port | undefined> {
  const snapshot = await getCongestionSnapshot();
  return snapshot.ports.find((port) => port.slug === slug);
}
