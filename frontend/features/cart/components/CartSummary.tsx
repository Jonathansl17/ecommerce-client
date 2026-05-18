'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';
import { CART_STRINGS, CART_CURRENCY_FORMAT } from '../constants/cart.constants';
import type { CartSummaryProps } from '../types/cart.types';

function formatCurrency(value: number): string {
  return `${CART_CURRENCY_FORMAT.SYMBOL}${value.toLocaleString(CART_CURRENCY_FORMAT.LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface SummaryRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

function SummaryRow({ label, value, bold = false }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          bold
            ? 'text-sm font-bold text-slate-950'
            : 'text-sm text-slate-600'
        }
      >
        {label}
      </span>
      <span
        className={
          bold
            ? 'text-sm font-bold text-slate-950'
            : 'text-sm font-medium text-slate-950'
        }
      >
        {value}
      </span>
    </div>
  );
}

export function CartSummary({ subtotal, taxes, total }: CartSummaryProps) {
  return (
    <aside
      aria-label={CART_STRINGS.summaryTitle}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-base font-bold text-slate-950">
        {CART_STRINGS.summaryTitle}
      </h2>

      <div className="mt-4 space-y-3">
        <SummaryRow label={CART_STRINGS.subtotalLabel} value={formatCurrency(subtotal)} />
        <SummaryRow label={CART_STRINGS.taxesLabel} value={formatCurrency(taxes)} />

        <div className="border-t border-slate-200 pt-3">
          <SummaryRow label={CART_STRINGS.totalLabel} value={formatCurrency(total)} bold />
        </div>
      </div>

      <Link
        href={ROUTES.CHECKOUT}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {CART_STRINGS.checkoutCta}
      </Link>
    </aside>
  );
}
