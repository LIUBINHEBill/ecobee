'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';
import Bee from '@/components/Bee';

export default function FeedbackPage() {
  const [sid, setSid] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(4); // 1..5

  // 取最近一次会话 ID
  useEffect(() => {
    const raw = localStorage.getItem('ecobee:last');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setSid(parsed?.sessionId ?? null);
    } catch {
      // ignore
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!sid) {
      alert('No session');
      return;
    }
    const fd = new FormData(e.currentTarget);
    const ratingVal = Number(fd.get('rating') || rating);
    const comment = String(fd.get('comment') || '');

    setSubmitting(true);
    const res = await fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ sessionId: sid, rating: ratingVal, comment }),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!data?.ok) {
      alert('Failed');
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="w-full min-h-[100svh] grid place-items-center px-4">
        {/* min-h-[100svh] + place-items-center = 垂直/水平都在屏幕中心 */}
        <section className="c4d-card success-card">
          <div className="success-stack">
            <div className="bee-plate bee-plate--xl" aria-hidden>
              <Bee size={370} />
            </div>

            <h1 className="success-title">Thanks! 🎉</h1>

            <p className="success-sub">
              Your feedback helps Eco-Bee learn and recommend smarter actions.
            </p>

            <a href="/actions" className="cta">Back to actions →</a>
          </div>
        </section>
      </main>
    );
  }



  /** ---------- 无会话兜底 ---------- */
  if (!sid) {
    return (
      <main className="container py-16">
        <h1 className="h1 mb-2">No recent session</h1>
        <p className="sub mb-6">Take a quick snapshot first, then leave a one-question feedback.</p>
        <a href="/quiz" className="cta">Start 5-minute snapshot →</a>
      </main>
    );
  }

  /** ---------- 主页面 ---------- */
  return (
    <main className="container py-16">
      <h1 className="h1 mb-2">One-question feedback</h1>
      <p className="sub mb-8">Help Eco-Bee learn what works best for students.</p>

      <section className="feedback-grid">
        {/* LEFT: 表单 */}
        <Card className="feedback-card">
          <form onSubmit={onSubmit} className="form-stack">
            {/* 滑杆 */}
            <div className="field">
              <label htmlFor="rating" className="block text-sm text-neutral-300 font-semibold">
                How helpful was Eco-Bee today?
              </label>

              <input
                id="rating"
                name="rating"
                type="range"
                min={1}
                max={5}
                step={1}
                value={rating}
                onInput={(e) => setRating(Number((e.target as HTMLInputElement).value))}
                className="slider w-full"
                aria-valuemin={1}
                aria-valuemax={5}
                aria-valuenow={rating}
                aria-label="Helpfulness rating"
              />

              <div className="slider-scale">
                <span>Not helpful</span>
                <span>Very helpful</span>
              </div>
            </div>

            {/* 评论 */}
            <div className="field">
              <label htmlFor="comment" className="block text-sm text-neutral-300 font-semibold">
                Any quick thoughts? <span className="text-neutral-500">(optional)</span>
              </label>
              <textarea
                id="comment"
                name="comment"
                className="input w-full textarea"
                placeholder="What did you like? What should we improve?"
              />
            </div>

            {/* 唯一 CTA */}
            <div className="cta-row-right">
              <button type="submit" className="cta disabled:opacity-70" disabled={submitting} aria-busy={submitting}>
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </form>
        </Card>

        {/* RIGHT: 说明 */}
        <aside className="c4d-card sticky top-24 feedback-aside">
          <div className="grid place-items-center" aria-hidden>
            <div className="bee-plate" style={{ marginBottom: 8 }}>
              <Bee size={120} />
            </div>
          </div>
          <div className="text-xs tracking-wide text-neutral-400">Why this matters</div>
          <ul className="aside-list">
            <li>We prioritise tips that students actually try.</li>
            <li>Your rating tunes our action ranking.</li>
            <li>No email needed. One question only.</li>
          </ul>
          <p className="caption">Thanks for helping make campus more sustainable 💛</p>
        </aside>
      </section>
    </main>
  );
}
