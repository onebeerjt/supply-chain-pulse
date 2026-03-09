import { AppShell } from '@/components/dashboard/app-shell';

export default function Loading() {
  return (
    <AppShell>
      <div className="shimmer h-24 rounded-2xl bg-white/5" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="shimmer h-56 rounded-2xl bg-white/5" />
        <div className="shimmer h-56 rounded-2xl bg-white/5" />
      </div>
    </AppShell>
  );
}
