import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPortBySlug } from '@/lib/providers/portCongestionProvider';

const paramsSchema = z.object({ slug: z.string().min(1) });
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_: Request, context: { params: { slug: string } }) {
  const parsed = paramsSchema.safeParse(context.params);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  const port = await getPortBySlug(parsed.data.slug);
  if (!port) {
    return NextResponse.json({ error: 'Port not found' }, { status: 404 });
  }

  return NextResponse.json({ port }, { status: 200 });
}
