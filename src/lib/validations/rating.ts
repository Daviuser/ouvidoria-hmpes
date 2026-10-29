import { z } from "zod";
import { RATEABLE_CODES } from "@/config/sectors";
import { cleanText } from "@/lib/utils/text";

export const ratingSubmissionSchema = z.object({
  ratings: z
    .array(
      z.object({
        sector: z.enum(RATEABLE_CODES),
        score: z.number().int().min(1).max(5),
        comment: z.string().max(500).transform(cleanText).optional(),
      }),
    )
    .min(1, "Avalie ao menos um setor.")
    .max(RATEABLE_CODES.length)
    .refine((r) => new Set(r.map((x) => x.sector)).size === r.length, "Setor repetido."),
  website: z.string().max(0).optional().default(""),
});
export type RatingSubmissionInput = z.output<typeof ratingSubmissionSchema>;
