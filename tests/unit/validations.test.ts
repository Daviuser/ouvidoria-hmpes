import { describe, expect, it } from "vitest";
import { manifestationSchema } from "@/lib/validations/manifestation";
import { ratingSubmissionSchema } from "@/lib/validations/rating";
import { DESCRIPTION_MAX } from "@/config/app";

const base = { type: "COMPLAINT", sector: "RAIO_X", description: "Demora excessiva no atendimento.", anonymous: true };

describe("manifestationSchema", () => {
  it.each(["COMPLAINT", "SUGGESTION", "PRAISE"])("aceita o tipo %s", (type) => {
    expect(manifestationSchema.safeParse({ ...base, type }).success).toBe(true);
  });
  it("exige tipo, setor e descrição", () => {
    const r = manifestationSchema.safeParse({ anonymous: true });
    expect(r.success).toBe(false);
  });
  it("aceita Raio-X e SAME", () => {
    for (const sector of ["RAIO_X", "SAME"]) expect(manifestationSchema.safeParse({ ...base, sector }).success).toBe(true);
  });
  it("rejeita setor inexistente", () => {
    expect(manifestationSchema.safeParse({ ...base, sector: "XYZ" }).success).toBe(false);
  });
  it("respeita o limite de caracteres", () => {
    expect(manifestationSchema.safeParse({ ...base, description: "a".repeat(DESCRIPTION_MAX) }).success).toBe(true);
    expect(manifestationSchema.safeParse({ ...base, description: "a".repeat(DESCRIPTION_MAX + 1) }).success).toBe(false);
  });
  it("não exige contato quando anônima e trata strings vazias como ausentes", () => {
    const r = manifestationSchema.safeParse({ ...base, name: "", email: "", phone: "" });
    expect(r.success).toBe(true);
  });
  it("rejeita e-mail inválido e honeypot preenchido", () => {
    expect(manifestationSchema.safeParse({ ...base, anonymous: false, email: "x" }).success).toBe(false);
    expect(manifestationSchema.safeParse({ ...base, website: "http://spam" }).success).toBe(false);
  });
  it("remove caracteres de controle (entrada maliciosa); HTML é escapado pelo React na saída", () => {
    const r = manifestationSchema.parse({ ...base, description: "Texto\u0000 com\u0007 controle <script>x</script>" });
    expect(r.description).not.toMatch(/[\u0000\u0007]/);
  });
});

describe("ratingSubmissionSchema", () => {
  it("permite avaliação parcial", () => {
    expect(ratingSubmissionSchema.safeParse({ ratings: [{ sector: "SAME", score: 4 }] }).success).toBe(true);
  });
  it("rejeita nota fora de 1–5, setor não avaliável, repetido ou lista vazia", () => {
    expect(ratingSubmissionSchema.safeParse({ ratings: [{ sector: "SAME", score: 6 }] }).success).toBe(false);
    expect(ratingSubmissionSchema.safeParse({ ratings: [{ sector: "SAME", score: 0 }] }).success).toBe(false);
    expect(ratingSubmissionSchema.safeParse({ ratings: [{ sector: "OUTROS", score: 3 }] }).success).toBe(false);
    expect(ratingSubmissionSchema.safeParse({ ratings: [{ sector: "SAME", score: 3 }, { sector: "SAME", score: 4 }] }).success).toBe(false);
    expect(ratingSubmissionSchema.safeParse({ ratings: [] }).success).toBe(false);
  });
});
