import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { sendNotification, setVapidDetails, type PushSubscription as WebPushSubscription } from "web-push";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

type SubscriptionData = WebPushSubscription;
const vapidConfigured = () => Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY && process.env.VAPID_SUBJECT);
function encryptionKey() {
  const value = process.env.PUSH_ENCRYPTION_KEY;
  if (!value) throw new Error("PUSH_ENCRYPTION_KEY ausente");
  const key = Buffer.from(value, "base64");
  if (key.length !== 32) throw new Error("PUSH_ENCRYPTION_KEY deve ser uma chave base64 de 32 bytes");
  return key;
}
function encrypt(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((x) => x.toString("base64url")).join(".");
}
function decrypt(value: string) {
  const [iv, tag, ciphertext] = value.split(".").map((x) => Buffer.from(x, "base64url"));
  if (!iv || !tag || !ciphertext) throw new Error("Assinatura push inválida");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}
function configure() {
  if (!vapidConfigured()) throw new Error("VAPID não configurado");
  setVapidDetails(process.env.VAPID_SUBJECT!, process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);
}
const endpointHash = (endpoint: string) => createHash("sha256").update(endpoint).digest("hex");

export function getVapidPublicKey() {
  return process.env.VAPID_PUBLIC_KEY ?? null;
}

export async function registerSubscription(adminId: string, subscription: SubscriptionData) {
  let endpoint: URL;
  try { endpoint = new URL(subscription.endpoint); } catch { throw new Error("INVALID_SUBSCRIPTION"); }
  const supportedHost = ["fcm.googleapis.com", "android.googleapis.com", "push.services.mozilla.com", "updates.push.services.mozilla.com", "web.push.apple.com"]
    .some((host) => endpoint.hostname === host || endpoint.hostname.endsWith(`.${host}`));
  if (endpoint.protocol !== "https:" || endpoint.port || !supportedHost || !subscription.keys?.p256dh || !subscription.keys.auth) throw new Error("INVALID_SUBSCRIPTION");
  const hash = endpointHash(subscription.endpoint);
  await prisma.pushSubscription.upsert({
    where: { endpointHash: hash },
    create: { adminId, endpointHash: hash, encrypted: encrypt(JSON.stringify(subscription)) },
    update: { adminId, encrypted: encrypt(JSON.stringify(subscription)) },
  });
}

export async function listSubscriptions(adminId: string) {
  const rows = await prisma.pushSubscription.findMany({ where: { adminId }, orderBy: { createdAt: "desc" }, select: { id: true, createdAt: true } });
  return rows.map((row) => ({ id: row.id, createdAt: row.createdAt.toISOString() }));
}

export async function removeSubscription(adminId: string, id: string) {
  await prisma.pushSubscription.deleteMany({ where: { id, adminId } });
}

async function sendToAdmins(payload: object) {
  configure();
  const rows = await prisma.pushSubscription.findMany();
  await Promise.all(rows.map(async (row) => {
    try {
      const subscription = JSON.parse(decrypt(row.encrypted)) as SubscriptionData;
      await sendNotification(subscription, JSON.stringify(payload), { TTL: 60 * 60 });
    } catch (error) {
      const status = typeof error === "object" && error !== null && "statusCode" in error ? Number((error as { statusCode: unknown }).statusCode) : 0;
      if (status === 404 || status === 410) await prisma.pushSubscription.delete({ where: { id: row.id } }).catch(() => undefined);
      else console.error("[push] falha de envio", status || "erro temporário");
    }
  }));
}

export async function sendManifestationPushOnce(manifestationId: string) {
  try {
    await prisma.pushDelivery.create({ data: { manifestationId } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return;
    throw error;
  }
  await sendToAdmins({ title: "Ouvidoria — Hospital Municipal de Santaluz", body: "Uma nova manifestação foi recebida. Acesse o painel administrativo para visualizar.", url: "/admin/manifestacoes" });
}

export async function sendTestPush(adminId: string) {
  configure();
  const rows = await prisma.pushSubscription.findMany({ where: { adminId } });
  let delivered = 0;
  let expired = 0;
  const failures: string[] = [];
  await Promise.all(rows.map(async (row) => {
    try {
      let subscription: SubscriptionData;
      try { subscription = JSON.parse(decrypt(row.encrypted)) as SubscriptionData; }
      catch { throw new Error("PUSH_ENCRYPTION_KEY_MISMATCH"); }
      await sendNotification(subscription,
        JSON.stringify({ title: "Ouvidoria — Hospital Municipal de Santaluz", body: "Notificação de teste recebida com sucesso.", url: "/admin/dashboard" }), { TTL: 60 * 60 });
      delivered++;
    } catch (error) {
      const status = typeof error === "object" && error !== null && "statusCode" in error ? Number((error as { statusCode: unknown }).statusCode) : 0;
      if (status === 404 || status === 410) {
        await prisma.pushSubscription.delete({ where: { id: row.id } }).catch(() => undefined);
        expired++;
      } else if (error instanceof Error && error.message === "PUSH_ENCRYPTION_KEY_MISMATCH") {
        failures.push("encryption_key");
      } else {
        failures.push(status ? `http_${status}` : "unknown");
        console.error("[push:test] falha", { statusCode: status || undefined, errorName: error instanceof Error ? error.name : "UnknownError" });
      }
    }
  }));
  return { registered: rows.length, delivered, expired, failures };
}
