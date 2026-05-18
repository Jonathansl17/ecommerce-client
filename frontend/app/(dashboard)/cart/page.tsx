'use client';

import { useCallback } from 'react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useCartMutations } from '@/features/cart/hooks/useCartMutations';
import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { EmptyCart } from '@/features/cart/components/EmptyCart';
import { CART_STRINGS } from '@/features/cart/constants/cart.constants';

export default function CartPage() {
  const { cart, cargando, error, recargar } = useCart();

  const { actualizarCantidad, eliminarItem, ejecutando, error: mutationError } =
    useCartMutations(recargar);

  const handleUpdateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      await actualizarCantidad(itemId, quantity);
    },
    [actualizarCantidad],
  );

  const handleRemove = useCallback(
    async (itemId: string) => {
      await eliminarItem(itemId);
    },
    [eliminarItem],
  );

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500 dark:text-slate-400">{CART_STRINGS.loading}</p>
      </div>
    );
  }

  if (error != null) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-50">
          {CART_STRINGS.pageTitle}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          {CART_STRINGS.pageSubtitle}
        </p>
      </header>

      {mutationError != null && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
        >
          {mutationError}
        </div>
      )}

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Items list */}
          <section
            aria-label={CART_STRINGS.pageTitle}
            className="space-y-4 lg:col-span-2"
          >
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                ejecutando={ejecutando}
              />
            ))}
          </section>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={Number(cart!.subtotal)}
              taxes={Number(cart!.taxes)}
              total={Number(cart!.total)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
