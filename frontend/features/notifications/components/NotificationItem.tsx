'use client';

import { useCallback } from 'react';
import { NOTIFICATION_ENTITY_TYPES, NOTIFICATION_STRINGS } from '../constants/notifications.constants';
import { formatearFecha } from '../utils/formatDate';
import { parseProductCustomizationContent } from '../utils/product-customization-notification.utils';
import type { NotificationItemProps } from '../types/notifications.types';
import { DownloadReceiptLink } from './ui/DownloadReceiptLink';
import { NotificationTypeTag } from './ui/NotificationTypeTag';
import { ProductCustomizationImages } from './ui/ProductCustomizationImages';
import { UnreadDot } from './ui/UnreadDot';
import { ViewOrderLink } from './ui/ViewOrderLink';

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
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

  const borderClass =
    notification.entityType === NOTIFICATION_ENTITY_TYPES.ONBOARDING
      ? 'border-l-4 border-sky-400 dark:border-sky-500'
      : notification.entityType === NOTIFICATION_ENTITY_TYPES.ORDER
        ? 'border-l-4 border-primary'
        : esPersonalizado
          ? 'border-l-4 border-amber-400 dark:border-amber-500'
          : '';

  const bgClass = notification.read
    ? 'bg-card hover:bg-accent'
    : 'bg-accent hover:bg-accent/80';

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
      className={`px-4 py-3 cursor-pointer select-none animate-tap transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset ${bgClass} ${borderClass}`.trim()}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground truncate">
              {notification.title}
            </p>
            <NotificationTypeTag entityType={notification.entityType} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {contenidoVisible}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80">{formatearFecha(fecha)}</p>
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
        {!notification.read && <UnreadDot />}
      </div>
    </li>
  );
}
