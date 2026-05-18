'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants/routes.constants';
import { CHECKOUT_STRINGS } from '@/features/checkout/constants/checkout.constants';
import { useCheckout } from '@/features/checkout/hooks/useCheckout';
import { CheckoutForm } from '@/features/checkout/components/CheckoutForm';
import type { CheckoutPayload } from '@/features/checkout/types/checkout.types';

export default function CheckoutPage() {
  const router = useRouter();
  const { enviando, error, submit } = useCheckout();

  async function handleSubmit(payload: CheckoutPayload) {
    const orderId = await submit(payload);
    if (orderId !== null) {
      router.push(ROUTES.ORDER_DETAIL(orderId));
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">{CHECKOUT_STRINGS.pageTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{CHECKOUT_STRINGS.pageSubtitle}</p>
      </header>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <CheckoutForm enviando={enviando} error={error} onSubmit={handleSubmit} />
      </section>
    </div>
  );
}
