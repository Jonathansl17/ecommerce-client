import type { CatalogProduct } from '../types/catalog.types';
import { ProductCard } from './ProductCard';

interface CatalogGridProps {
  products: CatalogProduct[];
  cartVariantIds?: ReadonlySet<string>;
}

export function CatalogGrid({ products, cartVariantIds }: CatalogGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.itemId}
          product={product}
          cartVariantIds={cartVariantIds}
        />
      ))}
    </div>
  );
}
