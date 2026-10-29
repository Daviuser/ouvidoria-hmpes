"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-lg animate-fade-up px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-navy-900">Ocorreu um erro</h1>
      <p className="mt-2 text-slate-600">Não foi possível carregar esta página. Tente novamente.</p>
      <button onClick={reset} className="btn mt-6">Tentar novamente</button>
    </main>
  );
}
