import prisma from '../../../shared/db/prisma.js';
import {
  NOTIFICATION_ENTITY_TYPES,
  NOTIFICATION_TYPES,
} from '../notifications.constants.js';
import {
  CANCELLATION_NOTIFICATION_MESSAGES,
  CANCELLATION_REASON_LABELS,
} from './constants.js';

function construirContenido({ cancelationReason, supportEmail }) {
  const reason =
    CANCELLATION_REASON_LABELS[cancelationReason] ?? CANCELLATION_NOTIFICATION_MESSAGES.DEFAULT_REASON;
  return CANCELLATION_NOTIFICATION_MESSAGES.CONTENT({ reason, supportEmail });
}

export async function crearNotificacionCancelacion({ clientUserId, orderId, cancelationReason, supportEmail }) {
  return prisma.clientNotification.create({
    data: {
      clientUserId,
      type: NOTIFICATION_TYPES.BOTH,
      title: CANCELLATION_NOTIFICATION_MESSAGES.TITLE(orderId),
      content: construirContenido({ cancelationReason, supportEmail }),
      entityType: NOTIFICATION_ENTITY_TYPES.ORDER,
      entityId: orderId,
      read: false,
    },
  });
}
