import { AppShell } from '@/components/dashboard/app-shell';

export default function Loading() {
  return (
    <AppShell>
      <div className="shimmer h-24 rounded-2xl bg-white/5" />
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="shimmer h-40 rounded-2xl bg-white/5" />
        ))}
      </div>
    </AppShell>
  );
}
