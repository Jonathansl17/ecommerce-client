import prisma from '../../shared/db/prisma.js';
import {
  EMAIL_RETRY,
  NOTIFICATION_ENTITY_TYPES,
  NOTIFICATION_MESSAGES,
  NOTIFICATION_TYPES,
  ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS,
  ORDER_STATUS_NOTIFICATION_STATUS_LABELS,
} from './notifications.constants.js';
import { enviarCorreoCambioEstadoPedido } from './email/email.service.js';

function formatearFechaCambioEstado(changedAt) {
  return new Date(changedAt).toLocaleString('es-CR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function construirPayloadNotificacion({ orderId, previousStatus, newStatus, changedAt }) {
  const previousStatusLabel =
    previousStatus != null
      ? ORDER_STATUS_NOTIFICATION_STATUS_LABELS[previousStatus]
      : 'Sin estado previo';
  const newStatusLabel = ORDER_STATUS_NOTIFICATION_STATUS_LABELS[newStatus];
  const changedAtLabel = formatearFechaCambioEstado(changedAt);

  return {
    title: NOTIFICATION_MESSAGES.ORDER_STATUS_UPDATED_TITLE(orderId, newStatusLabel),
    content: NOTIFICATION_MESSAGES.ORDER_STATUS_UPDATED_CONTENT({
      previousStatusLabel,
      newStatusLabel,
      changedAtLabel,
    }),
  };
}

export function serializarOrderStatusNotification(registro) {
  return {
    id: registro.id.toString(),
    orderId: registro.orderId.toString(),
    clientUserId: registro.clientUserId.toString(),
    previousStatus: registro.previousStatus,
    newStatus: registro.newStatus,
    changedAt: registro.changedAt,
    internalNotificationId: registro.internalNotificationId?.toString() ?? null,
    deliveryStatus: registro.deliveryStatus,
    deliveryAttempts: registro.deliveryAttempts,
    deliveryLastError: registro.deliveryLastError,
    deliveredAt: registro.deliveredAt,
    createdAt: registro.createdAt,
  };
}

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function intentarEnvioCorreo({ order, clientUser, orderStatusNotificationId, previousStatus, newStatus, changedAt, subject }) {
  let deliveryAttempts = 0;
  const deliveryStartedAt = Date.now();

  while (
    deliveryAttempts < EMAIL_RETRY.MAX_ATTEMPTS &&
    Date.now() - deliveryStartedAt < EMAIL_RETRY.MAX_DELIVERY_WINDOW_MS
  ) {
    try {
      await enviarCorreoCambioEstadoPedido({
        order,
        clientUser,
        previousStatus,
        newStatus,
        changedAt,
        subject,
      });

      await prisma.orderStatusNotification.update({
        where: { id: orderStatusNotificationId },
        data: {
          deliveryStatus: ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS.SENT,
          deliveryAttempts: deliveryAttempts + 1,
          deliveredAt: new Date(),
          deliveryLastError: null,
        },
      });

      return true;
    } catch (error) {
      deliveryAttempts += 1;

      await prisma.orderStatusNotification.update({
        where: { id: orderStatusNotificationId },
        data: {
          deliveryStatus: ORDER_STATUS_NOTIFICATION_DELIVERY_STATUS.FAILED,
          deliveryAttempts,
          deliveryLastError: error?.message ?? NOTIFICATION_MESSAGES.EMAIL_UNKNOWN_ERROR,
        },
      });

      console.warn(
        `[ORDER_STATUS_NOTIFICATION] Email delivery attempt ${deliveryAttempts}/${EMAIL_RETRY.MAX_ATTEMPTS} failed for order #${order.id}.`,
        { errorMessage: error?.message ?? NOTIFICATION_MESSAGES.EMAIL_UNKNOWN_ERROR },
      );

      if (deliveryAttempts < EMAIL_RETRY.MAX_ATTEMPTS) {
        await esperar(EMAIL_RETRY.RETRY_BASE_DELAY_MS * Math.pow(2, deliveryAttempts - 1));
      }
    }
  }

  return false;
}

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

export async function despacharOrderStatusNotification({ orderStatusNotificationId, order, previousStatus, newStatus, changedAt }) {
  const { title } = construirPayloadNotificacion({
    orderId: order.id,
    previousStatus,
    newStatus,
    changedAt,
  });

  const delivered = await intentarEnvioCorreo({
    order,
    clientUser: order.clientUser,
    orderStatusNotificationId,
    previousStatus,
    newStatus,
    changedAt,
    subject: title,
  });

  if (!delivered) {
    console.error('[ORDER_STATUS_NOTIFICATION] Email delivery failed after retries.', {
      orderId: order.id.toString(),
      clientEmail: order.clientUser.email,
      previousStatus,
      newStatus,
    });
  }
}

export async function obtenerOrderStatusNotificationHistory({ orderId, clientUserId }) {
  const registros = await prisma.orderStatusNotification.findMany({
    where: {
      orderId,
      clientUserId,
    },
    orderBy: { changedAt: 'desc' },
  });

  return registros.map(serializarOrderStatusNotification);
}
