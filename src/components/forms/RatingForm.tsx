"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send, Star } from "lucide-react";
import { submitRatings } from "@/app/actions/public";
import { SCORE_LABEL } from "@/config/app";
import { RATEABLE_SECTORS } from "@/config/sectors";

export function RatingForm() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const rated = Object.keys(scores).length;

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
      <div role="status" className="card animate-scale-in border-accent-100 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 text-accent-600 ring-8 ring-accent-50/60">
          <CheckCircle2 className="h-9 w-9" aria-hidden />
        </span>
        <p className="mt-4 text-base font-semibold text-navy-900">Obrigado! Sua avaliação foi registrada.</p>
        <button className="btn mt-5" onClick={() => setDone(false)}>Fazer nova avaliação</button>
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
            <li key={s.code} className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <span id={`lbl-${s.code}`} className="text-sm font-medium text-navy-900">{s.name}</span>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div role="radiogroup" aria-labelledby={`lbl-${s.code}`} className="flex">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" role="radio" aria-checked={value === n}
                      aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}: ${SCORE_LABEL[n]}`}
                      onClick={() => setScores((p) => ({ ...p, [s.code]: n }))}
                      className="group rounded-lg p-1.5 transition active:scale-90">
                      <Star className={`h-7 w-7 transition duration-200 group-hover:scale-110 ${n <= value ? "fill-amber-400 text-amber-500" : "text-slate-300 group-hover:text-amber-300"}`} aria-hidden />
                    </button>
                  ))}
                </div>
                <span className={`min-w-28 text-right text-xs ${value ? "font-semibold text-brand-800" : "text-slate-500"}`} aria-live="polite">
                  {value ? SCORE_LABEL[value] : "Não avaliado"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      {error && <p role="alert" className="alert alert-error"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{error}</p>}
      <div className="flex items-center justify-between gap-3">
        <button type="button" className="btn" onClick={submit} disabled={pending}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          {pending ? "Enviando…" : "Enviar avaliação"}
        </button>
        <span className="text-xs text-slate-500" aria-live="polite">{rated} de {RATEABLE_SECTORS.length} setores avaliados</span>
      </div>
    </div>
  );
}
