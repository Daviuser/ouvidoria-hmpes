import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { logoutAction } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <nav aria-label="Navegação administrativa" className="flex flex-wrap items-center gap-4 text-sm font-medium">
            <span className="font-bold text-brand-800">Ouvidoria</span>
            <Link href="/admin/dashboard" className="hover:underline">Painel</Link>
            <Link href="/admin/manifestacoes" className="hover:underline">Manifestações</Link>
            <Link href="/admin/avaliacoes" className="hover:underline">Avaliações</Link>
          </nav>
          <form action={logoutAction} className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">{admin.name}</span>
            <button className="btn-secondary">Sair</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
