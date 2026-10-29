import { z } from "zod";
import { DESCRIPTION_MAX } from "@/config/app";
import { SECTOR_CODES } from "@/config/sectors";
import { cleanText } from "@/lib/utils/text";

const optional = (schema: z.ZodString) =>
  z.preprocess((v) => (typeof v === "string" && v.trim() === "" ? undefined : v), schema.optional());

export const manifestationSchema = z.object({
  type: z.enum(["COMPLAINT", "SUGGESTION", "PRAISE"], { errorMap: () => ({ message: "Selecione o tipo de manifestação." }) }),
  sector: z.enum(SECTOR_CODES, { errorMap: () => ({ message: "Selecione o setor." }) }),
  otherSector: optional(z.string().trim().max(100, "Máximo de 100 caracteres.")),
  description: z
    .string({ required_error: "Descreva sua manifestação." })
    .transform(cleanText)
    .pipe(z.string().min(10, "Descreva com pelo menos 10 caracteres.").max(DESCRIPTION_MAX, `Máximo de ${DESCRIPTION_MAX} caracteres.`)),
  anonymous: z.boolean(),
  name: optional(z.string().trim().max(120, "Máximo de 120 caracteres.")),
  email: optional(z.string().trim().max(160).email("E-mail inválido.")),
  phone: optional(z.string().trim().regex(/^[0-9()+\-\s]{8,20}$/, "Telefone inválido.")),
  website: z.string().max(0).optional().default(""), // honeypot
});

export type ManifestationInput = z.output<typeof manifestationSchema>;
export type ManifestationFormValues = z.input<typeof manifestationSchema>;
