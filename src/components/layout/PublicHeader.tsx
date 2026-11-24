import Image from "next/image";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:py-4">
        <Image src="/images/logo-hospital.jpeg" alt="Hospital Municipal de Santaluz" width={1600} height={535} priority className="h-10 w-auto sm:h-14" />
        <nav aria-label="Seções da página" className="flex items-center gap-1 text-xs font-semibold sm:gap-2 sm:text-sm">
          <a href="#manifestacao" className="rounded-xl px-2.5 py-2.5 text-navy-700 transition hover:bg-brand-50 hover:text-brand-800 sm:px-3">Ouvidoria</a>
          <a href="#avaliacao" className="rounded-xl px-2.5 py-2.5 text-navy-700 transition hover:bg-brand-50 hover:text-brand-800 sm:px-3">Avaliação</a>
        </nav>
      </div>
    </header>
  );
}
