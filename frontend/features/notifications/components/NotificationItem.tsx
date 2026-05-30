'use client';

import { useCallback } from 'react';
import { X } from 'lucide-react';
import { NOTIFICATION_ENTITY_TYPES, NOTIFICATION_STRINGS } from '../constants/notifications.constants';
import { formatearFecha } from '../utils/formatDate';
import { parseProductCustomizationContent } from '../utils/product-customization-notification.utils';
import type { NotificationItemProps } from '../types/notifications.types';
import { DownloadReceiptLink } from './ui/DownloadReceiptLink';
import { NotificationTypeTag } from './ui/NotificationTypeTag';
import { ProductCustomizationImages } from './ui/ProductCustomizationImages';
import { UnreadDot } from './ui/UnreadDot';
import { ViewOrderLink } from './ui/ViewOrderLink';

export function NotificationItem({ notification, onRead, onDismiss }: NotificationItemProps) {
  const fecha = notification.sentAt ?? notification.createdAt;
  const mostrarLinkPedido =
    notification.entityType === NOTIFICATION_ENTITY_TYPES.ORDER && notification.entityId != null;
  const mostrarLinkComprobante =
    notification.entityType === NOTIFICATION_ENTITY_TYPES.PAYMENT && notification.entityId != null;
  const esPersonalizado =
    notification.entityType === NOTIFICATION_ENTITY_TYPES.PRODUCT_CUSTOMIZATION;

  const productCustomizationData = esPersonalizado
    ? parseProductCustomizationContent(notification.content)
    : null;

  const contenidoVisible = productCustomizationData?.message ?? notification.content;

  const borderClass = '';

  const bgClass = notification.read
    ? 'bg-card hover:bg-accent/50'
    : 'bg-accent/60 hover:bg-accent/80';

  const handleClick = useCallback(() => {
    if (!notification.read) onRead(notification.id);
  }, [notification.read, notification.id, onRead]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <li
      role="menuitem"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={
        notification.read
          ? notification.title
          : `${NOTIFICATION_STRINGS.markAsRead}: ${notification.title}`
      }
      className={`group px-4 py-3.5 cursor-pointer select-none animate-tap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${bgClass} ${borderClass}`.trim()}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 space-y-1.5">

          {/* Fila 1: título + tag + fecha */}
          <div className="flex items-start gap-2">
            <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-semibold text-foreground leading-tight">
                {notification.title}
              </p>
              <NotificationTypeTag entityType={notification.entityType} />
            </div>
            <span className="shrink-0 text-[10px] text-muted-foreground/50 mt-0.5 whitespace-nowrap">
              {formatearFecha(fecha)}
            </span>
          </div>

          {/* Fila 2: contenido */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {contenidoVisible}
          </p>

          {/* Fila 3: acciones */}
          {mostrarLinkPedido && <ViewOrderLink orderId={notification.entityId as string} />}
          {mostrarLinkComprobante && (
            <DownloadReceiptLink paymentId={notification.entityId as string} />
          )}
          {esPersonalizado && notification.entityId != null && (
            <ViewOrderLink orderId={notification.entityId as string} />
          )}
          {esPersonalizado && productCustomizationData && productCustomizationData.images.length > 0 && (
            <ProductCustomizationImages images={productCustomizationData.images} />
          )}

        </div>
        {notification.read ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
            aria-label={NOTIFICATION_STRINGS.dismissAriaLabel}
            className="shrink-0 rounded-md p-0.5 text-muted-foreground/40 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <UnreadDot />
        )}
      </div>
    </li>
  );
}
