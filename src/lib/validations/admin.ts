import { z } from "zod";
import { cleanText } from "@/lib/utils/text";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(1).max(200),
});

export const statusChangeSchema = z.object({
  manifestationId: z.string().min(1).max(40),
  status: z.enum(["RECEIVED", "IN_REVIEW", "IN_PROGRESS", "COMPLETED"]),
  note: z.string().max(1000).transform(cleanText).optional(),
});

export const internalNoteSchema = z.object({
  manifestationId: z.string().min(1).max(40),
  content: z.string().transform(cleanText).pipe(z.string().min(1, "Escreva a observação.").max(2000)),
});

const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().catch(undefined);
export const manifestationFilterSchema = z.object({
  q: z.string().trim().max(40).optional().catch(undefined),
  type: z.enum(["COMPLAINT", "SUGGESTION", "PRAISE"]).optional().catch(undefined),
  sector: z.string().max(30).optional().catch(undefined),
  status: z.enum(["RECEIVED", "IN_REVIEW", "IN_PROGRESS", "COMPLETED"]).optional().catch(undefined),
  from: dateStr,
  to: dateStr,
  order: z.enum(["asc", "desc"]).optional().catch("desc"),
  page: z.coerce.number().int().min(1).max(100000).optional().catch(1),
});
export type ManifestationFilters = z.infer<typeof manifestationFilterSchema>;
