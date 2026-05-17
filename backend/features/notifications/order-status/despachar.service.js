import { construirPayloadNotificacion, intentarEnvioCorreoOrderStatus } from './payload.utils.js';

export async function despacharOrderStatusNotification({ orderStatusNotificationId, order, previousStatus, newStatus, changedAt }) {
  const { title } = construirPayloadNotificacion({
    orderId: order.id,
    previousStatus,
    newStatus,
    changedAt,
  });

  const delivered = await intentarEnvioCorreoOrderStatus({
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
