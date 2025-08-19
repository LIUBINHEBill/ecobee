import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionId, rating, comment }: { sessionId: string; rating: number; comment?: string } = await req.json();
    const fb = await prisma.feedback.create({ data: { sessionId, rating, comment } });
    return NextResponse.json({ ok: true, id: fb.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'unknown' }, { status: 400 });
  }
}
