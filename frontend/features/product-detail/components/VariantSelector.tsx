'use client';

import { PRODUCT_DETAIL_STRINGS } from '../constants/product-detail.constants';
import type { ProductDetailVariant, VariantSelectorProps } from '../types/product-detail.types';

function getAvailableStock(variant: ProductDetailVariant): number {
  return Math.max(0, variant.currentStock - variant.reservedStock);
}

export function VariantSelector({ variants, selectedVariantId, onSelect }: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {PRODUCT_DETAIL_STRINGS.variantGroupColor} / {PRODUCT_DETAIL_STRINGS.variantGroupSize}
      </span>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Seleccionar variante">
        {variants.map((variant) => {
          const available = getAvailableStock(variant);
          const isOutOfStock = available === 0;
          const isSelected = selectedVariantId === variant.id;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelect(variant.id)}
              aria-pressed={isSelected}
              aria-label={`${PRODUCT_DETAIL_STRINGS.variantSelected(variant.color, variant.size)}${isOutOfStock ? ` — ${PRODUCT_DETAIL_STRINGS.variantOutOfStock}` : ` — ${PRODUCT_DETAIL_STRINGS.stockAvailable(available)}`}`}
              className={[
                'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                isOutOfStock
                  ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 line-through'
                  : isSelected
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-500 dark:bg-slate-800 dark:text-slate-200',
              ].join(' ')}
            >
              {variant.color} / {variant.size}
              {!isOutOfStock && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({available})
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
