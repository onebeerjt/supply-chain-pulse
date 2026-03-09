import { NextResponse } from 'next/server';
import { getCongestionSnapshot } from '@/lib/providers/portCongestionProvider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const snapshot = await getCongestionSnapshot();
  return NextResponse.json({ generatedAt: snapshot.generatedAt, ports: snapshot.ports }, { status: 200 });
}
