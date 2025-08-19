import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scoreFromAnswers, Answers } from '@/lib/scoring';

export async function POST(req: Request) {
  try {
    const { answers, sessionId }: { answers: Answers; sessionId?: string } = await req.json();

    // 1) 计算分数
    const { per, composite } = scoreFromAnswers(answers);

    // 2) 找/建 Session
    let sid = sessionId;
    if (!sid) {
      const user = await prisma.user.create({ data: {} });
      const session = await prisma.session.create({ data: { userId: user.id } });
      sid = session.id;
    }

    // 3) 写入 Score
    const score = await prisma.score.create({
      data: {
        sessionId: sid!,
        composite,
        climate: per.climate,
        biosphere: per.biosphere,
        biochem: per.biochem,
        freshwater: per.freshwater,
        aerosol: per.aerosol,
        novel: per.novel,
      },
    });

    return NextResponse.json({ ok: true, sessionId: sid, scoreId: score.id, per, composite });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'unknown' }, { status: 400 });
  }
}
