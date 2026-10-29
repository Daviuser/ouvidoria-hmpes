import { PublicHeader } from "@/components/layout/PublicHeader";
import { ManifestationForm } from "@/components/forms/ManifestationForm";
import { RatingForm } from "@/components/forms/RatingForm";
import { allowAnonymous } from "@/config/app";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-navy-800 sm:text-3xl">OUVIDORIA — HOSPITAL MUNICIPAL DE SANTALUZ</h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Sua opinião é importante para melhorarmos continuamente nossos serviços. Registre sua manifestação ou avalie os setores do nosso hospital.
          </p>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="h-manifestacao">
            <h2 id="h-manifestacao" className="mb-3 text-lg font-bold text-brand-800">REGISTRE SUA MANIFESTAÇÃO</h2>
            <ManifestationForm allowAnonymous={allowAnonymous()} />
          </section>
          <section aria-labelledby="h-avaliacao">
            <h2 id="h-avaliacao" className="mb-3 text-lg font-bold text-brand-800">AVALIE NOSSO ATENDIMENTO</h2>
            <RatingForm />
          </section>
        </div>
      </main>
      <footer className="mt-8 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        Hospital Municipal de Santaluz — Santaluz, Bahia. As informações enviadas são utilizadas exclusivamente pela Ouvidoria para análise e melhoria dos serviços.
      </footer>
    </>
  );
}
