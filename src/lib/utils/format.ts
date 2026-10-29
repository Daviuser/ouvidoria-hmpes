import { TIMEZONE } from "@/config/app";

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: TIMEZONE }).format(date);
}

/** Converte "AAAA-MM-DD" (data local da Bahia, UTC-3 sem horário de verão) em instante. */
export function parseBahiaDate(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const d = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}-03:00`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}
