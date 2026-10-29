import { Prisma, type ManifestationStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { PAGE_SIZE } from "@/config/app";
import { generateProtocol } from "@/lib/utils/protocol";
import { parseBahiaDate } from "@/lib/utils/format";
import type { ManifestationInput } from "@/lib/validations/manifestation";
import type { ManifestationFilters } from "@/lib/validations/admin";
import { findSectorByCode } from "../repositories/sector.repository";

export async function createManifestation(input: ManifestationInput): Promise<string> {
  const sector = await findSectorByCode(input.sector);
  if (!sector) throw new Error("SECTOR_NOT_FOUND");
  const anonymous = input.anonymous;
  for (let attempt = 0; attempt < 5; attempt++) {
    const protocol = generateProtocol();
    try {
      await prisma.manifestation.create({
        data: {
          protocol, type: input.type, sectorId: sector.id,
          otherSector: input.sector === "OUTROS" ? input.otherSector ?? null : null,
          description: input.description, anonymous,
          name: anonymous ? null : input.name ?? null,
          email: anonymous ? null : input.email ?? null,
          phone: anonymous ? null : input.phone ?? null,
          history: { create: { toStatus: "RECEIVED", note: "Manifestação registrada." } },
        },
      });
      return protocol;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") continue; // colisão de protocolo
      throw e;
    }
  }
  throw new Error("PROTOCOL_COLLISION");
}

export function buildWhere(f: ManifestationFilters): Prisma.ManifestationWhereInput {
  const created: Prisma.DateTimeFilter = {};
  const from = parseBahiaDate(f.from);
  const to = parseBahiaDate(f.to, true);
  if (from) created.gte = from;
  if (to) created.lte = to;
  return {
    ...(f.q ? { protocol: { contains: f.q.toUpperCase() } } : {}),
    ...(f.type ? { type: f.type } : {}),
    ...(f.status ? { status: f.status } : {}),
    ...(f.sector ? { sector: { code: f.sector } } : {}),
    ...(from || to ? { createdAt: created } : {}),
  };
}

export async function listManifestations(f: ManifestationFilters) {
  const where = buildWhere(f);
  const page = f.page ?? 1;
  const [total, items] = await Promise.all([
    prisma.manifestation.count({ where }),
    prisma.manifestation.findMany({
      where, orderBy: { createdAt: f.order ?? "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE,
      include: { sector: true },
    }),
  ]);
  return { total, items, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export const getManifestationDetail = (id: string) =>
  prisma.manifestation.findUnique({
    where: { id },
    include: {
      sector: true,
      history: { orderBy: { createdAt: "desc" }, include: { admin: { select: { name: true } } } },
      notes: { orderBy: { createdAt: "desc" }, include: { admin: { select: { name: true } } } },
    },
  });

export async function changeStatus(adminId: string, id: string, status: ManifestationStatus, note?: string) {
  await prisma.$transaction(async (tx) => {
    const current = await tx.manifestation.findUnique({ where: { id }, select: { status: true } });
    if (!current) throw new Error("NOT_FOUND");
    if (current.status === status) throw new Error("SAME_STATUS");
    await tx.manifestation.update({ where: { id }, data: { status } });
    await tx.manifestationHistory.create({ data: { manifestationId: id, adminId, fromStatus: current.status, toStatus: status, note: note || null } });
    await tx.auditLog.create({ data: { adminId, action: "STATUS_CHANGE", target: id } });
  });
}

export async function addInternalNote(adminId: string, manifestationId: string, content: string) {
  await prisma.$transaction([
    prisma.internalNote.create({ data: { manifestationId, adminId, content } }),
    prisma.auditLog.create({ data: { adminId, action: "INTERNAL_NOTE", target: manifestationId } }),
  ]);
}
