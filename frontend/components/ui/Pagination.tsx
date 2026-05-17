'use client';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  itemLabelSingular: string;
  itemLabelPlural: string;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  page,
  limit,
  total,
  itemLabelSingular,
  itemLabelPlural,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isFirst = page <= 1;
  const isLast = page >= totalPages;
  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);
  const itemLabel = total === 1 ? itemLabelSingular : itemLabelPlural;

  if (total <= limit) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-muted-foreground">
        Mostrando {showingFrom}–{showingTo} de {total} {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || isFirst}
          className="rounded-md border border-foreground/20 px-3 py-1 text-foreground/80 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página anterior"
        >
          Anterior
        </button>
        <span className="px-2 text-foreground" aria-current="page">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || isLast}
          className="rounded-md border border-foreground/20 px-3 py-1 text-foreground/80 transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Página siguiente"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
