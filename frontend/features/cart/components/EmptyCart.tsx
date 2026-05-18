'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';
import { CART_STRINGS } from '../constants/cart.constants';
import type { EmptyCartProps } from '../types/cart.types';

export function EmptyCart({ onGoToCatalog }: EmptyCartProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <div
        aria-hidden="true"
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      </div>

      <h2 className="text-lg font-semibold text-slate-950">
        {CART_STRINGS.emptyTitle}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {CART_STRINGS.emptyDescription}
      </p>

      <Link
        href={ROUTES.CATALOG}
        onClick={onGoToCatalog}
        className="mt-6 inline-flex items-center rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {CART_STRINGS.emptyCtaLabel}
      </Link>
    </div>
  );
}
