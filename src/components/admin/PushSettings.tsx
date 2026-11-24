"use client";

import { useCallback, useEffect, useState } from "react";
import { getPushSetupAction, registerPushAction, removePushAction, testPushAction } from "@/app/actions/push";

type Device = { id: string; createdAt: string };
function decodeKey(value: string) {
  const padded = value + "=".repeat((4 - value.length % 4) % 4);
  const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export function PushSettings() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    const result = await getPushSetupAction();
    setPublicKey(result.publicKey);
    setDevices(result.devices);
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  async function enable() {
    setBusy(true); setMessage("");
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("Este navegador não oferece suporte a notificações push.");
      if (!publicKey) throw new Error("O servidor ainda não foi configurado para Web Push.");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Permissão de notificações não autorizada.");
      await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      // register() pode resolver enquanto o worker ainda está instalando; PushManager
      // exige uma registration com service worker ativo.
      const registration = await navigator.serviceWorker.ready;
      if (!registration.active) throw new Error("O Service Worker ainda não está ativo. Recarregue a página e tente novamente.");
      const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: decodeKey(publicKey) });
      const result = await registerPushAction(subscription.toJSON());
      if (!result.ok) throw new Error(result.error);
      await refresh(); setMessage("Notificações ativadas neste dispositivo.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível ativar notificações."); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    setBusy(true);
    try { await removePushAction(id); await refresh(); setMessage("Dispositivo removido."); }
    catch { setMessage("Não foi possível remover o dispositivo."); }
    finally { setBusy(false); }
  }
  async function test() {
    setBusy(true);
    const result = await testPushAction(); setMessage(result.message); setBusy(false);
  }

  return <div className="space-y-6">
    <section className="card">
      <h2 className="text-lg font-semibold text-navy-900">Ativar notificações</h2>
      <p className="mt-2 text-sm text-slate-600">Receba um aviso quando uma nova manifestação for registrada. O texto da manifestação não aparece na notificação.</p>
      <button type="button" className="btn-primary mt-4" disabled={busy} onClick={enable}>{busy ? "Aguarde…" : "Ativar notificações neste dispositivo"}</button>
      <p className="mt-3 text-xs text-slate-500">No iPhone (iOS 16.4+), primeiro adicione a Ouvidoria à Tela de Início e abra pelo ícone para autorizar.</p>
      {message && <p role="status" className="mt-3 text-sm text-brand-800">{message}</p>}
    </section>
    <section className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-lg font-semibold text-navy-900">Dispositivos cadastrados</h2><p className="text-sm text-slate-600">{devices.length} dispositivo(s) vinculado(s) à sua conta.</p></div>
        <button type="button" className="btn-secondary" disabled={busy || devices.length === 0} onClick={test}>Testar notificação</button>
      </div>
      {devices.length > 0 ? <ul className="mt-4 divide-y divide-slate-100">{devices.map((device) => <li key={device.id} className="flex items-center justify-between gap-4 py-3 text-sm"><span>Adicionado em {new Date(device.createdAt).toLocaleString("pt-BR")}</span><button className="text-alert-700 underline" disabled={busy} onClick={() => void remove(device.id)}>Remover</button></li>)}</ul> : <p className="mt-4 text-sm text-slate-500">Nenhum dispositivo cadastrado.</p>}
    </section>
  </div>;
}
