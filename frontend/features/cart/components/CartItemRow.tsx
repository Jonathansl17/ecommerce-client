'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import { CART_STRINGS, CART_QUANTITY, CART_CURRENCY_FORMAT } from '../constants/cart.constants';
import type { CartItemRowProps } from '../types/cart.types';

function formatCurrency(value: number): string {
  return `${CART_CURRENCY_FORMAT.SYMBOL}${value.toLocaleString(CART_CURRENCY_FORMAT.LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  ejecutando,
}: CartItemRowProps) {
  const { variant } = item;
  const productName = variant.product.item.name;
  const availableStock = variant.currentStock - variant.reservedStock;
  const unitPrice = Number(item.unitPriceSnap);
  const lineTotal = unitPrice * item.quantity;

  const handleDecrease = useCallback(() => {
    if (item.quantity <= CART_QUANTITY.MIN) return;
    void onUpdateQuantity(item.id, item.quantity - CART_QUANTITY.STEP);
  }, [item.id, item.quantity, onUpdateQuantity]);

  const handleIncrease = useCallback(() => {
    if (item.quantity >= availableStock) return;
    void onUpdateQuantity(item.id, item.quantity + CART_QUANTITY.STEP);
  }, [item.id, item.quantity, availableStock, onUpdateQuantity]);

  const handleRemove = useCallback(() => {
    void onRemove(item.id);
  }, [item.id, onRemove]);

  const canDecrease = item.quantity > CART_QUANTITY.MIN && !ejecutando;
  const canIncrease = item.quantity < availableStock && !ejecutando;

  return (
    <article
      aria-label={productName}
      className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:gap-5"
    >
      {/* Product image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-24">
        {variant.product.imageUrl != null ? (
          <Image
            src={variant.product.imageUrl}
            alt={CART_STRINGS.productImageAlt(productName)}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            {CART_STRINGS.noImage}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {productName}
            </p>
            {(variant.color != null || variant.size != null) && (
              <p className="mt-0.5 text-xs text-slate-500">
                {variant.color != null && (
                  <span>
                    {CART_STRINGS.colorLabel}: {variant.color}
                  </span>
                )}
                {variant.color != null && variant.size != null && (
                  <span className="mx-1">·</span>
                )}
                {variant.size != null && (
                  <span>
                    {CART_STRINGS.sizeLabel}: {variant.size}
                  </span>
                )}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              {CART_STRINGS.unitPrice}: {formatCurrency(unitPrice)}
            </p>
          </div>

          {/* Remove button */}
          <IconButton
            variant="danger"
            onClick={handleRemove}
            disabled={ejecutando}
            label={CART_STRINGS.removeItemAriaLabel(productName)}
            className="shrink-0"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </IconButton>
        </div>

        {/* Quantity stepper + line total */}
        <div className="flex items-center justify-between gap-2">
          <div
            role="group"
            aria-label={CART_STRINGS.quantityAriaLabel}
            className="flex items-center gap-1 rounded-md border border-border bg-muted"
          >
            <button
              type="button"
              onClick={handleDecrease}
              disabled={!canDecrease}
              aria-label={CART_STRINGS.decreaseQuantity}
              className="flex h-8 w-8 items-center justify-center rounded-l-md text-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <span
              aria-live="polite"
              aria-atomic="true"
              className="min-w-[2rem] text-center text-sm font-semibold text-foreground"
            >
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={!canIncrease}
              aria-label={CART_STRINGS.increaseQuantity}
              className="flex h-8 w-8 items-center justify-center rounded-r-md text-foreground/70 transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <p className="text-sm font-bold text-foreground">
            {formatCurrency(lineTotal)}
          </p>
        </div>
      </div>
    </article>
  );
}
