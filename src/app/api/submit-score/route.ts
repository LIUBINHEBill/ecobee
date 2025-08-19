import { NextResponse } from 'next/server';
import { kv } from '@/lib/kv';

type Body = { sessionId?: string; composite?: number };

export async function POST(req: Request) {
  let body: Body = {};
  try { body = await req.json(); } catch {}

  const sessionId =
    body.sessionId || `dev_${Math.random().toString(36).slice(2, 8)}`;
  const composite =
    typeof body.composite === 'number'
      ? Math.max(0, Math.min(100, Math.round(body.composite)))
      : Math.floor(Math.random() * 101);

  await kv.zadd('lb:global', { score: composite, member: sessionId });
  return NextResponse.json({ ok: true, sessionId, composite });
}
