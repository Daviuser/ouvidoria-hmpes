import { ArrowDown, ClipboardList, HeartHandshake, Star } from "lucide-react";
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
        <section className="public-hero overflow-hidden border-b border-brand-100/70">
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"><span className="hero-orb hero-orb-one"/><span className="hero-orb hero-orb-two"/></div>
          <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:py-20">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-white/75 px-4 py-2 text-xs font-semibold tracking-wide text-brand-800 shadow-sm"><HeartHandshake className="h-4 w-4" aria-hidden/> CUIDAR TAMBÉM É OUVIR</span>
            <h1 className="animate-fade-up text-balance text-3xl font-extrabold tracking-tight text-brand-900 sm:text-5xl">
              Ouvidoria do Hospital Municipal de Santaluz
            </h1>
            <p className="mx-auto mt-4 max-w-2xl animate-fade-up text-base leading-relaxed text-slate-600 [animation-delay:80ms] sm:text-lg">
              Sua opinião é importante para melhorarmos continuamente nossos serviços. Compartilhe sua experiência ou avalie os setores do hospital.
            </p>
            <a href="#manifestacao" className="btn mt-7 min-h-12 px-6">Registrar manifestação <ArrowDown className="h-4 w-4" aria-hidden/></a>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl items-start gap-7 px-4 py-8 sm:py-12 lg:grid-cols-2 lg:gap-8">
          <section id="manifestacao" aria-labelledby="h-manifestacao" className="scroll-mt-24 animate-fade-up [animation-delay:120ms]">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-700 text-white"><ClipboardList className="h-5 w-5" aria-hidden /></span>
              <h2 id="h-manifestacao" className="text-base font-bold tracking-tight text-navy-900 sm:text-lg">REGISTRE SUA MANIFESTAÇÃO</h2>
            </div>
            <ManifestationForm allowAnonymous={allowAnonymous()} />
          </section>
          <section id="avaliacao" aria-labelledby="h-avaliacao" className="scroll-mt-24 animate-fade-up [animation-delay:200ms]">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600 text-white"><Star className="h-5 w-5" aria-hidden /></span>
              <h2 id="h-avaliacao" className="text-base font-bold tracking-tight text-navy-900 sm:text-lg">AVALIE NOSSO ATENDIMENTO</h2>
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
