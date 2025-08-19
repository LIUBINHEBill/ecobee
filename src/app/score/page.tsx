'use client';

import { useEffect, useState } from 'react';
import EcoRing from '@/components/EcoRing';
import { Card } from '@/components/ui';

type Resp = { ok: boolean; sessionId: string; composite: number; per: Record<string, number> };

export default function ScorePage() {
  const [data, setData] = useState<Resp | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('ecobee:last');
    if (raw) setData(JSON.parse(raw));
  }, []);

  if (!data) {
    return (
      <main className="container py-16">
        <h1 className="h1 mb-2">No score yet</h1>
        <p className="sub mb-6">Take a quick snapshot to get your personalised EcoScore.</p>
        <a href="/quiz" className="cta">Start 5-minute snapshot →</a>
      </main>
    );
  }

  const labels = ['CLIMATE','BIOSPHERE','BIOCHEM','FRESHWATER','AEROSOL','NOVEL','—','—','—'];
  const values = [
    data.per.climate,
    data.per.biosphere,
    data.per.biochem,
    data.per.freshwater,
    data.per.aerosol,
    data.per.novel,
  ];

  const chips: { label: string; value: number }[] = [
    { label: 'Climate', value: data.per.climate },
    { label: 'Biosphere integrity', value: data.per.biosphere },
    { label: 'Biogeochemical', value: data.per.biochem },
    { label: 'Freshwater', value: data.per.freshwater },
    { label: 'Aerosols', value: data.per.aerosol },
    { label: 'Novel entities', value: data.per.novel },
  ];

  return (
    <main className="container py-16">
      <h1 className="h1 mb-2">Your EcoScore</h1>
      <p className="sub mb-8">Higher is better — aiming to stay within the safe operating space.</p>

      <section className="score-grid">
        {/* LEFT: Summary */}
        <Card className="c4d-card space-y-6 score-left">
          <div>
            <div className="score-composite-label">Composite</div>
            <div className="score-composite">{Math.round(data.composite)}</div>
          </div>

          <div className="chips">
            {chips.map((c) => (
              <div key={c.label} className="chip">
                <div className="chip-label">{c.label}</div>
                <div className="chip-value">{Math.round(c.value)}</div>
              </div>
            ))}
          </div>

          <div className="cta-row">
            <a href="/actions" className="cta w-full">See personalised actions →</a>
            <p className="caption" style={{ marginTop: 10 }}>
              Based on your snapshot for food, mobility, water & energy, and products.
            </p>
          </div>
        </Card>

        <Card className="c4d-card c4d-card--ring ring-center">
            <EcoRing size={400} padding={32} values={values} labels={labels} />
        </Card>

      </section>
    </main>
  );
}
