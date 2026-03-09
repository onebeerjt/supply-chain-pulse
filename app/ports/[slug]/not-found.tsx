import Link from 'next/link';
import { AppShell } from '@/components/dashboard/app-shell';

export default function PortNotFound() {
  return (
    <AppShell>
      <div className="rounded-2xl border border-white/10 bg-card/70 p-6">
        <h1 className="text-2xl font-semibold text-cyan-100">Port not found</h1>
        <p className="mt-2 text-sm text-slate-300">The requested port slug does not exist in the current intelligence dataset.</p>
        <Link href="/ports" className="mt-4 inline-flex text-sm text-cyan-300 hover:underline">Back to ports</Link>
      </div>
    </AppShell>
  );
}
