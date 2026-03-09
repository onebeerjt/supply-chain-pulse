import { NextResponse } from 'next/server';
import { getVessels } from '@/lib/providers/vesselProvider';

export async function GET() {
  const data = await getVessels();
  return NextResponse.json(data, { status: 200 });
}
