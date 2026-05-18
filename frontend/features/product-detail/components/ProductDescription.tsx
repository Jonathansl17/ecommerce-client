'use client';

import { PRODUCT_DETAIL_STRINGS } from '../constants/product-detail.constants';
import type { ProductDescriptionProps } from '../types/product-detail.types';

function getTypeBadgeLabel(type: 'standard' | 'custom'): string {
  return type === 'custom'
    ? PRODUCT_DETAIL_STRINGS.typeBadgeCustom
    : PRODUCT_DETAIL_STRINGS.typeBadgeStandard;
}

function getTypeBadgeClass(type: 'standard' | 'custom'): string {
  return type === 'custom'
    ? 'bg-violet-100 text-violet-700'
    : 'bg-emerald-100 text-emerald-700';
}

export function ProductDescription({ description, type }: ProductDescriptionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {PRODUCT_DETAIL_STRINGS.descriptionLabel}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeBadgeClass(type)}`}
        >
          {getTypeBadgeLabel(type)}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  );
}
