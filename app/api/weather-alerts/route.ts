import { NextResponse } from 'next/server';
import { getWeatherAlerts } from '@/lib/providers/weatherProvider';

export async function GET() {
  const data = await getWeatherAlerts();
  return NextResponse.json(data, { status: 200 });
}
