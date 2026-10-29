export type Distribution = Record<1 | 2 | 3 | 4 | 5, number>;
export interface SectorStats { count: number; average: number | null; distribution: Distribution }

export const emptyDistribution = (): Distribution => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

/** Média exata (sem arredondar); `null` quando não há avaliações. */
export function statsFromDistribution(distribution: Distribution): SectorStats {
  let count = 0;
  let sum = 0;
  for (const s of [1, 2, 3, 4, 5] as const) { count += distribution[s]; sum += s * distribution[s]; }
  return { count, average: count === 0 ? null : sum / count, distribution };
}
