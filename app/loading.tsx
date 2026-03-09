import { AppShell } from '@/components/dashboard/app-shell';

export default function Loading() {
  return (
    <AppShell>
      <div className="shimmer h-24 rounded-2xl bg-white/5" />
      <div className="shimmer h-40 rounded-2xl bg-white/5" />
      <div className="shimmer h-[520px] rounded-2xl bg-white/5" />
    </AppShell>
  );
}
