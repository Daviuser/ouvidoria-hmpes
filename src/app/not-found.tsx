import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg animate-fade-up px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-navy-900">Página não encontrada</h1>
      <p className="mt-2 text-slate-600">O endereço acessado não existe.</p>
      <Link href="/" className="btn mt-6 inline-flex">Voltar à Ouvidoria</Link>
    </main>
  );
}
