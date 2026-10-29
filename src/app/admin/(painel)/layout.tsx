import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { logoutAction } from "@/app/actions/admin";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <AdminNav />
            <Link href="/admin/dashboard" aria-label="Painel da Ouvidoria" className="hidden sm:block">
              <Image src="/images/logo-hospital.jpeg" alt="Hospital Municipal de Santaluz" width={1600} height={535} className="h-9 w-auto" />
            </Link>
            <span className="text-sm font-bold text-brand-900 sm:hidden">Ouvidoria</span>
          </div>
          <form action={logoutAction} className="flex items-center gap-3">
            <span className="hidden max-w-40 truncate text-sm text-slate-600 sm:block" title={admin.name}>{admin.name}</span>
            <button className="btn-secondary !px-3 !py-2"><LogOut className="h-4 w-4" aria-hidden /><span>Sair</span></button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
