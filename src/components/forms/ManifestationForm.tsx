"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { submitManifestation } from "@/app/actions/public";
import { DESCRIPTION_MAX } from "@/config/app";
import { SECTORS } from "@/config/sectors";

interface Values {
  type: string; sector: string; otherSector: string; description: string;
  anonymous: boolean; name: string; email: string; phone: string; website: string;
}

export function ManifestationForm({ allowAnonymous }: { allowAnonymous: boolean }) {
  const { register, handleSubmit, watch, setError, reset, formState: { errors } } = useForm<Values>({
    defaultValues: { type: "", sector: "", otherSector: "", description: "", anonymous: allowAnonymous, name: "", email: "", phone: "", website: "" },
  });
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<{ protocol: string; message: string } | null>(null);
  const anonymous = watch("anonymous");
  const sector = watch("sector");
  const length = watch("description")?.length ?? 0;

  const onSubmit = (values: Values) => {
    setFormError(null);
    startTransition(async () => {
      const result = await submitManifestation(values);
      if (result.ok) { setDone({ protocol: result.protocol, message: result.message }); reset(); return; }
      setFormError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) setError(field as keyof Values, { message });
    });
  };

  if (done) {
    return (
      <div role="status" className="card border-brand-500 bg-brand-50 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-brand-700" aria-hidden />
        <p className="mt-3 font-semibold">{done.message}</p>
        <p className="mt-3 text-sm">Seu protocolo:</p>
        <p className="mt-1 select-all text-2xl font-bold tracking-wider text-brand-800">{done.protocol}</p>
        <p className="mt-2 text-xs text-slate-600">Guarde este número para referência.</p>
        <button className="btn-secondary mt-4" onClick={() => setDone(null)}>Registrar outra manifestação</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4" aria-describedby={formError ? "form-error" : undefined}>
      <div className="flex gap-2 rounded-md bg-slate-50 p-3 text-xs text-slate-700">
        <ShieldCheck className="h-4 w-4 shrink-0 text-brand-700" aria-hidden />
        <p>Não inclua dados clínicos desnecessários (diagnósticos, exames, número de prontuário). Armazenamos apenas o que você informar neste formulário, para análise da Ouvidoria.</p>
      </div>

      <div>
        <label className="label" htmlFor="type">Tipo de manifestação *</label>
        <select id="type" className="field" aria-invalid={!!errors.type} {...register("type", { required: "Selecione o tipo de manifestação." })}>
          <option value="">Selecione…</option>
          <option value="COMPLAINT">Reclamação</option>
          <option value="SUGGESTION">Sugestão</option>
          <option value="PRAISE">Elogio</option>
        </select>
        {errors.type && <p className="err">{errors.type.message}</p>}
      </div>

      <div>
        <label className="label" htmlFor="sector">Setor relacionado *</label>
        <select id="sector" className="field" aria-invalid={!!errors.sector} {...register("sector", { required: "Selecione o setor." })}>
          <option value="">Selecione…</option>
          {SECTORS.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
        {errors.sector && <p className="err">{errors.sector.message}</p>}
      </div>

      {sector === "OUTROS" && (
        <div>
          <label className="label" htmlFor="otherSector">Qual setor? (opcional)</label>
          <input id="otherSector" className="field" maxLength={100} {...register("otherSector")} />
          {errors.otherSector && <p className="err">{errors.otherSector.message}</p>}
        </div>
      )}

      <div>
        <label className="label" htmlFor="description">Descrição *</label>
        <textarea id="description" rows={6} className="field" aria-invalid={!!errors.description}
          {...register("description", {
            required: "Descreva sua manifestação.",
            minLength: { value: 10, message: "Descreva com pelo menos 10 caracteres." },
            maxLength: { value: DESCRIPTION_MAX, message: `Máximo de ${DESCRIPTION_MAX} caracteres.` },
          })} />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{errors.description && <span className="text-alert-600">{errors.description.message}</span>}</span>
          <span aria-live="polite">{length}/{DESCRIPTION_MAX}</span>
        </div>
      </div>

      {allowAnonymous && (
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1 h-4 w-4" {...register("anonymous")} />
          <span>Enviar de forma anônima. Nome, e-mail e telefone <strong>não</strong> serão armazenados.</span>
        </label>
      )}

      {!anonymous && (
        <fieldset className="space-y-3 rounded-md border border-slate-200 p-3">
          <legend className="px-1 text-sm font-medium">Seus dados de contato (opcionais)</legend>
          <p className="text-xs text-slate-600">Serão armazenados e visíveis apenas à equipe autorizada da Ouvidoria.</p>
          <div>
            <label className="label" htmlFor="name">Nome</label>
            <input id="name" autoComplete="name" className="field" {...register("name", { maxLength: 120 })} />
          </div>
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input id="email" type="email" autoComplete="email" className="field"
              {...register("email", { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido." } })} />
            {errors.email && <p className="err">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label" htmlFor="phone">Telefone</label>
            <input id="phone" type="tel" autoComplete="tel" className="field"
              {...register("phone", { pattern: { value: /^[0-9()+\-\s]{8,20}$/, message: "Telefone inválido." } })} />
            {errors.phone && <p className="err">{errors.phone.message}</p>}
          </div>
        </fieldset>
      )}

      {/* honeypot: invisível para pessoas */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label>Não preencha <input tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      </div>

      {formError && <p id="form-error" role="alert" className="rounded-md bg-red-50 p-3 text-sm text-alert-600">{formError}</p>}

      <button type="submit" className="btn w-full sm:w-auto" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {pending ? "Enviando…" : "Enviar manifestação"}
      </button>
    </form>
  );
}
