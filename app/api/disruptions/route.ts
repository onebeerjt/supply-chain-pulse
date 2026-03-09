import { NextResponse } from 'next/server';
import { getDisruptionAlerts } from '@/lib/providers/disruptionProvider';

export async function GET() {
  const data = await getDisruptionAlerts();
  return NextResponse.json(data, { status: 200 });
}
