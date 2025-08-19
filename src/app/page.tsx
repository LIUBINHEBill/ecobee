import Link from 'next/link';
import Bee from '@/components/Bee';

export default function Home() {
  return (
    <main className="hero">
      {/* 顶部品牌（极简，不放第二个按钮） */}
      <header className="brand container" role="banner">
        <div className="brand-badge">
          <span className="badge-dot" />
          <span>Eco-Bee</span>
        </div>
        <nav className="caption" aria-label="Tagline">AI-powered sustainability coach</nav>
      </header>

      {/* 主体：左文案 + 右视觉 */}
      <section className="container hero-grid" aria-labelledby="headline">
        <div>
          <h1 id="headline" className="h1">
            Make smarter everyday choices<br/>with <span style={{ color: '#ffd54a' }}>Eco-Bee</span>
          </h1>
          <p className="sub">
            Cute on the outside, smart on the inside. Your AI coach for quick,
            personalised tips across food, mobility and campus usage.
          </p>

          {/* 唯一 CTA → /quiz */}
          <Link href="/quiz" className="cta" aria-label="Start the 5-minute survey">
            Start 5-minute snapshot →
          </Link>

          <p className="caption" style={{ marginTop: 12 }}>
            It takes about five minutes. No guilt. Just smarter swaps.
          </p>
        </div>

        {/* 右侧 C4D 玻璃卡 + Bee */}
        <div className="c4d-card bee-wrap" aria-hidden>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <Bee size={450} />
          </div>
        </div>
      </section>
    </main>
  );
}
