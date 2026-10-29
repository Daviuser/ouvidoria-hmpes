import { prisma } from "@/lib/db/prisma";

export async function getDashboardCounts() {
  const [byType, byStatus, ratings] = await Promise.all([
    prisma.manifestation.groupBy({ by: ["type"], _count: { _all: true } }),
    prisma.manifestation.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.rating.count(),
  ]);
  const t = (k: string) => byType.find((x) => x.type === k)?._count._all ?? 0;
  const s = (k: string) => byStatus.find((x) => x.status === k)?._count._all ?? 0;
  return {
    total: byType.reduce((a, x) => a + x._count._all, 0),
    complaints: t("COMPLAINT"), suggestions: t("SUGGESTION"), praises: t("PRAISE"), ratings,
    received: s("RECEIVED"), inReview: s("IN_REVIEW"), inProgress: s("IN_PROGRESS"), completed: s("COMPLETED"),
  };
}
