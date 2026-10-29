import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db/prisma";

// Hash de senha aleatória descartada: iguala o tempo de resposta quando o e-mail não existe.
const DUMMY_HASH = bcrypt.hashSync(randomBytes(16).toString("hex"), 12);

export async function verifyCredentials(email: string, password: string): Promise<string | null> {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  const ok = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !admin.active || !ok) return null;
  await prisma.auditLog.create({ data: { adminId: admin.id, action: "LOGIN" } });
  return admin.id;
}
