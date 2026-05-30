export function PanelLoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando notificaciones"
      className="divide-y divide-border"
    >
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-4 py-3 flex items-start gap-3">
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1/2 rounded-md bg-muted animate-shimmer" />
              <div className="h-4 w-14 rounded-full bg-muted animate-shimmer" />
            </div>
            <div className="h-3 w-full rounded-md bg-muted animate-shimmer" />
            <div className="h-2.5 w-1/3 rounded-md bg-muted animate-shimmer" />
          </div>
          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-muted animate-shimmer" />
        </div>
      ))}
    </div>
  );
}
