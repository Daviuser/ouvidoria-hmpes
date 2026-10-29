"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { loginAction, type FormState } from "@/app/actions/admin";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  return (
    <form action={action} className="card space-y-4">
      <div>
        <label htmlFor="email" className="label">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">Senha</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      {state.error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-alert-600">{state.error}</p>}
      <button className="btn w-full" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}Entrar
      </button>
    </form>
  );
}
