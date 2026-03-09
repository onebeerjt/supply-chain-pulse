import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Supply Chain Pulse | Live global logistics intelligence',
  description: 'Map-first public dashboard for vessel tracking, congestion, weather disruption risk, webcams, and daily logistics briefs.',
  openGraph: {
    title: 'Supply Chain Pulse',
    description: 'Live global logistics intelligence for operators and market watchers.',
    type: 'website',
    url: 'https://supply-chain-pulse.vercel.app'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Supply Chain Pulse',
    description: 'Track vessel congestion, weather disruptions, and live port activity.'
  },
  icons: { icon: '/icon.svg' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
