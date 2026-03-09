import { NextResponse } from 'next/server';
import { getCongestionSnapshot } from '@/lib/providers/portCongestionProvider';

export async function GET() {
  const snapshot = await getCongestionSnapshot();
  return NextResponse.json(snapshot, { status: 200 });
}
