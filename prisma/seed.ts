import { PrismaClient } from "@prisma/client";
import { SECTORS } from "../src/config/sectors";

const prisma = new PrismaClient();

async function main() {
  for (const [i, s] of SECTORS.entries()) {
    await prisma.sector.upsert({
      where: { code: s.code },
      update: { name: s.name, rateable: s.rateable, displayOrder: i },
      create: { code: s.code, name: s.name, rateable: s.rateable, displayOrder: i },
    });
  }
  console.log(`Setores sincronizados: ${SECTORS.length}`);
}
main().finally(() => prisma.$disconnect());
