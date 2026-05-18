'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/AuthContext';
import { ROUTES } from '@/lib/constants/routes.constants';
import { PRODUCT_DETAIL_QUANTITY, PRODUCT_DETAIL_STRINGS } from '../constants/product-detail.constants';
import { useAddToCart } from '../hooks/useAddToCart';
import { VariantSelector } from './VariantSelector';
import type { AddToCartFormProps, ProductDetailVariant } from '../types/product-detail.types';

function getAvailableStock(variant: ProductDetailVariant): number {
  return Math.max(0, variant.currentStock - variant.reservedStock);
}

export function AddToCartForm({ variants, onVariantChange }: AddToCartFormProps) {
  const { isAuthenticated } = useAuth();
  const { agregar, ejecutando, error, exito } = useAddToCart();

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(PRODUCT_DETAIL_QUANTITY.MIN);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;
  const maxQty = selectedVariant ? getAvailableStock(selectedVariant) : PRODUCT_DETAIL_QUANTITY.MAX;

  function handleSelectVariant(id: string): void {
    const variant = variants.find((v) => v.id === id) ?? null;
    setSelectedVariantId(id);
    setQuantity(PRODUCT_DETAIL_QUANTITY.MIN);
    onVariantChange?.(variant);
  }

  function handleDecrement(): void {
    setQuantity((prev) => Math.max(PRODUCT_DETAIL_QUANTITY.MIN, prev - PRODUCT_DETAIL_QUANTITY.STEP));
  }

  function handleIncrement(): void {
    setQuantity((prev) => Math.min(maxQty, prev + PRODUCT_DETAIL_QUANTITY.STEP));
  }

  async function handleSubmit(): Promise<void> {
    if (!selectedVariantId) return;
    await agregar(selectedVariantId, quantity);
  }

  const canAdd = selectedVariant !== null && maxQty > 0 && !ejecutando;

  return (
    <div className="flex flex-col gap-4">
      <VariantSelector
        variants={variants}
        selectedVariantId={selectedVariantId}
        onSelect={handleSelectVariant}
      />

      {selectedVariant && maxQty === 0 && (
        <p className="text-sm text-red-500">{PRODUCT_DETAIL_STRINGS.noStockSelected}</p>
      )}

      {selectedVariant && maxQty > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {PRODUCT_DETAIL_STRINGS.quantityLabel}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= PRODUCT_DETAIL_QUANTITY.MIN}
              aria-label={PRODUCT_DETAIL_STRINGS.decreaseQty}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-200"
            >
              −
            </button>
            <span
              className="min-w-[2rem] text-center text-sm font-semibold text-slate-900 dark:text-slate-50"
              aria-live="polite"
              aria-atomic="true"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= maxQty}
              aria-label={PRODUCT_DETAIL_STRINGS.increaseQty}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-200"
            >
              +
            </button>
            <span className="text-xs text-slate-400">
              {PRODUCT_DETAIL_STRINGS.stockAvailable(maxQty)}
            </span>
          </div>
        </div>
      )}

      {isAuthenticated ? (
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!canAdd}
          className="w-full rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {ejecutando ? PRODUCT_DETAIL_STRINGS.adding : PRODUCT_DETAIL_STRINGS.addToCart}
        </button>
      ) : (
        <Link
          href={ROUTES.LOGIN}
          className="block w-full rounded-xl border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {PRODUCT_DETAIL_STRINGS.loginToCart}
        </Link>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}

      {exito && (
        <div
          role="status"
          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        >
          <span className="text-sm font-medium text-emerald-700">
            {PRODUCT_DETAIL_STRINGS.addSuccess}
          </span>
          <Link
            href={ROUTES.CART}
            className="text-sm font-semibold text-emerald-700 underline hover:text-emerald-900"
          >
            {PRODUCT_DETAIL_STRINGS.viewCart}
          </Link>
        </div>
      )}
    </div>
  );
}
