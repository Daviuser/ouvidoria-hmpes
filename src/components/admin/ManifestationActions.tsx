"use client";

import { useActionState } from "react";
import { addNoteAction, updateStatusAction, type FormState } from "@/app/actions/admin";
import { STATUS_LABEL } from "@/config/app";

function Feedback({ state }: { state: FormState }) {
  if (state.error) return <p role="alert" className="text-sm text-alert-600">{state.error}</p>;
  if (state.success) return <p role="status" className="text-sm text-brand-700">{state.success}</p>;
  return null;
}

export function StatusForm({ id, current }: { id: string; current: keyof typeof STATUS_LABEL }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateStatusAction, {});
  return (
    <form action={action} className="card space-y-3">
      <h2 className="font-semibold">Alterar situação</h2>
      <input type="hidden" name="manifestationId" value={id} />
      <select name="status" defaultValue={current} aria-label="Nova situação" className="field">
        {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <textarea name="note" rows={2} maxLength={1000} placeholder="Observação sobre a alteração (opcional)" aria-label="Observação" className="field" />
      <Feedback state={state} />
      <button className="btn" disabled={pending}>Salvar situação</button>
    </form>
  );
}

export function NoteForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addNoteAction, {});
  return (
    <form action={action} className="card space-y-3">
      <h2 className="font-semibold">Nova observação interna</h2>
      <input type="hidden" name="manifestationId" value={id} />
      <textarea name="content" rows={3} maxLength={2000} required aria-label="Observação interna" className="field" />
      <Feedback state={state} />
      <button className="btn" disabled={pending}>Registrar observação</button>
    </form>
  );
}
