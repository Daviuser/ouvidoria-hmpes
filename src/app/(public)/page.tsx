import { ClipboardList, Star } from "lucide-react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { ManifestationForm } from "@/components/forms/ManifestationForm";
import { RatingForm } from "@/components/forms/RatingForm";
import { allowAnonymous } from "@/config/app";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="border-b border-slate-200/70 bg-gradient-to-b from-brand-50/70 to-surface">
          <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:py-16">
            <h1 className="animate-fade-up text-balance text-2xl font-extrabold tracking-tight text-brand-900 sm:text-4xl">
              OUVIDORIA — HOSPITAL MUNICIPAL DE SANTALUZ
            </h1>
            <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-base leading-relaxed text-slate-600 [animation-delay:80ms] sm:text-lg">
              Sua opinião é importante para melhorarmos continuamente nossos serviços. Registre sua manifestação ou avalie os setores do nosso hospital.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-10 lg:grid-cols-2">
          <section id="manifestacao" aria-labelledby="h-manifestacao" className="scroll-mt-24 animate-fade-up [animation-delay:120ms]">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white"><ClipboardList className="h-5 w-5" aria-hidden /></span>
              <h2 id="h-manifestacao" className="text-lg font-bold tracking-tight text-navy-900">REGISTRE SUA MANIFESTAÇÃO</h2>
            </div>
            <ManifestationForm allowAnonymous={allowAnonymous()} />
          </section>
          <section id="avaliacao" aria-labelledby="h-avaliacao" className="scroll-mt-24 animate-fade-up [animation-delay:200ms]">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600 text-white"><Star className="h-5 w-5" aria-hidden /></span>
              <h2 id="h-avaliacao" className="text-lg font-bold tracking-tight text-navy-900">AVALIE NOSSO ATENDIMENTO</h2>
            </div>
            <RatingForm />
          </section>
        </div>
      </main>
      <footer className="border-t border-slate-200 bg-white py-6">
        <p className="mx-auto max-w-3xl px-4 text-center text-xs leading-relaxed text-slate-500">
          Hospital Municipal de Santaluz — Santaluz, Bahia. As informações enviadas são utilizadas exclusivamente pela Ouvidoria para análise e melhoria dos serviços.
        </p>
      </footer>
    </>
  );
}
