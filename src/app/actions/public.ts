"use server";

import { z } from "zod";
import { manifestationSchema } from "@/lib/validations/manifestation";
import { ratingSubmissionSchema } from "@/lib/validations/rating";
import { allowAnonymous, CONFIRMATION_MESSAGE } from "@/config/app";
import { clientKey } from "@/lib/security/client-ip";
import { rateLimit } from "@/lib/security/rate-limit";
import { createManifestation } from "@/server/services/manifestation.service";
import { createRatings } from "@/server/services/rating.service";

export type PublicResult<T extends object = object> =
  | ({ ok: true } & T)
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

const GENERIC_ERROR = "Não foi possível concluir o envio agora. Seus dados foram mantidos; tente novamente em instantes.";
const TOO_MANY = "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) out[String(issue.path[0] ?? "form")] ??= issue.message;
  return out;
}

export async function submitManifestation(raw: unknown): Promise<PublicResult<{ protocol: string; message: string }>> {
  const parsed = manifestationSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "Verifique os campos destacados.", fieldErrors: fieldErrors(parsed.error) };
  const input = parsed.data;
  if (input.website) return { ok: false, error: GENERIC_ERROR }; // honeypot preenchido
  if (input.anonymous && !allowAnonymous()) return { ok: false, error: "Manifestações anônimas não estão habilitadas. Informe seus dados de contato." };
  try {
    const key = await clientKey();
    if (!(await rateLimit(`manif:${key}`, 5, 600))) return { ok: false, error: TOO_MANY };
    const protocol = await createManifestation(input);
    return { ok: true, protocol, message: CONFIRMATION_MESSAGE[input.type] };
  } catch (e) {
    console.error("[manifestacao] falha ao gravar", e instanceof Error ? e.name : "erro");
    return { ok: false, error: GENERIC_ERROR };
  }
}

export async function submitRatings(raw: unknown): Promise<PublicResult> {
  const parsed = ratingSubmissionSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Avaliação inválida." };
  if (parsed.data.website) return { ok: false, error: GENERIC_ERROR };
  try {
    const key = await clientKey();
    if (!(await rateLimit(`rating:${key}`, 5, 600))) return { ok: false, error: TOO_MANY };
    await createRatings(parsed.data);
    return { ok: true };
  } catch (e) {
    console.error("[avaliacao] falha ao gravar", e instanceof Error ? e.name : "erro");
    return { ok: false, error: GENERIC_ERROR };
  }
}
