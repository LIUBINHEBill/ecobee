'use client';
import React from 'react';

type Props = {
  values: number[];          // 0-100，按顺序传入
  labels?: string[];         // 可选标签
  size?: number;             // px（仅指环形本体直径，不含外边距）
  padding?: number;          // 画布安全边距（避免文字被裁剪）
};

export default function EcoRing({
  values,
  labels,
  size = 320,
  padding = 28,              // ← 新增：给画布四周留白
}: Props) {
  const segs = 9;
  const pad = 10;            // 段与段之间的角度缝隙（px）
  const rOuter = size / 2 - 8;
  const rInner = rOuter - 26;

  // 画布尺寸与中心点（包含 padding）
  const w = size + padding * 2;
  const h = w;
  const cx = padding + size / 2;
  const cy = padding + size / 2;

  const full = [...values.slice(0, 6), ...Array(3).fill(0)]; // 不足9段补0
  const toColor = (v: number) => {
    const t = Math.max(0, Math.min(1, v / 100)); // 0..1
    const r = Math.round(255 * (1 - t));
    const g = Math.round(180 * t);
    return `rgb(${r},${g},60)`;
  };

  const paths: React.ReactNode[] = [];
  for (let i = 0; i < segs; i++) {
    const start = (i / segs) * Math.PI * 2 - Math.PI / 2;
    const end = ((i + 1) / segs) * Math.PI * 2 - Math.PI / 2;
    const shrink = pad / rOuter;
    const a1 = start + shrink, a2 = end - shrink;
    const mid = (a1 + a2) / 2;

    const v = full[i] ?? 0;
    const rVal = rInner + (rOuter - rInner) * (Math.max(10, v) / 100);

    const arc = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x1, y1] = arc(rVal, a1);
    const [x2, y2] = arc(rVal, a2);
    const [ix1, iy1] = arc(rInner, a1);
    const [ix2, iy2] = arc(rInner, a2);

    const large = a2 - a1 > Math.PI ? 1 : 0;
    const d = [
      `M ${ix1} ${iy1}`,
      `A ${rInner} ${rInner} 0 ${large} 1 ${ix2} ${iy2}`,
      `L ${x2} ${y2}`,
      `A ${rVal} ${rVal} 0 ${large} 0 ${x1} ${y1}`,
      'Z',
    ].join(' ');

    paths.push(
      <path
        key={i}
        d={d}
        fill={i < values.length ? toColor(v) : '#333'}
        stroke="#000"
        strokeWidth="1"
      />
    );

    // 标签：放在外圈 + 文字安全半径
    if (labels && labels[i]) {
      const labelR = rOuter + 18; // 你原先的 18，在有 padding 后不会出界
      const tx = cx + labelR * Math.cos(mid);
      const ty = cy + labelR * Math.sin(mid);
      paths.push(
        <text
          key={`t${i}`}
          x={tx}
          y={ty}
          fontSize="10"
          textAnchor="middle"
          fill="#cfcfcf"
          dominantBaseline="middle"
        >
          {labels[i]}
        </text>
      );
    }
  }

  return (
    <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="select-none"
        style={{ display: 'block' }}   // ✅ 新增：让 SVG 像图片一样是块级
    >
        <circle cx={cx} cy={cy} r={rInner - 4} fill="#0b0b0b" stroke="#222" />
        {paths}
    </svg>
  );

}
