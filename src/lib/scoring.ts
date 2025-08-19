export type Answers = {
  diet: 'beef' | 'mixed' | 'vegetarian' | 'vegan';
  transportKmPerWeek: number;            // 每周出行公里
  fashionItemsPerMonth: number;          // 每月新买件数
  usesSynthetic: boolean;                 // 是否合成纤维为主
  waterUse: 'low' | 'med' | 'high';      // 用水习惯
  energyHabits: { printLess: boolean; unplug: boolean; };
  career: 'fossil' | 'tech' | 'sustain' | 'other';
};

export type BoundaryScores = {
  climate: number;
  biosphere: number;
  biochem: number;
  freshwater: number;
  aerosol: number;
  novel: number;
};

export function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

/** 一个可替换的简单启发式：把不同维度映射到 0–100 */
export function scoreFromAnswers(a: Answers): { per: BoundaryScores; composite: number } {
  // 1) 饮食对气候/生物圈/生物化学
  const dietClimate = { beef: 0.35, mixed: 0.55, vegetarian: 0.8, vegan: 0.9 }[a.diet];
  const dietBiosphere = { beef: 0.4, mixed: 0.6, vegetarian: 0.8, vegan: 0.9 }[a.diet];
  const dietBiochem = { beef: 0.45, mixed: 0.65, vegetarian: 0.8, vegan: 0.9 }[a.diet];

  // 2) 出行：>120km/周 影响最大
  const tr = clamp01(1 - a.transportKmPerWeek / 120); // 0..1

  // 3) 服饰：购买越多&越多合成纤维 -> 新污染物/生物圈更差
  const fashion = clamp01(1 - a.fashionItemsPerMonth / 8);
  const syntheticPenalty = a.usesSynthetic ? 0.15 : 0;

  // 4) 用水
  const water = { low: 0.85, med: 0.6, high: 0.35 }[a.waterUse];

  // 5) 能源使用习惯
  const energy = (a.energyHabits.printLess ? 0.1 : 0) + (a.energyHabits.unplug ? 0.1 : 0);

  // 6) 职业倾向：只影响综合分的小幅加/减
  const careerBonus = { fossil: -0.05, tech: 0.02, sustain: 0.05, other: 0 }[a.career];

  const per: BoundaryScores = {
    climate: Math.round(100 * clamp01(0.55 * dietClimate + 0.45 * tr + energy)),
    biosphere: Math.round(100 * clamp01(0.6 * dietBiosphere + 0.25 * fashion - syntheticPenalty + 0.05)),
    biochem: Math.round(100 * clamp01(0.7 * dietBiochem + 0.3 * (1 - syntheticPenalty))),
    freshwater: Math.round(100 * clamp01(0.8 * water + 0.2 * energy)),
    aerosol: Math.round(100 * clamp01(0.5 * tr + 0.5 * (1 - syntheticPenalty))),
    novel: Math.round(100 * clamp01(0.6 * (1 - syntheticPenalty) + 0.4 * fashion)),
  };

  const weights = { climate:1, biosphere:1, biochem:1, freshwater:1, aerosol:1, novel:1 };
  const sumW = Object.values(weights).reduce((s, w) => s + w, 0);
  const composite = Math.round(
    Object.entries(per).reduce((s, [k, v]) => s + v * (weights as any)[k], 0) / sumW * (1 + careerBonus)
  );

  return { per, composite };
}
