import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { allowRatingComments } from "@/config/app";
import { emptyDistribution, statsFromDistribution, type SectorStats } from "@/lib/utils/ratings";
import type { RatingSubmissionInput } from "@/lib/validations/rating";

export async function createRatings(input: RatingSubmissionInput) {
  const sectors = await prisma.sector.findMany({ where: { code: { in: input.ratings.map((r) => r.sector) }, rateable: true } });
  const idByCode = new Map(sectors.map((s) => [s.code, s.id]));
  const submissionId = randomUUID();
  const data = input.ratings.map((r) => {
    const sectorId = idByCode.get(r.sector);
    if (!sectorId) throw new Error("SECTOR_NOT_FOUND");
    return { submissionId, sectorId, score: r.score, comment: allowRatingComments() ? r.comment || null : null };
  });
  await prisma.rating.createMany({ data });
}

export interface MonthlyPoint { month: string; average: number; count: number }
export interface SectorReport extends SectorStats { code: string; name: string; monthly: MonthlyPoint[] }

export async function getSectorReports(from?: Date, to?: Date): Promise<SectorReport[]> {
  const created: Prisma.DateTimeFilter = {};
  if (from) created.gte = from;
  if (to) created.lte = to;
  const where: Prisma.RatingWhereInput = from || to ? { createdAt: created } : {};
  const f = from ?? null;
  const t = to ?? null;

  const [sectors, groups, monthlyRows] = await Promise.all([
    prisma.sector.findMany({ where: { rateable: true }, orderBy: { displayOrder: "asc" } }),
    prisma.rating.groupBy({ by: ["sectorId", "score"], where, _count: { _all: true } }),
    prisma.$queryRaw<{ sectorId: number; month: string; avg: number; n: number }[]>`
      SELECT r."sectorId", to_char(date_trunc('month', (r."createdAt" AT TIME ZONE 'UTC') AT TIME ZONE 'America/Bahia'), 'YYYY-MM') AS month,
             AVG(r."score")::float AS avg, COUNT(*)::int AS n
      FROM "Rating" r
      WHERE (${f}::timestamp IS NULL OR r."createdAt" >= ${f}::timestamp)
        AND (${t}::timestamp IS NULL OR r."createdAt" <= ${t}::timestamp)
      GROUP BY 1, 2 ORDER BY 2`,
  ]);

  return sectors.map((s) => {
    const dist = emptyDistribution();
    for (const g of groups) if (g.sectorId === s.id && g.score >= 1 && g.score <= 5) dist[g.score as 1 | 2 | 3 | 4 | 5] = g._count._all;
    const monthly = monthlyRows.filter((m) => m.sectorId === s.id).map((m) => ({ month: m.month, average: m.avg, count: m.n }));
    return { code: s.code, name: s.name, ...statsFromDistribution(dist), monthly };
  });
}
