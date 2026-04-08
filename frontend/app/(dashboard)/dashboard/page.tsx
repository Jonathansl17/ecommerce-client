export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Panel principal</h1>
        <p className="mt-1 text-foreground/70">
          Bienvenido a tu cuenta. Explora el catálogo y configura tus preferencias.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/catalogo"
          className="rounded-lg border border-foreground/10 bg-white p-6 hover:border-foreground/30 transition-colors"
        >
          <h2 className="text-base font-semibold text-foreground">Explorar catálogo</h2>
          <p className="mt-1 text-sm text-foreground/60">
            Descubre todos nuestros productos disponibles.
          </p>
        </a>

        <a
          href="/preferencias"
          className="rounded-lg border border-foreground/10 bg-white p-6 hover:border-foreground/30 transition-colors"
        >
          <h2 className="text-base font-semibold text-foreground">
            Preferencias de notificaciones
          </h2>
          <p className="mt-1 text-sm text-foreground/60">
            Configura cómo y cuándo quieres recibir notificaciones.
          </p>
        </a>
      </div>
    </div>
  );
}
