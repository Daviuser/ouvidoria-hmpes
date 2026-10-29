import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CheckCircle2, ClipboardList, Inbox, Lightbulb, Loader, Search, Star, ThumbsUp, type LucideIcon } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { getDashboardCounts } from "@/server/services/dashboard.service";
import { PageHeader } from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

interface Metric { label: string; value: number; Icon: LucideIcon; tone: string; href?: string }

function MetricCard({ m }: { m: Metric }) {
  const body = (
    <>
      <div className="flex items-start justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.tone}`}><m.Icon className="h-5 w-5" aria-hidden /></span>
        {m.href && <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-brand-700" aria-hidden />}
      </div>
      <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-navy-900">{m.value}</p>
      <p className="mt-0.5 text-sm text-slate-600">{m.label}</p>
    </>
  );
  return m.href
    ? <Link href={m.href} className="card card-hover group block" aria-label={`${m.label}: ${m.value}. Ver manifestações`}>{body}</Link>
    : <div className="card">{body}</div>;
}

function Group({ title, items }: { title: string; items: Metric[] }) {
  return (
    <section aria-label={title} className="mt-8 first:mt-0">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</h2>
      <ul className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m) => <li key={m.label}><MetricCard m={m} /></li>)}
      </ul>
    </section>
  );
}

export default async function DashboardPage() {
  await requireAdmin();
  const c = await getDashboardCounts();
  const list = "/admin/manifestacoes";
  return (
    <>
      <PageHeader title="Painel" description="Visão geral das manifestações e avaliações registradas." />
      <Group title="Visão geral" items={[
        { label: "Total de manifestações", value: c.total, Icon: ClipboardList, tone: "bg-brand-50 text-brand-700", href: list },
        { label: "Total de avaliações", value: c.ratings, Icon: Star, tone: "bg-amber-50 text-amber-600", href: "/admin/avaliacoes" },
      ]} />
      <Group title="Por tipo" items={[
        { label: "Reclamações", value: c.complaints, Icon: AlertTriangle, tone: "bg-alert-50 text-alert-600", href: `${list}?type=COMPLAINT` },
        { label: "Sugestões", value: c.suggestions, Icon: Lightbulb, tone: "bg-brand-50 text-brand-700", href: `${list}?type=SUGGESTION` },
        { label: "Elogios", value: c.praises, Icon: ThumbsUp, tone: "bg-accent-50 text-accent-700", href: `${list}?type=PRAISE` },
      ]} />
      <Group title="Por situação" items={[
        { label: "Recebidas", value: c.received, Icon: Inbox, tone: "bg-slate-100 text-slate-700", href: `${list}?status=RECEIVED` },
        { label: "Em análise", value: c.inReview, Icon: Search, tone: "bg-amber-50 text-amber-700", href: `${list}?status=IN_REVIEW` },
        { label: "Em andamento", value: c.inProgress, Icon: Loader, tone: "bg-brand-50 text-brand-700", href: `${list}?status=IN_PROGRESS` },
        { label: "Concluídas", value: c.completed, Icon: CheckCircle2, tone: "bg-accent-50 text-accent-700", href: `${list}?status=COMPLETED` },
      ]} />
      {c.total === 0 && (
        <div className="card mt-8 flex items-center gap-3 border-dashed text-sm text-slate-600">
          <Inbox className="h-5 w-5 text-slate-400" aria-hidden />Nenhuma manifestação registrada até o momento.
        </div>
      )}
    </>
  );
}
