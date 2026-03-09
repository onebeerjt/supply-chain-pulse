import { AppShell } from '@/components/dashboard/app-shell';

export default function Loading() {
  return (
    <AppShell>
      <div className="shimmer h-32 rounded-2xl bg-white/5" />
      <div className="shimmer h-80 rounded-2xl bg-white/5" />
    </AppShell>
  );
}
