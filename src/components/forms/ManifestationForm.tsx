"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, Check, CheckCircle2, Copy, Loader2, Send, ShieldCheck } from "lucide-react";
import { submitManifestation } from "@/app/actions/public";
import { DESCRIPTION_MAX } from "@/config/app";
import { SECTORS } from "@/config/sectors";

interface Values {
  type: string; sector: string; otherSector: string; description: string;
  anonymous: boolean; name: string; email: string; phone: string; website: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="err" role="alert"><AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />{message}</p>;
}

export function ManifestationForm({ allowAnonymous }: { allowAnonymous: boolean }) {
  const { register, handleSubmit, watch, setError, reset, formState: { errors } } = useForm<Values>({
    defaultValues: { type: "", sector: "", otherSector: "", description: "", anonymous: allowAnonymous, name: "", email: "", phone: "", website: "" },
  });
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState<{ protocol: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const anonymous = watch("anonymous");
  const sector = watch("sector");
  const length = watch("description")?.length ?? 0;
  const nearLimit = length > DESCRIPTION_MAX * 0.9;

  const onSubmit = (values: Values) => {
    setFormError(null);
    startTransition(async () => {
      const result = await submitManifestation(values);
      if (result.ok) { setDone({ protocol: result.protocol, message: result.message }); reset(); return; }
      setFormError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) setError(field as keyof Values, { message });
    });
  };

  const copyProtocol = async () => {
    if (!done) return;
    try { await navigator.clipboard.writeText(done.protocol); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* sem permissão: o texto continua selecionável */ }
  };

  if (done) {
    return (
      <div role="status" className="card animate-scale-in border-accent-100 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-50 text-accent-600 ring-8 ring-accent-50/60">
          <CheckCircle2 className="h-9 w-9" aria-hidden />
        </span>
        <p className="mt-4 text-base font-semibold text-navy-900">{done.message}</p>
        <div className="mx-auto mt-5 max-w-sm rounded-xl border border-dashed border-brand-200 bg-brand-50/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-brand-800">Seu protocolo</p>
          <p className="mt-1 select-all break-all text-2xl font-bold tracking-wider text-brand-900">{done.protocol}</p>
          <button type="button" onClick={copyProtocol} className="btn-secondary mt-3 !py-1.5 text-xs">
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {copied ? "Copiado" : "Copiar protocolo"}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">Guarde este número para referência.</p>
        <button className="btn mt-5" onClick={() => setDone(null)}>Registrar outra manifestação</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5" aria-describedby={formError ? "form-error" : undefined}>
      <div className="alert alert-info">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p className="text-xs leading-relaxed">Não inclua dados clínicos desnecessários (diagnósticos, exames, número de prontuário). Armazenamos apenas o que você informar neste formulário, para análise da Ouvidoria.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="type">Tipo de manifestação *</label>
          <select id="type" className="field" aria-invalid={!!errors.type} {...register("type", { required: "Selecione o tipo de manifestação." })}>
            <option value="">Selecione…</option>
            <option value="COMPLAINT">Reclamação</option>
            <option value="SUGGESTION">Sugestão</option>
            <option value="PRAISE">Elogio</option>
          </select>
          <FieldError message={errors.type?.message} />
        </div>
        <div>
          <label className="label" htmlFor="sector">Setor relacionado *</label>
          <select id="sector" className="field" aria-invalid={!!errors.sector} {...register("sector", { required: "Selecione o setor." })}>
            <option value="">Selecione…</option>
            {SECTORS.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
          <FieldError message={errors.sector?.message} />
        </div>
      </div>

      {sector === "OUTROS" && (
        <div className="animate-fade-up">
          <label className="label" htmlFor="otherSector">Qual setor? (opcional)</label>
          <input id="otherSector" className="field" maxLength={100} {...register("otherSector")} />
          <FieldError message={errors.otherSector?.message} />
        </div>
      )}

      <div>
        <label className="label" htmlFor="description">Descrição *</label>
        <textarea id="description" rows={6} className="field resize-y" aria-invalid={!!errors.description}
          {...register("description", {
            required: "Descreva sua manifestação.",
            minLength: { value: 10, message: "Descreva com pelo menos 10 caracteres." },
            maxLength: { value: DESCRIPTION_MAX, message: `Máximo de ${DESCRIPTION_MAX} caracteres.` },
          })} />
        <div className="mt-1.5 flex justify-between gap-2">
          <FieldError message={errors.description?.message} />
          <span aria-live="polite" className={`ml-auto text-xs tabular-nums ${nearLimit ? "font-semibold text-alert-600" : "text-slate-500"}`}>{length}/{DESCRIPTION_MAX}</span>
        </div>
      </div>

      {allowAnonymous && (
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm transition hover:border-brand-200 hover:bg-brand-50/40">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-700" {...register("anonymous")} />
          <span>Enviar de forma anônima. Nome, e-mail e telefone <strong>não</strong> serão armazenados.</span>
        </label>
      )}

      {!anonymous && (
        <fieldset className="animate-fade-up space-y-4 rounded-xl border border-slate-200 p-4">
          <legend className="px-1 text-sm font-semibold">Seus dados de contato (opcionais)</legend>
          <p className="text-xs text-slate-600">Serão armazenados e visíveis apenas à equipe autorizada da Ouvidoria.</p>
          <div>
            <label className="label" htmlFor="name">Nome</label>
            <input id="name" autoComplete="name" className="field" {...register("name", { maxLength: 120 })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="email">E-mail</label>
              <input id="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email}
                {...register("email", { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido." } })} />
              <FieldError message={errors.email?.message} />
            </div>
            <div>
              <label className="label" htmlFor="phone">Telefone</label>
              <input id="phone" type="tel" autoComplete="tel" className="field" aria-invalid={!!errors.phone}
                {...register("phone", { pattern: { value: /^[0-9()+\-\s]{8,20}$/, message: "Telefone inválido." } })} />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>
        </fieldset>
      )}

      {/* honeypot: invisível para pessoas */}
      <div aria-hidden className="absolute left-[-9999px]">
        <label>Não preencha <input tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      </div>

      {formError && (
        <p id="form-error" role="alert" className="alert alert-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{formError}
        </p>
      )}

      <button type="submit" className="btn w-full sm:w-auto" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        {pending ? "Enviando…" : "Enviar manifestação"}
      </button>
    </form>
  );
}
