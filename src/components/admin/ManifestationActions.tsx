"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { addNoteAction, updateStatusAction, type FormState } from "@/app/actions/admin";
import { STATUS_LABEL } from "@/config/app";

function Feedback({ state }: { state: FormState }) {
  if (state.error) return <p role="alert" className="alert alert-error"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{state.error}</p>;
  if (state.success) return <p role="status" className="alert alert-success"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{state.success}</p>;
  return null;
}

export function StatusForm({ id, current }: { id: string; current: keyof typeof STATUS_LABEL }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateStatusAction, {});
  return (
    <form action={action} className="card space-y-3">
      <h2 className="font-semibold text-navy-900">Alterar situação</h2>
      <input type="hidden" name="manifestationId" value={id} />
      <select name="status" defaultValue={current} aria-label="Nova situação" className="field">
        {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <textarea name="note" rows={2} maxLength={1000} placeholder="Observação sobre a alteração (opcional)" aria-label="Observação" className="field" />
      <Feedback state={state} />
      <button className="btn w-full" disabled={pending}>{pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}{pending ? "Salvando…" : "Salvar situação"}</button>
    </form>
  );
}

export function NoteForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addNoteAction, {});
  return (
    <form action={action} className="card space-y-3">
      <h2 className="font-semibold text-navy-900">Nova observação interna</h2>
      <input type="hidden" name="manifestationId" value={id} />
      <textarea name="content" rows={3} maxLength={2000} required aria-label="Observação interna" className="field" />
      <Feedback state={state} />
      <button className="btn w-full" disabled={pending}>{pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}{pending ? "Salvando…" : "Registrar observação"}</button>
    </form>
  );
}
