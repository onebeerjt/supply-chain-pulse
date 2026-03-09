import { AppShell } from '@/components/dashboard/app-shell';

export default function Loading() {
  return (
    <AppShell>
      <div className="shimmer h-24 rounded-2xl bg-white/5" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="shimmer h-56 rounded-2xl bg-white/5" />
        ))}
      </div>
    </AppShell>
  );
}
