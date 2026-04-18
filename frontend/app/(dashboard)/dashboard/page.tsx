import { ROUTES } from '@/lib/constants/routes.constants';
import { DASHBOARD_NAV_STRINGS } from '@/features/auth/constants/auth.constants';

const PAGE_TITLE = 'Bienvenido a la tienda';
const PAGE_SUBTITLE = 'Explora nuestros productos y encuentra lo que necesitas.';

const FEATURED_SECTIONS = [
  {
    href: ROUTES.CATALOG,
    title: 'Explorar catálogo',
    description: 'Descubre todos nuestros productos disponibles.',
  },
  {
    href: ROUTES.CATALOG_NEW,
    title: 'Nuevos productos',
    description: 'Los últimos productos agregados a nuestra tienda.',
  },
  {
    href: ROUTES.CATALOG_OFFERS,
    title: 'Ofertas especiales',
    description: 'Aprovecha los mejores descuentos disponibles.',
  },
] as const;

const PLACEHOLDER_PRODUCTS = [
  { id: 1, name: 'Producto destacado 1', price: '₡12,500' },
  { id: 2, name: 'Producto destacado 2', price: '₡8,900' },
  { id: 3, name: 'Producto destacado 3', price: '₡15,200' },
  { id: 4, name: 'Producto destacado 4', price: '₡6,750' },
] as const;

const PRODUCTS_TITLE = 'Productos destacados';

export default function StorePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{PAGE_TITLE}</h1>
        <p className="mt-2 text-foreground/70">{PAGE_SUBTITLE}</p>
      </div>

      <section aria-labelledby="secciones-heading">
        <h2 id="secciones-heading" className="sr-only">{DASHBOARD_NAV_STRINGS.sectionsHeading}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_SECTIONS.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="rounded-lg border border-foreground/10 bg-background p-6 hover:border-foreground/30 transition-colors"
            >
              <h3 className="text-base font-semibold text-foreground">
                {section.title}
              </h3>
              <p className="mt-1 text-sm text-foreground/60">
                {section.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section aria-labelledby="productos-heading">
        <h2
          id="productos-heading"
          className="text-xl font-bold text-foreground mb-4"
        >
          {PRODUCTS_TITLE}
        </h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {PLACEHOLDER_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="rounded-lg border border-foreground/10 bg-background p-4 space-y-3"
            >
              <div className="aspect-square rounded-md bg-foreground/5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-foreground/80">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
