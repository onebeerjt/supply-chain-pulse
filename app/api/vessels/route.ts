import { NextResponse } from 'next/server';
import { getVessels } from '@/lib/providers/vesselProvider';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getVessels();
  return NextResponse.json(
    {
      vessels: data.vessels,
      sourceMode: data.sourceMode,
      message: data.message,
      updatedAt: data.updatedAt
    },
    { status: 200 }
  );
}
