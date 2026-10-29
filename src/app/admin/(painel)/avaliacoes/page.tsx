import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { getSectorReports } from "@/server/services/rating.service";
import { SectorCharts } from "@/components/charts/SectorCharts";
import { parseBahiaDate } from "@/lib/utils/format";
import { SCORE_LABEL } from "@/config/app";

export const dynamic = "force-dynamic";

export default async function AvaliacoesPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  await requireAdmin();
  const { from, to } = await searchParams;
  const reports = await getSectorReports(parseBahiaDate(from), parseBahiaDate(to, true));

  return (
    <>
      <h1 className="mb-4 text-xl font-bold">Avaliações dos setores</h1>
      <form method="get" className="card mb-6 flex flex-wrap items-end gap-3">
        <div><label className="label" htmlFor="from">De</label><input id="from" type="date" name="from" defaultValue={from} className="field" /></div>
        <div><label className="label" htmlFor="to">Até</label><input id="to" type="date" name="to" defaultValue={to} className="field" /></div>
        <button className="btn">Filtrar</button>
        <Link href="/admin/avaliacoes" className="btn-secondary">Limpar</Link>
      </form>

      <div className="space-y-6">
        {reports.map((r) => (
          <section key={r.code} className="card" aria-labelledby={`s-${r.code}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id={`s-${r.code}`} className="text-lg font-semibold">{r.name}</h2>
              <p className="text-sm">
                {r.average === null ? <strong>Sem avaliações</strong> : <><strong className="text-2xl text-brand-800">{r.average.toFixed(2).replace(".", ",")}</strong> / 5 · {r.count} avaliação(ões)</>}
              </p>
            </div>
            {r.count > 0 && (
              <>
                <ul className="mt-2 flex flex-wrap gap-x-4 text-xs text-slate-600">
                  {([5, 4, 3, 2, 1] as const).map((n) => <li key={n}>{n}★ ({SCORE_LABEL[n]}): {r.distribution[n]}</li>)}
                </ul>
                <div className="mt-4">
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
