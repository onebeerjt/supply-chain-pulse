import { ReactNode } from 'react';
import { TopNav } from '@/components/dashboard/top-nav';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 grid-overlay" />
      <div className="pointer-events-none absolute -left-36 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl" />
      <TopNav />
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:gap-6 sm:px-6 lg:px-8">{children}</main>
      <footer className="relative mt-8 border-t border-white/10 py-6 text-center text-xs text-slate-400">
        Live global logistics intelligence for operators, brokers, and curious market watchers.
      </footer>
    </div>
  );
}
