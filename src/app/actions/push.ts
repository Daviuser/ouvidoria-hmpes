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
    const result = await sendTestPush(admin.id);
    if (!result.registered) return { ok: false, message: "Cadastre um dispositivo primeiro." };
    if (result.delivered) return { ok: true, message: result.failures.length ? `Teste entregue a ${result.delivered} dispositivo(s); houve falha em outros.` : `Notificação de teste enviada a ${result.delivered} dispositivo(s).` };
    if (result.expired) return { ok: false, message: "A inscrição deste dispositivo expirou e foi removida. Ative as notificações novamente no celular." };
    if (result.failures.includes("encryption_key")) return { ok: false, message: "A PUSH_ENCRYPTION_KEY da Vercel não corresponde à usada ao cadastrar este dispositivo. Corrija a variável e cadastre o aparelho novamente." };
    if (result.failures.some((failure) => failure === "http_401" || failure === "http_403")) return { ok: false, message: "O provedor rejeitou a autenticação VAPID. Confira se a chave pública e a privada na Vercel pertencem ao mesmo par usado ao ativar o aparelho." };
    if (result.failures.some((failure) => failure === "http_429" || failure.startsWith("http_5"))) return { ok: false, message: "O serviço push está temporariamente indisponível. Tente novamente em alguns minutos." };
    return { ok: false, message: "O serviço push recusou o envio. Confira as configurações VAPID da Vercel e tente cadastrar o celular novamente." };
  } catch (error) {
    console.error("[push:test] configuração indisponível", error instanceof Error ? error.message : "erro desconhecido");
    return { ok: false, message: "Configuração push incompleta no servidor. Confira VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT e PUSH_ENCRYPTION_KEY na Vercel." };
  }
}
