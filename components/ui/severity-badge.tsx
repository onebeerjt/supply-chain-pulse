import { Severity } from '@/lib/types/domain';
import { cn } from '@/lib/utils/cn';

const styles: Record<Severity, string> = {
  low: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
  medium: 'bg-amber-500/15 text-amber-300 border-amber-400/40',
  high: 'bg-orange-500/15 text-orange-300 border-orange-400/40',
  critical: 'bg-red-500/15 text-red-300 border-red-400/40 animate-pulseSoft'
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  return <span className={cn('inline-flex rounded-full border px-2 py-1 text-xs font-medium uppercase tracking-wide', styles[severity], className)}>{severity}</span>;
}
