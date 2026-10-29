import { prisma } from "@/lib/db/prisma";

export const findSectorByCode = (code: string) => prisma.sector.findUnique({ where: { code } });
export const listSectors = () => prisma.sector.findMany({ orderBy: { displayOrder: "asc" } });
