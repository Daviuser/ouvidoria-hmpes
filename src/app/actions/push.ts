"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth/session";
import { getVapidPublicKey, listSubscriptions, registerSubscription, removeSubscription, sendTestPush } from "@/server/services/push.service";

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(2048),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({ p256dh: z.string().min(1).max(256), auth: z.string().min(1).max(256) }),
});

export async function getPushSetupAction() {
  const admin = await requireAdmin();
  return { publicKey: getVapidPublicKey(), devices: await listSubscriptions(admin.id) };
}
export async function registerPushAction(raw: unknown) {
  const admin = await requireAdmin();
  const parsed = subscriptionSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Assinatura inválida." };
  try { await registerSubscription(admin.id, parsed.data); return { ok: true }; }
  catch (error) { console.error("[push] falha ao cadastrar dispositivo", error instanceof Error ? error.message : "erro"); return { ok: false, error: "Não foi possível cadastrar este dispositivo. Verifique a configuração do servidor." }; }
}
export async function removePushAction(id: string) {
  const admin = await requireAdmin();
  if (typeof id !== "string" || id.length > 64) return { ok: false };
  await removeSubscription(admin.id, id);
  return { ok: true };
}
export async function testPushAction() {
  const admin = await requireAdmin();
  try {
    const count = await sendTestPush(admin.id);
    return count ? { ok: true, message: "Notificação de teste enviada." } : { ok: false, message: "Cadastre um dispositivo primeiro." };
  } catch {
    return { ok: false, message: "Falha ao enviar. Confira VAPID e a conexão deste dispositivo." };
  }
}
