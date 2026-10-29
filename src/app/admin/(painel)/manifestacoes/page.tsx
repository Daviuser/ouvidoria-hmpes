import Link from "next/link";
import { ChevronLeft, ChevronRight, Filter, Inbox, X } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { manifestationFilterSchema } from "@/lib/validations/admin";
import { listManifestations } from "@/server/services/manifestation.service";
import { SECTORS } from "@/config/sectors";
import { STATUS_LABEL, TYPE_LABEL } from "@/config/app";
import { formatDateTime } from "@/lib/utils/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge, TypeBadge } from "@/components/ui/Badges";

export const dynamic = "force-dynamic";
type Search = Record<string, string | string[] | undefined>;

export default async function ManifestacoesPage({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  const sp = await searchParams;
  const flat = Object.fromEntries(Object.entries(sp).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]));
  const filters = manifestationFilterSchema.parse(flat);
  const { items, total, page, pages } = await listManifestations(filters);

  const link = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) if (v !== undefined && v !== "" && k !== "page") qs.set(k, String(v));
    qs.set("page", String(p));
    return `/admin/manifestacoes?${qs.toString()}`;
  };
  const citizen = (m: (typeof items)[number]) => (m.anonymous ? "Anônimo" : m.name || m.email || m.phone || "Não informado");
  const summary = (d: string) => (d.length > 90 ? `${d.slice(0, 90)}…` : d);

  return (
    <>
      <PageHeader title="Manifestações" description={`${total} registro(s) encontrado(s).`} />

      <form method="get" className="card mb-6 grid animate-fade-up gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Filtros">
        <div><label className="label" htmlFor="q">Protocolo</label><input id="q" name="q" defaultValue={filters.q} className="field" placeholder="OUV-2026-…" /></div>
        <div><label className="label" htmlFor="type">Tipo</label>
          <select id="type" name="type" defaultValue={filters.type ?? ""} className="field"><option value="">Todos</option>
            {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label className="label" htmlFor="sector">Setor</label>
          <select id="sector" name="sector" defaultValue={filters.sector ?? ""} className="field"><option value="">Todos</option>
            {SECTORS.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}</select></div>
        <div><label className="label" htmlFor="status">Situação</label>
          <select id="status" name="status" defaultValue={filters.status ?? ""} className="field"><option value="">Todas</option>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
        <div><label className="label" htmlFor="from">De</label><input id="from" type="date" name="from" defaultValue={filters.from} className="field" /></div>
        <div><label className="label" htmlFor="to">Até</label><input id="to" type="date" name="to" defaultValue={filters.to} className="field" /></div>
        <div><label className="label" htmlFor="order">Ordenação por data</label>
          <select id="order" name="order" defaultValue={filters.order ?? "desc"} className="field">
            <option value="desc">Mais recentes primeiro</option><option value="asc">Mais antigas primeiro</option></select></div>
        <div className="flex items-end gap-2">
          <button className="btn flex-1"><Filter className="h-4 w-4" aria-hidden />Filtrar</button>
          <Link href="/admin/manifestacoes" className="btn-secondary" aria-label="Limpar filtros"><X className="h-4 w-4" aria-hidden /><span className="sr-only sm:not-sr-only">Limpar</span></Link>
        </div>
      </form>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 border-dashed py-12 text-center text-sm text-slate-600">
          <Inbox className="h-8 w-8 text-slate-400" aria-hidden />Nenhuma manifestação encontrada.
        </div>
      ) : (
        <>
          {/* Tablet/desktop: tabela */}
          <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft md:block">
            <table className="w-full table-fixed text-left text-sm">
              <caption className="sr-only">Lista de manifestações</caption>
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th scope="col" className="w-36 px-4 py-3">Protocolo</th>
                  <th scope="col" className="w-28 px-4 py-3">Recebida em</th>
                  <th scope="col" className="w-32 px-4 py-3">Tipo</th>
                  <th scope="col" className="px-4 py-3">Setor / Resumo</th>
                  <th scope="col" className="w-36 px-4 py-3">Situação</th>
                  <th scope="col" className="w-20 px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((m) => (
                  <tr key={m.id} className="align-top transition hover:bg-brand-50/40">
                    <td className="break-all px-4 py-3 font-mono text-xs">{m.protocol}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{formatDateTime(m.createdAt)}</td>
                    <td className="px-4 py-3"><TypeBadge type={m.type} /></td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-navy-900">{m.sector.name}</p>
                      <p className="mt-0.5 break-words text-slate-600">{summary(m.description)}</p>
                      <p className="mt-1 text-xs text-slate-500">Cidadão: {citizen(m)}</p>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                    <td className="px-4 py-3"><Link className="font-semibold text-brand-700 underline-offset-2 hover:underline" href={`/admin/manifestacoes/${m.id}`}>Abrir<span className="sr-only"> {m.protocol}</span></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Celular: cartões */}
          <ul className="stagger space-y-3 md:hidden">
            {items.map((m) => (
              <li key={m.id}>
                <Link href={`/admin/manifestacoes/${m.id}`} className="card card-hover block !p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs">{m.protocol}</span>
                    <StatusBadge status={m.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2"><TypeBadge type={m.type} /><span className="text-sm font-medium">{m.sector.name}</span></div>
                  <p className="mt-2 break-words text-sm text-slate-600">{summary(m.description)}</p>
                  <p className="mt-2 text-xs text-slate-500">{formatDateTime(m.createdAt)} · {citizen(m)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <nav aria-label="Paginação" className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="text-slate-600">Página {page} de {pages}</span>
        <div className="flex gap-2">
          {page > 1 && <Link className="btn-secondary" href={link(page - 1)}><ChevronLeft className="h-4 w-4" aria-hidden />Anterior</Link>}
          {page < pages && <Link className="btn-secondary" href={link(page + 1)}>Próxima<ChevronRight className="h-4 w-4" aria-hidden /></Link>}
        </div>
      </nav>
    </>
  );
}
