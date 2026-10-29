import Link from "next/link";
import { Filter, Star, X } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { getSectorReports } from "@/server/services/rating.service";
import { SectorCharts } from "@/components/charts/SectorCharts";
import { PageHeader } from "@/components/ui/PageHeader";
import { parseBahiaDate } from "@/lib/utils/format";
import { SCORE_LABEL } from "@/config/app";

export const dynamic = "force-dynamic";

export default async function AvaliacoesPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  await requireAdmin();
  const { from, to } = await searchParams;
  const reports = await getSectorReports(parseBahiaDate(from), parseBahiaDate(to, true));

  return (
    <>
      <PageHeader title="Avaliações dos setores" description="Média, distribuição das notas e evolução mensal por setor." />
      <form method="get" className="card mb-6 flex animate-fade-up flex-wrap items-end gap-4" aria-label="Filtro de período">
        <div><label className="label" htmlFor="from">De</label><input id="from" type="date" name="from" defaultValue={from} className="field" /></div>
        <div><label className="label" htmlFor="to">Até</label><input id="to" type="date" name="to" defaultValue={to} className="field" /></div>
        <button className="btn"><Filter className="h-4 w-4" aria-hidden />Filtrar</button>
        <Link href="/admin/avaliacoes" className="btn-secondary"><X className="h-4 w-4" aria-hidden />Limpar</Link>
      </form>

      <div className="stagger space-y-6">
        {reports.map((r) => (
          <section key={r.code} className="card" aria-labelledby={`s-${r.code}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id={`s-${r.code}`} className="text-lg font-semibold text-navy-900">{r.name}</h2>
              {r.average === null ? (
                <span className="badge bg-slate-100 text-slate-700 ring-slate-200">Sem avaliações</span>
              ) : (
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-500" aria-hidden />
                  <strong className="text-2xl tabular-nums text-navy-900">{r.average.toFixed(2).replace(".", ",")}</strong>
                  <span>/ 5 · {r.count} avaliação(ões)</span>
                </p>
              )}
            </div>
            {r.count > 0 && (
              <>
                <ul className="mt-3 flex flex-wrap gap-2 text-xs">
                  {([5, 4, 3, 2, 1] as const).map((n) => (
                    <li key={n} className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">{n}★ {SCORE_LABEL[n]}: <strong>{r.distribution[n]}</strong></li>
                  ))}
                </ul>
                <div className="mt-5">
                  <SectorCharts sectorName={r.name}
                    distribution={([1, 2, 3, 4, 5] as const).map((n) => ({ score: `${n}★`, quantidade: r.distribution[n] }))}
                    monthly={r.monthly.map((m) => ({ month: m.month, media: Number(m.average.toFixed(2)) }))} />
                </div>
              </>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
