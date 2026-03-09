import { NextResponse } from 'next/server';
import { getWebcams } from '@/lib/providers/webcamProvider';

export async function GET() {
  const data = await getWebcams();
  return NextResponse.json(data, { status: 200 });
}
