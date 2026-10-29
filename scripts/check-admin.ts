import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const admins = await prisma.adminUser.findMany({
    select: {
      email: true,
      active: true,
      name: true,
    },
  });

  console.log("Administradores encontrados:", admins.length);
  console.table(admins);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
