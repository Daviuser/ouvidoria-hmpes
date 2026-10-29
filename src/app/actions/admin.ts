"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loginSchema, statusChangeSchema, internalNoteSchema } from "@/lib/validations/admin";
import { clientKey, hashValue } from "@/lib/security/client-ip";
import { rateLimit } from "@/lib/security/rate-limit";
import { createSession, destroySession, requireAdmin } from "@/lib/auth/session";
import { verifyCredentials } from "@/server/services/auth.service";
import { addInternalNote, changeStatus } from "@/server/services/manifestation.service";

export interface FormState { error?: string; success?: string }

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  const invalid = { error: "E-mail ou senha inválidos." };
  if (!parsed.success) return invalid;
  let adminId: string | null;
  try {
    const ip = await clientKey();
    const okIp = await rateLimit(`login-ip:${ip}`, 10, 900);
    const okEmail = await rateLimit(`login-email:${hashValue(parsed.data.email)}`, 5, 900);
    if (!okIp || !okEmail) return { error: "Muitas tentativas. Aguarde alguns minutos." };
    adminId = await verifyCredentials(parsed.data.email, parsed.data.password);
  } catch (e) {
    console.error("[login] erro", e instanceof Error ? e.name : "erro");
    return { error: "Não foi possível entrar agora. Tente novamente." };
  }
  if (!adminId) return invalid;
  await createSession(adminId);
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function updateStatusAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = statusChangeSchema.safeParse({
    manifestationId: formData.get("manifestationId"), status: formData.get("status"), note: formData.get("note") ?? undefined,
  });
  if (!parsed.success) return { error: "Dados inválidos." };
  try {
    await changeStatus(admin.id, parsed.data.manifestationId, parsed.data.status, parsed.data.note);
  } catch (e) {
    if (e instanceof Error && e.message === "SAME_STATUS") return { error: "A manifestação já está nesta situação." };
    return { error: "Não foi possível atualizar a situação." };
  }
  revalidatePath(`/admin/manifestacoes/${parsed.data.manifestationId}`);
  return { success: "Situação atualizada." };
}

export async function addNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = internalNoteSchema.safeParse({ manifestationId: formData.get("manifestationId"), content: formData.get("content") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  try {
    await addInternalNote(admin.id, parsed.data.manifestationId, parsed.data.content);
  } catch {
    return { error: "Não foi possível salvar a observação." };
  }
  revalidatePath(`/admin/manifestacoes/${parsed.data.manifestationId}`);
  return { success: "Observação registrada." };
}
