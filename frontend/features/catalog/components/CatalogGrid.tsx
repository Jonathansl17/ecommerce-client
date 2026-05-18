import type { CatalogProduct } from '../types/catalog.types';
import { ProductCard } from './ProductCard';

interface CatalogGridProps {
  products: CatalogProduct[];
}

export function CatalogGrid({ products }: CatalogGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.itemId} product={product} />
      ))}
    </div>
  );
}
