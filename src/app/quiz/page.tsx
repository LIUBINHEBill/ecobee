'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Answers } from '@/lib/scoring';
import { Card, SectionTitle } from '@/components/ui';
import Bee from '@/components/Bee';

export default function QuizPage() {
  const r = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const answers: Answers = {
      diet: (fd.get('diet') as any) ?? 'mixed',
      transportKmPerWeek: Number(fd.get('km') || 0),
      fashionItemsPerMonth: Number(fd.get('fashion') || 0),
      usesSynthetic: fd.get('synthetic') === 'on',
      waterUse: (fd.get('water') as any) ?? 'med',
      energyHabits: {
        printLess: fd.get('printLess') === 'on',
        unplug: fd.get('unplug') === 'on',
      },
      career: (fd.get('career') as any) ?? 'other',
    };

    setSubmitting(true);
    const res = await fetch('/api/score', { method: 'POST', body: JSON.stringify({ answers }) });
    const data = await res.json();
    setSubmitting(false);
    if (!data?.ok) { alert(data?.error || 'Failed'); return; }
    localStorage.setItem('ecobee:last', JSON.stringify(data));
    r.push('/score');
  }

  return (
    <main className="container py-16">
      <h1 className="quiz-h1">
        Make smarter choices with <span style={{ color: '#ffd54a' }}>Eco-Bee</span>
      </h1>
      <p className="sub mb-8">A quick campus snapshot to personalise your tips. It takes about two minutes.</p>

      <form onSubmit={onSubmit} className="quiz-grid">
        {/* 左侧：表单 */}
        <div className="quiz-main">
          <Card className="c4d-card">
            <SectionTitle>Food</SectionTitle>
            <div className="field">
              <label htmlFor="diet" className="block text-sm text-neutral-400">Diet type</label>
              <select id="diet" name="diet" className="select" defaultValue="mixed">
                <option value="beef">Beef-heavy</option>
                <option value="mixed">Mixed</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
          </Card>

          <Card className="c4d-card">
            <SectionTitle>Mobility</SectionTitle>
            <div className="field">
              <label htmlFor="km" className="block text-sm text-neutral-400">
                Commute distance per week (km)
              </label>
              <input id="km" name="km" type="number" min="0" inputMode="numeric"
                     placeholder="e.g. 40" className="input" />
            </div>
          </Card>

          <Card className="c4d-card">
            <SectionTitle>Fashion & Products</SectionTitle>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="field">
                <label htmlFor="fashion" className="block text-sm text-neutral-400">New items / month</label>
                <input id="fashion" name="fashion" type="number" min="0" inputMode="numeric"
                       placeholder="e.g. 1" className="input" />
              </div>
              <div className="checkbox-stack">
                <label className="cursor-pointer">
                  <input type="checkbox" name="synthetic" className="checkbox" />
                  <span className="text-neutral-300">Mainly synthetic fibres</span>
                </label>
              </div>
            </div>
          </Card>

          <Card className="c4d-card">
            <SectionTitle>Water & Energy</SectionTitle>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="field">
                <label htmlFor="water" className="block text-sm text-neutral-400">Water use</label>
                <select id="water" name="water" className="select" defaultValue="med">
                  <option value="low">Low</option>
                  <option value="med">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="checkbox-stack">
                <label className="cursor-pointer">
                  <input type="checkbox" name="printLess" className="checkbox" />
                  <span>Reduce printing</span>
                </label>
                <label className="cursor-pointer">
                  <input type="checkbox" name="unplug" className="checkbox" />
                  <span>Unplug idle devices</span>
                </label>
              </div>
            </div>
          </Card>

          <Card className="c4d-card">
            <SectionTitle>Career pathway</SectionTitle>
            <div className="field">
              <label htmlFor="career" className="block text-sm text-neutral-400">Your field</label>
              <select id="career" name="career" className="select" defaultValue="other">
                <option value="other">Other</option>
                <option value="tech">Tech</option>
                <option value="sustain">Sustainability</option>
                <option value="fossil">Fossil-intensive</option>
              </select>
            </div>
          </Card>
        </div>

        <aside className="quiz-aside">
            <div className="c4d-card sticky top-24 space-y-6">
                {/* 进度 */}
                <div>
                    <div className="text-xs tracking-wide text-neutral-400">Step 1 of 3 · Snapshot</div>
                    <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                    <div className="h-1 w-1/3 rounded-full bg-[linear-gradient(90deg,#ffe66d,#ffd54a,#ffbf00)] shadow-[0_0_14px_rgba(255,213,74,.5)]" />
                </div>
                </div>

                <div className="grid place-items-center mt-6 mb-2" aria-hidden>
                    <div className="bee-plate">
                        {/* ❶ 移除 bee-float 类，停止动画 */}
                        <Bee size={125} />
                    </div>
                </div>

                {/* 与蜜蜂保持间距的说明文字 */}
                <p className="caption mt-2">We’ll compute your EcoScore next.</p>

                {/* 唯一 CTA */}
                <button type="submit" className="cta w-full disabled:opacity-70" disabled={submitting}>
                    {submitting ? 'Scoring…' : 'See my EcoScore →'}
                </button>
            </div>
        </aside>

      </form>
    </main>
  );
}
