import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { manifestationFilterSchema } from "@/lib/validations/admin";
import { listManifestations } from "@/server/services/manifestation.service";
import { SECTORS } from "@/config/sectors";
import { STATUS_LABEL, TYPE_LABEL } from "@/config/app";
import { formatDateTime } from "@/lib/utils/format";

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

  return (
    <>
      <h1 className="mb-4 text-xl font-bold">Manifestações</h1>
      <form method="get" className="card mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div><label className="label" htmlFor="q">Protocolo</label><input id="q" name="q" defaultValue={filters.q} className="field" /></div>
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
        <div className="flex items-end gap-2"><button className="btn">Filtrar</button><Link href="/admin/manifestacoes" className="btn-secondary">Limpar</Link></div>
      </form>

      {items.length === 0 ? (
        <p className="card text-sm text-slate-600">Nenhuma manifestação encontrada.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600">
              <tr>{["Protocolo", "Recebida em", "Tipo", "Setor", "Resumo", "Cidadão", "Situação", "Ações"].map((h) => <th key={h} scope="col" className="px-3 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-2 font-mono text-xs">{m.protocol}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{formatDateTime(m.createdAt)}</td>
                  <td className="px-3 py-2">{TYPE_LABEL[m.type]}</td>
                  <td className="px-3 py-2">{m.sector.name}</td>
                  <td className="max-w-xs px-3 py-2">{m.description.length > 90 ? `${m.description.slice(0, 90)}…` : m.description}</td>
                  <td className="px-3 py-2">{m.anonymous ? "Anônimo" : m.name || m.email || m.phone || "Não informado"}</td>
                  <td className="px-3 py-2">{STATUS_LABEL[m.status]}</td>
                  <td className="px-3 py-2"><Link className="font-medium text-brand-700 underline" href={`/admin/manifestacoes/${m.id}`}>Abrir</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <nav aria-label="Paginação" className="mt-4 flex items-center justify-between text-sm">
        <span>{total} resultado(s) — página {page} de {pages}</span>
        <div className="flex gap-2">
          {page > 1 && <Link className="btn-secondary" href={link(page - 1)}>Anterior</Link>}
          {page < pages && <Link className="btn-secondary" href={link(page + 1)}>Próxima</Link>}
        </div>
      </nav>
    </>
  );
}
