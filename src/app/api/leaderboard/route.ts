import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

type ZItem = { member: string; score: number | string };

export async function GET() {
  const res = await kv.zrange('lb:global', 0, 19, {
    byScore: true,
    rev: true,
    withScores: true,
  });
  const rows = (res as ZItem[]).map((r, i) => ({
    rank: i + 1,
    id: r.member,
    score: typeof r.score === 'string' ? Number(r.score) : r.score,
  }));
  return NextResponse.json({ items: rows });
}
