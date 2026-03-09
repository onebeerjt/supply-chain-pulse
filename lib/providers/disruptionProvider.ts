import { mockDisruptionAlerts } from '@/lib/data/mock-data';
import { SupplyChainAlert } from '@/lib/types/domain';

export async function getDisruptionAlerts(): Promise<{ sourceMode: 'sample'; alerts: SupplyChainAlert[] }> {
  const alerts = mockDisruptionAlerts.map((alert, idx) => ({
    ...alert,
    updatedAt: new Date(Date.now() - idx * 5 * 60_000).toISOString()
  }));
  return { sourceMode: 'sample', alerts };
}
