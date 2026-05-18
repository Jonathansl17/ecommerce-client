'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes.constants';
import { CATALOG_STRINGS, CART_ADDED_EVENT } from '../constants/catalog.constants';

interface CartAddedDetail {
  productName: string;
}

const TOAST_VISIBLE_MS = 3000;
const TOAST_FADE_MS = 300;

export function CartAddedToast() {
  const [detail, setDetail] = useState<CartAddedDetail | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onAdded(event: Event) {
      const custom = event as CustomEvent<CartAddedDetail>;
      setDetail(custom.detail);
      setVisible(true);
      const hideId = window.setTimeout(() => setVisible(false), TOAST_VISIBLE_MS);
      const clearId = window.setTimeout(
        () => setDetail(null),
        TOAST_VISIBLE_MS + TOAST_FADE_MS,
      );
      return () => {
        window.clearTimeout(hideId);
        window.clearTimeout(clearId);
      };
    }
    window.addEventListener(CART_ADDED_EVENT, onAdded as EventListener);
    return () =>
      window.removeEventListener(CART_ADDED_EVENT, onAdded as EventListener);
  }, []);

  if (detail == null) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
        ✓
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-semibold text-slate-950">
          {CATALOG_STRINGS.added}
        </p>
        <p className="text-xs text-slate-500">{detail.productName}</p>
      </div>
      <Link
        href={ROUTES.CART}
        className="ml-2 rounded-lg bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
      >
        {CATALOG_STRINGS.viewCart}
      </Link>
    </div>
  );
}
