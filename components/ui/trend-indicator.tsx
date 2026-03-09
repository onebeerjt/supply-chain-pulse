import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function TrendIndicator({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold', up ? 'bg-red-500/10 text-red-300' : 'bg-emerald-500/10 text-emerald-300')}>
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {up ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  );
}
