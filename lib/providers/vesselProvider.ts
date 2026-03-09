import { Vessel } from '@/lib/types/domain';
import { getAisVesselsSnapshot } from '@/lib/providers/aisstreamService';

export type VesselSourceMode = 'live' | 'fallback' | 'unavailable';

export async function getVessels(): Promise<{
  sourceMode: VesselSourceMode;
  message?: string;
  vessels: Vessel[];
  updatedAt: string;
}> {
  const snapshot = await getAisVesselsSnapshot();
  return {
    sourceMode: snapshot.mode,
    message: snapshot.message,
    vessels: snapshot.vessels,
    updatedAt: snapshot.updatedAt
  };
}
