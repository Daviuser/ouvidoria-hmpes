import Image from "next/image";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Image src="/images/logo-hospital.jpeg" alt="Hospital Municipal de Santaluz" width={1600} height={535} priority className="h-11 w-auto sm:h-14" />
        <nav aria-label="Seções da página" className="hidden items-center gap-1 text-sm font-medium sm:flex">
          <a href="#manifestacao" className="rounded-lg px-3 py-2 text-navy-700 transition hover:bg-brand-50 hover:text-brand-800">Manifestação</a>
          <a href="#avaliacao" className="rounded-lg px-3 py-2 text-navy-700 transition hover:bg-brand-50 hover:text-brand-800">Avaliação</a>
        </nav>
      </div>
    </header>
  );
}
