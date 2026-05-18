'use client';

import Image from 'next/image';
import { useCallback } from 'react';
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
      className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-card sm:gap-5"
    >
      {/* Product image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-24 sm:w-24">
        {variant.product.imageUrl != null ? (
          <Image
            src={variant.product.imageUrl}
            alt={CART_STRINGS.productImageAlt(productName)}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-xs text-slate-400 dark:text-slate-500">
            {CART_STRINGS.noImage}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
              {productName}
            </p>
            {(variant.color != null || variant.size != null) && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
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
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {CART_STRINGS.unitPrice}: {formatCurrency(unitPrice)}
            </p>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={handleRemove}
            disabled={ejecutando}
            aria-label={CART_STRINGS.removeItemAriaLabel(productName)}
            className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-950 dark:hover:text-red-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Quantity stepper + line total */}
        <div className="flex items-center justify-between gap-2">
          <div
            role="group"
            aria-label={CART_STRINGS.quantityAriaLabel}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
          >
            <button
              type="button"
              onClick={handleDecrease}
              disabled={!canDecrease}
              aria-label={CART_STRINGS.decreaseQuantity}
              className="flex h-8 w-8 items-center justify-center rounded-l-xl text-slate-600 transition-colors hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              </svg>
            </button>

            <span
              aria-live="polite"
              aria-atomic="true"
              className="min-w-[2rem] text-center text-sm font-semibold text-slate-950 dark:text-slate-50"
            >
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={handleIncrease}
              disabled={!canIncrease}
              aria-label={CART_STRINGS.increaseQuantity}
              className="flex h-8 w-8 items-center justify-center rounded-r-xl text-slate-600 transition-colors hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm font-bold text-slate-950 dark:text-slate-50">
            {formatCurrency(lineTotal)}
          </p>
        </div>
      </div>
    </article>
  );
}
