'use client';

import { AppShell } from '@/components/dashboard/app-shell';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <AppShell>
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-100">
        <h1 className="text-xl font-semibold">Data feed interrupted</h1>
        <p className="mt-2 text-sm text-red-200">Supply Chain Pulse could not load this snapshot. Retry to fetch the latest provider state.</p>
        <button onClick={() => reset()} className="mt-4 rounded-full border border-red-300/50 px-4 py-1 text-sm">Retry</button>
      </div>
    </AppShell>
  );
}
