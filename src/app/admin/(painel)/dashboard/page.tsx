import { requireAdmin } from "@/lib/auth/session";
import { getDashboardCounts } from "@/server/services/dashboard.service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAdmin();
  const c = await getDashboardCounts();
  const cards: [string, number][] = [
    ["Total de manifestações", c.total], ["Reclamações", c.complaints], ["Sugestões", c.suggestions], ["Elogios", c.praises],
    ["Total de avaliações", c.ratings], ["Recebidas", c.received], ["Em análise", c.inReview],
    ["Em andamento", c.inProgress], ["Concluídas", c.completed],
  ];
  return (
    <>
      <h1 className="mb-4 text-xl font-bold">Painel</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value]) => (
          <li key={label} className="card">
            <p className="text-sm text-slate-600">{label}</p>
            <p className="mt-1 text-3xl font-bold text-brand-800">{value}</p>
          </li>
        ))}
      </ul>
      {c.total === 0 && <p className="mt-6 text-sm text-slate-600">Nenhuma manifestação registrada até o momento.</p>}
    </>
  );
}
