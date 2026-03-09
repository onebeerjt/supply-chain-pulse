import { Card } from '@/components/ui/card';

export function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <Card className="relative overflow-hidden p-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />
      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      <span className="mt-1 inline-flex rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">{accent}</span>
    </Card>
  );
}
