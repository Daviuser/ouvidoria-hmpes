import { AlertTriangle, CheckCircle2, CircleDot, Lightbulb, Loader, Search, ThumbsUp } from "lucide-react";
import { STATUS_LABEL, TYPE_LABEL } from "@/config/app";

type Status = keyof typeof STATUS_LABEL;
type Type = keyof typeof TYPE_LABEL;

const STATUS_STYLE: Record<Status, { cls: string; Icon: typeof CircleDot }> = {
  RECEIVED: { cls: "bg-slate-100 text-slate-700 ring-slate-200", Icon: CircleDot },
  IN_REVIEW: { cls: "bg-amber-50 text-amber-800 ring-amber-200", Icon: Search },
  IN_PROGRESS: { cls: "bg-brand-50 text-brand-800 ring-brand-200", Icon: Loader },
  COMPLETED: { cls: "bg-accent-50 text-accent-700 ring-accent-100", Icon: CheckCircle2 },
};
const TYPE_STYLE: Record<Type, { cls: string; Icon: typeof CircleDot }> = {
  COMPLAINT: { cls: "bg-alert-50 text-alert-700 ring-red-200", Icon: AlertTriangle },
  SUGGESTION: { cls: "bg-brand-50 text-brand-800 ring-brand-200", Icon: Lightbulb },
  PRAISE: { cls: "bg-accent-50 text-accent-700 ring-accent-100", Icon: ThumbsUp },
};

export function StatusBadge({ status }: { status: Status }) {
  const { cls, Icon } = STATUS_STYLE[status];
  return <span className={`badge ${cls}`}><Icon className="h-3.5 w-3.5" aria-hidden />{STATUS_LABEL[status]}</span>;
}

export function TypeBadge({ type }: { type: Type }) {
  const { cls, Icon } = TYPE_STYLE[type];
  return <span className={`badge ${cls}`}><Icon className="h-3.5 w-3.5" aria-hidden />{TYPE_LABEL[type]}</span>;
}
