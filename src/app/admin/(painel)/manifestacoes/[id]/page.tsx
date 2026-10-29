import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { getManifestationDetail } from "@/server/services/manifestation.service";
import { StatusForm, NoteForm } from "@/components/admin/ManifestationActions";
import { StatusBadge, TypeBadge } from "@/components/ui/Badges";
import { STATUS_LABEL } from "@/config/app";
import { formatDateTime } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const m = await getManifestationDetail(id);
  if (!m) notFound();

  return (
    <>
      <Link href="/admin/manifestacoes" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden />Voltar às manifestações</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3 animate-fade-up">
        <h1 className="page-title">Protocolo <span className="break-all font-mono">{m.protocol}</span></h1>
        <StatusBadge status={m.status} />
      </div>
      <div className="stagger mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Recebida em</dt><dd className="mt-1">{formatDateTime(m.createdAt)}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Tipo</dt><dd className="mt-1"><TypeBadge type={m.type} /></dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Setor</dt><dd className="mt-1">{m.sector.name}{m.otherSector ? ` — ${m.otherSector}` : ""}</dd></div>
              <div><dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Cidadão</dt>
                <dd className="mt-1 break-words">{m.anonymous ? "Manifestação anônima" : [m.name, m.email, m.phone].filter(Boolean).join(" · ") || "Não informado"}</dd></div>
            </dl>
            <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-slate-500">Descrição</h2>
            <p className="mt-2 whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 text-sm leading-relaxed">{m.description}</p>
          </section>

          <section className="card">
            <h2 className="font-semibold text-navy-900">Histórico</h2>
            <ol className="mt-4 space-y-4 border-l-2 border-brand-100 pl-5 text-sm">
              {m.history.map((h) => (
                <li key={h.id} className="relative">
                  <span aria-hidden className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-brand-600 ring-2 ring-brand-100" />
                  <p>{h.fromStatus ? `${STATUS_LABEL[h.fromStatus]} → ` : ""}<strong>{STATUS_LABEL[h.toStatus]}</strong></p>
                  <p className="text-xs text-slate-500">{formatDateTime(h.createdAt)} · {h.admin?.name ?? "Sistema"}</p>
                  {h.note && <p className="mt-1 whitespace-pre-wrap break-words text-slate-700">{h.note}</p>}
                </li>
              ))}
            </ol>
          </section>

          <section className="card">
            <h2 className="flex items-center gap-2 font-semibold text-navy-900"><Lock className="h-4 w-4 text-slate-500" aria-hidden />Observações internas</h2>
            {m.notes.length === 0 ? <p className="mt-2 text-sm text-slate-600">Nenhuma observação.</p> : (
              <ul className="mt-4 space-y-3 text-sm">
                {m.notes.map((n) => (
                  <li key={n.id} className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5">
                    <p className="whitespace-pre-wrap break-words">{n.content}</p>
                    <p className="mt-1.5 text-xs text-slate-500">{formatDateTime(n.createdAt)} · {n.admin.name}</p>
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
