import { describe, expect, it } from "vitest";
import { generateProtocol } from "@/lib/utils/protocol";
import { emptyDistribution, statsFromDistribution } from "@/lib/utils/ratings";
import { parseBahiaDate } from "@/lib/utils/format";
import { RATEABLE_SECTORS, SECTORS } from "@/config/sectors";

describe("protocolo", () => {
  it("tem formato esperado e é único em 10 mil gerações", () => {
    const set = new Set(Array.from({ length: 10000 }, () => generateProtocol()));
    expect(set.size).toBe(10000);
    for (const p of set) expect(p).toMatch(/^OUV-\d{4}-[2-9A-HJ-NP-Z]{8}$/);
  });
});

describe("estatísticas de avaliações", () => {
  it("retorna média nula sem avaliações (nunca 0)", () => {
    const s = statsFromDistribution(emptyDistribution());
    expect(s.count).toBe(0);
    expect(s.average).toBeNull();
  });
  it("calcula média exata e preserva distribuição", () => {
    const s = statsFromDistribution({ 1: 1, 2: 0, 3: 1, 4: 0, 5: 2 });
    expect(s.count).toBe(4);
    expect(s.average).toBe(3.5);
    expect(s.distribution[5]).toBe(2);
  });
  it("não arredonda a média internamente", () => {
    expect(statsFromDistribution({ 1: 0, 2: 0, 3: 0, 4: 2, 5: 1 }).average).toBeCloseTo(13 / 3, 10);
  });
});

describe("setores", () => {
  it("contém os seis setores avaliáveis, incluindo Raio-X e SAME", () => {
    expect(RATEABLE_SECTORS.map((s) => s.code)).toEqual(["RECEPCAO", "ENFERMAGEM", "CORPO_MEDICO", "SEGURANCA", "RAIO_X", "SAME"]);
    expect(SECTORS.at(-1)?.code).toBe("OUTROS");
  });
  it("códigos são únicos", () => {
    expect(new Set(SECTORS.map((s) => s.code)).size).toBe(SECTORS.length);
  });
});

describe("datas", () => {
  it("interpreta datas no fuso da Bahia (UTC-3)", () => {
    expect(parseBahiaDate("2026-10-01")?.toISOString()).toBe("2026-10-01T03:00:00.000Z");
    expect(parseBahiaDate("2026-10-01", true)?.toISOString()).toBe("2026-10-02T02:59:59.999Z");
    expect(parseBahiaDate("lixo")).toBeUndefined();
  });
});
