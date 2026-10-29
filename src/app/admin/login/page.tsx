import Image from "next/image";
import { redirect } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { getAdmin } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Acesso administrativo — Ouvidoria" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin/dashboard");
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-700/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-accent-600/20 blur-3xl" />
        <div className="relative rounded-2xl bg-white p-4 shadow-lift animate-fade-up w-fit">
          <Image src="/images/logo-hospital.jpeg" alt="Hospital Municipal de Santaluz" width={1600} height={535} priority className="h-14 w-auto" />
        </div>
        <div className="relative max-w-md animate-fade-up [animation-delay:100ms]">
          <ShieldCheck className="h-10 w-10 text-accent-500" aria-hidden />
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight">Ouvidoria — Hospital Municipal de Santaluz</h2>
          <p className="mt-3 text-brand-100">Área restrita à direção e aos responsáveis autorizados pela Ouvidoria.</p>
        </div>
        <p className="relative text-xs text-brand-200">Acesso monitorado. As ações administrativas são registradas.</p>
      </aside>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm animate-fade-up">
          <Image src="/images/logo-hospital.jpeg" alt="Hospital Municipal de Santaluz" width={1600} height={535} className="mx-auto mb-8 h-12 w-auto lg:hidden" />
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Lock className="h-5 w-5" aria-hidden /></span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-900">Acesso administrativo</h1>
          <p className="mb-6 mt-1 text-sm text-slate-600">Entre com seu e-mail e senha para acessar o painel.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
