'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui';

type Resp = { sessionId: string; per: Record<string, number>; composite: number };
type Rule = { key: keyof Resp['per']; title: string; tip: string; accent: string };

const rules: Rule[] = [
  { key: 'climate',    title: 'Food & Mobility', tip: 'Swap one beef meal with plant-based; walk/cycle for short trips.', accent:'rgba(16,185,129,.6)' },
  { key: 'biosphere',  title: 'Biodiversity',    tip: 'Join a campus swap/repair; choose natural fibres where possible.', accent:'rgba(132,204,22,.6)' },
  { key: 'biochem',    title: 'Nutrients',       tip: 'Prefer seasonal, low-input foods; reduce food waste.',             accent:'rgba(234,179,8,.6)' },
  { key: 'freshwater', title: 'Water',           tip: 'Shorter showers; cold-wash clothes; fix dripping taps.',          accent:'rgba(14,165,233,.6)' },
  { key: 'aerosol',    title: 'Air quality',     tip: 'Avoid unnecessary car rides; car-share with peers.',               accent:'rgba(249,115,22,.6)' },
  { key: 'novel',      title: 'Novel entities',  tip: 'Avoid microplastics; choose durable, repairable products.',        accent:'rgba(217,70,239,.6)' },
];

export default function ActionsPage() {
  const [d, setD] = useState<Resp | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('ecobee:last');
    if (raw) setD(JSON.parse(raw));
  }, []);

  // ✅ Hook 必须无条件调用：即使 d 还没有，也先算一个排序结果（不会渲染用到）
  const sorted = useMemo(() => {
    const per = d?.per ?? ({} as Record<string, number>);
    return [...rules].sort((a, b) => (per[a.key] ?? 0) - (per[b.key] ?? 0));
  }, [d]);

  if (!d) {
    return (
      <main className="container py-16">
        <h1 className="h1 mb-2">No score yet</h1>
        <p className="sub mb-6">Take a quick snapshot to unlock your personalised actions.</p>
        <a href="/quiz" className="cta">Start 5-minute snapshot →</a>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <h1 className="h1 mb-2">Your top actions</h1>
      <p className="sub mb-8">Start with the biggest wins for your current snapshot.</p>

      <section className="actions-grid">
        <div className="space-y-4">
          {sorted.map((r, i) => {
            const score = Math.round(d.per[r.key] ?? 0);
            const potential = Math.max(0, 100 - score);
            return (
              <article key={r.key} className="c4d-card action-card">
                <div className="action-accent" style={{ background: `linear-gradient(180deg, ${r.accent} 60%, transparent 100%)` }} />
                <div className="action-rank">{i + 1}</div>
                <div className="action-body">
                  <h3 className="action-title">{r.title}</h3>
                  <p className="action-tip">{r.tip}</p>
                  <div className="action-gain" role="progressbar" aria-valuenow={potential} aria-valuemin={0} aria-valuemax={100}>
                    <span style={{ width: `${potential}%` }} />
                  </div>
                </div>
                <div className="action-score">
                  <div className="label">Score</div>
                  <div className="value">{score}</div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="c4d-card sticky top-24 actions-aside">
          <div className="text-xs tracking-wide text-neutral-400">What to do</div>
          <ul className="aside-list">
            <li>Focus on the top three first.</li>
            <li>Pick actions doable this week.</li>
            <li>Share with a friend or group.</li>
          </ul>
          <a href="/feedback" className="cta w-full">One-question feedback →</a>
          <p className="caption">Tell us which tips you’ll actually try. It helps Eco-Bee learn.</p>
        </aside>
      </section>
    </main>
  );
}
