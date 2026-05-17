import {
  NOTIFICATION_ENTITY_TYPES,
  NOTIFICATION_TYPES,
} from '../notifications.constants.js';
import { ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS } from './constants.js';
import { construirPayloadNotificacion } from './payload.utils.js';

export async function registrarOrderStatusNotification({ tx, order, previousStatus, newStatus, changedAt = new Date() }) {
  const notificationPayload = construirPayloadNotificacion({
    orderId: order.id,
    previousStatus,
    newStatus,
    changedAt,
  });

  const internalNotification = await tx.clientNotification.create({
    data: {
      clientUserId: order.clientUser.id,
      type: NOTIFICATION_TYPES.BOTH,
      title: notificationPayload.title,
      content: notificationPayload.content,
      entityType: NOTIFICATION_ENTITY_TYPES.ORDER,
      entityId: order.id,
      read: false,
    },
  });

  return tx.orderStatusNotification.create({
    data: {
      orderId: order.id,
      clientUserId: order.clientUser.id,
      previousStatus,
      newStatus,
      changedAt,
      internalNotificationId: internalNotification.id,
      deliveryStatus: ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS.PENDING,
    },
  });
}
