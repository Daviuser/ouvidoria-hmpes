/** Fonte única dos setores. O seed sincroniza o banco com esta lista. */
export const SECTORS = [
  { code: "RECEPCAO", name: "Recepção", rateable: true },
  { code: "ENFERMAGEM", name: "Enfermagem", rateable: true },
  { code: "CORPO_MEDICO", name: "Corpo médico", rateable: true },
  { code: "SEGURANCA", name: "Segurança", rateable: true },
  { code: "RAIO_X", name: "Raio-X (Radiologia)", rateable: true },
  { code: "SAME", name: "SAME (Serviço de Arquivo Médico e Estatística)", rateable: true },
  { code: "HIGIENIZACAO", name: "Higienização", rateable: true },
  { code: "NUTRICAO", name: "Nutrição", rateable: true },
  { code: "MAQUEIRO", name: "Maqueiro", rateable: true },
  { code: "LABORATORIO", name: "Laboratório", rateable: true },
  { code: "EMERGENCIA", name: "Emergência", rateable: true },
  { code: "CLINICA_MEDICA", name: "Clínica Médica", rateable: true },
  { code: "MATERNIDADE", name: "Maternidade", rateable: true },
  { code: "CENTRO_CIRURGICO", name: "Centro Cirúrgico", rateable: true },
  { code: "OUTROS", name: "Outros setores", rateable: false },
] as const;

export type SectorCode = (typeof SECTORS)[number]["code"];
export const SECTOR_CODES = SECTORS.map((s) => s.code) as [SectorCode, ...SectorCode[]];
export const RATEABLE_SECTORS = SECTORS.filter((s) => s.rateable);
export const RATEABLE_CODES = RATEABLE_SECTORS.map((s) => s.code) as [SectorCode, ...SectorCode[]];
export const OTHER_SECTOR_CODE: SectorCode = "OUTROS";
