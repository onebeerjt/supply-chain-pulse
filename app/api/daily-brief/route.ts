import { NextResponse } from 'next/server';
import { getDailyBrief } from '@/lib/providers/summaryProvider';

export async function GET() {
  const data = await getDailyBrief();
  return NextResponse.json(data, { status: 200 });
}
