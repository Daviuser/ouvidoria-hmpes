"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2, Star } from "lucide-react";
import { submitRatings } from "@/app/actions/public";
import { SCORE_LABEL } from "@/config/app";
import { RATEABLE_SECTORS } from "@/config/sectors";

export function RatingForm() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    setError(null);
    const ratings = Object.entries(scores).map(([sector, score]) => ({ sector, score }));
    if (ratings.length === 0) { setError("Avalie ao menos um setor."); return; }
    startTransition(async () => {
      const r = await submitRatings({ ratings, website: "" });
      if (r.ok) { setDone(true); setScores({}); } else setError(r.error);
    });
  };

  if (done) {
    return (
      <div role="status" className="card border-brand-500 bg-brand-50 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-700" aria-hidden />
        <p className="mt-3 font-semibold">Obrigado! Sua avaliação foi registrada.</p>
        <button className="btn-secondary mt-4" onClick={() => setDone(false)}>Fazer nova avaliação</button>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <p className="text-sm text-slate-600">Avalie somente os setores que desejar. Nenhuma identificação é necessária.</p>
      <ul className="divide-y divide-slate-100">
        {RATEABLE_SECTORS.map((s) => {
          const value = scores[s.code] ?? 0;
          return (
            <li key={s.code} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span id={`lbl-${s.code}`} className="text-sm font-medium">{s.name}</span>
              <div className="flex items-center gap-3">
                <div role="radiogroup" aria-labelledby={`lbl-${s.code}`} className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={value === n}
                      aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}: ${SCORE_LABEL[n]}`}
                      onClick={() => setScores((p) => ({ ...p, [s.code]: n }))} className="rounded p-1">
                      <Star className={`h-7 w-7 ${n <= value ? "fill-amber-400 text-amber-500" : "text-slate-300"}`} aria-hidden />
                    </button>
                  ))}
                </div>
                <span className="min-w-28 text-xs text-slate-600" aria-live="polite">{value ? SCORE_LABEL[value] : "Não avaliado"}</span>
              </div>
            </li>
          );
        })}
      </ul>
      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-alert-600">{error}</p>}
      <button type="button" className="btn" onClick={submit} disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {pending ? "Enviando…" : "Enviar avaliação"}
      </button>
    </div>
  );
}
