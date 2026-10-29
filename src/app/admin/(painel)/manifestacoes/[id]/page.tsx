import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { getManifestationDetail } from "@/server/services/manifestation.service";
import { StatusForm, NoteForm } from "@/components/admin/ManifestationActions";
import { STATUS_LABEL, TYPE_LABEL } from "@/config/app";
import { formatDateTime } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const m = await getManifestationDetail(id);
  if (!m) notFound();

  return (
    <>
      <Link href="/admin/manifestacoes" className="text-sm text-brand-700 underline">← Voltar</Link>
      <h1 className="mt-2 text-xl font-bold">Protocolo <span className="font-mono">{m.protocol}</span></h1>
      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card">
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">Recebida em</dt><dd>{formatDateTime(m.createdAt)}</dd></div>
              <div><dt className="text-slate-500">Tipo</dt><dd>{TYPE_LABEL[m.type]}</dd></div>
              <div><dt className="text-slate-500">Setor</dt><dd>{m.sector.name}{m.otherSector ? ` — ${m.otherSector}` : ""}</dd></div>
              <div><dt className="text-slate-500">Situação</dt><dd>{STATUS_LABEL[m.status]}</dd></div>
              <div className="sm:col-span-2"><dt className="text-slate-500">Cidadão</dt>
                <dd>{m.anonymous ? "Manifestação anônima" : [m.name, m.email, m.phone].filter(Boolean).join(" · ") || "Não informado"}</dd></div>
            </dl>
            <h2 className="mt-4 font-semibold">Descrição</h2>
            <p className="mt-1 whitespace-pre-wrap break-words text-sm">{m.description}</p>
          </section>

          <section className="card">
            <h2 className="font-semibold">Histórico</h2>
            <ol className="mt-3 space-y-3 text-sm">
              {m.history.map((h) => (
                <li key={h.id} className="border-l-2 border-brand-500 pl-3">
                  <p>{h.fromStatus ? `${STATUS_LABEL[h.fromStatus]} → ` : ""}<strong>{STATUS_LABEL[h.toStatus]}</strong></p>
                  <p className="text-xs text-slate-500">{formatDateTime(h.createdAt)} · {h.admin?.name ?? "Sistema"}</p>
                  {h.note && <p className="mt-1 whitespace-pre-wrap">{h.note}</p>}
                </li>
              ))}
            </ol>
          </section>

          <section className="card">
            <h2 className="font-semibold">Observações internas</h2>
            {m.notes.length === 0 ? <p className="mt-2 text-sm text-slate-600">Nenhuma observação.</p> : (
              <ul className="mt-3 space-y-3 text-sm">
                {m.notes.map((n) => (
                  <li key={n.id} className="rounded-md bg-slate-50 p-3">
                    <p className="whitespace-pre-wrap">{n.content}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(n.createdAt)} · {n.admin.name}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        <div className="space-y-6">
          <StatusForm id={m.id} current={m.status} />
          <NoteForm id={m.id} />
        </div>
      </div>
    </>
  );
}
