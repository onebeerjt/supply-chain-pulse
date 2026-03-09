import { Card } from '@/components/ui/card';
import { SeverityBadge } from '@/components/ui/severity-badge';
import { SupplyChainAlert } from '@/lib/types/domain';

export function AlertTicker({ alerts }: { alerts: SupplyChainAlert[] }) {
  const ticker = alerts.length > 0 ? [...alerts, ...alerts] : [];

  return (
    <Card className="relative overflow-hidden px-3 py-2">
      <div className="absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#0a1427] to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#0a1427] to-transparent" />
      {ticker.length === 0 ? (
        <div className="px-2 py-2 text-sm text-slate-300">No active disruption headlines in this region.</div>
      ) : (
        <div className="animate-[marquee_40s_linear_infinite] whitespace-nowrap" style={{ width: 'max-content' }}>
          {ticker.map((alert, idx) => (
            <div key={`${alert.id}-${idx}`} className="mr-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
              <SeverityBadge severity={alert.severity} />
              <span className="text-slate-200">{alert.title}</span>
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </Card>
  );
}
