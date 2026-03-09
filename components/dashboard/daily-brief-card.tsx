import { Card } from '@/components/ui/card';
import { LastUpdatedBadge } from '@/components/ui/last-updated-badge';
import { DailyBrief } from '@/lib/types/domain';

export function DailyBriefCard({ brief }: { brief: DailyBrief }) {
  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute -left-10 top-0 h-20 w-40 rotate-6 bg-cyan-400/15 blur-2xl" />
      <div className="relative flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-cyan-100">Daily Brief</h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs uppercase text-slate-300">{brief.sourceMode}</span>
          <LastUpdatedBadge iso={brief.generatedAt} />
        </div>
      </div>
      <p className="mt-3 text-base leading-relaxed text-slate-100">{brief.headline}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {brief.bullets.map((bullet) => (
          <li key={bullet} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            {bullet}
          </li>
        ))}
      </ul>
    </Card>
  );
}
