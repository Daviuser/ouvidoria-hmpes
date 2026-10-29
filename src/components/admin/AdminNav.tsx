"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, LayoutDashboard, Menu, X } from "lucide-react";

const LINKS = [
  { href: "/admin/dashboard", label: "Painel", Icon: LayoutDashboard },
  { href: "/admin/manifestacoes", label: "Manifestações", Icon: ClipboardList },
  { href: "/admin/avaliacoes", label: "Avaliações", Icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);

  const item = (href: string) => (pathname.startsWith(href)
    ? "bg-brand-50 text-brand-800"
    : "text-navy-700 hover:bg-slate-100");

  return (
    <div ref={ref} className="relative">
      <nav aria-label="Navegação administrativa" className="hidden items-center gap-1 md:flex">
        {LINKS.map(({ href, label, Icon }) => (
          <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${item(href)}`}>
            <Icon className="h-4 w-4" aria-hidden />{label}
          </Link>
        ))}
      </nav>
      <button type="button" className="btn-secondary !p-2.5 md:hidden" aria-expanded={open} aria-controls="admin-menu"
        aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen((v) => !v)}>
        {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
      </button>
      {open && (
        <nav id="admin-menu" aria-label="Navegação administrativa" className="absolute left-0 top-full z-40 mt-2 w-60 animate-menu-in rounded-xl border border-slate-200 bg-white p-2 shadow-lift md:hidden">
          {LINKS.map(({ href, label, Icon }) => (
            <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${item(href)}`}>
              <Icon className="h-4 w-4" aria-hidden />{label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
