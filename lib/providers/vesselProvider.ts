import { mockVessels } from '@/lib/data/mock-data';
import { Vessel } from '@/lib/types/domain';
import { modeFromKey } from '@/lib/providers/base';

export async function getVessels(): Promise<{ sourceMode: 'live' | 'sample'; vessels: Vessel[] }> {
  const sourceMode = modeFromKey(process.env.VESSEL_API_KEY);
  const minuteBucket = Math.floor(Date.now() / 60000) % 10;
  const vessels = mockVessels.map((vessel, idx) => {
    const drift = ((minuteBucket + idx) % 3) * 0.04;
    return {
      ...vessel,
      heading: (vessel.heading + minuteBucket * 3 + idx) % 360,
      speedKnots: Number(Math.max(0.5, vessel.speedKnots + drift).toFixed(1))
    };
  });
  return { sourceMode, vessels };
}
