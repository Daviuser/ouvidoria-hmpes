export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" aria-label="Carregando" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => <div key={i} className="skeleton h-28" />)}
    </div>
  );
}
export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div role="status" aria-label="Carregando" className="space-y-3">
      <div className="skeleton h-28" />
      {Array.from({ length: rows }, (_, i) => <div key={i} className="skeleton h-12" />)}
    </div>
  );
}
